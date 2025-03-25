import { resetViewTemplate } from "./utils.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayMessagesPage } from "./messages.js";
import { fetchDisplayProfilsPage } from "./profils.js";
import { fetchDisplayMyAccountPage, myAccount } from "./my.account.js";
import { getMyAccount, getVisitorProfile } from "./api.js";



export async function fetchDisplayVisitorProfilePage(userData = null) {
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  let visitorProfile;
    
  // If userData is not provided, fetch it
  if (!userData) {
    const urlParts = window.location.pathname.split('/');
    const userIdentifier = urlParts[urlParts.length - 1];
    visitorProfile = await getVisitorProfile(userIdentifier);
  } else {
    visitorProfile = userData;
  }
  
  if (!visitorProfile) {
    console.error('No user profile found');
    return;
  }
  
  // Append the user account templates with the fetched data
  appendTemplatesVisitorProfile(visitorProfile);
    
  // Add event listeners to the edit buttons
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
  addSendMessagesButtonListener();
}

function addSendMessagesButtonListener() {
  const messagesPage = document.querySelector("#app-main");
        
  if (!messagesPage) {
    console.error('Conteneur principal non trouvé');
    return;
  }
    
  messagesPage.addEventListener('click', async (e) => {
    const sendMessageButton = e.target.closest('.send-message-button') || 
                              e.target.id === 'send-message-button';
      
    if (!sendMessageButton) return;
      
    e.preventDefault();

    // Récupérer l'ID du profil visité depuis l'URL
    const urlParts = window.location.pathname.split('/');
    const userIdentifier = urlParts[urlParts.length - 1];

    // Récupérer le profil du visiteur
    const visitorProfile = await getVisitorProfile(userIdentifier);
    const myAccount = await getMyAccount(userIdentifier);

    if (visitorProfile && myAccount) {
      // L'utilisateur sur le profil duquel on clique est le receiver
      const receiverId = visitorProfile.id;
      
      // Récupérer l'ID de l'utilisateur connecté (à adapter selon votre système d'authentification)
      const senderId = myAccount.id; // À remplacer par la logique de récupération de l'ID connecté

      fetchDisplayMessagesPage(senderId, receiverId);
      
      const state = {page: "Messages", initFunction: 'fetchDisplayMessagesPage'};
      const url = "/messages";
      history.pushState(state, "", url);
    } else {
      console.error('Impossible de récupérer le profil du visiteur');
    }
  });
}
 
function appendTemplatesVisitorProfile(data){
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#visitor-profile");
    
  if (!headerTemplate || !contentTemplate) {
    console.error('Header or content template not found');
    return;
  }
    
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
    
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
  
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
  
  // Safely check and populate profile
  visitorProfile(contentContainer, data);
}
  
export function visitorProfile(display, data){
  if (!display || !data) {
    console.error('Invalid display or data');
    return;
  }
  
  // Add null checks for each field
  display.querySelector("[slot='firstname']").textContent = data.firstname || 'N/A';
  display.querySelector("[slot='age']").textContent = data.age ? `${data.age} ans` : 'N/A';
  display.querySelector("[slot='city-profil']").textContent = data.city || 'N/A';
  display.querySelector("[slot='description']").textContent = data.description || 'N/A';
  
  const pictureSlot = display.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture || './default-profile.png';
  }
  
  // Labels handling
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
  
  // Other profile details with null checks
  display.querySelector("[slot='height']").textContent = data.height || 'N/A';
  display.querySelector("[slot='smoker']").textContent = data.smoker !== undefined ? (data.smoker ? 'Oui' : 'Non') : 'N/A';
  display.querySelector("[slot='marital']").textContent = data.marital || 'N/A';
  display.querySelector("[slot='zodiac']").textContent = data.zodiac || 'N/A';
  display.querySelector("[slot='pet']").textContent = data.pet !== undefined ? (data.pet ? 'Oui' : 'Non') : 'N/A';
  display.querySelector("[slot='music']").textContent = data.music || 'N/A';
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

function addMessagesButtonListener(data){

  // Select the "Évènements" button from the header
  const messagesButton = document.querySelector("#app-header .header__nav-link-messages");

  // Add click event listener to the "Évènements" button
  messagesButton.addEventListener('click', (e) =>{

    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayMessagesPage(1,2);
    const state = {page: "Messages", initFunction: 'fetchDisplayMessagesPage'};
    const url = "/messages";
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
