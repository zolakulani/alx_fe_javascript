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
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
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
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
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

// Initialize the application
function init() {
  createAddQuoteForm();
  
  // Show last viewed quote if available in sessionStorage
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').innerHTML = 
      `<p>Last viewed: "${quote.text}"</p><p>- ${quote.category}</p>`;
  } else {
    showRandomQuote();
  }

  // Add event listener for the show new quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);