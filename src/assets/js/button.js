import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";
import { fetchDisplayConversationsList } from "./messages.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplayProfilsPage } from "./profils.js";




export function addHearderLogoButtonListener(data) {
  // Select the logo button from the header
  const headerButton = document.querySelector(".header-connected__logo");
    
  // Check if the button exists before adding the event listener
  if (headerButton) {
    // Add click event listener to the logo button
    headerButton.addEventListener('click', (e) => {
      // Prevent the default behavior of the button
      e.preventDefault();
        
      // Fetch and display the connected homepage with the provided data
      fetchDisplayHomePageConnected(data);
      const state = {page: "Accueil", initFunction: 'fetchDisplayHomePageConnected'};
      const url = "/accueil";
      history.pushState(state, "", url);
    });
  } else {
    console.warn("Header logo button not found in the DOM");
  }
}

export function addMyAccountButtonListener(data){

  // Select the "Mon compte" button from the header
  const myAccountButton = document.querySelector("#app-header .my__account");
      
  // Add click profil listener to the "Mon compte" button
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
  
  
export function addMessagesButtonListener() {
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
  
export function addEventsButtonListener(data){
  
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

export function addProfilsButtonListener(data){

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