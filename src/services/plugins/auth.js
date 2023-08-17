import { PluginService } from ".";

const authService = PluginService("/auth");

class UserService {
  static login(data) {
    return authService({
      method: "POST",
      url: "/login",
      data,
    });
  }

  static signUp(data) {
    return authService({
      method: "POST",
      url: `/sign-up`,
      data
    });
  }
}

export default UserService;
