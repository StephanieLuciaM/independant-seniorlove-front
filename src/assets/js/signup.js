import { resetViewTemplate } from "./utils.js";
import { signUp } from "./api.js";
import { fetchDisplaySigninPage } from "./signin.js";
import { validateFormSignup } from "./handling.error.js";
import { successSignup } from "./handling.error.js";
import { showErrorMessage } from "./handling.error.js";

export function fetchDisplaySignupForm(data) {
  let i = 1;
  displayNextForm(i, data);
};

function displayNextForm(count, data) {

  // Reset the view template for the main application area
  resetViewTemplate('app-main');

  // Select the template corresponding to the current slide
  const contentTemplate = document.querySelector(`template[data-slide-id='${count}']`);
  initContent(contentTemplate, count, data);

  const state = {page: `Inscription etape ${count + 1}`, initFunction: 'fetchDisplaySignupForm'};
  const url = `/inscription/etape-${count}`;
  history.pushState(state, "", url); 
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

  // Add event listeners for showing/hiding password
  addPasswordToggleListener(contentContainer);
};

function addPasswordToggleListener(container) {
  // Select the elements that will act as toggle buttons for password visibility
  const togglePassword = container.querySelector('#togglePassword');
  const toggleRepeatPassword = container.querySelector('#toggleRepeatPassword');

  // If the first toggle button exists, add a click event listener
  if (togglePassword) {
    togglePassword.addEventListener('click', function () {

      // Select the password input field
      const passwordField = container.querySelector('#password');

      // Select the icon inside the toggle button
      const icon = this.querySelector('i');

      // Check if the password is currently hidden (type="password")
      const isPasswordHidden = passwordField.getAttribute('type') === 'password';

      // Toggle the input field type between 'password' and 'text'
      passwordField.setAttribute('type', isPasswordHidden ? 'text' : 'password');
      
      // Toggle the icon between an open eye (visible) and a slashed eye (hidden)
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  // If the second toggle button exists, add a click event listener
  if (toggleRepeatPassword) {
    toggleRepeatPassword.addEventListener('click', function () {

      // Select the repeat password input field
      const repeatPasswordField = container.querySelector('#repeat_password');

      // Select the icon inside the toggle button
      const icon = this.querySelector('i');

      // Check if the repeat password is currently hidden (type="password")
      const isPasswordHidden = repeatPasswordField.getAttribute('type') === 'password';
      
      // Toggle the input field type between 'password' and 'text'
      repeatPasswordField.setAttribute('type', isPasswordHidden ? 'text' : 'password');
      
      // Toggle the icon between an open eye (visible) and a slashed eye (hidden)
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }
}


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
    showErrorMessage(error);
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

  // Increment the count and display the next form if the count is less than or equal to 10
  count++;
  if (count <= 10) {
    displayNextForm(count, data);
  } else {
    createNewUser(data); // Create new user if the count exceeds 10
  }
};

async function createNewUser(data) {
  const createUser = await signUp(data);
  if (!createUser) {
    return  null;
  }

  // display the success signup alert
  successSignup();
   
  // Display the sign-in page upon successful user creation
  fetchDisplaySigninPage();

  const state = {page: "Connexion", initFunction: 'fetchDisplaySigninPage'};
  const url = "/connexion";
  history.pushState(state, "", url);
};










