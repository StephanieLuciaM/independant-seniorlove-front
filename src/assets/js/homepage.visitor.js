import { getLastEvent } from "./api.js";

export async function fetchDisplayHomePageVisitor(){

  const events = await getLastEvent();

  if(!events){
    return;
  }
  const headerTemplate = document.querySelector("#header-not-connected");
  const contentTemplate = document.querySelector("#home-page-visitor");

  const headerClone = headerTemplate.content.cloneNode(true);
  const contentClone = contentTemplate.content.cloneNode(true);

  const headerContainer = document.querySelector("#app-header");
  const contentContainer = document.querySelector("#app-main");

  headerContainer.appendChild(headerClone);
  contentContainer.appendChild(contentClone);

  events.forEach(event =>{
   
    addEventContainer(event)
  })   
}

export function addEventContainer(data){
  console.log(data)
  
  const eventTemplate = document.querySelector("#event-template");


  
  const eventClone = eventTemplate.content.cloneNode(true);

  eventClone.querySelector("[slot='city']").textContent = data.city
  eventClone.querySelector("[slot='description']").textContent = data.description

 
  const eventContainer = document.querySelector("#events-list")
 


  eventContainer.appendChild(eventClone);
}