document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Password reset link sent to your email!');
    window.location.href = "login.html"; 
});

async function forgotpassword(e){
    e.preventDefault();
    
    const form = new FormData(e.target);
    const email = form.get('email');
    console.log(email);

    try{
        await axios.post(`http://localhost:3000/api/password/forgotpassword`, { email });
        window.location.href = "login.html";
        
    }catch(error){
        console.log(error);
    }
    
   
}