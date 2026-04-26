package com.smartcampus.backend.ticketing.config;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
@Component
public class DevAuthInterceptor implements HandlerInterceptor {
  private final ObjectMapper mapper = new ObjectMapper();
  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String auth = request.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer ")) {
      try {
        String json = new String(Base64.getDecoder().decode(auth.substring(7).trim()), StandardCharsets.UTF_8);
        Map<String,Object> payload = mapper.readValue(json, new TypeReference<Map<String,Object>>() {});
        String sub = String.valueOf(payload.getOrDefault("sub", "student1"));
        String name = String.valueOf(payload.getOrDefault("name", sub));
        List<String> roles = mapper.convertValue(payload.get("roles"), new TypeReference<List<String>>() {});
        if (roles == null || roles.isEmpty()) roles = List.of("ROLE_USER");
        UserContextHolder.set(new UserContext(sub, name, roles));
        return true;
      } catch (Exception ignored) {}
    }
    UserContextHolder.set(new UserContext("student1","Student User",List.of("ROLE_USER")));
    return true;
  }
  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) { UserContextHolder.clear(); }
}
