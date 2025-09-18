import { errorState } from "./errorStates";
import { makeStatusPage } from "../StatusPageFactory/StatusPageFactory";

const ErrorPage = makeStatusPage(errorState, "UNKNOWN_ERROR");
export default ErrorPage;