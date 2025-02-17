import { getLastEvent } from "./api.js";
import { fetchDisplaySigninPage } from "./signin.js"
import { fetchDisplaySignupForm } from "./signup.js";

export async function fetchDisplayHomePageVisitor(){

 

  // Select the header and content templates for the visitor home page
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

  // Add an event listener to the sign-in button
  const signinButton = headerContainer.querySelector('.header__nav-link');
  signinButton.addEventListener('click', (e)=> {
    e.preventDefault();
    fetchDisplaySigninPage();
  })

  const signupForm = contentContainer.querySelector('form');
  signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const dataUser = Object.fromEntries(new FormData(signupForm));
    fetchDisplaySignupForm(dataUser);
  })
   // Fetch the last event
   const events = await getLastEvent();

   if(!events){
     return;
   }
  
  // For each event, add it to the event container
  events.forEach(event =>{
    addEventContainer(event);
  })    
}

export function addEventContainer(data){
  
  // Select the event template
  const eventTemplate = document.querySelector("#event-template");

  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Populate the cloned template with event data
  eventClone.querySelector("[slot='city']").textContent = data.city
  eventClone.querySelector("[slot='description']").textContent = data.description

  // Select the container for the event list
  const eventContainer = document.querySelector("#events-list")
 
  // Append the cloned event template to the event list container
  eventContainer.appendChild(eventClone);
}