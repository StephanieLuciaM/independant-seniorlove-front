/* eslint-disable no-undef */
import { getEventDetails, registerToEvent } from "./api.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayConversationsList } from "./messages.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplayProfilsPage } from "./profils.js";
import { resetViewTemplate } from "./utils.js";


export async function fetchDisplayEventPage(eventData = null) {
  console.log("Données de l'événement récupérées:", eventData);

  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
 
  let eventDetails;
  // Fetch 
  if (!eventData) {
    const urlParts = window.location.pathname.split('/');
    const eventIdentifier = urlParts[urlParts.length - 1];
    eventDetails = await getEventDetails(eventIdentifier);

  } else {
    eventDetails = eventData;
  }
  if (!eventDetails) {
    console.error('No event details found');
    return;
  }

  // Append the events page templates with the fetched data
  appendTemplateEvent(eventDetails);

  const eventId = eventDetails.id || urlParts[urlParts.length - 1];
    
  setupEventRegistration(eventId);
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
  
};

function appendTemplateEvent(data) {

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#your-event");
  
  if (!headerTemplate || !contentTemplate) {
    console.error('Header or content template not found');
    return;
  }

  // Clone the templates
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
  
    
  // Select the containers where the clones will be appended
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
  
  
  // Append the cloned templates to their respective containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);

  eventDetails(contentContainer, data);
};

function setupEventRegistration() {
  const registerButton = document.querySelector('.event-inscription');
  
  if (registerButton) {
    registerButton.addEventListener('click', async () => {
      try {
        // Récupérer l'ID utilisateur
        const eventId = registerButton.dataset.eventId;
        
    
        if (!eventId) {
          alert('Identifiant d\'événement introuvable.');
          return;
        }
        
        // Récupérer l'ID utilisateur
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        // Simple alerte de confirmation
        // eslint-disable-next-line no-undef
        alert('Inscription validée !');
        
        // Mettre à jour l'apparence du bouton
        registerButton.textContent = 'Inscrit';
        registerButton.disabled = true;
        registerButton.style.backgroundColor = '#cccccc';
      } catch (error) {
        // eslint-disable-next-line no-undef
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    });
  }
}


export async function eventDetails(display, data) {
  console.log("Données reçues dans eventDetails:", data);
  if (!display || !data) {
    console.error('Invalid display or data');
    return;
  }

  // Fonction pour formater la date au format français
  function formatDateToFrench(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fonction pour formater l'heure au format HH:MM
  function formatTimeToFrench(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  // Mise à jour des autres éléments
  const titleElement = display.querySelector("[slot='title']");
  if (titleElement) titleElement.textContent = data.title || 'N/A';
    
  const pictureElement = display.querySelector(".event-img");
  if (pictureElement) {
    const imagePath = data.picture ? 
      `/src/assets/img/diverse-img/events/${data.picture}` : 
      '/src/assets/img/diverse-img/events/default.jpg';
    pictureElement.src = imagePath;
    console.log("Setting image source to:", imagePath);
  } else {
    console.error("Image element not found");
  }

  const descriptionElement = display.querySelector("[slot='description']");
  if (descriptionElement) descriptionElement.textContent = data.description || 'N/A';
    
  const labelElement = display.querySelector("[slot='label']");
  if (labelElement && data.label) labelElement.textContent = data.label.name || 'N/A';
  
  const cityElement = display.querySelector("[slot='city']");
  if (cityElement) cityElement.textContent = data.city || 'N/A';
  
  const inscriptionButton = display.querySelector('.event-inscription');
  if (inscriptionButton && data.id) {
    inscriptionButton.setAttribute('data-event-id', data.id);
  }

  // Format et mise à jour de la date
  const dateElement = display.querySelector("[slot='date']");
  if (dateElement) {
    const formattedDate = formatDateToFrench(data.date);
    dateElement.textContent = formattedDate || 'N/A';
  }
    
  // Format et mise à jour de l'heure
  const timeElement = display.querySelector("[slot='time']");
  if (timeElement) {
    const formattedTime = formatTimeToFrench(data.time);
    timeElement.textContent = formattedTime || 'N/A';
  }
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
  
function addMessagesButtonListener() {
  // Select the "Messages" button from the header
  const messagesButton = document.querySelector("#app-header .header__nav-link-messages");
  
  // Add click event listener to the "Messages" button
  messagesButton.addEventListener('click', (e) => {
    // Prevent the default behavior of the button
    e.preventDefault();
      
    // Récupérer l'ID de l'utilisateur connecté
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
    // Appeler la fonction sans specifier otherUserId pour afficher la liste des conversations
    fetchDisplayConversationsList(currentUserId);
      
    const state = {page: "Conversations", initFunction: 'fetchDisplayConversationsList'};
    const url = "/conversations";
    history.pushState(state, "", url);
  });
}
   
function addProfilsButtonListener(data){
  
  // Select the "Évènements" button from the header
  const ProfilsButton = document.querySelector("#app-header .header__nav-link-profils");
  
  // Add click event listener to the "Évènements" button
  ProfilsButton.addEventListener('click', (e) =>{
  
    // Prevent the default behavior of the button
    e.preventDefault();
      
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayProfilsPage(data);
    const state = {page: "Profils", initFunction: 'fetchDisplayProfilsPage'};
    const url = "/profils";
    history.pushState(state, "", url);
  });
};

function addEventsButtonListener(data){

  // Select the "Évènements" button from the header
  const EventsButton = document.querySelector("#app-header .header__nav-link-events");
  
  // Add click event listener to the "Évènements" button
  EventsButton.addEventListener('click', (e) =>{
      
    // Prevent the default behavior of the button
    e.preventDefault();
      
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayEventsPage(data);
    const state = {page: "Évènements", initFunction: 'fetchDisplayEventsPage'};
    const url = "/evenements";
    history.pushState(state, "", url);
  });
};