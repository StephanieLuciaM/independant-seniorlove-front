import { signIn } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";


export function fetchDisplaySigninPage(){
	// Reset the view template for the main content area
	resetViewTemplate('app-main');

	// Select the sign-in template from the DOM
	const contentTemplate = document.querySelector('#signin');

	// Clone the sign-in template
	const contentClone = contentTemplate.content.cloneNode(true);

	// Select the container where the clone will be appended
	const contentContainer = document.querySelector("#app-main");

	// Append the cloned template to the main content container
	contentContainer.appendChild(contentClone);

	// Select the form element within the cloned content
	const form = contentContainer.querySelector('form');

	// Add an event listener to handle the form submission
	form.addEventListener('submit', async (e) =>{
		e.preventDefault();
		const dataUser = Object.fromEntries(new FormData(form));

	// Attempt to sign in the user
	const onSign = await signIn(dataUser);

	// If sign-in is unsuccessful, exit the function
	if(!onSign){
		return;
	}
	
	// If sign-in is successful, display the connected home page
	fetchDisplayHomePageConnected();
	})
}