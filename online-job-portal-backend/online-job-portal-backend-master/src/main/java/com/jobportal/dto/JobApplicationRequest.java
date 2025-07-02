package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;

public class JobApplicationRequest {

    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotNull(message = "Job ID is required")
    private Integer jobId;

    public JobApplicationRequest() {
    }

    public JobApplicationRequest(Integer employeeId, Integer jobId) {
        this.employeeId = employeeId;
        this.jobId = jobId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    @Override
    public String toString() {
        return "JobApplicationRequest{" +
                "employeeId=" + employeeId +
                ", jobId=" + jobId +
                '}';
    }
}
