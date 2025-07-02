package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.dto.CommonApiResponse;
import com.jobportal.dto.JobAddRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.resource.JobResource;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("api/job")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobResource jobResource;

    @PostMapping("/add")
    @Operation(summary = "API to post a new job")
    public ResponseEntity<CommonApiResponse> addJob(@RequestBody JobAddRequest request) {
        return jobResource.addJob(request);
    }

    @GetMapping("/fetch/all")
    @Operation(summary = "API to get all posted jobs")
    public ResponseEntity<JobResponse> fetchAllPostedJob() {
        return jobResource.fetchAllPostedJob();
    }

    @GetMapping("/search")
    @Operation(summary = "API to search posted jobs")
    public ResponseEntity<JobResponse> searchJobs(
            @RequestParam("categoryId") int categoryId,
            @RequestParam("jobType") String type,
            @RequestParam("salaryRange") String salaryRange) {
        return jobResource.searchJobs(categoryId, type, salaryRange);
    }

    @GetMapping("/fetch")
    @Operation(summary = "API to get a job by ID")
    public ResponseEntity<JobResponse> getJobById(@RequestParam("jobId") int jobId) {
        return jobResource.getJobById(jobId);
    }

    @GetMapping("/fetch/employer-wise")
    @Operation(summary = "API to get jobs by employer ID")
    public ResponseEntity<JobResponse> getJobsByEmployer(@RequestParam("employerId") int employerId) {
        return jobResource.getJobByEmployerId(employerId);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "API to delete a job by ID")
    public ResponseEntity<CommonApiResponse> deleteJob(@RequestParam("jobId") int jobId) {
        return jobResource.deleteJob(jobId);
    }

    @GetMapping(value = "/{companyLogo}", produces = "image/*")
    @Operation(summary = "API to fetch the company logo image")
    public void fetchCompanyLogo(@PathVariable("companyLogo") String companyLogo, HttpServletResponse response) {
        jobResource.fetch(companyLogo, response);
    }
}
