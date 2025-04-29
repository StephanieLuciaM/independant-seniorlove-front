import { signIn } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";
import { validateFormSignin } from "./handling.error.js";
import { showErrorMessage } from "./handling.error.js";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";


export function fetchDisplaySigninPage() {

  // Reset the view template for the main content area
  resetViewTemplate('app-main');
  
  appendHeaderTemplate();

  // Append the sign-in template to the main content container
  appendSigninTemplate();
  
  // Add the event listener to the sign-in form
  addSigninFormListener();

  addHearderLogoButtonListener(); 

};

function appendHeaderTemplate() {
  const headerContainer = document.querySelector("#app-header");
  
  if (headerContainer) {
    
    headerContainer.innerHTML = "";

    const headerTemplate = document.querySelector('#header-not-connected');
    if (headerTemplate) {
      const headerClone = headerTemplate.content.cloneNode(true);
      headerContainer.appendChild(headerClone);
    } else {
      console.warn("Header template not found in the DOM.");
    }
  } else {
    console.warn("Header container not found in the DOM.");
  }
}
;
  
function appendSigninTemplate() {

  // Select the sign-in template from the DOM
  const contentTemplate = document.querySelector('#signin');
  
  // Clone the sign-in template
  const contentClone = contentTemplate.content.cloneNode(true);
  
  // Select the container where the clone will be appended
  const contentContainer = document.querySelector("#app-main");
  
  // Append the cloned template to the main content container
  contentContainer.appendChild(contentClone);
};
  
function addSigninFormListener() {

  // Select the form element within the cloned content
  const form = document.querySelector("#app-main form");
  
  // Add an event listener to handle the form submission
  form.addEventListener('submit', handleSigninFormSubmit);

  // Add the password toggle listener
  addPasswordToggleListener();
};

async function handleSigninFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const dataUser = Object.fromEntries(new FormData(form));

  // Validate data before attempting to connect
  if (!validateFormSignin(dataUser)) {

    //if error in connection informations
    showErrorMessage('Veuillez renseigner correctement vos données de connexion.');
    return;
  };

  // Attempt to sign in the user
  const onSign = await signIn(dataUser);

  console.log("Réponse de signIn:", onSign);
	
  // If sign-in is unsuccessful, exit the function
  if (!onSign) {
	  return null;
  };

  localStorage.setItem('userId', onSign.userId); 

  fetchDisplayHomePageConnected(dataUser);
  const state = {initFunction: 'fetchDisplayHomePageConnected'};
  	const url = "/accueil";
  	history.pushState(state, "", url);
};

function addPasswordToggleListener() {

  // Select the toggle password icon and the password input
  const togglePassword = document.querySelector('#togglePassword');
  const passwordField = document.querySelector('#password');
  
  if (togglePassword) {
	  togglePassword.addEventListener('click', function () {

      // Check if the password is currently hidden (type="password")
      const isPasswordHidden = passwordField.getAttribute('type') === 'password';

      // Toggle the input field type between 'password' and 'text'
      passwordField.setAttribute('type', isPasswordHidden ? 'text' : 'password');
  
      // Select the icon inside the toggle button
      const icon = this.querySelector('i');
  
      // Toggle the icon between an open eye (visible) and a slashed eye (hidden)
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
	  });
  }
};

function addHearderLogoButtonListener() { 
  const headerButton = document.querySelector(".header__logo").parentElement;
 
  
  if (headerButton) { 
    headerButton.addEventListener('click', (e) => {
      e.preventDefault();
      fetchDisplayHomePageVisitor();
      const state = {page: "Page d'accueil", initFunction: 'fetchDisplayHomePageVisitor'};
      const url = "/accueil";
      history.pushState(state, "", url);
    });
  } else {
    console.warn("Header logo button not found in the DOM");
  }
};


  
