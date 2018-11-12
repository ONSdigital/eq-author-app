import React from "react";
import { storiesOf } from "@storybook/react";
import Toast from "./index";
import ToastList from "./ToastList";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import { colors } from "constants/theme";
import Transition from "./Transition";
import { without } from "lodash";
import PropTypes from "prop-types";

const UndoButton = styled.button`
  background: none;
  border: none;
  color: ${colors.lightBlue};
  margin-left: 2em;
  font-size: inherit;
`;

const DeletionInfo = ({ id, onClose }) => (
  <div>
    <strong>Page {id}</strong> deleted{" "}
    <UndoButton onClick={onClose}>Undo</UndoButton>
  </div>
);
DeletionInfo.propTypes = {
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func
};

const StoryContainer = styled.div`
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  margin-bottom: ${props => (props.hasMargin ? "0.5em" : "0")};
`;

const StoryInner = styled.div`
  display: inline-block;
  text-align: initial;
`;

const Basic = ({ toast, onClose }) => (
  <Toast id={toast} onClose={onClose} timeout={10000}>
    <div>
      Toast added at: <strong>{new Date(toast).toLocaleTimeString()}</strong>
    </div>
  </Toast>
);
Basic.propTypes = {
  toast: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

const Dismissble = ({ toast, onClose }) => (
  <Toast id={toast} onClose={onClose} timeout={10000}>
    <DeletionInfo id={toast} />
  </Toast>
);
Dismissble.propTypes = {
  toast: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

class StatefulStory extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    toasts: [Date.now()]
  };

  handleAdd = () => {
    const toasts = this.state.toasts.concat(Date.now());
    this.setState({ toasts });
  };

  handleRemove = toast => {
    const toasts = without(this.state.toasts, toast);
    this.setState({ toasts });
  };

  render() {
    const { toasts } = this.state;
    const { children } = this.props;

    return (
      <div>
        <div>
          <button type="button" onClick={this.handleAdd}>
            Add toast
          </button>
        </div>
        <StoryContainer>
          <StoryInner>
            <ToastList transition={Transition}>
              {toasts.map(toast =>
                children({ toast, onClose: this.handleRemove })
              )}
            </ToastList>
          </StoryInner>
        </StoryContainer>
      </div>
    );
  }
}

storiesOf("Toast", module)
  .add("Default", () => (
    <StoryContainer hasMargin>
      <StoryInner>
        <Toast id="foo">
          <span>Hello world!</span>
        </Toast>
      </StoryInner>
    </StoryContainer>
  ))
  .add("Auto timeout", () => (
    <StoryContainer hasMargin>
      <StoryInner>
        <Toast id="bar" timeout={2000} onClose={action("Auto-closed")}>
          <span>Hello world!</span>
        </Toast>
      </StoryInner>
    </StoryContainer>
  ))
  .add("Arbitrary content", () => (
    <StoryContainer hasMargin>
      <StoryInner>
        <Toast id="foo-bar" timeout={2000} onClose={action("Closed")}>
          <DeletionInfo id={123} />
        </Toast>
      </StoryInner>
    </StoryContainer>
  ))
  .add("List", () => (
    <StoryContainer>
      <StoryInner>
        <ToastList>
          <Toast id="1">
            <div>Hello</div>
          </Toast>
          <Toast id="2">
            <div>World</div>
          </Toast>
        </ToastList>
      </StoryInner>
    </StoryContainer>
  ))
  .add("Interactive", () => (
    <StatefulStory>
      {({ toast, onClose }) => (
        <Basic key={toast} toast={toast} onClose={onClose} />
      )}
    </StatefulStory>
  ))
  .add("Dismissible", () => (
    <StatefulStory>
      {({ toast, onClose }) => (
        <Dismissble key={toast} toast={toast} onClose={onClose} />
      )}
    </StatefulStory>
  ));
