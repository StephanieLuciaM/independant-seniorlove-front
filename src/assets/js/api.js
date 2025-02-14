import { apiUrl } from "./config.js";

// Asynchronous function to get the last event
export async function getLastEvent(){
  try {
    const httpResponse = await fetch(`${apiUrl}/filterevent`);

    if(!httpResponse.ok){
      console.log(httpResponse);
      return null;
    }

// Parse the response as JSON
    const events = await httpResponse.json();

    return events;

  } catch (error) {
    console.error("API non accessible...", error);
  }
}

// Asynchronous function to sign in a user
export async function signIn(data){
  try {
    const httpResponse = await fetch(`${apiUrl}/signin`,{
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if(!httpResponse.ok){
      console.log(httpResponse);
      return null;
    }

// Parse the response as JSON
    const connectedUser= await httpResponse.json();
    return connectedUser; 

  } catch (error) {
    console.error("API non accessible...", error);  
  }
}