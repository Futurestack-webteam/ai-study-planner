package com.aistudyplanner.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpStorage =
            new HashMap<>();

    // GENERATE OTP

    public String generateOtp() {

        Random random = new Random();

        int otp =
                100000 +
                random.nextInt(900000);

        return String.valueOf(otp);
    }

    // SEND OTP

    public void sendOtp(
            String email
    ) {

        String otp =
                generateOtp();

        otpStorage.put(
                email,
                otp
        );

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(
                "arjunrj_1701@gmail.com"
        );

        message.setTo(email);

        message.setSubject(
                "AI Study Planner OTP Verification"
        );

        message.setText(
                "Your OTP is: " + otp
        );

        mailSender.send(message);

        System.out.println(
                "OTP SENT: " + otp
        );
    }

    // VERIFY OTP

    public boolean verifyOtp(
            String email,
            String otp
    ) {

        String storedOtp =
                otpStorage.get(email);

        return storedOtp != null &&
                storedOtp.equals(otp);
    }
}