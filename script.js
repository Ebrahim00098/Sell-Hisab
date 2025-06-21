const banglaMonths = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const banglaDays = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

function convertToBanglaNumber(number) {
  return number.toString().split('').map(n => n === '.' ? '.' : banglaDigits[n] || n).join('');
}

const now = new Date();
document.getElementById("currentMonth").innerText = banglaMonths[now.getMonth()];
document.getElementById("todayDate").innerText = `${convertToBanglaNumber(now.getDate())}/${convertToBanglaNumber(now.getMonth()+1)}/${convertToBanglaNumber(now.getFullYear())}`;
document.getElementById("todayDay").innerText = banglaDays[now.getDay()];

document.querySelector(".card2").addEventListener("click", () => {
  document.getElementById("addButton").style.display = "block";
});
document.getElementById("addButton").addEventListener("click", () => {
  document.getElementById("popupForm").style.display = "block";
});

function clearForm() {
  document.getElementById("productName").value = "";
  document.getElementById("saleAmount").value = "";
  document.getElementById("purchaseAmount").value = "";
  document.getElementById("receivedAmount").value = "";  // ✅ New
  document.getElementById("paymentMethod").value = "";
  document.getElementById("description").value = "";
  document.getElementById("popupForm").style.display = "none";
}

let allEntries = JSON.parse(localStorage.getItem("entries")) || [];

function saveToStorage() {
  localStorage.setItem("entries", JSON.stringify(allEntries));
}

function renderEntries(entries) {
  const container = document.getElementById("entriesContainer");
  container.innerHTML = "";
  entries.forEach((item, index) => {
    const html = `
      <div class="product-entry">
        <div>${item.product}</div>
        <div>৳${convertToBanglaNumber(item.sale.toFixed(1))}</div>
        <div>৳${convertToBanglaNumber(item.purchase.toFixed(1))}</div>
        <div>৳${convertToBanglaNumber((item.receive || 0).toFixed(1))}</div>
        <div>${item.description}</div>
        <div class="dropdown">
          <button class="dots-button">⋮</button>
          <div class="dropdown-content">
            <button onclick="editEntry(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delet</button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });

  // Event listener threes dots toggle
  document.querySelectorAll(".dots-button").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      document.querySelectorAll(".dropdown-content").forEach(d => {
        if (d !== dropdown) d.style.display = "none";
      });
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-content").forEach(d => d.style.display = "none");
  });
}
function updateSummary() {
  const month = now.getMonth();
  const entries = allEntries.filter(e => new Date(e.date).getMonth() === month);

  let totalPurchase = 0, totalSale = 0, totalProfit = 0, totalReceive = 0;
  entries.forEach(item => {
    const receive = item.receive || 0;
    totalPurchase += item.purchase || 0;
    totalSale += item.sale || 0;
    totalReceive += receive;
    
    // ✅ Updated profit calculation considering receiveAmount as expense:
    totalProfit += (item.sale - item.purchase - receive);
  });
  

document.getElementById("totalPurchase").textContent = `৳${convertToBanglaNumber(formatNumber(totalPurchase))}`;
document.getElementById("totalSale").textContent = `৳${convertToBanglaNumber(formatNumber(totalSale))}`;
document.getElementById("totalProfit").textContent = `৳${convertToBanglaNumber(formatNumber(totalProfit))}`;
document.getElementById("totalReceive").textContent = `৳${convertToBanglaNumber(formatNumber(totalReceive))}`;

document.getElementById("totalItems").textContent = `${convertToBanglaNumber(entries.length)} টি`;

document.getElementById("infoPurchase").textContent = `৳${convertToBanglaNumber(formatNumber(totalPurchase))}`;
document.getElementById("infoSale").textContent = `৳${convertToBanglaNumber(formatNumber(totalSale))}`;
document.getElementById("infoProfit").textContent = `৳${convertToBanglaNumber(formatNumber(totalProfit))}`;
}

function formatNumber(number) {
  const fixed = number.toFixed(1);
  return fixed.endsWith(".0") ? number.toFixed(0) : fixed;
}

function submitForm() {
  const product = document.getElementById("productName").value.trim();
  const sale = parseFloat(document.getElementById("saleAmount").value) || 0;
  const purchase = parseFloat(document.getElementById("purchaseAmount").value) || 0;
  const receive = parseFloat(document.getElementById("receivedAmount").value) || 0;
  const payment = document.getElementById("paymentMethod").value.trim() || "-";
  const description = document.getElementById("description").value.trim() || "-";

  if (!product) return alert("পণ্যের নাম দিন।");

  const entry = {
    product,
    sale,
    purchase,
    receive,
    payment,
    description,
    date: new Date().toISOString()
  };

  allEntries.push(entry);
  saveToStorage();
  renderEntries(allEntries);
  updateSummary();
  clearForm();
}

function editEntry(index) {
  const item = allEntries[index];
  document.getElementById("productName").value = item.product;
  document.getElementById("saleAmount").value = item.sale;
  document.getElementById("purchaseAmount").value = item.purchase;
  document.getElementById("receivedAmount").value = item.receive || 0;
  document.getElementById("paymentMethod").value = item.payment;
  document.getElementById("description").value = item.description;
  document.getElementById("popupForm").style.display = "block";

  document.querySelector(".submit").onclick = function () {
    item.product = document.getElementById("productName").value.trim();
    item.sale = parseFloat(document.getElementById("saleAmount").value) || 0;
    item.purchase = parseFloat(document.getElementById("purchaseAmount").value) || 0;
    item.receive = parseFloat(document.getElementById("receivedAmount").value) || 0;
    item.payment = document.getElementById("paymentMethod").value.trim();
    item.description = document.getElementById("description").value.trim();
    item.date = new Date().toISOString();

    allEntries[index] = item;
    saveToStorage();
    renderEntries(allEntries);
    updateSummary();
    clearForm();
  };
}

renderEntries(allEntries);
updateSummary();

// ✅ Toggle visibility of content below card2
const toggleCard2 = document.getElementById("infoCard");
const toggleContent = document.getElementById("toggleContent");

let isVisible = false;

toggleCard2.addEventListener("click", () => {
  isVisible = !isVisible;
  toggleContent.classList.toggle("active", isVisible);

  // Add Button এর ব্যবস্থা
  const addButton = document.getElementById("addButton");
  if (isVisible) {
    addButton.style.display = "block";
  } else {
    addButton.style.display = "none";
  }
});

function deleteEntry(index) {
  const confirmDelete = confirm("আপনি কি নিশ্চিতভাবে এই তথ্য মুছে ফেলতে চান?");
  if (confirmDelete) {
    allEntries.splice(index, 1); // ডিলিট করা
    saveToStorage();            // লোকাল স্টোরেজ আপডেট করো
    renderEntries(allEntries);  // তালিকা রেন্ডার করো
    updateSummary();            // উপরের সারাংশ আপডেট করো
  }
}

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = toggleDark.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
});

document.querySelectorAll('.tab div').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab div').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});




