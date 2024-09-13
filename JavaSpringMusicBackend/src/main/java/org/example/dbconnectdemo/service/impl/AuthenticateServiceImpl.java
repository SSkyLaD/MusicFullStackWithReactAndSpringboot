package org.example.dbconnectdemo.service.impl;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.dbconnectdemo.dto.Request.LoginReqBody;
import org.example.dbconnectdemo.dto.Request.RegisterReqBody;
import org.example.dbconnectdemo.dto.Request.VerifyUserReq;
import org.example.dbconnectdemo.dto.UserDto;
import org.example.dbconnectdemo.exception.InvalidInputException;
import org.example.dbconnectdemo.exception.ResourceNotFoundException;
import org.example.dbconnectdemo.exception.UsernameAlreadyExistException;
import org.example.dbconnectdemo.map.UserMapper;
import org.example.dbconnectdemo.model.Role;
import org.example.dbconnectdemo.model.User;
import org.example.dbconnectdemo.model.UserOtp;
import org.example.dbconnectdemo.repository.UserOtpRepository;
import org.example.dbconnectdemo.repository.UserRepository;
import org.example.dbconnectdemo.service.AuthenticateService;
import org.example.dbconnectdemo.filterAndConfig.config.ApplicationConfig;
import org.example.dbconnectdemo.utilities.EmailUtility;
import org.example.dbconnectdemo.utilities.JwtUtility;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@AllArgsConstructor
public class AuthenticateServiceImpl implements AuthenticateService {

    private final ApplicationConfig applicationConfig;

    private final JwtUtility jwtUtility;

    private final EmailUtility emailUtility;

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final UserOtpRepository otpRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterReqBody registerReqBody) {
        UserDto userDto = new UserDto();
        userDto.setUsername(registerReqBody.getUsername());
        userDto.setEmail(registerReqBody.getEmail());
        userDto.setPassword(registerReqBody.getPassword());
        userDto.setRole(Role.USER); //Hardcode every created account is user

        String USERNAME_PATTERN = "^[a-zA-Z0-9]+$";

        if (userDto.getUsername() == null || userDto.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be blank");
        }
        if (!userDto.getUsername().matches(USERNAME_PATTERN)) {
            throw new InvalidInputException("Username invalid");
        }
        if (userDto.getEmail() == null || userDto.getEmail().isEmpty()) {
            throw new InvalidInputException("Email cannot be blank");
        }
        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            throw new InvalidInputException("Password cannot be blank");
        }
        String EMAIL_PATTERN = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!userDto.getEmail().matches(EMAIL_PATTERN)) {
            throw new InvalidInputException("Invalid email address");
        }

        //TODO: change to Spring validate
        if (userDto.getPassword().length() < 6) {
            throw new InvalidInputException("Password must be at least 6 characters");
        }
        if (userDto.getPassword().length() > 30) {
            throw new InvalidInputException("Password must be less than 30 character");
        }
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistException("Username already exist");
        }

        File userDir = new File(applicationConfig.getStaticFileUrl() + "\\" + userDto.getUsername());
        if (!userDir.exists()) {
            if (!userDir.mkdir()) {
                throw new RuntimeException("Create directory failed");
            }
        }
        User user = UserMapper.mapToUser(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserDir(userDir.getAbsolutePath());
        User savedUser = userRepository.save(user);

        UserOtp otp = new UserOtp();
        otp.setUser(savedUser);
        otpRepository.save(otp);

        savedUser.setUserOtp(otp);
        userRepository.save(savedUser);
    }

    @Override
    public String login(LoginReqBody loginReqBody) {
        if (loginReqBody.getUsername() == null || loginReqBody.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be blank");
        }
        if (loginReqBody.getPassword() == null || loginReqBody.getPassword().isEmpty()) {
            throw new InvalidInputException("Password cannot be blank");
        }

        //Validate username and password throw AuthenticationException
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReqBody.getUsername(), loginReqBody.getPassword()));
        User user = userRepository.findByUsername(loginReqBody.getUsername()).orElseThrow(() -> new ResourceNotFoundException("Cannot find user"));
        return jwtUtility.generateToken(user);
    }

    @Override
    public void loginV2(LoginReqBody loginReqBody) throws MessagingException {
        if (loginReqBody.getUsername() == null || loginReqBody.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be blank");
        }
        if (loginReqBody.getPassword() == null || loginReqBody.getPassword().isEmpty()) {
            throw new InvalidInputException("Password cannot be blank");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReqBody.getUsername(), loginReqBody.getPassword()));
        User user = userRepository.findByUsername(loginReqBody.getUsername()).orElseThrow(() -> new ResourceNotFoundException("Cannot find user"));
        user.getUserOtp().generateVerificationCode();
        String subject = "Account Verification";
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + user.getUserOtp().getVerificationCode() + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        userRepository.save(user);
        emailUtility.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
    }


    @Override
    public String verifyLogin(VerifyUserReq verifyUserReq) {
        if(verifyUserReq.getUsername() == null || verifyUserReq.getUsername().isEmpty()) {
            throw new InvalidInputException("Username cannot be blank");
        }
        if(verifyUserReq.getVerificationCode() == null || verifyUserReq.getVerificationCode().length() != 6) {
            throw new InvalidInputException("Verification code invalid");
        }
        User user = userRepository.findByUsername(verifyUserReq.getUsername()).orElseThrow(() -> new ResourceNotFoundException("Cannot find user"));
        UserOtp userOtp = user.getUserOtp();
        if(!Objects.equals(verifyUserReq.getVerificationCode(), userOtp.getVerificationCode())) {
            throw new InvalidInputException("Verification code invalid");
        }
        if(user.getUserOtp().getVerificationCodeExpireAt().isBefore(LocalDateTime.now())){
            throw new InvalidInputException("Verification code expired");
        }
        userOtp.setVerificationCodeExpireAt(null);
        userOtp.setVerificationCode(null);
        userRepository.save(user);
        return jwtUtility.generateToken(user);
    }
}
