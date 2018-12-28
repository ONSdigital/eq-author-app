import React from "react";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { flowRight } from "lodash";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { withApollo, Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { raiseToast } from "redux/toast/actions";

import EditorLayout from "App/questionPage/Design/EditorLayout";
import Loading from "components/Loading";
import RoutingEditor from "App/questionPage/Routing/RoutingEditor";
import Error from "components/Error";

import { isOnPage, buildDesignPath } from "utils/UrlUtils";

import withCreateRoutingRuleSet from "App/questionPage/Routing/withCreateRoutingRuleSet";
import withCreateRoutingCondition from "App/questionPage/Routing/withCreateRoutingCondition";
import withDeleteRoutingCondition from "App/questionPage/Routing/withDeleteRoutingCondition";
import withCreateRoutingRule from "App/questionPage/Routing/withCreateRoutingRule";
import withDeleteRoutingRule from "App/questionPage/Routing/withDeleteRoutingRule";
import withDeleteRoutingRuleSet from "App/questionPage/Routing/withDeleteRoutingRuleSet";
import withToggleConditionOption from "App/questionPage/Routing/withToggleConditionOption";
import withUpdateRoutingCondition from "App/questionPage/Routing/withUpdateRoutingCondition";
import withUpdateRoutingRule from "App/questionPage/Routing/withUpdateRoutingRule";
import withUpdateRoutingRuleSet from "App/questionPage/Routing/withUpdateRoutingRuleSet";
import withUpdateConditionValue from "App/questionPage/Routing/withUpdateConditionValue";
import RoutingRuleSet from "App/questionPage/Routing/RoutingRuleSet";
import RoutingRuleDestinationSelector from "App/questionPage/Routing/RoutingRuleDestinationSelector";
import RoutingRule from "App/questionPage/Routing/RoutingRule";
import RoutingCondition from "App/questionPage/Routing/RoutingCondition";
import BasicAnswer from "App/questionPage/Design/answers/BasicAnswer";

import Option from "App/questionPage/Design/answers/MultipleChoiceAnswer/Option";

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
