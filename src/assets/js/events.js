import { resetViewTemplate } from "./utils.js";
// import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
// import { getAllEvents, logOutMyAccount } from "./api.js";

export async function fetchDisplayEventsPage(){
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Fetch all events
//   const allEvents = await getAllEvents();
  
  // Append the user account templates with the fetched data
  appendTemplateEvents();
    
  // Add event listeners to the edit buttons
//   addEditButtonsListener();
//   addDeleteButtonListener();
//   addLogOutButtonListener();  
};

function appendTemplateEvents(){
  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-my-account");
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
  
    
  
  // Populate the content with the user data
//   allEvents(contentContainer, data);
};