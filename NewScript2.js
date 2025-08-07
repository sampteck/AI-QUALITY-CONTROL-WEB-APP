// 🌗 DARK MODE TOGGLE + PERSISTENCE
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// 🚀 Load theme on page load
window.onload = function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Setup the chart on load
  setupChart();
};

// 📊 CHART SETUP
let chart;
function setupChart() {
  const ctx = document.getElementById("qualityChart").getContext("2d");
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Product Quality Index',
        data: [],
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#4f46e5',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// 🛠️ MANUAL INPUT
function submitManualInput() {
  const weight = parseFloat(document.getElementById("weightInput").value);
  const size = parseFloat(document.getElementById("sizeInput").value);

  if (!weight || !size) {
    showToast("Please enter both weight and size!", "error");
    return;
  }

  const qualityIndex = calculateQualityIndex(weight, size);
  updateSystemStatus(qualityIndex);
  updateChart(qualityIndex);
  logData("Manual", weight, size, qualityIndex);
}

// 🎛️ SIMULATE SENSOR DATA
function simulateSensorData() {
  const weight = (Math.random() * 3 + 1).toFixed(2); // 1 - 4 kg
  const size = (Math.random() * 5 + 5).toFixed(2);   // 5 - 10 cm
  const qualityIndex = calculateQualityIndex(weight, size);

  updateSystemStatus(qualityIndex);
  updateChart(qualityIndex);
  logData("Simulated", weight, size, qualityIndex);
}

// 🧮 QUALITY CALCULATION (Sample Logic)
function calculateQualityIndex(weight, size) {
  // Simple normalized formula — feel free to customize
  let index = 100 - Math.abs(weight - 2.5) * 20 - Math.abs(size - 7) * 10;
  return Math.max(0, Math.min(100, index.toFixed(2)));
}

// 📈 UPDATE CHART
function updateChart(value) {
  const now = new Date().toLocaleTimeString();
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

// 💬 SYSTEM STATUS
function updateSystemStatus(index) {
  const status = document.getElementById("statusDisplay");
  if (index >= 80) {
    status.textContent = "Product Quality: Excellent ✅";
    status.style.color = "green";
  } else if (index >= 60) {
    status.textContent = "Product Quality: Good ⚠️";
    status.style.color = "orange";
  } else {
    status.textContent = "Product Quality: Poor ❌";
    status.style.color = "red";
  }
}

// 📦 EXPORT TO CSV
function exportCSV() {
  if (logEntries.length === 0) {
    showToast("No data to export", "error");
    return;
  }

  let csv = "Type,Weight,Size,Quality Index,Time\n";
  logEntries.forEach(entry => {
    csv += `${entry.type},${entry.weight},${entry.size},${entry.index},${entry.time}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quality_log.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 🔔 TOAST NOTIFICATION
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.backgroundColor = type === "error" ? "#dc2626" : "#06b6d4";
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// 🗃️ LOG ENTRIES
const logEntries = [];
function logData(type, weight, size, index) {
  logEntries.push({
    type,
    weight,
    size,
    index,
    time: new Date().toLocaleString()
  });
}