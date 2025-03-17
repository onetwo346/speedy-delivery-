// Firebase Config (commented out to avoid initialization error)
// Replace with your actual Firebase project config when ready
/*
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
*/

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

// Function to handle order submission (simplified without Firebase)
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
        location: "Agona Swedru, Central Region, Ghana"
    };

    // Simulate order submission without Firebase
    console.log("Order submitted (Firebase disabled):", order);
    orderResult.innerHTML = `
        <div class="alert alert-success">
            <h4>Order Placed!</h4>
            <p><strong>Reference Number:</strong> ${referenceNumber}</p>
            <p><strong>Store:</strong> ${selectedStore.name}</p>
            <p><strong>Items:</strong> ${items.join(", ")}</p>
            ${customRequest ? `<p><strong>Custom Request:</strong> ${customRequest}</p>` : ""}
            <p><strong>Eco-Friendly:</strong> ${ecoFriendly ? "Yes" : "No"}</p>
            <p><strong>Note:</strong> Database functionality is disabled. This is a simulated order.</p>
        </div>
    `;
};

// Initialize everything after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Populate store dropdown
    const storeSelect = getElement("store-select");
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

    // Handle track button click (commented out since Firebase is disabled)
    /*
    const trackBtn = getElement("track-btn");
    if (trackBtn) {
        trackBtn.addEventListener("click", handleTrackOrder);
    } else {
        console.error("Track button not found. Order tracking will not work.");
    }
    */
});

// Log to confirm script is loaded
console.log("Script loaded successfully");
