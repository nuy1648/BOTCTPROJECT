const socket = io();

const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("send_message_btn");
const chatDisplay = document.getElementById("chat-cont");

console.log("messageInput:", messageInput);
console.log("sendMessageBtn:", sendMessageBtn);
console.log("chatDisplay:", chatDisplay);


sendMessageBtn.addEventListener("click", () => {
  if (messageInput.value.trim() !== "") {
    const text = messageInput.value.trim();
    socket.emit("message", text); // Fixed event name
    messageInput.value = "";
  }
});

messageInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessageBtn.click();
  }
});


socket.on("message", (data) => {
  console.log("Message received:", data);
  chatDisplay.innerHTML += `<div class="message_holder ">
                              <div class="message_box">
                                <div id="message" class="message">
                                  <span class="message_text">${data}</span>
                                </div>
                              </div>
                            </div>`;
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});


// Function to mark messages as read and update the info section
function markMessagesAsRead() {
  const messages = document.querySelectorAll(".message_holder .message");
  let unreadCount = 0;

  messages.forEach((message) => {
    if (!message.classList.contains("read")) {
      message.classList.add("read");
      message.style.backgroundColor = "#e0ffe0"; // Change background to indicate read
      unreadCount++;
    }
  });

  // Update the info section with the read status
  const infoElement = document.querySelector(".info");
  if (unreadCount > 0) {
    infoElement.textContent = `${unreadCount} message(s) marked as read.`;
    infoElement.classList.add("visible");
  } else {
    infoElement.textContent = "All messages are read.";
    infoElement.classList.add("visible");
  }
}

// Call markMessagesAsRead when the chat is opened
document.getElementById("offchat-menu").addEventListener("change", (event) => {
  if (event.target.checked) {
    markMessagesAsRead();
  }
});

// Opens sticky-chat automatically within 3 seconds of page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("offchat-menu").checked = true;
  }, 3000);
});