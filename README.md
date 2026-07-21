Project Implementation & Technical Explanation
1. Executive Summary & Architecture Overview
This project presents an enhanced, customizable, and data-driven adaptation of the Mazer Admin Dashboard (Bootstrap 5). The primary objective was to transition Mazer from a static template into a modern, production-ready frontend application capable of dynamically consuming API endpoint payloads, binding data to UI components, and delivering a visually elevated user experience across device viewports and theme modes (Light/Dark).

The architectural strategy focuses on two main pillars:

Modular SCSS Design System & Micro-Animations: Elevating the visual hierarchy using custom CSS custom properties, glassmorphism backdrop filters, hover elevation transitions, glowing indicators, and modern typography tokens.
Asynchronous Endpoint Data Fetching: Decoupling the presentation layer from static HTML content by serving metrics, transactions, and time-series chart data through mock JSON API endpoints, consumed asynchronously via native ES6 async/await and the fetch API.
2. UI/UX Design Advancements & SCSS Token Pipeline
To modernize Mazer's visual language, a dedicated SCSS advancements module (src/assets/scss/_custom-advancements.scss) was created and integrated into the compilation pipeline (app.scss and app-dark.scss).

Key SCSS Enhancements:
Custom CSS Variables & Color Palette: Established custom design tokens in :root and html[data-bs-theme="dark"], introducing vibrant primary indigo (#6366f1), teal, amber, and rose gradients (--gradient-primary, --gradient-purple, --gradient-success).
Glassmorphism (.glass-card): Applied translucent backgrounds (rgba(255, 255, 255, 0.85) in light mode, rgba(30, 41, 59, 0.82) in dark mode) paired with backdrop-filter: blur(12px) and low-opacity borders (rgba(255, 255, 255, 0.4)), giving containers a sleek floating depth.
Micro-Animations & Interaction Elevation:
Card Hover Lift: Implemented cubic-bezier smooth translation (transform: translateY(-3px)) and adaptive box shadows (--shadow-md) on .card hover states.
Icon Badge Hover Rotation: Configured stat icons (.stats-icon) to subtly scale (scale(1.1)) and rotate (rotate(4deg)) upon card interaction.
Pulse Indicator (.live-indicator): Added a keyframe animation (@keyframes pulse-ring) that generates a glowing halo around live endpoint status indicators.
Skeleton Loading Shimmer (.skeleton-shimmer): Designed linear gradient shimmer animations (@keyframes shimmer) to represent loading states during async data calls.
Custom Scrollbars & Enhanced Tables: Customized -webkit-scrollbar width and track styling, and styled .table-custom rows with rounded border-radii and subtle hover highlight overlays.
3. Data-Driven Endpoint JSON Architecture
To satisfy real-world data binding requirements, three JSON API endpoints were created under src/assets/static/api/:

dashboard-summary.json:

Stores top-level KPI metrics including profile_views, followers, following, saved_posts, monthly_revenue, and active_subscribers.
Includes percentage growth strings, directional trend indicators (up / down), and system health key-values (Server Uptime, API Latency, Storage Used).
transactions.json:

Serves an array of recent financial transactions containing customer profile names, user avatars, transaction reference IDs (TXN-9021), transaction dates, amounts, status labels (Completed, Processing, Failed), and associated Bootstrap badge utility classes.
analytics.json:

Houses multi-region time-series data streams (Europe Traffic, America Traffic, Asia Traffic) partitioned into three distinct timeframes: monthly (12 months), weekly (7 days), and daily (6 time intervals).
4. Asynchronous Data Fetching & Component Binding Logic
The client-side integration controller is written in native ES6 JavaScript (src/assets/static/js/pages/dynamic-dashboard.js). Upon document loading (DOMContentLoaded), initDynamicDashboard() initializes async request cycles.

A. Metric Data Binding (loadDashboardMetrics)
The controller issues an HTTP GET request to assets/static/api/dashboard-summary.json via fetch().
Upon receiving a successful HTTP response (res.ok), the response payload is parsed to JSON.
The script targets DOM elements (val-profile-views, val-followers, val-revenue) and updates their text content.
Trend badges (badge-profile-trend, badge-followers-trend) are dynamically injected with calculated percentage change values and styled with corresponding success (bg-light-success) or danger (bg-light-danger) classes based on the trend key.
B. Dynamic Table Generation (loadTransactions)
The controller requests assets/static/api/transactions.json.
Using JavaScript Array.prototype.map(), it generates HTML table rows (<tr>) populated with customer avatars (<img src="${txn.avatar}">), styled transaction IDs (<code class="text-primary">${txn.id}</code>), formatted dates, amounts, and status pill badges (<span class="badge ${txn.badge_class}">).
The generated markup string is written directly to <tbody id="table-transactions-body"> via innerHTML.
C. Interactive Timeframe Chart Rendering (loadAnalyticsChart)
The chart initialization function fetches assets/static/api/analytics.json.
Based on the selected timeframe argument (monthly, weekly, or daily), the function retrieves the corresponding categories array and dataset series.
It configures ApexCharts option properties (column width, border radii, grid line opacity, custom series colors) and initializes or updates the chart instance using visitsChart.updateOptions(options) to achieve smooth SVG bar transitions without full page refresh.
D. Sync Action & User Feedback
The UI header toolbar features a manual Refresh Endpoint button (#btn-refresh-dashboard) and a timeframe selector (#select-timeframe).
Clicking the refresh button adds a temporary spin-icon CSS rotation class to the button icon, re-executes loadDashboardMetrics(), loadTransactions(), and loadAnalyticsChart(), and triggers a Toastify notification ("Dashboard data synchronized with endpoint").
5. Theme Compatibility & Production Integrity
Dark Mode Persistence: The custom SCSS design tokens automatically respond to attribute changes on html[data-bs-theme="dark"], swapping card background translucencies, text contrast ratios, and table border colors seamlessly.
Component Isolation & Responsiveness: All layout enhancements utilize Bootstrap 5 grid breakpoints (col-12, col-lg-9, col-lg-3, col-md-6), preserving responsive reflow on desktop, tablet, and mobile views.
