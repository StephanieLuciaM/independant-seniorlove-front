import { fetchDisplayHomePageVisitor} from "./homepage.visitor.js";
import { displayOneSlide } from "./signup.js";

init();

async function init(){
  await fetchDisplayHomePageVisitor();
  displayOneSlide();
}

