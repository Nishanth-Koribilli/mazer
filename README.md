# Task 3 – Mazer Front-End Skill Assessment & Customization Submission

## Overview
This submission presents a customized, data-driven version of the **Mazer Admin Dashboard** (Bootstrap 5). The codebase has been enhanced with modern SCSS styling tokens, glassmorphism visual design, micro-animations, and dynamic frontend components that fetch and render real-time data from JSON API endpoints using ES6 JavaScript.

---

## 🎨 Summary of Changes Made

### 1. SCSS & Design System Advancements
* **Modern Design Tokens & CSS Variables**: Defined custom CSS variables for primary indigo/violet themes (`#6366f1`), vibrant gradients, dark mode color mapping, and elevation shadows (`_custom-advancements.scss`).
* **Glassmorphic UI**: Created reusable `.glass-card` classes utilizing `backdrop-filter: blur(12px)` and subtle translucent borders for a state-of-the-art aesthetic.
* **Micro-Animations & Interactive Hover States**:
  * Smooth card lift effects (`transform: translateY(-3px)`).
  * Animated icon badges with rotation on hover.
  * Live status indicator pulse ring (`@keyframes pulse-ring`).
  * Skeleton loader shimmer effects (`@keyframes shimmer`).
* **Dark & Light Mode Integration**: Integrated custom advancements into both light mode (`app.scss`) and dark mode (`app-dark.scss`) without breaking Bootstrap 5 component standards.

### 2. Layout & UI Component Enhancements
* **Interactive Dashboard Header Toolbar**: Added live endpoint sync status badge, timeframe selector dropdown (Monthly/Weekly/Daily), and an asynchronous **Refresh Endpoint** action button.
* **Dynamic Statistics Cards**: Updated metric displays (Profile Views, Followers, Following, Saved Posts, Revenue) to bind dynamically with incoming JSON data streams.
* **Recent Transactions Table**: Implemented a modern rounded table with customer avatars, payment descriptions, status pill badges, and code tags.

---

## 📡 How Data is Fetched from Endpoint JSON

Data binding and asynchronous fetching are handled by `src/assets/static/js/pages/dynamic-dashboard.js` using native ES6 `async/await` and the `fetch` API.

### 1. Mock JSON Endpoints Defined
* `assets/static/api/dashboard-summary.json`: Contains metric key-values, percentage trends, and system health status.
* `assets/static/api/transactions.json`: Contains structured array of transaction items (Customer name, avatar, amount, transaction ID, date, status).
* `assets/static/api/analytics.json`: Contains time-series datasets grouped by timeframe (`monthly`, `weekly`, `daily`) for chart rendering.

### 2. Fetch & Render Logic (`dynamic-dashboard.js`)

```javascript
// Example: Asynchronously fetching dashboard summary metrics
async function loadDashboardMetrics() {
  try {
    const res = await fetch('assets/static/api/dashboard-summary.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (data.metrics) {
      updateMetricElement('val-profile-views', data.metrics.profile_views.value);
      updateMetricElement('val-followers', data.metrics.followers.value);
      updateMetricElement('val-revenue', data.metrics.monthly_revenue.value);
      updateBadgeElement('badge-profile-trend', data.metrics.profile_views.change, data.metrics.profile_views.trend);
    }
  } catch (err) {
    console.error('Failed to load metrics:', err);
  }
}

// Example: Dynamic transaction table rendering
async function loadTransactions() {
  const tbody = document.getElementById('table-transactions-body');
  try {
    const res = await fetch('assets/static/api/transactions.json');
    const transactions = await res.json();

    tbody.innerHTML = transactions.map(txn => `
      <tr>
        <td class="align-middle">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-md me-3">
              <img src="${txn.avatar}" alt="${txn.customer}" class="rounded-circle">
            </div>
            <div>
              <h6 class="mb-0 text-bold">${txn.customer}</h6>
              <small class="text-muted">${txn.user}</small>
            </div>
          </div>
        </td>
        <td class="align-middle"><code class="text-primary">${txn.id}</code></td>
        <td class="align-middle text-muted small">${txn.date}</td>
        <td class="align-middle font-extrabold">${txn.amount}</td>
        <td class="align-middle">
          <span class="badge ${txn.badge_class} badge-pill-custom">${txn.status}</span>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load transactions:', err);
  }
}
```

### 3. Dynamic Chart Re-Rendering & Timeframe Filtering
* When the user changes the timeframe dropdown (Monthly / Weekly / Daily), `loadAnalyticsChart(selectedTimeframe)` is invoked.
* It fetches `analytics.json`, selects the target dataset, and calls `visitsChart.updateOptions(...)` to seamlessly animate ApexCharts without full page reload.

---

## 🚀 Setup & Local Execution Instructions

### Prerequisites
* Node.js (v16+ recommended)
* npm or yarn

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone <your-forked-repo-url>
   cd mazer
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the local development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**:
   Navigate to `http://localhost:5173` to explore the customized dashboard.

---

## 📁 Repository Structure Overview
```
mazer/
├── src/
│   ├── assets/
│   │   ├── scss/
│   │   │   ├── _custom-advancements.scss    # Custom SCSS tokens, glassmorphism & micro-animations
│   │   │   ├── app.scss                     # Main SCSS entrypoint
│   │   │   └── themes/dark/app-dark.scss    # Dark mode theme entrypoint
│   │   └── static/
│   │       ├── api/                         # Endpoint JSON payloads
│   │       │   ├── dashboard-summary.json
│   │       │   ├── transactions.json
│   │       │   └── analytics.json
│   │       └── js/pages/
│   │           └── dynamic-dashboard.js     # Asynchronous fetch & component renderer
│   └── index.html                           # Updated dashboard layout & component containers
├── README.md                                # Submission README & documentation
└── package.json
```
