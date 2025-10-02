import { errorState } from "./errorStates";
import { makeStatusPage } from "../../components/StatusPageFactory/StatusPageFactory";

const ErrorPage = makeStatusPage(errorState);
export default ErrorPage;