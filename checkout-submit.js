// --- checkout-submit.js ---

document.addEventListener('DOMContentLoaded', () => {
    const total = localStorage.getItem('cart_total') || '0.00';
    document.getElementById('total-display').textContent = `Grand Total Due: $${total}`;

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(e) {
    e.preventDefault();

    const formMessage = document.getElementById('form-message');
    formMessage.textContent = "Sending order...";
    formMessage.style.color = 'orange';

    const cart = getCart(); // From script.js
    const total = localStorage.getItem('cart_total') || '0.00';

    
    // Format the order array for the EmailJS loop
    let orderArray = [];
    for (const name in cart) {
        const item = cart[name];
        orderArray.push({
            name: name,
            quantity: item.quantity,
            itemTotal: item.total.toFixed(2),
            isTip: item.isTip
        });
    }

  // Gather customer data from the form
const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    timestamp: new Date().toLocaleString(),
    total: total,
    order_json: orderArray
};

console.log("FORM DATA SENT TO EMAILJS:", formData);
alert(JSON.stringify(formData));

    // Replace these with your actual IDs from the EmailJS template setup!
    const serviceID = 'service_zhe8omo'; 
    const templateID = 'template_p3spbeq'; 

    try {
        await emailjs.send(serviceID, templateID, formData);

        formMessage.textContent = 'Order successfully submitted! Please complete your payment using the instructions above.';
        formMessage.style.color = 'green';
        
        // Clear the cart upon successful submission
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem('cart_total');
        updateCartCount(); // Update the header
        
        // Disable the form
        document.getElementById('checkout-form').reset();
        document.getElementById('checkout-form').style.display = 'none';

    } catch (error) {
        console.error('Email submission failed:', error);
        formMessage.textContent = 'Order submission failed. Please try again or contact the organizer.';
        formMessage.style.color = 'red';
    }
}
