import { errorState } from "./errorStates";
import { makeStatusPage } from "../StatusPageFactory/StatusPageFactory";

const ErrorPage = makeStatusPage(errorState, "INVALID_ACCESS_TOKEN");
export default ErrorPage;