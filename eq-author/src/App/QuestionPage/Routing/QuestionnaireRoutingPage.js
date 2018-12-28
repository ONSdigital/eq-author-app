import React from "react";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { flowRight } from "lodash";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { withApollo, Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { raiseToast } from "redux/toast/actions";

import EditorLayout from "App/QuestionPage/Design/EditorLayout";
import Loading from "components/Loading";
import RoutingEditor from "App/QuestionPage/Routing/RoutingEditor";
import Error from "components/Error";

import { isOnPage, buildDesignPath } from "utils/UrlUtils";

import withCreateRoutingRuleSet from "App/QuestionPage/Routing/withCreateRoutingRuleSet";
import withCreateRoutingCondition from "App/QuestionPage/Routing/withCreateRoutingCondition";
import withDeleteRoutingCondition from "App/QuestionPage/Routing/withDeleteRoutingCondition";
import withCreateRoutingRule from "App/QuestionPage/Routing/withCreateRoutingRule";
import withDeleteRoutingRule from "App/QuestionPage/Routing/withDeleteRoutingRule";
import withDeleteRoutingRuleSet from "App/QuestionPage/Routing/withDeleteRoutingRuleSet";
import withToggleConditionOption from "App/QuestionPage/Routing/withToggleConditionOption";
import withUpdateRoutingCondition from "App/QuestionPage/Routing/withUpdateRoutingCondition";
import withUpdateRoutingRule from "App/QuestionPage/Routing/withUpdateRoutingRule";
import withUpdateRoutingRuleSet from "App/QuestionPage/Routing/withUpdateRoutingRuleSet";
import withUpdateConditionValue from "App/QuestionPage/Routing/withUpdateConditionValue";
import RoutingRuleSet from "App/QuestionPage/Routing/RoutingRuleSet";
import RoutingRuleDestinationSelector from "App/QuestionPage/Routing/RoutingRuleDestinationSelector";
import RoutingRule from "App/QuestionPage/Routing/RoutingRule";
import RoutingCondition from "App/QuestionPage/Routing/RoutingCondition";
import BasicAnswer from "App/QuestionPage/Design/Answers/BasicAnswer";

import Option from "App/QuestionPage/Design/Answers/MultipleChoiceAnswer/Option";

class UnwrappedQuestionnaireRoutingPage extends React.Component {
  static propTypes = {
    error: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire,
      currentPage: CustomPropTypes.page
    }),
    match: CustomPropTypes.match
  };

  state = {
    hasError: false
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  renderContent() {
    const { data, loading, error, ...otherProps } = this.props;

    if (loading) {
      return <Loading height="20em">Loading routing</Loading>;
    }

    if (error) {
      return <Error>Something went wrong</Error>;
    }

    return <RoutingEditor {...otherProps} {...data} />;
  }

  render() {
    if (this.state.hasError) {
      return <Error>Something went wrong</Error>;
    }

    return (
      <EditorLayout design preview routing>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

export const ROUTING_QUERY = gql`
  query GetRouting($questionnaireId: ID!, $pageId: ID!) {
    questionnaire(id: $questionnaireId) {
      id
      sections {
        id
        displayName
        pages {
          id
          ... on QuestionPage {
            displayName
            answers {
              id
              type
            }
          }
        }
      }
    }
    currentPage: questionPage(id: $pageId) {
      id
      displayName
      routingRuleSet {
        ...RoutingRuleSet
      }
      answers {
        id
      }
    }
  }

  ${RoutingRule.fragments.RoutingRule}
  ${RoutingRuleSet.fragments.RoutingRuleSet}
  ${RoutingCondition.fragments.RoutingCondition}
  ${RoutingRuleDestinationSelector.fragments.LogicalDestination}
  ${RoutingRuleDestinationSelector.fragments.AbsoluteDestination}
  ${RoutingRuleDestinationSelector.fragments.SectionDestination}
  ${RoutingRuleDestinationSelector.fragments.QuestionPageDestination}
  ${BasicAnswer.fragments.Answer}
  ${Option.fragments.Option}
`;

const withRouting = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withApollo,
  withCreateRoutingRuleSet,
  withCreateRoutingCondition,
  withDeleteRoutingCondition,
  withCreateRoutingRule,
  withDeleteRoutingRule,
  withToggleConditionOption,
  withUpdateRoutingCondition,
  withUpdateRoutingRule,
  withUpdateRoutingRuleSet,
  withDeleteRoutingRuleSet,
  withUpdateConditionValue
);

export default withRouting(props => {
  const { match } = props;
  if (!isOnPage(match)) {
    return <Redirect to={buildDesignPath(match.params)} />;
  }

  return (
    <Query
      query={ROUTING_QUERY}
      variables={match.params}
      fetchPolicy="network-only"
    >
      {innerProps => (
        <UnwrappedQuestionnaireRoutingPage {...innerProps} {...props} />
      )}
    </Query>
  );
});
