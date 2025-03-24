import { resetViewTemplate } from "./utils.js";
import { getAllProfilsMatch, getVisitorProfile } from "./api.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayMessagesPage } from "./messages.js";
import { fetchDisplayVisitorProfilePage } from "./profile.js";


export async function fetchDisplayProfilsPage() {
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Append the profils page templates with the fetched data
  appendTemplateProfils();
  
  // Fetch all profils Match
  const allProfilsMatch = await getAllProfilsMatch();
  if (allProfilsMatch) {
    allProfilsMatch.forEach(addProfilsContainer);
  }
  
  // Initialize profils filters
  setupFilters();
  
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addEventsButtonListener();
  
  // Ajoutez l'écouteur APRÈS avoir ajouté les profils
  addProfileButtonListener();
}
 
function addProfileButtonListener() {
  const profilsPage = document.querySelector('#app-main');
  
  if (!profilsPage) {
    console.error('Conteneur principal non trouvé');
    return;
  }
  
  profilsPage.addEventListener('click', async (event) => {
    const profileButton = event.target.closest('.more-btn');
    
    if (!profileButton) return;
    
    event.preventDefault();
    
    const profilElement = profileButton.closest('.profil');
    
    if (!profilElement) {
      console.error('Élément de profil parent non trouvé');
      return;
    }
    
    const userSlug = profilElement.dataset.userSlug;
    const userId = profilElement.dataset.userId;
    
    const userIdentifier = userSlug || userId;
    
    if (!userIdentifier) {
      console.error('Aucun identifiant utilisateur trouvé');
      return;
    }
    
    try {
      const userData = await getVisitorProfile(userIdentifier);
      
      if (!userData) {
        throw new Error('Impossible de récupérer les données du profil');
      }
      
      await fetchDisplayVisitorProfilePage(userData);
      
      const state = {
        page: "visitor-profile", 
        initFunction: 'fetchDisplayVisitorProfilePage'
      };
      
      const url = `/visitor-profile/${userIdentifier}`;
      history.pushState(state, "", url);
      
    } catch (error) {
      console.error('Erreur lors de la gestion du profil:', error);
    }
  });
}

function appendTemplateProfils() {

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#all-profils-page");
  
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

  
// Enhanced version of addProfilsContainer to include additional data attributes
export function addProfilsContainer(data) {
  // Select the profil template from the DOM
  const profilTemplate = document.querySelector("#profil__profils-page");
    
  // Clone the profil template
  const profilClone = profilTemplate.content.cloneNode(true);
  
  // Set all data attributes for filtering
  const article = profilClone.querySelector("article");
 
  
  // Debug: Afficher les données reçues du serveur
  console.log("Données de profil reçues:", data);
  
  // Set data attributes with the correct user identifier
  article.setAttribute("data-user-id", data.id);  // Assuming there's an 'id' field
  article.setAttribute("data-user-slug", data.slug || data.firstname.toLowerCase());

  // Basic attributes
  article.setAttribute("data-city", data.city ? data.city.toLowerCase() : "");
  article.setAttribute("data-description", data.description ? data.description.toLowerCase() : "");
  article.setAttribute("data-age", data.age || "");
  
  // Additional attributes for enhanced filtering - using database field names
  article.setAttribute("data-height", data.height || "");
  article.setAttribute("data-smoker", data.smoker !== undefined ? data.smoker.toString() : "");
  article.setAttribute("data-marital", data.marital ? data.marital.toLowerCase() : "");
  article.setAttribute("data-pet", data.pet !== undefined ? data.pet.toString() : "");
 
  // Mapping pour les centres d'intérêt si existants
  if (data.labels && data.labels.length > 0) {
    const interests = data.labels.map(label => label.name.toLowerCase()).join(',');
    article.setAttribute("data-centres-interet", interests);
  } else {
    article.setAttribute("data-centres-interet", ""); // Valeur par défaut si pas de labels
  }
  
  
  // Populate the cloned template with profil data
  profilClone.querySelector("[slot='city']").textContent = data.city || "";
  profilClone.querySelector("[slot='age']").textContent = data.age ? `${data.age} ans` : "";
  profilClone.querySelector("[slot='firstname']").textContent = data.firstname || "";
  
  const pictureSlot = profilClone.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture;
  } else {
    console.error("Image de profil non trouvée dans le DOM.");
  }
  // Select the container for the profil list
  const profilContainer = document.querySelector(".profils-grid");

  // Append the cloned event template to the event list container
  profilContainer.appendChild(profilClone);
}


