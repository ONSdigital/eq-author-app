import React from "react";
import { Route } from "react-router-dom";

import { Routes } from "utils/UrlUtils";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Routing";

export default () => (
  <>
    <Route
      path={`${Routes.PAGE_BASE}/design`}
      component={Design}
      exact={false}
    />
    <Route path={`${Routes.PAGE_BASE}/preview`} component={Preview} />
    <Route path={`${Routes.PAGE_BASE}/routing`} component={Routing} />
  </>
);
