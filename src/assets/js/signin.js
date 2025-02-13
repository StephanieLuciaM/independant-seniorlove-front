import { signIn } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";


export function fetchDisplaySigninPage(){
  resetViewTemplate('app-main');

  const contentTemplate = document.querySelector('#signin');

  const contentClone = contentTemplate.content.cloneNode(true);

  const contentContainer = document.querySelector("#app-main");

  contentContainer.appendChild(contentClone);

  const form = contentContainer.querySelector('form');

  form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const dataUser = Object.fromEntries(new FormData(form));

    const onSign = await signIn(dataUser);

    if(!onSign){
      return;
    }
    fetchDisplayHomePageConnected();
  });
}