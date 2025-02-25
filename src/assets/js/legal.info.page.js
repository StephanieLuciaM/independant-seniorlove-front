import { resetViewTemplate } from "./utils";

// Function to reset the view and display the legal information page
export async function fetchDisplayLegalInfoPage() {

    resetViewTemplate('app-main');
    // Append the content template to the container
    appendTemplate();
}

function appendTemplate(){
    // Select the content template
    const contenteTemplate = document.querySelector("#legal-info-template");

    // Clone the template
    const contentClone = contenteTemplate.content.cloneNode(true);

    // Select the container where the clone will be appended
    const contentContainer = document.querySelector("#app-main");
    
    // Append the cloned template to their container
    contentContainer.appendChild(contentClone);
}




 

  
   