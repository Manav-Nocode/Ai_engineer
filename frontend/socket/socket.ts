import { io } from "socket.io-client";

const username = "Manav";
const socket = io("http://127.0.0.1:8000/editor", {
  path: "/socket.io",
  transports: ["websocket"],
  auth: {
    username,
  },
});

export default socket;
