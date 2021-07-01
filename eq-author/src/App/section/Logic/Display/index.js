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
      page: propType(),
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

    const page = get(data, "page");

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    // if (!DISPLAY_PAGE_TYPES.includes(page.pageType)) {
    //   return (
    //     <Redirect
    //       to={buildPagePath({
    //         questionnaireId: match.params.questionnaireId,
    //         pageId: page.id,
    //       })}
    //     />
    //   );
    // }

    return <DisplayPage page={page} />;
  }

  render() {
    const page = this.props.data?.page;
    return (
      //   <PageContextProvider value={page}>
      <Logic page={page}>{this.renderContent()}</Logic>
      //   </PageContextProvider>
    );
  }
}

export default UnwrappedSectionDisplay;
