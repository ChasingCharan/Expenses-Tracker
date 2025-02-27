
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expensesList');
const addButton = document.getElementById("add-expense");
const viewUsersBtn = document.getElementById("leaderDashbordBtn");
const viewUsersList = document.getElementById("leaderDashbordList");
const premiumSection = document.querySelector(".premium");

const user = {
    isPremium: true // Change to false to test hiding the button
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const username = localStorage.getItem("userName");
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // Redirect to login if no user is logged in
        if (!username || !token) {
            window.location.href = "login.html";
            return;
        }
        
        document.getElementById("username").innerText = username;
        fetchExpenses(userId);

        const response = await axios.get("http://localhost:3000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (user.isPremium) {
            premiumSection.style.display = "block";
            listOfUserLeaderDashbord();
        }else {
            premiumSection.style.display = "none";
        }

        // logout button click event
        document.getElementById("logout").addEventListener("click", logout);



    } catch (error) {
        console.error("Error fetching user:", error.response?.data || error);
        logout();
    }
});

async function listOfUserLeaderDashbord() {

    try {
        const res = await axios.get("http://localhost:3000/api/premium/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const users = res.data.user;
        
        users.sort((a, b) => Number(b.totalExpenses) - Number(a.totalExpenses));

        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = `
            <tr>
                <td>${user.username}</td>
                <td>${user.totalExpenses}</td>
            </tr>
            `
            userTableBody.innerHTML += row;
        });
        
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}


async function fetchExpenses(userId) {
    try{
        const res = await axios.get(`api/expenses?userId=${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const expensesList = document.getElementById('expensesList');

        expensesList.innerHTML = res.data.map(expense =>
            `<li id="user-${expense.id}">${expense.amount} - ${expense.category} - ${expense.description} 
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </li>`).join('');

        
        // listOfUserLeaderDashbord();

        
    } catch (error) {
        console.error("Error fetching expenses:", error.response?.data || error);
    }
    
}

async function deleteExpense(listId) {
    try {
        await axios.delete(`api/expenses/${listId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const userId = localStorage.getItem("userId");  
        fetchExpenses(userId);
    } catch (error) {
        console.error("Error deleting expense:", error.response?.data || error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName"); 
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const expenseId = document.getElementById("expensesId").value;
    const token = localStorage.getItem("token");
    
    const expense = {
            amount: form.amount.value,
            category: form.category.value,
            description: form.description.value,
            userId: userId
        };

    try {
        if(expenseId) {
            console.log(expenseId);
            await axios.put(`api/expenses/${expenseId}`, expense, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        else {
            await axios.post('api/expenses', expense,{
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        fetchExpenses(userId);
        form.reset();
        form.expensesId.value = '';
        
       
        
    } catch (error) {
        console.error("Error saving expense:", error);
    }
})

// Cashfree payment gateway integration

const cashfree = Cashfree({
    mode:"sandbox",
});

async function pay() {
    try{
        const res = await axios.post("http://localhost:3000/api/payments/pay",
            { },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }        
        );

        console.log("Payment initiated successfully:", res.data);

        const paymentSessionId = res.data.paymentSessionId;

        let checkOutOptions = {
            paymentSessionId: paymentSessionId,
            rediectTarget: "_self",
        };

        await cashfree.checkout(checkOutOptions);

    } catch (error) {
        console.error("Error making payment:", error);
    }
}

// logout button click event
document.getElementById("logout").addEventListener("click", logout);

// viewUsersBtn click event
viewUsersBtn.addEventListener("click", listOfUserLeaderDashbord);
