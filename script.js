// --- script.js (UPDATED) ---

/**
 * 1. CART MANAGEMENT FUNCTIONS
 * Uses localStorage to store the cart data across pages.
 * The cart structure now includes a Boolean for Tip items.
 * { 
 * "Product Name": { "quantity": 2, "price": 13.00, "total": 26.00, "isTip": false }
 * }
 */

const CART_STORAGE_KEY = 'coreys_cart';

// Function to safely get the current cart from localStorage
function getCart() {
    const cartString = localStorage.getItem(CART_STORAGE_KEY);
    return cartString ? JSON.parse(cartString) : {};
}

// Function to save the cart object back to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Function called when a standard "Add to Cart" button is clicked
function addToCart(productName, productPrice) {
    let cart = getCart();

    // Check if the item already exists in the cart
    if (cart[productName]) {
        // Item exists: increase quantity
        cart[productName].quantity += 1;
        cart[productName].total = cart[productName].quantity * productPrice;
    } else {
        // Item is new: add it
        cart[productName] = {
            quantity: 1,
            price: productPrice, // price per item
            total: productPrice,
            isTip: false
        };
    }

    saveCart(cart);

    // Update UI indicator instead of browser notification
    showNotification(`${productName} added!`);
    
    // Update the count in the header
    updateCartCount();

    // Prevent navigation from the 'a href="#"'
    return false; 
}


// --- New Tip Handling Function ---
function addTipToCart() {
    const tipInput = document.getElementById('tip-amount');
    const tipAmount = parseFloat(tipInput.value);

    if (isNaN(tipAmount) || tipAmount <= 0) {
        showNotification("Please enter a valid tip amount.");
        return;
    }

    let cart = getCart();
    const tipName = "Team Donation/Tip";
    
    // Tip is handled as a unique item where quantity is always 1, and the price IS the amount.
    // If a tip already exists, replace it with the new amount.
    cart[tipName] = {
        quantity: 1,
        price: tipAmount,
        total: tipAmount,
        isTip: true // Set the flag for John's system
    };

    saveCart(cart);
    showNotification(`$${tipAmount.toFixed(2)} Tip added to cart!`);
    updateCartCount();
}


// --- New UI Notification Function ---
function showNotification(message) {
    // A simple, non-intrusive notification element (must be added to index.html/style.css later)
    let notif = document.getElementById('cart-notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'cart-notification';
        document.body.appendChild(notif);
        // Basic styling
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.right = '20px';
        notif.style.backgroundColor = 'var(--primary)';
        notif.style.color = 'var(--white)';
        notif.style.padding = '10px 15px';
        notif.style.borderRadius = '5px';
        notif.style.zIndex = '1000';
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s ease-in-out';
    }

    notif.textContent = message;
    notif.style.opacity = '1';

    // Fade out after 3 seconds
    setTimeout(() => {
        notif.style.opacity = '0';
    }, 3000);
}


// --- Cart Count and Initial Setup ---

function updateCartCount() {
    let cart = getCart();
    let totalItems = 0;
    
    // Sum the quantity of all items in the cart
    for (const key in cart) {
        if (cart.hasOwnProperty(key)) {
            totalItems += cart[key].quantity;
        }
    }

    const cartLink = document.getElementById('cart-link'); 
    if (cartLink) {
        cartLink.textContent = `View Cart (${totalItems})`;
    }
}

// Attach the Tip function to the button only after the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const addTipButton = document.getElementById('add-tip-button');
    if (addTipButton) {
        addTipButton.addEventListener('click', addTipToCart);
    }
});
