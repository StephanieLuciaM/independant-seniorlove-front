
import { fetchDisplayEditInfoPage } from "./edit.account.js";
import { fetchDisplayEditIntroPage } from "./edit.account.js";
import { fetchDisplayEditLabelPage } from "./edit.account.js";
import { fetchDisplayEditPersonalPage } from "./edit.account.js";
import { fetchDisplayHomePageConnected } from "./homepage.connected.js";
import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js";
import { fetchDisplayMyAccountPage } from "./my.account.js";
import { fetchDisplaySigninPage } from "./signin.js";
import { fetchDisplaySignupForm } from "./signup.js";
import { fetchDisplayLegalInfoPage } from "./legal.info.page.js";
import { fetchDisplayPrivacyPage } from "./privacy.cookies.page.js";
import { fetchDisplaySiteMapPage } from "./site.map.page.js";
import { fetchDisplay404Page } from "./error.404.page.js";
import { fetchDisplayEventsPage } from "./events.js";
import { fetchDisplayMessagesPage } from "./messages.js";
import { fetchDisplayProfilsPage } from "./profils.js";
import { fetchDisplayVisitorProfilePage } from "./profile.js";



const displayMap ={
  'fetchDisplayHomePageVisitor' : fetchDisplayHomePageVisitor,
  'fetchDisplaySigninPage': fetchDisplaySigninPage,
  'fetchDisplaySignupForm': fetchDisplaySignupForm,
  'fetchDisplayHomePageConnected': fetchDisplayHomePageConnected,
  'fetchDisplayMyAccountPage' : fetchDisplayMyAccountPage,
  'fetchDisplayEventsPage' : fetchDisplayEventsPage,
  'fetchDisplayEditInfoPage': fetchDisplayEditInfoPage,
  'fetchDisplayEditIntroPage': fetchDisplayEditIntroPage,
  'fetchDisplayEditLabelPage': fetchDisplayEditLabelPage,
  'fetchDisplayEditPersonalPage': fetchDisplayEditPersonalPage,
  'fetchDisplayLegalInfoPage': fetchDisplayLegalInfoPage,
  'fetchDisplayPrivacyPage': fetchDisplayPrivacyPage,
  'fetchDisplaySiteMapPage': fetchDisplaySiteMapPage,
  'fetchDisplayMessagesPage': fetchDisplayMessagesPage,
  'fetchDisplay404Page' : fetchDisplay404Page,
  'fetchDisplayProfilsPage' : fetchDisplayProfilsPage,
  'fetchDisplayVisitorProfilePage' : fetchDisplayVisitorProfilePage,
};

export function popstate(e) {
  const state = e.state;
  
  if (state && state.initFunction) {
	
	  const initFunction = displayMap[state.initFunction];
	  if (initFunction) {
      initFunction();
	  } else {
      // If the function is not found in displayMap, show the 404 page
      fetchDisplay404Page();
      history.replaceState({ page: "404", initFunction: 'fetchDisplay404Page' }, "", "/404");
	  }
  } 
};