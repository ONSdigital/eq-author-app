import React from "react";

import RedirectRoute from "components/RedirectRoute";

export default [
  <RedirectRoute
    key="metadata"
    from="/q/:questionnaireId/metadata"
    to="/q/:questionnaireId/data/sample-file-data"
  />,
];
