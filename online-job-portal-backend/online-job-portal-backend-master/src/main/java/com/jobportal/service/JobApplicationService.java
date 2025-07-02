package com.jobportal.service;

import java.util.List;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;

public interface JobApplicationService {

    JobApplication add(JobApplication application);

    JobApplication update(JobApplication application);

    JobApplication getById(int id);

    List<JobApplication> getAll();

    List<JobApplication> getByEmployee(User employee);

    List<JobApplication> getByJob(Job job);

    List<JobApplication> getByEmployeeAndStatus(User employee, List<String> status);

    // ✅ Fetch applications by employer ID
    List<JobApplication> getApplicationsByEmployer(int employerId);

    // ✅ Update job application status and send email
    JobApplication updateApplicationStatus(int applicationId, String newStatus);
}
