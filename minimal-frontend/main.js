// For local testing, point to remote backend
const SERVER_URL = "https://quality-visually-stinkbug.ngrok-free.app";

window.callSignup = function callSignup() {
  // 1) Make sure these IDs exist in HTML
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // 2) If either is missing, show a clear error
  if (!emailInput || !passwordInput) {
    console.error("Missing #email or #password element in HTML");
    return;
  }

  // 3) Extract values
  const email = emailInput.value;
  const password = passwordInput.value;

  // 4) Send request to the backend
  fetch(`${SERVER_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      // If response not OK, convert to text
      if (!res.ok) {
        return res.text().then((text) => {
          try {
            const data = JSON.parse(text);
            throw new Error(data.message || `HTTP ${res.status}`);
          } catch {
            throw new Error(text || `HTTP ${res.status}`);
          }
        });
      }
      // If OK, parse as JSON
      return res.json();
    })
    .then((data) => {
      // Success
      console.log("Signup successful:", data);
      alert("Signup successful!\n" + JSON.stringify(data, null, 2));
    })
    .catch((err) => {
      // Error
      console.error("Signup error:", err);
      alert(`Signup error: ${err.message}`);
    });
};
