import axios from "axios";
import { io } from "socket.io-client";

let socket = null; // We'll create this after user picks a role
let myRole = "me"; // Default choice

const SERVER_URL = "http://localhost:8747";

// Called when user clicks "Connect"
window.connectSocket = function () {
  const selectElem = document.getElementById("userSelect");
  myRole = selectElem.value; // "me" or "friend"

  // Connect with query param ?user=me or ?user=friend
  socket = io(SERVER_URL, {
    transports: ["websocket"],
    query: { user: myRole },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id, "as:", myRole);
  });

  // When we receive a new message
  socket.on("newMessage", (data) => {
    // data => { sender: "me"|"friend", text: "...", time: <timestamp> }
    const messageBox = document.getElementById("messageBox");

    // Convert numeric timestamp to a readable string
    const timeString = new Date(data.time).toLocaleString();

    // If the message is from the local user (myRole), right-align; else left-align
    const alignment = data.sender === myRole ? "right" : "left";
    const senderLabel = data.sender === myRole ? myRole : data.sender;

    messageBox.innerHTML += `
      <div style="text-align:${alignment}; margin-bottom:8px;">
        <strong>${senderLabel}:</strong> ${data.text}
        <div style="font-size: 0.8em; margin-top: 3px;">
          ${timeString}
        </div>
      </div>
    `;
  });
};

// Called when user clicks "Send" button
window.sendMsg = async function () {
  if (!socket) {
    alert("Please choose your role and click Connect first.");
    return;
  }
  const inputElem = document.getElementById("msgInput");
  const text = inputElem.value.trim();
  if (!text) return;

  try {
    // Post to /api/messages with "sender" = myRole
    const response = await axios.post(`${SERVER_URL}/api/messages`, {
      sender: myRole,
      text,
    });
    if (response.data.success) {
      console.log("Message posted:", response.data.message);
    } else {
      console.error("Error in response:", response.data);
    }
  } catch (err) {
    console.error("Send message error:", err);
  }
  inputElem.value = "";
};
