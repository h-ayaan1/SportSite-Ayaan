function afficherDetailsMatch(equipe1, logo1, equipe2, logo2, score1, score2, buteurs1, buteurs2) {
    document.getElementById("team1-name").textContent = equipe1;
    document.getElementById("team1-logo").src = logo1;
    document.getElementById("team2-name").textContent = equipe2;
    document.getElementById("team2-logo").src = logo2;
    document.getElementById("score-display").textContent = score1 + " - " + score2;
    document.getElementById("buteurs-equipe1").textContent = buteurs1 ? buteurs1 : "Aucun buteur";
    document.getElementById("buteurs-equipe2").textContent = buteurs2 ? buteurs2 : "Aucun buteur";
    document.getElementById("match-details").classList.add("active");
}

function afficherDetails(matchNumber) {
    document.querySelector(`.match-details-${matchNumber}`).classList.add("active");
}

function fermerDetails(matchNumber) {
    document.querySelector(`.match-details-${matchNumber}`).classList.remove("active");
}

let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 500;
let lastLogin = localStorage.getItem("lastLogin") ? new Date(localStorage.getItem("lastLogin")) : new Date(0);
let today = new Date();
let parisEffectues = [];
let simulationEnCours = false;
let simulationTerminee = false;

if (today.toDateString() !== lastLogin.toDateString()) {
    coins += 500;
    localStorage.setItem("lastLogin", today);
    localStorage.setItem("coins", coins);
}

// Fonction pour simuler un match de 20 secondes
function simulerMatch() {
    if (simulationEnCours || (!simulationTerminee && parisEffectues.length === 0)) return;
    simulationEnCours = true;
    simulationTerminee = false;
    let status = document.getElementById("status");
    let simulationBloc = document.getElementById("simulation-bloc");
    let scoreElement = document.getElementById("score");
    let resultatDiv = document.getElementById("resultat");
    let tempsElement = document.getElementById("temps");

    simulationBloc.style.display = "block";
    status.textContent = "Simulation en cours...";
    resultatDiv.innerHTML = "";

    let scores = {
        "PSG vs OM": [0, 0],
        "Real Madrid vs Barça": [0, 0],
        "Chelsea vs Man City": [0, 0],
        "Bayern vs Dortmund": [0, 0]
    };

    let maxButsParEquipe = 5;
    let temps = 0;

    let interval = setInterval(() => {
        temps++;
        tempsElement.textContent = `Temps: ${temps} sec`;

        Object.keys(scores).forEach(match => {
            if (Math.random() < 0.1 && scores[match][0] < maxButsParEquipe) {
                scores[match][0]++;
            }
            if (Math.random() < 0.1 && scores[match][1] < maxButsParEquipe) {
                scores[match][1]++;
            }
        });

        scoreElement.innerHTML = `
            PSG ${scores["PSG vs OM"][0]} - ${scores["PSG vs OM"][1]} OM | 
            RMA ${scores["Real Madrid vs Barça"][0]} - ${scores["Real Madrid vs Barça"][1]} Barça | 
            Chelsea ${scores["Chelsea vs Man City"][0]} - ${scores["Chelsea vs Man City"][1]} Man City | 
            Bayern ${scores["Bayern vs Dortmund"][0]} - ${scores["Bayern vs Dortmund"][1]} Dortmund
        `;

        if (temps >= 20) {
            clearInterval(interval);
            terminerSimulation(scores);
        }
    }, 1000);
}

function terminerSimulation(scores) {
    let resultatDiv = document.getElementById("resultat");
    let status = document.getElementById("status");
    let listeParis = document.getElementById("liste-paris");
    
    resultatDiv.innerHTML = "";
    Object.keys(scores).forEach(match => {
        let [score1, score2] = scores[match];
        resultatDiv.innerHTML += `<p>${match}: ${score1} - ${score2}</p>`;
    });

    parisEffectues.forEach(pari => {
        let gain = 0;
        let resultatMatch = "perdu";
        let [score1, score2] = scores[pari.match];

        if ((score1 > score2 && pari.equipe.includes(pari.match.split(" vs ")[0])) ||
            (score1 === score2 && pari.equipe === "Match Nul") ||
            (score2 > score1 && pari.equipe.includes(pari.match.split(" vs ")[1]))) {
            gain = pari.mise * pari.cote;
            resultatMatch = "gagné";
        }

        let pariResultat = document.createElement("li");
        pariResultat.textContent = `Pari sur ${pari.equipe} - Mise: ${pari.mise} coins - Résultat: ${resultatMatch} - Gain: ${gain.toFixed(2)} coins`;
        listeParis.appendChild(pariResultat);

        if (resultatMatch === "gagné") {
            coins += gain;
        }
    });

    localStorage.setItem("coins", coins);
    status.innerHTML = '<button onclick="resetSimulation()">Réinitialiser</button>';
    simulationEnCours = false;
    simulationTerminee = true;
}

function resetSimulation() {
    document.getElementById("simulation-bloc").style.display = "none";
    document.getElementById("score").innerHTML = "Score: 0 - 0";
    document.getElementById("temps").textContent = "Temps: 0s";
    parisEffectues = [];
    simulationTerminee = false;
    document.getElementById("status").textContent = 'Cliquez sur un pari pour lancer la simulation';
}

function placerPari(equipe, cote) {
    let mise = prompt(`Tu as ${coins} coins. Combien veux-tu miser sur ${equipe} ?`);
    mise = parseInt(mise);

    if (isNaN(mise) || mise <= 0 || mise > coins) {
        alert("Montant invalide ou insuffisant !");
        return;
    }

    coins -= mise;
    localStorage.setItem("coins", coins);
    let gainPotentiel = (mise * cote).toFixed(2);
    
    let match = "";
    if (equipe.includes("PSG") || equipe.includes("OM")) match = "PSG vs OM";
    else if (equipe.includes("Real Madrid") || equipe.includes("Barça")) match = "Real Madrid vs Barça";
    else if (equipe.includes("Chelsea") || equipe.includes("Man City")) match = "Chelsea vs Man City";
    else if (equipe.includes("Bayern") || equipe.includes("Dortmund")) match = "Bayern vs Dortmund";

    parisEffectues.push({ match, equipe, mise, cote });

    let listeParis = document.getElementById("liste-paris");
    let pari = document.createElement("li");
    pari.textContent = `Pari sur ${equipe} - Mise: ${mise} coins - Gain potentiel: ${gainPotentiel} coins`;
    listeParis.appendChild(pari);

    alert(`Pari placé sur ${equipe} !\nMise: ${mise} coins\nGain potentiel: ${gainPotentiel} coins`);
}
