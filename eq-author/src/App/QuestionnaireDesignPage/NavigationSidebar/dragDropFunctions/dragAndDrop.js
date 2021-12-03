import { css } from "styled-components";

export const dndCSS = css`
  a {
    transition: padding 0.1s;
  }

  .dragovertop {
    /*     border-top: 2px solid yellow; */
    /*     background-color: black; */
    padding-top: 30px;
  }

  .dragoverbottom {
    /*     border-bottom: 2px solid yellow; */
    /*     background-color: black; */
    padding-bottom: 30px;
  }

  .droparea {
    background-color: black;
  }
`;

export const dnd = {
  handleDragStart: (event) => {
    event.stopPropagation();
    const body = document.querySelector("body");
    body.dataset.dragId = event.currentTarget.id;
    body.dataset.dragContext = event.currentTarget.dataset.dragContext;
    body.dataset.dragPosition = event.currentTarget.dataset.dragPosition;
    event.dataTransfer.setDragImage(event.currentTarget, 10, 10);
    event.dataTransfer.effectAllowed = "move";
  },
  handleDragOver: (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  },
  handleDrop: (handleMoveContent) => (event) => {
    event.stopPropagation();
    const body = document.querySelector("body");
    const sourceId = body.dataset.dragId;
    const sourceContext = body.dataset.dragContext;
    const sourcePosition = Number(body.dataset.dragPosition);
    const targetId = event.currentTarget.id;
    const targetPosition = Number(event.currentTarget.dataset.dragPosition);
    const targetContext = event.currentTarget.dataset.dragContext;
    const placement =
      event.currentTarget.firstChild.classList.contains("dragovertop") ||
      event.currentTarget.classList.contains("dragovertop")
        ? "above"
        : "below";
    document
      .querySelectorAll(".dragovertop")
      .forEach((droparea) => droparea.classList.remove("dragovertop"));
    document
      .querySelectorAll(".dragoverbottom")
      .forEach((droparea) => droparea.classList.remove("dragoverbottom"));
    handleMoveContent({
      sourceId,
      sourceContext,
      sourcePosition,
      targetId,
      targetContext,
      targetPosition,
      placement,
    });
  },
  handleDragEnter: (event) => {
    event.preventDefault();
    event.stopPropagation();
    const body = document.querySelector("body");
    const sourceId = body.dataset.dragId;
    const targetId = event.currentTarget.id;
    if (sourceId === targetId) {
      return;
    }
    const sourceContext = body.dataset.dragContext;
    const targetContext = event.currentTarget.dataset?.dragContext;
    const allowDrop = Boolean(
      (sourceContext.includes("Page") && targetContext.includes("Page")) ||
        (sourceContext.includes("Page") && targetContext === "Section") ||
        (sourceContext.includes("Page") && targetContext === "Folder") ||
        (sourceContext === "Folder" && targetContext === "SectionPage") ||
        (sourceContext === "Folder" && targetContext === "Folder") ||
        (sourceContext === "Folder" && targetContext === "Section") ||
        (sourceContext === "Section" && targetContext === "Section")
    );
    if (allowDrop) {
      if (sourceContext.includes("Page") && targetContext === "Folder") {
        event.nativeEvent.offsetY < event.nativeEvent.target.offsetHeight / 2
          ? event.currentTarget.classList.add("dragoverbottom")
          : event.currentTarget.classList.add("dragovertop");
        return;
      }
      if (targetContext === "Section") {
        event.nativeEvent.offsetY < event.nativeEvent.target.offsetHeight / 2
          ? event.currentTarget.classList.add("dragoverbottom")
          : event.currentTarget.classList.add("dragovertop");
        return;
      }
      if (
        (sourceContext.includes("Page") || sourceContext === "Folder") &&
        targetContext === "Section"
      ) {
        event.target.classList.add("dragoverbottom");
        return;
      }
      event.nativeEvent.offsetY < event.nativeEvent.target.offsetHeight / 2
        ? event.currentTarget.lastChild.classList.add("dragoverbottom")
        : event.currentTarget.firstChild.classList.add("dragovertop");
    }
  },
  handleDragLeave: (event) => {
    event.stopPropagation();
    if (event.target.dataset?.dragContext !== "ConfirmationPage") {
      event.currentTarget.firstChild.classList.remove("dragovertop");
    }
    event.currentTarget.lastChild.classList.remove("dragoverbottom");
    event.currentTarget.classList.remove("dragoverbottom");
    event.currentTarget.classList.remove("dragoverbottom");
    event.currentTarget.classList.remove("dragovertop");
  },
};

export default { dnd, dndCSS };
