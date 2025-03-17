// Firebase Config (replace with your own Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Store data for Agona Swedru
const stores = [
    { id: 1, name: "Wiafesco", type: "Cosmetics Store", items: ["Creams", "Soaps", "Perfumes"] },
    { id: 2, name: "Geneviva Lodge", type: "Hotel", items: ["Room Booking", "Meals", "Drinks"] },
    { id: 3, name: "Maryking Super Market", type: "Market", items: ["Milk", "Bread", "Rice"] },
    { id: 4, name: "Chekin Pizza", type: "Fast Food", items: ["Pizza", "Drinks", "Sides"] }
];

// Populate stores after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const storeList = document.getElementById("store-list");
    const storeSelect = document.getElementById("store-select");

    if (!storeList || !storeSelect) {
        console.error("Error: store-list or store-select element not found in DOM.");
        return;
    }

    // Populate store cards
    stores.forEach(store => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${store.name}</h5>
                    <p class="card-text">${store.type} | Items: ${store.items.join(", ")}</p>
                </div>
            </div>
        `;
        storeList.appendChild(card);
    });

    // Populate store dropdown
    stores.forEach(store => {
        const option = document.createElement("option");
        option.value = store.id;
        option.textContent = store.name;
        storeSelect.appendChild(option);
    });

    // Log to confirm stores are added to dropdown
    console.log("Stores added to dropdown:", storeSelect.options);
});

// Handle order submission
document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const storeId = document.getElementById("store-select").value;
    const items = document.getElementById("items").value.split("\n").filter(i => i.trim());
    const customRequest = document.getElementById("custom-request").value;
    const ecoFriendly = document.getElementById("eco-friendly").checked;

    if (!storeId) {
        alert("Please select a store!");
        return;
    }

    const referenceNumber = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const order = {
        storeId,
        items,
        customRequest,
        ecoFriendly,
        referenceNumber,
        status: "Order Received",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        location: "Agona Swedru, Central Region, Ghana"
    };

    // Save to Firestore
    await db.collection("orders").doc(referenceNumber).set(order);

    // Notify admin and dispatcher
    notifyAdminAndDispatcher(referenceNumber, order);

    // Display result with payment options
    document.getElementById("order-result").innerHTML = `
        <div class="alert alert-success">
            <h4>Order Placed!</h4>
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Store:</strong> ${stores.find(s => s.id == storeId).name}</p>
            <p><strong>Items:</strong> ${items.join(", ")}</p>
            ${customRequest ? `<p><strong>Custom Request:</strong> ${customRequest}</p>` : ""}
            <p><strong>Eco-Friendly:</strong> ${ecoFriendly ? "Yes" : "No"}</p>
            <p><strong>Payment Options:</strong></p>
            <p><a href="YOUR_MOMO_LINK" target="_blank" class="btn btn-sm btn-outline-primary">Pay via MoMo Link</a></p>
            <p><img src="YOUR_QR_CODE_URL" alt="MoMo QR Code" style="width: 100px;"></p>
            <p>Or send to: <strong>+233 55 123 4567</strong> with reference ${referenceNumber}</p>
        </div>
    `;

    updateOrderStatus(referenceNumber);
});

// Track order
document.getElementById("track-btn").addEventListener("click", async () => {
    const refNum = document.getElementById("track-input").value.trim();
    if (refNum) {
        const doc = await db.collection("orders").doc(refNum).get();
        if (doc.exists) {
            const order = doc.data();
            const trackResult = document.getElementById("track-result");
            trackResult.style.display = "block";
            trackResult.innerHTML = `
                <h5>Tracking: ${refNum}</h5>
                <p>Status: <span id="status-${refNum}">${order.status}</span></p>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="smartReorder('${refNum}')">Reorder</button>
            `;
        } else {
            alert("Order not found!");
        }
    }
});

// Real-time status updates
function updateOrderStatus(referenceNumber) {
    db.collection("orders").doc(referenceNumber).onSnapshot((doc) => {
        if (doc.exists) {
            const status = doc.data().status;
            const statusElement = document.getElementInumber = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = {
            storeId,
            items,
            customRequest,
            ecoFriendly,
            referenceNumber,
            status: "Order Received",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            location: "Agona Swedru, Central Region, Ghana"
        };

        // Save to Firestore
        await db.collection("orders").doc(referenceNumber).set(order);

        // Notify admin and dispatcher
        notifyAdminAndDispatcher(referenceNumber, order);

        // Display result with payment options
        document.getElementById("order-result").innerHTML = `
            <div class="alert alert-success">
                <h4>Order Placed!</h4>
                <p><strong>Reference Number:</strong> ${referenceNumber}</p>
                <p><strong>Store:</strong> ${stores.find(s => s.id == storeId).name}</p>
                <p><strong>Items:</strong> ${items.join(", ")}</p>
                ${customRequest ? `<p><strong>Custom Request:</strong> ${customRequest}</p>` : ""}
                <p><strong>Eco-Friendly:</strong> ${ecoFriendly ? "Yes" : "No"}</p>
                <p><strong>Payment Options:</strong></p>
                <p><a href="YOUR_MOMO_LINK" target="_blank" class="btn btn-sm btn-outline-primary">Pay via MoMo Link</a></p>
                <p><img src="YOUR_QR_CODE_URL" alt="MoMo QR Code" style="width: 100px;"></p>
                <p>Or send to: <strong>+233 55 123 4567</strong> with reference ${referenceNumber}</p>
            </div>
        `;

        updateOrderStatus(referenceNumber);
    });

// Track order
document.getElementById("track-btn").addEventListener("click", async () => {
    const refNum = document.getElementById("track-input").value.trim();
    if (refNum) {
        const doc = await db.collection("orders").doc(refNum).get();
        if (doc.exists) {
            const order = doc.data();
            const trackResult = document.getElementById("track-result");
            trackResult.style.display = "block";
            trackResult.innerHTML = `
                <h5>Tracking: ${refNum}</h5>
                <p>Status: <span id="status-${refNum}">${order.status}</span></p>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="smartReorder('${refNum}')">Reorder</button>
            `;
        } else {
            alert("Order not found!");
        }
    }
});

// Real-time status updates
function updateOrderStatus(referenceNumber) {
    db.collection("orders").doc(referenceNumber).onSnapshot((doc) => {
        if (doc.exists) {
            const status = doc.data().status;
            const statusElement = document.getElementById(`status-${referenceNumber}`);
            if (statusElement) statusElement.textContent = status;
        }
    });
}

// Smart Reorder
async function smartReorder(referenceNumber) {
    const doc = await db.collection("orders").doc(referenceNumber).get();
    if (doc.exists) {
        const order = doc.data();
        const newRefNum = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await db.collection("orders").doc(newRefNum).set({ ...order, referenceNumber: newRefNum, status: "Order Received" });
        alert(`Reordered! New Reference Number: ${newRefNum}`);
        notifyAdminAndDispatcher(newRefNum, order);
    }
}

// Simulated notification (replace with real Cloud Function)
function notifyAdminAndDispatcher(referenceNumber, order) {
    console.log(`Email to cosmoscoderr@gmail.com: New Order ${referenceNumber}`, order);
    console.log(`SMS to +233 55 635 9890: New Order ${referenceNumber}`, order);
}
