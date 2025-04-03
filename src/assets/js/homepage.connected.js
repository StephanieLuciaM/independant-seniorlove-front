import { resetViewTemplate } from "./utils.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { getLastEventsMatch, getLastProfilesMatch } from "./api.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayConversationsList } from "./messages.js";
import { fetchDisplayProfilsPage } from "./profils.js";

export async function fetchDisplayHomePageConnected(data){
// Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  appendTemplatesConnedted();
  
  await new Promise(resolve => setTimeout(resolve, 100));

  addMyAccountButtonListener(data);
  addMessagesButtonListener(data);
  addEventsButtonListener(data);
  addProfilsButtonListener(data);
  

  // Fetch and display the latest matched profiles
  const profilsMatch = await getLastProfilesMatch();
  if(profilsMatch){
    profilsMatch.forEach(addProfilContainer);
  }

  // Fetch and display the latest matched events
  const eventsMatch = await getLastEventsMatch();
  if(eventsMatch){
    eventsMatch.forEach(addEventContainer);
  }
};

function appendTemplatesConnedted(){

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#home-page-connected");

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


export function addEventContainer(data){
  
  // Select the event template
  const eventTemplate = document.querySelector("#minimal-event");

  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Populate the cloned template with event data
  eventClone.querySelector("[slot='city']").textContent = data.city;
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name;

  // Select the container for the event list
  const eventContainer = document.querySelector("#events-list");
 
  // Append the cloned event template to the event list container
  eventContainer.appendChild(eventClone);
};

export function addProfilContainer(data){
  
  // Select the event template
  const profilTemplate = document.querySelector("#minimal-profil");

  // Clone the event template
  const profilClone = profilTemplate.content.cloneNode(true);

  // Populate the cloned template with event data
  profilClone.querySelector("[slot='firstname']").textContent = data.firstname;
  profilClone.querySelector("[slot='city']").textContent = data.city;
  profilClone.querySelector("[slot='age']").textContent = data.age;

  const pictureSlot = profilClone.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture;
  } else {
    console.error("Image de profil non trouvée dans le DOM.");
  }


  // Select the container for the event list
  const profilContainer = document.querySelector("#profiles-list");
 
  // Append the cloned event template to the event list container
  profilContainer.appendChild(profilClone);
};