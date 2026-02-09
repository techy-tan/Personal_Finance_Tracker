// Store data in localStorage
// JS CODE
let currentUser = null;
let expenses = [];
let incomes = [];
let budgets = [];

// Load data when page loads
window.onload = function() {
    checkLogin();
    setTodayDate();
};

// Set today's date as default
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    if(document.getElementById('expenseDate')) {
        document.getElementById('expenseDate').value = today;
    }
    if(document.getElementById('incomeDate')) {
        document.getElementById('incomeDate').value = today;
    }
}

// Check if user is logged in
function checkLogin() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showApp();
        loadData();
    } else {
        showAuth();
    }
}

// Show/Hide Pages
function showAuth() {
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('appPage').classList.add('hidden');
}

function showApp() {
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('appPage').classList.remove('hidden');
}

// Toggle between login and register
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Register new user
function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    // Get all users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email exists
    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    showLogin();
}

// Login user
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showApp();
        loadData();
    } else {
        alert('Invalid email or password');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuth();
    }
}

// Load user data
function loadData() {
    expenses = JSON.parse(localStorage.getItem(currentUser.email + '_expenses') || '[]');
    incomes = JSON.parse(localStorage.getItem(currentUser.email + '_incomes') || '[]');
    budgets = JSON.parse(localStorage.getItem(currentUser.email + '_budgets') || '[]');
    updateDashboard();
}

// Save data
function saveData() {
    localStorage.setItem(currentUser.email + '_expenses', JSON.stringify(expenses));
    localStorage.setItem(currentUser.email + '_incomes', JSON.stringify(incomes));
    localStorage.setItem(currentUser.email + '_budgets', JSON.stringify(budgets));
}

// Show different tabs
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from buttons
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update content
    if (tabName === 'expenses') {
        displayExpenses();
    } else if (tabName === 'income') {
        displayIncomes();
    } else if (tabName === 'budget') {
        displayBudgets();
    } else if (tabName === 'dashboard') {
        updateDashboard();
    }
}

// Add Expense
function addExpense() {
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDesc').value;
    
    if (!amount || !category || !date) {
        alert('Please fill all required fields');
        return;
    }
    
    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        category,
        date,
        description
    };
    
    expenses.push(expense);
    saveData();
    
    // Clear form
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDesc').value = '';
    setTodayDate();
    
    alert('Expense added successfully!');
    displayExpenses();
    updateDashboard();
}

