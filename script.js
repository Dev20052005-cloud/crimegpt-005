// ============================
// Utility helpers
// ============================
function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function toggleClass(el, className, force) {
    if (!el) return;
    if (typeof force === "boolean") {
        el.classList.toggle(className, force);
    } else {
        el.classList.toggle(className);
    }
}

// ============================
// Mock data
// ============================
const recentCases = [
    { id: "CR045", type: "Robbery", location: "Downtown Mall", date: "2026-02-08 18:32", status: "open" },
    { id: "CR044", type: "Fraud", location: "Online", date: "2026-02-07 13:18", status: "in-progress" },
    { id: "CR043", type: "Assault", location: "Riverside Park", date: "2026-02-05 21:45", status: "solved" },
    { id: "CR042", type: "Theft", location: "City Library", date: "2026-02-03 10:05", status: "closed" },
];

const allCrimes = Array.from({ length: 32 }).map((_, idx) => {
    const types = ["Theft", "Robbery", "Assault", "Homicide", "Fraud"];
    const statuses = ["open", "in-progress", "solved", "closed"];
    const victims = ["John Doe", "Jane Smith", "Michael Brown", "Emily Davis", "Not Disclosed"];
    const locations = ["Downtown", "Uptown", "Suburb", "Industrial Area", "Old Town"];
    const i = idx + 1;
    return {
        id: `CR${String(15 + i).padStart(3, "0")}`,
        type: types[idx % types.length],
        description: `${types[idx % types.length]} case #${i}`,
        victim: victims[idx % victims.length],
        location: locations[idx % locations.length],
        datetime: `2026-01-${String((idx % 28) + 1).padStart(2, "0")} ${(8 + (idx % 10)).toString().padStart(2, "0")}:15`,
        status: statuses[idx % statuses.length],
    };
});

const officers = [
    { id: 1, name: "John Smith", badge: "A-1023", rank: "Inspector", dept: "Homicide", contact: "+1 555-0101", status: "Active" },
    { id: 2, name: "Maria Garcia", badge: "B-2044", rank: "Sergeant", dept: "Cyber Crime", contact: "+1 555-0102", status: "Active" },
    { id: 3, name: "David Chen", badge: "C-3211", rank: "Lieutenant", dept: "Narcotics", contact: "+1 555-0103", status: "On Leave" },
    { id: 4, name: "Sarah Johnson", badge: "D-1908", rank: "Officer", dept: "Patrol", contact: "+1 555-0104", status: "Active" },
];

// ============================
// Login handling
// ============================
function setupLogin() {
    const loginContainer = $("#login-container");
    const dashboardContainer = $("#dashboard-container");
    const loginBtn = $("#login-btn");
    const usernameInput = $("#username");
    const passwordInput = $("#password");
    const usernameGroup = $("#username-group");
    const passwordGroup = $("#password-group");

    if (!loginBtn) return;

    loginBtn.addEventListener("click", () => {
        toggleClass(loginBtn, "loading", true);
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        let valid = true;
        if (!username) {
            toggleClass(usernameGroup, "error", true);
            valid = false;
        } else {
            toggleClass(usernameGroup, "error", false);
        }
        if (!password) {
            toggleClass(passwordGroup, "error", true);
            valid = false;
        } else {
            toggleClass(passwordGroup, "error", false);
        }

        // Demo credentials: admin / admin
        if (valid && (username !== "admin" || password !== "admin")) {
            toggleClass(passwordGroup, "error", true);
            passwordGroup.querySelector(".error-message").textContent = "Invalid credentials. Use admin / admin.";
            valid = false;
        }

        setTimeout(() => {
            toggleClass(loginBtn, "loading", false);
            if (!valid) return;

            if (loginContainer && dashboardContainer) {
                loginContainer.style.display = "none";
                dashboardContainer.style.display = "flex";
            }
            const currentUser = $("#current-user");
            if (currentUser) currentUser.textContent = username || "Admin";
        }, 600);
    });
}

// ============================
// Tab navigation
// ============================
function setupTabs() {
    const menuItems = $all(".menu li[data-tab]");
    const logoutBtn = $("#logout-btn");
    const loginContainer = $("#login-container");
    const dashboardContainer = $("#dashboard-container");

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            const tab = item.getAttribute("data-tab");
            if (!tab) return;

            menuItems.forEach((m) => m.classList.remove("active"));
            item.classList.add("active");

            $all(".tab-content").forEach((section) => {
                section.classList.remove("active");
            });

            const activeSection = document.getElementById(`${tab}-tab`);
            if (activeSection) {
                activeSection.classList.add("active");
            }
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (dashboardContainer && loginContainer) {
                dashboardContainer.style.display = "none";
                loginContainer.style.display = "flex";
            }
        });
    }
}

// ============================
// Sidebar toggle (collapse)
// ============================
function setupSidebarToggle() {
    const sidebar = $(".sidebar");
    const toggleBtn = $("#toggle-sidebar");
    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        if (sidebar.classList.contains("collapsed")) {
            sidebar.style.width = "68px";
            $all(".menu li span").forEach((s) => (s.style.display = "none"));
        } else {
            sidebar.style.width = "";
            $all(".menu li span").forEach((s) => (s.style.display = ""));
        }
    });
}

// ============================
// Dropdowns (notifications, user)
// ============================
function setupDropdowns() {
    const notifTrigger = $("#notification-bell");
    const notifDropdown = $("#notification-dropdown");
    const userAvatar = $(".avatar");
    const userDropdown = $("#user-dropdown");
    const profileLogout = $("#profile-logout");
    const loginContainer = $("#login-container");
    const dashboardContainer = $("#dashboard-container");

    function closeAll() {
        if (notifDropdown) notifDropdown.style.display = "none";
        if (userDropdown) userDropdown.style.display = "none";
    }

    if (notifTrigger && notifDropdown) {
        notifTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const visible = notifDropdown.style.display === "block";
            closeAll();
            notifDropdown.style.display = visible ? "none" : "block";
        });
    }

    if (userAvatar && userDropdown) {
        userAvatar.addEventListener("click", (e) => {
            e.stopPropagation();
            const visible = userDropdown.style.display === "block";
            closeAll();
            userDropdown.style.display = visible ? "none" : "block";
        });
    }

    document.addEventListener("click", () => closeAll());

    if (profileLogout) {
        profileLogout.addEventListener("click", () => {
            closeAll();
            if (dashboardContainer && loginContainer) {
                dashboardContainer.style.display = "none";
                loginContainer.style.display = "flex";
            }
        });
    }
}

// ============================
// Tables & pagination
// ============================
function renderRecentCases() {
    const tbody = $("#recent-cases-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    recentCases.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.type}</td>
            <td>${c.location}</td>
            <td>${c.date}</td>
            <td>
                <span class="status-pill status-${c.status}">${c.status.replace("-", " ").toUpperCase()}</span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

let currentCrimePage = 1;
const crimesPerPage = 8;

function applyCrimeFilters(data) {
    const status = $("#filter-status")?.value || "all";
    const type = $("#filter-crime-type")?.value || "all";
    const from = $("#filter-date-from")?.value;
    const to = $("#filter-date-to")?.value;

    return data.filter((item) => {
        if (status !== "all" && item.status !== status) return false;
        if (type !== "all" && item.type.toLowerCase() !== type.toLowerCase()) return false;

        if (from || to) {
            const d = new Date(item.datetime.split(" ")[0]);
            if (from && d < new Date(from)) return false;
            if (to && d > new Date(to)) return false;
        }
        return true;
    });
}

function renderCrimesTable() {
    const tbody = $("#crimes-table-body");
    const pageInfo = $("#page-info");
    if (!tbody || !pageInfo) return;

    const filtered = applyCrimeFilters(allCrimes);
    const totalPages = Math.max(1, Math.ceil(filtered.length / crimesPerPage));
    if (currentCrimePage > totalPages) currentCrimePage = totalPages;

    const start = (currentCrimePage - 1) * crimesPerPage;
    const pageData = filtered.slice(start, start + crimesPerPage);

    tbody.innerHTML = "";
    pageData.forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.type}</td>
            <td>${c.description}</td>
            <td>${c.victim}</td>
            <td>${c.location}</td>
            <td>${c.datetime}</td>
            <td><span class="status-pill status-${c.status}">${c.status.replace("-", " ").toUpperCase()}</span></td>
            <td>
                <div class="table-actions">
                    <button class="view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    pageInfo.textContent = `Page ${currentCrimePage} of ${totalPages}`;
}

function setupCrimesInteractions() {
    const prevBtn = $("#prev-page");
    const nextBtn = $("#next-page");
    const applyFiltersBtn = $("#apply-filters");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentCrimePage > 1) {
                currentCrimePage -= 1;
                renderCrimesTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const filtered = applyCrimeFilters(allCrimes);
            const totalPages = Math.max(1, Math.ceil(filtered.length / crimesPerPage));
            if (currentCrimePage < totalPages) {
                currentCrimePage += 1;
                renderCrimesTable();
            }
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            currentCrimePage = 1;
            renderCrimesTable();
        });
    }
}

