import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import FeedbackContent from "../FeedbackContent/FeedbackContent";
import ROUTES from "../../routes";

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
    const location = useLocation() as { state?: { status?: keyof T } };

    const status = location.state?.status;

    if (!status || !states[status]) {
      return <Navigate to={ROUTES.HOME} replace />;
    }

    const feedback = states[status as keyof T];

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
