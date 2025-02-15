let coins = parseInt(localStorage.getItem("coins")) || 1000;
let lastBonusDate = localStorage.getItem("lastBonusDate");
let currentWinnings = 0;
let baseBet = 0;
let gameActive = false;
const gridSize = 5;

document.addEventListener("DOMContentLoaded", () => {
    checkDailyBonus();
    updateCoinDisplay();
});

function updateCoinDisplay() {
    document.getElementById("coin-count").innerText = coins;
    localStorage.setItem("coins", coins);
}

function checkDailyBonus() {
    let today = new Date().toISOString().split("T")[0];
    if (lastBonusDate !== today) {
        coins += 20;
        lastBonusDate = today;
        localStorage.setItem("lastBonusDate", today);
        updateCoinDisplay();
        document.getElementById("message").innerText = "🎁 Bonus quotidien : +20 coins !";
    }
}

function startGame() {
    let betAmount = parseInt(document.getElementById("bet-amount").value);
    let bombCount = parseInt(document.getElementById("bomb-count").value);

    if (betAmount > coins || betAmount < 10) {
        alert("Mise invalide !");
        return;
    }

    coins -= betAmount;
    baseBet = betAmount;
    updateCoinDisplay();
    document.getElementById("cashout-btn").disabled = false;
    currentWinnings = betAmount;
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
        cell.addEventListener("click", () => revealCell(cell, bombCount));
        grid.appendChild(cell);
    });

    document.getElementById("message").innerText = "💎 Clique sur les cases pour trouver des diamants !";
}

function getMultiplier(bombCount, revealedDiamonds) {
    return 1 + (bombCount * 0.04) + (revealedDiamonds * 0.15);
}

function revealCell(cell, bombCount) {
    if (!gameActive) return;

    if (cell.dataset.type === "bomb") {
        cell.innerHTML = "💣";
        cell.classList.add("bomb", "revealed");
        document.getElementById("message").innerText = "💥 BOOM ! Tu as tout perdu...";
        currentWinnings = 0;
        document.getElementById("cashout-btn").disabled = true;
        gameActive = false;
        setTimeout(startGame, 3000);
    } else {
        cell.innerHTML = "💎";
        cell.classList.add("diamond", "revealed");
        let revealedDiamonds = document.querySelectorAll(".diamond.revealed").length;
        let multiplier = getMultiplier(bombCount, revealedDiamonds);
        currentWinnings = Math.floor(baseBet * multiplier);
        document.getElementById("message").innerText = `💰 Gains potentiels : ${currentWinnings} coins`;
    }
}

function cashout() {
    if (!gameActive) return;
    coins += currentWinnings;
    updateCoinDisplay();
    document.getElementById("message").innerText = `✅ Tu as encaissé ${currentWinnings} coins !`;
    document.getElementById("cashout-btn").disabled = true;
    gameActive = false;
    setTimeout(startGame, 3000);
}
