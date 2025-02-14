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