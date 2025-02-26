document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phoneNumber = document.getElementById("number").value;
    const responseMessage = document.getElementById("response-message");

    const UserCredentials = {
        username : username,
        email : email,
        password : password,
        phoneNumber : phoneNumber
    }


    try {
        const response = await axios.post("http://localhost:3000/auth/signup", UserCredentials);

        if (response.status === 201) {
            document.getElementById("response-message").innerText = "Signup Successful!";
            window.location.href = "login.html"; 
        } else {
            responseMessage.style.color = "red";
            document.getElementById("response-message").innerText = "Signup failed. Please try again.";
        }
    } catch (error) {
        console.error("Signup Error:", error.response ? error.response.data : error.message);
        responseMessage.style.color = "red";
        document.getElementById("response-message").innerText = error.response ? error.response.data.message : "Signup failed!";
    }
});
