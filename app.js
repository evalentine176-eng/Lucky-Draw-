const state = { digits: ["0","0","0"], position: 0, wallet: null };

const $ = id => document.getElementById(id);
function renderNumber(){
  $("digit1").textContent = state.digits[0];
  $("digit2").textContent = state.digits[1];
  $("digit3").textContent = state.digits[2];
}
function setStatus(message, ok=false){
  $("status").textContent = message;
  $("status").style.color = ok ? "#16803b" : "#82768f";
}

document.querySelectorAll("[data-digit]").forEach(btn => {
  btn.addEventListener("click", () => {
    if(state.position >= 3) return;
    state.digits[state.position++] = btn.dataset.digit;
    renderNumber();
  });
});
$("clearBtn").addEventListener("click", () => {
  state.digits = ["0","0","0"]; state.position = 0; renderNumber();
});
$("randomBtn").addEventListener("click", () => {
  const n = Math.floor(Math.random()*1000).toString().padStart(3,"0");
  state.digits = n.split(""); state.position = 3; renderNumber();
});

function shortAddress(a){ return a ? `${a.slice(0,6)}…${a.slice(-4)}` : "Not connected"; }

async function connectMiniPay(){
  if(!window.ethereum){
    $("walletBadge").textContent = "Open in MiniPay";
    setStatus("Wallet provider not detected. Open this app inside MiniPay.");
    return;
  }
  try{
    const accounts = await window.ethereum.request({method:"eth_accounts"});
    if(accounts && accounts[0]){
      state.wallet = accounts[0];
      $("walletBadge").textContent = shortAddress(accounts[0]);
      $("ticketWallet").textContent = shortAddress(accounts[0]);
      setStatus("MiniPay wallet detected.", true);
    }else{
      $("walletBadge").textContent = "MiniPay";
      setStatus("MiniPay detected. Wallet account is not exposed yet.");
    }
  }catch(e){
    setStatus("Could not read the MiniPay wallet.");
  }
}

function createDemoTicket(){
  const number = state.digits.join("");
  $("ticketNumber").textContent = number;
  $("ticketId").textContent = "LD-" + Date.now().toString().slice(-6);
  $("ticketWallet").textContent = shortAddress(state.wallet);
  $("ticketCard").classList.remove("hidden");
  setStatus("Demo ticket created. No real funds were moved.", true);
  $("ticketCard").scrollIntoView({behavior:"smooth",block:"center"});
}

$("enterBtn").addEventListener("click", () => {
  createDemoTicket();
});

function nextSaturday8pm(){
  const now = new Date();
  const d = new Date(now);
  const days = (6 - now.getDay() + 7) % 7;
  d.setDate(now.getDate() + (days === 0 && now.getHours() >= 20 ? 7 : days));
  d.setHours(20,0,0,0);
  return d;
}
function updateCountdown(){
  const target = nextSaturday8pm();
  const diff = Math.max(0,target-Date.now());
  const h = Math.floor(diff/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  $("countdown").textContent = `${h}h ${m}m ${s}s`;
}
setInterval(updateCountdown,1000); updateCountdown();
renderNumber();
connectMiniPay();
