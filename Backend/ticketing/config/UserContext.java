package com.smartcampus.backend.ticketing.config;
import java.util.List;
public record UserContext(String userId, String name, List<String> roles) {
  public boolean hasRole(String role) { return roles != null && roles.contains(role); }
}
