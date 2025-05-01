import { fetchConversations, fetchMessages, getMyAccount, getVisitorProfile, sendMessage } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { addEventsButtonListener, 
  addHearderLogoButtonListener, 
  addMessagesButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";
  

// List of conversations (to be added)
let conversations = [];

// Function to display the list of conversations
export async function fetchDisplayConversationsList(currentUserId) {

  // If the user ID is not provided, try to retrieve it
  if (!currentUserId) {
    try {
      const myAccount = await getMyAccount();
      currentUserId = myAccount.id;
    } catch (error) {
      console.error("Impossible de récupérer l'ID de l'utilisateur actuel:", error);
      const storedUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (storedUserId) {
        currentUserId = storedUserId;
      } else {
        console.error("ID utilisateur manquant et impossible à récupérer");
        return;
      }
    }
  }

  console.log("Récupération des conversations pour l'utilisateur:", currentUserId);

  // Reset the view templates for the header and main section
  resetViewTemplate("app-header", "app-main");

  // Load message templates
  const appHeader = document.querySelector("#app-header");
  const appMain = document.querySelector("#app-main");
  appHeader.innerHTML = "";
  appMain.innerHTML = "";

  const headerTemplate = document.querySelector("#header-connected");
  
  // Fallback mechanism if no specific conversation template exists
  const conversationsTemplate = document.querySelector("#conversations-list-page") || 
                                document.querySelector("#messages-page");
 
  const headerClone = headerTemplate.content.cloneNode(true);
  const conversationsClone = conversationsTemplate.content.cloneNode(true);

  // Append header and main content
  appHeader.appendChild(headerClone);
  appMain.appendChild(conversationsClone);

  // Retrieve all conversations for the current user
  try {
    // Fetch conversations associated with the current user
    conversations = await fetchConversations(currentUserId);

    // Create a container for displaying conversations
    const conversationsList = document.createElement("div");
    conversationsList.classList.add("conversations-list");

    conversations.forEach(conv => {
      const partnerId = conv.user_id;
      const partnerSlug = conv.partner?.slug || null;

      const convItem = document.createElement("div");
      convItem.classList.add("conversation-item");

      // Create element for displaying the conversation partner
      const userDiv = document.createElement("div");
      userDiv.classList.add("conversation-user");
      userDiv.textContent = `${conv.partner?.slug || partnerId}`;

      // Create element for previewing the last message
      const previewDiv = document.createElement("div");
      previewDiv.classList.add("conversation-preview");
      previewDiv.textContent = conv.last_message;

      // Append elements to conversation item
      convItem.appendChild(userDiv);
      convItem.appendChild(previewDiv);

      // Event listener for clicking a conversation item
      convItem.addEventListener("click", () => {
        const partnerIdentifier = partnerSlug || partnerId;
        console.log("Navigating to conversation with:", partnerIdentifier, "currentUserId:", currentUserId);
        fetchDisplayMessagesPage(currentUserId, partnerIdentifier);
      });

      conversationsList.appendChild(convItem);
    });

    // Identify the container for placing conversation items
    const messagesContainer = document.querySelector(".messages-container");

    if (messagesContainer) {
      // Clear existing content before appending new elements
      messagesContainer.innerHTML = "";

      // Add section header
      const header = document.createElement("div");
      header.classList.add("messages-header");

      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Vos conversations";

      paragraph.appendChild(strong);
      header.appendChild(paragraph);
      messagesContainer.appendChild(header);

      // Append conversation list
      messagesContainer.appendChild(conversationsList);
    } else {
      // Create a custom container if the default one doesn't exist
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

      // Append conversations list
      customContainer.appendChild(conversationsList);

      // Append custom container to main section
      const appMain = document.querySelector("#app-main");
      if (appMain) {
        appMain.appendChild(customContainer);
      } else {
        console.error("Element #app-main not found");
      }
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }

  // Re-add navigation event listeners for header elements
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addMessagesButtonListener(); // Re-add the event listener for the messages button as well
  addEventsButtonListener();
};



// Fixed version of the fetchDisplayMessagesPage function
export async function fetchDisplayMessagesPage(currentUserId, otherIdentifier) {
  
  // If the current user ID is not provided, try to retrieve it
  if (!currentUserId) {
    try {
      const myAccount = await getMyAccount();
      currentUserId = myAccount.id;
    } catch (error) {
      console.error("Impossible de récupérer l'ID de l'utilisateur actuel:", error);
      return;
    }
  }
  
  // If the other user's identifier is missing, display the conversation list
  if (!otherIdentifier) {
    fetchDisplayConversationsList(currentUserId);
    return;
  }

  resetViewTemplate("app-header", "app-main");

  // Load message templates
  const appHeader = document.querySelector("#app-header");
  const appMain = document.querySelector("#app-main");
  appHeader.innerHTML = "";
  appMain.innerHTML = "";

  const headerTemplate = document.querySelector("#header-connected");
  const messagesTemplate = document.querySelector("#messages-page");
  
  // Clone and insert header and message templates
  const headerClone = headerTemplate.content.cloneNode(true);
  const messagesClone = messagesTemplate.content.cloneNode(true);
  appHeader.appendChild(headerClone);
  appMain.appendChild(messagesClone);

  // Add a back button to navigate to the conversation list
  const messagesHeader = document.querySelector(".messages-header");
  if (messagesHeader) {
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "← Retour";
    
    // Handle click event for the back button
    backButton.addEventListener("click", () => {
      fetchDisplayConversationsList(currentUserId);
      const state = { page: "Conversations", initFunction: 'fetchDisplayConversationsList' };
      const url = "/conversations";
      history.pushState(state, "", url);
    });

    messagesHeader.prepend(backButton);
  }

  // Retrieve conversations if they haven't been fetched yet
  if (!conversations || conversations.length === 0) {
    try {
      conversations = await fetchConversations(currentUserId);
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
    }
  }

  // Find the user's slug from the conversation list or the API
  let partnerSlug = otherIdentifier;
  let partnerInfo = null;

  const conversation = conversations.find(conv => 
    conv.partner?.slug === otherIdentifier || conv.user_id == otherIdentifier
  );

  if (conversation?.partner) {
    partnerSlug = conversation.partner.slug || otherIdentifier;
    partnerInfo = conversation.partner;
  } else {
    try {
      // Retrieve profile data if no previous conversation exists
      const profileInfo = await getVisitorProfile(otherIdentifier);
      partnerSlug = profileInfo?.slug || otherIdentifier;
      partnerInfo = profileInfo;
    } catch (error) {
      console.warn("Impossible de récupérer le slug du profil:", error);
      partnerSlug = otherIdentifier; // Fallback to identifier if slug is not available
    }
  }

  // Update the UI with the recipient's identifier
  const receiverSpan = document.querySelector("[slot='receiver-id']");
  if (receiverSpan) receiverSpan.textContent = partnerSlug;
  document.querySelector(".conversation-partner").textContent = partnerSlug;

  // Retrieve messages between users
  const allMessages = await fetchMessages(currentUserId, otherIdentifier);
  
  const messagesList = document.querySelector(".messages-list");
  const noMessagesElement = messagesList.querySelector(".no-messages");

  if (allMessages?.length) {
    if (noMessagesElement) noMessagesElement.style.display = "none"; // Hide "no messages" indicator

    // Clear existing messages while keeping the "no-messages" element
    [...messagesList.children].forEach(child => {
      if (!child.classList?.contains("no-messages")) messagesList.removeChild(child);
    });

    // Add fetched messages to the UI
    allMessages.forEach(message => addMessageToList(message, currentUserId, conversations));

    // Scroll to the last message
    messagesList.scrollTop = messagesList.scrollHeight;
  } else {
    if (noMessagesElement) noMessagesElement.style.display = "block"; // Show "no messages" indicator
  }

  // Set up message sending
  setupMessageSending(currentUserId, otherIdentifier);

  // Re-add navigation event listeners
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();

  // Update browser history state
  const state = { page: "Messages", initFunction: 'fetchDisplayMessagesPage', params: [currentUserId, otherIdentifier] };
  const url = `/messages/${partnerSlug}`;
  history.pushState(state, "", url);
};


// Function to configure message sending
function setupMessageSending(senderId, receiverId) {
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendMessageButton");

  // Check if message form elements exist
  if (!messageInput || !sendButton) {
    console.error("Éléments de formulaire de message non trouvés");
    return;
  }

  // Check if required IDs are present
  if (!senderId || !receiverId) {
    console.error("IDs d'expéditeur ou de destinataire manquants:", { senderId, receiverId });
    
    // Attempt to retrieve sender ID if missing
    if (!senderId) {
      getMyAccount().then(account => {
        setupMessageSending(account.id, receiverId);
      }).catch(error => {
        console.error("Impossible de récupérer l'ID de l'utilisateur:", error);
      });
      return;
    }
    return;
  }

  console.log("Configuration de l'envoi de message entre:", senderId, "et", receiverId);

  // Remove existing event listeners and attach new ones
  const oldSendButton = sendButton.cloneNode(true);
  sendButton.parentNode.replaceChild(oldSendButton, sendButton);
  const newSendButton = document.querySelector("#sendMessageButton");

  // Handle message sending
  const sendMessageHandler = async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    try {
      console.log("Envoi du message:", { senderId, receiverId, content });
      const message = await sendMessage(senderId, receiverId, content);

      if (message) {
        addMessageToList(message, senderId, conversations);
        messageInput.value = ""; // Clear input field
        document.querySelector(".messages-list").scrollTop = document.querySelector(".messages-list").scrollHeight;

        // Update conversation list in the background
        fetchConversations(senderId).then(updatedConversations => {
          conversations = updatedConversations;
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  newSendButton.addEventListener("click", sendMessageHandler);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageHandler();
    }
  });
};


// Function to add a message to the list
function addMessageToList(messageData, currentUserId, convList) {
  const messagesList = document.querySelector(".messages-list");

  // Remove the "No messages" placeholder if present
  const noMessages = messagesList.querySelector('.no-messages');
  if (noMessages) {
    messagesList.removeChild(noMessages);
  }

  const messageTemplate = document.querySelector("#message-item");
  const messageClone = messageTemplate.content.cloneNode(true);
  const messageBubble = messageClone.querySelector(".message-bubble");

  // Determine whether the message is outgoing or incoming
  const isOutgoing = messageData.sender_id == currentUserId;
  messageBubble.classList.add(isOutgoing ? "message-outgoing" : "message-incoming");

  // Identify sender name or slug
  let senderName = isOutgoing ? "Vous" : `User ${messageData.sender_id}`;

  // If it's an incoming message, try to find the sender's slug from conversation history
  if (!isOutgoing && convList?.length > 0) {
    const senderConv = convList.find(conv =>
      conv.user_id == messageData.sender_id || conv.partner?.id == messageData.sender_id
    );

    if (senderConv?.partner?.slug) {
      senderName = senderConv.partner.slug;
    }
  }

  // Populate message details with the sender's name or slug
  messageClone.querySelector(".message-sender").textContent = senderName;

  // Format and display the message timestamp
  if (messageData.created_at || messageData.updated_at) {
    const date = new Date(messageData.created_at || messageData.updated_at);

    // Define date and time format
    const dateString = date.toLocaleDateString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const timeString = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Combine date and time in a readable format
    messageClone.querySelector(".message-time").textContent = `${dateString} ${timeString}`;
  }

  // Populate the message content
  messageClone.querySelector(".message-content").textContent = messageData.content;

  // Append the message to the list
  messagesList.appendChild(messageClone);
};


