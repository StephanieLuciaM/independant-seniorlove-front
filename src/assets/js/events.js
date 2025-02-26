import { resetViewTemplate } from "./utils.js";
import { getAllEvents } from "./api.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";

export async function fetchDisplayEventsPage(){

  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Append the events page templates with the fetched data
  appendTemplateEvents();

  // Fetch all events
  const allEvents = await getAllEvents();
  if(allEvents){
    allEvents.forEach(addEventsContainer);
  }

  // Add event listeners to the edit buttons

  addMyAccountButtonListener();  
};

function appendTemplateEvents(data){
  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#all-events-page");
    
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

export function addEventsContainer(data){
  
  // Select the event template
  const eventTemplate = document.querySelector("#event__events-page");
  
  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);
  
  // Populate the cloned template with event data
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name;
  
  // Select the container for the event list
  const eventContainer = document.querySelector(".events-grid");
   
  // Append the cloned event template to the event list container
  eventContainer.appendChild(eventClone);
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