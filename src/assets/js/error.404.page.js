import { resetViewTemplate } from "./utils";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor";
import { checkUserAuthentication } from "./auth";
import { fetchDisplayHomePageConnected } from "./homepage.connected";

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

  goHomeLink.addEventListener('click', async (e) => {
    e.preventDefault();
       
    // Verifies the JWT token and updates the UI
    const user = await checkUserAuthentication();

    // Normal processing of known routes
    if (!user) {
      await fetchDisplayHomePageVisitor();
        
      const state = { page: "Accueil", initFunction: 'fetchDisplayHomePageVisitor' };
      const url = "/accueil";
      history.pushState(state, "", url);

    } else {
      // Displays the home page for authenticated users
      fetchDisplayHomePageConnected();
    }
  });
}