function setupFilters() {
  const cityButtons = document.querySelectorAll(".cities-filter__button:not(.filter)");
  const criteriaSelect = document.querySelector("#description");
  
  // Setup for specific criteria options
  setupCriteriaSubOptions();
  
  // Initial state - all profiles visible
  const allProfilesButton = document.createElement("button");
  allProfilesButton.textContent = "Toutes les villes";
  allProfilesButton.classList.add("cities-filter__button");
  document.querySelector(".cities-filter__list").prepend(allProfilesButton);
  allProfilesButton.classList.add("active");
  
  // Add all city buttons to a single array for event management
  const allCityButtons = [...cityButtons, allProfilesButton];
  
  // City filter event listeners
  allCityButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      allCityButtons.forEach(btn => btn.classList.remove("active"));
      
      // Add active class to the clicked button
      button.classList.add("active");
  
      // Get the selected city from the button text
      const selectedCity = button.textContent.toLowerCase();
  
      // Get current criteria filters
      const criteriaFilters = getActiveCriteriaFilters();
      
      // Apply filtering
      filterProfils(selectedCity, criteriaFilters);
    });
  });
    
  // Criteria change event
  criteriaSelect.addEventListener("change", () => {
    // Show appropriate sub-options based on selected criteria
    showRelevantSubOptions(criteriaSelect.value);
    
    // Get the currently active city button
    const activeButton = document.querySelector(".cities-filter__button.active");
    
    // Get the selected city if there's an active button, otherwise use "toutes-les-villes"
    const selectedCity = activeButton ? activeButton.textContent.toLowerCase() : "toutes les villes";
    
    // Get current criteria filters
    const criteriaFilters = getActiveCriteriaFilters();
    
    // Apply filtering
    filterProfils(selectedCity, criteriaFilters);
  });
}

function setupCriteriaSubOptions() {
  // Create sub-options container
  const subOptionsContainer = document.createElement("div");
  subOptionsContainer.classList.add("criteria-sub-options");
  subOptionsContainer.style.display = "none";
  
  // Add the container after the select dropdown
  const criteriaSelect = document.querySelector("#description");
  criteriaSelect.parentNode.insertBefore(subOptionsContainer, criteriaSelect.nextSibling);
  
  // Prepare sub-options for different criteria
  const subOptions = {
    'taille': `
      <div class="sub-option" data-for="taille">
        <button class="sub-filter-btn" data-value="+170">+ de 170cm</button>
        <button class="sub-filter-btn" data-value="-170">- de 170cm</button>
      </div>
    `,
    'situation-familiale': `
      <div class="sub-option" data-for="situation-familiale">
        <button class="sub-filter-btn" data-value="célibataire">Célibataire</button>
        <button class="sub-filter-btn" data-value="divorcé">Divorcé(e)</button>
        <button class="sub-filter-btn" data-value="séparé">Séparé(e)</button>
        <button class="sub-filter-btn" data-value="veuve">Veuf/Veuve</button>
      </div>
    `,
    'animaux-de-compagnie': `
      <div class="sub-option" data-for="animaux-de-compagnie">
        <button class="sub-filter-btn" data-value="vrai">Oui</button>
        <button class="sub-filter-btn" data-value="faux">Non</button>
      </div>
    `,
    'centres-interet': `
      <div class="sub-option" data-for="centres-interet">
        <button class="sub-filter-btn" data-value="Nature">Nature</button>
        <button class="sub-filter-btn" data-value="Culturel">Culture</button>
        <button class="sub-filter-btn" data-value="Sports/bien-être">Sports/Bien-être</button>
        <button class="sub-filter-btn" data-value="Soirée à thème">Soirées à thème</button>
        <button class="sub-filter-btn" data-value="Artistique">Artistique</button>
        <button class="sub-filter-btn" data-value="Jeux de société">Jeux</button>
      </div>
    `,
    'fumeur': `
      <div class="sub-option" data-for="fumeur">
        <button class="sub-filter-btn" data-value="vrai">Oui</button>
        <button class="sub-filter-btn" data-value="faux">Non</button>
      </div>
    `
  };
  
  // Add all sub-options to the container
  for (const criteria in subOptions) {
    subOptionsContainer.innerHTML += subOptions[criteria];
  }
  
  // Hide all sub-options initially
  document.querySelectorAll('.sub-option').forEach(opt => {
    opt.style.display = 'none';
  });
  
  // Add event listeners to sub-option buttons
  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on this button
      btn.classList.toggle('active');
      
      // Get the currently active city
      const activeButton = document.querySelector(".cities-filter__button.active");
      const selectedCity = activeButton ? activeButton.textContent.toLowerCase() : "toutes les villes";
      
      // Get current criteria filters
      const criteriaFilters = getActiveCriteriaFilters();
      
      // Apply filtering
      filterProfils(selectedCity, criteriaFilters);
    });
  });
}

