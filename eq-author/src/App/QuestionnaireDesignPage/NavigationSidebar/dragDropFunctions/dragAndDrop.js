import { css } from "styled-components";

export const dndCSS = css`
  .draggable {
    background-color: grey;
  }

  .dragovertop {
    border-top: 2px solid yellow;
  }

  .dragoverbottom {
    border-bottom: 2px solid yellow;
  }
`;

export const dnd = {
  handleDragStart: (el) => {
    el.stopPropagation();
    //console.log(el.currentTarget)
    el.dataTransfer.setData("text", el.currentTarget.id);
    el.dataTransfer.setDragImage(el.currentTarget, 10, 10);
  },
  handleDragOver: (el) => {
    el.preventDefault();
    el.stopPropagation();
    el.dataTransfer.dropEffect = "move";
  },
  handleDrop: (handleMoveContent) => (el) => {
    el.stopPropagation();
    const sourceId = el.dataTransfer.getData("text");
    const placement = el.currentTarget.firstChild.classList.contains(
      "dragovertop"
    )
      ? "above"
      : "below";
    el.currentTarget.firstChild.classList.remove("dragovertop");
    el.currentTarget.lastChild.classList.remove("dragoverbottom");
    handleMoveContent({
      sourceId,
      targetId: el.currentTarget.id,
      placement,
    });
  },
  handleDragEnter: (el) => {
    el.stopPropagation();
    el.nativeEvent.offsetY < el.nativeEvent.target.offsetHeight / 2
      ? el.currentTarget.lastChild.classList.add("dragoverbottom")
      : el.currentTarget.firstChild.classList.add("dragovertop");
  },
  handleDragLeave: (el) => {
    el.stopPropagation();
    el.currentTarget.firstChild.classList.remove("dragovertop");
    el.currentTarget.lastChild.classList.remove("dragoverbottom");
  },
};

export default { dnd, dndCSS };
