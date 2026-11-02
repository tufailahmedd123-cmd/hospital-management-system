/* ==========================================================================
   HOSPITAL MANAGEMENT SYSTEM (HMS) - CORE JAVASCRIPT
   Vanilla ES6+ Smart Healthcare Platform Engine
   ========================================================================== */

import {
  STORAGE_KEYS,
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_OPD,
  INITIAL_ADMISSIONS,
  INITIAL_BEDS,
  INITIAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICINES,
  INITIAL_BILLS,
  INITIAL_LAB_TESTS,
  INITIAL_STAFF,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  getStorageData,
  setStorageData,
  initializeDemoData
} from './data.js';

// Global Application State in Memory
const state = {
  currentUser: null,
  users: [],
  patients: [],
  doctors: [],
  departments: [],
  appointments: [],
  opdVisits: [],
  admissions: [],
  beds: [],
  records: [],
  prescriptions: [],
  medicines: [],
  bills: [],
  labTests: [],
  staff: [],
  notifications: [],
  settings: {},
  activeView: 'dashboard',
  charts: {}
};

/* --------------------------------------------------------------------------
   1. INITIALIZATION & STATE MANAGEMENT
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initializeDemoData(false);
  loadAllState();
  initTheme();
  setupGlobalEvents();
  startClock();

  // Check saved session
  const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      showApp();
    } catch {
      showLogin();
    }
  } else {
    showLogin();
  }
});

function loadAllState() {
  state.users = getStorageData(STORAGE_KEYS.USERS, INITIAL_USERS);
  state.patients = getStorageData(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  state.doctors = getStorageData(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  state.departments = getStorageData(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  state.appointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  state.opdVisits = getStorageData(STORAGE_KEYS.OPD_VISITS, INITIAL_OPD);
  state.admissions = getStorageData(STORAGE_KEYS.ADMISSIONS, INITIAL_ADMISSIONS);
  state.beds = getStorageData(STORAGE_KEYS.BEDS, INITIAL_BEDS);
  state.records = getStorageData(STORAGE_KEYS.RECORDS, INITIAL_RECORDS);
  state.prescriptions = getStorageData(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  state.medicines = getStorageData(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
  state.bills = getStorageData(STORAGE_KEYS.BILLS, INITIAL_BILLS);
  state.labTests = getStorageData(STORAGE_KEYS.LAB_TESTS, INITIAL_LAB_TESTS);
  state.staff = getStorageData(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  state.notifications = getStorageData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  state.settings = getStorageData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

function persist(key, data) {
  state[key] = data;
  setStorageData(STORAGE_KEYS[key.toUpperCase()] || `hms_${key}`, data);
}

function startClock() {
  const clockEl = document.getElementById('live-clock');
  const update = () => {
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };
  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. THEME & NOTIFICATIONS
   -------------------------------------------------------------------------- */
function initTheme() {
  const currentTheme = state.settings.theme || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
}

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  state.settings.theme = next;
  setStorageData(STORAGE_KEYS.SETTINGS, state.settings);
  updateThemeIcon(next);
  showToast(`Switched to ${next} mode`, 'info');
};

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
  }
}

function updateNotificationBadge() {
  const countEl = document.getElementById('unread-notif-count');
  const listEl = document.getElementById('notifications-container');
  if (!countEl || !listEl) return;

  const unread = state.notifications.filter(n => !n.read);
  countEl.textContent = unread.length;
  countEl.style.display = unread.length ? 'flex' : 'none';

  if (!state.notifications.length) {
    listEl.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.8rem;">No notifications</div>`;
    return;
  }

  listEl.innerHTML = state.notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}')">
      <div class="notif-icon"><i class="fa-solid ${n.icon || 'fa-bell'}"></i></div>
      <div class="notif-content">
        <div class="title">${escapeHtml(n.title)}</div>
        <div style="color:var(--text-muted);font-size:0.75rem;margin-bottom:0.2rem;">${escapeHtml(n.message)}</div>
        <div class="time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

window.markNotificationRead = function(id) {
  const notif = state.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    persist('notifications', state.notifications);
    updateNotificationBadge();
  }
};

window.markAllNotificationsAsRead = function() {
  state.notifications.forEach(n => n.read = true);
  persist('notifications', state.notifications);
  updateNotificationBadge();
  showToast('All notifications marked as read', 'success');
};

function addNotification(title, message, icon = 'fa-bell') {
  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    title,
    message,
    time: 'Just now',
    read: false,
    icon
  };
  state.notifications.unshift(newNotif);
  persist('notifications', state.notifications);
  updateNotificationBadge();
}

/* --------------------------------------------------------------------------
   3. AUTHENTICATION & ROLE-BASED ACCESS CONTROL
   -------------------------------------------------------------------------- */
window.fillDemoCredentials = function(role) {
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  if (role === 'admin') {
    emailInput.value = 'admin@hms.com';
    pwdInput.value = 'admin123';
  } else if (role === 'doctor') {
    emailInput.value = 'doctor@hms.com';
    pwdInput.value = 'doctor123';
  } else if (role === 'receptionist') {
    emailInput.value = 'reception@hms.com';
    pwdInput.value = 'reception123';
  }
};

function showLogin() {
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'flex';
  
  // Update sidebar user credentials
  const roleName = state.currentUser.role.toUpperCase();
  document.getElementById('sidebar-role-badge').textContent = `${roleName} SUITE`;
  document.getElementById('sidebar-user-avatar').textContent = state.currentUser.avatar || 'US';
  document.getElementById('sidebar-user-name').textContent = state.currentUser.name;
  document.getElementById('sidebar-user-role').textContent = state.currentUser.title;

  buildSidebarNav();
  updateNotificationBadge();
  switchView('dashboard');
}

