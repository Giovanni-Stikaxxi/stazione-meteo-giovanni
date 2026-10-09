const FIREBASE_URL =
"https://stazione-meteo-giovanni-default-rtdb.europe-west1.firebasedatabase.app";

let chart;

// ==========================
// DATI ATTUALI
// ==========================

async function aggiornaMeteo() {

    try {

        const response =
            await fetch(`${FIREBASE_URL}/meteo.json`);

        const data =
            await response.json();

        if (!data) return;

        document.getElementById("temp").innerHTML =
            `${data.temperature.toFixed(1)} °C`;

        document.getElementById("hum").innerHTML =
            `${data.humidity.toFixed(1)} %`;

        document.getElementById("press").innerHTML =
            `${data.pressure.toFixed(1)} hPa`;

    } catch (err) {

        console.error(err);

    }
}

// ==========================
// CARICAMENTO STORICO
// ==========================

async function caricaStoricoGiorno(data) {

    const response =
        await fetch(
            `${FIREBASE_URL}/storico/${data}.json`
        );

    return await response.json();

}

// ==========================
// ULTIME 48 ORE
// ==========================

async function mostra48h() {

    const labels = [];
    const temperature = [];

    const oggi = new Date();

    for (let i = 1; i >= 0; i--) {

        const giorno = new Date();

        giorno.setDate(
            oggi.getDate() - i
        );

        const dataString =
            giorno
            .toISOString()
            .split("T")[0];

        const storico =
            await caricaStoricoGiorno(
                dataString
            );

        if (!storico)
            continue;

        Object.values(storico)
            .forEach(record => {

                const ora =
                    new Date(
                        record.timestamp
                    )
                    .toLocaleString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                labels.push(ora);

                temperature.push(
                    record.temperature
                );

            });
    }

    disegnaGrafico(
        labels,
        temperature,
        "Temperatura ultime 48 ore"
    );
}

// ==========================
// ULTIMI 7 GIORNI
// ==========================

async function mostra7giorni() {

    const labels = [];
    const temperature = [];

    const oggi = new Date();

    for (let i = 6; i >= 0; i--) {

        const giorno = new Date();

        giorno.setDate(
            oggi.getDate() - i
        );

        const dataString =
            giorno
            .toISOString()
            .split("T")[0];

        const storico =
            await caricaStoricoGiorno(
                dataString
            );

        if (!storico)
            continue;

        const valori =
            Object.values(storico);

        if (valori.length === 0)
            continue;

        let somma = 0;

        valori.forEach(v => {

            somma +=
                v.temperature;

        });

        const media =
            somma / valori.length;

        labels.push(dataString);

        temperature.push(
            media.toFixed(1)
        );
    }

    disegnaGrafico(
        labels,
        temperature,
        "Temperatura media ultimi 7 giorni"
    );
}

// ==========================
// DISEGNO GRAFICO
// ==========================

function disegnaGrafico(
    labels,
    data,
    titolo
) {

    const ctx =
        document
        .getElementById("meteoChart");

    if (chart)
        chart.destroy();

    chart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: titolo,

                    data: data,

                    borderColor:
                        "#007aff",

                    backgroundColor:
                        "rgba(0,122,255,0.2)",

                    tension: 0.3,

                    fill: true

                }]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }

                }

            }

        });
}

// ==========================
// AVVIO
// ==========================

aggiornaMeteo();

setInterval(
    aggiornaMeteo,
    30000
);

mostra48h();
