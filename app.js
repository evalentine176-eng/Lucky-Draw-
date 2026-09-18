 const state = {
  digits: ["0", "0", "0"],
  position: 0,
  wallet: null
};

const $ = (id) => document.getElementById(id);

function renderNumber() {
  $("digit1").textContent = state.digits[0];
  $("digit2").textContent = state.digits[1];
  $("digit3").textContent = state.digits[2];
}

function setStatus(message, ok = false) {
  const status = $("status");
  if (status) {
    status.textContent = message;
    status.style.color = ok ? "#16803b" : "#82768f";
  }
}

function shortAddress(address) {
  return address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "Not connected";
}

function getProvider() {
  if (window.ethereum) return window.ethereum;
  if (window.provider) return window.provider;
  return null;
}

async function connectMiniPay() {
  const provider = getProvider();

  if (!provider) {
    $("walletBadge").textContent = "MiniPay";
    setStatus("Wallet provider not detected. Open this app inside MiniPay.");
    return;
  }

  try {
    const accounts = await provider.request({
      method: "eth_accounts"
    });

    if (accounts && accounts[0]) {
      state.wallet = accounts[0];

      $("walletBadge").textContent = shortAddress(accounts[0]);
      $("ticketWallet").textContent = shortAddress(accounts[0]);

      setStatus("Wallet connected.", true);
    } else {
      $("walletBadge").textContent = "MiniPay";
      setStatus("MiniPay detected. Tap Connect Wallet.");
    }
  } catch (error) {
    setStatus("Could not read the wallet.");
  }
}

async function requestWalletConnection() {
  const provider = getProvider();

  if (!provider) {
    $("walletBadge").textContent = "MiniPay";
    setStatus("Please open this app inside MiniPay.");
    return;
  }

  try {
    const accounts = await provider.request({
      method: "eth_requestAccounts"
    });

    if (accounts && accounts[0]) {
      state.wallet = accounts[0];

      $("walletBadge").textContent = shortAddress(accounts[0]);
      $("ticketWallet").textContent = shortAddress(accounts[0]);

      setStatus("Wallet connected successfully.", true);
    }
  } catch (error) {
    setStatus("Wallet connection was cancelled.");
  }
}

document.querySelectorAll("[data-digit]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.position >= 3) return;

    state.digits[state.position] = button.dataset.digit;
    state.position++;

    renderNumber();
  });
});

$("clearBtn").addEventListener("click", () => {
  state.digits = ["0", "0", "0"];
  state.position = 0;
  renderNumber();
  setStatus("Number cleared.");
});

$("randomBtn").addEventListener("click", () => {
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  state.digits = number.split("");
  state.position = 3;

  renderNumber();
  setStatus("Random number selected.", true);
});

function createDemoTicket() {
  const number = state.digits.join("");

  $("ticketNumber").textContent = number;
  $("ticketId").textContent =
    "LD-" + Date.now().toString().slice(-6);

  $("ticketWallet").textContent = shortAddress(state.wallet);

  $("ticketCard").classList.remove("hidden");

  setStatus(
    "Demo ticket created. No real funds were moved.",
    true
  );

  $("ticketCard").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

$("enterBtn").addEventListener("click", () => {
  createDemoTicket();
});

$("connectBtn").addEventListener("click", () => {
  requestWalletConnection();
});

function nextSaturday8pm() {
  const now = new Date();
  const target = new Date(now);

  const days =
    (6 - now.getDay() + 7) % 7;

  target.setDate(
    now.getDate() +
      (days === 0 && now.getHours() >= 20 ? 7 : days)
  );

  target.setHours(20, 0, 0, 0);

  return target;
}

function updateCountdown() {
  const target = nextSaturday8pm();
  const difference = Math.max(
    0,
    target.getTime() - Date.now()
  );

  const hours = Math.floor(
    difference / 3600000
  );

  const minutes = Math.floor(
    (difference % 3600000) / 60000
  );

  const seconds = Math.floor(
    (difference % 60000) / 1000
  );

  $("countdown").textContent =
    `${hours}h ${minutes}m ${seconds}s`;
}

renderNumber();
updateCountdown();
setInterval(updateCountdown, 1000);
connectMiniPay();
