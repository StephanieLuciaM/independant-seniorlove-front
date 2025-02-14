const newUser = {};
let currentQuestionIndex = 1;
const TOTAL_QUESTIONS = 10;

const requiredQuestions = [1, 2, 5, 7, 10];

// MODIFIÉ: Accepte maintenant les données initiales
export function initSignup(initialData = null) {
  if (initialData) {
    Object.assign(newUser, initialData); // Fusionne les données initiales dans newUser
    console.log('Données initiales enregistrées:', newUser);
  }
  showTemplate(1);
}

function showTemplate(templateId) {
  const main = document.getElementById('app-main');
  main.innerHTML = ''; // Nettoie le contenu existant
  
  const template = document.querySelector(`template[data-slide-id="${templateId}"]`);
  
  if (!template) {
    console.error(`Template ${templateId} non trouvé`);
    return;
  }

  main.appendChild(template.content.cloneNode(true));

  // AMÉLIORÉ: Gestion plus robuste des boutons
  const submitButton = main.querySelector('.submit-btn');
  const skipButton = main.querySelector('.skip-btn');

  if (submitButton) {
    submitButton.addEventListener('click', handleSubmit);
  }

  if (skipButton && !requiredQuestions.includes(currentQuestionIndex)) {
    skipButton.addEventListener('click', () => {
      currentQuestionIndex++;
      showTemplate(currentQuestionIndex);
    });
  }
}

function handleSubmit(event) {
  event.preventDefault();

  if (requiredQuestions.includes(currentQuestionIndex)) {
    if (!isQuestionAnswered()) {
      alert('Veuillez remplir ce champ obligatoire');
      return;
    }
  }

  saveCurrentAnswers();

  if (currentQuestionIndex < TOTAL_QUESTIONS) {
    currentQuestionIndex++;
    showTemplate(currentQuestionIndex);
  } else {
    finishSignup();
  }
}

// Les fonctions suivantes restent inchangées
function isQuestionAnswered() {
  switch (currentQuestionIndex) {
    case 1:
      return document.getElementById('height')?.value;
    case 2:
      return document.getElementById('marital')?.value;
    case 5:
      return document.querySelector('input[name="pet"]:checked');
    case 7:
      return document.querySelectorAll('input[name="interets"]:checked').length > 0;
    case 10:
      return document.getElementById('email')?.value &&
             document.getElementById('password')?.value;
    default:
      return true;
  }
}

function saveCurrentAnswers() {
  switch (currentQuestionIndex) {
    case 1:
      newUser.height = document.getElementById('height')?.value;
      break;
    case 2:
      newUser.marital = document.getElementById('marital')?.value;
      break;
    case 3:
      newUser.zodiac = document.getElementById('zodiac')?.value;
      break;
    case 4:
      newUser.smoker = document.querySelector('input[name="smoker"]:checked')?.value;
      break;
    case 5:
      newUser.pet = document.querySelector('input[name="pet"]:checked')?.value;
      break;
    case 6:
      newUser.music = document.getElementById('music')?.value;
      break;
    case 7:
      newUser.interests = Array.from(document.querySelectorAll('input[name="interets"]:checked'))
        .map(cb => cb.value);
      break;
    case 8:
      newUser.picture = document.getElementById('picture')?.files[0];
      break;
    case 9:
      newUser.description = document.getElementById('description')?.value;
      break;
    case 10:
      newUser.email = document.getElementById('email')?.value;
      newUser.password = document.getElementById('password')?.value;
      break;
  }
  
  console.log('Réponses actuelles:', newUser);
}

function finishSignup() {
  const main = document.getElementById('app-main');
  const signinTemplate = document.getElementById('signin');
  
  main.innerHTML = '';
  main.appendChild(signinTemplate.content.cloneNode(true));
  
  console.log('Formulaire terminé !', newUser);
}