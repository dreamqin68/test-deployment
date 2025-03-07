import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8747",
  withCredentials: true, // Send/receive cookies
});

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const getUserinfoBtn = document.getElementById("getUserinfoBtn");
const responseMsg = document.getElementById("responseMsg");

// Signup
signupBtn.onclick = async () => {
  try {
    const res = await apiClient.post("/api/auth/signup", {
      email: emailInput.value,
      password: passwordInput.value,
    });
    responseMsg.textContent = res.data.message;
  } catch (err) {
    responseMsg.textContent = err.response?.data?.message || "Signup failed";
  }
};

// Protected Request
getUserinfoBtn.onclick = async () => {
  try {
    const res = await apiClient.get("/api/auth/userinfo");
    responseMsg.textContent = JSON.stringify(res.data);
  } catch (err) {
    responseMsg.textContent =
      err.response?.data?.message || "Userinfo request failed";
  }
};
