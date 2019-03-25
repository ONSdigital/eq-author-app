import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled, { keyframes, css } from "styled-components";
import { TransitionGroup } from "react-transition-group";

import getIdForObject from "utils/getIdForObject";

import withMoveAnswer from "./withMoveAnswer";
import AnswerTransition from "./AnswerTransition";
import AnswerEditor from "./AnswerEditor";

const MOVE_DURATION = 400;
const UP = "UP";
const DOWN = "DOWN";

const move = ({ transform, scale }) => keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: scale(${scale});
  }
  100% {
    transform: translateY(calc(${transform})) scale(1);
  }
`;

export const AnswerSegment = styled.div`
  padding: 1em 2em;
  z-index: ${props => props.movement.zIndex};
  transform-origin: 50% 50%;
  animation: ${({ movement }) =>
    movement.transform !== 0 &&
    css`
      ${move(
        movement
      )} ${MOVE_DURATION}ms cubic-bezier(0.785, 0.135, 0.150, 0.860) 0s forwards 1;
    `};
`;

const startingStyles = answers => answers.map(() => ({ transform: 0 }));

export const UnwrappedAnswersEditor = ({
  answers,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onAddExclusive,
  onDeleteAnswer,
  moveAnswer,
}) => {
  const [renderedAnswers, setRenderedAnswers] = useState(answers);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answerStyles, setAnswerStyles] = useState(startingStyles(answers));

  const hasNewAnswers = useRef(false);
  const answerElements = useRef([]);
  const prevAnswers = useRef(answers);
  const animationTimeout = useRef();

  if (prevAnswers.current !== answers) {
    prevAnswers.current = answers;
    hasNewAnswers.current = true;
  }

  if (hasNewAnswers.current && !isTransitioning) {
    setRenderedAnswers(answers);
    setAnswerStyles(startingStyles(answers));
    hasNewAnswers.current = false;
  }

  const handleRef = (node, index) => {
    if (!node) {
      return;
    }

    answerElements.current[index] = node.getBoundingClientRect().height;
  };

  useEffect(
    () => {
      return () => {
        if (animationTimeout.current) {
          clearTimeout(animationTimeout.current);
          animationTimeout.current = null;
        }
      };
    },
    [animationTimeout]
  );

  const handleMove = (answer, index, direction) => {
    const isUp = direction === UP;
    const indexA = index;
    const indexB = isUp ? index - 1 : index + 1;

    const heightA = answerElements.current[indexA];
    const heightB = answerElements.current[indexB];

    const newAnswerStyles = [...answerStyles];

    newAnswerStyles[indexA] = {
      transform: isUp ? `${0 - heightB}px` : `${heightB}px`,
      zIndex: 2,
      scale: 1.05,
    };

    newAnswerStyles[indexB] = {
      transform: isUp ? `${heightA}px` : `${0 - heightA}px`,
      zIndex: 1,
      scale: 0.95,
    };

    setIsTransitioning(true);
    setAnswerStyles(newAnswerStyles);
    moveAnswer({ id: answer.id, position: indexB });
    animationTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, MOVE_DURATION);
  };

  return (
    <TransitionGroup>
      {renderedAnswers.map((answer, index) => (
        <AnswerTransition key={getIdForObject(answer)}>
          <AnswerSegment
            id={getIdForObject(answer)}
            innerRef={node => handleRef(node, index)}
            movement={answerStyles[index]}
          >
            <AnswerEditor
              answer={answer}
              onMoveUp={() => handleMove(answer, index, UP)}
              onMoveDown={() => handleMove(answer, index, DOWN)}
              canMoveUp={!isTransitioning && index > 0}
              canMoveDown={
                !isTransitioning && index < renderedAnswers.length - 1
              }
              onUpdate={onUpdate}
              onAddOption={onAddOption}
              onAddExclusive={onAddExclusive}
              onUpdateOption={onUpdateOption}
              onDeleteOption={onDeleteOption}
              onDeleteAnswer={onDeleteAnswer}
              data-test="answer-editor"
            />
          </AnswerSegment>
        </AnswerTransition>
      ))}
    </TransitionGroup>
  );
};

UnwrappedAnswersEditor.propTypes = {
  answers: PropTypes.arrayOf(propType(AnswerEditor.fragments.AnswerEditor))
    .isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  moveAnswer: PropTypes.func.isRequired,
};

UnwrappedAnswersEditor.fragments = {
  AnswersEditor: AnswerEditor.fragments.AnswerEditor,
};

export default withMoveAnswer(UnwrappedAnswersEditor);
