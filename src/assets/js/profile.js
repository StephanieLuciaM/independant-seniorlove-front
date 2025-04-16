import { resetViewTemplate } from "./utils.js";
import { fetchDisplayMessagesPage } from "./messages.js";
import { getMyAccount, getVisitorProfile } from "./api.js";
import { addEventsButtonListener, 
  addHearderLogoButtonListener, 
  addMessagesButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";



export async function fetchDisplayVisitorProfilePage(userData = null) {
  // Reset the view templates for header and main content to ensure a clean slate
  resetViewTemplate('app-header', 'app-main');
    
  let visitorProfile;
      
  // If userData is not provided, extract the user identifier from the URL and fetch the profile
  if (!userData) {
    const urlParts = window.location.pathname.split('/');
    const userIdentifier = urlParts[urlParts.length - 1]; // Extract the last part of the URL as the identifier
    visitorProfile = await getVisitorProfile(userIdentifier);
  } else {
    visitorProfile = userData; // Use the provided user data directly
  }
    
  // Handle the case where the visitor's profile could not be retrieved
  if (!visitorProfile) {
    console.error('No user profile found');
    return;
  }
    
  // Inject the visitor profile data into the appropriate templates
  appendTemplatesVisitorProfile(visitorProfile);
      
  // Attach event listeners to various buttons in the interface for user interaction
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
  addSendMessagesButtonListener();
}
  
function addSendMessagesButtonListener() {
  // Locate the main container where messages will be displayed
  const messagesPage = document.querySelector("#app-main");
          
  if (!messagesPage) {
    console.error('Main container not found');
    return;
  }
      
  messagesPage.addEventListener('click', async (e) => {
    // Identify if a "send message" button has been clicked
    const sendMessageButton = e.target.closest('.send-message-button') || 
                                e.target.id === 'send-message-button';
        
    if (!sendMessageButton) return;
        
    e.preventDefault();
  
    // Extract the profile ID of the visited user from the URL
    const urlParts = window.location.pathname.split('/');
    const userIdentifier = urlParts[urlParts.length - 1];
  
    // Retrieve both the visitor profile and the authenticated user’s account
    const visitorProfile = await getVisitorProfile(userIdentifier);
    const myAccount = await getMyAccount(userIdentifier);
  
    if (visitorProfile && myAccount) {
      // Define the sender and receiver IDs for the messaging system
      const receiverId = visitorProfile.id;
      const senderId = myAccount.id; // Adjust this as per the authentication logic
        
      // Load the messaging page and store state information
      fetchDisplayMessagesPage(senderId, receiverId);
        
      const state = {page: "Messages", initFunction: 'fetchDisplayMessagesPage'};
      const url = "/messages";
      history.pushState(state, "", url);
    } else {
      console.error('Unable to retrieve visitor profile');
    }
  });
}
   
function appendTemplatesVisitorProfile(data){
  // Locate the required templates for the visitor profile display
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#visitor-profile");
      
  if (!headerTemplate || !contentTemplate) {
    console.error('Header or content template not found');
    return;
  }
      
  // Clone templates and insert them into the page structure
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
      
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
    
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
    
  // Populate the profile with visitor information
  visitorProfile(contentContainer, data);
}
    
export function visitorProfile(display, data){
  // Ensure both display container and data are valid
  if (!display || !data) {
    console.error('Invalid display or data');
    return;
  }
    
  // Populate profile fields with safe null checks
  display.querySelector("[slot='firstname']").textContent = data.firstname || 'N/A';
  display.querySelector("[slot='age']").textContent = data.age ? `${data.age} years old` : 'N/A';
  display.querySelector("[slot='city-profil']").textContent = data.city || 'N/A';
  display.querySelector("[slot='description']").textContent = data.description || 'N/A';
    
  // Set the profile picture if the element exists
  const pictureProfile = display.querySelector(".profile-img");
  if (pictureProfile) {
    pictureProfile.src = data.picture;
  }
    
  // Display user labels if available
  const labelContainer = display.querySelector("#label-user");
  if (data.labels && data.labels.length > 0) {
    data.labels.forEach(label => {
      const labelTemplate = document.querySelector("#label");
      const labelClone = labelTemplate.content.cloneNode(true);
          
      labelClone.querySelector("[slot='labels']").textContent = label.name;
      labelClone.querySelector("[slot='labels']").dataset.id = label.id;
          
      labelContainer.appendChild(labelClone);
    });
  }
    
  // Populate additional profile details with safe defaults
  display.querySelector("[slot='height']").textContent = data.height || 'N/A';
  display.querySelector("[slot='smoker']").textContent = data.smoker !== undefined ? (data.smoker ? 'Yes' : 'No') : 'N/A';
  display.querySelector("[slot='marital']").textContent = data.marital || 'N/A';
  display.querySelector("[slot='zodiac']").textContent = data.zodiac || 'N/A';
  display.querySelector("[slot='pet']").textContent = data.pet !== undefined ? (data.pet ? 'Yes' : 'No') : 'N/A';
  display.querySelector("[slot='music']").textContent = data.music || 'N/A';
 // Update events sections (past and future)
 updateEvents(display, data);
}

// Separate function to handle event updates for cleaner organization
function updateEvents(display, data) {
  // Handle past events
  const pastEventsContainer = display.querySelector(".past-events");
  if (pastEventsContainer) {
    // Keep only the title element, remove all other content
    const pastEventsTitle = pastEventsContainer.querySelector('.events-title');
    while (pastEventsContainer.firstChild) {
      pastEventsContainer.removeChild(pastEventsContainer.firstChild);
    }
    pastEventsContainer.appendChild(pastEventsTitle);
    
    // Add past events dynamically from the data
    if (data.pastEvents && data.pastEvents.length > 0) {
      data.pastEvents.forEach(event => {
        const eventElement = createEventElement(event, data.city);
        pastEventsContainer.appendChild(eventElement);
      });
    } else {
      // Add message if no past events exist
      const noEventMessage = document.createElement('p');
      noEventMessage.textContent = 'Aucun événement passé';
      pastEventsContainer.appendChild(noEventMessage);
    }
  }
  
  // Handle upcoming events
  const upcomingEventsContainer = display.querySelector(".upcoming-events");
  if (upcomingEventsContainer) {
    // Keep only the title element, remove all other content
    const upcomingEventsTitle = upcomingEventsContainer.querySelector('.events-title');
    while (upcomingEventsContainer.firstChild) {
      upcomingEventsContainer.removeChild(upcomingEventsContainer.firstChild);
    }
    upcomingEventsContainer.appendChild(upcomingEventsTitle);
    
    // Add the future event if it exists
    if (data.futureEvent) {
      const eventElement = createEventElement(data.futureEvent, data.city, true);
      upcomingEventsContainer.appendChild(eventElement);
    } else {
      // Add message if no future events exist
      const noEventMessage = document.createElement('p');
      noEventMessage.textContent = 'Aucun événement à venir';
      upcomingEventsContainer.appendChild(noEventMessage);
    }
  }
}

// Utility function to create an event element with proper DOM structure
function createEventElement(event, city, isFuture = false) {
  // Create the main event container
  const eventDiv = document.createElement('div');
  eventDiv.className = 'past-event';
  
  // Create and set the city heading
  const cityHeading = document.createElement('h3');
  cityHeading.className = 'event-city';
  cityHeading.textContent = city || 'Ville non spécifiée';
  eventDiv.appendChild(cityHeading);
  
  // Create the link element that wraps the event details
  const eventLink = document.createElement('a');
  eventLink.href = '';
  
  // Create the container for event details
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'event-details';
  
  // Create and set the event image
  const img = document.createElement('img');
  img.src = `/src/assets/img/diverse-img/events/${event.picture}`;
  img.alt = event.title || 'Événement';
  img.className = 'event-img';
  detailsDiv.appendChild(img);
  
  // Create and set the event title
  const titleHeading = document.createElement('h3');
  titleHeading.className = isFuture ? 'event-description connected' : 'event-description';
  titleHeading.textContent = event.title || 'Sans titre';
  detailsDiv.appendChild(titleHeading);
  
  // Create and set the event theme/label
  const themeSpan = document.createElement('span');
  themeSpan.className = 'event-theme';
  themeSpan.textContent = event.label ? event.label.name : 'Thème non spécifié';
  detailsDiv.appendChild(themeSpan);
  
  // Assemble the complete structure
  eventLink.appendChild(detailsDiv);
  eventDiv.appendChild(eventLink);
  
  return eventDiv;
}

  









