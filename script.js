let jsonData = null; // Ensure jsonData starts as null

// Loads JSON Data Before Allowing Search
async function loadData() {
    try {
        const res = await fetch("./data.json"); // Fetch the JSON file
        jsonData = await res.json(); // Parses the JSON data
        console.log("Data loaded:", jsonData); // Debugging log to ensure data is loaded
    } catch (err) {
        console.error("Error loading data:", err); // Log any errors
    }
}

// Call loadData() when the page loads
window.addEventListener("load", loadData);

const resultsContainer = document.getElementById('results');  // Defines the results container
function clearResults() {
    resultsContainer.innerHTML = ''; // Clear previous results
}

let inputEl = document.querySelector("input");  // Defines the input element
let buttonEl = document.querySelector("button"); // Defines the button element
let headingEl = document.querySelector("h2"); // Defines the heading element

buttonEl.addEventListener("click", () => {     // Checks if jsonData is loaded -- minimizes error and broken pages
    if (!jsonData) { 
        console.error("Data not loaded yet. Try again in a few seconds."); 
        headingEl.textContent = "Loading data... Please try again.";
        return; // Exits the function if data is not available
    }

    clearResults(); // Clear previous results displayed on the page
    let query = inputEl.value.trim().toLowerCase(); // Takes users input and formats it -- less case sensitive search 
   
  // Filters jsonData based on user input
    let matches = jsonData.filter(item =>  
        item.CAS?.toLowerCase().includes(query) || // Looks for any matching CAS numbers 
        item.Sublocation?.toLowerCase().includes(query) ||  // Looks for any matching sublocation
        item.Name?.toLowerCase().includes(query) // Looks for any matching names/letters in the name
    );
      if (matches.length > 0) { 
        headingEl.textContent = `Results for "${inputEl.value}"`;  // Updates the heading to reflect the search input

        matches.forEach(user => {     // Filters through and finds matches based on each array 
            const resultBox = document.createElement('div');  // Creates a new div element for the result box
            resultBox.className = 'result-box';

            const name = document.createElement('h3'); // Creates an h3 element for the chemical's name

            name.textContent = user.Name;

            const sublocation = document.createElement('p'); // Creates a paragraph element for the chemicals's sub-location
            sublocation.textContent = `Sub-Location: ${user.Sublocation}`;

            const link = document.createElement('a');  // Creates a link for the chemials's URL to the SDS
            link.href = user.URL;
            link.textContent = user.URL;
            link.target = "_blank"; // Opens link in a new tab
          
        // Append the name, sublocation, and link to the result box
            resultBox.appendChild(name);
            resultBox.appendChild(sublocation);
            resultBox.appendChild(link);
            resultsContainer.appendChild(resultBox);
        });
        
// If no matches are found, then Not found will be displayed. 
    } else {
        headingEl.textContent = "Not Found";
    }
});
