package com.jobportal.resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import com.jobportal.dto.CommonApiResponse;
import com.jobportal.dto.JobApplicationRequest;
import com.jobportal.dto.JobApplicationResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;
import com.jobportal.exception.JobApplicationSaveException;
import com.jobportal.repository.JobApplicationRepository;
import com.jobportal.service.EmailService;
import com.jobportal.service.JobApplicationService;
import com.jobportal.service.JobService;
import com.jobportal.service.UserService;
import com.jobportal.utility.Constants.JobApplicationStatus;
import com.jobportal.utility.Helper;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/job/application")
public class JobApplicationResource {

    private static final Logger LOG = LoggerFactory.getLogger(JobApplicationResource.class);

    @Autowired
    private JobService jobService;

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/apply")
    @Operation(summary = "API to apply for a job")
    public ResponseEntity<CommonApiResponse> applyToJob(@RequestBody JobApplicationRequest request) {
        LOG.info("📥 Apply to job request received");

        CommonApiResponse response = new CommonApiResponse();

        if (request == null || request.getJobId() == 0 || request.getEmployeeId() == 0) {
            return buildBadRequest(response, "Missing input data");
        }

        Job job = jobService.getById(request.getJobId());
        if (job == null) return buildBadRequest(response, "Job not found");

        User employee = userService.getUserById(request.getEmployeeId());
        if (employee == null) return buildBadRequest(response, "Employee not found");

        boolean alreadyApplied = jobApplicationService.getByEmployee(employee).stream()
                .anyMatch(app -> app.getJob().getId() == request.getJobId());

        if (alreadyApplied) {
            response.setResponseMessage("You have already applied to this job");
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        JobApplication newApplication = new JobApplication();
        newApplication.setEmployee(employee);
        newApplication.setJob(job);
        newApplication.setStatus(JobApplicationStatus.APPLIED.value());
        newApplication.setApplicationId(Helper.generateApplicationId());
        newApplication.setDateTime(String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));

        JobApplication saved = jobApplicationService.add(newApplication);
        if (saved == null) throw new JobApplicationSaveException("Failed to save job application");

        job.setApplicationCount(job.getApplicationCount() + 1);
        if (jobService.update(job) == null) {
            throw new JobApplicationSaveException("Failed to update application count");
        }

        response.setResponseMessage("Job applied successfully");
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update-status")
    public ResponseEntity<CommonApiResponse> updateJobApplicationStatus(@RequestBody JobApplication request) {
        LOG.info("📥 Update job application status for ID: {}", request != null ? request.getId() : "null");
        LOG.info("🎯 Updating status to: {}", request.getStatus());
        CommonApiResponse response = new CommonApiResponse();

        if (request == null || request.getId() == 0 || request.getStatus() == null) {
            response.setResponseMessage("Missing application ID or status");
            response.setSuccess(false);
            return ResponseEntity.badRequest().body(response);
        }

        Optional<JobApplication> optionalApp = jobApplicationRepository.findWithEmployeeAndJobById(request.getId());
        if (optionalApp.isPresent()) {
            JobApplication jobApp = optionalApp.get();
            jobApp.setStatus(request.getStatus());
            jobApplicationRepository.save(jobApp);

            // ✅ Email Notification
            String email = jobApp.getEmployee().getEmailId();
            String subject = "Your Job Application Status Has Been Updated";
            String message = String.format("Hello %s,\n\nYour application for the job '%s' has been %s.",
                    jobApp.getEmployee().getName(),
                    jobApp.getJob().getTitle(),
                    request.getStatus());

            LOG.info("📧 Attempting to send email to {} with subject: {}", email, subject);
            try {
                emailService.sendEmail(email, subject, message);
                LOG.info("✅ Email sent successfully to {}", email);
            } catch (Exception e) {
                LOG.error("❌ Failed to send email to {}: {}", email, e.getMessage(), e);
            }

            response.setResponseMessage("Status updated and email sent to employee.");
            response.setSuccess(true);
        } else {
            response.setResponseMessage("Job application not found.");
            response.setSuccess(false);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/fetch/all")
    public ResponseEntity<JobApplicationResponse> fetchAllJobApplications() {
        LOG.info("📤 Fetch all job applications");
        List<JobApplication> applications = jobApplicationService.getAll();
        return buildApplicationResponse(applications, "Job Applications");
    }

    @GetMapping("/fetch/employee/{employeeId}")
    public ResponseEntity<JobApplicationResponse> fetchAllJobApplicationsByEmployee(@PathVariable int employeeId) {
        LOG.info("📤 Fetch job applications by employeeId: {}", employeeId);
        if (employeeId == 0) return buildAppBadRequest("Employee ID missing");
        User employee = userService.getUserById(employeeId);
        if (employee == null) return buildAppBadRequest("Employee not found");

        List<JobApplication> applications = jobApplicationRepository.findByEmployee(employee);
        return buildApplicationResponse(applications, "Applications");
    }

    @GetMapping("/fetch/employer/{employerId}")
    public ResponseEntity<JobApplicationResponse> fetchAllJobApplicationsByEmployer(@PathVariable int employerId) {
        LOG.info("📤 Fetch job applications by employerId: {}", employerId);
        if (employerId == 0) return buildAppBadRequest("Employer ID missing");
        List<JobApplication> applications = jobApplicationService.getApplicationsByEmployer(employerId);
        return buildApplicationResponse(applications, "Employer Applications");
    }

    @GetMapping("/fetch/employer/{employerId}/status/{status}")
    public ResponseEntity<JobApplicationResponse> fetchAllJobApplicationsByEmployerAndStatus(
            @PathVariable int employerId,
            @PathVariable String status) {
        LOG.info("📤 Fetch applications by employerId: {} and status: {}", employerId, status);
        if (employerId == 0 || status == null) return buildAppBadRequest("Missing employer ID or status");
        User employer = userService.getUserById(employerId);
        if (employer == null) return buildAppBadRequest("Employer not found");
        List<JobApplication> applications = jobApplicationService.getByEmployeeAndStatus(employer, List.of(status));
        return buildApplicationResponse(applications, "Applications with status: " + status);
    }

    @GetMapping("/fetch/job/{jobId}")
    public ResponseEntity<JobApplicationResponse> fetchAllJobApplicationsByJob(@PathVariable int jobId) {
        LOG.info("📤 Fetch applications by jobId: {}", jobId);
        if (jobId == 0) return buildAppBadRequest("Job ID missing");
        Job job = jobService.getById(jobId);
        if (job == null) return buildAppBadRequest("Job not found");
        return buildApplicationResponse(jobApplicationService.getByJob(job), "Applications by job");
    }

    // 🔧 Utility methods

    private ResponseEntity<CommonApiResponse> buildBadRequest(CommonApiResponse response, String message) {
        response.setResponseMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<JobApplicationResponse> buildAppBadRequest(String message) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setResponseMessage(message);
        response.setSuccess(false);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<JobApplicationResponse> buildApplicationResponse(List<JobApplication> applications, String type) {
        JobApplicationResponse response = new JobApplicationResponse();
        if (CollectionUtils.isEmpty(applications)) {
            response.setResponseMessage("No " + type + " found");
            response.setSuccess(false);
        } else {
            response.setApplications(applications);
            response.setResponseMessage(type + " fetched successfully");
            response.setSuccess(true);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
