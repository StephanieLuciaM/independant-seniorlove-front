export function resetViewTemplate(id, id2 = ''){
    const headerTemplate = document.querySelector(`#${id}`)
    if(headerTemplate.hasChildNodes()){
        headerTemplate.innerHTML = ''
    }
    if(id2){
        const contentTemplate = document.querySelector(`#${id2}`)
        if(contentTemplate.hasChildNodes()){
            contentTemplate.innerHTML = ''
        }
    }  
}