function setupGlobalEvents() {
  // Login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pwd = document.getElementById('login-password').value.trim();
      const remember = document.getElementById('login-remember').checked;

      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pwd);
      if (user) {
        state.currentUser = user;
        if (remember) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
          sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
        showToast(`Welcome back, ${user.name}!`, 'success');
        showApp();
      } else {
        showToast('Invalid email or password. Please use demo credentials.', 'danger');
      }
    });
  }

  // Password toggle
  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  if (btnTogglePwd) {
    btnTogglePwd.addEventListener('click', () => {
      const pwdField = document.getElementById('login-password');
      const isPwd = pwdField.type === 'password';
      pwdField.type = isPwd ? 'text' : 'password';
      btnTogglePwd.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // Theme toggle button
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', window.toggleTheme);
  }

  // Bell toggle
  const bellBtn = document.getElementById('btn-bell');
  const notifDropdown = document.getElementById('notification-dropdown');
  if (bellBtn && notifDropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      notifDropdown.classList.remove('show');
    });
    notifDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  // Sidebar toggle
  const btnSidebar = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.getElementById('app-sidebar');
  if (btnSidebar && sidebar) {
    btnSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

window.promptLogout = function() {
  openModal({
    title: 'Confirm Sign Out',
    body: `<p>Are you sure you want to end your current session?</p>`,
    confirmText: 'Logout',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      state.currentUser = null;
      showLogin();
      showToast('You have been logged out successfully', 'info');
    }
  });
};

/* --------------------------------------------------------------------------
   4. ROLE-BASED NAVIGATION
   -------------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', roles: ['admin', 'doctor', 'receptionist'] },
  { id: 'patients', label: 'Patients', icon: 'fa-user-injured', roles: ['admin', 'doctor', 'receptionist'] },
  { id: 'doctors', label: 'Doctors', icon: 'fa-user-doctor', roles: ['admin', 'receptionist'] },
  { id: 'appointments', label: 'Appointments', icon: 'fa-calendar-check', roles: ['admin', 'doctor', 'receptionist'] },
  { id: 'opd', label: 'OPD Queue', icon: 'fa-stethoscope', roles: ['admin', 'doctor', 'receptionist'] },
  { id: 'admissions', label: 'Admissions', icon: 'fa-hospital-user', roles: ['admin', 'doctor', 'receptionist'] },
  { id: 'beds', label: 'Bed Matrix', icon: 'fa-bed-pulse', roles: ['admin', 'receptionist'] },
  { id: 'records', label: 'Medical Records', icon: 'fa-file-waveform', roles: ['admin', 'doctor'] },
  { id: 'prescriptions', label: 'Prescriptions', icon: 'fa-prescription', roles: ['admin', 'doctor'] },
  { id: 'pharmacy', label: 'Pharmacy Inventory', icon: 'fa-pills', roles: ['admin'] },
  { id: 'billing', label: 'Billing & Invoices', icon: 'fa-file-invoice-dollar', roles: ['admin', 'receptionist'] },
  { id: 'lab', label: 'Laboratory Tests', icon: 'fa-flask-vial', roles: ['admin', 'doctor'] },
  { id: 'departments', label: 'Departments', icon: 'fa-building-shield', roles: ['admin'] },
  { id: 'staff', label: 'Staff Management', icon: 'fa-users-gear', roles: ['admin'] },
  { id: 'reports', label: 'Reports & Analytics', icon: 'fa-chart-pie', roles: ['admin', 'receptionist'] },
  { id: 'settings', label: 'System Settings', icon: 'fa-gear', roles: ['admin', 'doctor', 'receptionist'] }
];

function buildSidebarNav() {
  const navContainer = document.getElementById('sidebar-navigation');
  if (!navContainer) return;

  const userRole = state.currentUser?.role || 'admin';
  const accessible = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  let html = `<div class="nav-section-label">Main Navigation</div>`;
  accessible.forEach(item => {
    html += `
      <div class="nav-item ${state.activeView === item.id ? 'active' : ''}" onclick="switchView('${item.id}')">
        <i class="fa-solid ${item.icon}"></i>
        <span>${item.label}</span>
      </div>
    `;
  });

  navContainer.innerHTML = html;
}

window.switchView = function(viewId) {
  state.activeView = viewId;
  const breadcrumb = document.getElementById('topbar-breadcrumb');
  const targetNav = NAV_ITEMS.find(n => n.id === viewId);
  if (breadcrumb && targetNav) {
    breadcrumb.textContent = targetNav.label;
  }

  // Update active state in sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
    const text = el.querySelector('span')?.textContent;
    if (text === targetNav?.label) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');

  const viewport = document.getElementById('main-viewport');
  if (!viewport) return;

  // Render view content
  switch (viewId) {
    case 'dashboard': renderDashboard(viewport); break;
    case 'patients': renderPatients(viewport); break;
    case 'doctors': renderDoctors(viewport); break;
    case 'appointments': renderAppointments(viewport); break;
    case 'opd': renderOPD(viewport); break;
    case 'admissions': renderAdmissions(viewport); break;
    case 'beds': renderBeds(viewport); break;
    case 'records': renderRecords(viewport); break;
    case 'prescriptions': renderPrescriptions(viewport); break;
    case 'pharmacy': renderPharmacy(viewport); break;
    case 'billing': renderBilling(viewport); break;
    case 'lab': renderLab(viewport); break;
    case 'departments': renderDepartments(viewport); break;
    case 'staff': renderStaff(viewport); break;
    case 'reports': renderReports(viewport); break;
    case 'settings': renderSettings(viewport); break;
    default: renderDashboard(viewport);
  }
};

/* --------------------------------------------------------------------------
   5. VIEW: DASHBOARD
   -------------------------------------------------------------------------- */
function renderDashboard(container) {
  const totalPatients = state.patients.length;
  const totalDoctors = state.doctors.length;
  const totalAppointments = state.appointments.length;
  const todayAppointments = state.appointments.filter(a => a.date === '2026-11-02').length;
  const availableBeds = state.beds.filter(b => b.status === 'Available').length;
  const totalBeds = state.beds.length;
  const opdToday = state.opdVisits.length;
  const totalRevenue = state.bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

  container.innerHTML = `
    <!-- Top KPI Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Patients</div>
          <div class="value tabular-nums">${totalPatients}</div>
          <div class="subtitle"><i class="fa-solid fa-arrow-trend-up text-success"></i> Registered in HMS</div>
        </div>
        <div class="stat-icon blue"><i class="fa-solid fa-user-injured"></i></div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Active Doctors</div>
          <div class="value tabular-nums">${totalDoctors}</div>
          <div class="subtitle"><i class="fa-solid fa-user-doctor text-primary"></i> 9 Departments</div>
        </div>
        <div class="stat-icon teal"><i class="fa-solid fa-stethoscope"></i></div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Today's Appointments</div>
          <div class="value tabular-nums">${todayAppointments}</div>
          <div class="subtitle"><i class="fa-solid fa-calendar-check text-info"></i> ${totalAppointments} total booked</div>
        </div>
        <div class="stat-icon amber"><i class="fa-solid fa-calendar-day"></i></div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Available Beds</div>
          <div class="value tabular-nums">${availableBeds} / ${totalBeds}</div>
          <div class="subtitle"><i class="fa-solid fa-bed-pulse text-success"></i> ${Math.round((availableBeds/totalBeds)*100)}% capacity free</div>
        </div>
        <div class="stat-icon green"><i class="fa-solid fa-bed-pulse"></i></div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="label">OPD Queue Today</div>
          <div class="value tabular-nums">${opdToday}</div>
          <div class="subtitle"><i class="fa-solid fa-clock text-warning"></i> Active visits</div>
        </div>
        <div class="stat-icon purple"><i class="fa-solid fa-hospital-user"></i></div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Revenue Collected</div>
          <div class="value tabular-nums">$${totalRevenue.toLocaleString()}</div>
          <div class="subtitle"><i class="fa-solid fa-file-invoice text-success"></i> 15 Invoices generated</div>
        </div>
        <div class="stat-icon blue"><i class="fa-solid fa-dollar-sign"></i></div>
      </div>
    </div>

    <!-- Quick Action Launchpad -->
    <div class="card">
      <div class="card-header">
        <h3><i class="fa-solid fa-bolt text-primary"></i> Quick Healthcare Actions</h3>
      </div>
      <div class="card-body">
        <div class="quick-actions-grid">
          <div class="quick-action-card" onclick="openPatientModal()">
            <i class="fa-solid fa-user-plus"></i>
            <span>Register Patient</span>
          </div>
          <div class="quick-action-card" onclick="openAppointmentModal()">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Book Appointment</span>
          </div>
          <div class="quick-action-card" onclick="openOPDModal()">
            <i class="fa-solid fa-ticket"></i>
            <span>Register OPD</span>
          </div>
          <div class="quick-action-card" onclick="openAdmissionModal()">
            <i class="fa-solid fa-bed"></i>
            <span>Admit Patient</span>
          </div>
          <div class="quick-action-card" onclick="openBillModal()">
            <i class="fa-solid fa-receipt"></i>
            <span>Generate Bill</span>
          </div>
          <div class="quick-action-card" onclick="switchView('beds')">
            <i class="fa-solid fa-border-all"></i>
            <span>Check Beds</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <div class="card" style="margin-bottom:0;">
        <div class="card-header">
          <h3><i class="fa-solid fa-chart-line text-primary"></i> Clinical Volume & Patient Admissions (2026)</h3>
        </div>
        <div class="card-body">
          <div class="chart-wrapper">
            <canvas id="chart-patient-volume"></canvas>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:0;">
        <div class="card-header">
          <h3><i class="fa-solid fa-chart-pie text-secondary"></i> Department Patient Share</h3>
        </div>
        <div class="card-body">
          <div class="chart-wrapper">
            <canvas id="chart-dept-share"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Schedule Table & Recent Admissions Split -->
    <div style="display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; margin-top: 1.5rem;">
      <div class="card" style="margin-bottom:0;">
        <div class="card-header">
          <h3><i class="fa-solid fa-calendar-day text-primary"></i> Today's Scheduled Appointments</h3>
          <button class="btn btn-outline btn-sm" onclick="switchView('appointments')">View All</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Dept</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.appointments.slice(0, 5).map(apt => `
                <tr>
                  <td class="tabular-nums font-semibold">${apt.time}</td>
                  <td><b>${escapeHtml(apt.patientName)}</b></td>
                  <td>${escapeHtml(apt.doctor)}</td>
                  <td>${escapeHtml(apt.department)}</td>
                  <td><span class="badge ${getStatusBadge(apt.status)}">${apt.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="openPatientProfileModal('${apt.patientId}')" title="View Patient Profile">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:0;">
        <div class="card-header">
          <h3><i class="fa-solid fa-bed-pulse text-danger"></i> Inpatient Ward Status</h3>
          <button class="btn btn-outline btn-sm" onclick="switchView('admissions')">Manage</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Bed</th>
                <th>Patient</th>
                <th>Ward</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.beds.filter(b => b.status === 'Occupied').slice(0, 5).map(bed => `
                <tr>
                  <td><b>${bed.bedNumber}</b></td>
                  <td>${escapeHtml(bed.patientName || 'Occupied')}</td>
                  <td>${escapeHtml(bed.ward)}</td>
                  <td><span class="badge badge-danger">Occupied</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  initDashboardCharts();
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Volume
  const ctx1 = document.getElementById('chart-patient-volume');
  if (ctx1) {
    if (state.charts.volume) state.charts.volume.destroy();
    state.charts.volume = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'OPD Consultations',
            data: [420, 530, 610, 580, 720, 810, 890, 860, 910, 980, 1040],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            fill: true,
            tension: 0.35
          },
          {
            label: 'Inpatient Admissions',
            data: [65, 80, 95, 88, 110, 125, 140, 132, 145, 160, 175],
            borderColor: '#0d9488',
            backgroundColor: 'transparent',
            borderDash: [4, 4],
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }

  // Chart 2: Departments
  const ctx2 = document.getElementById('chart-dept-share');
  if (ctx2) {
    if (state.charts.dept) state.charts.dept.destroy();
    state.charts.dept = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery', 'Other'],
        datasets: [{
          data: [28, 15, 20, 16, 12, 9],
          backgroundColor: ['#0284c7', '#0d9488', '#6366f1', '#eab308', '#ec4899', '#94a3b8']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. VIEW: PATIENTS MANAGEMENT (CRITICAL MODULE)
   -------------------------------------------------------------------------- */
function renderPatients(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Patient Management</h2>
        <p>Comprehensive patient records, medical demographics, history & admission profiles</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="exportPatientsCSV()">
          <i class="fa-solid fa-file-csv"></i> Export CSV
        </button>
        <button class="btn btn-primary" onclick="openPatientModal()">
          <i class="fa-solid fa-user-plus"></i> Register New Patient
        </button>
      </div>
    </div>

    <!-- Filter & Search Strip -->
    <div class="card">
      <div class="card-body" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom:0;">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="patient-search-input" placeholder="Search by patient name, ID, phone, or CNIC..." oninput="filterPatientsTable()" />
          </div>
          <select id="patient-dept-filter" class="select-filter" onchange="filterPatientsTable()">
            <option value="">All Departments</option>
            ${state.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select>
          <select id="patient-status-filter" class="select-filter" onchange="filterPatientsTable()">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Patients Data Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table" id="patients-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name & Demographics</th>
              <th>Gender / Age</th>
              <th>Contact Phone</th>
              <th>Blood Group</th>
              <th>Department & Doctor</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="patients-tbody">
            <!-- Filtered rows render here -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterPatientsTable();
}

window.filterPatientsTable = function() {
  const query = (document.getElementById('patient-search-input')?.value || '').toLowerCase();
  const dept = document.getElementById('patient-dept-filter')?.value || '';
  const status = document.getElementById('patient-status-filter')?.value || '';
  const tbody = document.getElementById('patients-tbody');
  if (!tbody) return;

  const filtered = state.patients.filter(p => {
    const matchQuery = !query || 
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.phone.toLowerCase().includes(query) ||
      (p.cnic && p.cnic.toLowerCase().includes(query));
    const matchDept = !dept || p.department === dept;
    const matchStatus = !status || p.status === status;
    return matchQuery && matchDept && matchStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">No patients match the search criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td><span class="tabular-nums" style="font-weight:700;color:var(--primary);">${p.id}</span></td>
      <td>
        <div style="font-weight:600;color:var(--text-main);">${escapeHtml(p.name)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Father: ${escapeHtml(p.fatherName || 'N/A')}</div>
      </td>
      <td>${escapeHtml(p.gender)} / ${p.age} yrs</td>
      <td><span class="tabular-nums">${escapeHtml(p.phone)}</span></td>
      <td><span class="badge badge-info font-bold">${p.bloodGroup}</span></td>
      <td>
        <div>${escapeHtml(p.department)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(p.doctor || 'Unassigned')}</div>
      </td>
      <td><span class="badge ${getStatusBadge(p.status)}">${p.status}</span></td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn btn-outline btn-sm" onclick="openPatientProfileModal('${p.id}')" title="View Full Profile">
          <i class="fa-solid fa-address-card"></i> Profile
        </button>
        <button class="btn btn-outline btn-sm" onclick="openPatientModal('${p.id}')" title="Edit Patient Record">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="deletePatientRecord('${p.id}')" title="Delete Patient Record">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
};

window.openPatientModal = function(editId = null) {
  const patient = editId ? state.patients.find(p => p.id === editId) : null;
  const isEdit = !!patient;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-user-pen"></i> Edit Patient (${patient.id})` : `<i class="fa-solid fa-user-plus"></i> Register New Patient`,
    sizeClass: 'modal-lg',
    body: `
      <form id="patient-form">
        <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:0.75rem;color:var(--primary);border-bottom:1px solid var(--border-color);padding-bottom:0.35rem;">1. Personal Information</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <input type="text" id="p-name" class="form-control" required value="${patient ? escapeHtml(patient.name) : ''}" placeholder="e.g. Johnathan Doe" />
          </div>
          <div class="form-group">
            <label>Father / Guardian Name</label>
            <input type="text" id="p-father" class="form-control" value="${patient ? escapeHtml(patient.fatherName) : ''}" placeholder="e.g. Robert Doe" />
          </div>
          <div class="form-group">
            <label>Gender <span class="required">*</span></label>
            <select id="p-gender" class="form-control" required>
              <option value="Male" ${patient?.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${patient?.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Other" ${patient?.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Date of Birth <span class="required">*</span></label>
            <input type="date" id="p-dob" class="form-control" required value="${patient ? patient.dob : '1990-01-01'}" />
          </div>
          <div class="form-group">
            <label>Blood Group <span class="required">*</span></label>
            <select id="p-blood" class="form-control" required>
              ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => `
                <option value="${bg}" ${patient?.bloodGroup === bg ? 'selected' : ''}>${bg}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>CNIC / National ID <span class="required">*</span></label>
            <input type="text" id="p-cnic" class="form-control" required value="${patient ? escapeHtml(patient.cnic) : ''}" placeholder="42101-0000000-0" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Phone Number <span class="required">*</span></label>
            <input type="tel" id="p-phone" class="form-control" required value="${patient ? escapeHtml(patient.phone) : ''}" placeholder="+1 (555) 000-0000" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="p-email" class="form-control" value="${patient ? escapeHtml(patient.email) : ''}" placeholder="patient@example.com" />
          </div>
          <div class="form-group">
            <label>Emergency Contact</label>
            <input type="text" id="p-emergency" class="form-control" value="${patient ? escapeHtml(patient.emergencyContact) : ''}" placeholder="+1 (555) 123-4567 (Spouse)" />
          </div>
        </div>

        <div class="form-group">
          <label>Residential Address</label>
          <input type="text" id="p-address" class="form-control" value="${patient ? escapeHtml(patient.address) : ''}" placeholder="Full street address, City" />
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;margin:1.25rem 0 0.75rem;color:var(--primary);border-bottom:1px solid var(--border-color);padding-bottom:0.35rem;">2. Medical Background</h4>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Known Allergies</label>
            <input type="text" id="p-allergies" class="form-control" value="${patient ? escapeHtml(patient.allergies) : ''}" placeholder="e.g. Penicillin, NSAIDs, Peanuts" />
          </div>
          <div class="form-group">
            <label>Existing Pre-conditions</label>
            <input type="text" id="p-conditions" class="form-control" value="${patient ? escapeHtml(patient.conditions) : ''}" placeholder="e.g. Type 2 Diabetes, Hypertension" />
          </div>
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;margin:1.25rem 0 0.75rem;color:var(--primary);border-bottom:1px solid var(--border-color);padding-bottom:0.35rem;">3. Clinical Assignment</h4>
        <div class="form-grid-3">
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select id="p-dept" class="form-control" required onchange="updateDoctorDropdownByDept(this.value, 'p-doctor')">
              ${state.departments.map(d => `<option value="${d.name}" ${patient?.department === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Assigned Doctor <span class="required">*</span></label>
            <select id="p-doctor" class="form-control" required>
              ${state.doctors.map(doc => `<option value="${doc.name}" ${patient?.doctor === doc.name ? 'selected' : ''}>${doc.name} (${doc.specialization})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Status <span class="required">*</span></label>
            <select id="p-status" class="form-control" required>
              <option value="Active" ${patient?.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Admitted" ${patient?.status === 'Admitted' ? 'selected' : ''}>Admitted</option>
              <option value="Discharged" ${patient?.status === 'Discharged' ? 'selected' : ''}>Discharged</option>
              <option value="Inactive" ${patient?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Register Patient',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const name = document.getElementById('p-name').value.trim();
      const phone = document.getElementById('p-phone').value.trim();
      if (!name || !phone) {
        showToast('Please provide patient name and phone number', 'warning');
        return false;
      }

      const dob = document.getElementById('p-dob').value;
      const birthYear = new Date(dob).getFullYear();
      const age = new Date().getFullYear() - birthYear || 30;

      if (isEdit) {
        Object.assign(patient, {
          name,
          fatherName: document.getElementById('p-father').value.trim(),
          gender: document.getElementById('p-gender').value,
          dob,
          age,
          bloodGroup: document.getElementById('p-blood').value,
          cnic: document.getElementById('p-cnic').value.trim(),
          phone,
          email: document.getElementById('p-email').value.trim(),
          address: document.getElementById('p-address').value.trim(),
          emergencyContact: document.getElementById('p-emergency').value.trim(),
          allergies: document.getElementById('p-allergies').value.trim(),
          conditions: document.getElementById('p-conditions').value.trim(),
          department: document.getElementById('p-dept').value,
          doctor: document.getElementById('p-doctor').value,
          status: document.getElementById('p-status').value
        });
        persist('patients', state.patients);
        showToast(`Patient ${patient.id} updated successfully`, 'success');
      } else {
        const newId = `P-${1000 + state.patients.length + 1}`;
        const newPatient = {
          id: newId,
          name,
          fatherName: document.getElementById('p-father').value.trim(),
          gender: document.getElementById('p-gender').value,
          dob,
          age,
          bloodGroup: document.getElementById('p-blood').value,
          cnic: document.getElementById('p-cnic').value.trim(),
          phone,
          email: document.getElementById('p-email').value.trim(),
          address: document.getElementById('p-address').value.trim(),
          emergencyContact: document.getElementById('p-emergency').value.trim(),
          allergies: document.getElementById('p-allergies').value.trim(),
          conditions: document.getElementById('p-conditions').value.trim(),
          notes: 'Registered via front desk portal',
          regDate: new Date().toISOString().split('T')[0],
          department: document.getElementById('p-dept').value,
          doctor: document.getElementById('p-doctor').value,
          status: document.getElementById('p-status').value
        };
        state.patients.unshift(newPatient);
        persist('patients', state.patients);
        addNotification('New Patient Registered', `${newPatient.name} registered and assigned to ${newPatient.doctor}`, 'fa-user-plus');
        showToast(`Patient ${newId} registered successfully`, 'success');
      }

      if (state.activeView === 'patients') filterPatientsTable();
      return true;
    }
  });
};

window.deletePatientRecord = function(id) {
  const patient = state.patients.find(p => p.id === id);
  if (!patient) return;

  openModal({
    title: `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Delete Patient Record`,
    body: `
      <p>Are you sure you want to delete patient <b>${escapeHtml(patient.name)}</b> (<code>${patient.id}</code>)?</p>
      <p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.5rem;">This will permanently remove their records from local database storage.</p>
    `,
    confirmText: 'Delete Record',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      state.patients = state.patients.filter(p => p.id !== id);
      persist('patients', state.patients);
      showToast(`Patient ${id} deleted`, 'info');
      if (state.activeView === 'patients') filterPatientsTable();
    }
  });
};

/* --------------------------------------------------------------------------
   7. VIEW: PATIENT COMPREHENSIVE PROFILE MODAL
   -------------------------------------------------------------------------- */
window.openPatientProfileModal = function(id) {
  const p = state.patients.find(pt => pt.id === id);
  if (!p) {
    showToast('Patient record not found', 'warning');
    return;
  }

  const patientApts = state.appointments.filter(a => a.patientId === id);
  const patientRecs = state.records.filter(r => r.patientId === id);
  const patientRxs = state.prescriptions.filter(rx => rx.patientId === id);
  const patientBills = state.bills.filter(b => b.patientId === id);

  openModal({
    title: `<i class="fa-solid fa-id-card-clip"></i> Patient Profile: ${escapeHtml(p.name)} (${p.id})`,
    sizeClass: 'modal-lg',
    body: `
      <!-- Profile Header Summary Banner -->
      <div style="background:var(--bg-surface-alt);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:1.25rem;display:flex;gap:1.25rem;align-items:center;margin-bottom:1.5rem;">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--primary-light);color:var(--primary);font-size:1.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${p.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <h3 style="font-size:1.2rem;font-weight:700;color:var(--text-main);">${escapeHtml(p.name)}</h3>
            <span class="badge ${getStatusBadge(p.status)}">${p.status}</span>
            <span class="badge badge-info">${p.bloodGroup}</span>
          </div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">
            <span>ID: <b class="tabular-nums">${p.id}</b></span> · 
            <span>${p.gender}, ${p.age} years</span> · 
            <span>DOB: ${p.dob}</span> · 
            <span>CNIC: ${p.cnic}</span>
          </div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">
            <span>Assigned: <b>${escapeHtml(p.doctor || 'None')}</b> (${p.department})</span> · 
            <span>Emergency: ${escapeHtml(p.emergencyContact || 'N/A')}</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-nav">
        <button class="tab-btn active" onclick="switchProfileTab(this, 'tab-info')"><i class="fa-solid fa-user"></i> Personal</button>
        <button class="tab-btn" onclick="switchProfileTab(this, 'tab-apts')"><i class="fa-solid fa-calendar-check"></i> Appointments (${patientApts.length})</button>
        <button class="tab-btn" onclick="switchProfileTab(this, 'tab-records')"><i class="fa-solid fa-notes-medical"></i> Medical (${patientRecs.length})</button>
        <button class="tab-btn" onclick="switchProfileTab(this, 'tab-rx')"><i class="fa-solid fa-prescription"></i> Prescriptions (${patientRxs.length})</button>
        <button class="tab-btn" onclick="switchProfileTab(this, 'tab-billing')"><i class="fa-solid fa-receipt"></i> Billing (${patientBills.length})</button>
      </div>

      <!-- Tab 1: Personal Info -->
      <div id="tab-info" class="tab-pane active">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;font-size:0.85rem;">
          <div>
            <h4 style="font-weight:700;color:var(--primary);margin-bottom:0.75rem;">Contact & Identification</h4>
            <p><b>Father's Name:</b> ${escapeHtml(p.fatherName || 'N/A')}</p>
            <p><b>Phone:</b> ${escapeHtml(p.phone)}</p>
            <p><b>Email:</b> ${escapeHtml(p.email || 'N/A')}</p>
            <p><b>Address:</b> ${escapeHtml(p.address || 'N/A')}</p>
            <p><b>Registration Date:</b> ${p.regDate || '2026-03-01'}</p>
          </div>
          <div>
            <h4 style="font-weight:700;color:var(--primary);margin-bottom:0.75rem;">Medical Vitals & Warnings</h4>
            <p><b>Allergies:</b> <span style="color:var(--danger);font-weight:600;">${escapeHtml(p.allergies || 'None recorded')}</span></p>
            <p><b>Existing Conditions:</b> ${escapeHtml(p.conditions || 'None')}</p>
            <p><b>Clinical Notes:</b> ${escapeHtml(p.notes || 'Routine outpatient profile')}</p>
          </div>
        </div>
      </div>

      <!-- Tab 2: Appointments -->
      <div id="tab-apts" class="tab-pane">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>APT ID</th><th>Date & Time</th><th>Doctor</th><th>Reason</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${patientApts.length ? patientApts.map(a => `
                <tr>
                  <td><b>${a.id}</b></td>
                  <td>${a.date} at ${a.time}</td>
                  <td>${escapeHtml(a.doctor)}</td>
                  <td>${escapeHtml(a.reason)}</td>
                  <td><span class="badge ${getStatusBadge(a.status)}">${a.status}</span></td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-muted);">No appointment records for this patient.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: Medical History -->
      <div id="tab-records" class="tab-pane">
        ${patientRecs.length ? patientRecs.map(r => `
          <div style="background:var(--bg-surface-alt);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1rem;margin-bottom:0.75rem;">
            <div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;">
              <span style="font-weight:700;color:var(--primary);">${r.id} · ${r.visitDate}</span>
              <span style="font-size:0.75rem;color:var(--text-muted);">Attending: ${escapeHtml(r.doctor)}</span>
            </div>
            <div style="font-weight:600;margin-bottom:0.25rem;">Diagnosis: ${escapeHtml(r.diagnosis)}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">Symptoms: ${escapeHtml(r.symptoms)}</div>
            <div style="font-size:0.8rem;"><b>Notes:</b> ${escapeHtml(r.notes)}</div>
          </div>
        `).join('') : `<p style="text-align:center;padding:2rem;color:var(--text-muted);">No clinical records found.</p>`}
      </div>

      <!-- Tab 4: Prescriptions -->
      <div id="tab-rx" class="tab-pane">
        ${patientRxs.length ? patientRxs.map(rx => `
          <div style="background:var(--bg-surface-alt);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1rem;margin-bottom:0.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <div>
                <b style="color:var(--primary);">${rx.id}</b> - Issued: ${rx.date} by ${escapeHtml(rx.doctor)}
              </div>
              <button class="btn btn-outline btn-sm" onclick="printPrescriptionDoc('${rx.id}')">
                <i class="fa-solid fa-print"></i> Print Rx
              </button>
            </div>
            <div style="font-size:0.8rem;font-weight:600;margin-bottom:0.4rem;">Diagnosis: ${escapeHtml(rx.diagnosis || 'Clinical Prescription')}</div>
            <ul style="font-size:0.8rem;padding-left:1.25rem;color:var(--text-main);">
              ${rx.medicines.map(m => `
                <li><b>${escapeHtml(m.name)}</b> - ${m.dosage}, ${m.frequency} (${m.duration}). <i>${m.instructions}</i></li>
              `).join('')}
            </ul>
          </div>
        `).join('') : `<p style="text-align:center;padding:2rem;color:var(--text-muted);">No prescriptions found.</p>`}
      </div>

      <!-- Tab 5: Billing -->
      <div id="tab-billing" class="tab-pane">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Invoice</th><th>Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Print</th></tr>
            </thead>
            <tbody>
              ${patientBills.length ? patientBills.map(b => `
                <tr>
                  <td><b>${b.id}</b></td>
                  <td>${b.date}</td>
                  <td class="tabular-nums font-semibold">$${b.totalAmount}</td>
                  <td class="tabular-nums text-success">$${b.paidAmount}</td>
                  <td class="tabular-nums text-danger">$${b.remainingAmount}</td>
                  <td><span class="badge ${getStatusBadge(b.status)}">${b.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="printInvoiceDoc('${b.id}')"><i class="fa-solid fa-print"></i></button>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text-muted);">No invoices found.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `,
    confirmText: 'Close',
    confirmClass: 'btn-outline',
    onConfirm: () => true
  });
};

window.switchProfileTab = function(btnEl, tabId) {
  document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btnEl.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
};

/* --------------------------------------------------------------------------
   8. VIEW: DOCTORS MANAGEMENT
   -------------------------------------------------------------------------- */
function renderDoctors(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Doctor Management</h2>
        <p>Medical consultants, department assignment, clinic availability & fee schedules</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openDoctorModal()">
          <i class="fa-solid fa-user-doctor"></i> Add New Doctor
        </button>
      </div>
    </div>

    <!-- Doctor Filter Strip -->
    <div class="card">
      <div class="card-body" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom:0;">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="doctor-search-input" placeholder="Search doctor by name, qualification, or specialization..." oninput="filterDoctorsGrid()" />
          </div>
          <select id="doctor-dept-filter" class="select-filter" onchange="filterDoctorsGrid()">
            <option value="">All Departments</option>
            ${state.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- Doctors Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;" id="doctors-container">
      <!-- Populated via filterDoctorsGrid -->
    </div>
  `;

  filterDoctorsGrid();
}

window.filterDoctorsGrid = function() {
  const query = (document.getElementById('doctor-search-input')?.value || '').toLowerCase();
  const dept = document.getElementById('doctor-dept-filter')?.value || '';
  const grid = document.getElementById('doctors-container');
  if (!grid) return;

  const filtered = state.doctors.filter(d => {
    const matchQuery = !query || 
      d.name.toLowerCase().includes(query) ||
      d.specialization.toLowerCase().includes(query) ||
      d.qualification.toLowerCase().includes(query);
    const matchDept = !dept || d.department === dept;
    return matchQuery && matchDept;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color:var(--text-muted);">No medical doctors found.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(doc => `
    <div class="card" style="margin-bottom:0; display:flex; flex-direction:column;">
      <div class="card-body" style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div style="display:flex; gap:0.75rem; align-items:center;">
            <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.25rem;">
              <i class="fa-solid fa-user-doctor"></i>
            </div>
            <div>
              <div style="font-weight:700; color:var(--text-main); font-size:1rem;">${escapeHtml(doc.name)}</div>
              <div style="font-size:0.75rem; color:var(--primary); font-weight:600;">${escapeHtml(doc.specialization)}</div>
            </div>
          </div>
          <span class="badge ${doc.status === 'Active' ? 'badge-success' : 'badge-warning'}">${doc.status}</span>
        </div>

        <div style="font-size:0.8rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem;">
          <div><i class="fa-solid fa-graduation-cap" style="width:16px;"></i> ${escapeHtml(doc.qualification)}</div>
          <div><i class="fa-solid fa-building" style="width:16px;"></i> Dept: <b>${escapeHtml(doc.department)}</b></div>
          <div><i class="fa-solid fa-clock" style="width:16px;"></i> ${escapeHtml(doc.availability)}</div>
          <div><i class="fa-solid fa-phone" style="width:16px;"></i> ${escapeHtml(doc.phone)}</div>
          <div><i class="fa-solid fa-dollar-sign" style="width:16px;"></i> Consultation Fee: <b class="tabular-nums" style="color:var(--text-main);">$${doc.fee}</b></div>
        </div>
      </div>
      <div class="card-header" style="border-top:1px solid var(--border-color); border-bottom:none; background:var(--bg-surface-alt); padding:0.65rem 1rem;">
        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Experience: ${doc.experience} Years</span>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn btn-outline btn-sm" onclick="openDoctorModal('${doc.id}')" title="Edit Doctor Details">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteDoctorRecord('${doc.id}')" title="Remove Doctor">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

window.openDoctorModal = function(editId = null) {
  const doc = editId ? state.doctors.find(d => d.id === editId) : null;
  const isEdit = !!doc;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-user-pen"></i> Edit Doctor Details` : `<i class="fa-solid fa-user-plus"></i> Add New Doctor`,
    sizeClass: 'modal-lg',
    body: `
      <form id="doctor-form">
        <div class="form-grid-3">
          <div class="form-group">
            <label>Doctor Full Name <span class="required">*</span></label>
            <input type="text" id="doc-name" class="form-control" required value="${doc ? escapeHtml(doc.name) : ''}" placeholder="Dr. First Last" />
          </div>
          <div class="form-group">
            <label>Gender <span class="required">*</span></label>
            <select id="doc-gender" class="form-control" required>
              <option value="Male" ${doc?.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${doc?.gender === 'Female' ? 'selected' : ''}>Female</option>
            </select>
          </div>
          <div class="form-group">
            <label>CNIC / National ID</label>
            <input type="text" id="doc-cnic" class="form-control" value="${doc ? escapeHtml(doc.cnic) : ''}" placeholder="42101-0000000-0" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select id="doc-dept" class="form-control" required>
              ${state.departments.map(d => `<option value="${d.name}" ${doc?.department === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Specialization <span class="required">*</span></label>
            <input type="text" id="doc-spec" class="form-control" required value="${doc ? escapeHtml(doc.specialization) : ''}" placeholder="e.g. Interventional Cardiology" />
          </div>
          <div class="form-group">
            <label>Qualifications <span class="required">*</span></label>
            <input type="text" id="doc-qual" class="form-control" required value="${doc ? escapeHtml(doc.qualification) : ''}" placeholder="e.g. MBBS, FCPS, MD" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Contact Phone <span class="required">*</span></label>
            <input type="tel" id="doc-phone" class="form-control" required value="${doc ? escapeHtml(doc.phone) : ''}" placeholder="+1 (555) 000-0000" />
          </div>
          <div class="form-group">
            <label>Email Address <span class="required">*</span></label>
            <input type="email" id="doc-email" class="form-control" required value="${doc ? escapeHtml(doc.email) : ''}" placeholder="doctor@hms.com" />
          </div>
          <div class="form-group">
            <label>Consultation Fee ($) <span class="required">*</span></label>
            <input type="number" id="doc-fee" class="form-control" required min="10" step="5" value="${doc ? doc.fee : 100}" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Clinic Schedule / Availability</label>
            <input type="text" id="doc-avail" class="form-control" value="${doc ? escapeHtml(doc.availability) : 'Mon - Fri (09:00 AM - 02:00 PM)'}" />
          </div>
          <div class="form-group">
            <label>Years of Clinical Experience</label>
            <input type="number" id="doc-exp" class="form-control" min="1" max="50" value="${doc ? doc.experience : 10}" />
          </div>
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Add Doctor',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const name = document.getElementById('doc-name').value.trim();
      const spec = document.getElementById('doc-spec').value.trim();
      const fee = parseFloat(document.getElementById('doc-fee').value) || 100;

      if (!name || !spec) {
        showToast('Please provide doctor name and specialization', 'warning');
        return false;
      }

      if (isEdit) {
        Object.assign(doc, {
          name,
          gender: document.getElementById('doc-gender').value,
          cnic: document.getElementById('doc-cnic').value.trim(),
          department: document.getElementById('doc-dept').value,
          specialization: spec,
          qualification: document.getElementById('doc-qual').value.trim(),
          phone: document.getElementById('doc-phone').value.trim(),
          email: document.getElementById('doc-email').value.trim(),
          fee,
          availability: document.getElementById('doc-avail').value.trim(),
          experience: parseInt(document.getElementById('doc-exp').value) || 5
        });
        persist('doctors', state.doctors);
        showToast(`Doctor ${doc.name} updated`, 'success');
      } else {
        const newDoc = {
          id: `DOC-00${state.doctors.length + 1}`,
          name,
          gender: document.getElementById('doc-gender').value,
          cnic: document.getElementById('doc-cnic').value.trim(),
          department: document.getElementById('doc-dept').value,
          specialization: spec,
          qualification: document.getElementById('doc-qual').value.trim(),
          phone: document.getElementById('doc-phone').value.trim(),
          email: document.getElementById('doc-email').value.trim(),
          fee,
          availability: document.getElementById('doc-avail').value.trim(),
          experience: parseInt(document.getElementById('doc-exp').value) || 5,
          status: 'Active'
        };
        state.doctors.push(newDoc);
        persist('doctors', state.doctors);
        showToast(`Doctor ${newDoc.name} registered`, 'success');
      }

      if (state.activeView === 'doctors') filterDoctorsGrid();
      return true;
    }
  });
};

window.deleteDoctorRecord = function(id) {
  const doc = state.doctors.find(d => d.id === id);
  if (!doc) return;

  openModal({
    title: `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Remove Doctor`,
    body: `<p>Are you sure you want to remove <b>${escapeHtml(doc.name)}</b> from the system directory?</p>`,
    confirmText: 'Remove',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      state.doctors = state.doctors.filter(d => d.id !== id);
      persist('doctors', state.doctors);
      showToast('Doctor record removed', 'info');
      if (state.activeView === 'doctors') filterDoctorsGrid();
    }
  });
};

/* --------------------------------------------------------------------------
   9. VIEW: APPOINTMENTS MANAGEMENT
   -------------------------------------------------------------------------- */
function renderAppointments(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Appointment Management</h2>
        <p>Outpatient bookings, doctor schedules, consultation tracking & time slots</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAppointmentModal()">
          <i class="fa-solid fa-calendar-plus"></i> Book Appointment
        </button>
      </div>
    </div>

    <!-- Appointment Filter Bar -->
    <div class="card">
      <div class="card-body" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom:0;">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="apt-search-input" placeholder="Search by patient name or reason..." oninput="filterAppointmentsTable()" />
          </div>
          <select id="apt-doctor-filter" class="select-filter" onchange="filterAppointmentsTable()">
            <option value="">All Doctors</option>
            ${state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select>
          <select id="apt-status-filter" class="select-filter" onchange="filterAppointmentsTable()">
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Appointments Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date & Slot</th>
              <th>Visit Reason</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="appointments-tbody">
            <!-- Filtered rows render here -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterAppointmentsTable();
}

window.filterAppointmentsTable = function() {
  const query = (document.getElementById('apt-search-input')?.value || '').toLowerCase();
  const doc = document.getElementById('apt-doctor-filter')?.value || '';
  const status = document.getElementById('apt-status-filter')?.value || '';
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;

  const filtered = state.appointments.filter(a => {
    const matchQuery = !query || a.patientName.toLowerCase().includes(query) || a.reason.toLowerCase().includes(query);
    const matchDoc = !doc || a.doctor === doc;
    const matchStatus = !status || a.status === status;
    return matchQuery && matchDoc && matchStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">No appointments found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(apt => `
    <tr>
      <td><span class="tabular-nums" style="font-weight:700;color:var(--primary);">${apt.id}</span></td>
      <td>
        <div style="font-weight:600;">${escapeHtml(apt.patientName)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">ID: ${apt.patientId}</div>
      </td>
      <td>${escapeHtml(apt.doctor)}</td>
      <td>${escapeHtml(apt.department)}</td>
      <td>
        <div><i class="fa-regular fa-calendar"></i> ${apt.date}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;"><i class="fa-regular fa-clock"></i> ${apt.time}</div>
      </td>
      <td>${escapeHtml(apt.reason)}</td>
      <td><span class="badge ${getStatusBadge(apt.status)}">${apt.status}</span></td>
      <td style="text-align: right; white-space: nowrap;">
        ${apt.status !== 'Completed' && apt.status !== 'Cancelled' ? `
          <button class="btn btn-outline btn-sm text-success" onclick="updateAppointmentStatus('${apt.id}', 'Completed')" title="Mark as Completed">
            <i class="fa-solid fa-check"></i>
          </button>
          <button class="btn btn-outline btn-sm text-danger" onclick="updateAppointmentStatus('${apt.id}', 'Cancelled')" title="Cancel Appointment">
            <i class="fa-solid fa-xmark"></i>
          </button>
        ` : ''}
        <button class="btn btn-outline btn-sm" onclick="openAppointmentModal('${apt.id}')" title="Edit Appointment">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `).join('');
};

window.openAppointmentModal = function(editId = null) {
  const apt = editId ? state.appointments.find(a => a.id === editId) : null;
  const isEdit = !!apt;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-calendar-pen"></i> Edit Appointment` : `<i class="fa-solid fa-calendar-plus"></i> Book New Appointment`,
    sizeClass: 'modal-lg',
    body: `
      <form id="appointment-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="apt-patient" class="form-control" required>
              ${state.patients.map(p => `
                <option value="${p.id}" ${apt?.patientId === p.id ? 'selected' : ''}>${p.name} (${p.id} - ${p.phone})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Select Department <span class="required">*</span></label>
            <select id="apt-dept" class="form-control" required onchange="updateDoctorDropdownByDept(this.value, 'apt-doctor')">
              ${state.departments.map(d => `<option value="${d.name}" ${apt?.department === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Select Doctor <span class="required">*</span></label>
            <select id="apt-doctor" class="form-control" required>
              ${state.doctors.map(doc => `<option value="${doc.name}" ${apt?.doctor === doc.name ? 'selected' : ''}>${doc.name} (${doc.specialization})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Appointment Type</label>
            <select id="apt-type" class="form-control">
              <option value="Consultation">General Consultation</option>
              <option value="Followup">Routine Follow-up</option>
              <option value="Emergency">Urgent Clinical Visit</option>
              <option value="Pre-Op">Pre-Operative Check</option>
            </select>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Appointment Date <span class="required">*</span></label>
            <input type="date" id="apt-date" class="form-control" required value="${apt ? apt.date : '2026-11-03'}" />
          </div>
          <div class="form-group">
            <label>Time Slot <span class="required">*</span></label>
            <select id="apt-time" class="form-control" required>
              ${['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM'].map(t => `
                <option value="${t}" ${apt?.time === t ? 'selected' : ''}>${t}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Status <span class="required">*</span></label>
            <select id="apt-status" class="form-control" required>
              <option value="Scheduled" ${apt?.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
              <option value="Confirmed" ${apt?.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Completed" ${apt?.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${apt?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Reason for Consultation / Symptoms <span class="required">*</span></label>
          <input type="text" id="apt-reason" class="form-control" required value="${apt ? escapeHtml(apt.reason) : ''}" placeholder="e.g. Chest tightness, Migraine follow-up" />
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Confirm Booking',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const patientId = document.getElementById('apt-patient').value;
      const patient = state.patients.find(p => p.id === patientId);
      const doctor = document.getElementById('apt-doctor').value;
      const date = document.getElementById('apt-date').value;
      const time = document.getElementById('apt-time').value;
      const reason = document.getElementById('apt-reason').value.trim();

      if (!reason) {
        showToast('Please state a reason for visit', 'warning');
        return false;
      }

      // Check for duplicate slot for the same doctor at the same date and time
      const duplicate = state.appointments.find(a => 
        a.id !== editId && 
        a.doctor === doctor && 
        a.date === date && 
        a.time === time && 
        a.status !== 'Cancelled'
      );

      if (duplicate) {
        showToast(`Doctor ${doctor} is already booked at ${time} on ${date}. Please choose another slot.`, 'danger');
        return false;
      }

      if (isEdit) {
        Object.assign(apt, {
          patientId,
          patientName: patient?.name || apt.patientName,
          doctor,
          department: document.getElementById('apt-dept').value,
          date,
          time,
          reason,
          type: document.getElementById('apt-type').value,
          status: document.getElementById('apt-status').value
        });
        persist('appointments', state.appointments);
        showToast(`Appointment ${apt.id} updated`, 'success');
      } else {
        const newApt = {
          id: `APT-${100 + state.appointments.length + 1}`,
          patientId,
          patientName: patient?.name || 'Walk-in Patient',
          doctor,
          department: document.getElementById('apt-dept').value,
          date,
          time,
          reason,
          type: document.getElementById('apt-type').value,
          status: document.getElementById('apt-status').value
        };
        state.appointments.unshift(newApt);
        persist('appointments', state.appointments);
        addNotification('Appointment Booked', `Booked for ${newApt.patientName} with ${newApt.doctor} on ${newApt.date} at ${newApt.time}`, 'fa-calendar-check');
        showToast(`Appointment ${newApt.id} scheduled successfully`, 'success');
      }

      if (state.activeView === 'appointments') filterAppointmentsTable();
      return true;
    }
  });
};

window.updateAppointmentStatus = function(id, newStatus) {
  const apt = state.appointments.find(a => a.id === id);
  if (!apt) return;
  apt.status = newStatus;
  persist('appointments', state.appointments);
  showToast(`Appointment ${id} marked as ${newStatus}`, 'info');
  if (state.activeView === 'appointments') filterAppointmentsTable();
};

/* --------------------------------------------------------------------------
   10. VIEW: OPD (OUTPATIENT DEPARTMENT) QUEUE
   -------------------------------------------------------------------------- */
function renderOPD(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Outpatient Department (OPD) Queue</h2>
        <p>Live token queue management, waiting room triage & doctor consultations</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openOPDModal()">
          <i class="fa-solid fa-ticket"></i> Issue OPD Token
        </button>
      </div>
    </div>

    <!-- OPD Live Queue Table -->
    <div class="card">
      <div class="card-header">
        <h3><i class="fa-solid fa-users-line text-primary"></i> Current Active OPD Queue</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Token #</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Assigned Doctor</th>
              <th>Chief Complaint</th>
              <th>Status</th>
              <th style="text-align: right;">Queue Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.opdVisits.map(opd => `
              <tr>
                <td><span class="badge badge-info font-bold" style="font-size:0.85rem;">${opd.token}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(opd.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">ID: ${opd.patientId}</div>
                </td>
                <td>${escapeHtml(opd.department)}</td>
                <td>${escapeHtml(opd.doctor)}</td>
                <td>${escapeHtml(opd.complaint)}</td>
                <td><span class="badge ${getStatusBadge(opd.status)}">${opd.status}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                  ${opd.status === 'Waiting' ? `
                    <button class="btn btn-outline btn-sm text-primary" onclick="setOPDStatus('${opd.id}', 'In Consultation')">
                      <i class="fa-solid fa-bell"></i> Call Patient
                    </button>
                  ` : opd.status === 'In Consultation' ? `
                    <button class="btn btn-outline btn-sm text-success" onclick="setOPDStatus('${opd.id}', 'Completed')">
                      <i class="fa-solid fa-check-double"></i> Complete
                    </button>
                  ` : `
                    <span style="font-size:0.75rem;color:var(--text-muted);"><i class="fa-solid fa-circle-check text-success"></i> Finished</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openOPDModal = function() {
  openModal({
    title: `<i class="fa-solid fa-ticket"></i> Register OPD Visit`,
    body: `
      <form id="opd-form">
        <div class="form-group">
          <label>Select Patient <span class="required">*</span></label>
          <select id="opd-patient" class="form-control" required>
            ${state.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
          </select>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select id="opd-dept" class="form-control" required onchange="updateDoctorDropdownByDept(this.value, 'opd-doctor')">
              ${state.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Doctor <span class="required">*</span></label>
            <select id="opd-doctor" class="form-control" required>
              ${state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Chief Complaint / Symptoms <span class="required">*</span></label>
          <input type="text" id="opd-complaint" class="form-control" required placeholder="e.g. Acute high fever and throat irritation" />
        </div>
      </form>
    `,
    confirmText: 'Generate OPD Token',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const pId = document.getElementById('opd-patient').value;
      const patient = state.patients.find(p => p.id === pId);
      const complaint = document.getElementById('opd-complaint').value.trim();

      if (!complaint) {
        showToast('Please specify the chief complaint', 'warning');
        return false;
      }

      const tokenNum = `T-0${state.opdVisits.length + 1}`;
      const newOpd = {
        id: `OPD-${300 + state.opdVisits.length + 1}`,
        token: tokenNum,
        patientId: pId,
        patientName: patient?.name || 'OPD Patient',
        doctor: document.getElementById('opd-doctor').value,
        department: document.getElementById('opd-dept').value,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        complaint,
        status: 'Waiting'
      };

      state.opdVisits.unshift(newOpd);
      persist('opdVisits', state.opdVisits);
      showToast(`Token ${tokenNum} generated for ${newOpd.patientName}`, 'success');
      if (state.activeView === 'opd') renderOPD(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.setOPDStatus = function(id, status) {
  const visit = state.opdVisits.find(v => v.id === id);
  if (!visit) return;
  visit.status = status;
  persist('opdVisits', state.opdVisits);
  showToast(`Token ${visit.token} set to ${status}`, 'info');
  if (state.activeView === 'opd') renderOPD(document.getElementById('main-viewport'));
};

/* --------------------------------------------------------------------------
   11. VIEW: INPATIENT ADMISSIONS & BED ASSIGNMENT
   -------------------------------------------------------------------------- */
function renderAdmissions(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Inpatient Admission Management</h2>
        <p>Ward admissions, room assignments, clinical diagnosis & discharge processing</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAdmissionModal()">
          <i class="fa-solid fa-hospital-user"></i> Admit Patient
        </button>
      </div>
    </div>

    <!-- Admissions Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Adm ID</th>
              <th>Patient</th>
              <th>Ward & Bed</th>
              <th>Admitting Doctor</th>
              <th>Admission Date</th>
              <th>Diagnosis</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.admissions.map(adm => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${adm.id}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(adm.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${adm.patientId}</div>
                </td>
                <td>
                  <div><b>${escapeHtml(adm.ward)}</b></div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${adm.room} · ${adm.bedNumber}</div>
                </td>
                <td>${escapeHtml(adm.doctor)}</td>
                <td class="tabular-nums">${adm.admitDate}</td>
                <td>${escapeHtml(adm.diagnosis)}</td>
                <td><span class="badge ${adm.status === 'Admitted' ? 'badge-danger' : 'badge-success'}">${adm.status}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                  ${adm.status === 'Admitted' ? `
                    <button class="btn btn-outline btn-sm text-danger" onclick="dischargePatientAction('${adm.id}')" title="Discharge Patient and Free Bed">
                      <i class="fa-solid fa-person-walking-arrow-right"></i> Discharge
                    </button>
                  ` : `
                    <span style="font-size:0.75rem;color:var(--text-muted);">Discharged on ${adm.dischargeDate || 'N/A'}</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAdmissionModal = function() {
  const availableBeds = state.beds.filter(b => b.status === 'Available');

  if (!availableBeds.length) {
    showToast('No beds currently available! Please check Bed Management or discharge patients.', 'danger');
    return;
  }

  openModal({
    title: `<i class="fa-solid fa-hospital-user"></i> Inpatient Admission`,
    sizeClass: 'modal-lg',
    body: `
      <form id="admission-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="adm-patient" class="form-control" required>
              ${state.patients.filter(p => p.status !== 'Admitted').map(p => `
                <option value="${p.id}">${p.name} (${p.id})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Available Bed Assignment <span class="required">*</span></label>
            <select id="adm-bed" class="form-control" required>
              ${availableBeds.map(b => `
                <option value="${b.id}">${b.ward} - ${b.room} (${b.bedNumber}) - $${b.dailyRate}/day</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Attending Doctor <span class="required">*</span></label>
            <select id="adm-doctor" class="form-control" required>
              ${state.doctors.map(d => `<option value="${d.name}">${d.name} (${d.specialization})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select id="adm-dept" class="form-control" required>
              ${state.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Reason for Inpatient Admission <span class="required">*</span></label>
          <input type="text" id="adm-reason" class="form-control" required placeholder="e.g. Severe chest pain, Scheduled elective surgery" />
        </div>

        <div class="form-group">
          <label>Preliminary Clinical Diagnosis <span class="required">*</span></label>
          <input type="text" id="adm-diag" class="form-control" required placeholder="e.g. Acute coronary syndrome / Rule out NSTEMI" />
        </div>
      </form>
    `,
    confirmText: 'Complete Admission',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const patientId = document.getElementById('adm-patient').value;
      const patient = state.patients.find(p => p.id === patientId);
      const bedId = document.getElementById('adm-bed').value;
      const bed = state.beds.find(b => b.id === bedId);
      const reason = document.getElementById('adm-reason').value.trim();
      const diag = document.getElementById('adm-diag').value.trim();

      if (!reason || !diag) {
        showToast('Please fill all admission details', 'warning');
        return false;
      }

      // Update Bed to Occupied
      bed.status = 'Occupied';
      bed.patientId = patientId;
      bed.patientName = patient.name;
      persist('beds', state.beds);

      // Update Patient to Admitted
      patient.status = 'Admitted';
      persist('patients', state.patients);

      // Create Admission Record
      const newAdm = {
        id: `ADM-0${state.admissions.length + 1}`,
        patientId,
        patientName: patient.name,
        doctor: document.getElementById('adm-doctor').value,
        department: document.getElementById('adm-dept').value,
        ward: bed.ward,
        room: bed.room,
        bedNumber: bed.bedNumber,
        bedId: bed.id,
        admitDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        dischargeDate: null,
        reason,
        diagnosis: diag,
        status: 'Admitted'
      };

      state.admissions.unshift(newAdm);
      persist('admissions', state.admissions);

      addNotification('Patient Admitted', `${patient.name} admitted to ${bed.ward} (${bed.bedNumber})`, 'fa-bed-pulse');
      showToast(`${patient.name} successfully admitted to ${bed.bedNumber}`, 'success');

      if (state.activeView === 'admissions') renderAdmissions(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.dischargePatientAction = function(admId) {
  const adm = state.admissions.find(a => a.id === admId);
  if (!adm) return;

  openModal({
    title: `<i class="fa-solid fa-person-walking-arrow-right text-warning"></i> Discharge Patient`,
    body: `
      <p>Confirm discharge for <b>${escapeHtml(adm.patientName)}</b> from <b>${adm.ward} (${adm.bedNumber})</b>?</p>
      <p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.5rem;">This will release Bed ${adm.bedNumber} back to available inventory and update the patient's record to 'Discharged'.</p>
    `,
    confirmText: 'Process Discharge',
    confirmClass: 'btn-warning',
    onConfirm: () => {
      // Release bed
      const bed = state.beds.find(b => b.id === adm.bedId);
      if (bed) {
        bed.status = 'Available';
        bed.patientId = null;
        bed.patientName = null;
        persist('beds', state.beds);
      }

      // Update patient status
      const patient = state.patients.find(p => p.id === adm.patientId);
      if (patient) {
        patient.status = 'Discharged';
        persist('patients', state.patients);
      }

      // Update admission record
      adm.status = 'Discharged';
      adm.dischargeDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
      persist('admissions', state.admissions);

      addNotification('Patient Discharged', `${adm.patientName} discharged from ${adm.ward}`, 'fa-door-open');
      showToast(`${adm.patientName} discharged. Bed ${adm.bedNumber} is now available.`, 'success');

      if (state.activeView === 'admissions') renderAdmissions(document.getElementById('main-viewport'));
    }
  });
};

/* --------------------------------------------------------------------------
   12. VIEW: BED & ROOM MANAGEMENT
   -------------------------------------------------------------------------- */
function renderBeds(container) {
  const total = state.beds.length;
  const avail = state.beds.filter(b => b.status === 'Available').length;
  const occ = state.beds.filter(b => b.status === 'Occupied').length;
  const maint = state.beds.filter(b => b.status === 'Maintenance').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Hospital Bed & Ward Management</h2>
        <p>Real-time visual bed availability matrix, ward allocation & maintenance status</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAddBedModal()">
          <i class="fa-solid fa-plus"></i> Add Bed
        </button>
      </div>
    </div>

    <!-- Bed Metrics Summary -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Beds</div>
          <div class="value tabular-nums">${total}</div>
        </div>
        <div class="stat-icon blue"><i class="fa-solid fa-bed"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Available Free Beds</div>
          <div class="value tabular-nums text-success">${avail}</div>
        </div>
        <div class="stat-icon green"><i class="fa-solid fa-check"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Occupied Beds</div>
          <div class="value tabular-nums text-danger">${occ}</div>
        </div>
        <div class="stat-icon red"><i class="fa-solid fa-bed-pulse"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Under Maintenance</div>
          <div class="value tabular-nums text-warning">${maint}</div>
        </div>
        <div class="stat-icon amber"><i class="fa-solid fa-wrench"></i></div>
      </div>
    </div>

    <!-- Ward Filter -->
    <div class="card">
      <div class="card-body" style="padding:1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom:0;">
          <select id="bed-ward-filter" class="select-filter" onchange="filterBedMatrix()">
            <option value="">All Hospital Wards</option>
            <option value="ICU Ward">ICU Ward</option>
            <option value="Male Medical Ward">Male Medical Ward</option>
            <option value="Female Medical Ward">Female Medical Ward</option>
            <option value="Surgical Ward">Surgical Ward</option>
            <option value="Pediatric Ward">Pediatric Ward</option>
            <option value="VIP Deluxe Ward">VIP Deluxe Ward</option>
          </select>
          <select id="bed-status-filter" class="select-filter" onchange="filterBedMatrix()">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Visual Bed Matrix Grid -->
    <div class="bed-matrix-grid" id="bed-matrix-container">
      <!-- Populated dynamically -->
    </div>
  `;

  filterBedMatrix();
}

window.filterBedMatrix = function() {
  const ward = document.getElementById('bed-ward-filter')?.value || '';
  const status = document.getElementById('bed-status-filter')?.value || '';
  const container = document.getElementById('bed-matrix-container');
  if (!container) return;

  const filtered = state.beds.filter(b => {
    const matchWard = !ward || b.ward === ward;
    const matchStatus = !status || b.status === status;
    return matchWard && matchStatus;
  });

  if (!filtered.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No beds match the filter criteria.</div>`;
    return;
  }

  container.innerHTML = filtered.map(bed => `
    <div class="bed-card status-${bed.status.toLowerCase()}">
      <div class="bed-header">
        <span class="bed-number">${bed.bedNumber}</span>
        <span class="badge ${bed.status === 'Available' ? 'badge-success' : bed.status === 'Occupied' ? 'badge-danger' : 'badge-warning'}">${bed.status}</span>
      </div>
      <div class="bed-type"><b>${bed.ward}</b> · ${bed.room}</div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Type: ${bed.type} ($${bed.dailyRate}/day)</div>
      
      ${bed.patientName ? `
        <div class="bed-patient-info">
          <i class="fa-solid fa-user-injured text-danger"></i> ${escapeHtml(bed.patientName)}
        </div>
      ` : `
        <div style="font-size:0.75rem; color:var(--success); margin-top:0.4rem; font-weight:600;">
          <i class="fa-solid fa-check"></i> Ready for Admission
        </div>
      `}

      <div style="margin-top:0.75rem; display:flex; justify-content:flex-end; gap:0.25rem;">
        ${bed.status !== 'Occupied' ? `
          <button class="btn btn-outline btn-sm" onclick="toggleBedMaintenance('${bed.id}')" title="Toggle Maintenance">
            <i class="fa-solid fa-wrench"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
};

window.toggleBedMaintenance = function(id) {
  const bed = state.beds.find(b => b.id === id);
  if (!bed) return;
  bed.status = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
  persist('beds', state.beds);
  showToast(`Bed ${bed.bedNumber} marked as ${bed.status}`, 'info');
  filterBedMatrix();
};

window.openAddBedModal = function() {
  openModal({
    title: `<i class="fa-solid fa-plus"></i> Add New Hospital Bed`,
    body: `
      <form id="add-bed-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Ward Name <span class="required">*</span></label>
            <select id="new-bed-ward" class="form-control" required>
              <option value="ICU Ward">ICU Ward</option>
              <option value="Male Medical Ward">Male Medical Ward</option>
              <option value="Female Medical Ward">Female Medical Ward</option>
              <option value="Surgical Ward">Surgical Ward</option>
              <option value="Pediatric Ward">Pediatric Ward</option>
              <option value="VIP Deluxe Ward">VIP Deluxe Ward</option>
            </select>
          </div>
          <div class="form-group">
            <label>Room Number <span class="required">*</span></label>
            <input type="text" id="new-bed-room" class="form-control" required placeholder="e.g. Room 204" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Bed Identifier <span class="required">*</span></label>
            <input type="text" id="new-bed-number" class="form-control" required placeholder="e.g. Bed 3" />
          </div>
          <div class="form-group">
            <label>Bed Type</label>
            <select id="new-bed-type" class="form-control">
              <option value="General">General</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="ICU">ICU</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>
          <div class="form-group">
            <label>Daily Rate ($)</label>
            <input type="number" id="new-bed-rate" class="form-control" required min="50" step="10" value="80" />
          </div>
        </div>
      </form>
    `,
    confirmText: 'Add Bed',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const room = document.getElementById('new-bed-room').value.trim();
      const bedNumber = document.getElementById('new-bed-number').value.trim();
      if (!room || !bedNumber) {
        showToast('Please specify room and bed number', 'warning');
        return false;
      }

      const newBed = {
        id: `BED-${Date.now().toString().slice(-4)}`,
        ward: document.getElementById('new-bed-ward').value,
        room,
        bedNumber,
        type: document.getElementById('new-bed-type').value,
        status: 'Available',
        patientId: null,
        patientName: null,
        dailyRate: parseFloat(document.getElementById('new-bed-rate').value) || 80
      };

      state.beds.push(newBed);
      persist('beds', state.beds);
      showToast(`Bed ${bedNumber} added to ${newBed.ward}`, 'success');
      if (state.activeView === 'beds') renderBeds(document.getElementById('main-viewport'));
      return true;
    }
  });
};

/* --------------------------------------------------------------------------
   13. VIEW: MEDICAL RECORDS MANAGEMENT
   -------------------------------------------------------------------------- */
function renderRecords(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Medical Records (EHR)</h2>
        <p>Electronic health records, clinical symptoms, diagnosis & treatment follow-ups</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openRecordModal()">
          <i class="fa-solid fa-file-medical"></i> Add Medical Record
        </button>
      </div>
    </div>

    <!-- Records Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Patient</th>
              <th>Visit Date</th>
              <th>Doctor</th>
              <th>Symptoms</th>
              <th>Diagnosis</th>
              <th>Follow-up</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.records.map(r => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${r.id}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(r.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${r.patientId}</div>
                </td>
                <td class="tabular-nums">${r.visitDate}</td>
                <td>${escapeHtml(r.doctor)}</td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.symptoms)}</td>
                <td><b>${escapeHtml(r.diagnosis)}</b></td>
                <td>${r.followupDate || 'None'}</td>
                <td style="text-align: right; white-space: nowrap;">
                  <button class="btn btn-outline btn-sm" onclick="viewRecordDetails('${r.id}')" title="View Full Clinical Record">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openRecordModal = function() {
  openModal({
    title: `<i class="fa-solid fa-file-medical"></i> Add Clinical Medical Record`,
    sizeClass: 'modal-lg',
    body: `
      <form id="record-form">
        <div class="form-grid-3">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="rec-patient" class="form-control" required>
              ${state.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Attending Doctor <span class="required">*</span></label>
            <select id="rec-doctor" class="form-control" required>
              ${state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Visit Date <span class="required">*</span></label>
            <input type="date" id="rec-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}" />
          </div>
        </div>

        <div class="form-group">
          <label>Presenting Symptoms <span class="required">*</span></label>
          <textarea id="rec-symptoms" class="form-control" rows="2" required placeholder="Describe chief clinical complaints and vitals..."></textarea>
        </div>

        <div class="form-group">
          <label>Clinical Diagnosis <span class="required">*</span></label>
          <input type="text" id="rec-diagnosis" class="form-control" required placeholder="Confirmed primary diagnosis" />
        </div>

        <div class="form-group">
          <label>Treatment Plan & Notes</label>
          <textarea id="rec-notes" class="form-control" rows="3" placeholder="Medications, nursing instructions, dietary restrictions..."></textarea>
        </div>

        <div class="form-group" style="max-width:240px;">
          <label>Next Follow-up Date</label>
          <input type="date" id="rec-followup" class="form-control" />
        </div>
      </form>
    `,
    confirmText: 'Save Record',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const pId = document.getElementById('rec-patient').value;
      const patient = state.patients.find(p => p.id === pId);
      const diagnosis = document.getElementById('rec-diagnosis').value.trim();
      const symptoms = document.getElementById('rec-symptoms').value.trim();

      if (!diagnosis || !symptoms) {
        showToast('Please fill symptoms and diagnosis', 'warning');
        return false;
      }

      const newRec = {
        id: `REC-${state.records.length + 1 < 10 ? '0' : ''}${state.records.length + 1}`,
        patientId: pId,
        patientName: patient?.name || 'Patient',
        doctor: document.getElementById('rec-doctor').value,
        visitDate: document.getElementById('rec-date').value,
        symptoms,
        diagnosis,
        notes: document.getElementById('rec-notes').value.trim() || 'No additional notes',
        followupDate: document.getElementById('rec-followup').value || 'As needed'
      };

      state.records.unshift(newRec);
      persist('records', state.records);
      showToast(`Record ${newRec.id} created for ${newRec.patientName}`, 'success');
      if (state.activeView === 'records') renderRecords(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.viewRecordDetails = function(id) {
  const r = state.records.find(rec => rec.id === id);
  if (!r) return;

  openModal({
    title: `<i class="fa-solid fa-file-waveform"></i> Medical Record: ${r.id}`,
    body: `
      <div style="font-size:0.875rem; display:flex; flex-direction:column; gap:0.75rem;">
        <div><b>Patient:</b> ${escapeHtml(r.patientName)} (<code>${r.patientId}</code>)</div>
        <div><b>Attending Physician:</b> ${escapeHtml(r.doctor)}</div>
        <div><b>Visit Date:</b> ${r.visitDate}</div>
        <div style="background:var(--bg-surface-alt);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
          <div style="font-weight:700;color:var(--primary);margin-bottom:0.25rem;">Presenting Symptoms:</div>
          <div>${escapeHtml(r.symptoms)}</div>
        </div>
        <div style="background:var(--bg-surface-alt);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
          <div style="font-weight:700;color:var(--primary);margin-bottom:0.25rem;">Confirmed Diagnosis:</div>
          <div style="font-weight:600;">${escapeHtml(r.diagnosis)}</div>
        </div>
        <div>
          <b>Clinical Treatment Notes:</b>
          <p style="margin-top:0.25rem;color:var(--text-muted);">${escapeHtml(r.notes)}</p>
        </div>
        <div><b>Recommended Follow-up:</b> ${r.followupDate || 'None'}</div>
      </div>
    `,
    confirmText: 'Close',
    confirmClass: 'btn-outline',
    onConfirm: () => true
  });
};

/* --------------------------------------------------------------------------
   14. VIEW: PRESCRIPTION MANAGEMENT & PRINTABLE RX
   -------------------------------------------------------------------------- */
function renderPrescriptions(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Prescription Management</h2>
        <p>Digital medical prescriptions, dosage scheduling, instructions & official printable Rx forms</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openPrescriptionModal()">
          <i class="fa-solid fa-plus"></i> Write Prescription
        </button>
      </div>
    </div>

    <!-- Prescriptions Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rx ID</th>
              <th>Patient</th>
              <th>Prescribing Doctor</th>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Medications Count</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.prescriptions.map(rx => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${rx.id}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(rx.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${rx.patientId}</div>
                </td>
                <td>${escapeHtml(rx.doctor)}</td>
                <td class="tabular-nums">${rx.date}</td>
                <td>${escapeHtml(rx.diagnosis || 'General prescription')}</td>
                <td><span class="badge badge-info">${rx.medicines?.length || 0} drugs</span></td>
                <td style="text-align: right; white-space: nowrap;">
                  <button class="btn btn-outline btn-sm" onclick="printPrescriptionDoc('${rx.id}')" title="Print Official Rx">
                    <i class="fa-solid fa-print"></i> Print Rx
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openPrescriptionModal = function() {
  openModal({
    title: `<i class="fa-solid fa-prescription"></i> Create New Prescription`,
    sizeClass: 'modal-lg',
    body: `
      <form id="rx-form">
        <div class="form-grid-3">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="rx-patient" class="form-control" required>
              ${state.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Doctor <span class="required">*</span></label>
            <select id="rx-doctor" class="form-control" required>
              ${state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Date <span class="required">*</span></label>
            <input type="date" id="rx-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}" />
          </div>
        </div>

        <div class="form-group">
          <label>Clinical Diagnosis <span class="required">*</span></label>
          <input type="text" id="rx-diagnosis" class="form-control" required placeholder="e.g. Essential Hypertension, Bronchial Asthma" />
        </div>

        <div style="margin-top:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <label style="font-weight:700;color:var(--primary);margin:0;">Prescribed Medications</label>
            <button type="button" class="btn btn-outline btn-sm" onclick="addRxMedRow()"><i class="fa-solid fa-plus"></i> Add Medicine</button>
          </div>
          <div id="rx-medicines-list" style="display:flex;flex-direction:column;gap:0.75rem;">
            <!-- Dynamic rows inserted here -->
          </div>
        </div>
      </form>
    `,
    confirmText: 'Generate Prescription',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const pId = document.getElementById('rx-patient').value;
      const patient = state.patients.find(p => p.id === pId);
      const diag = document.getElementById('rx-diagnosis').value.trim();

      if (!diag) {
        showToast('Please state a diagnosis', 'warning');
        return false;
      }

      // Collect medicines
      const rows = document.querySelectorAll('.rx-med-row');
      const medicines = [];
      rows.forEach(r => {
        const name = r.querySelector('.med-name').value.trim();
        const dosage = r.querySelector('.med-dosage').value.trim();
        const freq = r.querySelector('.med-freq').value.trim();
        const dur = r.querySelector('.med-dur').value.trim();
        const inst = r.querySelector('.med-inst').value.trim();
        if (name) {
          medicines.push({ name, dosage, frequency: freq, duration: dur, instructions: inst });
        }
      });

      if (!medicines.length) {
        showToast('Please add at least one medication', 'warning');
        return false;
      }

      const newRx = {
        id: `RX-${500 + state.prescriptions.length + 1}`,
        patientId: pId,
        patientName: patient?.name || 'Patient',
        doctor: document.getElementById('rx-doctor').value,
        date: document.getElementById('rx-date').value,
        diagnosis: diag,
        medicines
      };

      state.prescriptions.unshift(newRx);
      persist('prescriptions', state.prescriptions);
      showToast(`Prescription ${newRx.id} created`, 'success');
      if (state.activeView === 'prescriptions') renderPrescriptions(document.getElementById('main-viewport'));
      return true;
    }
  });

  // Add initial row
  setTimeout(addRxMedRow, 50);
};

window.addRxMedRow = function() {
  const container = document.getElementById('rx-medicines-list');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'rx-med-row';
  row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.5fr auto;gap:0.5rem;align-items:center;background:var(--bg-surface-alt);padding:0.6rem;border-radius:var(--radius-sm);';
  row.innerHTML = `
    <input type="text" class="form-control med-name" placeholder="Drug Name & Strength (e.g. Paracetamol 500mg)" required />
    <input type="text" class="form-control med-dosage" placeholder="Dosage (1 tab)" />
    <input type="text" class="form-control med-freq" placeholder="Freq (BID/TID)" />
    <input type="text" class="form-control med-dur" placeholder="Duration (5d)" />
    <input type="text" class="form-control med-inst" placeholder="Instructions (After meals)" />
    <button type="button" class="btn btn-danger btn-icon" onclick="this.closest('.rx-med-row').remove()"><i class="fa-solid fa-trash-can"></i></button>
  `;
  container.appendChild(row);
};

window.printPrescriptionDoc = function(rxId) {
  const rx = state.prescriptions.find(p => p.id === rxId);
  if (!rx) return;
  const patient = state.patients.find(p => p.id === rx.patientId);

  openModal({
    title: `<i class="fa-solid fa-print"></i> Official Prescription Preview`,
    sizeClass: 'modal-lg',
    body: `
      <div class="printable-document" id="printable-rx-area">
        <div class="doc-hospital-header">
          <div class="doc-brand">
            <h2>${escapeHtml(state.settings.hospitalName)}</h2>
            <p>${escapeHtml(state.settings.subtitle)} · Phone: ${state.settings.phone}</p>
            <p style="font-size:0.75rem;color:#64748b;">${escapeHtml(state.settings.address)}</p>
          </div>
          <div class="doc-meta">
            <div class="doc-id">PRESCRIPTION Rx</div>
            <div>Ref: <b>${rx.id}</b></div>
            <div>Date: ${rx.date}</div>
          </div>
        </div>

        <div class="doc-patient-box">
          <div class="item">
            <div class="label">Patient Name</div>
            <div class="val">${escapeHtml(rx.patientName)}</div>
          </div>
          <div class="item">
            <div class="label">Patient ID & Age</div>
            <div class="val">${rx.patientId} · ${patient ? `${patient.gender}, ${patient.age} yrs` : 'Adult'}</div>
          </div>
          <div class="item">
            <div class="label">Blood Group / Allergies</div>
            <div class="val">${patient ? `${patient.bloodGroup} / ${patient.allergies || 'None'}` : 'N/A'}</div>
          </div>
        </div>

        <div style="margin-bottom:1.25rem;font-size:0.95rem;">
          <b>Clinical Diagnosis:</b> <span style="color:#0f172a;">${escapeHtml(rx.diagnosis || 'Clinical Medical Care')}</span>
        </div>

        <div style="font-size:1.5rem;font-weight:800;color:#0284c7;margin-bottom:0.75rem;">℞</div>

        <table class="doc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${rx.medicines.map((m, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><b>${escapeHtml(m.name)}</b></td>
                <td>${escapeHtml(m.dosage)}</td>
                <td>${escapeHtml(m.frequency)}</td>
                <td>${escapeHtml(m.duration)}</td>
                <td>${escapeHtml(m.instructions)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="doc-signature">
          <div>
            <div style="font-size:0.75rem;color:#64748b;">Generated via CarePulse HMS Academic Platform</div>
          </div>
          <div class="signature-line">
            <b>${escapeHtml(rx.doctor)}</b><br />
            Authorized Medical Officer
          </div>
        </div>
      </div>
    `,
    confirmText: 'Print Prescription',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      window.print();
      return true;
    }
  });
};

/* --------------------------------------------------------------------------
   15. VIEW: PHARMACY INVENTORY
   -------------------------------------------------------------------------- */
function renderPharmacy(container) {
  const total = state.medicines.length;
  const lowStock = state.medicines.filter(m => m.status === 'Low Stock' || m.quantity < 20).length;
  const expired = state.medicines.filter(m => m.status === 'Expired').length;
  const inventoryValue = state.medicines.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Pharmacy & Drug Inventory</h2>
        <p>Medication stock tracking, batches, expiration alerts & inventory valuation</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openMedicineModal()">
          <i class="fa-solid fa-plus"></i> Add Medicine
        </button>
      </div>
    </div>

    <!-- Inventory KPIs -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Products</div>
          <div class="value tabular-nums">${total}</div>
        </div>
        <div class="stat-icon blue"><i class="fa-solid fa-pills"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Low Stock Alerts</div>
          <div class="value tabular-nums text-warning">${lowStock}</div>
        </div>
        <div class="stat-icon amber"><i class="fa-solid fa-triangle-exclamation"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Expired Batches</div>
          <div class="value tabular-nums text-danger">${expired}</div>
        </div>
        <div class="stat-icon red"><i class="fa-solid fa-ban"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Stock Value</div>
          <div class="value tabular-nums">$${Math.round(inventoryValue).toLocaleString()}</div>
        </div>
        <div class="stat-icon green"><i class="fa-solid fa-warehouse"></i></div>
      </div>
    </div>

    <!-- Medicine Filter -->
    <div class="card">
      <div class="card-body" style="padding:1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom:0;">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="med-search-input" placeholder="Search medicine by name or manufacturer..." oninput="filterMedicinesTable()" />
          </div>
          <select id="med-cat-filter" class="select-filter" onchange="filterMedicinesTable()">
            <option value="">All Categories</option>
            ${[...new Set(state.medicines.map(m => m.category))].map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <select id="med-status-filter" class="select-filter" onchange="filterMedicinesTable()">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Medicines Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="medicines-tbody">
            <!-- Filtered rows render here -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  filterMedicinesTable();
}

window.filterMedicinesTable = function() {
  const query = (document.getElementById('med-search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('med-cat-filter')?.value || '';
  const status = document.getElementById('med-status-filter')?.value || '';
  const tbody = document.getElementById('medicines-tbody');
  if (!tbody) return;

  const filtered = state.medicines.filter(m => {
    const matchQuery = !query || m.name.toLowerCase().includes(query) || m.manufacturer.toLowerCase().includes(query);
    const matchCat = !cat || m.category === cat;
    const matchStatus = !status || m.status === status;
    return matchQuery && matchCat && matchStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted);">No medicines found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(m => `
    <tr>
      <td><span class="tabular-nums font-bold" style="color:var(--primary);">${m.id}</span></td>
      <td><b>${escapeHtml(m.name)}</b></td>
      <td>${escapeHtml(m.category)}</td>
      <td>${escapeHtml(m.manufacturer)}</td>
      <td class="tabular-nums font-semibold">${m.quantity} units</td>
      <td class="tabular-nums">$${m.unitPrice.toFixed(2)}</td>
      <td class="tabular-nums">${m.expiryDate}</td>
      <td><span class="badge ${getStatusBadge(m.status)}">${m.status}</span></td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="btn btn-outline btn-sm" onclick="restockMedicine('${m.id}')" title="Quick Restock">
          <i class="fa-solid fa-box-open"></i> Restock
        </button>
        <button class="btn btn-outline btn-sm" onclick="openMedicineModal('${m.id}')" title="Edit Medicine">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `).join('');
};

window.openMedicineModal = function(editId = null) {
  const med = editId ? state.medicines.find(m => m.id === editId) : null;
  const isEdit = !!med;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-pen-to-square"></i> Edit Medicine` : `<i class="fa-solid fa-plus"></i> Add New Medicine`,
    sizeClass: 'modal-lg',
    body: `
      <form id="med-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Medicine Name & Formulation <span class="required">*</span></label>
            <input type="text" id="m-name" class="form-control" required value="${med ? escapeHtml(med.name) : ''}" placeholder="e.g. Cefuroxime Axetil 500mg" />
          </div>
          <div class="form-group">
            <label>Drug Category <span class="required">*</span></label>
            <input type="text" id="m-cat" class="form-control" required value="${med ? escapeHtml(med.category) : 'Antibiotic'}" placeholder="Antibiotic, Analgesic, Cardiology..." />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Manufacturer <span class="required">*</span></label>
            <input type="text" id="m-man" class="form-control" required value="${med ? escapeHtml(med.manufacturer) : ''}" placeholder="e.g. Pfizer, GSK" />
          </div>
          <div class="form-group">
            <label>Stock Quantity <span class="required">*</span></label>
            <input type="number" id="m-qty" class="form-control" required min="0" value="${med ? med.quantity : 100}" />
          </div>
          <div class="form-group">
            <label>Unit Price ($) <span class="required">*</span></label>
            <input type="number" id="m-price" class="form-control" required min="0.05" step="0.05" value="${med ? med.unitPrice : 1.50}" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Batch Expiry Date <span class="required">*</span></label>
            <input type="date" id="m-exp" class="form-control" required value="${med ? med.expiryDate : '2028-01-01'}" />
          </div>
          <div class="form-group">
            <label>Stock Status</label>
            <select id="m-status" class="form-control">
              <option value="Available" ${med?.status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Low Stock" ${med?.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
              <option value="Out of Stock" ${med?.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
              <option value="Expired" ${med?.status === 'Expired' ? 'selected' : ''}>Expired</option>
            </select>
          </div>
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Add Medicine',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const name = document.getElementById('m-name').value.trim();
      const qty = parseInt(document.getElementById('m-qty').value) || 0;
      const price = parseFloat(document.getElementById('m-price').value) || 1.0;

      if (!name) {
        showToast('Please provide drug name', 'warning');
        return false;
      }

      let status = document.getElementById('m-status').value;
      if (qty <= 0) status = 'Out of Stock';
      else if (qty < 25) status = 'Low Stock';

      if (isEdit) {
        Object.assign(med, {
          name,
          category: document.getElementById('m-cat').value.trim(),
          manufacturer: document.getElementById('m-man').value.trim(),
          quantity: qty,
          unitPrice: price,
          expiryDate: document.getElementById('m-exp').value,
          status
        });
        persist('medicines', state.medicines);
        showToast(`Medicine ${med.name} updated`, 'success');
      } else {
        const newMed = {
          id: `MED-${state.medicines.length + 1 < 10 ? '0' : ''}${state.medicines.length + 1}`,
          name,
          category: document.getElementById('m-cat').value.trim(),
          manufacturer: document.getElementById('m-man').value.trim(),
          quantity: qty,
          unitPrice: price,
          expiryDate: document.getElementById('m-exp').value,
          status
        };
        state.medicines.push(newMed);
        persist('medicines', state.medicines);
        showToast(`Medicine ${newMed.name} added to pharmacy`, 'success');
      }

      if (state.activeView === 'pharmacy') filterMedicinesTable();
      return true;
    }
  });
};

window.restockMedicine = function(id) {
  const med = state.medicines.find(m => m.id === id);
  if (!med) return;

  openModal({
    title: `<i class="fa-solid fa-box-open"></i> Restock ${escapeHtml(med.name)}`,
    body: `
      <p>Current stock: <b>${med.quantity} units</b></p>
      <div class="form-group" style="margin-top:1rem;">
        <label>Quantity to Add <span class="required">*</span></label>
        <input type="number" id="restock-qty" class="form-control" min="10" step="10" value="100" />
      </div>
    `,
    confirmText: 'Add to Inventory',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const addQty = parseInt(document.getElementById('restock-qty').value) || 0;
      if (addQty > 0) {
        med.quantity += addQty;
        if (med.status === 'Low Stock' || med.status === 'Out of Stock') {
          med.status = 'Available';
        }
        persist('medicines', state.medicines);
        showToast(`Added ${addQty} units to ${med.name}`, 'success');
        if (state.activeView === 'pharmacy') filterMedicinesTable();
      }
    }
  });
};

/* --------------------------------------------------------------------------
   16. VIEW: BILLING & PAYMENT MANAGEMENT (WITH PRINTABLE INVOICE)
   -------------------------------------------------------------------------- */
function renderBilling(container) {
  const totalBilled = state.bills.reduce((s, b) => s + b.totalAmount, 0);
  const totalPaid = state.bills.reduce((s, b) => s + b.paidAmount, 0);
  const totalOutstanding = state.bills.reduce((s, b) => s + b.remainingAmount, 0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Hospital Billing & Patient Invoicing</h2>
        <p>Itemized medical charges, insurance claims, payment receipts & printable invoices</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="exportBillingCSV()">
          <i class="fa-solid fa-file-csv"></i> Export Billing CSV
        </button>
        <button class="btn btn-primary" onclick="openBillModal()">
          <i class="fa-solid fa-receipt"></i> Generate New Bill
        </button>
      </div>
    </div>

    <!-- Financial Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Invoiced</div>
          <div class="value tabular-nums">$${totalBilled.toLocaleString()}</div>
        </div>
        <div class="stat-icon blue"><i class="fa-solid fa-file-invoice-dollar"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Total Collected</div>
          <div class="value tabular-nums text-success">$${totalPaid.toLocaleString()}</div>
        </div>
        <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="label">Outstanding Receivables</div>
          <div class="value tabular-nums text-danger">$${totalOutstanding.toLocaleString()}</div>
        </div>
        <div class="stat-icon red"><i class="fa-solid fa-clock-rotate-left"></i></div>
      </div>
    </div>

    <!-- Billing Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Method</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.bills.map(b => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${b.id}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(b.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${b.patientId}</div>
                </td>
                <td class="tabular-nums">${b.date}</td>
                <td class="tabular-nums font-bold">$${b.totalAmount}</td>
                <td class="tabular-nums text-success font-semibold">$${b.paidAmount}</td>
                <td class="tabular-nums text-danger font-semibold">$${b.remainingAmount}</td>
                <td>${b.paymentMethod || 'Pending'}</td>
                <td><span class="badge ${getStatusBadge(b.status)}">${b.status}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                  ${b.status !== 'Paid' ? `
                    <button class="btn btn-outline btn-sm text-success" onclick="openRecordPaymentModal('${b.id}')" title="Collect Payment">
                      <i class="fa-solid fa-money-bill-wave"></i> Pay
                    </button>
                  ` : ''}
                  <button class="btn btn-outline btn-sm" onclick="printInvoiceDoc('${b.id}')" title="Print Official Invoice">
                    <i class="fa-solid fa-print"></i> Invoice
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openBillModal = function() {
  openModal({
    title: `<i class="fa-solid fa-file-invoice"></i> Generate Hospital Invoice`,
    sizeClass: 'modal-lg',
    body: `
      <form id="bill-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="bill-patient" class="form-control" required>
              ${state.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Invoice Date <span class="required">*</span></label>
            <input type="date" id="bill-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}" />
          </div>
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;margin:1.25rem 0 0.75rem;color:var(--primary);border-bottom:1px solid var(--border-color);padding-bottom:0.35rem;">Itemized Charges ($)</h4>
        
        <div class="form-grid-3">
          <div class="form-group">
            <label>Consultation Fee</label>
            <input type="number" id="charge-consult" class="form-control charge-input" min="0" step="5" value="100" oninput="calculateBillTotals()" />
          </div>
          <div class="form-group">
            <label>Pharmacy Charges</label>
            <input type="number" id="charge-med" class="form-control charge-input" min="0" step="5" value="45" oninput="calculateBillTotals()" />
          </div>
          <div class="form-group">
            <label>Laboratory Charges</label>
            <input type="number" id="charge-lab" class="form-control charge-input" min="0" step="5" value="80" oninput="calculateBillTotals()" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Room / Ward Charges</label>
            <input type="number" id="charge-room" class="form-control charge-input" min="0" step="10" value="0" oninput="calculateBillTotals()" />
          </div>
          <div class="form-group">
            <label>Other / Nursing / Surgical Supplies</label>
            <input type="number" id="charge-other" class="form-control charge-input" min="0" step="5" value="25" oninput="calculateBillTotals()" />
          </div>
        </div>

        <div style="background:var(--bg-surface-alt);padding:1rem;border-radius:var(--radius-md);margin-top:1rem;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">CALCULATED TOTAL:</span>
            <div id="bill-total-display" style="font-size:1.5rem;font-weight:800;color:var(--primary);" class="tabular-nums">$250.00</div>
          </div>
          <div style="width:200px;">
            <label style="font-size:0.75rem;font-weight:600;">Initial Payment Received ($)</label>
            <input type="number" id="bill-paid-initial" class="form-control" min="0" step="5" value="250" />
          </div>
        </div>
      </form>
    `,
    confirmText: 'Generate Bill',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const pId = document.getElementById('bill-patient').value;
      const patient = state.patients.find(p => p.id === pId);

      const consult = parseFloat(document.getElementById('charge-consult').value) || 0;
      const med = parseFloat(document.getElementById('charge-med').value) || 0;
      const lab = parseFloat(document.getElementById('charge-lab').value) || 0;
      const room = parseFloat(document.getElementById('charge-room').value) || 0;
      const other = parseFloat(document.getElementById('charge-other').value) || 0;

      const total = consult + med + lab + room + other;
      const paid = Math.min(total, parseFloat(document.getElementById('bill-paid-initial').value) || 0);
      const remaining = total - paid;
      const status = remaining <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';

      const newBill = {
        id: `INV-${1000 + state.bills.length + 1}`,
        patientId: pId,
        patientName: patient?.name || 'Patient',
        consultationFee: consult,
        medicineCharges: med,
        labCharges: lab,
        roomCharges: room,
        otherCharges: other,
        totalAmount: total,
        paidAmount: paid,
        remainingAmount: remaining,
        date: document.getElementById('bill-date').value,
        status,
        paymentMethod: paid > 0 ? 'Cash' : 'Pending'
      };

      state.bills.unshift(newBill);
      persist('bills', state.bills);
      showToast(`Invoice ${newBill.id} created ($${total})`, 'success');
      if (state.activeView === 'billing') renderBilling(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.calculateBillTotals = function() {
  const consult = parseFloat(document.getElementById('charge-consult')?.value) || 0;
  const med = parseFloat(document.getElementById('charge-med')?.value) || 0;
  const lab = parseFloat(document.getElementById('charge-lab')?.value) || 0;
  const room = parseFloat(document.getElementById('charge-room')?.value) || 0;
  const other = parseFloat(document.getElementById('charge-other')?.value) || 0;
  const total = consult + med + lab + room + other;

  const display = document.getElementById('bill-total-display');
  const initialPaid = document.getElementById('bill-paid-initial');
  if (display) display.textContent = `$${total.toFixed(2)}`;
  if (initialPaid) initialPaid.value = total;
};

window.openRecordPaymentModal = function(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;

  openModal({
    title: `<i class="fa-solid fa-money-bill-wave text-success"></i> Record Payment: ${bill.id}`,
    body: `
      <p>Patient: <b>${escapeHtml(bill.patientName)}</b></p>
      <p>Total Billed: <b class="tabular-nums">$${bill.totalAmount}</b> · Remaining: <b class="tabular-nums text-danger">$${bill.remainingAmount}</b></p>

      <div class="form-group" style="margin-top:1rem;">
        <label>Payment Amount to Collect ($) <span class="required">*</span></label>
        <input type="number" id="pay-amount" class="form-control" required min="1" max="${bill.remainingAmount}" value="${bill.remainingAmount}" />
      </div>

      <div class="form-group">
        <label>Payment Method <span class="required">*</span></label>
        <select id="pay-method" class="form-control" required>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Health Insurance">Health Insurance Claim</option>
          <option value="Online Transfer">Online Wire / Mobile Pay</option>
        </select>
      </div>
    `,
    confirmText: 'Record Payment',
    confirmClass: 'btn-success',
    onConfirm: () => {
      const amount = parseFloat(document.getElementById('pay-amount').value) || 0;
      if (amount <= 0) return false;

      bill.paidAmount += amount;
      bill.remainingAmount = Math.max(0, bill.totalAmount - bill.paidAmount);
      bill.status = bill.remainingAmount <= 0 ? 'Paid' : 'Partial';
      bill.paymentMethod = document.getElementById('pay-method').value;

      persist('bills', state.bills);
      addNotification('Payment Received', `$${amount} paid for Invoice #${bill.id} (${bill.patientName})`, 'fa-receipt');
      showToast(`Payment of $${amount} recorded`, 'success');
      if (state.activeView === 'billing') renderBilling(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.printInvoiceDoc = function(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;
  const patient = state.patients.find(p => p.id === bill.patientId);

  openModal({
    title: `<i class="fa-solid fa-print"></i> Official Invoice Preview`,
    sizeClass: 'modal-lg',
    body: `
      <div class="printable-document" id="printable-bill-area">
        <div class="doc-hospital-header">
          <div class="doc-brand">
            <h2>${escapeHtml(state.settings.hospitalName)}</h2>
            <p>${escapeHtml(state.settings.subtitle)}</p>
            <p style="font-size:0.75rem;color:#64748b;">Phone: ${state.settings.phone} · Emergency: ${state.settings.emergency}</p>
          </div>
          <div class="doc-meta">
            <div class="doc-id">OFFICIAL INVOICE</div>
            <div>Invoice #: <b>${bill.id}</b></div>
            <div>Date: ${bill.date}</div>
            <div>Status: <span class="badge ${getStatusBadge(bill.status)}">${bill.status}</span></div>
          </div>
        </div>

        <div class="doc-patient-box">
          <div class="item">
            <div class="label">Billed To</div>
            <div class="val">${escapeHtml(bill.patientName)}</div>
          </div>
          <div class="item">
            <div class="label">Patient ID & Contact</div>
            <div class="val">${bill.patientId} · ${patient?.phone || 'N/A'}</div>
          </div>
          <div class="item">
            <div class="label">Payment Mode</div>
            <div class="val">${bill.paymentMethod || 'Cash'}</div>
          </div>
        </div>

        <table class="doc-table">
          <thead>
            <tr>
              <th>Description / Clinical Service</th>
              <th style="text-align: right;">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Physician Consultation Fee</td>
              <td style="text-align: right;" class="tabular-nums">$${bill.consultationFee.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Pharmacy & Prescription Dispensing</td>
              <td style="text-align: right;" class="tabular-nums">$${bill.medicineCharges.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Diagnostic & Laboratory Analysis</td>
              <td style="text-align: right;" class="tabular-nums">$${bill.labCharges.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Inpatient Room & Bed Charges</td>
              <td style="text-align: right;" class="tabular-nums">$${bill.roomCharges.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Nursing Care & Clinical Supplies</td>
              <td style="text-align: right;" class="tabular-nums">$${bill.otherCharges.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="doc-totals">
          <div class="doc-total-row">
            <span>Subtotal:</span>
            <span class="tabular-nums">$${bill.totalAmount.toFixed(2)}</span>
          </div>
          <div class="doc-total-row">
            <span>Amount Paid:</span>
            <span class="tabular-nums text-success font-semibold">$${bill.paidAmount.toFixed(2)}</span>
          </div>
          <div class="doc-total-row grand">
            <span>Balance Due:</span>
            <span class="tabular-nums">$${bill.remainingAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="doc-signature">
          <div>
            <p style="font-size:0.75rem;color:#64748b;">CarePulse Hospital Management System Academic Demonstration</p>
          </div>
          <div class="signature-line">
            Hospital Billing Cashier
          </div>
        </div>
      </div>
    `,
    confirmText: 'Print Invoice',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      window.print();
      return true;
    }
  });
};

/* --------------------------------------------------------------------------
   17. VIEW: LABORATORY MANAGEMENT
   -------------------------------------------------------------------------- */
function renderLab(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Laboratory Diagnostics</h2>
        <p>Pathology, hematology, biochemistry, and clinical diagnostic lab reports</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openLabTestModal()">
          <i class="fa-solid fa-flask-vial"></i> Order Lab Test
        </button>
      </div>
    </div>

    <!-- Lab Tests Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Patient</th>
              <th>Test Name</th>
              <th>Requisition Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Result Summary</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.labTests.map(test => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${test.id}</span></td>
                <td>
                  <div style="font-weight:600;">${escapeHtml(test.patientName)}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${test.patientId}</div>
                </td>
                <td><b>${escapeHtml(test.testName)}</b></td>
                <td>${escapeHtml(test.doctor)}</td>
                <td class="tabular-nums">${test.testDate}</td>
                <td><span class="badge ${getStatusBadge(test.status)}">${test.status}</span></td>
                <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(test.resultSummary || 'Awaiting lab analysis')}</td>
                <td style="text-align: right; white-space: nowrap;">
                  ${test.status !== 'Completed' ? `
                    <button class="btn btn-outline btn-sm text-primary" onclick="openUpdateLabResultModal('${test.id}')" title="Enter Test Result">
                      <i class="fa-solid fa-square-check"></i> Result
                    </button>
                  ` : ''}
                  <button class="btn btn-outline btn-sm" onclick="printLabReport('${test.id}')" title="Print Lab Report">
                    <i class="fa-solid fa-print"></i> Report
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openLabTestModal = function() {
  openModal({
    title: `<i class="fa-solid fa-flask-vial"></i> Order Diagnostic Laboratory Test`,
    sizeClass: 'modal-lg',
    body: `
      <form id="lab-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Select Patient <span class="required">*</span></label>
            <select id="lab-patient" class="form-control" required>
              ${state.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Ordering Doctor <span class="required">*</span></label>
            <select id="lab-doctor" class="form-control" required>
              ${state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Diagnostic Test Name <span class="required">*</span></label>
            <select id="lab-name" class="form-control" required>
              <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
              <option value="Cardiac Troponin I & Lipid Panel">Cardiac Troponin I & Lipid Panel</option>
              <option value="Liver Function Tests (LFT)">Liver Function Tests (LFT)</option>
              <option value="Renal Function Tests (RFT) & eGFR">Renal Function Tests (RFT) & eGFR</option>
              <option value="Fasting Blood Glucose & HbA1c">Fasting Blood Glucose & HbA1c</option>
              <option value="12-Lead Electrocardiogram (ECG)">12-Lead Electrocardiogram (ECG)</option>
              <option value="Chest X-Ray (PA View)">Chest X-Ray (PA View)</option>
              <option value="Urine Routine Analysis & Microscopy">Urine Routine Analysis & Microscopy</option>
            </select>
          </div>
          <div class="form-group">
            <label>Department</label>
            <select id="lab-dept" class="form-control">
              ${state.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </form>
    `,
    confirmText: 'Order Test',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const pId = document.getElementById('lab-patient').value;
      const patient = state.patients.find(p => p.id === pId);

      const newTest = {
        id: `LAB-${100 + state.labTests.length + 1}`,
        patientId: pId,
        patientName: patient?.name || 'Patient',
        testName: document.getElementById('lab-name').value,
        doctor: document.getElementById('lab-doctor').value,
        department: document.getElementById('lab-dept').value,
        testDate: new Date().toISOString().split('T')[0],
        status: 'Requested',
        resultSummary: 'Sample collected, pending clinical laboratory analysis'
      };

      state.labTests.unshift(newTest);
      persist('labTests', state.labTests);
      showToast(`Ordered ${newTest.testName} for ${newTest.patientName}`, 'success');
      if (state.activeView === 'lab') renderLab(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.openUpdateLabResultModal = function(id) {
  const test = state.labTests.find(t => t.id === id);
  if (!test) return;

  openModal({
    title: `<i class="fa-solid fa-square-check"></i> Enter Result for ${test.id}`,
    body: `
      <p>Test: <b>${escapeHtml(test.testName)}</b></p>
      <p>Patient: <b>${escapeHtml(test.patientName)}</b></p>

      <div class="form-group" style="margin-top:1rem;">
        <label>Lab Findings & Values Summary <span class="required">*</span></label>
        <textarea id="lab-res-text" class="form-control" rows="3" required placeholder="e.g. Hemoglobin: 14.2 g/dL, WBC: 7,500/uL, Platelets: 250,000/uL. Values within normal range."></textarea>
      </div>

      <div class="form-group">
        <label>Status <span class="required">*</span></label>
        <select id="lab-res-status" class="form-control" required>
          <option value="Completed">Completed & Verified</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>
    `,
    confirmText: 'Save Test Result',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const summary = document.getElementById('lab-res-text').value.trim();
      if (!summary) {
        showToast('Please enter the result findings', 'warning');
        return false;
      }

      test.resultSummary = summary;
      test.status = document.getElementById('lab-res-status').value;
      persist('labTests', state.labTests);

      addNotification('Lab Test Verified', `${test.testName} for ${test.patientName} is ready`, 'fa-flask-vial');
      showToast(`Test ${test.id} updated`, 'success');
      if (state.activeView === 'lab') renderLab(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.printLabReport = function(id) {
  const test = state.labTests.find(t => t.id === id);
  if (!test) return;
  const patient = state.patients.find(p => p.id === test.patientId);

  openModal({
    title: `<i class="fa-solid fa-print"></i> Diagnostic Lab Report Preview`,
    sizeClass: 'modal-lg',
    body: `
      <div class="printable-document" id="printable-lab-area">
        <div class="doc-hospital-header">
          <div class="doc-brand">
            <h2>${escapeHtml(state.settings.hospitalName)}</h2>
            <p>Department of Clinical Pathology & Laboratory Medicine</p>
            <p style="font-size:0.75rem;color:#64748b;">${escapeHtml(state.settings.address)}</p>
          </div>
          <div class="doc-meta">
            <div class="doc-id">LAB REPORT</div>
            <div>Test Ref: <b>${test.id}</b></div>
            <div>Date: ${test.testDate}</div>
          </div>
        </div>

        <div class="doc-patient-box">
          <div class="item">
            <div class="label">Patient Name</div>
            <div class="val">${escapeHtml(test.patientName)}</div>
          </div>
          <div class="item">
            <div class="label">Patient ID & Gender</div>
            <div class="val">${test.patientId} · ${patient?.gender || 'N/A'}, ${patient?.age || ''} yrs</div>
          </div>
          <div class="item">
            <div class="label">Referring Doctor</div>
            <div class="val">${escapeHtml(test.doctor)}</div>
          </div>
        </div>

        <div style="margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem;color:#0284c7;font-weight:700;margin-bottom:0.5rem;">${escapeHtml(test.testName)}</h3>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:1rem;border-radius:8px;font-size:0.9rem;line-height:1.6;">
            <b>Clinical Laboratory Findings:</b><br />
            ${escapeHtml(test.resultSummary)}
          </div>
        </div>

        <div class="doc-signature">
          <div>
            <p style="font-size:0.75rem;color:#64748b;">Quality Controlled & Verified via CarePulse LIS</p>
          </div>
          <div class="signature-line">
            Senior Medical Technologist<br />
            Department of Pathology
          </div>
        </div>
      </div>
    `,
    confirmText: 'Print Report',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      window.print();
      return true;
    }
  });
};

/* --------------------------------------------------------------------------
   18. VIEW: DEPARTMENTS & STAFF MANAGEMENT
   -------------------------------------------------------------------------- */
function renderDepartments(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Hospital Departments</h2>
        <p>Clinical specialty units, medical directorships, capacity & patient distributions</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openDepartmentModal()">
          <i class="fa-solid fa-plus"></i> Add Department
        </button>
      </div>
    </div>

    <!-- Departments Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
      ${state.departments.map(dept => {
        const docCount = state.doctors.filter(d => d.department === dept.name).length;
        const patCount = state.patients.filter(p => p.department === dept.name).length;
        return `
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <h3 style="font-size:1rem;"><i class="fa-solid fa-hospital text-primary"></i> ${escapeHtml(dept.name)}</h3>
              <button class="btn btn-outline btn-sm" onclick="openDepartmentModal('${dept.id}')"><i class="fa-solid fa-pen"></i></button>
            </div>
            <div class="card-body">
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.75rem;">${escapeHtml(dept.description)}</div>
              <div style="font-size:0.8rem;margin-bottom:0.35rem;">Head: <b>${escapeHtml(dept.head)}</b></div>
              <div style="display:flex;gap:1rem;margin-top:0.75rem;">
                <span class="badge badge-info"><i class="fa-solid fa-user-doctor"></i> ${docCount} Doctors</span>
                <span class="badge badge-success"><i class="fa-solid fa-user-injured"></i> ${patCount} Patients</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.openDepartmentModal = function(editId = null) {
  const dept = editId ? state.departments.find(d => d.id === editId) : null;
  const isEdit = !!dept;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-building-pen"></i> Edit Department` : `<i class="fa-solid fa-plus"></i> Add Department`,
    body: `
      <form id="dept-form">
        <div class="form-group">
          <label>Department Name <span class="required">*</span></label>
          <input type="text" id="dept-name" class="form-control" required value="${dept ? escapeHtml(dept.name) : ''}" placeholder="e.g. Oncology, Radiology" />
        </div>
        <div class="form-group">
          <label>Department Head <span class="required">*</span></label>
          <input type="text" id="dept-head" class="form-control" required value="${dept ? escapeHtml(dept.head) : ''}" placeholder="e.g. Dr. Jane Smith" />
        </div>
        <div class="form-group">
          <label>Clinical Description</label>
          <textarea id="dept-desc" class="form-control" rows="2" placeholder="Summary of medical services provided...">${dept ? escapeHtml(dept.description) : ''}</textarea>
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Create Department',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const name = document.getElementById('dept-name').value.trim();
      const head = document.getElementById('dept-head').value.trim();

      if (!name || !head) {
        showToast('Please provide department name and head', 'warning');
        return false;
      }

      if (isEdit) {
        dept.name = name;
        dept.head = head;
        dept.description = document.getElementById('dept-desc').value.trim();
        persist('departments', state.departments);
        showToast(`Department ${dept.name} updated`, 'success');
      } else {
        const newDept = {
          id: `DEP-0${state.departments.length + 1}`,
          name,
          head,
          description: document.getElementById('dept-desc').value.trim() || 'Clinical specialty department',
          doctorsCount: 1,
          patientsCount: 0
        };
        state.departments.push(newDept);
        persist('departments', state.departments);
        showToast(`Department ${newDept.name} created`, 'success');
      }

      if (state.activeView === 'departments') renderDepartments(document.getElementById('main-viewport'));
      return true;
    }
  });
};

function renderStaff(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Hospital Staff Directory</h2>
        <p>Nursing officers, laboratory technicians, pharmacists & administrative staff</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openStaffModal()">
          <i class="fa-solid fa-user-plus"></i> Add Staff Member
        </button>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Shift Timing</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.staff.map(s => `
              <tr>
                <td><span class="tabular-nums font-bold" style="color:var(--primary);">${s.id}</span></td>
                <td><b>${escapeHtml(s.name)}</b></td>
                <td><span class="badge badge-info">${s.role}</span></td>
                <td>${escapeHtml(s.department)}</td>
                <td class="tabular-nums">${escapeHtml(s.phone)}</td>
                <td>${escapeHtml(s.shift)}</td>
                <td><span class="badge badge-success">${s.status}</span></td>
                <td style="text-align: right; white-space: nowrap;">
                  <button class="btn btn-outline btn-sm" onclick="openStaffModal('${s.id}')" title="Edit Staff">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="deleteStaffMember('${s.id}')" title="Delete Staff">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openStaffModal = function(editId = null) {
  const staff = editId ? state.staff.find(s => s.id === editId) : null;
  const isEdit = !!staff;

  openModal({
    title: isEdit ? `<i class="fa-solid fa-user-pen"></i> Edit Staff` : `<i class="fa-solid fa-user-plus"></i> Add Staff Member`,
    body: `
      <form id="staff-form">
        <div class="form-group">
          <label>Full Name <span class="required">*</span></label>
          <input type="text" id="stf-name" class="form-control" required value="${staff ? escapeHtml(staff.name) : ''}" placeholder="e.g. Jessica Taylor, RN" />
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Role <span class="required">*</span></label>
            <select id="stf-role" class="form-control" required>
              ${['Nurse', 'Receptionist', 'Laboratory Technician', 'Pharmacist', 'Accountant', 'Administrative Staff'].map(r => `
                <option value="${r}" ${staff?.role === r ? 'selected' : ''}>${r}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <input type="text" id="stf-dept" class="form-control" required value="${staff ? escapeHtml(staff.department) : 'Clinical Care'}" />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Phone Number <span class="required">*</span></label>
            <input type="tel" id="stf-phone" class="form-control" required value="${staff ? escapeHtml(staff.phone) : ''}" placeholder="+1 (555) 000-0000" />
          </div>
          <div class="form-group">
            <label>Shift Timing</label>
            <input type="text" id="stf-shift" class="form-control" value="${staff ? escapeHtml(staff.shift) : 'Day (08:00 AM - 04:00 PM)'}" />
          </div>
        </div>
      </form>
    `,
    confirmText: isEdit ? 'Save Changes' : 'Add Staff',
    confirmClass: 'btn-primary',
    onConfirm: () => {
      const name = document.getElementById('stf-name').value.trim();
      const phone = document.getElementById('stf-phone').value.trim();
      if (!name || !phone) {
        showToast('Please provide staff name and phone', 'warning');
        return false;
      }

      if (isEdit) {
        Object.assign(staff, {
          name,
          role: document.getElementById('stf-role').value,
          department: document.getElementById('stf-dept').value.trim(),
          phone,
          shift: document.getElementById('stf-shift').value.trim()
        });
        persist('staff', state.staff);
        showToast(`Staff member ${staff.name} updated`, 'success');
      } else {
        const newStaff = {
          id: `STF-${state.staff.length + 1 < 10 ? '0' : ''}${state.staff.length + 1}`,
          name,
          role: document.getElementById('stf-role').value,
          department: document.getElementById('stf-dept').value.trim(),
          phone,
          email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@hms.com`,
          shift: document.getElementById('stf-shift').value.trim(),
          status: 'Active'
        };
        state.staff.push(newStaff);
        persist('staff', state.staff);
        showToast(`Staff member ${newStaff.name} added`, 'success');
      }

      if (state.activeView === 'staff') renderStaff(document.getElementById('main-viewport'));
      return true;
    }
  });
};

window.deleteStaffMember = function(id) {
  const s = state.staff.find(st => st.id === id);
  if (!s) return;

  openModal({
    title: `<i class="fa-solid fa-trash-can text-danger"></i> Remove Staff Member`,
    body: `<p>Are you sure you want to remove <b>${escapeHtml(s.name)}</b>?</p>`,
    confirmText: 'Remove',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      state.staff = state.staff.filter(st => st.id !== id);
      persist('staff', state.staff);
      showToast('Staff member removed', 'info');
      if (state.activeView === 'staff') renderStaff(document.getElementById('main-viewport'));
    }
  });
};

/* --------------------------------------------------------------------------
   19. VIEW: REPORTS & ANALYTICS (CSV EXPORT & PRINTING)
   -------------------------------------------------------------------------- */
function renderReports(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Executive Reports & Analytics</h2>
        <p>Comprehensive hospital statistics, financial audits, inpatient summaries & CSV export</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Report
        </button>
      </div>
    </div>

    <!-- Report Selector Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchReportTab(this, 'rep-patients')">Patients Report</button>
      <button class="tab-btn" onclick="switchReportTab(this, 'rep-billing')">Financial & Billing</button>
      <button class="tab-btn" onclick="switchReportTab(this, 'rep-admissions')">Admissions & Beds</button>
      <button class="tab-btn" onclick="switchReportTab(this, 'rep-pharmacy')">Pharmacy Stock</button>
    </div>

    <!-- Patients Report -->
    <div id="rep-patients" class="tab-pane active">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-users text-primary"></i> Patient Demographics & Status Audit</h3>
          <button class="btn btn-outline btn-sm" onclick="exportPatientsCSV()"><i class="fa-solid fa-download"></i> Export CSV</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Gender/Age</th><th>Phone</th><th>Department</th><th>Doctor</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.patients.map(p => `
                <tr>
                  <td><b>${p.id}</b></td>
                  <td>${escapeHtml(p.name)}</td>
                  <td>${p.gender}, ${p.age} yrs</td>
                  <td>${p.phone}</td>
                  <td>${p.department}</td>
                  <td>${p.doctor}</td>
                  <td><span class="badge ${getStatusBadge(p.status)}">${p.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Financial Report -->
    <div id="rep-billing" class="tab-pane">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-dollar-sign text-success"></i> Revenue & Payment Reconciliation</h3>
          <button class="btn btn-outline btn-sm" onclick="exportBillingCSV()"><i class="fa-solid fa-download"></i> Export CSV</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.bills.map(b => `
                <tr>
                  <td><b>${b.id}</b></td>
                  <td>${escapeHtml(b.patientName)}</td>
                  <td>${b.date}</td>
                  <td class="tabular-nums font-bold">$${b.totalAmount}</td>
                  <td class="tabular-nums text-success">$${b.paidAmount}</td>
                  <td class="tabular-nums text-danger">$${b.remainingAmount}</td>
                  <td>${b.paymentMethod || 'Pending'}</td>
                  <td><span class="badge ${getStatusBadge(b.status)}">${b.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Admissions Report -->
    <div id="rep-admissions" class="tab-pane">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-bed-pulse text-danger"></i> Inpatient Ward Occupancy Report</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Adm ID</th><th>Patient</th><th>Ward</th><th>Room/Bed</th><th>Admit Date</th><th>Discharge Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.admissions.map(a => `
                <tr>
                  <td><b>${a.id}</b></td>
                  <td>${escapeHtml(a.patientName)}</td>
                  <td>${a.ward}</td>
                  <td>${a.room} - ${a.bedNumber}</td>
                  <td>${a.admitDate}</td>
                  <td>${a.dischargeDate || 'Current Inpatient'}</td>
                  <td><span class="badge ${a.status === 'Admitted' ? 'badge-danger' : 'badge-success'}">${a.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pharmacy Report -->
    <div id="rep-pharmacy" class="tab-pane">
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-pills text-warning"></i> Inventory & Stock Expiry Audit</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>ID</th><th>Medicine Name</th><th>Category</th><th>Quantity</th><th>Unit Price</th><th>Value</th><th>Expiry</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${state.medicines.map(m => `
                <tr>
                  <td><b>${m.id}</b></td>
                  <td>${escapeHtml(m.name)}</td>
                  <td>${m.category}</td>
                  <td class="tabular-nums">${m.quantity}</td>
                  <td class="tabular-nums">$${m.unitPrice.toFixed(2)}</td>
                  <td class="tabular-nums font-semibold">$${(m.quantity * m.unitPrice).toFixed(2)}</td>
                  <td class="tabular-nums">${m.expiryDate}</td>
                  <td><span class="badge ${getStatusBadge(m.status)}">${m.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.switchReportTab = function(btnEl, tabId) {
  document.querySelectorAll('.tabs-nav .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btnEl.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
};

/* CSV EXPORT UTILITIES */
window.exportPatientsCSV = function() {
  const headers = ['Patient ID', 'Name', 'Father Name', 'Gender', 'Age', 'Blood Group', 'CNIC', 'Phone', 'Email', 'Department', 'Doctor', 'Status'];
  const rows = state.patients.map(p => [
    p.id, p.name, p.fatherName, p.gender, p.age, p.bloodGroup, p.cnic, p.phone, p.email, p.department, p.doctor, p.status
  ]);
  downloadCSV('HMS_Patients_Export.csv', headers, rows);
};

window.exportBillingCSV = function() {
  const headers = ['Invoice ID', 'Patient ID', 'Patient Name', 'Date', 'Consultation', 'Medicine', 'Lab', 'Room', 'Other', 'Total', 'Paid', 'Balance', 'Method', 'Status'];
  const rows = state.bills.map(b => [
    b.id, b.patientId, b.patientName, b.date, b.consultationFee, b.medicineCharges, b.labCharges, b.roomCharges, b.otherCharges, b.totalAmount, b.paidAmount, b.remainingAmount, b.paymentMethod, b.status
  ]);
  downloadCSV('HMS_Billing_Financial_Report.csv', headers, rows);
};

function downloadCSV(filename, headers, rows) {
  let csv = headers.join(',') + '\n';
  rows.forEach(r => {
    csv += r.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported ${filename}`, 'success');
}

/* --------------------------------------------------------------------------
   20. VIEW: SYSTEM SETTINGS & PROFILE
   -------------------------------------------------------------------------- */
function renderSettings(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>System Settings & User Profile</h2>
        <p>Current session credentials, hospital metadata, visual theme & demo database tools</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
      <!-- Active User Profile Card -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-user-shield text-primary"></i> Current Active User Profile</h3>
        </div>
        <div class="card-body">
          <div style="display:flex;gap:1.25rem;align-items:center;margin-bottom:1.5rem;">
            <div class="user-avatar-sm" style="width:60px;height:60px;font-size:1.5rem;">
              ${state.currentUser.avatar || 'US'}
            </div>
            <div>
              <div style="font-size:1.1rem;font-weight:700;">${escapeHtml(state.currentUser.name)}</div>
              <div style="font-size:0.8rem;color:var(--primary);font-weight:600;">${escapeHtml(state.currentUser.title)}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(state.currentUser.email)}</div>
            </div>
          </div>

          <form onsubmit="handlePasswordChangeSim(event)">
            <h4 style="font-size:0.85rem;font-weight:700;margin-bottom:0.75rem;color:var(--primary);">Security / Change Password</h4>
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" class="form-control" required placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" class="form-control" required placeholder="Minimum 6 characters" />
            </div>
            <button type="submit" class="btn btn-outline btn-sm">Update Password</button>
          </form>
        </div>
      </div>

      <!-- Hospital Information Card -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fa-solid fa-hospital text-secondary"></i> Hospital Profile & Appearance</h3>
        </div>
        <div class="card-body">
          <form onsubmit="saveHospitalSettings(event)">
            <div class="form-group">
              <label>Hospital Brand Name</label>
              <input type="text" id="set-hosp-name" class="form-control" value="${escapeHtml(state.settings.hospitalName)}" required />
            </div>
            <div class="form-group">
              <label>Tagline / Subtitle</label>
              <input type="text" id="set-hosp-sub" class="form-control" value="${escapeHtml(state.settings.subtitle)}" />
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Main Phone</label>
                <input type="text" id="set-hosp-phone" class="form-control" value="${escapeHtml(state.settings.phone)}" />
              </div>
              <div class="form-group">
                <label>Emergency Line</label>
                <input type="text" id="set-hosp-emerg" class="form-control" value="${escapeHtml(state.settings.emergency)}" />
              </div>
            </div>
            <div class="form-group">
              <label>Physical Address</label>
              <input type="text" id="set-hosp-addr" class="form-control" value="${escapeHtml(state.settings.address)}" />
            </div>

            <div style="margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;">
              <button type="submit" class="btn btn-primary">Save Information</button>
              <button type="button" class="btn btn-outline" onclick="window.toggleTheme()">
                <i class="fa-solid fa-circle-half-stroke"></i> Toggle Theme
              </button>
            </div>
          </form>

          <!-- Reset Demo Data for University Evaluators -->
          <div style="margin-top:2rem;padding-top:1.25rem;border-top:1px solid var(--border-color);">
            <div style="font-weight:700;color:var(--danger);font-size:0.85rem;margin-bottom:0.25rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> Academic Evaluation Reset
            </div>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem;">
              Restore clean demonstration data (15 patients, 8 doctors, 20 beds, 20 medicines, 15 bills, etc.).
            </p>
            <button type="button" class="btn btn-danger btn-sm" onclick="resetDatabaseDemo()">
              <i class="fa-solid fa-rotate-left"></i> Reset Demo Database
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.saveHospitalSettings = function(e) {
  e.preventDefault();
  state.settings.hospitalName = document.getElementById('set-hosp-name').value.trim();
  state.settings.subtitle = document.getElementById('set-hosp-sub').value.trim();
  state.settings.phone = document.getElementById('set-hosp-phone').value.trim();
  state.settings.emergency = document.getElementById('set-hosp-emerg').value.trim();
  state.settings.address = document.getElementById('set-hosp-addr').value.trim();

  persist('settings', state.settings);
  showToast('Hospital configuration updated successfully', 'success');
};

window.handlePasswordChangeSim = function(e) {
  e.preventDefault();
  showToast('Password changed successfully for this demonstration session.', 'success');
};

window.resetDatabaseDemo = function() {
  openModal({
    title: `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Reset Demo Data`,
    body: `<p>Are you sure you want to restore the entire dataset to default academic presentation values?</p>`,
    confirmText: 'Reset Everything',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      localStorage.clear();
      initializeDemoData(true);
      loadAllState();
      showToast('Database reset to fresh demo data!', 'success');
      switchView('dashboard');
    }
  });
};

/* --------------------------------------------------------------------------
   21. SHARED UTILITIES & MODAL ENGINE
   -------------------------------------------------------------------------- */
window.updateDoctorDropdownByDept = function(deptName, targetSelectId) {
  const target = document.getElementById(targetSelectId);
  if (!target) return;
  const docs = state.doctors.filter(d => !deptName || d.department === deptName);
  target.innerHTML = docs.length ? docs.map(d => `
    <option value="${d.name}">${d.name} (${d.specialization})</option>
  `).join('') : state.doctors.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
};

function getStatusBadge(status) {
  switch ((status || '').toLowerCase()) {
    case 'active':
    case 'available':
    case 'confirmed':
    case 'completed':
    case 'paid':
      return 'badge-success';
    case 'scheduled':
    case 'in consultation':
    case 'in progress':
      return 'badge-info';
    case 'waiting':
    case 'partial':
    case 'low stock':
    case 'maintenance':
      return 'badge-warning';
    case 'admitted':
    case 'occupied':
    case 'unpaid':
    case 'out of stock':
    case 'expired':
    case 'cancelled':
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
}

function openModal(options) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const {
    title = 'Modal Dialog',
    body = '',
    sizeClass = '',
    confirmText = 'Confirm',
    confirmClass = 'btn-primary',
    cancelText = 'Cancel',
    onConfirm = null
  } = options;

  container.innerHTML = `
    <div class="modal-overlay show" id="active-modal-overlay">
      <div class="modal-dialog ${sizeClass}">
        <div class="modal-header">
          <h3>${title}</h3>
          <button type="button" class="btn-icon-subtle" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          ${body}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeModal()">${cancelText}</button>
          <button type="button" class="btn ${confirmClass}" id="modal-confirm-btn">${confirmText}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    if (onConfirm) {
      const result = onConfirm();
      if (result !== false) closeModal();
    } else {
      closeModal();
    }
  });

  document.getElementById('active-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'active-modal-overlay') closeModal();
  });
}

window.closeModal = function() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
};

window.showToast = function(message, type = 'info', title = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'danger') icon = 'fa-circle-exclamation';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  const defaultTitle = type.charAt(0).toUpperCase() + type.slice(1);

  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="toast-content">
      <div class="title">${title || defaultTitle}</div>
      <div class="message">${escapeHtml(message)}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
