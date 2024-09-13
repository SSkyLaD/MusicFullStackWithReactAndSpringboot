package org.example.dbconnectdemo.repository;

import org.example.dbconnectdemo.model.UserOtp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserOtpRepository extends JpaRepository<UserOtp, Long> {
}
