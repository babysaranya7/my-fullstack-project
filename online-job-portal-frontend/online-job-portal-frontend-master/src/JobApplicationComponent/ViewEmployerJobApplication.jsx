import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const ViewEmployerJobApplication = () => {
  const employer = JSON.parse(sessionStorage.getItem("active-employer"));
  const employer_jwtToken = sessionStorage.getItem("employer-jwtToken");

  const [assignApplicationId, setAssignApplicationId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [showModal, setShowSkillModal] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState([]);

  const navigate = useNavigate();

  const handleClose = () => setShowSkillModal(false);
  const handleShow = () => setShowSkillModal(true);

  const updateApplicationStatus = (applicationId) => {
    setAssignApplicationId(applicationId);
    handleShow();
  };

  const retrieveAllStatus = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/helper/job/application/status/fetch/all"
    );
    return response.data;
  };

  useEffect(() => {
    const getAllJobApplicationsStatus = async () => {
      const res = await retrieveAllStatus();
      if (res) {
        setApplicationStatuses(res);
      }
    };
    getAllJobApplicationsStatus();
  }, []);

  const retrieveAllJobApplication = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/job/application/fetch/employer/${employer.id}`,
      {
        headers: {
          Authorization: "Bearer " + employer_jwtToken,
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    const getAllJobs = async () => {
      const jobApplicationResponse = await retrieveAllJobApplication();
      if (jobApplicationResponse) {
        setApplications(jobApplicationResponse.applications);
      }
    };
    getAllJobs();
  }, []);

  const updateJobApplicationStatus = (e) => {
    e.preventDefault();

    if (!assignApplicationId || !applicationStatus) {
      toast.error("Missing input for updating the application status", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const putData = {
      id: assignApplicationId,
      status: applicationStatus,
    };

    fetch("http://localhost:8080/api/job/application/update/status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          toast.error(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
        }
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      })
      .catch(() => {
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  const viewEmployeeProfile = (employee) => {
    navigate("/employee/profile/detail", { state: employee });
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "45rem" }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px" }}
        >
          <h2>All Job Applications</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Company Name</th>
                  <th>Company</th>
                  <th>Job</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Employee</th>
                  <th>Location</th>
                  <th>Application Id</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, index) => (
                  <tr key={application.id || index}>
                    <td><b>{application.job.companyName}</b></td>
                    <td>
                      <img
                        src={
                          "http://localhost:8080/api/job/" +
                          application.job.companyLogo
                        }
                        className="img-fluid"
                        alt="company_pic"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/job/${application.job.id}/detail`}
                        className="text-color"
                        style={{ textDecoration: "none" }}
                      >
                        <b>{application.job.title}</b>
                      </Link>
                    </td>
                    <td><b>{application.job.category.name}</b></td>
                    <td><b>{application.job.jobType}</b></td>
                    <td>
                      <b
                        className="text-color"
                        onClick={() => viewEmployeeProfile(application.employee)}
                        style={{ cursor: "pointer" }}
                      >
                        {application.employee?.firstName || "N/A"}{" "}
                        {application.employee?.lastName || ""}
                      </b>
                    </td>
                    <td><b>{application.job.address.city}</b></td>
                    <td><b>{application.applicationId}</b></td>
                    <td><b>{formatDateFromEpoch(application.dateTime)}</b></td>
                    <td><b>{application.status}</b></td>
                    <td>
                      {application.status === "Applied" && (
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm bg-color custom-bg-text mb-3"
                            onClick={() => updateApplicationStatus(application.id)}
                          >
                            Update Status
                          </button>
                          <ToastContainer />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for updating status */}
      <Modal show={showModal} onHide={handleClose} size="md">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Update Application Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form>
              <div className="mb-3">
                <label className="form-label">
                  <b>Application Status</b>
                </label>
                <select
                  name="status"
                  onChange={(e) => setApplicationStatus(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select Application Status</option>
                  {applicationStatuses.map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <button
                  type="button"
                  onClick={updateJobApplicationStatus}
                  className="btn bg-color custom-bg-text"
                >
                  Update Status
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewEmployerJobApplication;
