import React from "react";
import { withRouter } from "react-router-dom";

import { isOnPage, isOnSection } from "utils/UrlUtils";

import PreviewPageRoute from "App/QuestionPage/Preview/PreviewPageRoute";
import PreviewSectionRoute from "App/Section/Preview/PreviewSectionRoute";

export const UnwrappedPreviewRoute = props => {
  if (isOnPage(props.match)) {
    return <PreviewPageRoute {...props} />;
  }
  if (isOnSection(props.match)) {
    return <PreviewSectionRoute {...props} />;
  }
};

export default withRouter(UnwrappedPreviewRoute);
