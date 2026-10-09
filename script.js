// =====================================================
// FIREBASE
// =====================================================

const FIREBASE_BASE =
"https://stazione-meteo-giovanni-default-rtdb.europe-west1.firebasedatabase.app";

const URL_ATTUALE =
FIREBASE_BASE + "/meteo.json";

const URL_STORICO =
FIREBASE_BASE + "/storico.json";

// =====================================================
// GRAFICO
// =====================================================

let chart = null;

// =====================================================
// LETTURA STORICO
// =====================================================

async function caricaStorico() {

    try {

        const res = await fetch(URL_STORICO);
        const data = await res.json();

        if (!data) return [];

        let storico = [];

        Object.keys(data).forEach(giorno => {

            const records = data[giorno];

            Object.keys(records).forEach(key => {
                storico.push(records[key]);
            });

        });

        storico.sort((a, b) => a.timestamp - b.timestamp);

        return storico;

    } catch (err) {

        console.error(
            "Errore lettura storico:",
            err
        );

        return [];
    }
}

// =====================================================
// VALORI ATTUALI
// =====================================================

async function aggiornaValori() {

    try {

        const res = await fetch(URL_ATTUALE);
        const data = await res.json();

        if (!data) return;

        document.getElementById("temp").innerText =
            Number(data.temperature).toFixed(1) + " °C";

        document.getElementById("hum").innerText =
            Number(data.humidity).toFixed(1) + " %";

        document.getElementById("press").innerText =
            Number(data.pressure).toFixed(1) + " hPa";

        const lastUpdate =
            document.getElementById("lastUpdate");

        if (lastUpdate) {

            lastUpdate.innerText =
                (data.date || "") +
                " " +
                (data.time || "");

        }

    } catch (err) {

        console.error(
            "Errore lettura valori:",
            err
        );

    }
}

// =====================================================
// CREAZIONE GRAFICO
// =====================================================

async function creaGrafico(rangeOre) {

    const storico = await caricaStorico();

    if (storico.length === 0) {

        console.log("Nessun dato storico");

        return;
    }

    const cutoff =
        Date.now() -
        (rangeOre * 3600 * 1000);

    const filtrati =
        storico.filter(
            item => item.timestamp >= cutoff
        );

    if (filtrati.length === 0) {

        console.log("Nessun dato nel range");

        return;
    }

    const labels = filtrati.map(item => {

        return new Date(item.timestamp)
            .toLocaleString(
                "it-IT",
                {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    });

    const temperature =
        filtrati.map(
            item => item.temperature
        );

    const humidity =
        filtrati.map(
            item => item.humidity
        );

    const pressure =
        filtrati.map(
            item => item.pressure
        );

    if (chart) {
        chart.destroy();
    }

    const ctx =
        document.getElementById(
            "meteoChart"
        );

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "Temperatura (°C)",
                    data: temperature,
                    borderColor: "#ff3b30",
                    backgroundColor: "#ff3b30",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                },

                {
                    label: "Umidità (%)",
                    data: humidity,
                    borderColor: "#007aff",
                    backgroundColor: "#007aff",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                },

                {
                    label: "Pressione (hPa)",
                    data: pressure,
                    borderColor: "#34c759",
                    backgroundColor: "#34c759",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    display: true,
                    labels: {
                        boxWidth: 10,
                        font: {
                            size: 11
                        }
                    }
                }

            },

            scales: {

                x: {

                    ticks: {
                        maxRotation: 0,
                        font: {
                            size: 10
                        }
                    }

                },

                y: {

                    ticks: {
                        font: {
                            size: 10
                        }
                    }

                }

            }

        }

    });
}

// =====================================================
// PULSANTI
// =====================================================

function mostra48h() {
    creaGrafico(48);
}

function mostra7giorni() {
    creaGrafico(24 * 7);
}

// =====================================================
// AVVIO
// =====================================================

aggiornaValori();

setInterval(
    aggiornaValori,
    5000
);

creaGrafico(48);
