export function resetViewTemplate(id, id2 = ''){
	// Select the header template using the first ID
	const headerTemplate = document.querySelector(`#${id}`);

	// Check if the header template has any child nodes
	if(headerTemplate.hasChildNodes()){
		// If it does, clear its inner HTML
		headerTemplate.innerHTML = '';
	}

	// If a second ID is provided
	if(id2){
		// Select the content template using the second ID
		const contentTemplate = document.querySelector(`#${id2}`);

		// Check if the content template has any child nodes
		if(contentTemplate.hasChildNodes()){
			// If it does, clear its inner HTML
			contentTemplate.innerHTML = '';
		};
	} 
};

export function getCookies(name) {
    // Split the document cookies into an array of individual cookies
    const cookies = document.cookie.split('; ');
    
    // Find the cookie that starts with the specified name and get its value
    const value = cookies.find(cookie => cookie.startsWith(name))?.split('=')[1];
    
    // Log the value of the cookie to the console
    console.log(value);
    
    // If the value is not found, return null
    if (!value) {
      return null;
    }
    
    // Return the decoded value of the cookie
    return decodeURIComponent(value);
};