import { resetViewTemplate } from "./utils.js";
import { signUp } from "./api.js";
import { fetchDisplaySigninPage } from "./signin.js";
import { validateFormSignup } from "./handling.error.js";

export function fetchDisplaySignupForm(data) {
  let i = 1;
  displayNextForm(i, data);

  const state = {page: 2, initFunction: 'fetchDisplaySignupForm'};
  const title = "Page d'inscription";
  const url = "/inscription";
  history.pushState(state, title, url); 
};

function displayNextForm(count, data) {
  // Reset the view template for the main application area
  resetViewTemplate('app-main');

  // Select the template corresponding to the current slide
  const contentTemplate = document.querySelector(`template[data-slide-id='${count}']`);
  initContent(contentTemplate, count, data);

  
};

function initContent(contentTemplate, count, data) {
  // Clone and append the content template to the main container
  const contentContainer = cloneAndAppendContent(contentTemplate);
  if (!contentContainer) {
    return null;
  }

  // Select the form and skip button within the appended content
  const form = contentContainer.querySelector('form');
  const skipButton = contentContainer.querySelector('.skip-btn');

  // Add event listeners to the form and skip button
  addFormSubmitListener(form, count, data);
  addSkipButtonListener(skipButton, count, data);
};

function cloneAndAppendContent(contentTemplate) {
  if (!contentTemplate) {
    console.error(`Template avec data-slide-id='${count}' non trouvé.`);
    return null;
  }

  const contentClone = contentTemplate.content.cloneNode(true);
  const contentContainer = document.querySelector("#app-main");
  contentContainer.appendChild(contentClone);
  return contentContainer;
};

function addFormSubmitListener(form, count, data) {
  if (form) {
    form.addEventListener('submit', (e) => handleFormSubmit(e, count, data));
  }
};

function addSkipButtonListener(skipButton, count, data) {
  if (skipButton) {
    skipButton.addEventListener('click', () => {
      count++;
      if (count <= 10) {
        displayNextForm(count, data);
      }
    });
  }
};

function handleFormSubmit(e, count, data) {
  e.preventDefault();
  
  // Create a FormData object from the form data and convert it to a regular object
  const formData = new FormData(e.target);
  const formDataObject = Object.fromEntries(formData);

    // Validate form data with current step
    const error = validateFormSignup(formDataObject, count);
    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error,
        });
        return;
    }

  // Get all checkbox values with the name 'labels'
  const checkboxes = formData.getAll('labels');

  // If there are any checkbox values, add them to the formDataObject under 'labels'
  if (checkboxes.length > 0) {
    formDataObject.labels = checkboxes;
  }

  // Merge formDataObject into the existing data object
  Object.assign(data, formDataObject);
  console.log(data);

  // Increment the count and display the next form if the count is less than or equal to 10
  count++;
  if (count <= 10) {
    displayNextForm(count, data);
  } else {
    console.log('ok');
    createNewUser(data); // Create new user if the count exceeds 10
  }
};

async function createNewUser(data) {
  const createUser = await signUp(data);
console.log(createUser);
  if (!createUser) {
    return  null;
  }
  // Afficher directement l'alerte de succès
Swal.fire({
  title: "Parfait!",
  text: "Vous êtes bien inscrit, vous allez etre rediriger vers la page de connexion.",
  icon: "success",
  confirmButtonText: "OK"
}).then(() => {
 
  // Display the sign-in page upon successful user creation
  fetchDisplaySigninPage();
});
}









