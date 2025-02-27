import { resetViewTemplate } from "./utils";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor";

// Function to reset the view and display the privacy ande cookies page 
export async function fetchDisplay404Page() {
    resetViewTemplate('app-main');
    // Append the content template to the container
    appendTemplate();
}
  
function appendTemplate(){

    // Select the content template
    const contenteTemplate = document.querySelector("#page-404-template");
  
    // Clone the template
    const contentClone = contenteTemplate.content.cloneNode(true);
  
    // Select the container where the clone will be appended
    const contentContainer = document.querySelector("#app-main");
    
    // Append the cloned template to their container
    contentContainer.appendChild(contentClone);

    // Listen for the link click event to return to the home page
    const goHomeLink = contentContainer.querySelector('a[data-link]');

    goHomeLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({ initFunction: 'fetchDisplayHomePageVisitor' }, '', '/');
        fetchDisplayHomePageVisitor();
    });
}

