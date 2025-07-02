import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import dollor from "../images/dollor_logo.png";
import timing from "../images/timing_logo.png";
import experience from "../images/experience_logo.png";
import { ToastContainer, toast } from "react-toastify";

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employer = JSON.parse(sessionStorage.getItem("active-employer")); // new
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  const [job, setJob] = useState({
    id: "",
    employer: null,
    title: "",
    description: "",
    category: {
      id: "",
      name: "",
      description: "",
      status: "",
    },
    companyName: "",
    companyLogo: "",
    address: {
      id: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
    },
    jobType: "",
    salaryRange: "",
    experienceLevel: "",
    requiredSkills: "",
    status: "",
    datePosted: "",
    applicationCount: "",
  });

  useEffect(() => {
    const getJob = async () => {
      const fetchJobResponse = await retrieveJob();
      if (fetchJobResponse) {
        setJob(fetchJobResponse.jobs[0]);
      }
    };
    getJob();
  }, []);

  const retrieveJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/job/fetch?jobId=${jobId}`
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching job:", err);
      toast.error("Failed to fetch job details", { autoClose: 1000 });
    }
  };

  const isTokenValid = (token) => {
    if (!token || token.split(".").length !== 3) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return payload.exp && payload.exp > now;
    } catch (err) {
      console.error("Invalid token format:", err);
      return false;
    }
  };

  const applyForJob = (jobId, e) => {
    e.preventDefault();

    if (!employee_jwtToken || !isTokenValid(employee_jwtToken)) {
      toast.error("Please login again. Session expired or invalid.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const payload = {
      employeeId: employee.id,
      jobId: jobId,
    };

    fetch("http://localhost:8080/api/job/application/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${employee_jwtToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((result) =>
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, { autoClose: 1000 });
            setTimeout(() => navigate("/home"), 1000);
          } else {
            toast.error(res.responseMessage || "Something went wrong", {
              autoClose: 1000,
            });
            setTimeout(() => window.location.reload(), 1000);
          }
        })
      )
      .catch((error) => {
        console.error("Application error:", error);
        toast.error("Server error. Please try again later.", {
          autoClose: 1000,
        });
      });
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  return (
    <div className="mb-3">
      <div className="col ml-5 mt-3 ms-5 me-5">
        <div className="card rounded-card h-100 shadow-lg">
          <div className="row g-0">
            <div className="col-md-6">
              <div className="card-body">
                <h4 className="card-title text-color-second">Company Details</h4>
                <div className="row g-0">
                  <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <img
                      src={
                        job.companyLogo?.startsWith("http")
                          ? job.companyLogo
                          : `http://localhost:8080/api/job/${job.companyLogo}`
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-company-logo.png";
                      }}
                      className="card-img-top rounded img-fluid"
                      alt="Company Logo"
                      style={{ maxHeight: "100px", width: "auto" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body text-color">
                      <h3 className="card-title text-color-second">
                        <b>{job.companyName || "N/A"}</b>
                      </h3>
                      <b className="card-text">
                        {job.address?.street || ""} {job.address?.city || ""}{" "}
                        {job.address?.pincode || ""}
                      </b>
                      <br />
                      <b className="card-text">
                        {job.address?.state || ""} {job.address?.country || ""}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employer Details */}
            <div className="col-md-6">
              <div className="card-body">
                <h4 className="card-title text-color-second">Employer Details</h4>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>First Name:</b> {job.employer?.firstName || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Last Name:</b> {job.employer?.lastName || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Email Id:</b> {job.employer?.emailId || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <b>Contact:</b> {job.employer?.phoneNo || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="row mt-3">
          <div className="col">
            <div className="card rounded-card h-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-color-second">Job Details</h3>
                <div className="row mt-4 ms-4 me-4">
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Job Title:</b> {job.title}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Job Description:</b> {job.description}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Job Category:</b> {job.category?.name}
                    </p>
                  </div>
                </div>

                <div className="row mt-4 ms-4 me-4">
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>
                        <img src={timing} height="30" className="me-2" alt="" />
                        {job.jobType}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>
                        <img src={dollor} height="25" className="me-2" alt="" />
                        {job.salaryRange}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>
                        <img src={experience} height="28" className="me-2" alt="" />
                        {job.experienceLevel}
                      </b>
                    </p>
                  </div>
                </div>

                <div className="row mt-4 ms-4 me-4">
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Required Skills:</b> {job.requiredSkills}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Date Posted:</b>{" "}
                      {job.datePosted ? formatDateFromEpoch(job.datePosted) : "N/A"}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="mb-2">
                      <b>Applicants:</b> {job.applicationCount}
                    </p>
                  </div>
                </div>

                {/* Apply button - visible only to employees */}
                {employee && !employer && (
                  <div className="d-flex justify-content-center mt-4">
                    <button
                      type="button"
                      className="btn bg-color custom-bg-text mb-3"
                      onClick={(e) => applyForJob(job.id, e)}
                    >
                      Apply for Job
                    </button>
                    <ToastContainer />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
