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
   // Select the signup form within the main area
  const signupForm = document.querySelector("#app-main form");
  
   // Add a 'submit' event listener to the signup form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const dataUser = Object.fromEntries(new FormData(signupForm));
    
     // Check if the age is less than 60
    if (dataUser.age < 60) {
      Swal.fire({
        icon: 'warning',
        title: 'Âge insuffisant',
        text: 'Vous devez avoir au moins soixante ans pour vous inscrire.',
        confirmButtonText: 'Compris'
      });
      return; 
    }
    
    // If the age is valid, proceed with the submission (e.g., call a function)
    fetchDisplaySignupForm(dataUser);
  });
}

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


// display of the legal information page.
function displayLegalInfoPage() {
  // Select the template element that contains the legal information.
  const templateLegalInformation = document.querySelector("#legal-info-template");
  
  // Select the main content container where the template content will be inserted.
  const contentContainer = document.querySelector("#app-main");
  
  // Select the footer button that, when clicked, will display the legal information.
  const footerButton = document.querySelector("#legal-info");
  
  
  //handler for the footer button click event.
  footerButton.addEventListener('click', () => {
  // Reset or clear the current view/content inside the main content container.
    resetViewTemplate('app-main');
    
    // Clone the content of the legal information template.
    // Using 'true' ensures that the cloning is deep, meaning all child nodes are copied.
    const contentClone = templateLegalInformation.content.cloneNode(true);
    
    // Append the cloned content to the main content container.
    contentContainer.appendChild(contentClone);
  });
}

// Invoke the function to set up the event listener and initialize functionality.
displayLegalInfoPage();


// display of the Privacy and Cookies page.
function displayPrivacyAndCookiesPage() {
  // Select the template element that contains the privacy and cookies information.
  const templatePrivacy = document.querySelector("#data-protection-template");
  
  // Select the main content container where the template content will be inserted.
  const contentContainer = document.querySelector("#app-main");
  
  // Select the footer button that, when clicked, will display the privacy and cookies information.
  const footerButton = document.querySelector("#data-protection");
    
  //handler for the footer button click event.
  footerButton.addEventListener('click', () => {
    // Reset or clear the current view/content inside the main content container.
    resetViewTemplate('app-main');
    
    // Clone the content of the privacy and cookies template.
    // Using 'true' ensures that the cloning is deep, meaning all child nodes are copied.
    const contentClone = templatePrivacy.content.cloneNode(true);
    
    // Append the cloned content to the main content container.
    contentContainer.appendChild(contentClone);
  });
}

// Invoke the function to set up the event listener and initialize functionality.
displayPrivacyAndCookiesPage();




// display of the site map page.
function displaySiteMapPage() {
  // Select the template element that contains the site map.
  const templateSiteMap = document.querySelector("#site-map-template");
  
  // Select the main content container where the template content will be inserted.
  const contentContainer = document.querySelector("#app-main");
  
  // Select the footer button that, when clicked, will display the site map.
  const footerButton = document.querySelector("#site-map");
  
  
  //handler for the footer button click event.
  footerButton.addEventListener('click', () => {
    // Reset or clear the current view/content inside the main content container.
    resetViewTemplate('app-main');
    
    // Clone the content of the sitmap template.
    // Using 'true' ensures that the cloning is deep, meaning all child nodes are copied.
    const contentClone = templateSiteMap.content.cloneNode(true);
    
    // Append the cloned content to the main content container.
    contentContainer.appendChild(contentClone);
  });
}

// Invoke the function to set up the event listener and initialize functionality.
displaySiteMapPage();
