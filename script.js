const FIREBASE_URL = "https://stazione-meteo-giovanni-default-rtdb.europe-west1.firebasedatabase.app/meteo.json";

async function aggiorna() {
    try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();

        document.getElementById("temp").innerText = data.temperature + " °C";
        document.getElementById("hum").innerText  = data.humidity + " %";
        document.getElementById("press").innerText = data.pressure + " hPa";

    } catch (e) {
        console.log("Errore:", e);
    }
}

setInterval(aggiorna, 5000);
aggiorna();
