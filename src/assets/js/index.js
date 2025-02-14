import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";

// Function to initialize the application
init()

async function init(){
    // Wait for the visitor home page to be fetched and displayed
    await fetchDisplayHomePageVisitor();
}