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

/// Afficher les détails du match
function afficherDetails(matchNumber) {
    document.querySelector(`.match-details-${matchNumber}`).classList.add("active");
}

// Fermer les détails du match
function fermerDetails(matchNumber) {
    document.querySelector(`.match-details-${matchNumber}`).classList.remove("active");
}

let coins = 500; // Nombre de coins du joueur
let parisEffectues = []; // Liste pour stocker les paris effectués

// Fonction pour simuler un match de 20 secondes
function simulerMatch() {
    let status = document.getElementById("status");
    let simulationBloc = document.getElementById("simulation-bloc");
    let matchInfo = document.getElementById("match-info");
    let scoreElement = document.getElementById("score");
    let resultatDiv = document.getElementById("resultat");
    let tempsElement = document.getElementById("temps");
    let relancerBtn = document.getElementById("relancer-btn");

    // Affiche le bloc de simulation
    simulationBloc.style.display = "block";
    status.textContent = "Simulation en cours...";

    // Initialisation des scores et du temps
    let scorePSG = 0;
    let scoreOM = 0;
    let scoreRMA = 0;
    let scoreBarca = 0;
    let temps = 0;

    // Limite réaliste des buts
    let maxButsParEquipe = 3;

    // Délai entre chaque mise à jour (20 secondes pour 90 minutes)
    let interval = setInterval(() => {
        temps++;
        tempsElement.textContent = `Temps: ${temps} sec`;  // Affiche le temps en secondes

        // Probabilités de marquer pour chaque équipe à chaque seconde
        if (Math.random() < 0.1 && scorePSG < maxButsParEquipe) {  // 10% de chance de marquer
            scorePSG++;
        }
        if (Math.random() < 0.1 && scoreOM < maxButsParEquipe) {
            scoreOM++;
        }
        if (Math.random() < 0.1 && scoreRMA < maxButsParEquipe) {
            scoreRMA++;
        }
        if (Math.random() < 0.1 && scoreBarca < maxButsParEquipe) {
            scoreBarca++;
        }

        // Mise à jour du score à chaque seconde
        scoreElement.textContent = `Score: PSG ${scorePSG} - ${scoreOM} OM | Real Madrid ${scoreRMA} - ${scoreBarca} Barça`;

        // Si 20 secondes sont écoulées, on arrête la simulation
        if (temps >= 20) {
            clearInterval(interval);
            terminerSimulation(scorePSG, scoreOM, scoreRMA, scoreBarca);
        }
    }, 1000); // Mise à jour toutes les secondes
}

// Affiche les résultats du match
function terminerSimulation(scorePSG, scoreOM, scoreRMA, scoreBarca) {
    let resultatDiv = document.getElementById("resultat");
    let status = document.getElementById("status");

    // Affiche les scores finaux
    resultatDiv.innerHTML = `
        <p>PSG ${scorePSG} - ${scoreOM} OM</p>
        <p>Real Madrid ${scoreRMA} - ${scoreBarca} Barça</p>
    `;

    // Vérification des paris effectués et calcul des gains/pertes
    parisEffectues.forEach(pari => {
        let gain = 0;
        let resultatMatch = "";

        if (pari.match === "PSG vs OM") {
            if ((scorePSG > scoreOM && pari.equipe === "PSG") ||
                (scorePSG === scoreOM && pari.equipe === "Match Nul") ||
                (scoreOM > scorePSG && pari.equipe === "OM")) {
                gain = pari.mise * pari.cote;
                resultatMatch = "gagné";
            } else {
                resultatMatch = "perdu";
            }
        }

        if (pari.match === "Real Madrid vs Barça") {
            if ((scoreRMA > scoreBarca && pari.equipe === "Real Madrid") ||
                (scoreRMA === scoreBarca && pari.equipe === "Match Nul") ||
                (scoreBarca > scoreRMA && pari.equipe === "Barça")) {
                gain = pari.mise * pari.cote;
                resultatMatch = "gagné";
            } else {
                resultatMatch = "perdu";
            }
        }

        // Affichage des résultats des paris
        let listeParis = document.getElementById("liste-paris");
        let pariResultat = document.createElement("li");
        pariResultat.textContent = `Pari sur ${pari.equipe} - Mise: ${pari.mise} coins - Résultat: ${resultatMatch} - Gain: ${gain.toFixed(2)} coins`;
        listeParis.appendChild(pariResultat);

        // Ajout des gains ou pertes
        if (resultatMatch === "gagné") {
            coins += gain;
        } else {
            coins -= pari.mise;
        }
    });

    status.textContent = "Simulation terminée !";

    // Affichage du bouton de relance
    let relancerBtn = document.getElementById("relancer-btn");
    relancerBtn.style.display = "block";  // Afficher le bouton pour relancer la simulation
}

// Fonction pour relancer la simulation
function relancerSimulation() {
    // Réinitialiser l'affichage
    document.getElementById("resultat").innerHTML = "";
    document.getElementById("status").textContent = "Cliquez sur un pari pour lancer la simulation";
    document.getElementById("simulation-bloc").style.display = "none";  // Cacher le bloc de simulation
    document.getElementById("temps").textContent = "Temps: 0 sec";  // Réinitialiser le temps
    document.getElementById("score").textContent = "Score: 0 - 0 | 0 - 0";  // Réinitialiser le score
    document.getElementById("relancer-btn").style.display = "none";  // Cacher le bouton de relance

    // Relancer la simulation
    simulerMatch();
}

// Fonction pour placer un pari
function placerPari(equipe, cote) {
    let mise = prompt(`Tu as ${coins} coins. Combien veux-tu miser sur ${equipe} ?`);
    mise = parseInt(mise);

    if (isNaN(mise) || mise <= 0) {
        alert("Montant invalide !");
        return;
    }

    if (mise > coins) {
        alert("Tu n'as pas assez de coins !");
        return;
    }

    coins -= mise;
    let gainPotentiel = (mise * cote).toFixed(2);

    // Ajout du pari à la liste des paris effectués
    parisEffectues.push({
        match: equipe.includes("PSG") ? "PSG vs OM" : "Real Madrid vs Barça", 
        equipe: equipe, 
        mise: mise, 
        cote: cote
    });

    let listeParis = document.getElementById("liste-paris");
    let pari = document.createElement("li");
    pari.textContent = `Pari sur ${equipe} - Mise: ${mise} coins - Gain potentiel: ${gainPotentiel} coins`;

    listeParis.appendChild(pari);

    alert(`Pari placé sur ${equipe} !\nMise: ${mise} coins\nGain potentiel: ${gainPotentiel} coins`);
}
