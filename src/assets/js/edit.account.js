import { editMyAccount, uploadImageToCloudinary } from "./api.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { resetViewTemplate } from "./utils.js";


// Function to reset the view and display the edit info page
export function fetchDisplayEditInfoPage(){
  resetViewTemplate('app-main');
  appendTemplateEditInfoPage();
};

// Function to reset the view and display the edit intro page
export function fetchDisplayEditIntroPage(){
  resetViewTemplate('app-main');
  appendTemplateEditIntroPage();
};

// Function to reset the view and display the edit label page
export function fetchDisplayEditLabelPage(){
  resetViewTemplate('app-main');
  appendTemplateEditLabelPage();
};

// Function to reset the view and display the edit personal page
export function fetchDisplayEditPersonalPage(){
  resetViewTemplate('app-main');
  appendTemplateEditPersonnalPage();

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

    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
};

// Function to add event listener to the edit form
function addEditFormListener(editForm) {
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const dataUser = {};
    
    // Check if there's a file to upload to Cloudinary
    const fileInput = editForm.querySelector('#edit-picture'); 
    if (fileInput && fileInput.files.length > 0) {
      try {
        // Upload the image to Cloudinary and get the URL
        const file = fileInput.files[0];
        const imageUrl = await uploadImageToCloudinary(file);
        
        // Ajouter l'URL à l'objet dataUser avec le nom correct
        // Utiliser le même nom que dans le modèle User côté serveur
        dataUser.picture = imageUrl; // Assumant que le champ dans la DB est 'picture'
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
        return null;
      }
    }
    
    // Parcourir les autres champs du formulaire
    for (const [key, value] of formData.entries()) {
      // Ignorer le champ 'picture' car on l'a déjà traité
      if (key !== 'picture' && value && value.trim && value.trim() !== '') {
        dataUser[key] = value;
      }
    }
    
    // Get all checkbox values
    const checkboxes = formData.getAll('labels');
    if (checkboxes.length > 0) {
      dataUser.labels = checkboxes;
    }
    
    // Send the updated data to the server
    const updateUser = await editMyAccount(dataUser);
    if (!updateUser) {
      return null;
    }
    
    // Fetch and display the "My Account" page
    fetchDisplayMyAccountPage();
    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
}