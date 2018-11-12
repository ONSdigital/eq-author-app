import React from "react";
import PropTypes from "prop-types";
import scrollIntoView from "utils/scrollIntoView";

class PanelTitle extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    controls: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  scrollIntoView() {
    scrollIntoView(this.title);
  }

  setTitleRef = title => {
    this.title = title;
  };

  render() {
    const { className, open, controls, children, onClick, id } = this.props;
    return (
      <h3 className={className} ref={this.setTitleRef}>
        <button
          onClick={onClick}
          role="tab"
          id={id}
          aria-expanded={open}
          aria-selected={open}
          aria-controls={controls}
        >
          {children}
        </button>
      </h3>
    );
  }
}

export default PanelTitle;
