// Sample store data (replace with back-end API later)
const stores = [
    { id: 1, name: "Grocery Mart", items: ["Milk", "Bread", "Eggs"] },
    { id: 2, name: "Pharmacy Plus", items: ["Aspirin", "Bandages", "Vitamins"] }
];

// Populate stores
document.addEventListener("DOMContentLoaded", () => {
    const storeList = document.getElementById("store-list");
    const storeSelect = document.getElementById("store-select");

    stores.forEach(store => {
        // Store cards
        const card = document.createElement("div");
        card.className = "col-md-4 mb-3";
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${store.name}</h5>
                    <p class="card-text">Items: ${store.items.join(", ")}</p>
                </div>
            </div>
        `;
        storeList.appendChild(card);

        // Store dropdown
        const option = document.createElement("option");
        option.value = store.id;
        option.textContent = store.name;
        storeSelect.appendChild(option);
    });
});

// Handle order submission
document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const storeId = document.getElementById("store-select").value;
    const items = document.getElementById("items").value.split("\n").filter(i => i.trim());
    const customRequest = document.getElementById("custom-request").value;
    const ecoFriendly = document.getElementById("eco-friendly").checked;

    // Generate reference number (simplified for demo)
    const referenceNumber = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Display result
    document.getElementById("order-result").innerHTML = `
        <div class="alert alert-success">
            <h4>Order Placed!</h4>
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Store:</strong> ${stores.find(s => s.id == storeId).name}</p>
            <p><strong>Items:</strong> ${items.join(", ")}</p>
            ${customRequest ? `<p><strong>Custom Request:</strong> ${customRequest}</p>` : ""}
            <p><strong>Eco-Friendly:</strong> ${ecoFriendly ? "Yes" : "No"}</p>
            <p>Use this reference number to track your order below!</p>
            <p><strong>Payment:</strong> Choose an option: 
                <button class="btn btn-sm btn-outline-primary" onclick="alert('MoMo Payment Link Sent!')">MoMo</button>
                <button class="btn btn-sm btn-outline-primary" onclick="alert('Scan QR Code on Your Device')">QR Code</button>
                <button class="btn btn-sm btn-outline-primary" onclick="alert('Enter ${referenceNumber} Manually')">Order Number</button>
            </p>
        </div>
    `;

    // Start status updates (simulated)
    updateOrderStatus(referenceNumber);
});

// Track order
document.getElementById("track-btn").addEventListener("click", () => {
    const refNum = document.getElementById("track-input").value.trim();
    if (refNum) {
        const trackResult = document.getElementById("track-result");
        trackResult.style.display = "block";
        trackResult.innerHTML = `
            <h5>Tracking: ${refNum}</h5>
            <p>Status: <span id="status-${refNum}">Order Received</span></p>
            <p>Check back for live updates!</p>
        `;
    }
});

// Simulate real-time status updates
function updateOrderStatus(referenceNumber) {
    const statuses = ["Order Received", "Shopping in Progress", "Out for Delivery", "Delivered"];
    let index = 0;
    const interval = setInterval(() => {
        if (index < statuses.length) {
            const statusElement = document.getElementById(`status-${referenceNumber}`);
            if (statusElement) statusElement.textContent = statuses[index];
            index++;
        } else {
            clearInterval(interval);
        }
    }, 2000); // Updates every 2 seconds for demo
}

// Smart Reorder (placeholder - requires back-end for full functionality)
function smartReorder(referenceNumber) {
    alert(`Reordering based on ${referenceNumber} - feature coming soon!`);
}
