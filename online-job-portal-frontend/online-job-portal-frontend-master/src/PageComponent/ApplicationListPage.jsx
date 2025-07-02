import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationListPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const employer = JSON.parse(sessionStorage.getItem("active-employer"));

    if (!employer) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8080/application/job/${jobId}`)
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      });
  }, [jobId, navigate]);

  return (
    <div className="container mt-4">
      <h3>Applicants for Job ID: {jobId}</h3>
      {applications.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.employee?.name}</td>
                <td>{app.employee?.email}</td>
                <td>{app.employee?.skills || "N/A"}</td>
                <td>
                  {app.resumeUrl ? (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  ) : (
                    "Not uploaded"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationListPage;
