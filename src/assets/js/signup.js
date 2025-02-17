import { resetViewTemplate } from "./utils.js";

export function fetchDisplaySignupForm(data){
  let i = 1;
    
  displayNextForm(i, data); 
}

function displayNextForm(count, data) {
  // Reset the view template for the main application area
  resetViewTemplate('app-main');
  // Select the template corresponding to the current slide
  const contentTemplate = document.querySelector(`template[data-slide-id='${count}']`);
  if (contentTemplate) {
    // Clone the content of the selected template
    const contentClone = contentTemplate.content.cloneNode(true);
    // Select the main application container
    const contentContainer = document.querySelector("#app-main");
    // Append the cloned content to the main application container
    contentContainer.appendChild(contentClone);

    // Add a submit event listener to the form if it exists
    const form = contentContainer.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
      handleFormSubmit(e, count, data);
      });
    }

    // Add a click event listener to the skip button if it exists
    const skipButton = contentContainer.querySelector('.skip-btn');
    if(skipButton){
      skipButton.addEventListener('click', () => {
        count++;
        // If the current count is less than or equal to 10, display the next form
        if (count <= 10) {
          displayNextForm(count, data);
        }
      });
    }

  } else {
    console.error(`Template avec data-slide-id='${count}' non trouvé.`);
  }
}

function handleFormSubmit(e, count, data) {
   // Prevent the default form submission behavior 
  e.preventDefault();
  // Create a FormData object from the form that triggered the event
  const formData = new FormData(e.target);
  // Convert the FormData object to a regular object
  const formDataObject = Object.fromEntries(formData);
  // Get all the values of the checkboxes with the name 'labels'
  const checkboxes = formData.getAll('labels');
  if (checkboxes.length > 0) {
    // Add the checkbox values to the formDataObject under the 'labels' property
    formDataObject.labels = checkboxes;
  }
  // Merge the formDataObject into the existing data object
  Object.assign(data, formDataObject);
  
  // Increment the count and display the next form if the count is less than or equal to 10
  count++;
  if (count <= 10) {
    displayNextForm(count, data);
  }

}

