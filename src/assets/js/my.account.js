import { deleteMyAccount, getMyAccount} from "./api.js";
import { showConfirmationDialog } from "./handling.error.js";
import { showSuccessMessage } from "./handling.error.js";
import { showErrorMessage } from "./handling.error.js";
import { showCancelAction } from "./handling.error.js";
import { resetViewTemplate } from "./utils.js";
import { 
  fetchDisplayEditInfoPage,
  fetchDisplayEditIntroPage,
  fetchDisplayEditLabelPage,
  fetchDisplayEditPersonalPage 
} from "./edit.account.js";
import {  logOutMyAccount } from "./api.js";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
import { addEventsButtonListener, 
  addHearderLogoButtonListener, 
  addMessagesButtonListener, 
  addProfilsButtonListener } from "./button.js";

  const DEFAULT_PROFILE_PHOTO = "/assets/img/diverse-img/profils/default-avatar.png";

export async function fetchDisplayMyAccountPage(){

  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  // Fetch the user account information
  const myAccount = await getMyAccount();

  // Append the user account templates with the fetched data
  appendTemplatesMyAccount(myAccount);
  
  // Add event listeners to the edit buttons
  addHearderLogoButtonListener();
  addEditButtonsListener();
  addDeleteButtonListener();
  addLogOutButtonListener();
  addMessagesButtonListener();
  addEventsButtonListener();
  addProfilsButtonListener();
};


function appendTemplatesMyAccount(data){
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");
  

  headerContainer.innerHTML = '';
  contentContainer.innerHTML = '';
  
  const headerTemplate = document.querySelector("#header-my-account");
  const contentTemplate = document.querySelector("#my-account");
  
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);
  
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);

  myAccount(contentContainer, data);
};

function addEditButtonsListener() {

  // Select all edit buttons within the main content area
  const editButtons = document.querySelectorAll("#app-main .edit-modal");

  // Add click event listeners to the edit buttons based on their classes
  editButtons.forEach((button) =>{
    if(button.classList.contains('edit-info')){
      button.addEventListener('click', handleEditInfo);
    }else if(button.classList.contains('edit-intro')){
      button.addEventListener('click', handleEditIntro);
    }else if(button.classList.contains('edit-label')){
      button.addEventListener('click', handleEditLabel);
    }else{
      button.addEventListener('click', handleEditPersonal);
    }
  });
};
   
// Function to handle the account deletion process
export async function handleDeleteAccount() {
  try {
    //Show confirmation dialog and wait for user response
    const confirmation = await showConfirmationDialog();

    if (confirmation.isConfirmed) {
      // The user confirmed the deletion

      // Call the function to delete the user account
      const deleteUser = await deleteMyAccount();

      if (deleteUser) {
        //Deletion was successful, show success message
        await showSuccessMessage();
      } else {
        // Deletion failed, display error message
        showErrorMessage('Il y a eu un problème lors de la suppression de votre compte. Veuillez réessayer plus tard.');
      }
    } else {
      // User canceled deletion, show cancellation message
      showCancelAction();
    }
  } catch (error) {
    // Handling unexpected errors
    console.error('Erreur lors de la suppression du compte:', error);
    showErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
  }
};

export function addDeleteButtonListener() {
  // Delete button CSS selector. Make sure it matches your HTML.
  const deleteButton = document.querySelector("#app-main .delete-account");

  if (!deleteButton) {
    console.error('Bouton de suppression introuvable!');
    return;
  }

  // Add click event listener to delete button
  deleteButton.addEventListener('click', async () => {
    await handleDeleteAccount();
  });
};

function addLogOutButtonListener(){
  
  const logOutButton = document.querySelector('#app-header .logout');

  logOutButton.addEventListener('click', async () =>{
    
    const logOutUser = await logOutMyAccount();

    if (!logOutUser) {
      return null;
    }

    fetchDisplayHomePageVisitor();
    const state = {page: "Accueil", initFunction: 'fetchDisplayHomePageVisitor'};
    const url = "/accueil";
    history.pushState(state, "", url);
  });
};

function handleEditInfo(){

  // Fetch and display the edit info page
  fetchDisplayEditInfoPage();

  const state = {page: "Mon compte modification", initFunction: 'fetchDisplayEditInfoPage'};
  const url = "/mon-compte/modification";
  history.pushState(state, "", url);
};

function handleEditIntro(){

  // Fetch and display the edit intro page
  fetchDisplayEditIntroPage();

  const state = {page: "Mon compte modification", initFunction: 'fetchDisplayEditIntroPage'};
  const url = "/mon-compte/modification";
  history.pushState(state, "", url);
};

function handleEditLabel(){

  // Fetch and display the edit label page
  fetchDisplayEditLabelPage();


  const state = {page: "Mon compte modification", initFunction: 'fetchDisplayEditLabelPage'};
  const url = "/mon-compte/modification";
  history.pushState(state, "", url);
};

function handleEditPersonal(){
  
  // Fetch and display the edit personal page
  fetchDisplayEditPersonalPage();

  const state = {page: "Mon compte modification", initFunction: 'fetchDisplayEditPersonalPage'};
  const url = "/mon-compte/modification";
  history.pushState(state, "", url);
};

export async function myAccount(display, data) {
  // Set user information from the data object to their respective slots in the display
  display.querySelector("[slot='firstname']").textContent = data.firstname;
  display.querySelector("[slot='age']").textContent = data.age ? `${data.age} ans` : 'N/A';
  display.querySelector("[slot='city-profil']").textContent = data.city;
  display.querySelector("[slot='description']").textContent = data.description;

  // Set the profile picture if the element exists
  const pictureProfile = display.querySelector(".profile-img");
  if (pictureProfile) {
    pictureProfile.src = data.picture;
  }

  if (!data.profile_photo_url) {
    data.profile_photo_url = DEFAULT_PROFILE_PHOTO;
  }

  // Clear and populate the user's interest labels
  const labelContainer = document.querySelector("#label-user");
  labelContainer.innerHTML = ''; // Clear existing labels
  
  data.labels.forEach(label => {
    const labelTemplate = document.querySelector("#label");
    const labelClone = labelTemplate.content.cloneNode(true);
    
    labelClone.querySelector("[slot='labels']").textContent = label.name;
    labelClone.querySelector("[slot='labels']").dataset.id = label.id;
    
    labelContainer.appendChild(labelClone);
  });

  // Set general user information
  display.querySelector("[slot='height']").textContent = data.height;
  display.querySelector("[slot='smoker']").textContent = data.smoker;
  display.querySelector("[slot='marital']").textContent = data.marital;
  display.querySelector("[slot='zodiac']").textContent = data.zodiac;
  display.querySelector("[slot='pet']").textContent = data.pet;
  display.querySelector("[slot='music']").textContent = data.music;
  
  // Update events sections (past and future)
  updateEvents(display, data);
};

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
};

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
  img.src = `/assets/img/diverse-img/events/${event.picture}`;
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
};





