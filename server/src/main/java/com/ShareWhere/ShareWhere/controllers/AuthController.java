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
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .message("Logged in successfully")
                    .user(userDTO) // Pass the userDTO to the builder
                    .build();
            return ResponseEntity.ok(response);
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

        // Validate username length
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

        SignupResponse response = SignupResponse.builder()
                .token(token)
                .message("Signed up successfully")
                .user(new UserDTO(newUser))
                .build();

        return ResponseEntity.ok(response);

    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            DecodedJWT decodedJWT = jwtDecoder.decode(token);
            UserPrincipal userPrincipal = jwtToPrincipalConverter.convert(decodedJWT);
            Optional<User> user = userService.getUserByEmail(userPrincipal.getEmail());
            return ResponseEntity.ok(user); // Token is valid
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
