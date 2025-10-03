// Enhanced finance tracker with dark mode toggle
const STORAGE_KEY = "simple_finance_v2";
const THEME_KEY = "finance_theme_v1";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const entryForm = document.getElementById("entryForm");
const typeEl = document.getElementById("type");
const descEl = document.getElementById("desc");
const categoryEl = document.getElementById("category");
const amountEl = document.getElementById("amount");
const dateEl = document.getElementById("date");
const txTableBody = document.querySelector("#txTable tbody");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const filterStart = document.getElementById("filterStart");
const filterEnd = document.getElementById("filterEnd");
const filterCategory = document.getElementById("filterCategory");
const applyFilter = document.getElementById("applyFilter");
const resetFilter = document.getElementById("resetFilter");

const installBtn = document.getElementById("installBtn");
const themeToggle = document.getElementById("themeToggle");
let deferredPrompt = null;

// Theme handling
function applyTheme(theme){
  if(theme === "dark"){
    document.documentElement.setAttribute("data-theme","dark");
    themeToggle.textContent = "Mode Terang";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "Mode Gelap";
  }
  try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
}

(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if(saved){ applyTheme(saved); return; }
  // prefer system setting if user hasn't chosen
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? "dark" : "light");
})();

themeToggle.addEventListener("click", ()=>{
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(cur === "dark" ? "light" : "dark");
});

// Helpers
function formatRp(num){
  let n = Number(num) || 0;
  return "Rp " + n.toLocaleString('id-ID');
}
function parseAmount(str){
  const cleaned = String(str).replace(/[^\d\-]/g,'');
  return Number(cleaned) || 0;
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function filterEntries(list){
  let res = list.slice();
  if(filterStart.value){
    res = res.filter(e => (e.date || "") >= filterStart.value);
  }
  if(filterEnd.value){
    res = res.filter(e => (e.date || "") <= filterEnd.value);
  }
  if(filterCategory.value){
    res = res.filter(e => (e.category || "") === filterCategory.value);
  }
  return res;
}

function render(){
  txTableBody.innerHTML = "";
  let income = 0, expense = 0;
  const list = filterEntries(entries).slice().reverse();
  list.forEach((e, idx) => {
    const tr = document.createElement("tr");
    const tdate = e.date || "";
    const tdesc = e.desc || "";
    const tcat = e.category || "";
    const tamount = Number(e.amount) || 0;
    const ttype = e.type || "income";

    const d0 = document.createElement("td"); d0.textContent = tdate;
    const d1 = document.createElement("td"); d1.textContent = tdesc;
    const dcat = document.createElement("td"); dcat.textContent = tcat;
    const d2 = document.createElement("td"); d2.textContent = (ttype=="income")?"Pendapatan":"Pengeluaran";
    d2.className = ttype=="income"?"type-income":"type-expense";
    const d3 = document.createElement("td"); d3.textContent = formatRp(Math.abs(tamount));
    const d4 = document.createElement("td");
    const delBtn = document.createElement("button"); delBtn.textContent = "Hapus"; delBtn.className="btn";
    delBtn.onclick = () => {
      const target = list[idx];
      const ri = entries.findIndex(x => x === target);
      if(ri>=0 && confirm("Hapus transaksi ini?")){ entries.splice(ri,1); save(); render(); }
    };
    d4.appendChild(delBtn);

    tr.appendChild(d0); tr.appendChild(d1); tr.appendChild(dcat); tr.appendChild(d2); tr.appendChild(d3); tr.appendChild(d4);
    txTableBody.appendChild(tr);

    if(ttype=="income") income += tamount;
    else expense += tamount;
  });

  totalIncomeEl.textContent = formatRp(income);
  totalExpenseEl.textContent = formatRp(expense);
  balanceEl.textContent = formatRp(income - expense);
}

entryForm.addEventListener("submit", (ev)=>{
  ev.preventDefault();
  const type = typeEl.value;
  const desc = descEl.value.trim();
  const category = categoryEl.value || "Umum";
  const rawAmount = amountEl.value;
  const amount = Math.abs(parseAmount(rawAmount));
  const date = dateEl.value || new Date().toISOString().slice(0,10);
  if(!desc || !amount){ alert("Isi keterangan dan jumlah (nominal)."); return; }
  entries.push({type, desc, category, amount, date});
  save();
  render();
  entryForm.reset();
});

// live formatting for amount input
amountEl.addEventListener("input", (e)=>{
  const cleaned = String(amountEl.value).replace(/[^\d\-]/g,'');
  if(cleaned === ""){ amountEl.value = ""; return; }
  const num = Number(cleaned);
  amountEl.value = num.toLocaleString('id-ID');
  amountEl.selectionStart = amountEl.selectionEnd = amountEl.value.length;
});

clearBtn.addEventListener("click", ()=>{
  if(confirm("Kosongkan semua data?")){ entries=[]; save(); render(); }
});

exportBtn.addEventListener("click", ()=>{
  const data = JSON.stringify(entries, null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "finance-data.json"; a.click();
  URL.revokeObjectURL(url);
});

exportCsvBtn.addEventListener("click", ()=>{
  const header = ["date","desc","category","type","amount"];
  const rows = entries.map(e => [e.date, e.desc, e.category, e.type, e.amount]);
  const csv = [header, ...rows].map(r => r.map(v => '\"'+String(v).replace(/\"/g,'""')+'\"').join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "finance-data.csv"; a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", ()=> importFile.click());
importFile.addEventListener("change", (ev)=>{
  const f = ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(Array.isArray(data)){
        if(confirm("Ganti semua data dengan file import?")){
          entries = data.map(d => ({type:d.type||'income', desc:d.desc||'', category:d.category||'Umum', amount: Number(d.amount)||0, date:d.date||new Date().toISOString().slice(0,10)}));
          save(); render();
        }
      } else alert("Format file tidak sesuai.");
    } catch(err){ alert("Gagal membaca file: "+err.message); }
  };
  reader.readAsText(f);
});

applyFilter.addEventListener("click", ()=> render());
resetFilter.addEventListener("click", ()=>{ filterStart.value=''; filterEnd.value=''; filterCategory.value=''; render(); });

// PWA install handling
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  if(!deferredPrompt) return alert("Install prompt belum tersedia.");
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.style.display = 'none';
  alert('Pilihan: ' + choice.outcome);
});

// register service worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').then(()=> console.log('SW registered')).catch(()=>{});
}

// initial render
render();
