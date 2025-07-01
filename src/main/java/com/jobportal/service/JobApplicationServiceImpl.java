package com.jobportal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;
import com.jobportal.repository.JobApplicationRepository;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public JobApplication add(JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }

    @Override
    public JobApplication update(JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }

    @Override
    public JobApplication getById(int jobApplicationId) {
        return jobApplicationRepository.findById(jobApplicationId).orElse(null);
    }

    @Override
    public List<JobApplication> getAll() {
        return jobApplicationRepository.findAll();
    }

    @Override
    public List<JobApplication> getByEmployee(User employee) {
        return jobApplicationRepository.findByEmployee(employee);
    }

    @Override
    public List<JobApplication> getByJob(Job job) {
        return jobApplicationRepository.findByJob(job);
    }

    @Override
    public List<JobApplication> getByEmployeeAndStatus(User employee, List<String> status) {
        return jobApplicationRepository.findByEmployeeAndStatusIn(employee, status);
    }

    // ✅ New method: Get job applications by employer ID
    @Override
    public List<JobApplication> getApplicationsByEmployer(int employerId) {
        return jobApplicationRepository.findByJob_Employer_Id(employerId);
    }

    // ✅ New method: Update application status and send email
    @Override
    public JobApplication updateApplicationStatus(int applicationId, String newStatus) {
        System.out.println(">>> [updateApplicationStatus] Called with ID: " + applicationId + ", New Status: " + newStatus);

        JobApplication app = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(newStatus);
        jobApplicationRepository.save(app);

        // Prepare email
        User employee = app.getEmployee();
        String recipientEmail = employee.getEmailId();
        String jobTitle = app.getJob().getTitle();

        String subject = "Job Application Status Update";
        String body = "Hi " + employee.getFirstName() + ",\n\n"
                + "Your application for the position '" + jobTitle + "' has been "
                + newStatus.toLowerCase() + ".\n\n"
                + "Best regards,\nJob Portal Team";

        // Send email
        try {
            emailService.sendEmail(recipientEmail, subject, body);
            System.out.println(">>> Email sent successfully to: " + recipientEmail);
        } catch (Exception e) {
            System.err.println(">>> Failed to send email to: " + recipientEmail + ". Error: " + e.getMessage());
        }

        return app;
    }
}
