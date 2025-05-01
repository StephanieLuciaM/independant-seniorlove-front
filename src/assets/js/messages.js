import { fetchConversations, fetchMessages, getMyAccount, getVisitorProfile, sendMessage } from "./api.js";
import { resetViewTemplate } from "./utils.js";
import { addEventsButtonListener, 
  addHearderLogoButtonListener, 
  addMyAccountButtonListener, 
  addProfilsButtonListener } from "./button.js";


// List of conversations (to be added)
let conversations = [];

// Function to display the list of conversations
export async function fetchDisplayConversationsList(currentUserId) {

  // Ensure the user ID is provided before proceeding
  if (!currentUserId) {
    console.error("ID utilisateur manquant");
    return;
  }

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
    // First, fetch the account details of the connected user
    const myAccount = await getMyAccount();
    const currentUserId = myAccount.id;

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
      userDiv.textContent = `${conv.partner?.slug}`;

      // Create element for previewing the last message
      const previewDiv = document.createElement("div");
      previewDiv.classList.add("conversation-preview");
      previewDiv.textContent = conv.last_message;

      // Append elements to conversation item
      convItem.appendChild(userDiv);
      convItem.appendChild(previewDiv);

      // Event listener for clicking a conversation item
      convItem.addEventListener("click", () => {
        // Store the actual partner user ID in a data attribute
        // to ensure we have the correct ID for sending messages
        const receiverId = partnerId || conv.partner?.id;
        fetchDisplayMessagesPage(currentUserId, partnerSlug, receiverId);
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
        console.error("Élément #app-main introuvable");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
  }

  // Re-add navigation event listeners for header elements
  addHearderLogoButtonListener();
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();
}


// Main function to display messages between users
// Added optional actualReceiverId parameter to store the receiver's actual ID
export async function fetchDisplayMessagesPage(currentUserId, otherIdentifier, actualReceiverId = null) {
  
  // Validate current user ID before proceeding
  if (!currentUserId) {
    console.error("ID utilisateur actuel manquant");
    return;
  }
  
  // If the other user's ID is missing, show conversation list instead
  if (!otherIdentifier) {
    fetchDisplayConversationsList(currentUserId);
    return;
  }

  resetViewTemplate("app-header", "app-main");

  // Load the message templates
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

  // Add a back button to navigate to conversation list
  const messagesHeader = document.querySelector(".messages-header");
  if (messagesHeader) {
    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "← Retour";
    
    // Handle back button click event
    backButton.addEventListener("click", () => {
      fetchDisplayConversationsList(currentUserId);
      const state = { page: "Conversations", initFunction: 'fetchDisplayConversationsList' };
      const url = "/conversations";
      history.pushState(state, "", url);
    });

    messagesHeader.prepend(backButton);
  }

  // Fetch conversations if they haven't been retrieved yet
  if (!conversations || conversations.length === 0) {
    try {
      conversations = await fetchConversations(currentUserId);
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
    }
  }

  // Find user slug from the conversation list or API
  let partnerSlug = otherIdentifier;
  let partnerInfo = null;
  // Variable to store the actual receiver ID
  let receiverId = actualReceiverId;

  const conversation = conversations.find(conv => 
    conv.partner?.slug === otherIdentifier || conv.user_id == otherIdentifier
  );

  if (conversation?.partner) {
    partnerSlug = conversation.partner.slug || otherIdentifier;
    partnerInfo = conversation.partner;
    // If actualReceiverId is not provided, try to get it from the conversation
    if (!receiverId) {
      receiverId = conversation.partner.id || conversation.user_id;
    }
  } else {
    try {
      // Fetch profile data if no previous conversation exists
      const profileInfo = await getVisitorProfile(otherIdentifier);
      partnerSlug = profileInfo?.slug || otherIdentifier;
      partnerInfo = profileInfo;
      // If actualReceiverId is not provided, try to get it from the profile
      if (!receiverId) {
        receiverId = profileInfo?.id || otherIdentifier;
      }
    } catch (error) {
      console.warn("Impossible de récupérer le slug du profil:", error);
      partnerSlug = otherIdentifier; // Fallback to identifier if slug unavailable
      // If all else fails, use otherIdentifier as receiverId
      if (!receiverId) {
        receiverId = otherIdentifier;
      }
    }
  }

  // Update UI with recipient's identifier
  const receiverSpan = document.querySelector("[slot='receiver-id']");
  if (receiverSpan) receiverSpan.textContent = partnerSlug;
  document.querySelector(".conversation-partner").textContent = partnerSlug;

  // Fetch messages between users - Use receiverId instead of otherIdentifier for consistency
  const allMessages = await fetchMessages(currentUserId, receiverId);
 
  
  const messagesList = document.querySelector(".messages-list");
  const noMessagesElement = messagesList.querySelector(".no-messages");

  if (allMessages?.length) {
    if (noMessagesElement) noMessagesElement.style.display = "none"; // Hide empty message indicator

    // Clear existing messages while preserving "no-messages" element
    [...messagesList.children].forEach(child => {
      if (!child.classList?.contains("no-messages")) messagesList.removeChild(child);
    });

    // Append fetched messages to UI
    allMessages.forEach(message => addMessageToList(message, currentUserId, conversations));

    // Scroll to the latest message
    messagesList.scrollTop = messagesList.scrollHeight;
  } else {
    if (noMessagesElement) noMessagesElement.style.display = "block"; // Show "no messages" indicator
  }

  // Set up message sending - Use receiverId instead of otherIdentifier
  setupMessageSending(currentUserId, receiverId);

  // Store the receiver ID in a data attribute for future reference
  const messagesContainer = document.querySelector(".messages-container");
  if (messagesContainer) {
    messagesContainer.dataset.receiverId = receiverId;
  }

  // Re-add navigation event listeners
  addMyAccountButtonListener();
  addProfilsButtonListener();
  addEventsButtonListener();

  // Update browser history state
  const state = { 
    page: "Messages", 
    initFunction: 'fetchDisplayMessagesPage', 
    params: [currentUserId, partnerSlug, receiverId] 
  };
  const url = `/messages/${partnerSlug}`;
  history.pushState(state, "", url);
};

// Function to set up message sending behavior
function setupMessageSending(senderId, receiverId) {
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendMessageButton");

  if (!messageInput || !sendButton) {
    console.error("Éléments du formulaire de message introuvables");
    return;
  }

  // Log the IDs used for message sending (for debugging)
  console.log(`Configuration de l'envoi de messages: senderId=${senderId}, receiverId=${receiverId}`);

  // Remove existing event listeners and attach new ones
  const oldSendButton = sendButton.cloneNode(true);
  sendButton.parentNode.replaceChild(oldSendButton, sendButton);
  const newSendButton = document.querySelector("#sendMessageButton");

  // Handle message sending
  const sendMessageHandler = async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    try {
      // Get the receiver ID from the data attribute if available
      const messagesContainer = document.querySelector(".messages-container");
      const storedReceiverId = messagesContainer?.dataset?.receiverId;
      
      // Use the stored ID or the provided one
      const finalReceiverId = storedReceiverId || receiverId;
      
      console.log(`Envoi du message à: ${finalReceiverId}`);
      
      const message = await sendMessage(senderId, finalReceiverId, content);

      if (message) {
        addMessageToList(message, senderId);
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
  let senderName = isOutgoing ? "Vous" : `Utilisateur ${messageData.sender_id}`;

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