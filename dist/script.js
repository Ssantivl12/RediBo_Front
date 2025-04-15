"use strict";
let secondsLeft = 3 * 60 * 60; // 3 horas
function formatTime(secs) {
    const hours = String(Math.floor(secs / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const seconds = String(secs % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}
function updateCountdown() {
    if (secondsLeft <= 0) {
        window.location.href = "cancelacion.html";
        return;
    }
    secondsLeft--;
    const countdown = document.getElementById("countdown");
    if (countdown) {
        countdown.textContent = formatTime(secondsLeft);
    }
}
function toggleVisibility() {
    const container = document.getElementById("reservaContainer");
    if (container)
        container.classList.toggle("hidden");
}
function redirigirACancelacion() {
    window.location.href = "cancelacion.html";
}
window.addEventListener("DOMContentLoaded", () => {
    const cancelBtn = document.getElementById("cancelar");
    const minimizeBtn = document.getElementById("minimize");
    if (cancelBtn)
        cancelBtn.addEventListener("click", redirigirACancelacion);
    if (minimizeBtn)
        minimizeBtn.addEventListener("click", toggleVisibility);
    setInterval(updateCountdown, 1000);
});
