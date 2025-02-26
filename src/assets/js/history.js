import { fetchDisplayEditInfoPage } from "./edit.account.js"
import { fetchDisplayEditIntroPage } from "./edit.account.js"
import { fetchDisplayEditLabelPage } from "./edit.account.js"
import { fetchDisplayEditPersonalPage } from "./edit.account.js"
import { fetchDisplayHomePageConnected } from "./homepage.connected.js"
import { fetchDisplayHomePageVisitor } from "./homepage.visitor.js"
import { fetchDisplayMyAccountPage } from "./my.account.js"
import { fetchDisplaySigninPage } from "./signin.js"
import { fetchDisplaySignupForm } from "./signup.js"

const displayMap ={
	'fetchDisplayHomePageVisitor' : fetchDisplayHomePageVisitor,
	'fetchDisplaySigninPage': fetchDisplaySigninPage,
	'fetchDisplaySignupForm': fetchDisplaySignupForm,
	'fetchDisplayHomePageConnected': fetchDisplayHomePageConnected,
	'fetchDisplayMyAccountPage' : fetchDisplayMyAccountPage,
	'fetchDisplayEditInfoPage': fetchDisplayEditInfoPage,
	'fetchDisplayEditIntroPage': fetchDisplayEditIntroPage,
	'fetchDisplayEditLabelPage': fetchDisplayEditLabelPage,
	'fetchDisplayEditPersonalPage': fetchDisplayEditPersonalPage
};

export function popstate(e){
	const state = e.state

	if(state && state.initFunction){
		const initFunction = displayMap[state.initFunction];
		if (initFunction){
			initFunction();
		}
	}
};