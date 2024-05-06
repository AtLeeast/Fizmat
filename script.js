const searchForm = document.getElementById('search-form');
const bookInput = document.getElementById('book-input');
const searchBtn = document.getElementById('search-btn');
const bookList = document.getElementById('book-list');
const purchaseForm = document.getElementById('purchase-form');
const purchaseFormInner = document.getElementById('purchase-form-inner');
const submitBtn = document.getElementById('submit-btn');

searchBtn.addEventListener('click', searchBooks);
submitBtn.addEventListener('click', submitPurchaseForm);

function searchBooks(event) {
    event.preventDefault();
    const bookTitle = bookInput.value.trim();
    if (bookTitle) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`)
           .then(response => response.json())
           .then(data => {
                const bookListHTML = data.items.map(book => {
                    const authors = book.volumeInfo.authors.join(', ');
                    return `
                        <div class="book-item">
                            <h3>${book.volumeInfo.title}</h3>
                            <p>Author: ${authors}</p>
                            <button class="purchase-btn" data-book-title="${book.volumeInfo.title}" data-author="${authors}">Buy</button>
                        </div>
                    `;
                }).join('');
                bookList.innerHTML = bookListHTML;
                const purchaseBtns = document.querySelectorAll('.purchase-btn');
                purchaseBtns.forEach(btn => {
                    btn.addEventListener('click', showPurchaseForm);
                });
            })
           .catch(error => console.error(error));
    }
}

function showPurchaseForm(event) {
    const bookTitle = event.target.dataset.bookTitle;
    const author = event.target.dataset.author;
    purchaseForm.style.display = 'block';
    purchaseFormInner.innerHTML = `
        <h2>Purchase Form for "${bookTitle}" by ${author}</h2>
        <label for="name">Name:</label>
        <input type="text" id="name" required><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" required><br><br>
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" required><br><br>
        <label for="address">Address:</label>
        <input type="text" id="address" required><br><br>
        <button id="submit-btn">Submit</button>
    `;
}

function submitPurchaseForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const bookTitle = purchaseFormInner.querySelector('h2').textContent.split('"')[1];
    if (name && email && phone && address) {
        const purchaseFormData = {
            name,
            email,
            phone,
            address,
            bookTitle
        };
        fetch('https://my-json-server.typicode.com/fayeed/json-server-tutorial/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(purchaseFormData)
        })
        .then(response => response.json())
        .then(data => {
            purchaseForm.style.display = 'none';
            purchaseFormInner.innerHTML = '';
            bookInput.value = '';
            alert('Book purchase submitted successfully');
        })
        .catch(error => console.error(error));
    }
}