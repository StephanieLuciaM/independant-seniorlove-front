import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
import { checkUserAuthentication } from "./auth.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";
import { fetchDisplayLegalInfoPage } from "./legal.info.page.js"; 
import { fetchDispayPrivacyPage } from "./privacy.cookies.page.js";
import { fetchDisplaySiteMapPage } from "./site.map.page.js";
import { popstate } from "./history.js";


// Function to initialize the application
window.addEventListener('popstate',(e) =>{
  popstate(e);
});
const initialState = {initFunction: 'fetchDisplayHomePageVisitor'};
history.replaceState(initialState, "", document.location.href);

init();

// Select the footer button that, when clicked, will display the legal info page.
const footerLegalLink = document.querySelector("#legal-info");

footerLegalLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetchDisplayLegalInfoPage();
})

// Select the footer button that, when clicked, will display the privacy protect data page.    
const footerPrivacyLink = document.querySelector("#data-protection");
  
footerPrivacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetchDispayPrivacyPage();
})

// Select the footer button that, when clicked, will display the site map page.    
const footerSiteMapLink = document.querySelector("#site-map");

footerSiteMapLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetchDisplaySiteMapPage();
})


async function init() {
  try {
    // Verify the JWT token and update the user interface
    const user = await checkUserAuthentication();
    // If the user is not authenticated, display the visitor home page
    if (!user) {
      await fetchDisplayHomePageVisitor();

      const state = {page: "Accueil", initFunction: 'fetchDisplayHomePageVisitor'};
    const url = "/accueil";
    history.pushState(state, "", url);
    } else {
      // Display the home page for authenticated users
      fetchDisplayHomePageConnected();

      const state = {page: "Tableau de bord", initFunction: 'fetchDisplayHomePageConnected'};
  	  const url = "/tableau-de-bord";
  	  history.pushState(state, "", url);
    }
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);
  }
};







