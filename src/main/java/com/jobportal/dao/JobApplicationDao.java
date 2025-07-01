package com.jobportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobApplication;
import com.jobportal.entity.User;

@Repository
public interface JobApplicationDao extends JpaRepository<JobApplication, Integer> {

    List<JobApplication> findByEmployee(User employee);
    
    List<JobApplication> findByJob(Job job);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.employer = :employer AND ja.status IN :status")
    List<JobApplication> findByEmployerAndStatus(@Param("employer") User employer,
                                                 @Param("status") List<String> status);

    // ✅ New method to find job applications by employer ID directly
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.employer.id = :employerId")
    List<JobApplication> findByJobEmployerId(@Param("employerId") int employerId);
}
