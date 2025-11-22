// --- cart-display.js ---
document.addEventListener('DOMContentLoaded', displayCart);

function displayCart() {
    let cart = getCart(); // Function imported from script.js
    const cartContentsDiv = document.getElementById('cart-contents');
    const checkoutButton = document.getElementById('checkout-button');
    let grandTotal = 0;

    // 1. Check if cart is empty
    if (Object.keys(cart).length === 0) {
        cartContentsDiv.innerHTML = '<p class="product-description" style="text-align:center;">Your cart is empty. Time to add some pickles!</p>';
        checkoutButton.style.display = 'none';
        return;
    }

    // 2. Build the Cart Table
    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const name in cart) {
        const item = cart[name];
        const subtotal = item.quantity * item.price;
        grandTotal += subtotal;

        tableHTML += `
            <tr>
                <td>${name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }

    tableHTML += `
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

// NOTE: We don't need to define getCart() and saveCart() here, 
// they are available because script.js is loaded first.
