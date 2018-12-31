import React from "react";
import { withRouter } from "react-router-dom";

import { isOnPage, isOnSection, isOnConfirmation } from "utils/UrlUtils";

import PreviewPageRoute from "App/QuestionPage/Preview/PreviewPageRoute";
import PreviewSectionRoute from "App/Section/Preview/PreviewSectionRoute";
import PreviewConfirmationRoute from "App/QuestionConfirmation/Preview/PreviewConfirmationRoute";

export const UnwrappedPreviewRoute = props => {
  if (isOnPage(props.match)) {
    return <PreviewPageRoute {...props} />;
  }
  if (isOnSection(props.match)) {
    return <PreviewSectionRoute {...props} />;
  }
  if (isOnConfirmation(props.match)) {
    return <PreviewConfirmationRoute {...props} />;
  }
};

export default withRouter(UnwrappedPreviewRoute);
