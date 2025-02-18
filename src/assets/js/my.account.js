import { resetViewTemplate } from "./utils.js";
export function fetchDisplayMyAccountPage(data){
  console.log(data);
  console.log('ok');
  resetViewTemplate('app-header', 'app-main');
  appendTemplatesMyAccount();
};

function appendTemplatesMyAccount(){
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
}