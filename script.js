<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Stazione Meteo Giovanni</title>

<!-- Icona app -->
<link rel="apple-touch-icon" href="apple-touch-icon.png">

<!-- Modalità app a schermo intero su iPhone -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<style>
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background: #f2f2f7;
        text-align: center;
        padding-top: 20px;
    }

    h1 {
        font-size: 26px;
        margin-bottom: 10px;
    }

    .card {
        background: white;
        margin: 15px auto;
        padding: 20px;
        width: 80%;
        max-width: 350px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .value {
        font-size: 36px;
        font-weight: 600;
        margin-top: 10px;
    }

    .label {
        font-size: 18px;
        color: #666;
    }

    button {
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 10px;
        background: #007aff;
        color: white;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover {
        background: #005fcc;
    }
</style>
</head>

<body>

<h1>Stazione Meteo Giovanni</h1>

<!-- Valori attuali -->
<div class="card">
    <div class="label">Temperatura</div>
    <div id="temp" class="value">-- °C</div>
</div>

<div class="card">
    <div class="label">Umidità</div>
    <div id="hum" class="value">-- %</div>
</div>

<div class="card">
    <div class="label">Pressione</div>
    <div id="press" class="value">-- hPa</div>
</div>

<!-- Pulsanti grafici -->
<h2>Andamento Meteo</h2>

<div>
    <button onclick="mostra48h()">Ultime 48 ore</button>
    <button onclick="mostra7giorni()">Ultima settimana</button>
</div>

<!-- Grafico unico -->
<canvas id="meteoChart" width="400" height="250"></canvas>

<!-- Libreria grafici -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Script principale -->
<script src="script.js"></script>

</body>
</html>
