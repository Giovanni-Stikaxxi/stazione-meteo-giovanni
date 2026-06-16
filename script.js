const FIREBASE_BASE =
  "https://stazione-meteo-giovanni-default-rtdb.europe-west1.firebasedatabase.app";

// URL valori attuali
const URL_ATTUALE = FIREBASE_BASE + "/meteo.json";

// URL storico
const URL_STORICO = FIREBASE_BASE + "/storico.json";

// Grafico
let chart;

// Carica storico da Firebase
async function caricaStorico() {
  const res = await fetch(URL_STORICO);
  const data = await res.json();

  if (!data) return [];

  // Converti oggetti Firebase in array ordinato
  const arr = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);

  return arr;
}

// Aggiorna valori attuali
async function aggiornaValori() {
  try {
    const res = await fetch(URL_ATTUALE);
    const data = await res.json();

    document.getElementById("temp").innerText = data.temperature + " °C";
    document.getElementById("hum").innerText = data.humidity + " %";
    document.getElementById("press").innerText = data.pressure + " hPa";
  } catch (e) {
    console.log("Errore lettura valori:", e);
  }
}

// Crea grafico
async function creaGrafico(rangeOre) {
  const storico = await caricaStorico();
  if (storico.length === 0) return;

  const cutoff = Date.now() - rangeOre * 3600 * 1000;

  const filtrati = storico.filter((p) => p.timestamp >= cutoff);

  const labels = filtrati.map((p) =>
    new Date(p.timestamp).toLocaleString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    })
  );

  const temp = filtrati.map((p) => p.temperature);
  const hum = filtrati.map((p) => p.humidity);
  const press = filtrati.map((p) => p.pressure);

  if (chart) chart.destroy();

  const ctx = document.getElementById("meteoChart");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperatura (°C)",
          data: temp,
          borderColor: "red",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Umidità (%)",
          data: hum,
          borderColor: "blue",
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "Pressione (hPa)",
          data: press,
          borderColor: "green",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      layout: { padding: 5 },
      plugins: {
        legend: {
          labels: { boxWidth: 10, font: { size: 11 } },
        },
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 0 } },
        y: { ticks: { font: { size: 10 } } },
      },
    },
  });
}

// Pulsanti
function mostra48h() {
  creaGrafico(48);
}

function mostra7giorni() {
  creaGrafico(24 * 7);
}

// Aggiornamento automatico valori
setInterval(aggiornaValori, 5000);
aggiornaValori();

// Carica grafico iniziale
creaGrafico(48);
