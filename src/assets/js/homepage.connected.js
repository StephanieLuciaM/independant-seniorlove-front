import { resetViewTemplate } from "./utils.js";

export function fetchDisplayHomePageConnected(){
// Reset the view templates for header and main content
  resetViewTemplate('app-header', 'app-main');

  // Select the header and content templates from the DOM
  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#home-page-connected");

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