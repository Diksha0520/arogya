// API Configuration
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuth() {
    authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
        currentUser = JSON.parse(userData);
        showUserInterface();
        loadDashboardData();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
    // Health tracking form
    document.getElementById('healthTrackingForm').addEventListener('submit', handleHealthTracking);
    
    // Scroll top button
    window.addEventListener('scroll', function() {
        const scrollTop = document.querySelector('.scroll-top');
        if (window.pageYOffset > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginSubmitBtn');
    const alert = document.getElementById('loginAlert');
    
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            currentUser = data.user;
            authToken = data.token;
            
            showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                closeModal('loginModal');
                showUserInterface();
                loadDashboardData();
            }, 1000);
        } else {
            showAlert('loginAlert', data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('loginAlert', 'Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('registerSubmitBtn');
    const alert = document.getElementById('registerAlert');
    
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    
    const formData = {
        fullName: document.getElementById('regFullName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Store auth data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            currentUser = data.user;
            authToken = data.token;
            
            showAlert('registerAlert', 'Account created successfully!', 'success');
            
            setTimeout(() => {
                closeModal('registerModal');
                showUserInterface();
                loadDashboardData();
            }, 1000);
        } else {
            showAlert('registerAlert', data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('registerAlert', 'Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

// Handle Contact Form
async function handleContactForm(e) {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn');
    const alert = document.getElementById('contactAlert');
    
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        concern: document.getElementById('concern').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('contactAlert', 'Thank you! We\'ve received your message and will get back to you within 24 hours.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            showAlert('contactAlert', data.error || 'Failed to send message', 'error');
        }
    } catch (error) {
        showAlert('contactAlert', 'Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
}

// Handle Health Tracking
async function handleHealthTracking(e) {
    e.preventDefault();
    const btn = document.getElementById('healthTrackingSubmitBtn');
    const alert = document.getElementById('healthTrackingAlert');
    
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    const formData = {
        date: new Date().toISOString(),
        weight: parseFloat(document.getElementById('weight').value) || null,
        mood: document.getElementById('mood').value,
        energyLevel: parseInt(document.getElementById('energyLevel').value) || null,
        sleepHours: parseFloat(document.getElementById('sleepHours').value) || null,
        waterIntake: parseInt(document.getElementById('waterIntake').value) || null,
        exerciseMinutes: parseInt(document.getElementById('exerciseMinutes').value) || null,
        notes: document.getElementById('healthNotes').value
    };

    try {
        const response = await fetch(`${API_URL}/health-tracking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('healthTrackingAlert', 'Health data saved successfully!', 'success');
            document.getElementById('healthTrackingForm').reset();
            
            setTimeout(() => {
                closeModal('healthTrackingModal');
                loadDashboardData();
            }, 1500);
        } else {
            showAlert('healthTrackingAlert', data.error || 'Failed to save data', 'error');
        }
    } catch (error) {
        showAlert('healthTrackingAlert', 'Network error. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Health Data';
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_URL}/analytics/dashboard`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Update dashboard cards
            document.getElementById('healthEntriesCount').textContent = data.healthTracking.entriesCount;
            document.getElementById('avgWaterIntake').textContent = data.healthTracking.avgWaterIntake;
            document.getElementById('avgSleep').textContent = data.healthTracking.avgSleep;
            document.getElementById('avgEnergy').textContent = data.healthTracking.avgEnergy;
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Show user interface after login
function showUserInterface() {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userMenu').classList.add('active');
    
    // Set user avatar
    if (currentUser && currentUser.fullName) {
        document.getElementById('userAvatar').textContent = currentUser.fullName.charAt(0).toUpperCase();
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    authToken = null;
    
    document.getElementById('authButtons').style.display = 'block';
    document.getElementById('userMenu').classList.remove('active');
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('home').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Alert function
function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} show`;
    alert.textContent = message;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}