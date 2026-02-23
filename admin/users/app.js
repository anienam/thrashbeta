// app.js
// app.js


//const API = "http://localhost:5000/api/v1"; 
const API = "https://trashbeta.onrender.com/api/v1";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// =============================
// SESSION HANDLING
// =============================
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

if (!token || !role || (role !== "admin")) {
  clearUserSession();
  window.location.href = "../../auth/login.html";
} else {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      clearUserSession();
      window.location.href = "../../auth/login.html";
    } else {
      setTimeout(() => {
        clearUserSession();
        window.location.href = "../../auth/login.html";
      }, expiryTime);
    }
  } catch (err) {
    clearUserSession();
    window.location.href = "../../auth/login.html";
  }
}


// DOM elements
const statsContainer = document.getElementById('stats');
const tbody = document.getElementById('tbody');
const typeBtn = document.getElementById('typeBtn');
const typeDrop = document.getElementById('typeDrop');

// State
let users = [];
let filteredUsers = [];
let selectedRole = 'All';


/* =========================================================
   AUTH HEADERS
========================================================= */

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

/* =========================================================
   USER PROFILE (NAME + AVATAR)
========================================================= */
async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
    const user = await res.json();

    const fullName = `${user.firstName} ${user.lastName}`;
    const avatar = user.avatar || "https://i.pravatar.cc/80?img=12";

    document.querySelector(".userchip__name").textContent = fullName;
    document.querySelector(".userchip__avatar").src = avatar;
    document.querySelector(".avatar").src = avatar;
  } catch (err) {
    console.error("Failed to load user profile", err);
  }
}







// ================================
// Fetch all users
// ================================
async function fetchUsers() {
  try {
    const res = await fetch(`${API}/auth/users?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    users = data.users || [];
    applyFilter();
    renderStats();
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

// ================================
// Render KPI stats
// ================================
function renderStats() {
  const totalUsers = users.length;
  const totalResidents = users.filter(u => u.role === 'resident').length;
  const totalStaff = users.filter(u => u.role === 'staff').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <h3>Total Users</h3>
      <p>${totalUsers}</p>
    </div>
    <div class="stat-card">
      <h3>Residents</h3>
      <p>${totalResidents}</p>
    </div>
    <div class="stat-card">
      <h3>Staff</h3>
      <p>${totalStaff}</p>
    </div>
    <div class="stat-card">
      <h3>Admins</h3>
      <p>${totalAdmins}</p>
    </div>
  `;
}

// ================================
// Render user table
// ================================
let currentPage = 1;
const pageSize = 10;

function renderTable(usersList) {
  tbody.innerHTML = '';

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageUsers = usersList.slice(start, end);

  pageUsers.forEach(user => {
    const fullName = `${user.firstName || (user.profile?.firstName || 'John')} ${user.lastName || (user.profile?.lastName || 'Doe')}`;
    const avatar = user.profile?.avatar || 'https://i.pravatar.cc/80?img=12';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user-cell">
        <img class="avatar-sm" src="${avatar}" alt="${fullName}" />
        <span>${fullName}</span>
      </td>
      <td>${capitalize(user.role)}</td>
      <td>${user.isVerified ? 'Active' : 'Inactive'}</td>
      <td>${user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</td>
      <td>
        <button class="btn btn--ghost" onclick="viewUser('${user._id}')">View</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update range hint
  const total = usersList.length;
  const from = start + 1;
  const to = Math.min(end, total);
  document.getElementById('rangeHint').textContent = `Showing ${from} to ${to} out of ${total} users`;
}

// Pagination buttons
document.querySelectorAll('.pager .pg').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.textContent === 'Next') {
      if (currentPage * pageSize < filteredUsers.length) currentPage++;
    } else if (btn.textContent === 'Previous') {
      if (currentPage > 1) currentPage--;
    } else {
      currentPage = parseInt(btn.textContent);
    }
    renderTable(filteredUsers);
    updatePagerActive();
  });
});

function updatePagerActive() {
  document.querySelectorAll('.pager .pg').forEach(btn => {
    btn.classList.remove('is-active');
    if (parseInt(btn.textContent) === currentPage) btn.classList.add('is-active');
  });
}



// ================================
// Filter
// ================================
function applyFilter() {
  if (selectedRole === 'All') {
    filteredUsers = users;
  } else {
    filteredUsers = users.filter(u => {
      // Map backend role to dropdown label
      let roleLabel = '';
      switch(u.role) {
        case 'resident': roleLabel = 'Resident'; break;
        case 'staff': roleLabel = 'Collection Staff'; break;
        case 'admin': roleLabel = 'Admin'; break;
      }
      return roleLabel === selectedRole;
    });
  }
  renderTable(filteredUsers);
}



// ================================
// Capitalize helper
// ================================
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ================================
// Dropdown filter event
// ================================
typeBtn.addEventListener('click', () => {
  typeDrop.hidden = !typeDrop.hidden;
});

typeDrop.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRole = btn.dataset.type;
    typeBtn.textContent = `Type ${selectedRole}`;
    typeDrop.hidden = true;
    applyFilter();
  });
});

// ================================
// View user (placeholder)
// ================================
function viewUser(id) {
  alert('View user: ' + id);
}

// ================================
// Initialize
// ================================
fetchUsers();
loadUserProfile();
