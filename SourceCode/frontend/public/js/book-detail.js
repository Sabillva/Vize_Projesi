// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const bookDetailContainer = document.getElementById('bookDetail');
const bookNotFound = document.getElementById('bookNotFound');
const similarBooksSection = document.getElementById('similarBooksSection');
const similarBooksContainer = document.getElementById('similarBooks');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Search functionality - Navigate to book detail on Enter
function handleSearch(inputElement) {
    const query = inputElement.value.trim().toLowerCase();
    if (query === '') return;
    
    // Find the first matching book
    const foundBook = booksData.find(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    
    if (foundBook) {
        window.location.href = `book-detail.html?id=${foundBook.id}`;
    } else {
        // Go to main page and show no results
        window.location.href = `index.html#all-books`;
    }
}

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch(searchInput);
    }
});

mobileSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch(mobileSearchInput);
    }
});

// Search button click
searchBtn.addEventListener('click', () => handleSearch(searchInput));
mobileSearchBtn.addEventListener('click', () => handleSearch(mobileSearchInput));

// Get book ID from URL
function getBookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Create book detail HTML
function createBookDetailHTML(book) {
    return `
        <div class="book-detail-cover">
            <img src="${book.cover}" alt="${book.title}">
            ${book.featured ? '<span class="book-detail-badge">Öne Çıkan</span>' : ''}
        </div>
        <div class="book-detail-info">
            <span class="book-detail-category">${book.categoryName}</span>
            <h1 class="book-detail-title">${book.title}</h1>
            <p class="book-detail-author">${book.author}</p>
            
            <div class="book-detail-meta">
                <div class="meta-item">
                    <span class="meta-label">Dil:</span>
                    <span class="meta-value">${book.languageName}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Yıl:</span>
                    <span class="meta-value">${book.year < 0 ? 'M.Ö. ' + Math.abs(book.year) : book.year}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Sayfa:</span>
                    <span class="meta-value">${book.pages}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Yayınevi:</span>
                    <span class="meta-value">${book.publisher}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">ISBN:</span>
                    <span class="meta-value">${book.isbn}</span>
                </div>
            </div>
            
            <p class="book-detail-price">${book.price.toFixed(2)} TL</p>
            
            <div class="book-detail-desc">
                <h3>Kitap Hakkında</h3>
                <p>${book.description}</p>
            </div>
            
            <div class="buy-buttons">
                <a href="${book.buyLinks.amazon}" target="_blank" rel="noopener noreferrer" class="buy-btn amazon">
                    Amazon'dan Satın Al
                </a>
                <a href="${book.buyLinks.kitapyurdu}" target="_blank" rel="noopener noreferrer" class="buy-btn kitapyurdu">
                    Kitapyurdu'ndan Satın Al
                </a>
                <a href="${book.buyLinks.idefix}" target="_blank" rel="noopener noreferrer" class="buy-btn idefix">
                    İdefix'ten Satın Al
                </a>
                <a href="${book.buyLinks.dr}" target="_blank" rel="noopener noreferrer" class="buy-btn dr">
                    D&R'dan Satın Al
                </a>
            </div>
        </div>
    `;
}

// Create similar book card HTML
function createSimilarBookCard(book) {
    return `
        <article class="book-card" onclick="window.location.href='book-detail.html?id=${book.id}'">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" loading="lazy">
                ${book.featured ? '<span class="book-badge">Öne Çıkan</span>' : ''}
            </div>
            <div class="book-info">
                <span class="book-category">${book.categoryName}</span>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-footer">
                    <span class="book-price">${book.price.toFixed(2)} TL</span>
                    <span class="book-lang">${book.languageName}</span>
                </div>
            </div>
        </article>
    `;
}

// Display book detail
function displayBookDetail() {
    const bookId = getBookIdFromURL();
    const book = booksData.find(b => b.id === bookId);
    
    if (!book) {
        bookDetailContainer.style.display = 'none';
        bookNotFound.style.display = 'block';
        similarBooksSection.style.display = 'none';
        document.title = 'Kitap Bulunamadı - Sabi\'nin Kitaplığı';
        return;
    }
    
    // Update page title
    document.title = `${book.title} - Sabi'nin Kitaplığı`;
    
    // Display book detail
    bookDetailContainer.innerHTML = createBookDetailHTML(book);
    
    // Display similar books (same category, excluding current book)
    const similarBooks = booksData
        .filter(b => b.category === book.category && b.id !== book.id)
        .slice(0, 4);
    
    if (similarBooks.length > 0) {
        similarBooksSection.style.display = 'block';
        similarBooksContainer.innerHTML = similarBooks.map(createSimilarBookCard).join('');
    } else {
        similarBooksSection.style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayBookDetail();
});
