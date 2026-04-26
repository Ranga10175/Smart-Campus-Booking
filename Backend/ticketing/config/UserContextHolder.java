package com.smartcampus.backend.ticketing.config;
import java.util.List;
public final class UserContextHolder {
  private static final ThreadLocal<UserContext> HOLDER = new ThreadLocal<>();
  private UserContextHolder() {}
  public static void set(UserContext user) { HOLDER.set(user); }
  public static UserContext get() { UserContext u = HOLDER.get(); return u != null ? u : new UserContext("student1","Student User",List.of("ROLE_USER")); }
  public static void clear() { HOLDER.remove(); }
}
