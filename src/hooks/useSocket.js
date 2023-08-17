import io from "socket.io-client";

const storedSocketId = localStorage.getItem("socketId");
let socket;


if (storedSocketId) {
  socket = io.connect(process.env.REACT_APP_BACKEND_API_URL, {
    query: { socketId: storedSocketId },
  });
} else socket = io.connect(process.env.REACT_APP_BACKEND_API_URL);

export function useSocket() {
  function newUser(userId) {
    socket.emit("newUser", userId);
  }

  socket.on("connect", () => {
    if (!storedSocketId) localStorage.setItem("socketId", socket.id);
  });

  return { socket, newUser };
}
