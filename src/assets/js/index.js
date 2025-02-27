import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
import { checkUserAuthentication } from "./auth.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";
import { fetchDisplayLegalInfoPage } from "./legal.info.page.js"; 
import { fetchDisplayPrivacyPage } from "./privacy.cookies.page.js";
import { fetchDisplaySiteMapPage } from "./site.map.page.js";
import { fetchDisplay404Page } from "./error.404.page.js";
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

  const state = {page: "Informations legales", initFunction: 'fetchDisplayLegalInfoPage'};
  const url = "/informations-légales";
  history.pushState(state, "", url);
});

// Select the footer button that, when clicked, will display the privacy protect data page.    
const footerPrivacyLink = document.querySelector("#data-protection");
  
footerPrivacyLink.addEventListener('click', (e) => {

  e.preventDefault();
  fetchDisplayPrivacyPage();

  const state = {page: "Protection des données", initFunction: 'fetchDisplayPrivacyPage'};
  const url = "/protection-des-donnees";
  history.pushState(state, "", url);
});

// Select the footer button that, when clicked, will display the site map page.    
const footerSiteMapLink = document.querySelector("#site-map");

footerSiteMapLink.addEventListener('click', (e) => {
  e.preventDefault();
  fetchDisplaySiteMapPage();

  const state = {page: "Plan du site", initFunction: 'fetchDisplaySiteMapPage'};
  const url = "/plan-du-site";
  history.pushState(state, "", url);
});

async function init() {
  try {

    // Verifies the JWT token and updates the UI
    const user = await checkUserAuthentication();

    // Gets the current path
    const path = window.location.pathname;

    // Define known routes
    const knownRoutes = [
      "/accueil",
      "connection",
      "/inscription",
      "/mon-compte",
      "/tableau-de-bord",
      "/informations-legales",
      "/protection-des-données",
      "/plan-du-site",
      "/404"
    ];

    // Checks if the current path is a known routess
    if (!knownRoutes.includes(path)) {

      // If the route is not known, display the 404 page
      fetchDisplay404Page();

      const state = { page: "404", initFunction: 'fetchDisplay404Page' };
      history.replaceState(state, "", "/404");
      return;
    }

    // Normal processing of known routes
    if (!user) {

      await fetchDisplayHomePageVisitor();

      const state = { page: "Accueil", initFunction: 'fetchDisplayHomePageVisitor' };
      const url = "/accueil";
      history.pushState(state, "", url);

    } else {

      // Displays the home page for authenticated users
      fetchDisplayHomePageConnected();

      const state = { page: "Tableau de bord", initFunction: 'fetchDisplayHomePageConnected' };
      const url = "/tableau-de-bord";
      history.pushState(state, "", url);
    }
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);

    // If initialization error occurs, display page 404
    fetchDisplay404Page();
    
    const state = { page: "404", initFunction: 'fetchDisplay404Page' };
    history.replaceState(state, "", "/404");
  }
};









