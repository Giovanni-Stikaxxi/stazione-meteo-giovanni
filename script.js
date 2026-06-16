const FIREBASE_URL = "https://stazione-meteo-giovanni-default-rtdb.europe-west1.firebasedatabase.app/meteo.json";

// Storico 48 ore (96 punti)
let labels48 = [];
let temp48 = [];
let hum48 = [];
let press48 = [];

// Storico 7 giorni (336 punti)
let labels7 = [];
let temp7 = [];
let hum7 = [];
let press7 = [];

// Ultimo salvataggio
let lastSaveTime = 0;

// Grafico unico
const ctx = document.getElementById("meteoChart");
const meteoChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels48,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: temp48,
                borderColor: "red",
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: "Umidità (%)",
                data: hum48,
                borderColor: "blue",
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: "Pressione (hPa)",
                data: press48,
                borderColor: "green",
                borderWidth: 2,
                tension: 0.3
            }
        ]
    }
});

// Funzione per aggiornare i valori
async function aggiorna() {
    try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();

        // Aggiorna valori numerici
        document.getElementById("temp").innerText = data.temperature + " °C";
        document.getElementById("hum").innerText  = data.humidity + " %";
        document.getElementById("press").innerText = data.pressure + " hPa";

        const now = Date.now();

        // Registra un punto ogni 30 minuti
        if (now - lastSaveTime >= 1800000) {
            lastSaveTime = now;

            const timeLabel = new Date().toLocaleString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });

            // --- 48 ORE ---
            labels48.push(timeLabel);
            temp48.push(data.temperature);
            hum48.push(data.humidity);
            press48.push(data.pressure);

            if (labels48.length > 96) {
                labels48.shift();
                temp48.shift();
                hum48.shift();
                press48.shift();
            }

            // --- 7 GIORNI ---
            labels7.push(timeLabel);
            temp7.push(data.temperature);
            hum7.push(data.humidity);
            press7.push(data.pressure);

            if (labels7.length > 336) {
                labels7.shift();
                temp7.shift();
                hum7.shift();
                press7.shift();
            }
        }

    } catch (e) {
        console.log("Errore:", e);
    }
}

setInterval(aggiorna, 5000);
aggiorna();

// --- Pulsanti ---
function mostra48h() {
    meteoChart.data.labels = labels48;
    meteoChart.data.datasets[0].data = temp48;
    meteoChart.data.datasets[1].data = hum48;
    meteoChart.data.datasets[2].data = press48;
    meteoChart.update();
}

function mostra7giorni() {
    meteoChart.data.labels = labels7;
    meteoChart.data.datasets[0].data = temp7;
    meteoChart.data.datasets[1].data = hum7;
    meteoChart.data.datasets[2].data = press7;
    meteoChart.update();
}