// Display Expenses
function displayExpenses() {
    const list = document.getElementById('expenseList');
    
    if (expenses.length === 0) {
        list.innerHTML = '<p>No expenses yet</p>';
        return;
    }
    
    list.innerHTML = '';
    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item expense';
        item.innerHTML = `
            <strong>₹${expense.amount}</strong>
            <span>Category: ${expense.category}</span>
            <span>Date: ${expense.date}</span>
            ${expense.description ? '<span>Note: ' + expense.description + '</span>' : ''}
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Delete Expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(e => e.id !== id);
        saveData();
        displayExpenses();
        updateDashboard();
    }
}

// Search Expenses
function searchExpenses() {
    const search = document.getElementById('searchExpense').value.toLowerCase();
    const filtered = expenses.filter(e => 
        e.category.toLowerCase().includes(search) || 
        (e.description && e.description.toLowerCase().includes(search))
    );
    displayFilteredExpenses(filtered);
}

// Filter Expenses by Category
function filterExpenses() {
    const category = document.getElementById('filterCategory').value;
    if (category === '') {
        displayExpenses();
    } else {
        const filtered = expenses.filter(e => e.category === category);
        displayFilteredExpenses(filtered);
    }
}

// Display Filtered Expenses
function displayFilteredExpenses(filtered) {
    const list = document.getElementById('expenseList');
    
    if (filtered.length === 0) {
        list.innerHTML = '<p>No expenses found</p>';
        return;
    }
    
    list.innerHTML = '';
    filtered.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item expense';
        item.innerHTML = `
            <strong>₹${expense.amount}</strong>
            <span>Category: ${expense.category}</span>
            <span>Date: ${expense.date}</span>
            ${expense.description ? '<span>Note: ' + expense.description + '</span>' : ''}
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Add Income
function addIncome() {
    const source = document.getElementById('incomeSource').value;
    const amount = document.getElementById('incomeAmount').value;
    const frequency = document.getElementById('incomeFrequency').value;
    const date = document.getElementById('incomeDate').value;
    
    if (!source || !amount || !frequency || !date) {
        alert('Please fill all fields');
        return;
    }
    
    const income = {
        id: Date.now(),
        source,
        amount: parseFloat(amount),
        frequency,
        date
    };
    
    incomes.push(income);
    saveData();
    
    // Clear form
    document.getElementById('incomeSource').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeFrequency').value = 'monthly';
    setTodayDate();
    
    alert('Income added successfully!');
    displayIncomes();
    updateDashboard();
}

// Display Incomes
function displayIncomes() {
    const list = document.getElementById('incomeList');
    
    if (incomes.length === 0) {
        list.innerHTML = '<p>No income sources yet</p>';
        return;
    }
    
    list.innerHTML = '';
    incomes.forEach(income => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <strong>₹${income.amount}</strong>
            <span>Source: ${income.source}</span>
            <span>Frequency: ${income.frequency}</span>
            <span>Date: ${income.date}</span>
            <button onclick="deleteIncome(${income.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Delete Income
function deleteIncome(id) {
    if (confirm('Are you sure you want to delete this income?')) {
        incomes = incomes.filter(i => i.id !== id);
        saveData();
        displayIncomes();
        updateDashboard();
    }
}

// Set Budget
function setBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = document.getElementById('budgetAmount').value;
    
    if (!category || !amount) {
        alert('Please fill all fields');
        return;
    }
    
    // Check if budget exists for category
    const existingIndex = budgets.findIndex(b => b.category === category);
    
    if (existingIndex !== -1) {
        budgets[existingIndex].amount = parseFloat(amount);
    } else {
        budgets.push({
            id: Date.now(),
            category,
            amount: parseFloat(amount)
        });
    }
    
    saveData();
    
    // Clear form
    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetAmount').value = '';
    
    alert('Budget set successfully!');
    displayBudgets();
}

// Display Budgets
function displayBudgets() {
    const list = document.getElementById('budgetList');
    
    if (budgets.length === 0) {
        list.innerHTML = '<p>No budgets set yet</p>';
        return;
    }
    
    list.innerHTML = '';
    budgets.forEach(budget => {
        // Calculate spent amount
        const spent = expenses
            .filter(e => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const percentage = Math.min((spent / budget.amount) * 100, 100);
        const progressClass = percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : '';
        
        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
            <h4>${budget.category}</h4>
            <p>Budget: ₹${budget.amount}</p>
            <p>Spent: ₹${spent.toFixed(2)}</p>
            <div class="progress-bar">
                <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
            </div>
            <p>${percentage.toFixed(1)}% used</p>
        `;
        list.appendChild(item);
    });
}

// Update Dashboard
function updateDashboard() {
    // Calculate totals
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Update stats
    document.getElementById('totalIncome').textContent = '₹' + totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = '₹' + totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = '₹' + balance.toFixed(2);
    
    // Display recent transactions (last 5)
    const recent = expenses.slice(-5).reverse();
    const recentList = document.getElementById('recentTransactions');
    
    if (recent.length === 0) {
        recentList.innerHTML = '<p>No transactions yet</p>';
        return;
    }
    
    recentList.innerHTML = '';
    recent.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'transaction-item expense';
        item.innerHTML = `
            <strong>₹${expense.amount}</strong>
            <span>Category: ${expense.category}</span>
            <span>Date: ${expense.date}</span>
        `;
        recentList.appendChild(item);
    });
}