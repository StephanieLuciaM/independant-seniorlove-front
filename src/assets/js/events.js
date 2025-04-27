import { resetViewTemplate } from "./utils.js";
import { getAllEvents, getEventDetails } from "./api.js";
import { fetchDisplayEventPage } from "./event.js";
import { addHearderLogoButtonListener,
  addMessagesButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";



/**
 * Main function to fetch and display the events page
 * Initializes the page, loads all events, and sets up navigation and filtering
 */
export async function fetchDisplayEventsPage() {

  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Append the events page templates with the fetched data
  appendTemplateEvents();
  
  // Fetch all events from the API
  const allEvents = await getAllEvents();
  if (allEvents) {
    allEvents.forEach(addEventsContainer); 
  }

  // Initialize event filters for city and theme
  setupFilters();

  // Add event listeners to all navigation buttons
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addProfilsButtonListener();
  addEventButtonListener();
  
};

/**
 * Sets up event listeners for event detail buttons
 * When a user clicks on an event's "more" button, it fetches details and navigates to the event page
 */
function addEventButtonListener() {
  const eventsPage = document.querySelector('#app-main');
  
  if (!eventsPage) {
    console.error('Main container not found');
    return;
  }
  
  eventsPage.addEventListener('click', async (event) => {
    const eventButton = event.target.closest('.more-btn');
    
    if (!eventButton) return;
    
    event.preventDefault();
    
    const eventElement = eventButton.closest('article.event');
    
    if (!eventElement) {
      return;
    }
    
    // Get event identification from data attributes
    const eventSlug = eventElement.dataset.eventSlug;
    const eventId = eventElement.dataset.eventId;
    
    const eventIdentifier = eventSlug || eventId;
    
    if (!eventIdentifier) {
      console.error('No event found');
      return;
    }
    
    try {
      // Fetch detailed event data for the selected event
      const eventData = await getEventDetails(eventIdentifier);
      
      if (!eventData) {
        throw new Error('Unable to retrieve event data');
      }
      
      // Display the event detail page with the fetched data
      await fetchDisplayEventPage(eventData);
      
      // Update browser history for proper navigation
      const state = {
        page: "event", 
        initFunction: 'fetchDisplayEventPage'
      };
      
      const url = `/event/${eventIdentifier}`;
      history.pushState(state, "", url);
      
    } catch (error) {
      console.error('Error handling event:', error);
    }
  });
}

/**
 * Appends the header and events page templates to the DOM
 * Creates the basic structure of the events page before populating with data
 */
function appendTemplateEvents() {

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#all-events-page");
  
  // Clone the templates to avoid modifying the original templates
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
  
  // Select the containers where the clones will be appended
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
  
  // Append the cloned templates to their respective containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
};

/**
 * Creates and adds an event card to the grid
 * Populates each card with data from the API and sets data attributes for filtering
 * @param {Object} data - The event data from the API
 */
export function addEventsContainer(data) {
  // Select the event template from the DOM
  const eventTemplate = document.querySelector("#event__events-page");
    
  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Set data attributes for filtering
  eventClone.querySelector("article").setAttribute("data-city", data.city.toLowerCase());
  eventClone.querySelector("article").setAttribute("data-label", data.label.name.toLowerCase());
  
  // Add unique identifiers for each event for navigation purposes
  eventClone.querySelector("article").setAttribute("data-event-id", data.id);
  eventClone.querySelector("article").setAttribute("data-event-slug", data.slug);
  
  // Populate the cloned template with event data
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name; 
  eventClone.querySelector("[slot='picture']").setAttribute('src', `./src/assets/img/diverse-img/events/${data.picture}`);
 
  // Select the container for the event list and append the new event
  const eventContainer = document.querySelector(".events-grid");
  eventContainer.appendChild(eventClone);
};

/**
 * Sets up filtering functionality for events
 * Adds event listeners to city buttons and theme dropdown
 */
function setupFilters() {
    
  const cityButtons = document.querySelectorAll(".cities-filter__button");
  const themeSelect = document.querySelector("#theme");
  
  // Add click event listeners to each city button
  cityButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Get the selected city from the button text
      const selectedCity = button.textContent.toLowerCase();

      // Apply the filtering logic based on the selected city and current theme
      filterEvents(selectedCity, themeSelect.value);
    });
  });
    
  // Add change event listener to the theme dropdown
  themeSelect.addEventListener("change", () => {

    // Get the currently active city button or default to "tous" (all)
    const selectedCity = document.querySelector(".cities-filter__button.active")?.textContent.toLowerCase() || "tous";

    // Apply the filtering logic based on the selected theme and current city
    filterEvents(selectedCity, themeSelect.value);
  });
}
  
/**
 * Filters events based on selected city and theme
 * Shows only events that match both filters
 * @param {string} city - The selected city to filter by
 * @param {string} theme - The selected theme to filter by
 */
function filterEvents(city, theme) {
  const events = document.querySelectorAll(".events-grid article");
    
  // Loop through each event and apply filtering
  events.forEach(event => {
    
    // Retrieve the city and label attributes for each event
    const eventCity = event.getAttribute("data-city");
    const eventTheme = event.getAttribute("data-label");
    
    // Check if the event matches the selected city and/or theme
    // If "tous" (all) is selected, match all events for that filter
    const cityMatch = (city === "tous" || eventCity === city);
    const themeMatch = (theme === "tous" || eventTheme === theme);
    
    // Show the event if it matches both filters, otherwise hide it
    event.style.display = (cityMatch && themeMatch) ? "block" : "none";
  });
}