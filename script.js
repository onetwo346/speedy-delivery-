// Firebase Config (replace with your actual Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase with error handling
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    alert("Failed to connect to the database. Please check your configuration and try again.");
}

// Store data for Agona Swedru - Using const for immutability since this data doesn't change
const STORES = [
    { id: "1", name: "Wiafesco", type: "Cosmetics Store", items: ["Creams", "Soaps", "Perfumes"] },
    { id: "2", name: "Geneviva Lodge", type: "Hotel", items: ["Room Booking", "Meals", "Drinks"] },
    { id: "3", name: "Maryking Super Market", type: "Market", items: ["Milk", "Bread", "Rice"] },
    { id: "4", name: "Chekin Pizza", type: "Fast Food", items: ["Pizza", "Drinks", "Sides"] }
];

// Utility function to safely get DOM elements with error logging
const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID "${id}" not found in DOM.`);
    }
    return element;
};

// Function to populate the store dropdown
const populateStoreDropdown = (storeSelect) => {
    if (!storeSelect) return;

    // Clear existing options and add the default option
    storeSelect.innerHTML = '<option value="" disabled selected>Choose a store</option>';

    // Add store options dynamically
    STORES.forEach(store => {
        const option = document.createElement("option");
        option.value = store.id;
        option.textContent = store.name;
        storeSelect.appendChild(option);
    });

    console.log(`Dropdown populated with ${storeSelect.options.length - 1} stores`);
};

// Function to populate store cards
const populateStoreCards = (storeList) => {
    if (!storeList) return;

    storeList.innerHTML = ''; // Clear existing content
    STORES.forEach(store => {
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

    console.log(`Store cards populated with ${STORES.length} stores`);
};

// Function to handle order submission
const handleOrderSubmission = async (event) => {
    event.preventDefault();

    const storeSelect = getElement("store-select");
    const itemsInput = getElement("items");
    const customRequestInput = getElement("custom-request");
    const ecoFriendlyCheckbox = getElement("eco-friendly");
    const orderResult = getElement("order-result");

    if (!storeSelect || !itemsInput || !orderResult) {
        alert("Required form elements are missing. Please check the page structure.");
        return;
    }

    const storeId = storeSelect.value;
    const items = itemsInput.value.split("\n").filter(item => item.trim());
    const customRequest = customRequestInput ? customRequestInput.value : '';
    const ecoFriendly = ecoFriendlyCheckbox ? ecoFriendlyCheckbox.checked : false;

    if (!storeId) {
        alert("Please select a store!");
        return;
    }

    if (items.length === 0) {
        alert("Please enter at least one item!");
        return;
    }

    const selectedStore = STORES.find(store => store.id === storeId);
    if (!selectedStore) {
        alert("Invalid store selection!");
        return;
    }

    const referenceNumber = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const order = {
        storeId,
        storeName: selectedStore.name,
        items,
        customRequest,
        ecoFriendly,
        referenceNumber,
        status: "Order Received",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        location: "Agona Swedru, Central Region, Ghana"
    };

    try {
        if (!db) throw new Error("Database connection not initialized.");
        await db.collection("orders").doc(referenceNumber).set(order);
        console.log(`Order ${referenceNumber} saved to Firestore`);

        notifyAdminAndDispatcher(referenceNumber, order);
        updateOrderStatus(referenceNumber);

        // Display result
        orderResult.innerHTML = `
            <div class="alert alert-success">
                <h4>Order Placed!</h4>
                <p><strong>Reference Number:</strong> ${referenceNumber}</p>
                <p><strong>Store:</strong> ${selectedStore.name}</p>
                <p><strong>Items:</strong> ${items.join(", ")}</p>
                ${customRequest ? `<p><strong>Custom Request:</strong> ${customRequest}</p>` : ""}
                <p><strong>Eco-Friendly:</strong> ${ecoFriendly ? "Yes" : "No"}</p>
                <p><strong>Payment Options:</strong></p>
                <p><a href="YOUR_MOMO_LINK" target="_blank" class="btn btn-sm btn-outline-primary">Pay via MoMo Link</a></p>
                <p><img src="YOUR_QR_CODE_URL" alt="MoMo QR Code" style="width: 100px;"></p>
                <p>Or send to: <strong>+233 55 123 4567</strong> with reference ${referenceNumber}</p>
            </div>
        `;
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again.");
    }
};

// Function to handle order tracking
const handleTrackOrder = async () => {
    const trackInput = getElement("track-input");
    const trackResult = getElement("track-result");

    if (!trackInput || !trackResult) {
        alert("Tracking elements are missing. Please check the page structure.");
        return;
    }

    const refNum = trackInput.value.trim();
    if (!refNum) {
        alert("Please enter a reference number!");
        return;
    }

    try {
        if (!db) throw new Error("Database connection not initialized.");
        const doc = await db.collection("orders").doc(refNum).get();

        if (doc.exists) {
            const order = doc.data();
            trackResult.style.display = "block";
            trackResult.innerHTML = `
                <h5>Tracking: ${refNum}</h5>
                <p>Status: <span id="status-${refNum}">${order.status}</span></p>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="smartReorder('${refNum}')">Reorder</button>
            `;
        } else {
            alert("Order not found!");
            trackResult.style.display = "none";
        }
    } catch (error) {
        console.error("Error tracking order:", error);
        alert("Error tracking order. Please try again.");
    }
};

// Function to update order status in real-time
const updateOrderStatus = (referenceNumber) => {
    if (!db) {
        console.error("Database connection not initialized. Cannot update order status.");
        return;
    }

    db.collection("orders").doc(referenceNumber).onSnapshot((doc) => {
        if (doc.exists) {
            const status = doc.data().status;
            const statusElement = document.getElementById(`status-${referenceNumber}`);
            if (statusElement) {
                statusElement.textContent = status;
                console.log(`Status updated for ${referenceNumber}: ${status}`);
            }
        }
    });
};

// Function for smart reorder
window.smartReorder = async (referenceNumber) => {
    try {
        if (!db) throw new Error("Database connection not initialized.");
        const doc = await db.collection("orders").doc(referenceNumber).get();
        if (doc.exists) {
            const order = doc.data();
            const newRefNum = `SPD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            await db.collection("orders").doc(newRefNum).set({
                ...order,
                referenceNumber: newRefNum,
                status: "Order Received",
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert(`Reordered! New Reference Number: ${newRefNum}`);
            notifyAdminAndDispatcher(newRefNum, order);
            console.log(`Reordered: ${newRefNum}`);
        }
    } catch (error) {
        console.error("Error reordering:", error);
        alert("Error reordering. Please try again.");
    }
};

// Simulated notification function (replace with real Cloud Function)
const notifyAdminAndDispatcher = (referenceNumber, order) => {
    console.log(`Email to cosmoscoderr@gmail.com: New Order ${referenceNumber}`, order);
    console.log(`SMS to +233 55 635 9890: New Order ${referenceNumber}`, order);
};

// Initialize everything after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Populate store cards and dropdown
    const storeList = getElement("store-list");
    const storeSelect = getElement("store-select");
    populateStoreCards(storeList);
    populateStoreDropdown(storeSelect);

    // Add change event listener to store dropdown for debugging
    if (storeSelect) {
        storeSelect.addEventListener("change", () => {
            console.log("Store selected:", storeSelect.value);
        });
    }

    // Handle form submission
    const orderForm = getElement("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", handleOrderSubmission);
    } else {
        console.error("Order form not found. Form submission will not work.");
    }

    // Handle track button click
    const trackBtn = getElement("track-btn");
    if (trackBtn) {
        trackBtn.addEventListener("click", handleTrackOrder);
    } else {
        console.error("Track button not found. Order tracking will not work.");
    }
});

// Log to confirm script is loaded
console.log("Script loaded successfully");
