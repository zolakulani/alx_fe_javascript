// Initial quotes array
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
  
  // Store last viewed quote in sessionStorage
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter new quote">
    <input type="text" id="newQuoteCategory" placeholder="Enter category">
    <button id="addQuoteBtn">Add Quote</button>
    <div class="import-export">
      <button id="exportBtn">Export Quotes</button>
      <input type="file" id="importFile" accept=".json">
      <label for="importFile">Import Quotes</label>
    </div>
  `;
  document.body.appendChild(formContainer);
  
  // Add event listeners
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  document.getElementById('exportBtn').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importQuotes);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  if (textInput.value && categoryInput.value) {
    quotes.push({
      text: textInput.value,
      category: categoryInput.value
    });
    saveQuotes();
    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  }
}

// Export quotes to JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'quotes.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import quotes from JSON file
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
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

// Show last viewed quote if available
function showLastQuote() {
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').innerHTML = 
      `<p>Last viewed: "${quote.text}"</p><p>- ${quote.category}</p>`;
  }
}

// Initialize the application
function init() {
  createAddQuoteForm();
  
  // Show last quote or random quote
  if (sessionStorage.getItem('lastQuote')) {
    showLastQuote();
  } else {
    showRandomQuote();
  }
  
  // Add event listener for the show new quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);