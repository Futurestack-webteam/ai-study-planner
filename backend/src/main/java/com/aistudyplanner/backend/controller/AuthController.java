package com.aistudyplanner.backend.controller;

import com.aistudyplanner.backend.model.AuthRequest;
import com.aistudyplanner.backend.model.User;
import com.aistudyplanner.backend.repository.UserRepository;
import com.aistudyplanner.backend.service.JwtService;
import com.aistudyplanner.backend.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpService otpService;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    /*
    ======================================
    SIGNUP
    ======================================
    */
   /*
======================================
SEND OTP
======================================
*/

@PostMapping("/send-otp")
public Map<String, Object> sendOtp(
        @RequestBody AuthRequest request
) {

    Map<String, Object> response =
            new HashMap<>();

    try {

        otpService.sendOtp(
                request.getEmail()
        );

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "OTP sent successfully"
        );

    } catch (Exception e) {

    e.printStackTrace();


        response.put(
                "success",
                false
        );

        response.put(
                "message",
                "Failed to send OTP"
        );
    }

    return response;
}

    @PostMapping("/signup")
    public Map<String, Object> signup(
            @RequestBody AuthRequest request
    ) {

        Map<String, Object> response =
                new HashMap<>();

        boolean validOtp =
        otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

if (!validOtp) {

    response.put(
            "success",
            false
    );

    response.put(
            "message",
            "Invalid OTP"
    );

    return response;
}

        Optional<User> existingUser =
                userRepository.findByEmail(
                        request.getEmail()
                );

        if (existingUser.isPresent()) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Email already exists"
            );

            return response;
        }

        User user = new User();

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                encoder.encode(
                        request.getPassword()
                )
        );

        userRepository.save(user);

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        response.put(
                "success",
                true
        );

        response.put(
                "token",
                token
        );

Map<String, Object> userData =
        new HashMap<>();

userData.put(
        "fullName",
        user.getFullName()
);

userData.put(
        "email",
        user.getEmail()
);

response.put(
        "user",
        userData
);
        return response;
    }

    /*
    ======================================
    LOGIN
    ======================================
    */

    @PostMapping("/signin")
    public Map<String, Object> signin(
            @RequestBody AuthRequest request
    ) {

        Map<String, Object> response =
                new HashMap<>();

        Optional<User> userOptional =
                userRepository.findByEmail(
                        request.getEmail()
                );

        if (userOptional.isEmpty()) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "User not found"
            );

            return response;
        }

        User user = userOptional.get();

        boolean passwordMatch =
                encoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatch) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Invalid password"
            );

            return response;
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        response.put(
                "success",
                true
        );

        response.put(
                "token",
                token
        );
Map<String, Object> userData =
        new HashMap<>();

userData.put(
        "fullName",
        user.getFullName()
);

userData.put(
        "email",
        user.getEmail()
);

response.put(
        "user",
        userData
);

        return response;
    }
    /*
======================================
RESET PASSWORD
======================================
*/

@PostMapping("/reset-password")
public Map<String, Object> resetPassword(
        @RequestBody AuthRequest request
) {

    Map<String, Object> response =
            new HashMap<>();

    boolean validOtp =
            otpService.verifyOtp(
                    request.getEmail(),
                    request.getOtp()
            );

    if (!validOtp) {

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                "Invalid OTP"
        );

        return response;
    }

    Optional<User> userOptional =
            userRepository.findByEmail(
                    request.getEmail()
            );

    if (userOptional.isEmpty()) {

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                "User not found"
        );

        return response;
    }

    User user =
            userOptional.get();

    user.setPassword(
            encoder.encode(
                    request.getPassword()
            )
    );

    userRepository.save(user);

    response.put(
            "success",
            true
    );

    response.put(
            "message",
            "Password updated successfully"
    );

    return response;
}
}