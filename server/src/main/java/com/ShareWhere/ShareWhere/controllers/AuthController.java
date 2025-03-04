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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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

import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    private final JwtIssuer jwtIssuer;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtDecoder jwtDecoder;
    private final JwtToPrincipalConverter jwtToPrincipalConverter;

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
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header("Set-Cookie", jwtCookie.toString())
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
        if (request.getCity() == null || request.getCity().isBlank()) {
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

        String token = jwtIssuer.issue(newUser.getUserId(), newUser.getEmail(), List.of(newUser.getRole()));

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(2 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(Map.of("message", "Signed up successfully", "user", new UserDTO(newUser)));

    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Delete the cookie

        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

//    @GetMapping("/check")
//    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
//        try {
//            String token = authorizationHeader.replace("Bearer ", "");
//            DecodedJWT decodedJWT = jwtDecoder.decode(token);
//            UserPrincipal userPrincipal = jwtToPrincipalConverter.convert(decodedJWT);
//            Optional<User> user = userService.getUserByEmail(userPrincipal.getEmail());
//            return ResponseEntity.ok(user); // Token is valid
//        } catch (ExpiredJwtException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
//        } catch (SignatureException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token signature");
//        } catch (MalformedJwtException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token format");
//        } catch (UnsupportedJwtException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unsupported JWT");
//        } catch (IllegalArgumentException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Empty token string");
//        } catch (Exception ex) {
//            // Catch any other unexpected exceptions
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while validating the token");
//        }

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

}
