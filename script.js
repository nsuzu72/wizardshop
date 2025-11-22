// --- script.js ---

/**
 * 1. CART MANAGEMENT FUNCTIONS
 * Uses localStorage to store the cart data across pages.
 * The cart structure will be:
 * { 
 * "Product Name": { "quantity": 2, "price": 13.00, "total": 26.00 }
 * }
 */

// Function to safely get the current cart from localStorage
function getCart() {
    const cartString = localStorage.getItem('coreys_cart');
    // If cart is null or undefined, return an empty object, otherwise parse it
    return cartString ? JSON.parse(cartString) : {};
}

// Function to save the cart object back to localStorage
function saveCart(cart) {
    localStorage.setItem('coreys_cart', JSON.stringify(cart));
}

// Function called when an "Add to Cart" button is clicked
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
            price: productPrice,
            total: productPrice
        };
    }

    saveCart(cart);

    // Provide immediate feedback to the user
    alert(`${productName} added to your cart! You now have ${cart[productName].quantity} jars.`);

    // Optionally update a small cart count icon/text in the header
    updateCartCount();
}

// Function to calculate and update the visible cart item count
function updateCartCount() {
    let cart = getCart();
    let totalItems = 0;
    
    // Sum the quantity of all items in the cart
    for (const key in cart) {
        if (cart.hasOwnProperty(key)) {
            totalItems += cart[key].quantity;
        }
    }

    // You can display this count on a specific element, e.g., in a navigation link
    const cartLink = document.getElementById('cart-link'); 
    if (cartLink) {
        cartLink.textContent = `View Cart (${totalItems})`;
    }
}

// Ensure the cart count is updated when the page loads
document.addEventListener('DOMContentLoaded', updateCartCount);


// --- Additional Task: Update Navigation ---
// To make the cart functional, let's update the navigation in index.html as well
// 1. In index.html, replace the two navigation links with:
//    <a href="index.html">Home</a>
//    <a href="cart.html" id="cart-link">View Cart (0)</a> 

// 2. We still need to create cart.html next!
