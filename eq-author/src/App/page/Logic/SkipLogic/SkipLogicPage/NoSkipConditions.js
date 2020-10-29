/* eslint-disable import/no-unresolved */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import IconAddRule from "../icon-add-rule.svg?inline";
import IconRouting from "./icon-routing.svg?inline";

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
`;

const DisabledAddSkipConditionsButton = styled(Button)`
  margin: 2em auto 1em;
  pointer-events: none;
  opacity: 0.6;
`;

const SkipConditionsSetMsg = ({
  title,
  onAddSkipCondtions,
  children,
  position,
  ...otherProps
}) => (
  <Container {...otherProps}>
    <Icon />
    <Title>{title}</Title>
    <Paragraph>{children}</Paragraph>
    {position === 0 ? (
      <DisabledAddSkipConditionsButton
        small
        naked
        variant="primary"
        onClick={onAddSkipCondtions}
        data-test="btn-add-skip-condition"
      >
        <IconText icon={IconAddRule}>Add your skip conditions</IconText>
      </DisabledAddSkipConditionsButton>
    ) : (
      <AddSkipConditionsButton
        small
        naked
        variant="primary"
        onClick={onAddSkipCondtions}
        data-test="btn-add-skip-condition"
      >
        <IconText icon={IconAddRule}>Add your skip conditions</IconText>
      </AddSkipConditionsButton>
    )}
  </Container>
);

SkipConditionsSetMsg.propTypes = {
  title: PropTypes.string.isRequired,
  onAddSkipCondtions: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.number.isRequired,
};

export default SkipConditionsSetMsg;
