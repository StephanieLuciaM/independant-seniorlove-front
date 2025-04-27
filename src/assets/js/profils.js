import { resetViewTemplate } from "./utils.js";
import { getAllProfilsMatch, getVisitorProfile } from "./api.js";
import { fetchDisplayVisitorProfilePage } from "./profile.js";
import { addEventsButtonListener,
  addHearderLogoButtonListener, 
  addMessagesButtonListener, 
  addMyAccountButtonListener } from "./button.js";


/**
 * Main function to fetch and display the profiles page
 * Handles the initialization of the page, loading profiles, and setting up all event listeners
 */
export async function fetchDisplayProfilsPage() {
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');
  
  // Append the profiles page templates with the fetched data
  appendTemplateProfils();
  
  // Fetch all profiles that match the current user's preferences
  const allProfilsMatch = await getAllProfilsMatch();
  if (allProfilsMatch) {
    allProfilsMatch.forEach(addProfilsContainer);
  }
  
  // Initialize profiles filters and all navigation button listeners
  setupFilters();
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addMessagesButtonListener();
  addEventsButtonListener();
  
  // Add profile click event listeners after profiles are added to the DOM
  addProfileButtonListener();
};
 
/**
 * Sets up event listeners for profile detail buttons
 * When clicked, fetches the corresponding profile data and navigates to the profile detail page
 */
function addProfileButtonListener() {
  const profilsPage = document.querySelector('#app-main');
  
  if (!profilsPage) {
    console.error('Main container not found');
    return;
  }
  
  profilsPage.addEventListener('click', async (event) => {
    const profileButton = event.target.closest('.more-btn');
    
    if (!profileButton) return;
    
    event.preventDefault();
    
    const profilElement = profileButton.closest('article.profil');
    
    if (!profilElement) {
      return;
    }
    
    // Get user identification from data attributes
    const userSlug = profilElement.dataset.userSlug;
    const userId = profilElement.dataset.userId;
   
    const userIdentifier = userSlug || userId;
    
    if (!userIdentifier) {
      console.error('No user identifier found');
      return;
    }
    
    try {
      // Fetch detailed profile data for the selected user
      const userData = await getVisitorProfile(userIdentifier);
      
      if (!userData) {
        throw new Error('Unable to retrieve profile data');
      }
      
      // Display the visitor profile page with the fetched data
      await fetchDisplayVisitorProfilePage(userData);
      
      // Update browser history for proper navigation
      const state = {
        page: "visitor-profile", 
        initFunction: 'fetchDisplayVisitorProfilePage'
      };
      
      const url = `/visitor-profile/${userIdentifier}`;
      history.pushState(state, "", url);
      
    } catch (error) {
      console.error('Error handling profile:', error);
    }
  });
};

/**
 * Appends the header and main content templates to the DOM
 * Creates the basic structure of the profiles page before populating with data
 */
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

/**
 * Creates and adds a profile card to the grid
 * Populates each card with data from the API and sets data attributes for filtering
 * @param {Object} data - The profile data from the API
 */
export function addProfilsContainer(data) {
  // Select the profile template from the DOM
  const profilTemplate = document.querySelector("#profil__profils-page");
    
  // Clone the profile template
  const profilClone = profilTemplate.content.cloneNode(true);
  
  // Get the article element that will contain the profile information
  const article = profilClone.querySelector("article");
  
  // Set data attributes with the correct user identifier for navigation and filtering
  article.setAttribute("data-user-id", data.id || "");  
  article.setAttribute("data-user-slug", data.slug || data.firstname.toLowerCase());

  // Basic attributes for filtering
  article.setAttribute("data-city", data.city ? data.city.toLowerCase() : "");
  article.setAttribute("data-description", data.description ? data.description.toLowerCase() : "");
  article.setAttribute("data-age", data.age || "");
  
  // Additional attributes for enhanced filtering - using database field names
  article.setAttribute("data-height", data.height || "");
  article.setAttribute("data-smoker", data.smoker !== undefined ? data.smoker.toString() : "");
  article.setAttribute("data-marital", data.marital ? data.marital.toLowerCase() : "");
  article.setAttribute("data-pet", data.pet !== undefined ? data.pet.toString() : "");
 
  // Map interests from labels if they exist
  if (data.labels && data.labels.length > 0) {
    const interests = data.labels.map(label => label.name.toLowerCase()).join(',');
    article.setAttribute("data-centres-interet", interests);
  } else {
    article.setAttribute("data-centres-interet", ""); // Default value if no labels
  }
  
  
  // Populate the cloned template with profile data
  profilClone.querySelector("[slot='city']").textContent = data.city || "";
  profilClone.querySelector("[slot='age']").textContent = data.age ? `${data.age} ans` : "";
  profilClone.querySelector("[slot='firstname']").textContent = data.firstname || "";
  
  // Set the profile picture
  const pictureSlot = profilClone.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture;
  } else {
    console.error("Profile image not found in the DOM.");
  }
  
  // Select the container for the profile list and append the new profile
  const profilContainer = document.querySelector(".profils-grid");
  profilContainer.appendChild(profilClone);
};

