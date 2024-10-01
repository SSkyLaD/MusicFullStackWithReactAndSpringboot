package org.example.dbconnectdemo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Random;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String verificationCode;

    private LocalDateTime verificationCodeExpireAt;

    public void generateVerificationCode() {
        Random rnd = new Random();
        int number = rnd.nextInt(999999);

        this.verificationCode = String.format("%06d", number);

        this.setVerificationCodeExpireAt(LocalDateTime.now().plusMinutes(3));
    }
}
