import { fetchConversations, fetchMessages, getMyAccount, sendMessage } from "./api.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplayProfilsPage } from "./profils.js";
import { resetViewTemplate } from "./utils.js";


// Liste des conversations (à ajouter)
let conversations = [];

// Fonction pour afficher la liste des conversations
export async function fetchDisplayConversationsList(currentUserId) {

  console.log("Current user ID in conversations list:", currentUserId);
  if (!currentUserId) {
    console.error("ID utilisateur manquant");
    return;
  }
  resetViewTemplate("app-header", "app-main");

  // Charge le template des messages
  const appHeader = document.querySelector("#app-header");
  const appMain = document.querySelector("#app-main");
  appHeader.innerHTML = "";
  appMain.innerHTML = "";

  const headerTemplate = document.querySelector("#header-connected");
  const conversationsTemplate = document.querySelector("#conversations-list-page") || 
                                document.querySelector("#messages-page"); // Fallback si pas de template spécifique
  
  const headerClone = headerTemplate.content.cloneNode(true);
  const conversationsClone = conversationsTemplate.content.cloneNode(true);
  
  appHeader.appendChild(headerClone);
  appMain.appendChild(conversationsClone);

  // Récupérer toutes les conversations de l'utilisateur courant
  try {
    // D'abord récupérer l'ID de l'utilisateur connecté
    const myAccount = await getMyAccount();
    const currentUserId = myAccount.id;

    conversations = await fetchConversations(currentUserId);
    // Afficher les conversations
    const conversationsList = document.createElement("div");
    conversationsList.classList.add("conversations-list");
  
    conversations.forEach(conv => {
      const convItem = document.createElement("div");
      convItem.classList.add("conversation-item");
    
      // Créer l'élément pour l'utilisateur
      const userDiv = document.createElement("div");
      userDiv.classList.add("conversation-user");
      userDiv.textContent = `Utilisateur ${conv.user_id}`;
    
      // Créer l'élément pour l'aperçu du message
      const previewDiv = document.createElement("div");
      previewDiv.classList.add("conversation-preview");
      previewDiv.textContent = conv.last_message;
    
      // Ajouter les éléments à l'élément de conversation
      convItem.appendChild(userDiv);
      convItem.appendChild(previewDiv);
    
      // Ajouter l'écouteur d'événement
      convItem.addEventListener("click", () => {
        fetchDisplayMessagesPage(currentUserId, conv.user_id);
      });
    
      conversationsList.appendChild(convItem);
    });
  
    // Chercher le conteneur où placer nos conversations
    const messagesContainer = document.querySelector(".messages-container");
  
    // Si on trouve le conteneur, on l'utilise
    if (messagesContainer) {
    // Vider le contenu actuel
      while (messagesContainer.firstChild) {
        messagesContainer.removeChild(messagesContainer.firstChild);
      }
    
      // Ajouter l'en-tête
      const header = document.createElement("div");
      header.classList.add("messages-header");
    
      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Vos conversations";
    
      paragraph.appendChild(strong);
      header.appendChild(paragraph);
      messagesContainer.appendChild(header);
    
      // Ajouter la liste des conversations
      messagesContainer.appendChild(conversationsList);
    } else {
    // Si le conteneur n'existe pas, on crée notre propre conteneur
    // et on l'ajoute à appMain
      const customContainer = document.createElement("div");
      customContainer.classList.add("messages-container", "custom-container");
    
      const header = document.createElement("div");
      header.classList.add("messages-header");
    
      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Vos conversations";
    
      paragraph.appendChild(strong);
      header.appendChild(paragraph);
      customContainer.appendChild(header);
    
      // Ajouter la liste des conversations
      customContainer.appendChild(conversationsList);
    
      // Ajouter le conteneur à appMain
      const appMain = document.querySelector("#app-main");
      if (appMain) {
        appMain.appendChild(customContainer);
      } else {
        console.error("Element #app-main non trouvé");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations :", error);
  }

  // Réajout des écouteurs d'événements de navigation
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
}

// Fonction principale pour afficher les messages
// Fonction principale pour afficher les messages
export async function fetchDisplayMessagesPage(currentUserId, otherUserId) {
  console.log("Affichage des messages entre", currentUserId, "et", otherUserId);
  
  // Si l'ID de l'autre utilisateur n'est pas défini, afficher la liste des conversations
  if (!currentUserId) {
    console.error("ID utilisateur courant manquant");
    return;
  }
  
  // Si otherUserId n'est pas défini, afficher la liste des conversations
  if (!otherUserId) {
    console.log("ID de l'autre utilisateur non fourni, affichage de la liste des conversations");
    fetchDisplayConversationsList(currentUserId);
    return;
  }

  resetViewTemplate("app-header", "app-main");
  


  // Charge le template des messages
  const appHeader = document.querySelector("#app-header");
  const appMain = document.querySelector("#app-main");
  appHeader.innerHTML = "";
  appMain.innerHTML = "";

  const headerTemplate = document.querySelector("#header-connected");
  const messagesTemplate = document.querySelector("#messages-page");
  const headerClone = headerTemplate.content.cloneNode(true);
  const messagesClone = messagesTemplate.content.cloneNode(true);

  appHeader.appendChild(headerClone);
  appMain.appendChild(messagesClone);

  // Ajouter un bouton retour pour revenir à la liste des conversations
  const messagesHeader = document.querySelector(".messages-header");
  if (messagesHeader) {
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "← Retour";
    backButton.addEventListener("click", () => {
      fetchDisplayConversationsList(currentUserId);
      const state = {page: "Conversations", initFunction: 'fetchDisplayConversationsList'};
      const url = "/conversations";
      history.pushState(state, "", url);
    });
    messagesHeader.prepend(backButton);
  }

  // Met à jour le nom du destinataire
  const receiverSpan = document.querySelector("[slot='receiver-id']");
  if (receiverSpan) {
    receiverSpan.textContent = otherUserId;
  }
  document.querySelector(".conversation-partner").textContent = `Utilisateur ${otherUserId}`;

  // Récupère les messages entre deux utilisateurs
  console.log("Récupération des messages entre", currentUserId, "et", otherUserId);
  const allMessages = await fetchMessages(currentUserId, otherUserId);
  console.log("Messages récupérés:", allMessages);
  
  const messagesList = document.querySelector(".messages-list");
  if (allMessages && allMessages.length) {
    // Vider d'abord la liste des messages
    messagesList.innerHTML = "";
    
    // Affiche tous les messages
    allMessages.forEach(message => {
      addMessageToList(message, currentUserId);
    });

    // Scroll jusqu'au bas de la liste des messages
    messagesList.scrollTop = messagesList.scrollHeight;
  } else {
    // Aucun message - afficher un message d'information
    messagesList.innerHTML = "<div class='no-messages'>Aucun message. Commencez la conversation !</div>";
  }

  // Ajoute l'envoi de message
  setupMessageSending(currentUserId, otherUserId);

  // Réajout des écouteurs d'événements de navigation
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
  
  // Mettre à jour l'URL
  const state = {page: "Messages", initFunction: 'fetchDisplayMessagesPage', params: [currentUserId, otherUserId]};
  const url = `/messages/${otherUserId}`;
  history.pushState(state, "", url);
}

// Configuration de l'envoi de message
function setupMessageSending(senderId, receiverId) {
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendMessageButton");
  
  if (!messageInput || !sendButton) {
    console.error("Éléments du formulaire de message non trouvés");
    return;
  }

  // Supprimer les anciens écouteurs d'événements si nécessaire
  const oldSendButton = sendButton.cloneNode(true);
  sendButton.parentNode.replaceChild(oldSendButton, sendButton);
  
  // Référencer le nouveau bouton
  const newSendButton = document.querySelector("#sendMessageButton");

  // Fonction pour envoyer le message
  const sendMessageHandler = async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    try {
      console.log("Envoi du message de", senderId, "à", receiverId, ":", content);
      const message = await sendMessage(senderId, receiverId, content);
    
      if (message) {
      // Ajoute le message à l'interface sans recharger tout
        addMessageToList(message, senderId);
      
        // Vide le champ de saisie
        messageInput.value = "";
      
        // Scroll jusqu'au bas
        const messagesList = document.querySelector(".messages-list");
        messagesList.scrollTop = messagesList.scrollHeight;
      
        // Mettre à jour la liste des conversations en arrière-plan
        fetchConversations(senderId).then(updatedConversations => {
          conversations = updatedConversations;
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // Ajoute les écouteurs d'événements
  newSendButton.addEventListener("click", sendMessageHandler);

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
  const messagesList = document.querySelector(".messages-list");
  
  // Supprimer le message "Aucun message" si présent
  const noMessages = messagesList.querySelector('.no-messages');
  if (noMessages) {
    messagesList.removeChild(noMessages);
  }
  
  const messageTemplate = document.querySelector("#message-item");
  const messageClone = messageTemplate.content.cloneNode(true);
  const messageBubble = messageClone.querySelector(".message-bubble");
  
  console.log("Message Data:", messageData);
  
  // Détermine si c'est un message envoyé ou reçu
  const isOutgoing = messageData.sender_id == currentUserId;
  messageBubble.classList.add(isOutgoing ? "message-outgoing" : "message-incoming");
  
  // Remplit les détails du message
  messageClone.querySelector(".message-sender").textContent = 
    isOutgoing ? "Vous" : `Utilisateur ${messageData.sender_id}`;
  
  // Formate la date et l'heure (si disponible)
  if (messageData.created_at || messageData.updated_at) {
    const date = new Date(messageData.created_at || messageData.updated_at);
    // Format de la date et de l'heure
    const dateString = date.toLocaleDateString([], { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    const timeString = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    // Combine la date et l'heure
    messageClone.querySelector(".message-time").textContent = `${dateString} ${timeString}`;
  }
  
  // Remplit le contenu du message
  messageClone.querySelector(".message-content").textContent = messageData.content;
  
  // Ajoute le message à la liste
  messagesList.appendChild(messageClone);
}

function addMyAccountButtonListener() {
  // Select the "Mon compte" button from the header
  const myAccountButton = document.querySelector("#app-header .my__account");
  if (!myAccountButton) return;
  
  // Clone et remplacer pour éviter les doublons d'écouteurs
  const oldButton = myAccountButton.cloneNode(true);
  myAccountButton.parentNode.replaceChild(oldButton, myAccountButton);
  
  const newButton = document.querySelector("#app-header .my__account");
  
  // Add click event listener to the "Mon compte" button
  newButton.addEventListener('click', (e) => {
    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Get the current user ID from localStorage or other source if available
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // Fetch and display the "Mon compte" page with the provided data
    fetchDisplayMyAccountPage(currentUserId);
    
    const state = {page: "Mon compte", initFunction: 'fetchDisplayMyAccountPage'};
    const url = "/mon-compte";
    history.pushState(state, "", url);
  });
}

function addProfilsButtonListener() {
  // Select the "Profils" button from the header
  const ProfilsButton = document.querySelector("#app-header .header__nav-link-profils");
  if (!ProfilsButton) return;
  
  // Clone et remplacer pour éviter les doublons d'écouteurs
  const oldButton = ProfilsButton.cloneNode(true);
  ProfilsButton.parentNode.replaceChild(oldButton, ProfilsButton);
  
  const newButton = document.querySelector("#app-header .header__nav-link-profils");
  
  // Add click event listener to the "Profils" button
  newButton.addEventListener('click', (e) => {
    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Get the current user ID from localStorage or other source if available
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // Fetch and display the "Profils" page with the provided data
    fetchDisplayProfilsPage(currentUserId);
    
    const state = {page: "Profils", initFunction: 'fetchDisplayProfilsPage'};
    const url = "/profils";
    history.pushState(state, "", url);
  });
}

function addEventsButtonListener() {
  // Select the "Événements" button from the header
  const EventsButton = document.querySelector("#app-header .header__nav-link-events");
  if (!EventsButton) return;
  
  // Clone et remplacer pour éviter les doublons d'écouteurs
  const oldButton = EventsButton.cloneNode(true);
  EventsButton.parentNode.replaceChild(oldButton, EventsButton);
  
  const newButton = document.querySelector("#app-header .header__nav-link-events");
  
  // Add click event listener to the "Événements" button
  newButton.addEventListener('click', (e) => {
    // Prevent the default behavior of the button
    e.preventDefault();
    
    // Get the current user ID from localStorage or other source if available
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    // Fetch and display the "Événements" page with the provided data
    fetchDisplayEventsPage(currentUserId);
    
    const state = {page: "Événements", initFunction: 'fetchDisplayEventsPage'};
    const url = "/evenements";
    history.pushState(state, "", url);
  });
}