import React from "react";
import { withRouter } from "react-router-dom";

import { isOnPage, isOnSection } from "utils/UrlUtils";

import PreviewPageRoute from "App/questionPage/Preview";
import PreviewSectionRoute from "App/section/Preview";

export const UnwrappedPreviewRoute = props => {
  if (isOnPage(props.match)) {
    return <PreviewPageRoute {...props} />;
  }
  if (isOnSection(props.match)) {
    return <PreviewSectionRoute {...props} />;
  }
};

export default withRouter(UnwrappedPreviewRoute);
