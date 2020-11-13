import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconAddRule from "../icon-add-rule.svg?inline";
import IconRouting from "./icon-routing.svg?inline";

import { flowRight } from "lodash";
import { withQuestionnaire } from "components/QuestionnaireContext";

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 3em 0 2em;
`;

const Icon = styled(IconRouting)`
  display: block;
  margin: 0 auto 0.5em;
`;

const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

const Paragraph = styled.p`
  margin: 0;
`;

const AddRoutingButton = styled(Button)`
  margin: 2em auto 1em;
  ${props =>
    props.isLastPage &&
    `
     pointer-events: none;
     opacity: 0.6;`};
`;

const RoutingRuleSetMsg = ({ onAddRouting, page, ...otherProps }) => {
  const lastSection =
    otherProps.questionnaire && otherProps.questionnaire.sections.length;
  const lastSectionPage =
    otherProps.questionnaire &&
    otherProps.questionnaire.sections[lastSection - 1].pages.length;
  const lastPageId =
    otherProps.questionnaire &&
    otherProps.questionnaire.sections[lastSection - 1].pages[
      lastSectionPage - 1
    ].id;
  const currentPageId = page && page.id;
  const isLastPage = lastPageId === currentPageId;
  return (
    <Container {...otherProps}>
      <Icon />
      <Title>
        {isLastPage
          ? "Routing is not available for this quesiton"
          : "No routing rules exist for this question"}
      </Title>
      <Paragraph>
        {isLastPage
          ? "You can't route on the last question in a questionnaire."
          : "Users completing this question will be taken to the next page."}
      </Paragraph>
      <AddRoutingButton
        small
        naked
        variant="primary"
        onClick={onAddRouting}
        data-test="btn-add-routing"
        isLastPage={isLastPage}
      >
        <IconText icon={IconAddRule}>Add your first rule</IconText>
      </AddRoutingButton>
    </Container>
  );
};

RoutingRuleSetMsg.propTypes = {
  onAddRouting: PropTypes.func.isRequired,
};

export default flowRight(withQuestionnaire)(RoutingRuleSetMsg);
