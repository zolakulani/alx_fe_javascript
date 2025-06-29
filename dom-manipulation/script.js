// Initial quotes array with text and category properties
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" }
];

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
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter new quote">
    <input type="text" id="newQuoteCategory" placeholder="Enter category">
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
  
  // Add event listener for the add quote button
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
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
    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  }
}

// Initialize the application
function init() {
  createAddQuoteForm();
  showRandomQuote();
  
  // Add event listener for the show new quote button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);