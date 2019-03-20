import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Description = styled("span")`
  font-weight: normal;
  font-size: 0.9em;
  &::before {
    content: "";
    display: block;
  }
`;

const DescribedText = ({ description, children, ...otherProps }) => {
  return (
    <span {...otherProps}>
      {children}
      {description && <Description>{description}</Description>}
    </span>
  );
};

DescribedText.propTypes = {
  description: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default DescribedText;
