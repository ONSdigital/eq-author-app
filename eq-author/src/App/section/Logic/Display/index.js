import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { get } from "lodash";
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";

import DisplayPage from "./DisplayPage";
import transformNestedFragments from "utils/transformNestedFragments";

import Logic from "..";

import Loading from "components/Loading";
import Error from "components/Error";

export class UnwrappedSectionDisplay extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      section: propType(),
      // transformNestedFragments(
      //   DisplayPage.fragments[0],
      //   DisplayPage.fragments.slice(1)
      // )
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

    if (loading) {
      return <Loading height="20em">Loading display</Loading>;
    }

    const section = get(data, "section");

    if (error || !section) {
      return <Error>Something went wrong</Error>;
    }

    return <DisplayPage section={section} />;
  }

  render() {
    const section = this.props.data?.section;
    return (
      //   <PageContextProvider value={section}>
      <Logic section={section}>{this.renderContent()}</Logic>
      //   </PageContextProvider>
    );
  }
}

export default UnwrappedSectionDisplay;
