import { resetViewTemplate } from "./utils.js";
import { 
  fetchDisplayEditInfoPage,
  fetchDisplayEditIntroPage,
  fetchDisplayEditLabelPage,
  fetchDisplayEditPersonalPage 
} from "./edit.account.js";
import { deleteMyAccount, getMyAccount } from "./api.js";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";



export async function fetchDisplayMyAccountPage(){
  // Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  // Fetch the user account information
  const myAccount = await getMyAccount();

  // Append the user account templates with the fetched data
  appendTemplatesMyAccount(myAccount);
  
  // Add event listeners to the edit buttons
  addEditButtonsListener();

  addDeleteButtonListener();
};

function appendTemplatesMyAccount(data){
  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-my-account");
  const contentTemplate = document.querySelector("#my-account");

  // Clone the templates
  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);

  // Select the containers where the clones will be appended
  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");

  // Append the cloned templates to their respective containers
  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);

  // Populate the content with the user data
  myAccount(contentContainer, data);
};

function addEditButtonsListener() {
  // Select all edit buttons within the main content area
  const editButtons = document.querySelectorAll("#app-main .edit-modal");

  // Add click event listeners to the edit buttons based on their classes
  editButtons.forEach((button) =>{
    if(button.classList.contains('edit-info')){
      button.addEventListener('click', handleEditInfo);
    }else if(button.classList.contains('edit-intro')){
      button.addEventListener('click', handleEditIntro);
    }else if(button.classList.contains('edit-label')){
      button.addEventListener('click', handleEditLabel);
    }else{
      button.addEventListener('click', handleEditPersonal);
    }
  });
};
   
// Function to select the delete button element
function getDeleteButton() {
  // Select the delete button within the #app-main section
  return document.querySelector("#app-main .delete-account");
}

// Function to display the confirmation dialog
async function showConfirmationDialog() {
  return await Swal.fire({
    title: 'Attention',
    text: 'Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.',
    icon: 'warning', // Warning icon
    showCancelButton: true, // Show cancel button
    confirmButtonText: 'Oui, supprimer mon compte', // Confirm button text
    cancelButtonText: 'Non, annuler', // Cancel button text
    reverseButtons: true // Reverse the order of buttons
  });
}

// Function to display the success message
async function showSuccessMessage() {
  await Swal.fire({
    icon: 'success', // Success icon
    title: 'Succès',
    text: 'Votre compte a bien été supprimé.',
  });

  // If the account deletion is successful, call fetchDisplayHomePageVisitor to update the page
  fetchDisplayHomePageVisitor();
}

// Function to display the error message
function showErrorMessage(message) {
  Swal.fire({
    icon: 'error', // Error icon
    title: 'Erreur',
    text: message, // Error message passed as a parameter
  });
}

// Function to handle the account deletion process
async function handleDeleteAccount() {
  try {
    // Call the function to delete the user account
    const deleteUser = await deleteMyAccount();

    // Check if the account was successfully deleted
    if (deleteUser) {
      // Show success message if deletion was successful
      await showSuccessMessage();
    } else {
      // Show error message if deletion failed
      showErrorMessage('Il y a eu un problème lors de la suppression de votre compte. Veuillez réessayer plus tard.');
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Erreur lors de la suppression du compte:', error);

    // Show a generic error message to the user
    showErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
  }
}

// Function to handle the user's response from the confirmation dialog
async function handleConfirmation(confirmation) {
  if (confirmation.isConfirmed) {
    // If the user confirmed, proceed to delete the account
    await handleDeleteAccount();
  } else if (confirmation.dismiss === Swal.DismissReason.cancel) {
    // If the user canceled, show an informational message
    Swal.fire({
      icon: 'info', // Info icon
      title: 'Annulé',
      text: 'Votre compte n\'a pas été supprimé.',
      timer: 2000, // Automatically close after 2 seconds
      showConfirmButton: false
    });
  }
}

// Main function to add the delete button event listener
function addDeleteButtonListener() {
  // Get the delete button element
  const deleteButton = getDeleteButton();

  if (!deleteButton) {
    console.error('Delete button not found!');
    return;
  }

  // Add a click event listener to the delete button
  deleteButton.addEventListener('click', async () => {
    console.log('Bouton de suppression cliqué');

    // Show the confirmation dialog and wait for the user's response
    const confirmation = await showConfirmationDialog();

    // Handle the user's response
    await handleConfirmation(confirmation);
  });
}

function handleEditInfo(){
  // Fetch and display the edit info page
  fetchDisplayEditInfoPage();
};

function handleEditIntro(){
  // Fetch and display the edit intro page
  fetchDisplayEditIntroPage();
};

function handleEditLabel(){
  // Fetch and display the edit label page
  fetchDisplayEditLabelPage();
};

function handleEditPersonal(){
  // Fetch and display the edit personal page
  fetchDisplayEditPersonalPage();
};

function myAccount(display, data){
  // Log the user data to the console
  console.log(data);

  // Populate the account information slots with the user data
  display.querySelector("[slot='firstname']").textContent = data.firstname;
  display.querySelector("[slot='age']").textContent = data.age;
  display.querySelector("[slot='city-profil']").textContent = data.city;
  display.querySelector("[slot='description']").textContent = data.description;
  // display.querySelector("[slot='labels']").textContent = data.labels.name;
  display.querySelector("[slot='height']").textContent = data.height;
  display.querySelector("[slot='smoker']").textContent = data.smoker;
  display.querySelector("[slot='marital']").textContent = data.marital;
  display.querySelector("[slot='zodiac']").textContent = data.zodiac;
  display.querySelector("[slot='pet']").textContent = data.pet;
  display.querySelector("[slot='music']").textContent = data.music;
};