/**
 * Sets up all filtering functionality for the profiles page
 * Creates city filters, criteria filters, and related sub-options
 */
function setupFilters() {
  const cityButtons = document.querySelectorAll(".cities-filter__button:not(.filter)");
  const criteriaSelect = document.querySelector("#description");
  
  // Setup dropdown sub-options for specific criteria
  setupCriteriaSubOptions();
  
  // Create an "All cities" button and make it active by default
  const allProfilesButton = document.createElement("button");
  allProfilesButton.textContent = "Toutes les villes";
  allProfilesButton.classList.add("cities-filter__button");
  document.querySelector(".cities-filter__list").prepend(allProfilesButton);
  allProfilesButton.classList.add("active");
  
  // Combine all city filter buttons for consistent event handling
  const allCityButtons = [...cityButtons, allProfilesButton];
  
  // Add city filter event listeners to each button
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
      
      // Apply filtering with combined city and criteria options
      filterProfils(selectedCity, criteriaFilters);
    });
  });
    
  // Add event listener for criteria dropdown changes
  criteriaSelect.addEventListener("change", () => {
    // Show relevant sub-options based on selected criteria
    showRelevantSubOptions(criteriaSelect.value);
    
    // Get the currently active city button
    const activeButton = document.querySelector(".cities-filter__button.active");
    
    // Get the selected city if there's an active button, otherwise use "toutes-les-villes"
    const selectedCity = activeButton ? activeButton.textContent.toLowerCase() : "toutes les villes";
    
    // Get current criteria filters
    const criteriaFilters = getActiveCriteriaFilters();
    
    // Apply filtering with updated criteria
    filterProfils(selectedCity, criteriaFilters);
  });
};

/**
 * Creates and sets up sub-options for different filtering criteria
 * Each criteria has its own set of buttons for more specific filtering
 */
function setupCriteriaSubOptions() {
  // Create container for all sub-options
  const subOptionsContainer = document.createElement("div");
  subOptionsContainer.classList.add("criteria-sub-options");
  subOptionsContainer.style.display = "none";
  
  // Add the container after the select dropdown
  const criteriaSelect = document.querySelector("#description");
  criteriaSelect.parentNode.insertBefore(subOptionsContainer, criteriaSelect.nextSibling);
  
  // Define HTML for different criteria sub-options
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
  
  // Add all sub-options HTML to the container
  for (const criteria in subOptions) {
    subOptionsContainer.innerHTML += subOptions[criteria];
  }
  
  // Hide all sub-options initially
  document.querySelectorAll('.sub-option').forEach(opt => {
    opt.style.display = 'none';
  });
  
  // Add event listeners to each sub-option button
  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on this button for visual feedback
      btn.classList.toggle('active');
      
      // Get the currently active city
      const activeButton = document.querySelector(".cities-filter__button.active");
      const selectedCity = activeButton ? activeButton.textContent.toLowerCase() : "toutes les villes";
      
      // Get updated criteria filters with the toggled button
      const criteriaFilters = getActiveCriteriaFilters();
      
      // Apply filtering with updated criteria
      filterProfils(selectedCity, criteriaFilters);
    });
  });
};

/**
 * Shows relevant sub-options based on selected criteria
 * Hides all other sub-options for a cleaner UI
 * @param {string} criteria - The selected criteria from the dropdown
 */
function showRelevantSubOptions(criteria) {
  // Hide all sub-options first
  document.querySelectorAll('.sub-option').forEach(opt => {
    opt.style.display = 'none';
  });
  
  // Get the container for all sub-options
  const subOptionsContainer = document.querySelector('.criteria-sub-options');
  
  // Hide the container if "All criteria" is selected
  if (criteria === 'tous-les-criteres') {
    subOptionsContainer.style.display = 'none';
  } else {
    // Otherwise show the container and the specific sub-options
    subOptionsContainer.style.display = 'flex';
    
    // Show only the relevant sub-option for the selected criteria
    const relevantSubOption = document.querySelector(`.sub-option[data-for="${criteria}"]`);
    if (relevantSubOption) {
      relevantSubOption.style.display = 'flex';
    }
  }
};

