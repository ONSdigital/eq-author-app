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
  ${({ disabled }) => disabled && "opacity: 0.6;"};
`;

const SkipConditionsSetMsg = ({
  onAddSkipConditions,
  title,
  paragraph,
  disabled,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    <Title> {title}</Title>
    <Paragraph> {paragraph}</Paragraph>
    <AddSkipConditionsButton
      small
      naked
      variant="primary"
      onClick={onAddSkipConditions}
      data-test="btn-add-skip-condition"
      disabled={disabled}
    >
      <IconText icon={IconAddRule}>Add your skip conditions</IconText>
    </AddSkipConditionsButton>
  </Container>
);

SkipConditionsSetMsg.propTypes = {
  onAddSkipConditions: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
};

export default SkipConditionsSetMsg;
