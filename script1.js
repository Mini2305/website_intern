document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    menuToggle.addEventListener('click', () => {
        navigation.classList.toggle('active');
    });
});
const cart = [];
// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        cart.push({ name, price });
        alert(`${name} added to cart!`);
    });
});
// Generate bill in a new window
function generateBill() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let billContent = "<h1>Your Bill</h1><table border='1'><tr><th>Item</th><th>Price</th></tr>";
    let total = 0;
    cart.forEach(item => {
        billContent += `<tr><td>${item.name}</td><td>${item.price}</td></tr>`;
        total += item.price;
    });
    billContent += `<tr><td><strong>Total</strong></td><td><strong>${total}</strong></td></tr></table>`;
    const billWindow = window.open("", "Bill", "width=400,height=600");
    billWindow.document.write(billContent);
    billWindow.document.close();
}
// Add event listener for the View Cart button
document.getElementById('view-cart').addEventListener('click', generateBill);
const userReviewTextarea = document.getElementById('user-review');
const submitReviewButton = document.getElementById('submit-review');


// Save Order to Backend
function saveOrderToBackend(items, total) {
    fetch('http://localhost/backend.php?route=save-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, total })
    })
        .then(response => response.json())
        .then(data => console.log(data.message || data.error))
        .catch(error => console.error('Error:', error));
}

// Submit Review to Backend
function submitReviewToBackend(review) {
    fetch('http://localhost/backend.php?route=submit-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review })
    })
        .then(response => response.json())
        .then(data => console.log(data.message || data.error))
        .catch(error => console.error('Error:', error));
}

// Generate Bill and Save Order
document.getElementById('view-cart').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
    const items = cart.map(item => {
        total += item.price;
        return { name: item.name, price: item.price };
    });

    // Save order to backend
    saveOrderToBackend(items, total);

    // Display Bill in New Window
    let billContent = "<h1>Your Bill</h1><table border='1'><tr><th>Item</th><th>Price</th></tr>";
    items.forEach(item => {
        billContent += `<tr><td>${item.name}</td><td>${item.price}</td></tr>`;
    });
    billContent += `<tr><td><strong>Total</strong></td><td><strong>${total}</strong></td></tr></table>`;
    const billWindow = window.open("", "Bill", "width=400,height=600");
    billWindow.document.write(billContent);
    billWindow.document.close();
});

// Handle Review Submission
document.getElementById('submit-review').addEventListener('click', () => {
    const userReviewTextarea = document.getElementById('user-review');
    const review = userReviewTextarea.value.trim();

    if (review) {
        // Submit review to backend
        submitReviewToBackend(review);

        alert("Thank you for your review!");
        userReviewTextarea.value = ''; // Clear textarea
    } else {
        alert("Please write a review before submitting.");
    }
});






