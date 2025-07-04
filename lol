
<!DOCTYPE html>
<html lang="en" class="h-full bg-gray-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VH Mess - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .tab-button.active { 
            border-color: #4f46e5; 
            background-color: #eef2ff;
            color: #4338ca;
            font-weight: 600;
        }
    </style>
</head>
<body class="h-full">

    <!-- Login View -->
    <div id="login-view" class="h-full flex items-center justify-center bg-gray-100 p-4">
        <div class="w-full max-w-sm mx-auto bg-white p-8 rounded-xl border border-gray-200">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Admin Panel Login</h2>
            <form id="login-form">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" id="username" name="username" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required value="admin">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                    Login
                </button>
            </form>
        </div>
    </div>

    <!-- Dashboard View -->
    <div id="dashboard-view" class="hidden h-screen w-screen flex flex-col">
        <header class="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button id="logout-button" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
                Logout
            </button>
        </header>

        <main class="flex-grow p-6 bg-gray-50 overflow-y-auto">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-6" aria-label="Tabs">
                    <button id="tab-coupons" class="tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">View Coupons</button>
                    <button id="tab-upload" class="tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Upload Menu</button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div id="tab-content-coupons" class="tab-content">
                <div class="bg-white p-6 rounded-xl border border-gray-200">
                    <!-- Today's Summary -->
                    <h3 class="text-lg font-semibold text-gray-900">Today's Summary</h3>
                    <div id="coupon-summary" class="my-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <!-- Summary counts will be rendered here -->
                    </div>
                    
                    <!-- Search and Filter Section -->
                    <form id="filter-form" class="pt-6 mt-6 border-t border-gray-200">
                         <h3 class="text-lg font-semibold text-gray-900 mb-4">Search & Filter Coupons</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label for="search-input" class="block text-sm font-medium text-gray-700">Order ID / Customer Info</label>
                                <input type="text" id="search-input" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                            <div>
                                <label for="meal-type-filter" class="block text-sm font-medium text-gray-700">Meal Type</label>
                                <select id="meal-type-filter" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">All</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                            </div>
                            <div>
                                <label for="status-filter" class="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status-filter" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                                    <option value="">All (except Pending)</option>
                                    <option value="Active">Active</option>
                                    <option value="Used">Used</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                            <div>
                                <label for="date-filter" class="block text-sm font-medium text-gray-700">Specific Date</label>
                                <input type="date" id="date-filter" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                            </div>
                        </div>
                        <div class="mt-4 flex justify-end space-x-3">
                             <button id="clear-filters-btn" type="button" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">Clear</button>
                            <button id="apply-filters-btn" type="submit" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Search</button>
                        </div>
                    </form>
                    
                    <div id="coupons-display" class="mt-4 max-h-[50vh] overflow-y-auto p-2 border rounded-md bg-gray-50">
                        <!-- Coupon data will be rendered here -->
                    </div>
                </div>
            </div>

            <div id="tab-content-upload" class="tab-content hidden">
                 <div class="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Side: Upload -->
                    <div>
                        <form id="upload-form">
                            <label for="menuFile" class="block text-sm font-medium text-gray-700 mb-1">1. Select .xlsx file</label>
                            <div class="flex items-center space-x-4">
                                <input type="file" id="menuFile" name="menuFile" accept=".xlsx, .xls" class="flex-grow block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" required>
                            </div>
                        </form>
                        <div class="mt-4">
                             <h3 class="text-lg font-medium text-gray-900 mb-2">2. Preview New Menu</h3>
                             <div id="preview-display" class="max-h-[50vh] overflow-auto border rounded-md p-1 bg-gray-50">
                                <p class="text-gray-500 text-center p-4">Select a file to see the menu data.</p>
                             </div>
                        </div>
                        <div class="mt-6 text-right">
                             <button id="final-upload-btn" type="button" class="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
                                3. Confirm & Upload
                            </button>
                        </div>
                    </div>
                    <!-- Right Side: Current Menu -->
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Currently Active Menu</h3>
                        <div id="current-menu-display" class="max-h-[75vh] overflow-auto border rounded-md p-1 bg-gray-50">
                           <p class="text-gray-500 text-center p-4">Loading current menu...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
        
    <div id="status-message-container" class="fixed bottom-0 right-0 p-6 w-full max-w-sm">
        <!-- Status messages will appear here -->
    </div>


    <script>
        const API_BASE_URL = 'http://localhost:3001/api';
        let lastUsedParams = new URLSearchParams();
        
        // --- DOM Elements ---
        const loginView = document.getElementById('login-view');
        const dashboardView = document.getElementById('dashboard-view');
        const loginForm = document.getElementById('login-form');
        const logoutButton = document.getElementById('logout-button');
        
        const tabCoupons = document.getElementById('tab-coupons');
        const tabUpload = document.getElementById('tab-upload');
        const tabContentCoupons = document.getElementById('tab-content-coupons');
        const tabContentUpload = document.getElementById('tab-content-upload');

        const filterForm = document.getElementById('filter-form');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        const couponsDisplay = document.getElementById('coupons-display');
        const couponSummary = document.getElementById('coupon-summary');

        const uploadForm = document.getElementById('upload-form');
        const menuFileInput = document.getElementById('menuFile');
        const previewDisplay = document.getElementById('preview-display');
        const finalUploadBtn = document.getElementById('final-upload-btn');
        const currentMenuDisplay = document.getElementById('current-menu-display');

        const statusContainer = document.getElementById('status-message-container');

        // --- Core Functions ---
        
        const showView = (view) => {
            loginView.classList.toggle('hidden', view !== 'login');
            dashboardView.classList.toggle('hidden', view !== 'dashboard');
        };

        const setActiveTab = (tabName) => {
            const tabs = { coupons: tabCoupons, upload: tabUpload };
            const contents = { coupons: tabContentCoupons, upload: tabContentUpload };
            
            Object.values(tabs).forEach(tab => tab.classList.remove('active'));
            Object.values(contents).forEach(content => content.classList.add('hidden'));

            tabs[tabName].classList.add('active');
            contents[tabName].classList.remove('hidden');

            if (tabName === 'upload') {
                fetchCurrentMenu();
            }
        };

        const displayStatus = (message, isError = false) => {
            const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
            const statusDiv = document.createElement('div');
            statusDiv.className = `p-4 rounded-md text-white ${bgColor} mb-2 transition-all duration-300 transform translate-x-full`;
            statusDiv.textContent = message;
            statusContainer.appendChild(statusDiv);

            setTimeout(() => statusDiv.classList.remove('translate-x-full'), 10);
            setTimeout(() => {
                statusDiv.classList.add('opacity-0');
                statusDiv.addEventListener('transitionend', () => statusDiv.remove());
            }, 4000);
        };

        const setMealFilterByTime = () => {
            const mealTypeFilter = document.getElementById('meal-type-filter');
            const currentHour = new Date().getHours();
            if (currentHour >= 6 && currentHour < 12) mealTypeFilter.value = 'Breakfast';
            else if (currentHour >= 12 && currentHour < 17) mealTypeFilter.value = 'Lunch';
            else mealTypeFilter.value = 'Dinner';
        };

        // --- API Call Functions ---

        const handleLogin = async (event) => {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            try {
                const response = await fetch(`${API_BASE_URL}/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Login failed');
                localStorage.setItem('authToken', data.token);
                await checkLoginStatus();
            } catch (error) {
                displayStatus(error.message, true);
            }
        };

        const handleLogout = () => {
            localStorage.removeItem('authToken');
            showView('login');
            loginForm.reset();
        };

        const handleFinalUpload = async () => {
            if (!menuFileInput.files.length) {
                displayStatus('Please select a file to upload.', true);
                return;
            }
            const formData = new FormData();
            formData.append('menuFile', menuFileInput.files[0]);
            const token = localStorage.getItem('authToken');
            try {
                finalUploadBtn.disabled = true;
                finalUploadBtn.textContent = 'Uploading...';
                const response = await fetch(`${API_BASE_URL}/admin/menu/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Upload failed');
                displayStatus(data.message);
                uploadForm.reset();
                previewDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">Select a file to see the menu data.</p>';
                fetchCurrentMenu(); // Refresh the current menu display
            } catch (error) {
                displayStatus(error.message, true);
            } finally {
                finalUploadBtn.disabled = false;
                finalUploadBtn.textContent = '3. Confirm & Upload';
            }
        };
        
        const fetchCoupons = async (params) => {
            lastUsedParams = params;
            const token = localStorage.getItem('authToken');
            couponsDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">Loading coupons...</p>';
            try {
                const response = await fetch(`${API_BASE_URL}/admin/coupons/all?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch coupons');
                renderCoupons(data.coupons);
            } catch (error) {
                displayStatus(error.message, true);
                couponsDisplay.innerHTML = `<p class="text-red-500 text-center p-4">${error.message}</p>`;
            }
        };

        const fetchTodaysSummary = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/admin/coupons/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                renderSummary(data.summary);
            } catch (error) { console.error("Failed to fetch today's summary:", error); }
        };
        
        const fetchCurrentMenu = async () => {
            const token = localStorage.getItem('authToken');
            currentMenuDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">Loading current menu...</p>';
            try {
                const response = await fetch(`${API_BASE_URL}/admin/menu/current`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch current menu');
                renderCurrentMenu(data.menu);
            } catch (error) {
                displayStatus(error.message, true);
                currentMenuDisplay.innerHTML = `<p class="text-red-500 text-center p-4">${error.message}</p>`;
            }
        };

        const handleFilterSearch = (event) => {
            event.preventDefault();
            const params = new URLSearchParams();
            const search = document.getElementById('search-input').value;
            const mealType = document.getElementById('meal-type-filter').value;
            const status = document.getElementById('status-filter').value;
            const date = document.getElementById('date-filter').value;
            if (search) params.append('search', search);
            if (mealType) params.append('meal_type', mealType);
            if (status) params.append('status', status);
            if (date) params.append('date', date);
            fetchCoupons(params);
        };

        const handleMarkAsUsed = async (couponId) => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/admin/coupons/mark-used/${couponId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                displayStatus(data.message);
                fetchCoupons(lastUsedParams);
                fetchTodaysSummary();
            } catch (error) {
                displayStatus(error.message, true);
            }
        };

        const renderSummary = (summary) => {
            couponSummary.innerHTML = `
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-sm text-blue-800 font-medium">Breakfast Coupons</p>
                    <p class="text-3xl font-bold text-blue-900">${summary.Breakfast || 0}</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p class="text-sm text-green-800 font-medium">Lunch Coupons</p>
                    <p class="text-3xl font-bold text-green-900">${summary.Lunch || 0}</p>
                </div>
                <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p class="text-sm text-orange-800 font-medium">Dinner Coupons</p>
                    <p class="text-3xl font-bold text-orange-900">${summary.Dinner || 0}</p>
                </div>
            `;
        };

        const renderCoupons = (coupons) => {
            if (!coupons || coupons.length === 0) {
                couponsDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">No coupons found for the selected criteria.</p>';
                return;
            }
            const table = `
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100"><tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meal</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr></thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${coupons.map(c => `<tr>
                            <td class="px-4 py-2 text-sm font-medium text-gray-900">${c.id}</td><td class="px-4 py-2 text-sm text-gray-500">${c.customer_name} (${c.customer_phone})</td><td class="px-4 py-2 text-sm text-gray-500">${new Date(c.meal_date).toLocaleDateString()}</td><td class="px-4 py-2 text-sm text-gray-500">${c.meal_type}</td><td class="px-4 py-2 text-sm font-semibold ${c.status === 'Active' ? 'text-green-600' : 'text-gray-500'}">${c.status}</td><td class="px-4 py-2 text-sm">
                                ${c.status === 'Active' ? `<button onclick="handleMarkAsUsed('${c.id}')" class="font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400">Mark Used</button>` : `<span class="text-gray-400">-</span>`}
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;
            couponsDisplay.innerHTML = table;
        };
        
        const renderCurrentMenu = (menu) => {
            if (!menu || menu.length === 0) {
                currentMenuDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">No active menu found in the database.</p>';
                return;
            }
            const groupedMenu = menu.reduce((acc, item) => {
                (acc[item.day_of_week] = acc[item.day_of_week] || []).push(item);
                return acc;
            }, {});
            const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            let html = '';
            for (const day of daysOrder) {
                if (groupedMenu[day]) {
                    html += `<div class="mb-4"><h4 class="font-semibold text-md text-gray-700 bg-gray-100 p-2 rounded-t-md">${day}</h4><div class="border border-t-0 rounded-b-md p-2">`;
                    groupedMenu[day].forEach(item => {
                        html += `<div class="text-sm p-1"><span class="font-semibold w-24 inline-block">${item.meal_type}:</span> <span class="text-gray-600">${item.description} (₹${item.price})</span></div>`;
                    });
                    html += `</div></div>`;
                }
            }
            currentMenuDisplay.innerHTML = html;
        };

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            if (!file) {
                previewDisplay.innerHTML = '<p class="text-gray-500 text-center p-4">Select a file to see the menu data.</p>';
                finalUploadBtn.disabled = true;
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                if (json.length <= 1) {
                    previewDisplay.innerHTML = '<p class="text-red-500 text-center p-4">The selected file is empty or has no data rows.</p>';
                    finalUploadBtn.disabled = true;
                    return;
                }
                const headers = json[0];
                const rows = json.slice(1);
                const table = `
                    <table class="min-w-full divide-y divide-gray-200 text-xs">
                        <thead class="bg-gray-100"><tr>
                            ${headers.map(h => `<th class="px-2 py-1 text-left font-medium text-gray-500 uppercase">${h || ''}</th>`).join('')}
                        </tr></thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${rows.map(row => `<tr>
                                ${row.map(cell => `<td class="px-2 py-1 text-gray-600">${cell || ''}</td>`).join('')}
                            </tr>`).join('')}
                        </tbody>
                    </table>`;
                previewDisplay.innerHTML = table;
                finalUploadBtn.disabled = false;
            };
            reader.readAsArrayBuffer(file);
        };

        const checkLoginStatus = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) { showView('login'); return; }
            try {
                const response = await fetch(`${API_BASE_URL}/admin/verify-token`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (response.ok) {
                    showView('dashboard');
                    setActiveTab('coupons');
                    fetchTodaysSummary();
                    document.getElementById('date-filter').value = new Date().toISOString().slice(0, 10);
                    setMealFilterByTime();
                    applyFiltersBtn.click();
                } else { handleLogout(); }
            } catch (error) { handleLogout(); }
        };
        
        // --- Event Listeners ---
        loginForm.addEventListener('submit', handleLogin);
        logoutButton.addEventListener('click', handleLogout);
        filterForm.addEventListener('submit', handleFilterSearch);
        clearFiltersBtn.addEventListener('click', () => {
            filterForm.reset();
            fetchCoupons(new URLSearchParams());
        });
        
        tabCoupons.addEventListener('click', () => setActiveTab('coupons'));
        tabUpload.addEventListener('click', () => setActiveTab('upload'));

        menuFileInput.addEventListener('change', handleFileSelect);
        finalUploadBtn.addEventListener('click', handleFinalUpload);
        
        // --- Initial State ---
        document.addEventListener('DOMContentLoaded', checkLoginStatus);
    </script>
</body>
</html>
