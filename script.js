let ws;
let threshold = 60;

// LOGIN
function login() {
  if (
    document.getElementById("user").value === "admin" &&
    document.getElementById("pass").value === "1234"
  ) {
    document.getElementById("login").hidden = true;
    document.getElementById("dashboard").hidden = false;
    connectWS();
  } else {
    alert("Wrong credentials");
  }
}

// WEBSOCKET
function connectWS() {
  ws = new WebSocket(`ws://${location.hostname}:81`);

  ws.onmessage = (event) => {
    const db = parseFloat(event.data);
    updateUI(db);
    updateChart(db);
  };
}

// UI ELEMENTS
const dbText = document.getElementById("db");
const bar = document.getElementById("bar");
const slider = document.getElementById("slider");
const th = document.getElementById("th");

slider.oninput = () => {
  threshold = slider.value;
  th.innerText = threshold;
  ws.send(threshold);
};

// UI UPDATE
function updateUI(db) {
  dbText.innerText = db.toFixed(1);

  let percent = (db / 130) * 100;
  bar.style.width = percent + "%";

  if (db < threshold) {
    bar.style.background = "lime";
    bar.style.boxShadow = "0 0 20px lime";
  } else if (db < +threshold + 25) {
    bar.style.background = "yellow";
    bar.style.boxShadow = "0 0 20px yellow";
  } else {
    bar.style.background = "red";
    bar.style.boxShadow = "0 0 30px red";
  }
}

/* GRAPH */
const ctx = document.getElementById("chart").getContext("2d");
const data = {
  labels: [],
  datasets: [{
    label: "Noise Level (dB)",
    borderColor: "cyan",
    data: [],
    tension: 0.3
  }]
};

const chart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    animation: false,
    scales: {
      y: { min: 0, max: 130 }
    }
  }
});

function updateChart(db) {
  if (data.labels.length > 30) {
    data.labels.shift();
    data.datasets[0].data.shift();
  }
  data.labels.push("");
  data.datasets[0].data.push(db);
  chart.update();
}
