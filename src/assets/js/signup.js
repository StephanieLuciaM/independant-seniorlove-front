import { resetViewTemplate } from "./utils.js";
import { signUp, uploadImageToCloudinary } from "./api.js";
import { fetchDisplaySigninPage } from "./signin.js";
import { validateFormSignup } from "./handling.error.js";
import { successSignup } from "./handling.error.js";
import { showErrorMessage } from "./handling.error.js";

const DEFAULT_PROFILE_PHOTO = "/assets/img/diverse-img/profils/default-avatar.png";

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
    skipButton.addEventListener('click', (e) => {
      // Empêcher la soumission du formulaire
      e.preventDefault();
      e.stopPropagation();
      
      // Passer à l'étape suivante
      count++;
      if (count <= 10) {
        displayNextForm(count, data);
      } else {
        createNewUser(data);
      }
    });
  }
};

function handleFormSubmit(e, count, data) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formDataObject = Object.fromEntries(formData);

  // Form validation and checking
  const error = validateFormSignup(formDataObject, count);
  if (error) {
    showErrorMessage(error);
    return;
  }

  // If a photo is selected, upload the image to Cloudinary
  const fileInput = e.target.querySelector('#picture');
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    uploadImageToCloudinary(file).then(imageUrl => {
      // Add the image URL to the form data
      formDataObject.profile_photo_url = imageUrl;

      // Add the form data to the `data` object
      Object.assign(data, formDataObject);

      // Move to the next step or submit the data
      count++;
      if (count <= 10) {
        displayNextForm(count, data);
      } else {
        createNewUser(data); // Create a new user once everything is validated
      }
    }).catch(err => {
      showErrorMessage("Error while uploading the image.");
    });
  } else {
    // If no photo is selected, continue as normal
    Object.assign(data, formDataObject);
    count++;
    if (count <= 10) {
      displayNextForm(count, data);
    } else {
      createNewUser(data);
    }
  }
}

async function createNewUser(data) {
  if (!data.profile_photo_url) {
    data.profile_photo_url = DEFAULT_PROFILE_PHOTO;
  }

  if (data.confirmPassword && !data.repeat_password) {
    data.repeat_password = data.confirmPassword;
    delete data.confirmPassword;
  }
  
  // Ensure that gender_match exists
  if (!data.gender_match) {
    data.gender_match = "Indifférent"; // Default value
  }
  
  // Ensure that description exists
  if (!data.description) {
    data.description = "";
  }
  
  // Ensure that zodiac exists
  if (!data.zodiac) {
    data.zodiac = "";
  }
  
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











