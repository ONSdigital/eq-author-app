import React from "react";
import { withRouter } from "react-router-dom";

import { isOnPage, isOnSection, isOnConfirmation } from "utils/UrlUtils";

import PreviewPageRoute from "App/questionPage/Preview";
import PreviewSectionRoute from "App/section/Preview";
import PreviewConfirmationRoute from "App/questionConfirmation/Preview";

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
