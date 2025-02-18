import { signIn } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";

export function fetchDisplaySigninPage() {
	// Reset the view template for the main content area
	resetViewTemplate('app-main');
  
	// Append the sign-in template to the main content container
	appendSigninTemplate();
  
	// Add the event listener to the sign-in form
	addSigninFormListener();
};
  
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
};
  
async function handleSigninFormSubmit(e) {
	e.preventDefault();
	const form = e.target;
	const dataUser = Object.fromEntries(new FormData(form));
	console.log(dataUser)
	// Attempt to sign in the user
	const onSign = await signIn(dataUser);
  
	// If sign-in is unsuccessful, exit the function
	if (!onSign) {
	  return null;
	}
	
	// If sign-in is successful, display the connected home page
	fetchDisplayHomePageConnected(dataUser);
};
