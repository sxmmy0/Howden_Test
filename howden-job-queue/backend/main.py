from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import os

app = FastAPI()

# Allow React frontend to call this API (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for all origins (not secure for prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load job data once at startup
EXCEL_PATH = "HowdenTest.xlsx"  # Make sure HowdenTest.xlsx is renamed or copied here
JOBS_DF = None

@app.on_event("startup")
def load_excel_data():
    global JOBS_DF
    try:
        # You can load specific sheets or combine them
        sheet1 = pd.read_excel(EXCEL_PATH, sheet_name=0)
        sheet2 = pd.read_excel(EXCEL_PATH, sheet_name=1)

        JOBS_DF = pd.concat([sheet1, sheet2], ignore_index=True)
        print("Sheet 1 columns:", sheet1.columns.tolist())
        print("Sheet 2 columns:", sheet2.columns.tolist())

    except Exception as e:
        print(f"Error loading Excel file: {e}")
        JOBS_DF = pd.DataFrame()


@app.get("/jobs")
def get_jobs(view_all: bool = Query(False), user_id: str = Query("user_123")):
    if JOBS_DF is None or JOBS_DF.empty:
        raise HTTPException(status_code=500, detail="Job data not loaded")

    # Example column: 'createdBy' — filter by user unless view_all is True
    df = JOBS_DF.copy()
    if not view_all:
        df = df[df["createdBy"] == user_id]

    # Transform data into list of dicts, add logic for detail column
    jobs = []
    for _, row in df.iterrows():
        details = None
        if pd.notna(row.get("errorMessage")):
            details = row["errorMessage"]
        elif pd.notna(row.get("outputResponse")):
            filename = row["outputResponse"]
            details = f"/download/{filename}"

        jobs.append({
            "workFlowId": row.get("workFlowId"),
            "submittedBy": row.get("submittedBy"),
            "statusMessage": row.get("statusMessage"),
            "createdAt": str(row.get("createdAt")),
            "details": details,
        })

    return {"jobs": jobs}

@app.get("/download/{filename}")
def download_output_file(filename: str):
    file_path = os.path.join("data", "responses", filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=file_path, filename=filename, media_type="application/octet-stream")

@app.get("/")
def root():
    return {"message": "Backend is running!"}