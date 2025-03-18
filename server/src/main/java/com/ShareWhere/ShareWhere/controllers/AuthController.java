package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import com.ShareWhere.ShareWhere.DTOs.UserProfileDTO;
import com.ShareWhere.ShareWhere.models.*;
import com.ShareWhere.ShareWhere.security.JwtDecoder;
import com.ShareWhere.ShareWhere.security.JwtIssuer;
import com.ShareWhere.ShareWhere.security.JwtToPrincipalConverter;
import com.ShareWhere.ShareWhere.security.UserPrincipal;
import com.ShareWhere.ShareWhere.services.UserService;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtIssuer jwtIssuer;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtDecoder jwtDecoder;
    private final JwtToPrincipalConverter jwtToPrincipalConverter;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var principal = (UserPrincipal) authentication.getPrincipal();

        var roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        var token = jwtIssuer.issue(principal.getUserId(), principal.getEmail(), roles);

        Optional<UserDTO> user = userService.getUserById(principal.getUserId());
        if (user.isPresent()) {
            UserDTO userDTO = user.get();

            // Create HTTP-only cookie
            ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(2 * 60 * 60)
                    .domain(".sharewheresocial.com")
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(Map.of("message", "Logged in successfully", "user", userDTO));
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Validated SignupRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request.getName().length() < 3 || request.getName().length() > 30) {
            errors.put("name", "Name must be between 3 and 30 characters");
        }

        if (request.getUsername().length() < 3 || request.getUsername().length() > 30) {
            errors.put("username", "Username must be between 3 and 30 characters");
        }

        if (userService.existsByUsername(request.getUsername())) {
            errors.put("username", "Username is taken");
        }

        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!Pattern.matches(emailRegex, request.getEmail())) {
            errors.put("email", "Invalid email format");
        }

        String usernameRegex = "^[A-Za-z0-9_.]+$";
        if (!Pattern.matches(usernameRegex, request.getUsername())) {
            errors.put("username", "Username can only contain letters, numbers, underscores, or periods");
        }


        // Validate email uniqueness
        if (userService.existsByEmail(request.getEmail())) {
            errors.put("email", "Email is already in use");
        }

        // Validate city is not empty
        if (request.getCity() == null) {
            errors.put("city", "City cannot be empty");
        }

        // Validate password
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%#*?&])[A-Za-z\\d@$!%#*?&]{8,}$";
        if (!Pattern.matches(passwordPattern, request.getPasswordHash())) {
            errors.put("password", "Password must be at least 8 characters long, include at least one letter, one number, and one special character");
        }

        // Return errors if any
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        String encodedPassword = passwordEncoder.encode(request.getPasswordHash());

        User newUser = new User(
                request.getEmail(),
                encodedPassword,
                request.getUsername(),
                request.getName(),
                request.getLatitude(),
                request.getLongitude(),
                request.getCity()
        );

        userService.createUser(newUser);

        var token = jwtIssuer.issue(newUser.getUserId(), newUser.getEmail(), List.of(newUser.getRole()));

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(2 * 60 * 60)
                .sameSite("Lax")
                .domain(".sharewheresocial.com")
                .build();

        UserDTO userDTO = new UserDTO(newUser);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(Map.of("message", "Signed up successfully", "user", userDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .domain(".sharewheresocial.com")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).build();
    }


    @GetMapping("/check")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            // Get cookies from the request
            Cookie[] cookies = request.getCookies();
            String token = null;

            // Loop through cookies to find the "jwt" cookie
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break; // Token found, no need to continue checking
                    }
                }
            }

            // If the token is not found in cookies, return unauthorized
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing");
            }

            // Decode and validate the token using jwtDecoder
            DecodedJWT decodedJWT = jwtDecoder.decode(token);
            UserPrincipal userPrincipal = jwtToPrincipalConverter.convert(decodedJWT);

            // Retrieve the user from the database using the email from the token
            Optional<User> user = userService.getUserByEmail(userPrincipal.getEmail());

            // If user exists, token is valid
            if (user.isPresent()) {
                return ResponseEntity.ok(user); // Return the user or any other response you want
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

        } catch (ExpiredJwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
        } catch (SignatureException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token signature");
        } catch (MalformedJwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token format");
        } catch (UnsupportedJwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unsupported JWT");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Empty token string");
        } catch (Exception ex) {
            // Catch any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while validating the token");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        Map<String, String> errors = new HashMap<>();

        if (!userService.existsByEmail(email)) {
            errors.put("message", "Email is not registered");
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        String resetToken = UUID.randomUUID().toString();
        userService.saveResetToken(email, resetToken);

        String resetLink = "https://sharewheresocial.com/forgot-password/" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the following link to reset your password: " + resetLink);
        System.out.println(message);
        mailSender.send(message);

        return ResponseEntity.ok(Map.of("message", "Please check your email for a reset link. Make sure to check spam."));

    }

    @PatchMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable String token, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");

        String email = userService.getEmailByResetToken(token);

        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }

        // Validate password
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%#*?&])[A-Za-z\\d@$!%#*?&]{8,}$";
        if (!Pattern.matches(passwordPattern, newPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters long, include at least one letter, one number, and one special character"));
        }

        String encodedPassword = passwordEncoder.encode(newPassword);

        userService.updatePassword(email, encodedPassword);
        userService.clearResetToken(email);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }



}
