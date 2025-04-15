import { resetViewTemplate } from "./utils.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { getLastEventsMatch, getLastProfilesMatch } from "./api.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayConversationsList } from "./messages.js";
import { fetchDisplayProfilsPage } from "./profils.js";


export async function fetchDisplayHomePageConnected(data) {
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  appendTemplatesConnedted();
  
  await new Promise(resolve => setTimeout(resolve, 100));

  addMyAccountButtonListener(data);
  addMessagesButtonListener();
  addEventsButtonListener(data);
  addProfilsButtonListener(data);
 
  try {
    // Fetch and display the latest matched profiles
    const profilsMatch = await getLastProfilesMatch();
    const profilesListContainer = document.querySelector("#profiles-list");
    
    if (profilsMatch && profilesListContainer) {
      profilsMatch.forEach(addProfilContainer);
    }
  } catch (error) {
    console.error("Error loading profile matches:", error);
  }

  try {
    // Fetch and display the latest matched events
    const eventsMatch = await getLastEventsMatch();
    const eventsListContainer = document.querySelector("#events-list");
    
    if (eventsMatch && eventsListContainer) {
      eventsMatch.forEach(addEventContainer);
    }
  } catch (error) {
    console.error("Error loading event matches:", error);
  }
}


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


export function addEventContainer(data) {
  // Select the event template
  const eventTemplate = document.querySelector("#minimal-event");
  if (!eventTemplate) {
    console.log("Template #minimal-event not found in the DOM");
    return; // Sortir de la fonction si le template n'existe pas
  }

  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Populate the cloned template with event data
  eventClone.querySelector("[slot='city']").textContent = data.city;
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name;
  eventClone.querySelector("[slot='picture']").setAttribute('src', `./src/assets/img/diverse-img/events/${data.picture}`);
  // Select the container for the event list
  const eventContainer = document.querySelector("#events-list");
  if (!eventContainer) {
    console.log("Container #events-list not found in the DOM");
    return; // Sortir de la fonction si le conteneur n'existe pas
  }
 
  // Append the cloned event template to the event list container
  eventContainer.appendChild(eventClone);
}

export function addProfilContainer(data) {
  const profilTemplate = document.querySelector("#minimal-profil");

  if (!profilTemplate) {
    console.log("Template #minimal-profil not found in the DOM");
    return;
  }

  const profilClone = profilTemplate.content.cloneNode(true);

  profilClone.querySelector("[slot='firstname']").textContent = data.firstname;
  profilClone.querySelector("[slot='city']").textContent = data.city;
  profilClone.querySelector("[slot='age']").textContent = data.age;

  const pictureSlot = profilClone.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture;
  } else {
    console.log("Profile picture element not found in the DOM");
  }

  const profilContainer = document.querySelector("#profiles-list");
  if (!profilContainer) {
    console.log("Container #profiles-list not found in the DOM");
    return;
  }

  profilContainer.appendChild(profilClone);
}
