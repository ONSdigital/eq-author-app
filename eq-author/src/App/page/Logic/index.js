import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Redirect, Link, Switch, Route } from "react-router-dom";

import { get } from "lodash";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import Routing from "./Routing";
import EditorLayout from "components/EditorLayout";
import Loading from "components/Loading";
import Error from "components/Error";
import { buildPagePath } from "utils/UrlUtils";

import QuestionPageEditor from "App/page/Design/QuestionPageEditor";
const ROUTING_PAGE_TYPES = ["QuestionPage"];

export class UnwrappedQuestionRoutingRoute extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // eslint-disable-line
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  renderContent() {
    const { data, loading, error, match } = this.props;
    console.log("\n\ndata", data);
    if (loading) {
      return <Loading height="20em">Loading routing</Loading>;
    }

    const page = get(data, "page");

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    if (!ROUTING_PAGE_TYPES.includes(page.pageType)) {
      return (
        <Redirect
          to={buildPagePath({
            questionnaireId: match.params.questionnaireId,
            pageId: page.id,
          })}
        />
      );
    }

    const routes = [
      {
        path: `${match.path}`,
        exact: true,
        main: Routing,
      },
      {
        path: `${match.path}/routing`,
        exact: true,
        main: Routing,
      },
      {
        path: `${match.path}/Skip`,
        exact: true,
        main: () => <h2>Skip logic is not yet defined</h2>,
      },
    ];

    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "20%",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to={`${match.url}/routing`}>Routing Logic</Link>
            </li>
            <li>
              <Link to={`${match.url}/skip`}>Skip Logic</Link>
            </li>
          </ul>
        </div>
        <div style={{ flex: 1, padding: "10px" }}>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
        {/* <div style={{ flex: 1, padding: "10px" }}>
          <Switch>
            <Route
              key="page-routing"
              path={`${match.path}`}
              // path="/q/:questionnaireId/page/:pageId/logic/routing"
              component={Routing}
              // page={page}
            />
          </Switch>
        </div> */}
      </div>

      // <div>
      //   <ul>
      //     <li>
      //       <Link to={`${match.url}/routing`}>Routing Logic</Link>
      //     </li>
      //     <li>
      //       <Link to="/dashboard">Skip Logic</Link>
      //     </li>
      //   </ul>

      //   <hr />

      //   <Switch>
      //     <Route
      //       key="page-routing"
      //       path={`${match.path}`}
      //       // path="/q/:questionnaireId/page/:pageId/logic/routing"
      //       component={Routing}
      //       // page={page}
      //     />
      //     ,
      //   </Switch>
      // </div>
    );
  }

  render() {
    const displayName = get(this.props.data, "page.displayName", "");
    return (
      <EditorLayout design preview logic title={displayName}>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
      ...QuestionPage
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
`;

const QueryingRoute = props => (
  <Query
    query={PAGE_QUERY}
    variables={{
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => <UnwrappedQuestionRoutingRoute {...innerProps} {...props} />}
  </Query>
);
QueryingRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QueryingRoute;
