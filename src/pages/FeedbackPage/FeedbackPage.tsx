import { feedbackStates } from "./feedbackStates";
import { makeStatusPage } from "../StatusPageFactory/StatusPageFactory";

const FeedbackPage = makeStatusPage(feedbackStates, "ON_EVALUATION");
export default FeedbackPage;