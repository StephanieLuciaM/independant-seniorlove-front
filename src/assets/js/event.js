/* eslint-disable no-undef */
import { getEventDetails} from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { addEventsButtonListener, 
  addHearderLogoButtonListener,
  addMessagesButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";


export async function fetchDisplayEventPage(eventData = null) { 
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
   
  let eventDetails;
  // If no event data was passed as parameter, extract event ID from URL and fetch details
  if (!eventData) {
    const urlParts = window.location.pathname.split('/');
    const eventIdentifier = urlParts[urlParts.length - 1];
    eventDetails = await getEventDetails(eventIdentifier);
  
  } else {
    // If event data was provided as parameter, use it directly
    eventDetails = eventData;
  }
  if (!eventDetails) {
    console.error('No event details found');
    return;
  }
  
  // Append the events page templates with the fetched data
  appendTemplateEvent(eventDetails);
  
  // Get event ID either from the event details or from the URL
  const eventId = eventDetails.id || urlParts[urlParts.length - 1];
      
  // Setup event registration functionality and various button listeners
  setupEventRegistration(eventId);
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
    
  // Initialize map after a slight delay to ensure DOM elements are loaded
  setTimeout(() => {
    if (document.getElementById("map")) {
      // Build address string for Google Maps if all address components are available
      if (eventDetails.street_number && eventDetails.street && eventDetails.zip_code && eventDetails.city) {
        const fullAddress = `${eventDetails.street_number} ${eventDetails.street}, ${eventDetails.zip_code} ${eventDetails.city}, France`;
        initMap(fullAddress);
      } else {
        // Use only city name if complete address is not available
        initMap(eventDetails.city ? `${eventDetails.city}, France` : null);
      }
    } else {
      console.error("Élément map non trouvé après chargement du template");
    }
  }, 100);
    
};
  
function appendTemplateEvent(data) {
  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#your-event");
    
  if (!headerTemplate || !contentTemplate) {
    console.error('Header or content template not found');
    return;
  }
  
  // Clone the templates to create new DOM nodes without modifying the originals
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
    
      
  // Select the containers where the cloned templates will be inserted
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
    
    
  // Append the cloned templates to their respective containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
  
  // Fill in the event details in the newly created DOM structure
  eventDetails(contentContainer, data);
};
  
  
  
// Function to handle event registration, including checking if user is already registered
function setupEventRegistration() {
  const registerButton = document.querySelector('.event-inscription');
    
  if (registerButton) {
    // Get event ID from button's data attribute
    const eventId = registerButton.dataset.eventId;
      
    if (!eventId) {
      console.error("ID de l'événement non trouvé sur le bouton");
      return;
    }
      
    // Get user ID from local or session storage
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
    // Check if the user is already registered for this event
    if (userId) {
      const userEventsKey = `user_${userId}_events`;
      let userEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];
        
      if (userEvents.includes(eventId)) {
        // User is already registered, update button appearance
        registerButton.textContent = 'Inscrit';
        registerButton.disabled = true;
        registerButton.style.backgroundColor = '#cccccc';
      }
    }
      
    // Load participant count from localStorage
    const participantsKey = `event_${eventId}_participants`;
    const nombreParticipants = localStorage.getItem(participantsKey) || 0;
    document.querySelector("#nombreClics").textContent = nombreParticipants;
      
    // Add click event listener to handle registration
    registerButton.addEventListener('click', async () => {
      try {
        if (!eventId) {
          alert('Identifiant d\'événement introuvable.');
          return;
        }
          
        // Process registration if user is logged in
        if (userId) {
          // Call counting function to increment and store participant count
          comptage({ target: registerButton });
            
          // Additional actions after registration
          alert('Inscription validée !');
            
          // Update button appearance to show registered state
          registerButton.textContent = 'Inscrit';
          registerButton.disabled = true;
          registerButton.style.backgroundColor = '#cccccc';
        } else {
          alert('Veuillez vous connecter pour vous inscrire.');
        }
      } catch (error) {
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
        console.error(error);
      }
    });
  } else {
    console.error("Bouton d'inscription non trouvé");
  }
}
  
  
export async function eventDetails(display, data) {
  if (!display || !data) {
    console.error('Invalid display or data');
    return;
  }
  
  // Helper function to format ISO date to French format (DD-MM-YYYY)
  function formatDateToFrench(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Helper function to format time string to HH:MM format
  function formatTimeToFrench(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }
  
  // Update title element with event title
  const titleElement = display.querySelector("[slot='title']");
  if (titleElement) titleElement.textContent = data.title || 'N/A';
      
  // Set event image, using default image if no specific image is available
  const pictureElement = display.querySelector(".event-img");
  if (pictureElement) {
    const imagePath = data.picture ? 
      `/src/assets/img/diverse-img/events/${data.picture}` : 
      '/src/assets/img/diverse-img/events/default.jpg';
    pictureElement.src = imagePath;
  } else {
    console.error("Image element not found");
  }
  
  // Update description, label, and city elements
  const descriptionElement = display.querySelector("[slot='description']");
  if (descriptionElement) descriptionElement.textContent = data.description || 'N/A';
      
  const labelElement = display.querySelector("[slot='label']");
  if (labelElement && data.label) labelElement.textContent = data.label.name || 'N/A';
    
  const cityElement = display.querySelector("[slot='city']");
  if (cityElement) cityElement.textContent = data.city || 'N/A';
    
  // Set event ID as data attribute on registration button
  const inscriptionButton = display.querySelector('.event-inscription');
  if (inscriptionButton && data.id) {
    inscriptionButton.setAttribute('data-event-id', data.id);
  }
  
  // Format and update date
  const dateElement = display.querySelector("[slot='date']");
  if (dateElement) {
    const formattedDate = formatDateToFrench(data.date);
    dateElement.textContent = formattedDate || 'N/A';
  }
      
  // Format and update time
  const timeElement = display.querySelector("[slot='time']");
  if (timeElement) {
    const formattedTime = formatTimeToFrench(data.time);
    timeElement.textContent = formattedTime || 'N/A';
  }
  
  // Initialize map with full address if available, otherwise use city name
  if (data.street_number && data.street && data.zip_code && data.city) {
    const fullAddress = `${data.street_number} ${data.street}, ${data.zip_code} ${data.city}, France`;
    initMap(fullAddress);
  } else {
    // Use only city if complete address is not available
    initMap(data.city ? `${data.city}, France` : null);
  }
}
  
  
// Function to track and store event registration count
function comptage(event) {
  // Get event ID from the clicked button
  const bouton = event.target;
  const eventId = bouton.dataset.eventId;
    
  if (!eventId) {
    console.error("ID de l'événement non trouvé sur le bouton");
    return;
  }
    
  // Create unique key for storing participant count for this event
  const participantsKey = `event_${eventId}_participants`;
    
  // Get current participant count from localStorage or default to 0
  let nombreClics = parseInt(localStorage.getItem(participantsKey)) || 0;
    
  // Increment count
  nombreClics++;
    
  // Store updated count in localStorage
  localStorage.setItem(participantsKey, nombreClics);
    
  // Update display of participant count
  document.querySelector("#nombreClics").textContent = nombreClics;
    
  // Store that current user is registered for this event
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (userId) {
    const userEventsKey = `user_${userId}_events`;
    let userEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];
      
    // Add event to user's event list if not already present
    if (!userEvents.includes(eventId)) {
      userEvents.push(eventId);
      localStorage.setItem(userEventsKey, JSON.stringify(userEvents));
    }
  }
}
  
let map;
  
// Function to initialize Google Maps with a specific address
async function initMap(address = null) {
  // Check if map element exists in the DOM
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Élément map non trouvé dans le DOM");
    return;
  }
  
  try {
    // Import required Google Maps libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    const { Marker } = await google.maps.importLibrary("marker");
  
    // Create map with default position (Paris)
    map = new Map(mapElement, {
      center: { lat: 48.856614, lng: 2.3522219 }, // Paris as default center
      zoom: 14,
    });
  
    // If address is provided, use geocoder to find its coordinates
    if (address) {
      const geocoder = new Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
          // Center map on geocoded location
          map.setCenter(results[0].geometry.location);
            
          // Add marker at event location
          new Marker({
            map: map,
            position: results[0].geometry.location,
            title: "Lieu de l'événement"
          });
        } else {
          console.error("Échec du géocodage pour l'adresse:", address);
        }
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte:", error);
  }
}