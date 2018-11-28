import React from "react";
import { withRouter } from "react-router-dom";

import { isOnSection } from "utils/UrlUtils";

import PreviewSectionRoute from "components/PreviewSectionRoute";

export const UnwrappedPreviewRoute = props => {
  if (isOnSection(props.match)) {
    return <PreviewSectionRoute {...props} />;
  }
};

export default withRouter(UnwrappedPreviewRoute);
