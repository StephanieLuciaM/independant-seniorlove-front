import { fetchMessages, sendMessage } from "./api.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplayProfilsPage } from "./profils.js";
import { resetViewTemplate } from "./utils.js";


// Fonction principale pour afficher les messages
export async function fetchDisplayMessagesPage(userId1, userId2) {
  if (!userId1 || !userId2) {
    console.error("IDs utilisateurs manquants");
    return;
  }

  resetViewTemplate("app-header", "app-main");
  
  // Charge le template des messages
  const appHeader = document.querySelector("#app-header");
  const appMain = document.querySelector("#app-main");
  appHeader.innerHTML = ""; // Vide le header
  appMain.innerHTML = ""; // Vide le contenu principal
  
  const headerTemplate = document.querySelector("#header-connected");
  const messagesTemplate = document.querySelector("#messages-page");
  
  const headerClone = headerTemplate.content.cloneNode(true);
  const messagesClone = messagesTemplate.content.cloneNode(true);
  
  appHeader.appendChild(headerClone);
  appMain.appendChild(messagesClone);
  
  // Met à jour le nom du destinataire (à adapter selon votre logique)
  document.querySelector(".conversation-partner").textContent = `Utilisateur ${userId2}`;
  
  // Récupère les messages entre deux utilisateurs
  const allMessages = await fetchMessages(userId1, userId2);
  const messagesList = document.querySelector(".messages-list");
  
  if (allMessages && allMessages.length) {
    // Affiche tous les messages
    allMessages.forEach(message => {
      addMessageToList(message, userId1);
    });
    
    // Scroll jusqu'au bas de la liste des messages
    messagesList.scrollTop = messagesList.scrollHeight;
  }
  
  // Ajoute l'événement d'envoi de message
  setupMessageSending(userId1, userId2);


  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
}

// Configuration de l'envoi de message
function setupMessageSending(senderId, receiverId) {
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendMessageButton");
  
  // Fonction pour envoyer le message
  const sendMessageHandler = async () => {
    const content = messageInput.value.trim();
    if (!content) return;
    
    try {
      const message = await sendMessage(senderId, receiverId, content);
      if (message) {
        // Ajoute le message à l'interface sans recharger tout
        addMessageToList(message, senderId);
        
        // Vide le champ de saisie
        messageInput.value = "";
        
        // Scroll jusqu'au bas
        const messagesList = document.querySelector(".messages-list");
        messagesList.scrollTop = messagesList.scrollHeight;
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };
  
  // Ajoute les écouteurs d'événements
  sendButton.addEventListener("click", sendMessageHandler);
  
  // Permet d'envoyer avec la touche Entrée
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageHandler();
    }
  });
}

// Fonction pour ajouter un message à la liste
function addMessageToList(messageData, currentUserId) {
  const messageTemplate = document.querySelector("#message-item");
  const messageClone = messageTemplate.content.cloneNode(true);
  const messageBubble = messageClone.querySelector(".message-bubble");
  
  // Détermine si c'est un message envoyé ou reçu
  const isOutgoing = messageData.sender_id == currentUserId;
  messageBubble.classList.add(isOutgoing ? "message-outgoing" : "message-incoming");
  
  // Remplit les détails du message
  messageClone.querySelector(".message-sender").textContent = 
    isOutgoing ? "Vous" : `Utilisateur ${messageData.sender_id}`;
  
  // Formate la date (si disponible)
  if (messageData.created_at || messageData.updated_at) {
    const date = new Date(messageData.created_at || messageData.updated_at);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageClone.querySelector(".message-time").textContent = timeString;
  }
  
  messageClone.querySelector(".message-content").textContent = messageData.content;
  
  // Ajoute le message à la liste
  document.querySelector(".messages-list").appendChild(messageClone);
}

function addMyAccountButtonListener(data){

  // Select the "Mon compte" button from the header
  const myAccountButton = document.querySelector("#app-header .my__account");

  // Add click event listener to the "Mon compte" button
  myAccountButton.addEventListener('click', (e) =>{
    
    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Mon compte" page with the provided data
    fetchDisplayMyAccountPage(data);
    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
};


function addEventsButtonListener(data){

  // Select the "Évènements" button from the header
  const EventsButton = document.querySelector("#app-header .header__nav-link-events");

  // Add click event listener to the "Évènements" button
  EventsButton.addEventListener('click', (e) =>{

    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayEventsPage(data);
    const state = {page: "Évènements", initFunction: 'fetchDisplayEventsPage'};
    const url = "/evenements";
    history.pushState(state, "", url);
  });
};

function addProfilsButtonListener(data){

  // Select the "Évènements" button from the header
  const ProfilsButton = document.querySelector("#app-header .header__nav-link-profils");

  // Add click event listener to the "Évènements" button
  ProfilsButton.addEventListener('click', (e) =>{

    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Fetch and display the "Évènements" page with the provided data
    fetchDisplayProfilsPage(data);
    const state = {page: "Profils", initFunction: 'fetchDisplayProfilsPage'};
    const url = "/profils";
    history.pushState(state, "", url);
  });
};