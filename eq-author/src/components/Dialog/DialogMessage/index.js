import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import { lighten } from "polished";
import PropTypes from "prop-types";

const textStyle = lighten(0.1, colors.darkBlue);
const codeStyle = lighten(0.1, colors.blue);

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const Heading = styled.h2`
  font-size: 1.2em;
  color: ${colors.darkGrey};
  margin: 0 0 0.3em;
`;

export const Subheading = styled.h3`
  color: ${codeStyle};
  font-size: 1em;
  font-weight: normal;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Description = styled.div`
  font-size: 0.9em;
  margin: 1em 0;
  color: ${textStyle};
`;

const DialogMessage = (props) => {
  const { heading, subheading, description, ...otherProps } = props;

  return (
    <Message {...otherProps}>
      <Heading>{heading}</Heading>
      <Subheading>{subheading}</Subheading>
      <Description>{description}</Description>
    </Message>
  );
};

DialogMessage.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  description: PropTypes.string,
};

export default DialogMessage;
