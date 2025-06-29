// Initial quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
  { text: "Stay hungry, stay foolish.", category: "motivation" },
  { text: "The journey of a thousand miles begins with one step.", category: "wisdom" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Load quotes from localStorage if available
if (localStorage.getItem('quotes')) {
  quotes = JSON.parse(localStorage.getItem('quotes'));
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = 'No quotes available. Add some quotes!';
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
}

// Add a new quote
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
    filterQuotes();
    populateCategories();
  } else {
    alert('Please enter both quote text and category');
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'quotes.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = importedQuotes;
      saveQuotes();
      filterQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error importing quotes: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Populate categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Get unique categories
  const categories = ['all'];
  quotes.forEach(quote => {
    if (!categories.includes(quote.category)) {
      categories.push(quote.category);
    }
  });
  
  // Clear and repopulate dropdown
  categoryFilter.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category === 'all' ? 'All Categories' : category;
    categoryFilter.appendChild(option);
  });
  
  // Restore last selected filter if available
  if (localStorage.getItem('lastFilter')) {
    categoryFilter.value = localStorage.getItem('lastFilter');
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) {
    showRandomQuote();
    return;
  }
  
  const selectedCategory = categoryFilter.value;
  
  // Save selected filter
  localStorage.setItem('lastFilter', selectedCategory);
  
  if (selectedCategory === 'all') {
    showRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <p><em>— ${quote.category}</em></p>
      `;
    } else {
      quoteDisplay.innerHTML = 'No quotes found in this category.';
    }
  }
}

// Simulate server interaction
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using JSONPlaceholder as a mock

// Sync with server (simulated)
async function syncWithServer() {
  try {
    // Simulate fetching from server
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Server error');
    
    const serverData = await response.json();
    
    // In a real app, we'd have proper server quotes and merge logic
    // For simulation, we'll just show a notification
    showSyncNotification('Data synced with server (simulated)');
    
    // Here you would implement actual merge logic:
    // 1. Compare local and server data
    // 2. Resolve conflicts (in this demo, we'll prefer local changes)
    // 3. Update UI if needed
    
  } catch (error) {
    showSyncNotification('Sync failed: ' + error.message, true);
  }
}

// Show sync notification
function showSyncNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = isError ? '#ffdddd' : '#ddffdd';
  notification.style.border = '1px solid ' + (isError ? '#ff9999' : '#99ff99');
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 1s';
    setTimeout(() => notification.remove(), 1000);
  }, 3000);
}

// Initialize with periodic sync
function init() {
  showRandomQuote();
  populateCategories();
  
  newQuoteBtn.addEventListener('click', filterQuotes);
  
  // Sync every 30 seconds (simulated)
  setInterval(syncWithServer, 30000);
  
  // Add manual sync button event
  document.getElementById('manualSync')?.addEventListener('click', syncWithServer);
}

init();