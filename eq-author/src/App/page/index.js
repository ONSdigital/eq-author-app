import React from "react";

import { Route, Redirect } from "react-router-dom";

import { Query } from "react-apollo";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Logic/Routing";
import SkipLogic from "App/shared/Logic/SkipLogic";
import Error from "components/Error";

import isListCollectorPageType from "utils/isListCollectorPageType";

import GET_PAGE_QUERY from "graphql/getPage.graphql";

export default [
  <Route
    key="page-design"
    path="/q/:questionnaireId/page/:pageId/design/:modifier?"
    component={Design}
  />,
  <Route
    key="page-preview"
    path="/q/:questionnaireId/page/:pageId/preview"
    component={Preview}
  />,
  <Route key="page-logic" path="/q/:questionnaireId/page/:pageId/logic">
    <Redirect to="routing" />
  </Route>,
  <Route
    key="page-logic-routing"
    path="/q/:questionnaireId/page/:pageId/routing"
    component={Routing}
  />,
  <Route
    key="page-logic-skip"
    path="/q/:questionnaireId/page/:pageId/skip"
    render={(props) => (
      <Query
        query={GET_PAGE_QUERY}
        variables={{
          input: { pageId: props.match.params.pageId },
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <Error>Error fetching page</Error>;
          }

          if (data) {
            const { page } = data;
            return isListCollectorPageType(page.pageType) ? (
              <Redirect to="design" />
            ) : (
              <SkipLogic {...props} />
            );
          }
        }}
      </Query>
    )}
  />,
];
