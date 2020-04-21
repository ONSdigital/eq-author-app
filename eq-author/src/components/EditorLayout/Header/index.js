import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";

import CustomPropTypes from "custom-prop-types";

import { withQuestionnaire } from "components/QuestionnaireContext";

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
  margin-right: -1.5em;
`;

export const UnconnectedHeader = props => {
  const { match } = props;

  useSubscription(publishStatusSubscription, {
    variables: { id: match.params.questionnaireId },
  });
};

export const publishStatusSubscription = gql`
  subscription PublishStatus($id: ID!) {
    publishStatusUpdated(id: $id) {
      id
      publishStatus
    }
  }
`;

UnconnectedHeader.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  title: PropTypes.string,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  children: PropTypes.node,
  match: PropTypes.shape({
    params: PropTypes.shape({
      modifier: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default flowRight(withQuestionnaire, withRouter)(UnconnectedHeader);
