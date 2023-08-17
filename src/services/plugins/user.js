import { PluginService } from ".";

const userService = PluginService("/users");

class UserService {
  static personalInfo() {
    return userService({
      method: "GET",
      url: "/me",
    });
  }

  static getUserList() {
    return userService({
      method: "GET",
      url: "/",
    });
  }

  static startNewConversation(data) {
    return userService({
      method: "POST",
      url: "/new-conversation",
      data,
    });
  }

  static getUserConversations() {
    return userService({
      method: "GET",
      url: "/conversations",
    });
  }

  static getUserConversationDetails(id) {
    return userService({
      method: "GET",
      url: `/conversations/${id}`,
    });
  }

  static sendMessage(data) {
    return userService({
      method: "POST",
      url: "/conversations/send-message",
      data
    });
  }
}

export default UserService;
