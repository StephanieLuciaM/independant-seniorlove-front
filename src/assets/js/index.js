import { fetchDisplayHomePageVisitor} from "./homepage.visitor.js";

init();

async function init(){
  await fetchDisplayHomePageVisitor();
}

