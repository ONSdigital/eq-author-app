/* eslint-disable import/no-unresolved */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconAddRule from "assets/icon-add-rule.svg?inline";
import IconRouting from "assets/icon-routing.svg?inline";

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

const AddSkipConditionsButton = styled(Button)`
  margin: 2em auto 1em;
  ${props =>
    props.isFirstQuestion &&
    `
     pointer-events: none;
     opacity: 0.6;`};
`;

const SkipConditionsSetMsg = ({
  onAddSkipConditions,
  isFirstQuestion,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    <Title>
      {isFirstQuestion
        ? "Skip logic not available for this question"
        : "No skip conditions exist for this question"}
    </Title>
    <Paragraph>
      {isFirstQuestion
        ? "You can't add skip logic to the first question in a questionnaire."
        : "All users will see this question if no skip logic is added."}
    </Paragraph>
    <AddSkipConditionsButton
      small
      naked
      variant="primary"
      onClick={onAddSkipConditions}
      data-test="btn-add-skip-condition"
      isFirstQuestion={isFirstQuestion}
      disabled={isFirstQuestion}
    >
      <IconText icon={IconAddRule}>Add your skip conditions</IconText>
    </AddSkipConditionsButton>
  </Container>
);

SkipConditionsSetMsg.propTypes = {
  onAddSkipConditions: PropTypes.func.isRequired,
  isFirstQuestion: PropTypes.bool.isRequired,
};

SkipConditionsSetMsg.defaultProps = {
  isFirstQuestion: false,
};

export default SkipConditionsSetMsg;
