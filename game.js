let coins = 1000;
let currentWinnings = 0;
let gameActive = false;
const gridSize = 5;

function startGame() {
    let betAmount = parseInt(document.getElementById("bet-amount").value);
    let bombCount = parseInt(document.getElementById("bomb-count").value);

    if (betAmount > coins || betAmount < 10) {
        alert("Mise invalide !");
        return;
    }

    coins -= betAmount;
    document.getElementById("coin-count").innerText = coins;
    document.getElementById("cashout-btn").disabled = false;
    currentWinnings = 0;
    gameActive = true;

    let grid = document.getElementById("game-grid");
    grid.innerHTML = "";
    
    let cells = Array(gridSize * gridSize).fill("diamond");
    let bombPositions = new Set();

    while (bombPositions.size < bombCount) {
        let pos = Math.floor(Math.random() * cells.length);
        bombPositions.add(pos);
    }

    bombPositions.forEach(pos => cells[pos] = "bomb");

    cells.forEach((type, index) => {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.type = type;
        cell.dataset.index = index;
        cell.addEventListener("click", () => revealCell(cell, betAmount, bombCount));
        grid.appendChild(cell);
    });

    document.getElementById("message").innerText = "Clique sur les cases pour gagner !";
}

function revealCell(cell, betAmount, bombCount) {
    if (!gameActive) return;

    if (cell.dataset.type === "bomb") {
        cell.innerHTML = "💣";
        cell.classList.add("bomb", "revealed");
        document.getElementById("message").innerText = "💥 BOOM ! Tu as tout perdu...";
        currentWinnings = 0;
        document.getElementById("cashout-btn").disabled = true;
        gameActive = false;
        setTimeout(startGame, 3000); // Réinitialisation après 3 secondes
    } else {
        cell.innerHTML = "💎";
        cell.classList.add("diamond", "revealed");
        let multiplier = 1 + (bombCount * 0.2);
        let winnings = Math.floor(betAmount * multiplier);
        currentWinnings += winnings;
        document.getElementById("message").innerText = `💰 Tu as ${currentWinnings} coins en attente !`;
    }
}

function cashout() {
    if (!gameActive) return;
    coins += currentWinnings;
    document.getElementById("coin-count").innerText = coins;
    document.getElementById("message").innerText = `✅ Tu as encaissé ${currentWinnings} coins !`;
    document.getElementById("cashout-btn").disabled = true;
    gameActive = false;
    setTimeout(startGame, 3000); // Réinitialisation après 3 secondes
}
