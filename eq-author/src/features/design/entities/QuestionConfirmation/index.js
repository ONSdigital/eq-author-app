import React from "react";
import { Route } from "react-router-dom";

import { Routes } from "utils/UrlUtils";
import RedirectRoute from "components/RedirectRoute";

import Design from "./Design";

const designRoute = `${Routes.QUESTION_CONFIRMATION_BASE}/design`;

export default () => (
  <>
    <Route path={designRoute} component={Design} />
    <RedirectRoute
      from={`${Routes.QUESTION_CONFIRMATION_BASE}/routing`}
      to={designRoute}
    />
    <RedirectRoute
      from={`${Routes.QUESTION_CONFIRMATION_BASE}/preview`}
      to={designRoute}
    />
  </>
);
