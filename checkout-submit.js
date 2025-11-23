// --- checkout-submit.js (UPDATED) ---

document.addEventListener('DOMContentLoaded', () => {
    const total = localStorage.getItem('cart_total') || '0.00';
    const totalDisplay = document.getElementById('total-display');
    if (totalDisplay) totalDisplay.textContent = `Grand Total Due: $${total}`;

    const form = document.getElementById('checkout-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
    const formMessage = document.getElementById('form-message');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending order...';
    }
    formMessage.textContent = "Sending order...";
    formMessage.style.color = 'orange';

    const cart = getCart(); // from script.js
    const total = localStorage.getItem('cart_total') || '0.00';

    // Build orderArray for any backend/template usage
    let orderArray = [];
    for (const name in cart) {
        const item = cart[name];
        orderArray.push({
            name: name,
            quantity: item.quantity,
            itemTotal: parseFloat((item.total || (item.quantity * item.price)).toFixed(2)),
            isTip: !!item.isTip
        });
    }

    // Build a readable order summary
    let orderSummary = [];
    let totalQuantity = 0;
    for (const name in cart) {
        const item = cart[name];
        if (item && typeof item.quantity !== 'undefined') {
            const lineTotal = (item.total || (item.quantity * item.price));
            orderSummary.push(`${item.quantity}x ${name} - $${lineTotal.toFixed(2)}`);
            totalQuantity += item.quantity;
        }
    }

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        timestamp: new Date().toLocaleString(),
        total: total,
        order_summary: orderSummary.join('\n'),
        total_quantity: totalQuantity
    };

    // Store the final order locally so the payment page can read it
    try {
        localStorage.setItem('last_order', JSON.stringify(formData));
    } catch (err) {
        console.warn('Could not save last_order to localStorage', err);
    }

    // EmailJS settings (replace with your real IDs if needed)
    const serviceID = 'service_zhe8omo';
    const templateID = 'template_p3spbeq';

    // Attempt to send email
    try {
        const resp = await emailjs.send(serviceID, templateID, formData);
        console.log('Email sent OK:', resp);

        // Clear the cart, remove the cart total, update UI
        saveCart({}); // function from script.js
        localStorage.removeItem('cart_total');
        updateCartCount(); // update cart count in header

        // Don't show the submit/purchase button on the final page
        // Redirect to payment instructions page to complete payment
        window.location.href = 'payment.html';
    } catch (err) {
        console.error('Email submission failed (full object):', err);
        let displayErr = 'Order submission failed. See console for details.';
        if (err && (err.text || err.message)) displayErr = err.text || err.message;
        formMessage.textContent = displayErr;
        formMessage.style.color = 'red';

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Order & Get Payment Details';
        }

        // Keep last_order in localStorage so user can retry
    }
}
