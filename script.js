// script.js

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // STATE MANAGEMENT
    // All application state is managed here, similar to React's useState.
    // =================================================================================
    let state = {
        theme: 'light',
        user: null, // Holds authenticated user object or null
        activeTab: 'dashboard',
        devices: [
             {
      id: 'dev-001',
      name: 'Ward A - Multiparameter Monitor',
      type: 'Multiparameter Monitor',
      status: 'online',
      lastUpdate: '2 minutes ago',
      vitals: {
        heartRate: 72,
        bloodPressure: { systolic: 120, diastolic: 80, mean: 93 },
        temperature: 98.6,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        bloodGlucose: 95,
        painLevel: 3,
        consciousnessLevel: 15,
        capnography: 35,
        perfusionIndex: 1.2,
        pulseVariability: 8,
        ecgRhythm: 'normal'
      },
      patientId: 'PAT-001',
      patientName: 'John Smith'
    },
    {
      id: 'dev-002',
      name: 'ICU - Critical Care Monitor',
      type: 'Multiparameter Monitor',
      status: 'online',
      lastUpdate: '1 minute ago',
      vitals: {
        heartRate: 84,
        bloodPressure: { systolic: 130, diastolic: 85, mean: 100 },
        temperature: 99.1,
        oxygenSaturation: 97,
        respiratoryRate: 18,
        bloodGlucose: 110,
        painLevel: 5,
        consciousnessLevel: 14,
        capnography: 38,
        perfusionIndex: 0.9,
        pulseVariability: 12,
        ecgRhythm: 'arrhythmia'
      },
      patientId: 'PAT-002',
      patientName: 'Sarah Johnson'
    },
    {
      id: 'dev-003',
      name: 'Emergency - Portable Monitor',
      type: 'Multiparameter Monitor',
      status: 'maintenance',
      lastUpdate: '1 hour ago',
      vitals: {},
      patientId: 'PAT-003',
      patientName: 'Mike Wilson'
    }
        ],
        patients: [
             {
      id: 'PAT-001',
      name: 'John Smith',
      age: 65,
      gender: 'Male',
      condition: 'Hypertension',
      severity: 'medium',
      admissionDate: '2024-01-15',
      connectedDevices: 2,
      latestVitals: {
        heartRate: 72,
        bloodPressure: { systolic: 120, diastolic: 80, mean: 93 },
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        bloodGlucose: 95,
        painLevel: 3,
        consciousnessLevel: 15,
        timestamp: '2 minutes ago'
      }
    },
    {
      id: 'PAT-002',
      name: 'Sarah Johnson',
      age: 42,
      gender: 'Female',
      condition: 'Cardiac Arrhythmia',
      severity: 'high',
      admissionDate: '2024-01-18',
      connectedDevices: 1,
      latestVitals: {
        heartRate: 84,
        bloodPressure: { systolic: 130, diastolic: 85, mean: 100 },
        temperature: 99.1,
        respiratoryRate: 18,
        oxygenSaturation: 97,
        bloodGlucose: 110,
        painLevel: 5,
        consciousnessLevel: 14,
        timestamp: '1 minute ago'
      }
    },
    {
      id: 'PAT-003',
      name: 'Mike Wilson',
      age: 58,
      gender: 'Male',
      condition: 'Post-Surgery Recovery',
      severity: 'low',
      admissionDate: '2024-01-20',
      connectedDevices: 1,
      latestVitals: {
        heartRate: 68,
        bloodPressure: { systolic: 115, diastolic: 75, mean: 88 },
        temperature: 98.2,
        respiratoryRate: 14,
        oxygenSaturation: 99,
        bloodGlucose: 88,
        painLevel: 2,
        consciousnessLevel: 15,
        timestamp: '5 minutes ago'
      }
    }
        ],
        chartData: {
            heartRate: [{ time: '10:00', value: 72 }, { time: '10:05', value: 74 }, { time: '10:10', value: 71 }, { time: '10:15', value: 73 }, { time: '10:20', value: 70 }, { time: '10:25', value: 72 }],
            temperature: [{ time: '10:00', value: 98.6 }, { time: '10:05', value: 98.7 }, { time: '10:10', value: 98.5 }, { time: '10:15', value: 98.8 }, { time: '10:20', value: 98.6 }, { time: '10:25', value: 98.7 }],
            respiratory: [{ time: '10:00', value: 16 }, { time: '10:05', value: 17 }, { time: '10:10', value: 15 }, { time: '10:15', value: 16 }, { time: '10:20', value: 18 }, { time: '10:25', value: 16 }],
            bloodPressure: [{ time: '10:00', systolic: 120, diastolic: 80 }, { time: '10:05', systolic: 122, diastolic: 82 }, { time: '10:10', systolic: 118, diastolic: 78 }, { time: '10:15', systolic: 125, diastolic: 85 }, { time: '10:20', systolic: 121, diastolic: 79 }, { time: '10:25', systolic: 120, diastolic: 80 }],
            oxygenSaturation: [{ time: '10:00', value: 98 }, { time: '10:05', value: 97 }, { time: '10:10', value: 99 }, { time: '10:15', value: 98 }, { time: '10:20', value: 96 }, { time: '10:25', value: 98 }],
            bloodGlucose: [{ time: '10:00', value: 95 }, { time: '10:05', value: 98 }, { time: '10:10', value: 92 }, { time: '10:15', value: 97 }, { time: '10:20', value: 94 }, { time: '10:25', value: 95 }],
        }
    };
    
    // Global object to hold chart instances for updates
    let charts = {};

    // =================================================================================
    // UTILITY & HELPER FUNCTIONS
    // =================================================================================

    const root = document.getElementById('root');

    // Capitalizes the first letter of a string
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // =================================================================================
    // COMPONENT FUNCTIONS
    // These functions generate HTML strings, acting like React components.
    // =================================================================================

    // --- LoginPage Component ---
    function LoginPage() {
        return `
            <div class="min-h-screen bg-background flex items-center justify-center p-4 relative">
                <div class="absolute top-4 right-4">
                    <button id="theme-toggle-btn" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2">
                        ${state.theme === 'light' ? '<i data-lucide="moon" class="h-4 w-4"></i><span class="hidden sm:inline">Dark</span>' : '<i data-lucide="sun" class="h-4 w-4"></i><span class="hidden sm:inline">Light</span>'}
                    </button>
                </div>
                <div class="w-full max-w-4xl">
                    <div class="text-center mb-8">
                         <div class="flex items-center justify-center gap-3 mb-4">
                            <div class="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                                <i data-lucide="activity" class="h-8 w-8 text-primary-foreground"></i>
                            </div>
                            <div class="text-left">
                                <h1 class="text-3xl font-bold">Connexta</h1>
                                <p class="text-sm text-muted-foreground">IoT Medical Device Management Platform</p>
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto max-w-2xl border bg-card text-card-foreground shadow-sm rounded-lg">
                        <div class="flex flex-col space-y-1.5 p-6 text-center">
                            <h3 class="text-2xl font-semibold">Sign In to Connexta</h3>
                            <p class="text-sm text-muted-foreground">Choose your role to access the appropriate dashboard</p>
                        </div>
                        <div class="p-6 pt-0">
                            <div id="login-tabs">
                                <div class="grid w-full grid-cols-2 lg:grid-cols-4">
                                    <button data-tab="doctor" class="login-tab-trigger flex-1 text-xs justify-center inline-flex items-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Doctor</button>
                                    <button data-tab="patient" class="login-tab-trigger flex-1 text-xs justify-center inline-flex items-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Patient</button>
                                    <button data-tab="vendor" class="login-tab-trigger flex-1 text-xs justify-center inline-flex items-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Vendor</button>
                                    <button data-tab="connexta" class="login-tab-trigger flex-1 text-xs justify-center inline-flex items-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Admin</button>
                                </div>
                                <div id="login-form-container" class="mt-6 space-y-4">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // --- Login Form Content ---
    function LoginForm(userType) {
        const userTypes = {
            doctor: { label: 'Doctor', description: 'Access patient monitoring and medical records' },
            patient: { label: 'Patient', description: 'View your health data and vital signs' },
            vendor: { label: 'Vendor', description: 'Manage medical devices and equipment' },
            connexta: { label: 'Connexta Admin', description: 'Full system administration and oversight' }
        };
        const details = userTypes[userType];
        return `
            <div class="text-center mb-6">
                <h3 class="text-lg font-semibold">${details.label} Access</h3>
                <p class="text-sm text-muted-foreground">${details.description}</p>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="text-sm font-medium">Email Address</label>
                    <input type="email" id="email-input" placeholder="Enter your email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                    <label class="text-sm font-medium">Password</label>
                    <input type="password" id="password-input" placeholder="Enter your password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" />
                </div>
                <button id="login-submit-btn" data-type="${userType}" class="inline-flex items-center justify-center w-full h-10 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md">
                    Sign In as ${details.label}
                </button>
            </div>
        `;
    }

    // --- VitalChart Component (using Chart.js) ---
    function VitalChart(title, canvasId) {
        return `
            <div class="border bg-card text-card-foreground shadow-sm rounded-lg">
                <div class="p-6 pb-2">
                    <div class="flex items-center justify-between">
                         <h3 class="text-lg font-semibold">${title}</h3>
                         <div id="${canvasId}-current" class="text-right"></div>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <div class="h-48">
                        <canvas id="${canvasId}"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Main Application Shell ---
    function AppShell() {
        const onlineDevices = state.devices.filter(d => d.status === 'online').length;
        const totalPatients = state.patients.length;
        const activeAlerts = state.patients.filter(p => p.severity === 'high' || p.severity === 'critical').length;

        // User-specific tabs
        const getTabsForUser = (userType) => {
            let tabs = {
                'dashboard': 'Dashboard'
            };
            if (userType === 'doctor') {
                Object.assign(tabs, {
                    'device-status': 'Device Status',
                    'patient-details': 'Patient Details',
                    'live-monitoring': 'Live Monitoring',
                });
            }
            if (userType === 'patient') {
                 Object.assign(tabs, {
                    'medical-history': 'Medical History',
                    'health-benefits': 'Health Benefits',
                });
            }
             if (userType === 'vendor') {
                 Object.assign(tabs, {
                    'device-inventory': 'Device Inventory',
                    'maintenance': 'Maintenance',
                });
            }
            if (userType === 'connexta') {
                 Object.assign(tabs, {
                    'device-overview': 'Device Overview',
                    'system-analytics': 'System Analytics',
                });
            }
            return Object.entries(tabs).map(([key, value]) => `
                <button data-tab="${key}" class="main-tab-trigger whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
                    ${value}
                </button>
            `).join('');
        }

        return `
            <div class="min-h-screen bg-background">
                <header class="border-b bg-card">
                    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                                <i data-lucide="activity" class="h-6 w-6 text-primary-foreground"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold">Connexta</h1>
                                <p class="text-sm text-muted-foreground">IoT Medical Device Management Platform</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg">
                                <i data-lucide="user" class="h-4 w-4"></i>
                                <span class="text-sm">${state.user.name}</span>
                                <span class="text-xs inline-flex items-center rounded-md border px-2 py-0.5 font-semibold">${capitalize(state.user.userType)}</span>
                            </div>
                            <button id="logout-btn" class="inline-flex items-center justify-center h-9 px-3 border border-input rounded-md gap-2 text-sm">
                                <i data-lucide="log-out" class="h-4 w-4"></i>
                                <span class="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main class="container mx-auto px-6 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div class="border bg-card rounded-lg p-6 flex items-center gap-3"><div class="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><i data-lucide="wifi" class="h-6 w-6 text-green-600"></i></div><div><p class="text-sm text-muted-foreground">Online Devices</p><p id="online-devices-stat" class="text-2xl font-bold">${onlineDevices}</p></div></div>
                        <div class="border bg-card rounded-lg p-6 flex items-center gap-3"><div class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"><i data-lucide="users" class="h-6 w-6 text-blue-600"></i></div><div><p class="text-sm text-muted-foreground">Active Patients</p><p class="text-2xl font-bold">${totalPatients}</p></div></div>
                        <div class="border bg-card rounded-lg p-6 flex items-center gap-3"><div class="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center"><i data-lucide="heart" class="h-6 w-6 text-red-600"></i></div><div><p class="text-sm text-muted-foreground">Active Alerts</p><p id="active-alerts-stat" class="text-2xl font-bold">${activeAlerts}</p></div></div>
                        <div class="border bg-card rounded-lg p-6 flex items-center gap-3"><div class="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"><i data-lucide="bar-chart-3" class="h-6 w-6 text-purple-600"></i></div><div><p class="text-sm text-muted-foreground">Data Points Today</p><p class="text-2xl font-bold">1,247</p></div></div>
                    </div>

                    <div class="space-y-6">
                        <div class="overflow-x-auto">
                            <div class="flex w-max min-w-full p-1 bg-muted rounded-md">
                                ${getTabsForUser(state.user.userType)}
                            </div>
                        </div>
                        <div id="tabs-content-container">
                            </div>
                    </div>
                </main>
            </div>
        `;
    }

    // --- Tabs Content Renderer ---
    function renderTabContent(tabId) {
        let content = '';
        if (tabId === 'dashboard') {
            content = `
                <div class="border bg-card rounded-lg p-6">
                    <h3 class="text-2xl font-semibold mb-4">System Overview</h3>
                    <img src="https://i.ibb.co/6ngp6sM/341cc1fcdf6e9c27b234649c5055666ff4a6ab0e.png" alt="System Diagram" class="rounded-lg shadow-sm max-w-full h-auto mx-auto"/>
                    <div class="mt-4 bg-muted/50 p-4 rounded-lg">
                        <h4 class="text-lg mb-2">Welcome to the ${capitalize(state.user.userType)} Dashboard</h4>
                        <p class="text-sm text-muted-foreground">Monitor device status, patient vitals, and system analytics in real-time.</p>
                    </div>
                </div>`;
        } else if (tabId === 'live-monitoring') {
            content = `
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    ${VitalChart('Heart Rate', 'hr-chart')}
                    ${VitalChart('Body Temperature', 'temp-chart')}
                    ${VitalChart('Respiratory Rate', 'resp-chart')}
                    ${VitalChart('Oxygen Saturation', 'o2-chart')}
                    ${VitalChart('Blood Glucose', 'glucose-chart')}
                    <div class="lg:col-span-2 xl:col-span-1">
                        ${VitalChart('Blood Pressure', 'bp-chart')}
                    </div>
                </div>
            `;
        } else if (tabId === 'device-status' || tabId === 'device-inventory' || tabId === 'device-overview') {
             const getDeviceStatusBadge = (status) => {
                const colors = { online: 'bg-green-500', offline: 'bg-red-500', maintenance: 'bg-yellow-500' };
                return `<span class="text-xs text-white ${colors[status]} inline-flex items-center rounded-full px-2 py-0.5 font-semibold">${capitalize(status)}</span>`;
            };
            content = `
                <div class="border bg-card rounded-lg p-6">
                    <h3 class="text-2xl font-semibold mb-4">Device Status</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${state.devices.map(device => `
                            <div class="p-4 border rounded-lg">
                                <div class="flex items-center justify-between mb-3">
                                    <h4 class="font-semibold">${device.name}</h4>
                                    ${getDeviceStatusBadge(device.status)}
                                </div>
                                <div class="space-y-2 text-sm">