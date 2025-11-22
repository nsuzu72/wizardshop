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
// Format the order array for the EmailJS loop
let orderArray = [];
for (const name in cart) {
    const item = cart[name];
    orderArray.push({
        name: name,
        quantity: item.quantity,
        itemTotal: parseFloat(item.total.toFixed(2)), // Keep as number, not string
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
    order_json: orderArray // Changed to match template
};
    
console.log("FORM DATA SENT TO EMAILJS:", formData);
alert(JSON.stringify(formData));

    // Replace these with your actual IDs from the EmailJS template setup!
    const serviceID = 'service_zhe8omo'; 
    const templateID = 'template_p3spbeq'; 

    console.log('Sending formData:', JSON.stringify(formData, null, 2));

// Check each item in orderArray
orderArray.forEach((item, index) => {
    console.log(`Item ${index}:`, {
        name: typeof item.name,
        quantity: typeof item.quantity,
        itemTotal: typeof item.itemTotal,
        isTip: typeof item.isTip
    });
});

emailjs.send(serviceID, templateID, formData)
  .then((resp) => {
    console.log('Email sent OK:', resp);
    formMessage.textContent = 'Order successfully submitted! Please complete your payment using the instructions above.';
    formMessage.style.color = 'green';
    // clear cart etc...
  })
  .catch((err) => {
    console.error('Email submission failed (full object):', err);
    // EmailJS error may be in err.text or err.status or err.message
    console.error('err.text:', err && err.text);
    console.error('err.status:', err && err.status);
    alert('EmailJS error: ' + (err && (err.text || err.message || JSON.stringify(err))));
    formMessage.textContent = 'Order submission failed. See console for details.';
    formMessage.style.color = 'red';
  });

}
