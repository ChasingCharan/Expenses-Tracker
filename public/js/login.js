const API = "http://localhost:3000"; // Backend API URL

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
    // Get form input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const responseMessage = document.getElementById("response-message");

    // Basic input validation
    if (!email || !password) {
        responseMessage.innerText = "Please enter both email and password.";
        responseMessage.style.color = "red";
        return;
    }

    try {
        // Send login request
        const response = await axios.post(`${API}/auth/login`, { email, password });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("userId", response.data.id);

        window.location.href = "dashboard.html";
    } catch (error) {
        // Handle errors gracefully
        responseMessage.innerText = error.response?.data?.message || "Login failed!";
        responseMessage.style.color = "red";
    }
});
