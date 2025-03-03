package com.ShareWhere.ShareWhere.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    private final JwtToPrincipalConverter jwtToPrincipalConverter;

//    private final List<String> publicEndpoints = List.of("/**", "/", "/signup", "/login");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Skip public endpoints
        if (
                request.getRequestURI().startsWith("/auth/") ||
                request.getRequestURI().equals("/") ||
                request.getRequestURI().equals("/tags") ||
                        request.getRequestURI().equals("/search") ||
                        request.getRequestURI().equals("/users") ||
                request.getRequestURI().equals("/locations/home-posts") ||
                        request.getRequestURI().equals("/locations") ||
                request.getRequestURI().equals("/locations/home-posts/{tag_id}") ||
                request.getRequestURI().equals("/locations/{location_id}") ||
                request.getRequestURI().equals("/locations/pins")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token from the request
        Optional<String> token = extractTokenFromRequest(request);
        if (token.isPresent()) {
            try {
                var decodedToken = jwtDecoder.decode(token.get());
                var principal = jwtToPrincipalConverter.convert(decodedToken);

                var authentication = new UserPrincipalAuthenticationToken(principal);
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                logger.error("Authentication failed: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Set HTTP status to 401
                response.getWriter().write("Authentication failed");
                return;
            }
        }

        // Proceed with the request
        filterChain.doFilter(request, response);
    }

    private Optional<String> extractTokenFromRequest(HttpServletRequest request) {
        // First check in the Authorization header
        var token = request.getHeader("Authorization");
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return Optional.of(token.substring(7));
        }
        // Then check for the JWT token in cookies
        var cookie = WebUtils.getCookie(request, "jwt");
        if (cookie != null && StringUtils.hasText(cookie.getValue())) {
            return Optional.of(cookie.getValue());
        }
        return Optional.empty();
    }

}