function renderOfficers() {
    const tbody = $("#officers-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    officers.forEach((o) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.name}</td>
            <td>${o.badge}</td>
            <td>${o.rank}</td>
            <td>${o.dept}</td>
            <td>${o.contact}</td>
            <td>${o.status}</td>
            <td>
                <div class="table-actions">
                    <button class="view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================
// Add Crime form (demo)
// ============================
function setupAddCrimeForm() {
    const form = $("#add-crime-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = $("#crime-type").value || "Other";
        const location = $("#crime-location").value || "Unknown";
        const victim = $("#crime-victim").value || "Not Disclosed";
        const status = $("#crime-status").value || "open";
        const description = ($("#crime-description").value || "").slice(0, 80) || "New crime record";

        const id = `CR${String(allCrimes.length + 50).padStart(3, "0")}`;
        const date = new Date();
        const datetime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

        allCrimes.unshift({
            id,
            type,
            description,
            victim,
            location,
            datetime,
            status,
        });

        alert("Crime record created (demo only, not persisted).");
        form.reset();
        currentCrimePage = 1;
        renderCrimesTable();
        renderRecentCases();
    });
}

// ============================
// Reports controls
// ============================
function setupReports() {
    const generateBtn = $("#generate-report");
    const exportBtn = $("#export-report");

    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            alert("Report generated (demo). Charts refreshed with sample data.");
            initCharts(true);
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            alert("Report exported as PDF (demo).");
        });
    }
}

// ============================
// Settings & theme
// ============================
function setupSettings() {
    const themeSelect = $("#theme-select");
    const applyThemeBtn = $("#apply-theme");
    const backupBtn = $("#backup-now");
    const restoreBtn = $("#restore-data");
    const profileForm = $("#profile-settings-form");

    function applyTheme() {
        if (!themeSelect) return;
        const value = themeSelect.value;
        document.body.classList.remove("theme-light");

        if (value === "light") {
            document.body.classList.add("theme-light");
        } else if (value === "dark" || value === "blue" || value === "system") {
            // keep default dark for these
        }
    }

    if (applyThemeBtn) {
        applyThemeBtn.addEventListener("click", () => {
            applyTheme();
        });
    }

    if (backupBtn) {
        backupBtn.addEventListener("click", () => {
            alert("Backup started (demo).");
        });
    }

    if (restoreBtn) {
        restoreBtn.addEventListener("click", () => {
            const ok = confirm("Restore data from last backup? (demo)");
            if (ok) alert("Data restored (demo).");
        });
    }

    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Profile settings updated (demo).");
        });
    }
}

// ============================
// Charts (Chart.js)
// ============================
let crimeTrendChartInstance = null;
let crimeTypeChartInstance = null;
let crimeDistributionChartInstance = null;
let monthlyCrimeChartInstance = null;
let resolutionRateChartInstance = null;

function safelyCreateChart(ctx, config) {
    if (!ctx || !window.Chart) return null;
    return new window.Chart(ctx, config);
}

function initCharts(forceRefresh) {
    if (!window.Chart) return;

    const destroyIfExists = (chartInstance) => {
        if (chartInstance && typeof chartInstance.destroy === "function") {
            chartInstance.destroy();
        }
    };

    if (forceRefresh) {
        destroyIfExists(crimeTrendChartInstance);
        destroyIfExists(crimeTypeChartInstance);
        destroyIfExists(crimeDistributionChartInstance);
        destroyIfExists(monthlyCrimeChartInstance);
        destroyIfExists(resolutionRateChartInstance);
    }

    const primaryColor = "#60a5fa";
    const accentColor = "#4f46e5";
    const successColor = "#22c55e";
    const dangerColor = "#ef4444";

    // Crime Trends (line)
    if (!crimeTrendChartInstance) {
        const ctxTrend = document.getElementById("crime-trend-chart");
        if (ctxTrend) {
            crimeTrendChartInstance = safelyCreateChart(ctxTrend, {
                type: "line",
                data: {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "New Cases",
                            borderColor: primaryColor,
                            backgroundColor: "rgba(96, 165, 250, 0.12)",
                            data: [14, 16, 12, 19, 23, 17, 13],
                            tension: 0.4,
                            fill: true,
                        },
                        {
                            label: "Closed Cases",
                            borderColor: successColor,
                            backgroundColor: "rgba(34, 197, 94, 0.12)",
                            data: [8, 12, 10, 14, 17, 12, 9],
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                    scales: {
                        x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(31,41,55,0.6)" } },
                        y: { ticks: { color: "#6b7280" }, grid: { color: "rgba(31,41,55,0.5)" } },
                    },
                },
            });
        }
    }

    // Crime Types (doughnut)
    if (!crimeTypeChartInstance) {
        const ctxType = document.getElementById("crime-type-chart");
        if (ctxType) {
            crimeTypeChartInstance = safelyCreateChart(ctxType, {
                type: "doughnut",
                data: {
                    labels: ["Theft", "Assault", "Robbery", "Fraud", "Homicide", "Other"],
                    datasets: [
                        {
                            backgroundColor: [primaryColor, dangerColor, "#f59e0b", "#22c55e", "#6b7280", "#0ea5e9"],
                            data: [30, 20, 15, 13, 7, 15],
                        },
                    ],
                },
                options: {
                    plugins: { legend: { display: false } },
                },
            });
        }
    }

    // Crime Distribution (pie)
    if (!crimeDistributionChartInstance) {
        const ctxDist = document.getElementById("crime-distribution-chart");
        if (ctxDist) {
            crimeDistributionChartInstance = safelyCreateChart(ctxDist, {
                type: "pie",
                data: {
                    labels: ["Downtown", "Suburb", "Industrial", "Old Town"],
                    datasets: [
                        {
                            backgroundColor: [primaryColor, "#f97316", "#22c55e", "#a855f7"],
                            data: [40, 25, 20, 15],
                        },
                    ],
                },
                options: {
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                },
            });
        }
    }

    // Monthly Crime Rate (bar)
    if (!monthlyCrimeChartInstance) {
        const ctxMonthly = document.getElementById("monthly-crime-chart");
        if (ctxMonthly) {
            monthlyCrimeChartInstance = safelyCreateChart(ctxMonthly, {
                type: "bar",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                        {
                            label: "Crimes",
                            backgroundColor: accentColor,
                            data: [120, 140, 130, 150, 160, 145],
                        },
                    ],
                },
                options: {
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                    scales: {
                        x: { ticks: { color: "#6b7280" }, grid: { display: false } },
                        y: { ticks: { color: "#6b7280" }, grid: { color: "rgba(31,41,55,0.5)" } },
                    },
                },
            });
        }
    }

    // Resolution Rate (line)
    if (!resolutionRateChartInstance) {
        const ctxRes = document.getElementById("resolution-rate-chart");
        if (ctxRes) {
            resolutionRateChartInstance = safelyCreateChart(ctxRes, {
                type: "line",
                data: {
                    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
                    datasets: [
                        {
                            label: "Resolution Rate (%)",
                            borderColor: successColor,
                            backgroundColor: "rgba(34, 197, 94, 0.12)",
                            data: [62, 64, 67, 71, 73, 76],
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                },
                options: {
                    plugins: { legend: { labels: { color: "#9ca3af" } } },
                    scales: {
                        x: { ticks: { color: "#6b7280" }, grid: { color: "rgba(31,41,55,0.5)" } },
                        y: {
                            ticks: { color: "#6b7280" },
                            min: 50,
                            max: 100,
                            grid: { color: "rgba(31,41,55,0.5)" },
                        },
                    },
                },
            });
        }
    }
}

// ============================
// Search (simple demo filter)
// ============================
function setupSearch() {
    const searchInput = $("#search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        const rows = $all("#recent-cases-body tr");
        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? "" : "none";
        });
    });
}

