import { apiUrl } from "./config.js";

// Asynchronous function to get the last event
export async function getLastEvent(){
  try {

    const httpResponse = await fetch(`${apiUrl}/filter-event`,{
      credentials: "include"
    });


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
};

// Asynchronous function to sign up a user
export async function signUp(data){
  try {
    const httpResponse = await fetch(`${apiUrl}/signup`,{
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if(!httpResponse.ok){
      console.log(httpResponse);
      return null;
    }

// Parse the response as JSON
    const createdUser= await httpResponse.json();
    return createdUser; 

  } catch (error) {
    console.error("API non accessible...", error);  
  }
};

// Asynchronous function to sign in a user
export async function signIn(data){
  try {
    const httpResponse = await fetch(`${apiUrl}/signin`,{
      method: "POST",
      credentials: "include",
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
};

// Asynchronous function to authentificated user
export async function authentificationUser(){
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
    console.error('Erreur de vérification du token :', error)
  }
};

// Asynchronous function to get the last profiles match with the city of customers
export async function getLastProfilesMatch(){
  try {

    const httpResponse = await fetch(`${apiUrl}/homepage-profiles`,{
      credentials: "include"
    });


    if(!httpResponse.ok){
      console.log(httpResponse);
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
export async function getLastEventsMatch(){
  try {

    const httpResponse = await fetch(`${apiUrl}/homepage-events`,{
      credentials: "include"
    });


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
};

// Asynchronous function to get user data
export async function getMyAccount(){
  try {

    const httpResponse = await fetch(`${apiUrl}/my-account`,{
      credentials: "include",
    });


    if(!httpResponse.ok){
      console.log(httpResponse);
      return null;
    }

// Parse the response as JSON
    const myProfil = await httpResponse.json();
    return myProfil;

  } catch (error) {
    console.error("API non accessible...", error);
  }
};

// Asynchronous function to edit user data
export async function editMyAccount(data){
  try {
    const httpResponse = await fetch(`${apiUrl}/my-account`,{
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if(!httpResponse.ok){
      console.log(httpResponse);
      return null;
    }

// Parse the response as JSON
    const updatedUser= await httpResponse.json();
    return updatedUser; 

  } catch (error) {
    console.error("API non accessible...", error);  
  }
};


export async function deleteMyAccount(){
  try {

      const httpResponse = await fetch(`${apiUrl}/my-account`,{
        method: "DELETE",
        credentials: "include",
    });


    if(!httpResponse.ok){
      console.log(httpResponse);
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
      console.log(httpResponse);
      return null;
    }

    const logOut = await httpResponse.json();
    return logOut;

  } catch (error) {
    console.error("API non accessible...", error);
  }
}


