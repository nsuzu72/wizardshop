// --- cart-display.js (UPDATED with Quantity Adjustment) ---
document.addEventListener('DOMContentLoaded', displayCart);

// Function to handle quantity changes
function changeQuantity(productName, delta) {
    let cart = getCart();
    const item = cart[productName];

    if (!item || item.isTip) return; // Don't allow changing quantity of a tip

    item.quantity += delta;

    if (item.quantity <= 0) {
        // Remove item if quantity hits zero or less
        delete cart[productName];
    } else {
        // Recalculate total for the item
        item.total = item.quantity * item.price;
        cart[productName] = item;
    }
    
    saveCart(cart);
    displayCart(); // Re-render the cart
    updateCartCount(); // Update header count
}

// Function to remove an item entirely
function removeItem(productName) {
    let cart = getCart();
    delete cart[productName];
    saveCart(cart);
    displayCart();
    updateCartCount();
}


function displayCart() {
    let cart = getCart(); // Function imported from script.js
    const cartContentsDiv = document.getElementById('cart-contents');
    const checkoutButton = document.getElementById('checkout-button');
    const tableBody = document.getElementById('cart-table-body');
    let grandTotal = 0;

    if (Object.keys(cart).length === 0) {
        cartContentsDiv.innerHTML = '<p class="product-description" style="text-align:center;">Your cart is empty. Time to add some pickles!</p>';
        checkoutButton.style.display = 'none';
        return;
    }

    let rowsHTML = '';

    for (const name in cart) {
        const item = cart[name];
        const subtotal = item.total; // already calculated by script.js
        grandTotal += subtotal;
        
        // Disable quantity controls for tips
        const controls = item.isTip ? 
            'N/A (Donation)' : 
            `
            <button onclick="changeQuantity('${name}', -1)">-</button>
            <span style="margin: 0 5px;">${item.quantity}</span>
            <button onclick="changeQuantity('${name}', 1)">+</button>
            `;

        rowsHTML += `
            <tr>
                <td>${name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${controls}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button onclick="removeItem('${name}')" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Remove</button></td>
            </tr>
        `;
    }

    const tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price/Unit</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHTML}
            </tbody>
        </table>
        <div class="cart-total">
            Grand Total: $${grandTotal.toFixed(2)}
        </div>
    `;


    // 3. Inject the HTML and enable checkout
    cartContentsDiv.innerHTML = tableHTML;
    checkoutButton.style.display = 'inline-block';

    // Store the grand total for use on the checkout page
    localStorage.setItem('cart_total', grandTotal.toFixed(2));
}
