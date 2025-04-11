let secondsLeft = 3 * 60 * 60; // 3 horas

function formatTime(secs) {
  const hours = String(Math.floor(secs / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const seconds = String(secs % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function updateCountdown() {
  if (secondsLeft <= 0) return;
  secondsLeft--;
  document.getElementById("countdown").textContent = formatTime(secondsLeft);
}

function toggleVisibility() {
  const container = document.getElementById("reservaContainer");
  const showBtn = document.getElementById("showButton");
  container.classList.toggle("hidden");
  showBtn.classList.toggle("hidden");
}

setInterval(updateCountdown, 1000);