// ============================
// Initialize everything
// ============================
document.addEventListener("DOMContentLoaded", () => {
    setupLogin();
    setupTabs();
    setupSidebarToggle();
    setupDropdowns();
    setupCrimesInteractions();
    setupAddCrimeForm();
    setupReports();
    setupSettings();
    setupSearch();

    renderRecentCases();
    renderCrimesTable();
    renderOfficers();
    initCharts(false);
});

document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const crimeData = [
        { id: 'CR001', type: 'Theft', description: 'Shoplifting at Main Street Mall', victim: 'Store Owner', location: '123 Main St', date: '2023-06-15T14:30', status: 'solved', officer: 'John Smith' },
        { id: 'CR002', type: 'Assault', description: 'Physical altercation outside nightclub', victim: 'Michael Davis', location: '456 Club Ave', date: '2023-06-10T23:15', status: 'in-progress', officer: 'Maria Garcia' },
        { id: 'CR003', type: 'Robbery', description: 'Armed robbery at convenience store', victim: 'Store Clerk', location: '789 Oak Rd', date: '2023-06-05T22:45', status: 'open', officer: 'David Chen' },
        { id: 'CR004', type: 'Fraud', description: 'Credit card fraud reported by victim', victim: 'Janet Wilson', location: 'Online', date: '2023-06-01T09:20', status: 'open', officer: 'Sarah Johnson' },
        { id: 'CR005', type: 'Homicide', description: 'Body found in park', victim: 'Unknown', location: 'Central Park', date: '2023-05-28T07:00', status: 'in-progress', officer: 'John Smith' },
        { id: 'CR006', type: 'Vandalism', description: 'Graffiti on public building', victim: 'City', location: '321 Government St', date: '2023-05-25T15:40', status: 'closed', officer: 'Maria Garcia' },
        { id: 'CR007', type: 'Theft', description: 'Vehicle theft from parking lot', victim: 'Robert Brown', location: 'Downtown Parking Garage', date: '2023-05-22T18:30', status: 'solved', officer: 'David Chen' },
        { id: 'CR008', type: 'Cybercrime', description: 'Hacking of business server', victim: 'Local Business', location: 'Online', date: '2023-05-20T11:15', status: 'in-progress', officer: 'Sarah Johnson' },
        { id: 'CR009', type: 'Drug', description: 'Possession of illegal substances', victim: 'State', location: '654 Park Ave', date: '2023-05-18T20:10', status: 'closed', officer: 'John Smith' },
        { id: 'CR010', type: 'Assault', description: 'Domestic violence report', victim: 'Jane Doe', location: '987 Elm St', date: '2023-05-15T21:05', status: 'solved', officer: 'Maria Garcia' }
    ];

    const officerData = [
        { id: 1, name: 'John Smith', badge: 'B1234', rank: 'Detective', department: 'Homicide', contact: '555-0123', status: 'Active' },
        { id: 2, name: 'Maria Garcia', badge: 'B2345', rank: 'Sergeant', department: 'Patrol', contact: '555-0124', status: 'Active' },
        { id: 3, name: 'David Chen', badge: 'B3456', rank: 'Officer', department: 'Traffic', contact: '555-0125', status: 'On Leave' },
        { id: 4, name: 'Sarah Johnson', badge: 'B4567', rank: 'Detective', department: 'Cybercrime', contact: '555-0126', status: 'Active' }
    ];

    // Authentication handling
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameGroup = document.getElementById('username-group');
    const passwordGroup = document.getElementById('password-group');
    const rememberMeCheckbox = document.getElementById('remember-me');

    // Check if user credentials are saved in local storage
    if (rememberMeCheckbox && localStorage.getItem('rememberedUser')) {
        try {
            const savedUser = JSON.parse(localStorage.getItem('rememberedUser'));
            usernameInput.value = savedUser.username || '';
            passwordInput.value = savedUser.password || '';
            rememberMeCheckbox.checked = true;
        } catch (e) {
            console.error('Error loading saved credentials', e);
        }
    }

    if (loginBtn) {
        console.log('Setting up login button event listener');
        
        // First, try to fix any issues with direct setup
        loginBtn.onclick = function() {
            console.log('Login button clicked');
            handleLogin();
        };
        
        // Also add the standard event listener as a backup
        loginBtn.addEventListener('click', handleLogin);
        
        // Centralized login handling function
        function handleLogin() {
            console.log('Login handler executing');
            
            // Reset previous error states
            usernameGroup.classList.remove('error');
            passwordGroup.classList.remove('error');
            
            // Get input values
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            let isValid = true;
            
            console.log('Validating login: ', username ? 'Username entered' : 'No username', 
                         password ? 'Password entered' : 'No password');
            
            // Validate username
            if (!username) {
                usernameGroup.classList.add('error');
                isValid = false;
            }
            
            // Validate password
            if (!password) {
                passwordGroup.classList.add('error');
                isValid = false;
            }
            
            if (!isValid) {
                console.log('Validation failed');
                return; // Stop if validation fails
            }
            
            // Add loading state to button
            loginBtn.classList.add('loading');
            loginBtn.textContent = 'Logging in...';
            
            console.log('Attempting login...');
            
            // Simulate loading delay (would be a real API call in production)
            setTimeout(() => {
                // Simple authentication (in a real system, this would be server-side)
                if ((username === 'admin' && password === 'admin123') || localStorage.getItem('authenticated')) {
                    console.log('Login successful');
                    
                    // Save authentication state
                    localStorage.setItem('authenticated', 'true');
                    
                    // Handle "Remember me" functionality
                    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberedUser', JSON.stringify({
                            username: username,
                            password: password
                        }));
                    } else {
                        localStorage.removeItem('rememberedUser');
                    }
                    
                    // Show dashboard
                    loginContainer.style.display = 'none';
                    dashboardContainer.style.display = 'flex';
                    loadDashboardData();
                    
                    // Dispatch a custom event to notify that login was successful
                    document.dispatchEvent(new CustomEvent('login-success'));
                } else {
                    console.log('Login failed');
                    // Show general error on login failure
                    passwordGroup.classList.add('error');
                    const errorMsg = passwordGroup.querySelector('.error-message');
                    errorMsg.textContent = 'Invalid username or password';
                }
                
                // Remove loading state
                loginBtn.classList.remove('loading');
                loginBtn.textContent = 'Login';
            }, 1000);
        }
        
        // Add key press event for login form
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loginBtn.click();
                }
            });
            
            // Remove error state when user starts typing
            input.addEventListener('input', function() {
                const parentGroup = this.closest('.input-group');
                if (parentGroup) {
                    parentGroup.classList.remove('error');
                }
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Only clear authentication, keep remembered user if checked
            localStorage.removeItem('authenticated');
            dashboardContainer.style.display = 'none';
            loginContainer.style.display = 'flex';
            
            // Clear password but keep username if remember me was checked
            if (passwordInput) {
                passwordInput.value = '';
            }
        });
    }

    // Check if user is already authenticated
    if (localStorage.getItem('authenticated')) {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        loadDashboardData();
        setupSidebar();
    } else {
        // Setup sidebar when user logs in
        document.addEventListener('login-success', setupSidebar);
    }

    // Sidebar toggle and navigation
    function setupSidebar() {
        const toggleSidebarBtn = document.getElementById('toggle-sidebar');
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        
        // Create overlay for mobile view
        const sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
        
        // Function to check if we're on mobile
        const isMobile = () => window.innerWidth < 992;
        
        // Add tooltips to menu items
        const menuItems = document.querySelectorAll('.menu li');
        menuItems.forEach(item => {
            const text = item.textContent.trim();
            item.setAttribute('data-title', text);
            
            // Add animation delay for staggered appearance
            const index = Array.from(menuItems).indexOf(item);
            item.style.transitionDelay = `${index * 0.05}s`;
        });
        
        // Function to toggle sidebar
        const toggleSidebar = () => {
            sidebar.classList.toggle('collapsed');
            
            // Create a nice animation effect for the menu items
            menuItems.forEach((item, index) => {
                // Reset the transition delay
                setTimeout(() => {
                    item.style.transitionDelay = '0s';
                }, 500);
            });
            
            // On mobile, toggle the overlay
            if (isMobile()) {
                sidebarOverlay.classList.toggle('active', sidebar.classList.contains('collapsed'));
                document.body.style.overflow = sidebar.classList.contains('collapsed') ? 'hidden' : '';
            }
            
            // Store the sidebar state in localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed') ? 'true' : 'false');
        };
        
        // Toggle sidebar when button is clicked
        if (toggleSidebarBtn) {
            toggleSidebarBtn.addEventListener('click', toggleSidebar);
        }
        
        // Restore sidebar state from localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState && !isMobile()) {
            if ((savedState === 'true' && !sidebar.classList.contains('collapsed')) || 
                (savedState === 'false' && sidebar.classList.contains('collapsed'))) {
                sidebar.classList.toggle('collapsed');
            }
        }
        
        // Close sidebar when overlay is clicked
        sidebarOverlay.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                toggleSidebar();
            }
        });
        
        // Close sidebar when escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('collapsed') && isMobile()) {
                toggleSidebar();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (!isMobile() && sidebar.classList.contains('collapsed') && sidebarOverlay.classList.contains('active')) {
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Apply transition delay for animation
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.05}s`;
                
                // Reset the transition delay after animation completes
                setTimeout(() => {
                    item.style.transitionDelay = '0s';
                }, 500);
            });
        });
        
        // Tab navigation
        const tabMenuItems = document.querySelectorAll('.menu li[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Restore active tab from localStorage
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            tabMenuItems.forEach(item => {
                if (item.getAttribute('data-tab') === savedTab) {
                    // Update active menu item
                    tabMenuItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Show selected tab
                    tabContents.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.id === `${savedTab}-tab`) {
                            tab.classList.add('active');
                        }
                    });
                }
            });
        }
        
        tabMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const tabId = this.getAttribute('data-tab');
                
                // Update active menu item
                tabMenuItems.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // Save active tab to localStorage
                localStorage.setItem('activeTab', tabId);
                
                // Show selected tab with smooth animation
                tabContents.forEach(tab => {
                    if (tab.classList.contains('active')) {
                        // Fade out current tab
                        tab.style.opacity = '0';
                        
                        setTimeout(() => {
                            tab.classList.remove('active');
                            
                            // Show and fade in new tab
                            const newTab = document.getElementById(`${tabId}-tab`);
                            if (newTab) {
                                newTab.classList.add('active');
                                newTab.style.opacity = '0';
                                
                                // Force reflow
                                void newTab.offsetWidth;
                                
                                newTab.style.opacity = '1';
                            }
                        }, 200);
                    } else if (tab.id === `${tabId}-tab`) {
                        setTimeout(() => {
                            tab.classList.add('active');
                            tab.style.opacity = '0';
                            
                            // Force reflow
                            void tab.offsetWidth;
                            
                            tab.style.opacity = '1';
                        }, 200);
                    }
                });
                
                // On mobile, auto-close the sidebar after navigation
                if (isMobile() && sidebar.classList.contains('collapsed')) {
                    toggleSidebar();
                }
            });
        });

        // Set up top bar interactions
        setupTopBar();
    }

    // Set up top bar interactions
    function setupTopBar() {
        const notificationBell = document.getElementById('notification-bell');
        const userAvatar = document.querySelector('.avatar');
        const notificationDropdown = document.getElementById('notification-dropdown');
        const userDropdown = document.getElementById('user-dropdown');
        const profileLogout = document.getElementById('profile-logout');
        let activeDropdown = null;
        
        // Create backdrop for mobile dropdowns
        const dropdownBackdrop = document.createElement('div');
        dropdownBackdrop.className = 'dropdown-backdrop';
        document.body.appendChild(dropdownBackdrop);
        
        // Function to open dropdown
        function openDropdown(dropdown, trigger) {
            // Close any open dropdown first
            if (activeDropdown) {
                activeDropdown.classList.remove('active');
                document.querySelector('.user-info-item.active')?.classList.remove('active');
            }
            
            // Open the requested dropdown
            dropdown.classList.add('active');
            trigger.closest('.user-info-item').classList.add('active');
            
            // Add data-page attribute if needed
            if (dropdown === notificationDropdown) {
                dropdown.setAttribute('data-page', 'notifications');
            } else if (dropdown === userDropdown) {
                dropdown.setAttribute('data-page', 'profile');
            }
            
            activeDropdown = dropdown;
            dropdownBackdrop.classList.add('active');
        }
        
        // Function to close all dropdowns
        function closeAllDropdowns() {
            if (activeDropdown) {
                activeDropdown.classList.remove('active');
                document.querySelector('.user-info-item.active')?.classList.remove('active');
                activeDropdown = null;
                dropdownBackdrop.classList.remove('active');
            }
        }
        
        // Toggle notification dropdown
        if (notificationBell && notificationDropdown) {
            notificationBell.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (notificationDropdown.classList.contains('active')) {
                    closeAllDropdowns();
                } else {
                    openDropdown(notificationDropdown, notificationBell);
                    
                    // Mark notifications as read when opened
                    if (notificationDropdown.classList.contains('active')) {
                        const unreadNotifications = notificationDropdown.querySelectorAll('.notification-item.unread');
                        setTimeout(() => {
                            unreadNotifications.forEach(notification => {
                                notification.classList.remove('unread');
                            });
                        }, 2000); // Add a slight delay before marking as read
                    }
                }
            });
            
            // Make notification bell keyboard accessible
            notificationBell.setAttribute('tabindex', '0');
            notificationBell.setAttribute('role', 'button');
            notificationBell.setAttribute('aria-label', 'Notifications');
            notificationBell.setAttribute('aria-haspopup', 'true');
            notificationBell.setAttribute('aria-expanded', 'false');
            
            notificationBell.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                    if (notificationDropdown.classList.contains('active')) {
                        notificationBell.setAttribute('aria-expanded', 'true');
                    } else {
                        notificationBell.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
        
        // Toggle user dropdown
        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (userDropdown.classList.contains('active')) {
                    closeAllDropdowns();
                } else {
                    openDropdown(userDropdown, userAvatar);
                }
            });
            
            // Make avatar keyboard accessible
            userAvatar.setAttribute('tabindex', '0');
            userAvatar.setAttribute('role', 'button');
            userAvatar.setAttribute('aria-label', 'User menu');
            userAvatar.setAttribute('aria-haspopup', 'true');
            userAvatar.setAttribute('aria-expanded', 'false');
            
            userAvatar.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                    if (userDropdown.classList.contains('active')) {
                        userAvatar.setAttribute('aria-expanded', 'true');
                    } else {
                        userAvatar.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
        
        // Handle logout from the profile dropdown
        if (profileLogout) {
            profileLogout.addEventListener('click', function(e) {
                e.stopPropagation();
                // This should do the same as the sidebar logout button
                localStorage.removeItem('authenticated');
                dashboardContainer.style.display = 'none';
                loginContainer.style.display = 'flex';
                
                // Clear password but keep username if remember me was checked
                if (passwordInput) {
                    passwordInput.value = '';
                }
            });
        }
        
        // Make all dropdown items keyboard focusable and accessible
        const dropdownItems = document.querySelectorAll('.dropdown-item, .dropdown-footer a');
        dropdownItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'menuitem');
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Close dropdowns when clicking on backdrop
        dropdownBackdrop.addEventListener('click', closeAllDropdowns);
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            // Skip if clicking inside a dropdown or on a dropdown trigger
            const isDropdownContent = e.target.closest('.dropdown-menu');
            const isDropdownTrigger = e.target.closest('#notification-bell') || e.target.closest('.avatar');
            
            if (!isDropdownContent && !isDropdownTrigger) {
                closeAllDropdowns();
            }
        });
        
        // Add escape key handler for dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && activeDropdown) {
                closeAllDropdowns();
                
                // Return focus to the trigger element
                if (activeDropdown === notificationDropdown) {
                    notificationBell.focus();
                } else if (activeDropdown === userDropdown) {
                    userAvatar.focus();
                }
            }
        });
        
        // Setup multi-page support for dropdowns
        const viewAllLinks = document.querySelectorAll('.dropdown-footer a');
        viewAllLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the current dropdown
                const dropdown = this.closest('.dropdown-menu');
                const currentPage = dropdown.querySelector('.dropdown-page.active') || dropdown.querySelector('.dropdown-body');
                const targetPage = this.getAttribute('data-target');
                
                if (targetPage) {
                    // Hide current content
                    currentPage.classList.remove('active');
                    currentPage.classList.add('dropdown-page-exit-active');
                    
                    // Show target page
                    const newPage = dropdown.querySelector(`.${targetPage}`);
                    if (newPage) {
                        newPage.classList.add('active', 'dropdown-page-enter');
                        
                        // Force reflow
                        void newPage.offsetWidth;
                        
                        newPage.classList.add('dropdown-page-enter-active');
                        newPage.classList.remove('dropdown-page-enter');
                        
                        // Remove animation classes after animation completes
                        setTimeout(() => {
                            currentPage.classList.remove('dropdown-page-exit-active');
                            newPage.classList.remove('dropdown-page-enter-active');
                        }, 300);
                    }
                }
            });
        });
        
        // Add back button functionality
        const backButtons = document.querySelectorAll('.dropdown-header .back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the current dropdown
                const dropdown = this.closest('.dropdown-menu');
                const currentPage = dropdown.querySelector('.dropdown-page.active');
                
                if (currentPage) {
                    // Hide current page
                    currentPage.classList.remove('active');
                    currentPage.classList.add('dropdown-page-exit-active');
                    
                    // Show main content
                    const mainContent = dropdown.querySelector('.dropdown-body');
                    mainContent.classList.add('active', 'dropdown-page-enter');
                    
                    // Force reflow
                    void mainContent.offsetWidth;
                    
                    mainContent.classList.add('dropdown-page-enter-active');
                    mainContent.classList.remove('dropdown-page-enter');
                    
                    // Remove animation classes after animation completes
                    setTimeout(() => {
                        currentPage.classList.remove('dropdown-page-exit-active');
                        mainContent.classList.remove('dropdown-page-enter-active');
                    }, 300);
                }
            });
        });
        
        // Add animation effects to the top bar on scroll
        const content = document.querySelector('.content');
        if (content) {
            content.addEventListener('scroll', function() {
                const topBar = document.querySelector('.top-bar');
                if (topBar) {
                    if (content.scrollTop > 10) {
                        topBar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    } else {
                        topBar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
                    }
                }
            });
        }
        
        // Add swipe to close functionality for mobile dropdowns
        let touchStartY = 0;
        let touchEndY = 0;
        const MIN_SWIPE_DISTANCE = 50;
        
        document.addEventListener('touchstart', function(e) {
            if (activeDropdown) {
                const touch = e.touches[0];
                touchStartY = touch.clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (activeDropdown) {
                const touch = e.touches[0];
                touchEndY = touch.clientY;
                
                // Calculate distance
                const distance = touchEndY - touchStartY;
                
                // Only for swipe down (positive distance)
                if (distance > 0) {
                    activeDropdown.style.transform = `translateY(${distance}px)`;
                    dropdownBackdrop.style.opacity = 1 - (distance / 300);
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (activeDropdown) {
                const distance = touchEndY - touchStartY;
                
                // Reset styles
                activeDropdown.style.transform = '';
                dropdownBackdrop.style.opacity = '';
                
                // Close if swiped down enough
                if (distance > MIN_SWIPE_DISTANCE) {
                    closeAllDropdowns();
                }
                
                // Reset touch points
                touchStartY = 0;
                touchEndY = 0;
            }
        }, { passive: true });
    }

    // Load dashboard data
    function loadDashboardData() {
        loadRecentCases();
        loadOfficersTable();
        loadCrimesTable();
        initializeCharts();
        setupAddOfficerForm();
    }

    // Load recent cases in dashboard
    function loadRecentCases() {
        const recentCasesBody = document.getElementById('recent-cases-body');
        if (!recentCasesBody) return;
        
        // Get the 5 most recent cases
        const recentCases = [...crimeData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        recentCasesBody.innerHTML = '';
        
        recentCases.forEach(crime => {
            const row = document.createElement('tr');
            
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            };
            
            row.innerHTML = `
                <td>${crime.id}</td>
                <td>${crime.type}</td>
                <td>${crime.location}</td>
                <td>${formatDate(crime.date)}</td>
                <td><span class="status ${crime.status}">${crime.status.charAt(0).toUpperCase() + crime.status.slice(1)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            `;
            
            recentCasesBody.appendChild(row);
        });
    }

    // Load officers table
    function loadOfficersTable() {
        const officersTableBody = document.getElementById('officers-table-body');
        if (!officersTableBody) return;
        
        officersTableBody.innerHTML = '';
        
        officerData.forEach(officer => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${officer.id}</td>
                <td>${officer.name}</td>
                <td>${officer.badge}</td>
                <td>${officer.rank}</td>
                <td>${officer.department}</td>
                <td>${officer.contact}</td>
                <td><span class="status ${officer.status === 'Active' ? 'solved' : 'in-progress'}">${officer.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            officersTableBody.appendChild(row);
        });
    }

    // Load crimes table
    function loadCrimesTable() {
        const crimesTableBody = document.getElementById('crimes-table-body');
        if (!crimesTableBody) return;
        
        crimesTableBody.innerHTML = '';
        
        crimeData.forEach(crime => {
            const row = document.createElement('tr');
            
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                return new Date(dateString).toLocaleString(undefined, options);
            };
            
            row.innerHTML = `
                <td>${crime.id}</td>
                <td>${crime.type}</td>
                <td>${crime.description}</td>
                <td>${crime.victim}</td>
                <td>${crime.location}</td>
                <td>${formatDate(crime.date)}</td>
                <td><span class="status ${crime.status}">${crime.status.charAt(0).toUpperCase() + crime.status.slice(1)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            crimesTableBody.appendChild(row);
        });
    }

    // Initialize charts
    function initializeCharts() {
        // Create loading states for charts
        const chartElements = document.querySelectorAll('.chart-container-inner canvas');
        chartElements.forEach(chartElement => {
            const container = chartElement.closest('.chart-container-inner');
            
            // Create and append loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'chart-loading';
            loadingElement.innerHTML = `
                <div class="spinner"></div>
                <p>Loading data...</p>
            `;
            container.appendChild(loadingElement);
            
            // Remove loading after a short delay (simulating data loading)
            setTimeout(() => {
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
            }, 1000);
        });
        
        // Set up chart action buttons
        const chartActionButtons = document.querySelectorAll('.chart-actions button');
        chartActionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('title');
                const chartCard = this.closest('.chart-card');
                const chartId = chartCard.querySelector('canvas')?.id || 'map';
                
                console.log(`${action} for chart: ${chartId}`);
                
                if (action.includes('Download')) {
                    simulateChartDownload(chartId);
                } else if (action.includes('Refresh')) {
                    refreshChart(chartCard, chartId);
                } else if (action.includes('Fullscreen')) {
                    toggleFullscreen(chartCard);
                }
            });
        });

        // Crime Trend Chart
        const trendChart = document.getElementById('crime-trend-chart');
        if (trendChart) {
            new Chart(trendChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Reported Crimes',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: '#1a73e8',
                        tension: 0.3,
                        fill: {
                            target: 'origin',
                            above: 'rgba(26, 115, 232, 0.1)'
                        },
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#1a73e8',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            cornerRadius: 6,
                            caretSize: 6
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    }
                }
            });
        }

        // Crime Type Chart
        const typeChart = document.getElementById('crime-type-chart');
        if (typeChart) {
            new Chart(typeChart, {
                type: 'doughnut',
                data: {
                    labels: ['Theft', 'Assault', 'Robbery', 'Fraud', 'Homicide', 'Other'],
                    datasets: [{
                        data: [30, 20, 15, 13, 7, 15],
                        backgroundColor: [
                            '#1a73e8',
                            '#dc3545',
                            '#ffc107',
                            '#28a745',
                            '#6c757d',
                            '#17a2b8'
                        ],
                        borderWidth: 1,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            cornerRadius: 6,
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}%`;
                                }
                            }
                        }
                    },
                    cutout: '65%',
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        }

        // Crime Distribution Chart
        const distributionChart = document.getElementById('crime-distribution-chart');
        if (distributionChart) {
            new Chart(distributionChart, {
                type: 'pie',
                data: {
                    labels: ['Theft', 'Assault', 'Robbery', 'Fraud', 'Homicide', 'Vandalism', 'Cybercrime', 'Drug'],
                    datasets: [{
                        data: [25, 15, 12, 10, 8, 15, 8, 7],
                        backgroundColor: [
                            '#1a73e8',
                            '#dc3545',
                            '#ffc107',
                            '#28a745',
                            '#6c757d',
                            '#17a2b8',
                            '#fd7e14',
                            '#20c997'
                        ],
                        borderWidth: 1,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            cornerRadius: 6
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        }

        // Monthly Crime Chart
        const monthlyChart = document.getElementById('monthly-crime-chart');
        if (monthlyChart) {
            new Chart(monthlyChart, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Reported Crimes',
                        data: [65, 59, 80, 81, 56, 55],
                        backgroundColor: 'rgba(26, 115, 232, 0.7)',
                        borderColor: '#1a73e8',
                        borderWidth: 1,
                        borderRadius: 4,
                        hoverBackgroundColor: '#1a73e8'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            cornerRadius: 6
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Resolution Rate Chart
        const resolutionChart = document.getElementById('resolution-rate-chart');
        if (resolutionChart) {
            new Chart(resolutionChart, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Reported',
                            data: [65, 59, 80, 81, 56, 55],
                            backgroundColor: 'rgba(26, 115, 232, 0.7)',
                            borderColor: '#1a73e8',
                            borderWidth: 1,
                            borderRadius: {
                                topLeft: 4,
                                topRight: 4,
                                bottomLeft: 0,
                                bottomRight: 0
                            }
                        },
                        {
                            label: 'Solved',
                            data: [40, 42, 60, 62, 40, 30],
                            backgroundColor: 'rgba(40, 167, 69, 0.7)',
                            borderColor: '#28a745',
                            borderWidth: 1,
                            borderRadius: {
                                topLeft: 4,
                                topRight: 4,
                                bottomLeft: 0,
                                bottomRight: 0
                            }
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 10,
                            cornerRadius: 6
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Function to simulate chart download
    function simulateChartDownload(chartId) {
        // In a real app, this would use canvas.toDataURL or a server-side export
        alert(`Downloading ${chartId} chart...`);
    }
    
    // Function to refresh chart
    function refreshChart(chartCard, chartId) {
        // Create and show loading indicator
        const container = chartCard.querySelector('.chart-container-inner');
        const loadingElement = document.createElement('div');
        loadingElement.className = 'chart-loading';
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <p>Refreshing data...</p>
        `;
        container.appendChild(loadingElement);
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
            alert(`${chartId} chart data refreshed!`);
        }, 1500);
    }
    
    // Function to toggle fullscreen for a chart
    function toggleFullscreen(element) {
        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    }

    // Add Crime Form Handling
    const addCrimeForm = document.getElementById('add-crime-form');
    if (addCrimeForm) {
        addCrimeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newCrime = {
                id: `CR${String(crimeData.length + 1).padStart(3, '0')}`,
                type: document.getElementById('crime-type').value,
                description: document.getElementById('crime-description').value,
                victim: document.getElementById('crime-victim').value,
                location: document.getElementById('crime-location').value,
                date: document.getElementById('crime-date').value,
                status: document.getElementById('crime-status').value,
                officer: document.getElementById('crime-officer').options[document.getElementById('crime-officer').selectedIndex].text
            };
            
            crimeData.unshift(newCrime);
            
            // Refresh tables
            loadRecentCases();
            loadCrimesTable();
            
            // Show success message
            alert('Crime record added successfully!');
            
            // Reset form
            addCrimeForm.reset();
        });
    }

    // Filter handling
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // In a real application, this would filter the data
            alert('Filters applied!');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.querySelector('.search-container i');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === '') {
            alert('Please enter a search term');
            return;
        }
        
        // Visual feedback - add searching class
        document.querySelector('.search-container').classList.add('searching');
        
        // Simulate search delay with setTimeout
        setTimeout(() => {
            // Search in crime records
            const results = crimeData.filter(crime => 
                crime.id.toLowerCase().includes(searchTerm) ||
                crime.type.toLowerCase().includes(searchTerm) ||
                crime.description.toLowerCase().includes(searchTerm) ||
                crime.victim.toLowerCase().includes(searchTerm) ||
                crime.location.toLowerCase().includes(searchTerm)
            );
            
            // Remove searching class
            document.querySelector('.search-container').classList.remove('searching');
            
            if (results.length > 0) {
                // Navigate to crime records tab and show results
                const crimesTab = document.querySelector('.menu li[data-tab="crimes"]');
                crimesTab.click();
                
                // Highlight search results in the table
                const crimesTableBody = document.getElementById('crimes-table-body');
                crimesTableBody.innerHTML = '';
                
                results.forEach(crime => {
                    const row = document.createElement('tr');
                    row.classList.add('search-result');
                    
                    const formatDate = (dateString) => {
                        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                        return new Date(dateString).toLocaleString(undefined, options);
                    };
                    
                    row.innerHTML = `
                        <td>${crime.id}</td>
                        <td>${crime.type}</td>
                        <td>${crime.description}</td>
                        <td>${crime.victim}</td>
                        <td>${crime.location}</td>
                        <td>${formatDate(crime.date)}</td>
                        <td><span class="status ${crime.status}">${crime.status.charAt(0).toUpperCase() + crime.status.slice(1)}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn view"><i class="fas fa-eye"></i></button>
                                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    `;
                    
                    crimesTableBody.appendChild(row);
                });
                
                // Show search results message
                alert(`Found ${results.length} matching records for "${searchTerm}"`);
            } else {
                alert(`No records found matching "${searchTerm}"`);
            }
        }, 500); // Short delay for better UX
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            performSearch();
        });
        // Make it clear it's clickable
        searchIcon.style.cursor = 'pointer';
    }

    // Theme switching
    const themeSelect = document.getElementById('theme-select');
    const applyThemeBtn = document.getElementById('apply-theme');
    
    if (themeSelect && applyThemeBtn) {
        applyThemeBtn.addEventListener('click', function() {
            const selectedTheme = themeSelect.value;
            document.body.className = ''; // Reset
            document.body.classList.add(`theme-${selectedTheme}`);
            alert(`Theme changed to ${selectedTheme}!`);
        });
    }

    // Add new officer
    const addOfficerBtn = document.getElementById('add-officer-btn');
    if (addOfficerBtn) {
        addOfficerBtn.addEventListener('click', function() {
            openAddOfficerModal();
        });
    }

    // Generate report
    const generateReportBtn = document.getElementById('generate-report');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            const reportType = document.getElementById('report-type').value;
            const timeframe = document.getElementById('report-timeframe').value;
            alert(`Generating ${reportType} report for ${timeframe} timeframe`);
        });
    }

    // Export report
    const exportReportBtn = document.getElementById('export-report');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            alert('Report would be exported here');
        });
    }

    // Backup now
    const backupNowBtn = document.getElementById('backup-now');
    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', function() {
            alert('System backup initiated');
        });
    }

    // Restore data
    const restoreDataBtn = document.getElementById('restore-data');
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', function() {
            alert('Data restoration would start here');
        });
    }

    // Handle action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.view')) {
            alert('View details functionality would open here');
        } else if (e.target.closest('.action-btn.edit')) {
            alert('Edit functionality would open here');
        } else if (e.target.closest('.action-btn.delete')) {
            if (confirm('Are you sure you want to delete this record?')) {
                alert('Record deleted successfully');
            }
        }
    });

    // Profile form
    const profileForm = document.getElementById('profile-settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profile updated successfully!');
        });
    }
    
    // Ensure login button works on page load
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && loginContainer.style.display !== 'none') {
            if (loginBtn) loginBtn.click();
        }
    });
    
    // Debug login functionality
    console.log('Login button found:', !!loginBtn);
    console.log('Login container found:', !!loginContainer);
    console.log('Dashboard container found:', !!dashboardContainer);

    // Add Officer Form Handling
    function setupAddOfficerForm() {
        const addOfficerBtn = document.getElementById('add-officer-btn');
        const addOfficerModal = document.getElementById('add-officer-modal');
        const officersManagementSection = document.getElementById('officers-management');
        
        // Initialize the officers management section if it doesn't exist
        if (!officersManagementSection && document.querySelector('.content')) {
            createOfficersManagementSection();
        }
        
        function createOfficersManagementSection() {
            const section = document.createElement('div');
            section.id = 'officers-management';
            section.className = 'officers-management-section';
            
            section.innerHTML = `
                <div class="section-header">
                    <h2>Officers Management</h2>
                    <div class="header-actions">
                        <div class="search-filter">
                            <input type="text" id="officer-search" placeholder="Search officers...">
                            <select id="department-filter">
                                <option value="">All Departments</option>
                                <option value="Patrol">Patrol</option>
                                <option value="Homicide">Homicide</option>
                                <option value="Traffic">Traffic</option>
                                <option value="Cybercrime">Cybercrime</option>
                                <option value="Narcotics">Narcotics</option>
                            </select>
                            <select id="status-filter">
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                        <button id="add-officer-btn" class="btn primary">
                            <i class="fas fa-plus"></i> Add New Officer
                        </button>
                    </div>
                </div>
                <div class="officers-grid">
                    ${generateOfficerCards()}
                </div>
                <div class="pagination">
                    <button class="prev-page" disabled><i class="fas fa-chevron-left"></i></button>
                    <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
                    <button class="next-page"><i class="fas fa-chevron-right"></i></button>
                </div>
            `;
            
            document.querySelector('.content').appendChild(section);
            setupOfficersManagementHandlers();
        }
        
        function generateOfficerCards() {
            return officerData.map(officer => `
                <div class="officer-card" data-id="${officer.id}">
                    <div class="officer-header">
                        <div class="officer-avatar">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(officer.name)}&background=random" alt="${officer.name}">
                            <span class="status-indicator ${officer.status.toLowerCase().replace(' ', '-')}"></span>
                        </div>
                        <div class="officer-info">
                            <h3>${officer.name}</h3>
                            <span class="badge">${officer.badge}</span>
                        </div>
                        <div class="officer-actions">
                            <button class="action-btn edit" title="Edit Officer">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" title="Delete Officer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="officer-details">
                        <div class="detail-item">
                            <i class="fas fa-star"></i>
                            <span>${officer.rank}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-building"></i>
                            <span>${officer.department}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${officer.contact}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-circle"></i>
                            <span>${officer.status}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        function setupOfficersManagementHandlers() {
            const searchInput = document.getElementById('officer-search');
            const departmentFilter = document.getElementById('department-filter');
            const statusFilter = document.getElementById('status-filter');
            const officersGrid = document.querySelector('.officers-grid');
            
            // Search and filter functionality
            function filterOfficers() {
                const searchTerm = searchInput.value.toLowerCase();
                const departmentValue = departmentFilter.value;
                const statusValue = statusFilter.value;
                
                const filteredOfficers = officerData.filter(officer => {
                    const matchesSearch = officer.name.toLowerCase().includes(searchTerm) ||
                                        officer.badge.toLowerCase().includes(searchTerm);
                    const matchesDepartment = !departmentValue || officer.department === departmentValue;
                    const matchesStatus = !statusValue || officer.status === statusValue;
                    
                    return matchesSearch && matchesDepartment && matchesStatus;
                });
                
                officersGrid.innerHTML = filteredOfficers.length ? 
                    generateOfficerCards(filteredOfficers) : 
                    '<div class="no-results">No officers found matching your criteria</div>';
            }
            
            // Add event listeners for search and filters
            searchInput.addEventListener('input', filterOfficers);
            departmentFilter.addEventListener('change', filterOfficers);
            statusFilter.addEventListener('change', filterOfficers);
            
            // Handle officer card actions
            officersGrid.addEventListener('click', function(e) {
                const actionBtn = e.target.closest('.action-btn');
                if (!actionBtn) return;
                
                const officerCard = actionBtn.closest('.officer-card');
                const officerId = parseInt(officerCard.dataset.id);
                const officer = officerData.find(o => o.id === officerId);
                
                if (actionBtn.classList.contains('edit')) {
                    openEditOfficerModal(officer);
                } else if (actionBtn.classList.contains('delete')) {
                    if (confirm(`Are you sure you want to delete officer ${officer.name}?`)) {
                        deleteOfficer(officerId);
                    }
                }
            });
        }
        
        function openEditOfficerModal(officer) {
            const modal = document.getElementById('add-officer-modal') || createAddOfficerModal();
            
            // Update modal title
            modal.querySelector('.modal-header h2').textContent = 'Edit Officer';
            
            // Fill form with officer data
            const form = modal.querySelector('#add-officer-form');
            form.querySelector('#officer-name').value = officer.name;
            form.querySelector('#officer-badge').value = officer.badge;
            form.querySelector('#officer-rank').value = officer.rank;
            form.querySelector('#officer-department').value = officer.department;
            form.querySelector('#officer-contact').value = officer.contact;
            form.querySelector('#officer-status').value = officer.status;
            
            // Update submit button text
            form.querySelector('button[type="submit"]').textContent = 'Update Officer';
            
            // Store officer ID in form
            form.dataset.officerId = officer.id;
            
            // Show modal
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
        
        function deleteOfficer(officerId) {
            const index = officerData.findIndex(o => o.id === officerId);
            if (index !== -1) {
                officerData.splice(index, 1);
                document.querySelector(`.officer-card[data-id="${officerId}"]`).remove();
                showNotification('Officer deleted successfully', 'success');
                loadOfficersTable(); // Refresh the officers table
            }
        }
        
        // Enhance the existing handleAddOfficer function
        function handleAddOfficer(e) {
            e.preventDefault();
            const form = e.target;
            const isEdit = form.dataset.officerId;
            
            const officerData = {
                name: document.getElementById('officer-name').value,
                badge: document.getElementById('officer-badge').value,
                rank: document.getElementById('officer-rank').value,
                department: document.getElementById('officer-department').value,
                contact: document.getElementById('officer-contact').value,
                status: document.getElementById('officer-status').value
            };
            
            // Validate badge number uniqueness
            const existingOfficer = officerData.find(o => 
                o.badge === officerData.badge && (!isEdit || o.id !== parseInt(isEdit))
            );
            
            if (existingOfficer) {
                showNotification('Badge number already exists', 'error');
                return;
            }
            
            if (isEdit) {
                // Update existing officer
                const officerId = parseInt(form.dataset.officerId);
                const index = officerData.findIndex(o => o.id === officerId);
                if (index !== -1) {
                    officerData[index] = { ...officerData[index], ...officerData };
                    showNotification('Officer updated successfully', 'success');
                }
            } else {
                // Add new officer
                const newOfficer = {
                    id: officerData.length + 1,
                    ...officerData
                };
                officerData.push(newOfficer);
                showNotification('Officer added successfully', 'success');
            }
            
            // Refresh displays
            loadOfficersTable();
            document.querySelector('.officers-grid').innerHTML = generateOfficerCards();
            
            // Close modal
            const modal = document.getElementById('add-officer-modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    form.reset();
                    delete form.dataset.officerId;
                }, 300);
            }
        }
        
        // ... rest of the existing setupAddOfficerForm code ...
    }

    // Button Handlers Setup
    function setupButtonHandlers() {
        // Add Officer Button
        const addOfficerBtn = document.getElementById('add-officer-btn');
        if (addOfficerBtn) {
            addOfficerBtn.addEventListener('click', function() {
                openAddOfficerModal();
            });
        }

        // Action Buttons (View, Edit, Delete)
        document.addEventListener('click', function(e) {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const officerId = actionBtn.closest('.officer-card')?.dataset.id || 
                             actionBtn.closest('tr')?.dataset.id;
            
            if (actionBtn.classList.contains('view')) {
                viewOfficerDetails(officerId);
            } else if (actionBtn.classList.contains('edit')) {
                editOfficer(officerId);
            } else if (actionBtn.classList.contains('delete')) {
                deleteOfficer(officerId);
            }
        });

        // Filter Buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filterType = this.dataset.filter;
                filterOfficers(filterType);
            });
        });

        // Export Button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportOfficerData);
        }

        // Print Button
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', printOfficerData);
        }
    }

    // Modal Functions
    function openAddOfficerModal() {
        const modalHtml = `
            <div id="officer-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-plus"></i> Add New Officer</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="officer-form" class="modal-body">
                        <div class="form-group">
                            <label for="officer-name">Full Name</label>
                            <input type="text" id="officer-name" required>
                        </div>
                        <div class="form-group">
                            <label for="officer-badge">Badge Number</label>
                            <input type="text" id="officer-badge" required>
                        </div>
                        <div class="form-group">
                            <label for="officer-rank">Rank</label>
                            <select id="officer-rank" required>
                                <option value="">Select Rank</option>
                                <option value="Officer">Officer</option>
                                <option value="Detective">Detective</option>
                                <option value="Sergeant">Sergeant</option>
                                <option value="Lieutenant">Lieutenant</option>
                                <option value="Captain">Captain</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="officer-department">Department</label>
                            <select id="officer-department" required>
                                <option value="">Select Department</option>
                                <option value="Patrol">Patrol</option>
                                <option value="Homicide">Homicide</option>
                                <option value="Traffic">Traffic</option>
                                <option value="Cybercrime">Cybercrime</option>
                                <option value="Narcotics">Narcotics</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="officer-contact">Contact Number</label>
                            <input type="tel" id="officer-contact" required>
                        </div>
                        <div class="form-group">
                            <label for="officer-status">Status</label>
                            <select id="officer-status" required>
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn secondary close-modal">Cancel</button>
                            <button type="submit" class="btn primary">Add Officer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add modal to body if it doesn't exist
        if (!document.getElementById('officer-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        const modal = document.getElementById('officer-modal');
        const form = document.getElementById('officer-form');
        const closeButtons = modal.querySelectorAll('.close-modal');

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);

        // Close modal handlers
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });

        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        // Form submission
        form.addEventListener('submit', handleOfficerFormSubmit);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            const form = modal.querySelector('form');
            if (form) form.reset();
        }, 300);
    }

    function handleOfficerFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const isEdit = form.dataset.officerId;

        const newOfficer = {
            id: isEdit ? parseInt(form.dataset.officerId) : officerData.length + 1,
            name: document.getElementById('officer-name').value,
            badge: document.getElementById('officer-badge').value,
            rank: document.getElementById('officer-rank').value,
            department: document.getElementById('officer-department').value,
            contact: document.getElementById('officer-contact').value,
            status: document.getElementById('officer-status').value
        };

        // Validate badge number uniqueness
        const existingOfficer = officerData.find(o => 
            o.badge === newOfficer.badge && (!isEdit || o.id !== newOfficer.id)
        );

        if (existingOfficer) {
            showNotification('Badge number already exists', 'error');
            return;
        }

        if (isEdit) {
            // Update existing officer
            const index = officerData.findIndex(o => o.id === newOfficer.id);
            if (index !== -1) {
                officerData[index] = newOfficer;
                showNotification('Officer updated successfully', 'success');
            }
        } else {
            // Add new officer
            officerData.push(newOfficer);
            showNotification('Officer added successfully', 'success');
        }

        // Refresh displays
        loadOfficersTable();
        closeModal(document.getElementById('officer-modal'));
    }

    function viewOfficerDetails(officerId) {
        const officer = officerData.find(o => o.id === parseInt(officerId));
        if (!officer) return;

        const modalHtml = `
            <div id="view-officer-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-user"></i> Officer Details</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="officer-details-view">
                            <div class="officer-avatar-large">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(officer.name)}&size=128" alt="${officer.name}">
                                <span class="status-indicator ${officer.status.toLowerCase().replace(' ', '-')}"></span>
                            </div>
                            <div class="detail-group">
                                <label>Name:</label>
                                <p>${officer.name}</p>
                            </div>
                            <div class="detail-group">
                                <label>Badge Number:</label>
                                <p>${officer.badge}</p>
                            </div>
                            <div class="detail-group">
                                <label>Rank:</label>
                                <p>${officer.rank}</p>
                            </div>
                            <div class="detail-group">
                                <label>Department:</label>
                                <p>${officer.department}</p>
                            </div>
                            <div class="detail-group">
                                <label>Contact:</label>
                                <p>${officer.contact}</p>
                            </div>
                            <div class="detail-group">
                                <label>Status:</label>
                                <p>${officer.status}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary close-modal">Close</button>
                        <button class="btn primary edit-officer" data-id="${officer.id}">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('view-officer-modal');

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);

        // Setup close handlers
        setupModalCloseHandlers(modal);

        // Edit button handler
        modal.querySelector('.edit-officer').addEventListener('click', function() {
            closeModal(modal);
            editOfficer(this.dataset.id);
        });
    }

    function editOfficer(officerId) {
        const officer = officerData.find(o => o.id === parseInt(officerId));
        if (!officer) return;

        openAddOfficerModal();
        const form = document.getElementById('officer-form');
        const modal = document.getElementById('officer-modal');

        // Update modal title and button
        modal.querySelector('.modal-header h2').innerHTML = '<i class="fas fa-edit"></i> Edit Officer';
        modal.querySelector('button[type="submit"]').textContent = 'Update Officer';

        // Fill form with officer data
        form.dataset.officerId = officer.id;
        document.getElementById('officer-name').value = officer.name;
        document.getElementById('officer-badge').value = officer.badge;
        document.getElementById('officer-rank').value = officer.rank;
        document.getElementById('officer-department').value = officer.department;
        document.getElementById('officer-contact').value = officer.contact;
        document.getElementById('officer-status').value = officer.status;
    }

    function deleteOfficer(officerId) {
        const officer = officerData.find(o => o.id === parseInt(officerId));
        if (!officer) return;

        if (confirm(`Are you sure you want to delete officer ${officer.name}?`)) {
            const index = officerData.findIndex(o => o.id === parseInt(officerId));
            if (index !== -1) {
                officerData.splice(index, 1);
                showNotification('Officer deleted successfully', 'success');
                loadOfficersTable();
            }
        }
    }

    function refreshOfficerDisplays() {
        // Refresh officers grid
        const officersGrid = document.querySelector('.officers-grid');
        if (officersGrid) {
            officersGrid.innerHTML = generateOfficerCards(officerData);
        }

        // Refresh officers table
        loadOfficersTable();
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize button handlers when DOM is loaded
    setupButtonHandlers();
}); 