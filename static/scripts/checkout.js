document.querySelectorAll('.js-add-to-cart').forEach(button => {
    button.addEventListener('click', async event => {
        event.preventDefault(); // Prevent form reload

        const productContainer = button.closest('.product-container');
        const productId = button.dataset.productId;
        const quantity = productContainer.querySelector('.js-product-quantity').value;

        const response = await fetch('/amazon/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log("Added to cart:", result);
            // You could show the "Added" checkmark here
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('.js-delivery-radio');
    const shippingTotalDisplay = document.getElementById('shipping-total');
    const itemprice = document.getElementById('itemprice')
    const totalbeforetax = document.getElementById('totalbeforetax')
    const tax = document.getElementById('tax')

    function calculatepricebeforetax() {
        const itemPriceValue = parseFloat(itemprice.textContent.replace('$', '')) || 0;
        const shippingValue = parseFloat(shippingTotalDisplay.textContent.replace('$', '')) || 0;
        const priceBeforeTax = itemPriceValue + shippingValue;
        const taxAmount = (priceBeforeTax * 0.10).toFixed(2);
        const grandTotal = (priceBeforeTax + parseFloat(taxAmount)).toFixed(2);

        totalbeforetax.textContent = `$${priceBeforeTax.toFixed(2)}`;
        tax.textContent = `$${taxAmount}`;
        document.getElementById('grandtotal').textContent = `$${grandTotal}`;
    }


    function updateShippingTotal() {
        let totalShippingCents = 0;

        const selectedRadios = [...document.querySelectorAll('.js-delivery-radio:checked')];
        selectedRadios.forEach(radio => {
            totalShippingCents += parseInt(radio.dataset.fee);
        });

        // Convert cents to dollars and update the UI
        const dollars = (totalShippingCents / 100).toFixed(2);
        shippingTotalDisplay.textContent = `$${dollars}`;
    }

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateShippingTotal();
            calculatepricebeforetax();
        });
    });


    updateShippingTotal();
    calculatepricebeforetax()

    const placeOrderButton = document.querySelector('.place-order-button');
    const flashMessage = document.getElementById('order-flash-message');

    const form = document.querySelector('form[action="/amazon/place-order"]');

    form.addEventListener('submit', (event) => {
        const flashMessage = document.getElementById('order-flash-message');
        const placeOrderButton = form.querySelector('.place-order-button');

        flashMessage.textContent = "✅ Order placed successfully!";
        flashMessage.style.display = "block";
        flashMessage.style.backgroundColor = "#d4edda";
        flashMessage.style.color = "#155724";
        flashMessage.style.padding = "10px";
        flashMessage.style.marginTop = "10px";
        flashMessage.style.border = "1px solid #c3e6cb";
        flashMessage.style.borderRadius = "5px";
        flashMessage.style.textAlign = "center";

        placeOrderButton.disabled = true;
        placeOrderButton.textContent = "Order Placed";
    });

});
