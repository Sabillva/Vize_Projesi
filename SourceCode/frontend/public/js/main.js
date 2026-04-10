// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const featuredBooksContainer = document.getElementById('featuredBooks');
const allBooksContainer = document.getElementById('allBooks');
const booksCount = document.getElementById('booksCount');
const noResults = document.getElementById('noResults');
const categoryCards = document.querySelectorAll('.category-card');
const langButtons = document.querySelectorAll('.lang-btn');

// State
let currentCategory = 'all';
let currentLanguage = 'all';

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
        // Navigate to book detail page
        window.location.href = `book-detail.html?id=${foundBook.id}`;
    } else {
        // Filter books to show search results
        filterAndDisplayBooks();
        // Scroll to all books section
        document.getElementById('all-books').scrollIntoView({ behavior: 'smooth' });
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

// Category filter
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        categoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentCategory = card.dataset.category;
        filterAndDisplayBooks();
    });
});

// Language filter
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLanguage = btn.dataset.lang;
        filterAndDisplayBooks();
    });
});

// Footer category links
document.querySelectorAll('.footer-links a[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        
        // Update category filter
        categoryCards.forEach(c => c.classList.remove('active'));
        const targetCard = document.querySelector(`.category-card[data-category="${category}"]`);
        if (targetCard) {
            targetCard.classList.add('active');
        }
        currentCategory = category;
        filterAndDisplayBooks();
        
        // Scroll to categories section
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    });
});

// Create book card HTML
function createBookCard(book) {
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

// Display featured books
function displayFeaturedBooks() {
    const featured = booksData.filter(book => book.featured);
    featuredBooksContainer.innerHTML = featured.map(createBookCard).join('');
}

// Filter and display books
function filterAndDisplayBooks() {
    let filtered = [...booksData];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(book => book.category === currentCategory);
    }
    
    // Apply language filter
    if (currentLanguage !== 'all') {
        filtered = filtered.filter(book => book.language === currentLanguage);
    }
    
    // Apply search filter
    const searchQuery = searchInput.value.trim().toLowerCase() || mobileSearchInput.value.trim().toLowerCase();
    if (searchQuery) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery)
        );
    }
    
    // Update UI
    if (filtered.length === 0) {
        allBooksContainer.innerHTML = '';
        noResults.style.display = 'block';
        booksCount.textContent = 'Sonuç bulunamadı';
    } else {
        allBooksContainer.innerHTML = filtered.map(createBookCard).join('');
        noResults.style.display = 'none';
        booksCount.textContent = `Toplam ${filtered.length} kitap listeleniyor`;
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedBooks();
    filterAndDisplayBooks();
});
