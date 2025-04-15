import { apiUrl } from "./config.js";
import { errorServer } from "./handling.error.js";
import { showErrorMessage } from "./handling.error.js";



// Asynchronous function to get the last event
export async function getLastEvent() {
  try {

    const httpResponse = await fetch(`${apiUrl}/filter-event`, {
      credentials: "include"
    });

    if (!httpResponse.ok) {
      return null;
    }

    // Parse the response as JSON
    const events = await httpResponse.json();
    return events;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

// Asynchronous function to sign up a user
export async function signUp(data) {
  try {
    const httpResponse = await fetch(`${apiUrl}/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!httpResponse.ok) {
      showErrorMessage('erreur dans les données renseignées lors de l\'inscription.');
      return null;
    }

    // Parse the response as JSON
    const createdUser = await httpResponse.json();
    return createdUser;

  } catch (error) {
    errorServer();  //alert ereur server
    console.error("API non accessible...", error);
  }
};


// Function to upload the image to Cloudinary
export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "my_preset"); 
  
  const response = await fetch("https://api.cloudinary.com/v1_1/duvt7hg01/image/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error('Cloudinary Error');
  }

  const data = await response.json();
  return data.secure_url;  // Return the secure URL of the image
}

// Asynchronous function to sign in a user
export async function signIn(data) {
  try {
    const httpResponse = await fetch(`${apiUrl}/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!httpResponse.ok) {
      showErrorMessage('Utilisateur non trouvé, veuillez verifier vos informations de connexion.')
      return null;
    }

    // Parse the response as JSON
    const connectedUser = await httpResponse.json();
    return connectedUser;

  } catch (error) {
    errorServer(); //alert ereur server
    console.error("API non accessible...", error);
  }
};



// Asynchronous function to authentificated user
export async function authentificationUser() {
  try {
    const httpResponse = await fetch(`${apiUrl}/verify-token`, {
      credentials: 'include',
    });

    if (!httpResponse.ok) {
      const authentificatedUser = false;
      return authentificatedUser;
    }
    // Parse the response as JSON      
    const authentificatedUser = true;
    return authentificatedUser;

  } catch (error) {
    console.error('Erreur de vérification du token :', error);
  }
};

// Asynchronous function to get the last profiles match with the city of customers
export async function getLastProfilesMatch() {
  try {

    const httpResponse = await fetch(`${apiUrl}/homepage-profiles`, {
      credentials: "include"
    });

    if (!httpResponse.ok) {
      return null;
    }

    // Parse the response as JSON
    const profiles = await httpResponse.json();
    return profiles;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

// Asynchronous function to get the last event match with the city of customers
export async function getLastEventsMatch() {
  try {

    const httpResponse = await fetch(`${apiUrl}/homepage-events`, {
      credentials: "include"
    });

    if (!httpResponse.ok) {
      return null;
    }

    // Parse the response as JSON
    const events = await httpResponse.json();
    return events;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

// Asynchronous function to get user data
export async function getMyAccount() {
  try {
    const httpResponse = await fetch(`${apiUrl}/my-account`, {
      credentials: "include",
    });
    if (!httpResponse.ok) {
      console.error("Erreur lors de la récupération des données utilisateur.");
      return null;
    }
    
    const myProfil = await httpResponse.json();
    return myProfil; // Retournez simplement les données sans manipuler le DOM
  } catch (error) {
    console.error("API non accessible...", error);
    return null;
  }
}

// Asynchronous function to get user data
export async function getVisitorProfile(userIdOrSlug) {
  try {
    const httpResponse = await fetch(`${apiUrl}/visitor-profile/${userIdOrSlug}`, {
      credentials: "include",
    });
    
    if (!httpResponse.ok) {
      const errorBody = await httpResponse.json();
      console.error("Erreur lors de la récupération des données utilisateur:", errorBody);
      return null;
    }
    
    const myProfil = await httpResponse.json();
    return myProfil;
  } catch (error) {
    console.error("API non accessible...", error);
    return null;
  }
}

// Asynchronous function to get event data
export async function getEventDetails(eventIdorSlug) {
  try {
    const httpResponse = await fetch(`${apiUrl}/event/${eventIdorSlug}`, {
      credentials: "include",
    });
    
    if (!httpResponse.ok) {
      const errorBody = await httpResponse.json();
      console.error("Erreur lors de la récupération des données utilisateur:", errorBody);
      return null;
    }
    
    const event = await httpResponse.json();
    return event;
  } catch (error) {
    console.error("API non accessible...", error);
    return null;
  }
}

export async function registerToEvent(eventId, userId) {
  try {
    const response = await fetch(`${apiUrl}/event/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ eventId, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Échec de l\'inscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
}

// Asynchronous function to edit user data
export async function editMyAccount(data) {
  try {
    const httpResponse = await fetch(`${apiUrl}/my-account`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!httpResponse.ok) {
      return null;
    }

    // Parse the response as JSON
    const updatedUser = await httpResponse.json();
    return updatedUser;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

export async function deleteMyAccount() {
  try {

    const httpResponse = await fetch(`${apiUrl}/my-account`, {
      method: "DELETE",
      credentials: "include",
    });


    if (!httpResponse.ok) {
      return null;
    }

    // Parse the response as JSON
    const myProfil = await httpResponse.json();
    return myProfil;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

export async function logOutMyAccount(){
  try {
    
    const httpResponse = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if(!httpResponse.ok){
      return null;
    }

    const logOut = await httpResponse.json();
    return logOut;

  } catch (error) {
    console.error("API non accessible...", error);
  }
}

export async function getAllEvents(){
  try {
    
    const httpResponse = await fetch(`${apiUrl}/events`, {
      credentials: "include",
    });

    if(!httpResponse.ok){
      return null;
    }

    const allEvents = await httpResponse.json();
    return allEvents;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

export async function getAllProfilsMatch(){
  try {
    
    const httpResponse = await fetch(`${apiUrl}/profils`, {
      credentials: "include",
    });

    if(!httpResponse.ok){
      return null;
    }

    const allProfils = await httpResponse.json();
    return allProfils;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};



// Fonction pour récupérer les messages entre deux utilisateurs
export async function fetchMessages(userId1, userId2) {
  console.log (userId1, userId2);
  try {
    const response = await fetch(`${apiUrl}/messages?user1=${userId1}&user2=${userId2}`, {
      method: "GET",
      credentials: "include", // Pour envoyer automatiquement les cookies
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`Erreur API GET Messages : ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la connexion à l'API :", error);
    return [];
  }
}

// Fonction pour envoyer un message entre deux utilisateurs
export async function sendMessage(senderId, receiverId, content) {
  try {
    const response = await fetch(`${apiUrl}/messages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId, content })
    });

    if (!response.ok) {
      console.error(`Erreur API POST Message : ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la connexion à l'API :", error);
    return null;
  }
}

export async function fetchConversations(currentUserId) {
  console.log("ID utilisateur reçu par fetchConversations:", currentUserId);
  try {
    // Utiliser le nouvel endpoint API
    const response = await fetch(`${apiUrl}/conversations?user=${currentUserId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API GET Conversations: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la connexion à l'API :", error);
    return [];
  }
}