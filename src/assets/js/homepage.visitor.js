import { getLastEvent } from "./api.js";
import { fetchDisplaySigninPage } from "./signin.js"
import { fetchDisplaySignupForm } from "./signup.js";
import { resetViewTemplate } from "./utils.js";


export async function fetchDisplayHomePageVisitor() {
  
  resetViewTemplate('app-header', 'app-main')
  // Append the header and content templates to the respective containers
  appendTemplates();
  // Add event listener to the sign-in button
  addSigninButtonListener();
  // Add event listener to the sign-up form
  addSignupFormListener();
  // Fetch the latest events and display them
  const events = await getLastEvent();
  if (events) {
    events.forEach(addEventContainer); // Add each event to the event container
  }

const state = {page: 1, initFunction: 'fetchDisplayHomePageVisitor'};
const title = "Page d'acceuil";
const url = "/acceuil";
history.pushState(state, title, url);
};


function appendTemplates() {
  // Select the header and content templates
  const headerTemplate = document.querySelector("#header-not-connected");
  const contentTemplate = document.querySelector("#home-page-visitor");

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

function addSigninButtonListener() {
  // Select the sign-in button in the header
  const signinButton = document.querySelector("#app-header .header__nav-link");
  
  // Add a click event listener to the sign-in button
  signinButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    fetchDisplaySigninPage(); // Call the function to display the sign-in page
  });
};

function addSignupFormListener() {
  // Select the sign-up form in the main content area
  const signupForm = document.querySelector("#app-main form");
  
  // Add a submit event listener to the sign-up form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const dataUser = Object.fromEntries(new FormData(signupForm)); // Convert form data to an object
    fetchDisplaySignupForm(dataUser); // Call the function to display the sign-up form
  });
};

export function addEventContainer(data){
  
  // Select the event template
  const eventTemplate = document.querySelector("#event-template");

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