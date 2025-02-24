import { editMyAccount } from "./api.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { resetViewTemplate } from "./utils.js";

// Function to reset the view and display the edit info page
export function fetchDisplayEditInfoPage(){
  resetViewTemplate('app-main');
  appendTemplateEditInfoPage();

  const state = {page: 6, initFunction: 'fetchDisplayEditInfoPage'};
  const title = "Page de modification profil";
  const url = "/mon-compte/modification";
  history.pushState(state, title, url);
};

// Function to reset the view and display the edit intro page
export function fetchDisplayEditIntroPage(){
  resetViewTemplate('app-main');
  appendTemplateEditIntroPage();

  const state = {page: 6, initFunction: 'fetchDisplayEditIntroPage'};
  const title = "Page de modification profil";
  const url = "/mon-compte/modification";
  history.pushState(state, title, url);
};

// Function to reset the view and display the edit label page
export function fetchDisplayEditLabelPage(){
  resetViewTemplate('app-main');
  appendTemplateEditLabelPage();

  const state = {page: 6, initFunction: 'fetchDisplayEditLabelPage'};
  const title = "Page de Modification Profil";
  const url = "/mon-compte/modification";
  history.pushState(state, title, url);
};

// Function to reset the view and display the edit personal page
export function fetchDisplayEditPersonalPage(){
  resetViewTemplate('app-main');
  appendTemplateEditPersonnalPage();

  const state = {page: 6, initFunction: 'fetchDisplayEditPersonalPage'};
  const title = "Page de modification profil";
  const url = "/mon-compte/modification";
  history.pushState(state, title, url);
};

function appendTemplateEditInfoPage(){
  // Select the content template from the DOM
  const contentTemplate = document.querySelector("#edit-info");

  // Clone the template
  const contentClone = contentTemplate.content.cloneNode(true);

  // Select the container where the clone will be appended
  const contentContainer = document.querySelector("#app-main");

  // Append the cloned template to the container
  contentContainer.appendChild(contentClone);

  // Add event listener to the form
  const editForm = document.querySelector('#app-main form');
  addEditFormListener(editForm);

  // Add event listener to the cancel button
  const cancelButton = document.querySelector('.cancel-button');
  addCancelButtonListener(cancelButton);
};

function appendTemplateEditIntroPage(){
  // Select the content template from the DOM
  const contentTemplate = document.querySelector("#edit-intro");

  // Clone the template
  const contentClone = contentTemplate.content.cloneNode(true);

  // Select the container where the clone will be appended
  const contentContainer = document.querySelector("#app-main");

  // Append the cloned template to the container
  contentContainer.appendChild(contentClone);

  // Add event listener to the cancel button
  const cancelButton = document.querySelector('.cancel-button');
  addCancelButtonListener(cancelButton);

  // Add event listener to the form
  const editForm = document.querySelector('#app-main form');
  addEditFormListener(editForm);
};

function appendTemplateEditLabelPage(){
  // Select the content template from the DOM
  const contentTemplate = document.querySelector("#edit-label");

  // Clone the template
  const contentClone = contentTemplate.content.cloneNode(true);

  // Select the container where the clone will be appended
  const contentContainer = document.querySelector("#app-main");

  // Append the cloned template to the container
  contentContainer.appendChild(contentClone);

  // Add event listener to the cancel button
  const cancelButton = document.querySelector('.cancel-button');
  addCancelButtonListener(cancelButton);

  // Add event listener to the form
  const editForm = document.querySelector('#app-main form');
  addEditFormListener(editForm);
};

function appendTemplateEditPersonnalPage(){
  // Select the content template from the DOM
  const contentTemplate = document.querySelector("#edit-personal");

  // Clone the template
  const contentClone = contentTemplate.content.cloneNode(true);

  // Select the container where the clone will be appended
  const contentContainer = document.querySelector("#app-main");

  // Append the cloned template to the container
  contentContainer.appendChild(contentClone);

  // Add event listener to the cancel button
  const cancelButton = document.querySelector('.cancel-button');
  addCancelButtonListener(cancelButton);

  // Add event listener to the form
  const editForm = document.querySelector('#app-main form');
  addEditFormListener(editForm);
};

// Function to add event listener to the cancel button
function addCancelButtonListener(cancelButton){
  cancelButton.addEventListener('click', () =>{
    resetViewTemplate("app-main");
    fetchDisplayMyAccountPage();
  });
};

// Function to add event listener to the edit form
function addEditFormListener(editForm) {
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('preventDefault called');

    const formData = new FormData(editForm);
    const dataUser = {};

    // Check if the file input field is empty
  const fileInput = formData.get('picture');
  if (fileInput && fileInput.size === 0) {
    formData.delete('picture'); // Delete the 'picture' field if no file is selected
  }

// Iterate over formData entries and update dataUser object
  for (const [key, value] of formData.entries()) {
    if (value.trim() !== '') { // Check if the value is not just empty spaces
    dataUser[key] = value; // Update the dataUser object with the non-empty values
  }
}
    
    //const dataUser = Object.fromEntries(formData);
    

    // Get all checkbox values
    const checkboxes = formData.getAll('labels');
    if (checkboxes.length > 0) {
      dataUser.labels = checkboxes;
      console.log(dataUser.labels)
    }

    // Send the updated data to the server
    const updateUser = await editMyAccount(dataUser);
    console.log(dataUser)

    // If the update was unsuccessful, return null
    if(!updateUser){
      return null;
    }

    // Fetch and display the "My Account" page
    fetchDisplayMyAccountPage();
  });
};
