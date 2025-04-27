import { resetViewTemplate } from "./utils.js";
import { getLastEventsMatch, getLastProfilesMatch } from "./api.js";
import { addEventsButtonListener, 
  addMessagesButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";


// Function to display the connected home page
export async function fetchDisplayHomePageConnected(data) {
  
  // Reset view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  appendTemplatesConnedted();

  // Ensure template updates are processed before proceeding
  await new Promise(resolve => setTimeout(resolve, 200));

  const profilesListContainer = document.querySelector("#profiles-list");
  if (!profilesListContainer) {
    console.error("Container #profiles-list introuvable après chargement du template");
  }

  // Attach event listeners for navigation elements
  addMyAccountButtonListener(data);
  addMessagesButtonListener();
  addEventsButtonListener(data);
  addProfilsButtonListener(data);

  try {
    // Fetch and display the latest matched profiles
   
    const profilsMatch = await getLastProfilesMatch();
    const profilesListContainer = document.querySelector("#profiles-list");
    

    if (profilsMatch && profilesListContainer) {
      profilsMatch.forEach(addProfilContainer);
    }
  } catch (error) {
    console.error("Error loading profile matches:", error);
  }

  try {
    // Fetch and display the latest matched events
    const eventsMatch = await getLastEventsMatch();
    const eventsListContainer = document.querySelector("#events-list");

    if (eventsMatch && eventsListContainer) {
      eventsMatch.forEach(addEventContainer);
    }
  } catch (error) {
    console.error("Error loading event matches:", error);
  }
}

// Function to append connected user templates to the DOM
function appendTemplatesConnedted() {
  // Select header and content templates
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#home-page-connected");

  // Clone templates for insertion
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);

  // Identify target containers for appended content
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");

  // Append cloned templates to the appropriate containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);
};

// Function to add an event to the event list container
export function addEventContainer(data) {
  // Select the event template
  const eventTemplate = document.querySelector("#minimal-event");
  
  // Validate template existence before proceeding
  if (!eventTemplate) {
    return; // Exit function if template doesn't exist
  }

  // Clone the event template
  const eventClone = eventTemplate.content.cloneNode(true);

  // Populate event details within the cloned template
  eventClone.querySelector("[slot='city']").textContent = data.city;
  eventClone.querySelector("[slot='title']").textContent = data.title;
  eventClone.querySelector("[slot='label']").textContent = data.label.name;
  
  // Set event picture source
  eventClone.querySelector("[slot='picture']").setAttribute(
    'src', `./src/assets/img/diverse-img/events/${data.picture}`
  );

  // Select the container for event listings
  const eventContainer = document.querySelector("#events-list");
  
  // Ensure container existence before appending the event
  if (!eventContainer) {
    return;
  }

  // Append the event item to the container
  eventContainer.appendChild(eventClone);
}

// Function to add a profile to the profiles list container
export function addProfilContainer(data) {
  // Select the profile template
  const profilTemplate = document.querySelector("#minimal-profil");

  // Validate template existence before proceeding
  if (!profilTemplate) {
    return;
  }

  // Clone the profile template
  const profilClone = profilTemplate.content.cloneNode(true);

  // Populate profile details within the cloned template
  profilClone.querySelector("[slot='firstname']").textContent = data.firstname;
  profilClone.querySelector("[slot='city']").textContent = data.city;
  profilClone.querySelector("[slot='age']").textContent = data.age;

  // Set profile picture source if the element exists
  const pictureSlot = profilClone.querySelector("[slot='picture']");
  if (pictureSlot) {
    pictureSlot.src = data.picture;
  } else {
    console.log("Profile picture element not found in the DOM");
  }

  // Select the container for profile listings
  const profilContainer = document.querySelector("#profiles-list");

  // Ensure container existence before appending the profile
  if (!profilContainer) {
    return;
  }

  // Append the profile item to the container
  profilContainer.appendChild(profilClone);
}

