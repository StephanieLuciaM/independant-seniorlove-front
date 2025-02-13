import { resetViewTemplate } from "./utils.js";

export function fetchDisplayHomePageConnected(){
  resetViewTemplate('app-header', 'app-main');

  const headerTemplate = document.querySelector("#header-connected");
  const contentTemplate = document.querySelector("#home-page-connected");

  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);

  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");

  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);

}