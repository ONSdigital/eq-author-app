import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Label from "components/Forms/Label";

const MainLabel = styled("span")`
  display: block;
`;

const SubLabel = styled("span")`
  font-weight: normal;
  font-size: 0.9em;
  display: block;
`;

const DescribedLabel = ({ description, children, ...otherProps }) => {
  if (!description) {
    return <Label {...otherProps}>{children}</Label>;
  }

  return (
    <Label {...otherProps}>
      <MainLabel>{children}</MainLabel>
      <SubLabel>{description}</SubLabel>
    </Label>
  );
};

DescribedLabel.propTypes = {
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default DescribedLabel;
