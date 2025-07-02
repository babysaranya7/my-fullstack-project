package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.entity.JobApplication;
import com.jobportal.service.JobApplicationService;

import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/job/application")
@CrossOrigin(origins = "http://localhost:3000")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // ✅ Fetch job applications by employer
    @GetMapping("/fetch/all/employer")
    @Operation(summary = "API to fetch job applications by employer")
    public ResponseEntity<List<JobApplication>> fetchAllJobApplicationsByEmployer(
            @RequestParam("employerId") int employerId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsByEmployer(employerId);
        return ResponseEntity.ok(applications);
    }

    // ✅ Update status and send email
    @PutMapping("/send-email/{id}/status")
    @Operation(summary = "Update job application status and send email to user")
    public ResponseEntity<JobApplication> updateStatusAndSendEmail(
            @PathVariable("id") int applicationId,
            @RequestParam("status") String newStatus) {
        JobApplication updatedApp = jobApplicationService.updateApplicationStatus(applicationId, newStatus);
        return ResponseEntity.ok(updatedApp);
    }
}
