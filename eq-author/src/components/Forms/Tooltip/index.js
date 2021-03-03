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
  tooltip = React.createRef();

  getGeneratedId() {
    return this.id || (this.id = uniqueId("tooltip-"));
  }

  render() {
    const { children, content, ...otherProps } = this.props;
    const child = React.Children.only(children);
    const id = child.props.id || this.getGeneratedId();

    const modifiedChildProps = {
      "data-tip": true,
      "data-for": id,
    };
    if (child.props.onClick) {
      modifiedChildProps.onClick = (...args) => {
        ReactTooltip.hide();
        // Hack to properly hide the tooltip
        // https://github.com/wwayne/react-tooltip/issues/449
        if (this.tooltip) {
          this.tooltip.tooltipRef = null;
        }
        child.props.onClick(...args);
      };
    }

    return (
      <React.Fragment>
        {React.cloneElement(child, modifiedChildProps)}
        <StyledTooltip
          id={id}
          place="bottom"
          effect="solid"
          event="focus mouseover"
          eventOff="blur mouseout"
          delayShow={200}
          ref={(node) => {
            this.tooltip = node;
          }}
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
  children: PropTypes.element.isRequired,
};

export default Tooltip;
