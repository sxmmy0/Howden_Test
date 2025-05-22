import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export default function JobsPage({ userId }) {
  const [jobs, setJobs] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
      setCurrentPage(1); // reset to first page after toggle
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

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter and sort jobs based on search and sort settings
  const filteredJobs = jobs
    .filter((job) => {
      const searchLower = search.toLowerCase();
      return (
        String(job.jobId ?? "").toLowerCase().includes(searchLower) ||
        String(job.createdBy ?? "").toLowerCase().includes(searchLower) ||
        String(job.status ?? "").toLowerCase().includes(searchLower) ||
        String(job.createdAt ?? "").toLowerCase().includes(searchLower) ||
        String(job.details ?? "").toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const getVal = (item) => {
        const raw = String(item[sortKey] ?? "").toLowerCase();

        // If sorting jobId, extract numeric value for natural sort
        if (sortKey === "jobId") {
          const num = raw.match(/\d+/);
          return num ? parseInt(num[0], 10) : 0;
        }

        return raw;
      };

      const aVal = getVal(a);
      const bVal = getVal(b);

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : aVal < bVal
          ? -1
          : 0
        : aVal < bVal
        ? 1
        : aVal > bVal
        ? -1
        : 0;
    });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusTag = (status) => {
    const lower = typeof status === "string" ? status.toLowerCase() : "";
    if (lower.includes("success")) return <span className="text-green-600">✅ Success</span>;
    if (lower.includes("fail")) return <span className="text-red-600">❌ Failed</span>;
    return <span className="text-yellow-600">⏳ Pending</span>;
 };

  const handleLogout = () => {
    navigate("/");
    window.location.reload(); // clear state
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-600">Job Queue</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-xl hover:bg-red-600 transition text-sm"
          >
            Log Out
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={viewAll}
              onChange={() => setViewAll(!viewAll)}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">View all users' jobs</span>
          </label>

          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-1 text-sm w-64"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    {["jobId", "createdBy", "status", "createdAt", "details"].map((key) => {
                      const label =
                        key === "jobId"
                          ? "Job ID"
                          : key === "createdAt"
                          ? "Created At"
                          : key.charAt(0).toUpperCase() + key.slice(1);

                      const isActive = key === sortKey;
                      const arrow = isActive ? (sortOrder === "asc" ? "↑" : "↓") : "";

                      return (
                        <th
                          key={key}
                          onClick={() => key !== "details" && handleSort(key)}
                          className={`p-3 cursor-pointer select-none ${
                            isActive ? "font-bold text-blue-700" : ""
                          }`}
                        >
                          {label} {arrow}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {displayedJobs.map((job) => (
                    <tr key={job.jobId} className="border-t">
                      <td className="p-3">{job.jobId || "-"}</td>
                      <td className="p-3">{job.createdBy || "-"}</td>
                      <td className="p-3">{getStatusTag(job.status)}</td>
                      <td className="p-3">{job.createdAt || "-"}</td>
                      <td className="p-3">
                        {job.details ? (
                          job.details.startsWith("/download/") ? (
                            <a
                              href={`http://localhost:8000${job.details}`}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-red-600">{job.details}</span>
                          )
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
