// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const resultsTableBody = document.getElementById('resultsTableBody');

// Handle search button click
searchButton.addEventListener('click', handleSearch);

// Handle Enter key in search input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main search handler
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a product name to search.');
        return;
    }

    // Hide previous results and errors
    hideError();
    hideResults();
    
    // Show loading state
    showLoading();
    searchButton.disabled = true;

    try {
        // TODO: Replace with actual API endpoint when backend is ready
        // For now, this is a placeholder that simulates the API call
        const response = await fetch('http://localhost:6767/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        // For now, show mock data since backend isn't connected
        // Remove this when backend is ready
        console.log('Backend not connected yet, showing mock data');
        //showMockResults();
        
        // Uncomment this when backend is ready:
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
        searchButton.disabled = false;
    }
}

// Display search results
function displayResults(data) {
    // Expected data structure:
    // {
    //   itemSummaries: [
    //     {
    //       title: "Product Title",
    //       price: { value: "99.99", currency: "USD" },
    //       condition: "NEW",
    //       itemWebUrl: "https://..."
    //     }
    //   ]
    // }
    
    const items = data.itemSummaries || [];
    
    if (items.length === 0) {
        showError('No results found. Try a different search term.');
        return;
    }

    // Clear previous results
    resultsTableBody.innerHTML = '';

    // Populate table with results
    items.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // item number (row num)
        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        
        // item title
        const titleCell = document.createElement('td');
        titleCell.textContent = item.title || 'N/A';
        
        // item price and currency
        const priceCell = document.createElement('td');
        const priceValue = item.price?.value || 'N/A';
        const priceCurrency = item.price?.currency || 'USD';
        priceCell.textContent = priceValue !== 'N/A' ? `${priceCurrency} ${priceValue}` : 'N/A';
        
        // item condition
        const conditionCell = document.createElement('td');
        conditionCell.textContent = item.condition || 'N/A';
        
        // url cell
        const linkCell = document.createElement('td');
        if (item.itemWebUrl) {
            const link = document.createElement('a');
            link.href = item.itemWebUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'View on eBay';
            linkCell.appendChild(link);
        } else {
            linkCell.textContent = 'N/A';
        }

        // item seller
        const sellerCell = document.createElement('td');
        const sellerName = item.seller || 'N/A';
        const sellerFeedback = item.sellerFeedback || 'N/A';
        sellerCell.textContent = sellerName !== 'N/A' ? `${sellerName} (${sellerFeedback})` : 'N/A';

        // item category
        const categoryCell = document.createElement('td');
        const category = item.mainCategory || 'N/A';
        categoryCell.textContent = category;


        


        row.appendChild(numberCell);
        row.appendChild(titleCell);
        row.appendChild(priceCell);
        row.appendChild(conditionCell);
        row.appendChild(linkCell);
        row.appendChild(sellerCell);
        row.appendChild(categoryCell);
        resultsTableBody.appendChild(row);
    });

    showResults();
}

// Show mock results for testing (remove when backend is connected)
function showMockResults() {
    const mockData = {
        itemSummaries: [
            {
                title: "Sample Product 1 - Brand New Item",
                price: { value: "29.99", currency: "USD" },
                condition: "NEW",
                itemWebUrl: "https://www.ebay.com"
            },
            {
                title: "Sample Product 2 - Used Condition",
                price: { value: "19.99", currency: "USD" },
                condition: "USED",
                itemWebUrl: "https://www.ebay.com"
            },
            {
                title: "Sample Product 3 - Excellent Condition",
                price: { value: "49.99", currency: "USD" },
                condition: "EXCELLENT",
                itemWebUrl: "https://www.ebay.com"
            }
        ]
    };
    
    displayResults(mockData);
}

// UI helper functions
function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showResults() {
    resultsSection.style.display = 'block';
}

function hideResults() {
    resultsSection.style.display = 'none';
}

