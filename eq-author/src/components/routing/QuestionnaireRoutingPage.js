import React from "react";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { flowRight } from "lodash";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { withApollo, Query } from "react-apollo";

import { raiseToast } from "redux/toast/actions";

import EditorLayout from "components/EditorLayout";
import Loading from "components/Loading";
import RoutingEditor from "./RoutingEditor";
import Error from "components/Error";

import withCreateRoutingRuleSet from "containers/enhancers/withCreateRoutingRuleSet";
import withCreateRoutingCondition from "containers/enhancers/withCreateRoutingCondition";
import withDeleteRoutingCondition from "containers/enhancers/withDeleteRoutingCondition";
import withCreateRoutingRule from "containers/enhancers/withCreateRoutingRule";
import withDeleteRoutingRule from "containers/enhancers/withDeleteRoutingRule";
import withDeleteRoutingRuleSet from "containers/enhancers/withDeleteRoutingRuleSet";
import withToggleConditionOption from "containers/enhancers/withToggleConditionOption";
import withUpdateRoutingCondition from "containers/enhancers/withUpdateRoutingCondition";
import withUpdateRoutingRule from "containers/enhancers/withUpdateRoutingRule";
import withUpdateRoutingRuleSet from "containers/enhancers/withUpdateRoutingRuleSet";
import withUpdateConditionValue from "containers/enhancers/withUpdateConditionValue";
import RoutingRuleSet from "./RoutingRuleSet";
import RoutingRuleDestinationSelector from "./RoutingRuleDestinationSelector";
import RoutingRule from "./RoutingRule";
import RoutingCondition from "./RoutingCondition";
import BasicAnswer from "components/Answers/BasicAnswer";

import Option from "../Answers/MultipleChoiceAnswer/Option";

class UnwrappedQuestionnaireRoutingPage extends React.Component {
  static propTypes = {
    error: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire,
      currentPage: CustomPropTypes.page,
      availableRoutingDestinations: PropTypes.object
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

    return <EditorLayout>{this.renderContent()}</EditorLayout>;
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
    availableRoutingDestinations(pageId: $pageId) {
      logicalDestinations {
        ...LogicalDestination
      }
      questionPages {
        ...QuestionPageDestination
      }
      sections {
        ...SectionDestination
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

export default withRouting(props => (
  <Query
    query={ROUTING_QUERY}
    variables={props.match.params}
    fetchPolicy="network-only"
  >
    {innerProps => (
      <UnwrappedQuestionnaireRoutingPage {...innerProps} {...props} />
    )}
  </Query>
));
