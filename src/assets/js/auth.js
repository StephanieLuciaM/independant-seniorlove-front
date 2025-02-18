import { authentificationUser } from "./api.js";

export async function checkUserAuthentication() {
	// Call the function to authenticate the user and store the result
	const authentificatedUser = await authentificationUser();
	// If the user is not authenticated, return without any further action
	if(!authentificatedUser){
		return null;
	}
	return authentificatedUser;
};