import React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import PropTypes from "prop-types";
import { uniqueId } from "lodash";
import { radius } from "constants/theme";

const StyledTooltip = styled(ReactTooltip)`
  background-color: black !important;
  opacity: 1 !important;
  font-size: 0.8rem !important;
  line-height: 1 !important;
  padding: 0.4rem 0.6rem !important;
  border-radius: ${radius} !important;
  white-space: pre;
`;

class Tooltip extends React.Component {
  getGeneratedId() {
    return this.id || (this.id = uniqueId("tooltip-"));
  }

  render() {
    const { children, content, ...otherProps } = this.props;
    const child = React.Children.only(children);
    const id = child.props.id || this.getGeneratedId();

    return (
      <React.Fragment>
        {React.cloneElement(child, {
          "data-tip": true,
          "data-for": id
        })}
        <StyledTooltip
          id={id}
          place="bottom"
          effect="solid"
          delayShow={200}
          {...otherProps}
        >
          {content}
        </StyledTooltip>
      </React.Fragment>
    );
  }
}

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  children: PropTypes.element.isRequired
};

export default Tooltip;
