import { resetViewTemplate } from "./utils.js";
import { getAllEvents } from "./api.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";

export async function fetchDisplayEventsPage() {

  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Append the events page templates with the fetched data
  appendTemplateEvents();
  
  // Fetch all events
  const allEvents = await getAllEvents();
  if (allEvents) {
    allEvents.forEach(addEventsContainer); 
  }

  // Initialize event filters
  setupFilters();

  // Add event listeners to the "Mon compte" button
  addMyAccountButtonListener();
};

function appendTemplateEvents() {

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#all-events-page");
  
  // Clone the templates
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
  
  // Select the containers where the clones will be appended
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
  
  // Append the cloned templates to their respective containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
};
  
export function addEventsContainer(data) {

  // Select the event template from the DOM
  const eventTemplate = document.querySelector("#event__events-page");
    
  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Set the data attributes for the event
  eventClone.querySelector("article").setAttribute("data-city", data.city.toLowerCase());
  eventClone.querySelector("article").setAttribute("data-label", data.label.name.toLowerCase());
  
  // Populate the cloned template with event data
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name;
  
  // Select the container for the event list
  const eventContainer = document.querySelector(".events-grid");

  // Append the cloned event template to the event list container
  eventContainer.appendChild(eventClone);
};


function setupFilters() {
    
  const cityButtons = document.querySelectorAll(".cities-filter__button");
  const themeSelect = document.querySelector("#theme");
  
  cityButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Get the selected city from the button text
      const selectedCity = button.textContent.toLowerCase();

      // Apply the filtering logic based on the selected city and current theme
      filterEvents(selectedCity, themeSelect.value);
    });
  });
    
  themeSelect.addEventListener("change", () => {

    // Get the currently active city button or default to "tous"
    const selectedCity = document.querySelector(".cities-filter__button.active")?.textContent.toLowerCase() || "tous";

    // Apply the filtering logic based on the selected theme and current city
    filterEvents(selectedCity, themeSelect.value);
  });
}
  
function filterEvents(city, theme) {
  const events = document.querySelectorAll(".events-grid article");
    
  events.forEach(event => {
    
    // Retrieve the city and label attributes for each event
    const eventCity = event.getAttribute("data-city");
    const eventTheme = event.getAttribute("data-label");
    
    // Check if the event matches the selected city and/or theme
    const cityMatch = (city === "tous" || eventCity === city);
    const themeMatch = (theme === "tous" || eventTheme === theme);
    
    // Show the event if it matches both filters, otherwise hide it
    event.style.display = (cityMatch && themeMatch) ? "block" : "none";
  });
}

function addMyAccountButtonListener(data){

  // Select the "Mon compte" button from the header
  const myAccountButton = document.querySelector("#app-header .my__account");
    
  // Add click event listener to the "Mon compte" button
  myAccountButton.addEventListener('click', (e) =>{
    
    // Prevent the default behavior of the button
    e.preventDefault();
            
    // Fetch and display the "Mon compte" page with the provided data
    fetchDisplayMyAccountPage(data);
        
    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
};