function showRelevantSubOptions(criteria) {
  // Hide all sub-options first
  document.querySelectorAll('.sub-option').forEach(opt => {
    opt.style.display = 'none';
  });
  
  // Show the container if a valid criteria is selected
  const subOptionsContainer = document.querySelector('.criteria-sub-options');
  
  if (criteria === 'tous-les-criteres') {
    subOptionsContainer.style.display = 'none';
  } else {
    subOptionsContainer.style.display = 'flex';
    
    // Show only the relevant sub-option
    const relevantSubOption = document.querySelector(`.sub-option[data-for="${criteria}"]`);
    if (relevantSubOption) {
      relevantSubOption.style.display = 'flex';
    }
  }
}

function getActiveCriteriaFilters() {
  const criteriaSelect = document.querySelector("#description");
  const selectedCriteria = criteriaSelect.value;
  
  if (selectedCriteria === 'tous-les-criteres') {
    return { type: 'none', values: [] };
  }
  
  // Get active sub-options for the selected criteria
  const activeSubOptions = document.querySelectorAll(`.sub-option[data-for="${selectedCriteria}"] .sub-filter-btn.active`);
  const values = Array.from(activeSubOptions).map(btn => btn.dataset.value);
  
  return {
    type: selectedCriteria,
    values: values.length > 0 ? values : [] // If no sub-options selected, return empty array
  };
}

function filterProfils(city, criteriaFilters) {
  const profils = document.querySelectorAll(".profils-grid article");
  const isCityAll = city.toLowerCase() === "toutes les villes";
  const isCriteriaAll = criteriaFilters.type === 'none';
  
  console.log(`Filtrage - Ville: ${city}, Critère: ${criteriaFilters.type}, Valeurs: ${criteriaFilters.values.join(', ')}`);
  
  // Tracking variable for whether any profiles are visible
  let visibleProfileCount = 0;
  
  profils.forEach(profil => {
    // Get profile data
    const profilCity = profil.getAttribute("data-city").toLowerCase();
    const profilData = getProfileDataFromAttributes(profil);
    
    // Check city match
    const cityMatch = isCityAll || profilCity === city.toLowerCase();
    
    // Check criteria match
    let criteriaMatch = true;
    
    if (!isCriteriaAll) {
      criteriaMatch = matchesCriteria(profilData, criteriaFilters);
    }
    
    // Show or hide based on combined match
    if (cityMatch && criteriaMatch) {
      profil.style.display = "block";
      visibleProfileCount++;
    } else {
      profil.style.display = "none";
    }
  });
  
  // Show a message if no results found
  const noResultsMessage = document.querySelector('.no-results-message') || createNoResultsMessage();
  
  if (visibleProfileCount === 0) {
    noResultsMessage.style.display = 'block';
  } else {
    noResultsMessage.style.display = 'none';
  }
}

function createNoResultsMessage() {
  const message = document.createElement('div');
  message.classList.add('no-results-message');
  message.textContent = 'Aucun profil ne correspond à ces critères';
  message.style.padding = '2rem';
  message.style.textAlign = 'center';
  message.style.gridColumn = '1 / -1';
  message.style.backgroundColor = 'white';
  message.style.borderRadius = 'var(--spacing-small)';
  message.style.margin = 'var(--spacing-large) 0';
  
  document.querySelector('.profils-grid').appendChild(message);
  return message;
}