/**
 * Gets the currently active criteria filters based on selected options
 * @returns {Object} An object with the filter type and selected values
 */
function getActiveCriteriaFilters() {
  const criteriaSelect = document.querySelector("#description");
  const selectedCriteria = criteriaSelect.value;
  
  // If "All criteria" is selected, return a special object
  if (selectedCriteria === 'tous-les-criteres') {
    return { type: 'none', values: [] };
  }
  
  // Get all active (selected) sub-option buttons for the current criteria
  const activeSubOptions = document.querySelectorAll(`.sub-option[data-for="${selectedCriteria}"] .sub-filter-btn.active`);
  const values = Array.from(activeSubOptions).map(btn => btn.dataset.value);
  
  // Return an object with the criteria type and selected values
  return {
    type: selectedCriteria,
    values: values.length > 0 ? values : [] // If no sub-options selected, return empty array
  };
};

/**
 * Filters profiles based on selected city and criteria
 * Shows only profiles that match all selected filters
 * @param {string} city - The selected city to filter by
 * @param {Object} criteriaFilters - Object containing criteria type and values
 */
function filterProfils(city, criteriaFilters) {
  const profils = document.querySelectorAll(".profils-grid article");
  const isCityAll = city.toLowerCase() === "toutes les villes";
  const isCriteriaAll = criteriaFilters.type === 'none';
  
  // Counter for visible profiles to detect "no results" state
  let visibleProfileCount = 0;
  
  // Loop through all profiles and filter them
  profils.forEach(profil => {
    // Get profile data from its attributes
    const profilCity = profil.getAttribute("data-city").toLowerCase();
    const profilData = getProfileDataFromAttributes(profil);
    
    // Check if the city matches (or if "All cities" is selected)
    const cityMatch = isCityAll || profilCity === city.toLowerCase();
    
    // Check if criteria match (or if "All criteria" is selected)
    let criteriaMatch = true;
    
    if (!isCriteriaAll) {
      criteriaMatch = matchesCriteria(profilData, criteriaFilters);
    }
    
    // Show or hide the profile based on combined matches
    if (cityMatch && criteriaMatch) {
      profil.style.display = "block";
      visibleProfileCount++;
    } else {
      profil.style.display = "none";
    }
  });
  
  // Show or hide the "no results" message based on whether any profiles are visible
  const noResultsMessage = document.querySelector('.no-results-message') || createNoResultsMessage();
  
  if (visibleProfileCount === 0) {
    noResultsMessage.style.display = 'block';
  } else {
    noResultsMessage.style.display = 'none';
  }
};

/**
 * Creates a message element to display when no profiles match the filters
 * @returns {HTMLElement} The created message element
 */
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
};

/**
 * Extracts all relevant data attributes from a profile element
 * Used to compare profile data against selected filters
 * @param {HTMLElement} profil - The profile element to extract data from
 * @returns {Object} An object containing all profile data for filtering
 */
function getProfileDataFromAttributes(profil) {
  // Extract all data attributes from the profile for easy access during filtering
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
};

/**
 * Checks if a profile matches the selected criteria filters
 * Handles different comparison logic based on the criteria type
 * @param {Object} profilData - Profile data extracted from attributes
 * @param {Object} criteriaFilters - The current filtering criteria
 * @returns {boolean} True if the profile matches the criteria, false otherwise
 */
function matchesCriteria(profilData, criteriaFilters) {
  const { type, values } = criteriaFilters;
  
  // If no specific values are selected, show all profiles of this category
  if (values.length === 0) return true;
   
  // Different comparison logic based on the criteria type
  switch(type) {
  case 'taille':
    const taille = parseInt(profilData.taille) || 0;
   
    return values.some(value => {
      if (value === '+170') return taille >= 170;
      if (value === '-170') return taille < 170;
      return false;
    });
      
  case 'situation-familiale':
    
    return values.some(value => {
      // More permissive check using includes rather than exact match
      return profilData.situationFamiliale.toLowerCase().includes(value.toLowerCase());
    });
      
  case 'animaux-de-compagnie':
    console.log(`Pets comparison: ${profilData.animauxDeCompagnie}`);
    // Convert "true"/"false" strings to lowercase for comparison
    const hasPets = profilData.animauxDeCompagnie.toString().toLowerCase();
    return values.some(value => {
      return hasPets === value.toLowerCase();
    });
      
  case 'fumeur':
   
    // Convert "true"/"false" strings to lowercase for comparison
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
};