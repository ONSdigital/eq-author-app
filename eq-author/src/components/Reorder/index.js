import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import getIdForObject from "utils/getIdForObject";

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

export const Segment = styled.div`
  z-index: ${(props) => props.movement.zIndex};
  transform-origin: 50% 50%;
  animation: ${({ movement }) =>
    movement.transform !== 0 &&
    css`
      ${move(
        movement
      )} ${MOVE_DURATION}ms cubic-bezier(0.785, 0.135, 0.150, 0.860) 0s forwards 1;
    `};
`;

const startingStyles = (items) => items.map(() => ({ transform: 0 }));

const Reorder = ({ list, onMove, children, Transition }) => {
  const OuterWrapper = Transition ? TransitionGroup : React.Fragment;
  const InnerWrapper = Transition || React.Fragment;

  const [renderedItems, setRenderedItems] = useState(list);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemStyles, setItemStyles] = useState(startingStyles(list));

  const hasNewitems = useRef(false);
  const itemElements = useRef([]);
  const previtems = useRef(list);
  const animationTimeout = useRef();

  if (previtems.current !== list) {
    previtems.current = list;
    hasNewitems.current = true;
  }

  if (hasNewitems.current && !isTransitioning) {
    setRenderedItems(list);
    setItemStyles(startingStyles(list));
    hasNewitems.current = false;
  }

  const handleRef = (node, index) => {
    if (!node) {
      return;
    }

    itemElements.current[index] = node.getBoundingClientRect().height;
  };

  useEffect(
    () => () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
        animationTimeout.current = null;
      }
    },
    [animationTimeout]
  );

  const handleMove = (item, index, direction) => {
    const isUp = direction === UP;
    const indexA = index;
    const indexB = isUp ? index - 1 : index + 1;

    const heightA = itemElements.current[indexA];
    const heightB = itemElements.current[indexB];

    const newitemStyles = [...itemStyles];

    newitemStyles[indexA] = {
      transform: isUp ? `${0 - heightB}px` : `${heightB}px`,
      zIndex: 2,
      scale: 1.05,
    };

    newitemStyles[indexB] = {
      transform: isUp ? `${heightA}px` : `${0 - heightA}px`,
      zIndex: 1,
      scale: 0.95,
    };

    setIsTransitioning(true);
    setItemStyles(newitemStyles);

    onMove({ id: item.id, position: indexB });
    animationTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, MOVE_DURATION);
  };

  return (
    <OuterWrapper>
      {renderedItems.map((item, index) => {
        const itemProps = {
          onMoveUp: () => handleMove(item, index, UP),
          onMoveDown: () => handleMove(item, index, DOWN),
          canMoveUp: !isTransitioning && index > 0,
          canMoveDown: !isTransitioning && index < renderedItems.length - 1,
          isMoving: isTransitioning,
        };
        return (
          <InnerWrapper key={getIdForObject(item)}>
            <Segment
              id={getIdForObject(item)}
              ref={(node) => handleRef(node, index)}
              movement={itemStyles[index]}
            >
              {children(itemProps, item)}
            </Segment>
          </InnerWrapper>
        );
      })}
    </OuterWrapper>
  );
};

const Component = PropTypes.oneOfType([PropTypes.func, PropTypes.elementType]);

Reorder.propTypes = {
  list: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  onMove: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  Transition: Component,
};

export default Reorder;
