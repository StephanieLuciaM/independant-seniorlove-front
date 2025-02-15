import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
import { checkUserAuthentication } from "./auth.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";

// Function to initialize the application
init()

async function init() {
  // Verify the JWT token and update the user interface
  const user = await checkUserAuthentication();
  // If the user is not authenticated, display the visitor home page
  if (!user) {
    await fetchDisplayHomePageVisitor();
  }
  // Display the home page for authenticated users
  fetchDisplayHomePageConnected();
}


