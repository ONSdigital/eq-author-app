/* eslint-disable react/no-find-dom-node */
import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { uncontrollable } from "uncontrollable";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const ESC_KEY_CODE = 27;

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const Layer = styled.div`
  position: absolute;
  ${(props) => `${props.horizontalAlignment}: ${props.offsetX}`};
  ${(props) => `${props.verticalAlignment}: ${props.offsetY}`};
  z-index: 10;
`;

Layer.defaultProps = {
  horizontalAlignment: "left",
  verticalAlignment: "bottom",
  offsetX: "0",
  offsetY: "0",
};

Layer.propTypes = {
  horizontalAlignment: PropTypes.oneOf(["left", "right"]),
  verticalAlignment: PropTypes.oneOf(["top", "bottom"]),
  offsetX: PropTypes.string,
  offsetY: PropTypes.string,
};

const DefaultTransition = (props) => (
  <CSSTransition {...props} timeout={0} classNames="" />
);

class Popout extends React.Component {
  static defaultProps = {
    open: false,
    transition: DefaultTransition,
    container: Container,
    layer: Layer,
  };

  bindRootCloseHandlers() {
    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  unbindRootCloseHandlers() {
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  componentDidMount() {
    if (this.props.open) {
      this.bindRootCloseHandlers();
    }
  }

  componentDidUpdate() {
    if (this.props.open) {
      this.bindRootCloseHandlers();
    } else {
      this.unbindRootCloseHandlers();
    }
  }

  componentWillUnmount() {
    this.unbindRootCloseHandlers();
  }

  handleKeyUp = (e) => {
    if (e.keyCode === ESC_KEY_CODE) {
      this.handleClose();
    }
  };

  handleDocumentClick = (e) => {
    if (!findDOMNode(this).contains(e.target)) {
      this.handleClose();
    }
  };

  handleToggleOpen = () => {
    this.props.onToggleOpen(!this.props.open);

    if (this.props.open) {
      findDOMNode(this.trigger).focus();
    }
  };

  handleClose = () => {
    this.props.onToggleOpen(false);
    findDOMNode(this.trigger).focus();
  };

  renderContent() {
    const {
      children,
      transition: Transition,
      onEntered,
      onExited,
    } = this.props;

    return (
      <Transition onEntered={onEntered} onExited={onExited}>
        {React.cloneElement(React.Children.only(children), {
          onClose: this.handleClose,
          "aria-labelledby": this.props.trigger.props.id,
        })}
      </Transition>
    );
  }

  render() {
    const PopoutContainer = this.props.container;
    const Layer = this.props.layer;

    return (
      <PopoutContainer>
        {React.cloneElement(this.props.trigger, {
          onClick: this.handleToggleOpen,
          "aria-haspopup": true,
          "aria-expanded": this.props.open,
          ref: (trigger) => (this.trigger = trigger),
        })}

        <TransitionGroup
          component={Layer}
          horizontalAlignment={this.props.horizontalAlignment}
          verticalAlignment={this.props.verticalAlignment}
          offsetX={this.props.offsetX}
          offsetY={this.props.offsetY}
        >
          {this.props.open ? this.renderContent() : null}
        </TransitionGroup>
      </PopoutContainer>
    );
  }
}

const component = PropTypes.oneOfType([PropTypes.func, PropTypes.elementType]);

Popout.propTypes = {
  trigger: PropTypes.element.isRequired,
  container: component.isRequired,
  layer: component.isRequired,
  children: PropTypes.element.isRequired,
  open: PropTypes.bool,
  onToggleOpen: PropTypes.func.isRequired,
  onEntered: PropTypes.func,
  onExited: PropTypes.func,
  transition: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  horizontalAlignment: Layer.propTypes.horizontalAlignment,
  verticalAlignment: Layer.propTypes.verticalAlignment,
  offsetX: Layer.propTypes.offsetX,
  offsetY: Layer.propTypes.offsetY,
};

export default Popout;
export const UncontrolledPopout = uncontrollable(Popout, {
  open: "onToggleOpen",
});
