import React from "react";
import { Route } from "react-router-dom";

import { Routes } from "utils/UrlUtils";

import Design from "./Design";
import Preview from "./Preview";

export default () => (
  <>
    <Route
      path={`${Routes.SECTION_BASE}/design`}
      component={Design}
      exact={false}
    />
    <Route path={`${Routes.SECTION_BASE}/preview`} component={Preview} />
  </>
);
