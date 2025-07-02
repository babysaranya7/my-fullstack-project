package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {

    // ✅ Check if an employee has already applied to a job
    boolean existsByEmployee_IdAndJob_Id(Integer employeeId, Integer jobId);

    // ✅ Eagerly fetch associated employee and job
    @EntityGraph(attributePaths = {"employee", "job"})
    Optional<JobApplication> findWithEmployeeAndJobById(Integer id);

    // ✅ Find all applications by a specific employee
    List<JobApplication> findByEmployee(User employee);

    // ✅ Find all applications for a specific job
    List<JobApplication> findByJob(Job job);

    // ✅ Find applications by employee and list of statuses
    List<JobApplication> findByEmployeeAndStatusIn(User employee, List<String> status);

    // ✅ Find applications by employerId (via job.employer.id)
    List<JobApplication> findByJob_Employer_Id(int employerId);
}
