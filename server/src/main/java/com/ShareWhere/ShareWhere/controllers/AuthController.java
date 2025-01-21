package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.models.*;
import com.ShareWhere.ShareWhere.security.JwtIssuer;
import com.ShareWhere.ShareWhere.security.UserPrincipal;
import com.ShareWhere.ShareWhere.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtIssuer jwtIssuer;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Validated LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var principal = (UserPrincipal) authentication.getPrincipal();

        var roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        var token = jwtIssuer.issue(principal.getUserId(), principal.getUsername(), roles);
        return LoginResponse.builder()
                .accessToken(token)
                .build();
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody @Validated SignupRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(
                    SignupResponse.builder()
                            .message("Email is already in use")
                            .build()
            );
        }

        String encodedPassword = passwordEncoder.encode(request.getPasswordHash());

        User newUser = new User(
                request.getEmail(),
                encodedPassword,
                request.getUsername(),
                request.getName(),
                request.getLocation(),
                request.getRole()
        );

        userService.createUser(newUser);

        String token = jwtIssuer.issue(newUser.getUserID(), newUser.getUsername(), List.of("USER"));

        SignupResponse response = SignupResponse.builder()
                .username(newUser.getUsername())
                .email(newUser.getEmail())
                .role(newUser.getRole())
                .token(token)
                .message("User created successfully")
                .build();

        return ResponseEntity.ok(response);

    }
}
