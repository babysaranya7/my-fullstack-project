import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const employerId = localStorage.getItem("userId"); // adjust if you store it differently

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/job/application/employer/${employerId}`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [employerId]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/job/application/${applicationId}/status`,
        null,
        {
          params: { status: newStatus },
        }
      );

      // Update UI immediately
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  if (applications.length === 0) return <p>No applications found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
      {applications.map((app) => (
        <div
          key={app.id}
          className="border rounded-lg p-4 mb-4 shadow-md bg-white"
        >
          <p>
            <strong>Job Title:</strong> {app.job?.title}
          </p>
          <p>
            <strong>Applicant:</strong> {app.employee?.firstName}{" "}
            {app.employee?.lastName}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                app.status === "PENDING"
                  ? "text-yellow-600"
                  : app.status === "ACCEPTED"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {app.status}
            </span>
          </p>

          {app.status === "PENDING" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployerApplicationsPage;
