// Load quotes from localStorage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" }
];

let selectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

// Add these constants near the top of the file
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API
const SYNC_INTERVAL = 30000; // 30 seconds

// Add these functions for server synchronization
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    // Transform mock API data to our quote format
    return data.map(item => ({
      text: item.title,
      category: item.body.split(' ')[0] || 'general'
    }));
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return null;
  }
}

async function postQuotesToServer(quotes) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quotes),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to post quotes:', error);
    return false;
  }
}

async function syncQuotes() {
  // Fetch server quotes
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes) return false;

  // Conflict resolution - merge strategies
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
  // Create a merged set of quotes (simple merge by unique text)
  const mergedQuotes = [...localQuotes];
  const localTexts = new Set(localQuotes.map(q => q.text));
  
  serverQuotes.forEach(quote => {
    if (!localTexts.has(quote.text)) {
      mergedQuotes.push(quote);
    }
  });

  // Update local storage
  quotes = mergedQuotes;
  localStorage.setItem('quotes', JSON.stringify(quotes));
  
  // Update UI if needed
  populateCategories();
  
  // Show notification
  showNotification('Quotes synchronized with server');
  return true;
}

// Add notification function
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add this to your init() function:
function init() {
  // ... existing init code ...

  // Set up periodic sync
  setInterval(syncQuotes, SYNC_INTERVAL);
  
  // Manual sync button
  document.getElementById('manualSync').addEventListener('click', async () => {
    const success = await syncQuotes();
    showNotification(success ? 'Sync successful!' : 'Sync failed');
  });
}

// Then modify the filterQuotes function:
function filterQuotes() {
  selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);
  
  if (selectedCategory === 'all') {
    showRandomQuote();
    return;
  }
  
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes in this category";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
}

// Update the populateCategories function:
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = ['all'];
  
  // Get all unique categories
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categories.push(...uniqueCategories);
  
  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  // Add new options
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  if (selectedCategory && categories.includes(selectedCategory)) {
    categoryFilter.value = selectedCategory;
  }
}

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
      populateCategories(); // Update categories after import
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
    populateCategories(); // Update categories after adding
  } else {
    alert('Please enter both quote text and category');
  }
}

// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = ['all'];
  
  // Get all unique categories using map
  const uniqueCategories = quotes.map(quote => quote.category)
                                .filter((value, index, self) => self.indexOf(value) === index);
  
  categories.push(...uniqueCategories);
  
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

  // Restore last selected category
  const lastCategory = localStorage.getItem('lastSelectedCategory');
  if (lastCategory && categories.includes(lastCategory)) {
    categoryFilter.value = lastCategory;
  }
}

// Function to filter quotes by category
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  
  // Save selected category to localStorage
  localStorage.setItem('lastSelectedCategory', category);
  
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
  populateCategories();

  // Add event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('manualSync').addEventListener('click', () => {
    alert('Sync with server would happen here (simulated)');
  });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);