function getProfileDataFromAttributes(profil) {
  // Extract all data attributes from the profile
  return {
    city: profil.getAttribute("data-city") || "",
    description: profil.getAttribute("data-description") || "",
    age: profil.getAttribute("data-age") || "",
    taille: profil.getAttribute("data-height") || profil.getAttribute("data-taille") || "",
    fumeur: profil.getAttribute("data-smoker") || profil.getAttribute("data-fumeur") || "",
    situationFamiliale: profil.getAttribute("data-marital") || profil.getAttribute("data-situation-familiale") || "",
    animauxDeCompagnie: profil.getAttribute("data-pet") || profil.getAttribute("data-animaux-de-compagnie") || "",
    centresInteret: profil.getAttribute("data-centres-interet") || ""
  };
}

function matchesCriteria(profilData, criteriaFilters) {
  const { type, values } = criteriaFilters;
  
  // If no specific values are selected, show all that match the category
  if (values.length === 0) return true;
  
  // Debug log pour afficher les données comparées
  console.log("Données du profil pour filtrage:", profilData);
  console.log("Filtre appliqué:", type, values);
  
  switch(type) {
  case 'taille':
    const taille = parseInt(profilData.taille) || 0;
    console.log(`Comparaison taille: ${taille} cm`);
    return values.some(value => {
      if (value === '+170') return taille >= 170;
      if (value === '-170') return taille < 170;
      return false;
    });
      
  case 'situation-familiale':
    console.log(`Comparaison situation: ${profilData.situationFamiliale}`);
    return values.some(value => {
      // Vérification plus permissive
      return profilData.situationFamiliale.toLowerCase().includes(value.toLowerCase());
    });
      
  case 'animaux-de-compagnie':
    console.log(`Comparaison animaux: ${profilData.animauxDeCompagnie}`);
    // Conversion de "true"/"false" (string) en boolean pour la comparaison
    const hasPets = profilData.animauxDeCompagnie.toString().toLowerCase();
    return values.some(value => {
      return hasPets === value.toLowerCase();
    });
      
  case 'fumeur':
    console.log(`Comparaison fumeur: ${profilData.fumeur}`);
    // Conversion de "true"/"false" (string) en boolean pour la comparaison
    const isSmoker = profilData.fumeur.toString().toLowerCase();
    return values.some(value => {
      return isSmoker === value.toLowerCase();
    });
    
  case 'centres-interet':
    const profileLabels = profilData.centresInteret ? profilData.centresInteret.split(',') : [];
    return values.some(value => profileLabels.includes(value.toLowerCase()));
    
      
  default:
    return true;
  }
}


function addMyAccountButtonListener(data){

  // Select the "Mon compte" button from the header
  const myAccountButton = document.querySelector("#app-header .my__account");
    
  // Add click profil listener to the "Mon compte" button
  myAccountButton.addEventListener('click', (e) =>{
    
    // Prevent the default behavior of the button
    e.preventDefault();
            
    // Fetch and display the "Mon compte" page with the provided data
    fetchDisplayMyAccountPage(data);
        
    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
};


function addMessagesButtonListener(data){

  // Select the "Évènements" button from the header
  const messagesButton = document.querySelector("#app-header .header__nav-link-messages");

  // Add click event listener to the "Évènements" button
  messagesButton.addEventListener('click', (e) =>{

    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayMessagesPage(1,2);
    const state = {page: "Messages", initFunction: 'fetchDisplayMessagesPage'};
    const url = "/messages";
    history.pushState(state, "", url);
  });
};

function addEventsButtonListener(data){

  // Select the "Évènements" button from the header
  const EventsButton = document.querySelector("#app-header .header__nav-link-events");

  // Add click event listener to the "Évènements" button
  EventsButton.addEventListener('click', (e) =>{

    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayEventsPage(data);
    const state = {page: "Évènements", initFunction: 'fetchDisplayEventsPage'};
    const url = "/evenements";
    history.pushState(state, "", url);
  });
};

