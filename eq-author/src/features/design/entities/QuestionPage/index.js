import React from "react";
import { Route } from "react-router-dom";

import RedirectRoute from "components/RedirectRoute";
import { Routes } from "utils/UrlUtils";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Routing";

const designRoute = `${Routes.PAGE_BASE}/design`;

export default () => (
  <>
    <Route path={designRoute} component={Design} />
    <Route path={`${Routes.PAGE_BASE}/preview`} component={Preview} />
    <Route path={`${Routes.PAGE_BASE}/routing`} component={Routing} />
    <RedirectRoute from={`${Routes.PAGE_BASE}/*`} to={designRoute} />
  </>
);
