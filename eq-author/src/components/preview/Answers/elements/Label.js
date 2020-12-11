import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Error from "components/preview/Error";

const Description = styled.div`
  font-size: 0.8em;
  font-weight: normal;
  line-height: 1.4;
  margin-top: 0.2em;
  display: block;
  word-wrap: break-word;
`;

const Wrapper = styled.label`
  display: block;
  margin-bottom: 0.4em;
  font-weight: 600;
  font-size: 1em;
  line-height: 1.4;
  word-wrap: break-word;
`;

const Label = ({ description, children }) => (
  <Wrapper>
    {children || <Error small>Missing label</Error>}
    {description && (
      <>
        <Description>{description}</Description>
      </>
    )}
  </Wrapper>
);
Label.propTypes = {
  description: PropTypes.string,
  children: PropTypes.node,
};

export default Label;
