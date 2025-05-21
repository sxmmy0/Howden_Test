import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JobsPage({ userId }) {
  const [jobs, setJobs] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/jobs", {
        params: {
          view_all: viewAll,
          user_id: userId,
        },
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [viewAll]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-600">Job Queue</h1>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={viewAll}
              onChange={() => setViewAll(!viewAll)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">View all users' jobs</span>
          </label>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="p-3">Job ID</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.jobId} className="border-t">
                    <td className="p-3">{job.jobId || "-"}</td>
                    <td className="p-3">{job.createdBy || "-"}</td>
                    <td className="p-3">{job.status || "-"}</td>
                    <td className="p-3">{job.createdAt || "-"}</td>
                    <td className="p-3">
                      {job.details ? (
                        job.details.startsWith("/download/") ? (
                          <a
                            href={`http://localhost:8000${job.details}`}
                            download
                            className="text-blue-600 underline"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-red-600">{job.details}</span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-3 text-gray-500">
                      No jobs to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
