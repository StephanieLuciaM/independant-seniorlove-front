import { resetViewTemplate } from "./utils.js";

export function fetchDisplaySignupForm(data){
    console.log(data);
    let i = 1;
    
    displayNextForm(i, data);
  
}

function displayNextForm(count, data) {
  resetViewTemplate('app-main');
  const contentTemplate = document.querySelector(`template[data-slide-id='${count}']`);
  if (contentTemplate) {
    const contentClone = contentTemplate.content.cloneNode(true);
    const contentContainer = document.querySelector("#app-main");
    contentContainer.appendChild(contentClone);

    const form = contentContainer.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
        handleFormSubmit(e, count, data);
      });
    }

    const skipButton = contentContainer.querySelector('.skip-btn');
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        count++;
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
    
  e.preventDefault();
  const formData = new FormData(e.target);
  const formDataObject = Object.fromEntries(formData);
  const checkboxes = formData.getAll('label');
  if (checkboxes.length > 0) {
      formDataObject.label = checkboxes;
  }
  Object.assign(data, formDataObject);
  console.log(data);
  
  count++;
  if (count <= 10) {
    displayNextForm(count, data);
  }

}

