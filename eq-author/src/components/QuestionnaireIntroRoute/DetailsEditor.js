import React from "react";

import RichTextEditor from "components/RichTextEditor";
import styled, { keyframes, css } from "styled-components";
import { colors } from "constants/theme";
import { delay } from "lodash";
import DeleteButton from "components/buttons/DeleteButton";
import IconUp from "./icon-arrow-up.svg?inline";
import IconDown from "./icon-arrow-down.svg?inline";
import MoveButton from "./MoveButton";
import Button from "components/buttons/Button";

import { TransitionGroup } from "react-transition-group";
import Transition from "./Transition";

const moveDuration = 400;
const UP = "UP";
const DOWN = "DOWN";

const DetailList = styled.div`
  margin-bottom: 2em;
`;

const move = props => keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: scale(${props.scale});
  }
  100% {
    transform: translateY(calc(${props.transform})) scale(1);
  }
`;

const Detail = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 0 1em;
  border-radius: 4px;
  margin-bottom: 1em;
  background: white;
  position: relative;
  z-index: ${props => props.zIndex};
  transform-origin: 50% 50%;
  animation: ${props =>
    props.transform !== 0 &&
    css`
      ${move(
        props
      )} ${moveDuration}ms cubic-bezier(0.785, 0.135, 0.150, 0.860) 0s forwards 1;
    `};
`;

const DetailHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  right: -0.5em;
  padding: 0.5em 0 0;
  margin-bottom: -1em;
  z-index: 2;
  width: 7em;
  margin-left: auto;
`;

const DetailDeleteButton = styled(DeleteButton)`
  position: relative;
`;

const AddButton = styled(Button)`
  width: 100%;
`;

const SmallRichTextEditor = styled(RichTextEditor)`
  margin-bottom: -1rem;
  .DraftEditor-root {
    padding: 0.3rem 0.5rem;
  }
`;

class DetailsEditor extends React.Component {
  constructor(props) {
    super(props);

    if (!props.details) {
      return false;
    }

    this.detailsRefs = {};
    this.state = {
      details: this.props.details.map((detail, index) => ({
        transform: 0
      }))
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      this.setState({
        details: this.props.details.map((detail, index) => ({
          transform: 0
        }))
      });
    }
  };

  handleMoving = index => ({ ...this.state.details[index] });

  handleMoveClick = (id, index, direction) => {
    const isUp = direction === UP;
    const indexA = index;
    const indexB = isUp ? index - 1 : index + 1;

    const heightA = this.detailsRefs[indexA];
    const heightB = this.detailsRefs[indexB];

    const newState = {
      details: {
        ...this.state.details,
        [indexA]: {
          ...this.state.details[indexA],
          transform: isUp ? `${0 - heightB}px - 1em` : `${heightB}px + 1em`,
          zIndex: 2,
          scale: 1.05
        },
        [indexB]: {
          ...this.state.details[index],
          transform: isUp ? `${heightA}px + 1em` : `${0 - heightA}px - 1em`,
          zIndex: 1,
          scale: 0.95
        }
      }
    };

    this.setState(newState);

    delay(() => {
      isUp ? this.props.onMoveDetailUp(id) : this.props.onMoveDetailDown(id);
    }, moveDuration + 100);
  };

  setDetailRef = (index, node) => {
    if (node) {
      this.detailsRefs[index] = node.getBoundingClientRect().height;
    }
  };

  elementIsMoving = index => {
    if (!this.state.details[index]) {
      return false;
    }
    return this.state.details[index].location !== 0;
  };

  handleTransitionEnd = node => {
    node.querySelector("[aria-label='Title']").focus();
  };

  render() {
    const { details, onChange, onAddDetail, onRemoveDetail } = this.props;

    return (
      <DetailList>
        <TransitionGroup>
          {details.map(({ title, description, id }, index) => {
            const isMoving = this.elementIsMoving(index);
            return (
              <Transition key={index} onEntered={this.handleTransitionEnd}>
                <div>
                  <Detail
                    key={id}
                    id={id}
                    innerRef={node => this.setDetailRef(index, node)}
                    {...this.handleMoving(index)}
                  >
                    <DetailHeader>
                      <MoveButton
                        icon={IconUp}
                        disabled={index === 0}
                        onClick={() => this.handleMoveClick(id, index, UP)}
                      />
                      <MoveButton
                        icon={IconDown}
                        disabled={index === details.length - 1}
                        onClick={() => this.handleMoveClick(id, index, DOWN)}
                      />
                      <DetailDeleteButton
                        onClick={() => onRemoveDetail(id)}
                        disabled={!isMoving}
                      />
                    </DetailHeader>

                    <SmallRichTextEditor
                      id={`details-title-${id}`}
                      name={`details-title-${id}`}
                      onUpdate={onChange}
                      label="Title"
                      value={title}
                      bold
                      data-autofocus
                      toolbar={false}
                    />

                    <RichTextEditor
                      id={`details-description-${id}`}
                      name={`details-description-${id}`}
                      label="Description"
                      value={description}
                      onUpdate={onChange}
                      controls={{
                        emphasis: true,
                        piping: false,
                        list: true,
                        bold: true
                      }}
                      multiline
                    />
                  </Detail>
                </div>
              </Transition>
            );
          })}
        </TransitionGroup>
        <AddButton variant="secondary" onClick={onAddDetail}>
          Add collapsible
        </AddButton>
      </DetailList>
    );
  }
}

export default DetailsEditor;
