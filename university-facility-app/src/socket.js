// socket.js
import { io } from "socket.io-client";
// const socket = io("http://127.0.0.1:8001", { autoConnect: false });
const socket = io("http://127.0.0.1:8001");
export default socket;
