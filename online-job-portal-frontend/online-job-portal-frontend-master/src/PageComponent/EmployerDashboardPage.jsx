import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const EmployerDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const employer = JSON.parse(sessionStorage.getItem("active-employer"));

  useEffect(() => {
    if (!employer) {
      navigate("/login");
      return;
    }

    // Fetch jobs posted by the current employer
    axios
      .get(`http://localhost:8080/job/employer/${employer.id}`)
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching employer jobs:", err);
      });
  }, [employer, navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Welcome, {employer?.companyName}!</h2>

      {/* 🔗 Global link to view all applications */}
      <div className="mb-4">
        <Link
          to="/employer/applications"
          className="text-blue-600 hover:underline font-semibold"
        >
          View Applications
        </Link>
      </div>

      <h4>Your Posted Jobs</h4>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Applicants</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.category}</td>
                <td>{job.location}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/employer/job/${job.id}/applicants`)
                    }
                  >
                    View Applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployerDashboardPage;
