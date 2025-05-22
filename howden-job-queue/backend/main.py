from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_PATH = "HowdenTest.xlsx"
JOBS_DF = None

def normalize_columns(df):
    df.columns = [col.strip().replace(" ", "").lower() for col in df.columns]
    return df

def safe_get(row, key):
    return row.get(key) if pd.notna(row.get(key)) else None

@app.on_event("startup")
def load_excel_data():
    global JOBS_DF
    try:
        sheet1 = normalize_columns(pd.read_excel(EXCEL_PATH, sheet_name=0))
        sheet2 = normalize_columns(pd.read_excel(EXCEL_PATH, sheet_name=1))
        sheet3 = normalize_columns(pd.read_excel(EXCEL_PATH, sheet_name=2))

        print("Sheet 1 columns:", sheet1.columns.tolist())
        print("Sheet 2 columns:", sheet2.columns.tolist())
        print("Sheet 3 columns:", sheet3.columns.tolist())

        JOBS_DF = pd.concat([sheet1, sheet2], ignore_index=True)

    except Exception as e:
        print(f"Error loading Excel file: {e}")
        JOBS_DF = pd.DataFrame()

@app.get("/jobs")
def get_jobs(view_all: bool = Query(False), user_id: str = Query("user_123")):
    if JOBS_DF is None or JOBS_DF.empty:
        raise HTTPException(status_code=500, detail="Job data not loaded")

    df = JOBS_DF.copy()
    if not view_all:
        # Case-insensitive email match
        df = df[df["submittedby"].str.strip().str.lower() == user_id.strip().lower()]

    jobs = []
    for _, row in df.iterrows():
        details = None
        if pd.notna(row.get("errormessage")):
            details = row["errormessage"]
        elif pd.notna(row.get("outputresult")):
            filename = row["outputresult"]
            details = f"/download/{filename}"

        jobs.append({
            "jobId": safe_get(row, "name"),
            "createdBy": safe_get(row, "submittedby"),
            "status": safe_get(row, "status"),
            "createdAt": str(safe_get(row, "submittime")) if safe_get(row, "submittime") else None,
            "details": details
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