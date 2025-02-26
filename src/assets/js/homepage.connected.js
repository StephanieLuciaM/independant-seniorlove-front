import { resetViewTemplate } from "./utils.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { getLastEventsMatch, getLastProfilesMatch } from "./api.js";

export async function fetchDisplayHomePageConnected(data){
// Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  appendTemplatesConnedted();
  addMyAccountButtonListener(data);

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
  })
};

function addEventsButtonListener(data){
  // Select the "Évènements" button from the header
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
  })
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

  // Select the container for the event list
  const profilContainer = document.querySelector("#profiles-list");
 
  // Append the cloned event template to the event list container
  profilContainer.appendChild(profilClone);
};