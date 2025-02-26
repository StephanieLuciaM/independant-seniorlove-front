import { fetchDisplayHomePageVisitor } from "./homepage.visitor";

// function error server
export function errorServer () {
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer plus tard.',
      });
}

// error message to be adapted as appropriate
export function showErrorMessage(message) {
  Swal.fire({
    icon: 'error', // Error icon
    title: 'Erreur',
    text: message, // Error message passed as a parameter
  });
}

//function that checks the age of the visitor
export function chekMinimumAge () { 
  
    Swal.fire({
      icon: 'warning',
      title: 'Âge insuffisant',
      text: 'Vous devez avoir au moins soixante ans pour vous inscrire.',
      confirmButtonText: 'Compris'
    });
   
}

// Data validation form signup
export function validateFormSignup(data, count) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lettersPattern = /^[A-Za-zÀ-ÿ\s]+$/;
    // Validation based on current stage
    switch (count) {
      case 1:
  
        if (!data.height) {
          return "Veuillez renseigner votre taille.";
        }
        const height = Number(data.height);
        if (!Number.isInteger(height)) {
          return "Veuillez entrer une taille valide.";
        }
        break;
  
      case 6:
  
        const musicPattern = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!musicPattern.test(data.music)) {
          return "Veuillez entrer uniquement des lettres pour le style de musique.";
        }
        break;
  
      case 10:
        // Validation of the registration form (firstname, email, password, confirmPassword)
        // Validation of firstname
        if (!data.firstname) {
          return "Veuillez renseigner votre prénom.";
        }
        if (!lettersPattern.test(data.firstname)) {
          return "Le prénom ne doit contenir que des lettres.";
        }
  
        // Validation of email
        if (!data.email) {
          return "L'email est requis.";
        }
        if (!emailPattern.test(data.email)) {
          return "Veuillez entrer une adresse email valide.";
        }
  
        // Validation of the password
        const pw = data.password || '';
        const pwErrors = [];
        if (pw.length < 8) pwErrors.push("8 caractères minimum.");
        if (pw.length > 100) pwErrors.push("100 caractères maximum.");
        if (!/[A-Z]/.test(pw)) pwErrors.push("Au moins une lettre majuscule.");
        if (!/[a-z]/.test(pw)) pwErrors.push("Au moins une lettre minuscule.");
        if (!/\d/.test(pw)) pwErrors.push("Au moins un chiffre.");
        if (/\s/.test(pw)) pwErrors.push("Pas d'espaces.");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) {
          pwErrors.push("Au moins un caractère spécial (ex: !@#$%).");
        }
        if (pwErrors.length > 0) {
          return "Mot de passe invalide: " + pwErrors.join(' ');
        }
  
        // Validation of password validation
        if (!data.confirmPassword) {
          return "Veuillez confirmer votre mot de passe.";
        }
        if (pw !== data.confirmPassword) {
          return "Les mots de passe ne correspondent pas.";
        }
        break;
      default:
        return null;
    }
  
    return null;
}

// Data validation form signin 
 export function validateFormSignin(data) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = data.email && emailPattern.test(data.email);
    
    const password = data.password || '';
    const isPasswordValid = 
      password.length >= 8 && 
      password.length <= 100 && 
      /[A-Z]/.test(password) && // At least one uppercase letter
      /[a-z]/.test(password) && // At least one lowercase letter
      /\d/.test(password) &&    // At least one digit
      /[!@#$%^&*(),.?":{}|<>]/.test(password) && // At least one special character
      !/\s/.test(password);    // No whitespace
    
    return isEmailValid && isPasswordValid;
}

// Function to display the confirmation dialog to delete account
export async function showConfirmationDialog() {
  return await Swal.fire({
    title: 'Attention',
    text: 'Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.',
    icon: 'warning', // Warning icon
    showCancelButton: true, // Show cancel button
    confirmButtonText: 'Oui, supprimer mon compte', // Confirm button text
    cancelButtonText: 'Non, annuler', // Cancel button text
    reverseButtons: true // Reverse the order of buttons
  });
}

// display the success deleted accout message
export async function showSuccessMessage() {
  await Swal.fire({
    icon: 'success', // Success icon
    title: 'Succès',
    text: 'Votre compte a bien été supprimé.',
  });

  // If the account deletion is successful, call fetchDisplayHomePageVisitor to update the page
  fetchDisplayHomePageVisitor();
}

// If the user canceled, show an informational message
export function ShowCancelAction (){
  Swal.fire({
    icon: 'info', // Info icon
    title: 'Annulé',
    text: 'Votre compte n\'a pas été supprimé.',
    timer: 2000, // Automatically close after 2 seconds
    showConfirmButton: false
  });
}

// display the success signup alert 
export function successSignup() { Swal.fire({
  title: "Parfait!",
  text: "Vous êtes bien inscrit, vous allez etre rediriger vers la page de connexion.",
  icon: "success",
  confirmButtonText: "OK"
});
}