// Load quotes from localStorage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
  
  // Save last viewed quote to sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const dataUrl = URL.createObjectURL(dataBlob);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUrl);
  linkElement.setAttribute('download', 'quotes.json');
  linkElement.click();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        throw new Error('Imported file must contain an array of quotes');
      }
      quotes = importedQuotes;
      saveQuotes();
      showRandomQuote();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  if (textInput.value.trim() && categoryInput.value.trim()) {
    quotes.push({
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    });
    saveQuotes();
    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  } else {
    alert('Please enter both quote text and category');
  }
}

// Function to populate category filter dropdown
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = ['all'];
  
  // Get all unique categories
  quotes.forEach(quote => {
    if (!categories.includes(quote.category)) {
      categories.push(quote.category);
    }
  });
  
  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  // Add new options
  categories.slice(1).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by category
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  if (category === 'all') {
    showRandomQuote();
    return;
  }
  
  const filteredQuotes = quotes.filter(quote => quote.category === category);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes in this category";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
}

// Initialize the application
function init() {
  // Show last viewed quote if available in sessionStorage
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').innerHTML = 
      `<p>Last viewed: "${quote.text}"</p><p>- ${quote.category}</p>`;
  } else {
    showRandomQuote();
  }

  // Populate category filter
  populateCategoryFilter();

  // Add event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('manualSync').addEventListener('click', () => {
    alert('Sync with server would happen here (simulated)');
  });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);