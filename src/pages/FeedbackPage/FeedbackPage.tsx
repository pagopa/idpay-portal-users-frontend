import { feedbackStates } from "./feedbackStates";
import { makeStatusPage } from "../../components/StatusPageFactory/StatusPageFactory";

const FeedbackPage = makeStatusPage(feedbackStates);
export default FeedbackPage;