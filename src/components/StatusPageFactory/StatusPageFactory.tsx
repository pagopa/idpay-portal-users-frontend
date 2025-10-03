import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import FeedbackContent from "../FeedbackContent/FeedbackContent";
import ROUTES from "../../routes";
import { errorState } from "../../pages/ErrorPage/errorStates";

export type FeedbackDef = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonRedirect?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
};

export function makeStatusPage<T extends Record<string, FeedbackDef>>(states: T) {
  return function StatusPage() {
    const { t } = useTranslation();
    const location = useLocation() as { state?: { status?: keyof T | string } };
    const status = location.state?.status as string | undefined;

    if (!status) {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    const feedback: FeedbackDef =
      status in states
        ? (states[status as keyof T] as FeedbackDef)
        : (errorState.UNKNOWN_ERROR as FeedbackDef);

    return (
      <Box
        sx={{ py: { xs: 4, sm: 6 }, height: "100%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxWidth="sm"
        mx="auto"
      >
        <FeedbackContent
          icon={feedback.icon}
          title={t(feedback.title)}
          description={t(feedback.description)}
          buttonLabel={feedback.buttonLabel && t(feedback.buttonLabel)}
          buttonRedirect={feedback.buttonRedirect}
          supportLinkLabel={feedback.supportLinkLabel && t(feedback.supportLinkLabel)}
          supportLinkUrl={feedback.supportLinkUrl}
        />
      </Box>
    );
  };
}