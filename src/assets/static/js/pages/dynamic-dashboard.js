/**
 * Mazer Dynamic Dashboard Controller
 * Asynchronously fetches component data from API endpoints and updates the UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicDashboard();
});

let visitsChart = null;

async function initDynamicDashboard() {
  const refreshBtn = document.getElementById('btn-refresh-dashboard');
  const timeframeSelect = document.getElementById('select-timeframe');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('disabled');
      const icon = refreshBtn.querySelector('i');
      if (icon) icon.classList.add('spin-icon');
      
      await loadDashboardMetrics();
      await loadTransactions();
      await loadAnalyticsChart(timeframeSelect ? timeframeSelect.value : 'monthly');

      setTimeout(() => {
        refreshBtn.classList.remove('disabled');
        if (icon) icon.classList.remove('spin-icon');
        showToastNotification('Dashboard data synchronized with endpoint');
      }, 500);
    });
  }

  if (timeframeSelect) {
    timeframeSelect.addEventListener('change', (e) => {
      loadAnalyticsChart(e.target.value);
    });
  }

  // Initial Data Load
  await loadDashboardMetrics();
  await loadTransactions();
  await loadAnalyticsChart('monthly');
}

async function loadDashboardMetrics() {
  try {
    const res = await fetch('assets/static/api/dashboard-summary.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (data.metrics) {
      updateMetricElement('val-profile-views', data.metrics.profile_views.value);
      updateMetricElement('val-followers', data.metrics.followers.value);
      updateMetricElement('val-following', data.metrics.following.value);
      updateMetricElement('val-saved-posts', data.metrics.saved_posts.value);
      
      updateMetricElement('val-revenue', data.metrics.monthly_revenue.value);
      updateMetricElement('val-subscribers', data.metrics.active_subscribers.value);
      
      updateBadgeElement('badge-profile-trend', data.metrics.profile_views.change, data.metrics.profile_views.trend);
      updateBadgeElement('badge-followers-trend', data.metrics.followers.change, data.metrics.followers.trend);
    }

    if (data.quick_stats) {
      renderQuickStats(data.quick_stats);
    }
  } catch (err) {
    console.warn('Fallback to embedded default metrics:', err);
  }
}

function updateMetricElement(id, textValue) {
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0.4';
    setTimeout(() => {
      el.textContent = textValue;
      el.style.opacity = '1';
    }, 150);
  }
}

function updateBadgeElement(id, changeText, trend) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = changeText;
    el.className = `badge ${trend === 'up' ? 'bg-light-success text-success' : 'bg-light-danger text-danger'} badge-pill-custom`;
  }
}

function renderQuickStats(stats) {
  const container = document.getElementById('quick-stats-container');
  if (!container) return;

  container.innerHTML = stats.map(item => `
    <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-light">
      <span class="text-muted small">${item.name}</span>
      <span class="badge bg-light-${item.status} text-${item.status} font-semibold">${item.value}</span>
    </div>
  `).join('');
}

async function loadTransactions() {
  const tbody = document.getElementById('table-transactions-body');
  if (!tbody) return;

  try {
    const res = await fetch('assets/static/api/transactions.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
    console.error('Failed to load transaction data from endpoint:', err);
  }
}

async function loadAnalyticsChart(timeframe = 'monthly') {
  const chartContainer = document.querySelector('#chart-profile-visit');
  if (!chartContainer) return;

  try {
    const res = await fetch('assets/static/api/analytics.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const analytics = await res.json();
    const currentData = analytics[timeframe] || analytics.monthly;

    const options = {
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      colors: ['#6366f1', '#10b981', '#f59e0b'],
      series: currentData.series,
      xaxis: {
        categories: currentData.categories,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.15)',
        strokeDashArray: 4
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6
        }
      },
      dataLabels: { enabled: false },
      legend: { position: 'top', horizontalAlign: 'right' }
    };

    if (visitsChart) {
      visitsChart.updateOptions(options);
    } else if (typeof ApexCharts !== 'undefined') {
      visitsChart = new ApexCharts(chartContainer, options);
      visitsChart.render();
    }
  } catch (err) {
    console.warn('Analytics chart loading fallback:', err);
  }
}

function showToastNotification(msg) {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: msg,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #6366f1, #4f46e5)',
    }).showToast();
  }
}

// Add CSS keyframe for icon spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .spin-icon { animation: spin 0.8s linear infinite; display: inline-block; }
`;
document.head.appendChild(style);
