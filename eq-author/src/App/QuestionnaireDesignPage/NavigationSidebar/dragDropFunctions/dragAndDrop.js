import { css } from "styled-components";

export const dndCSS = css`
  a {
    transition: padding 0.1s;
  }

  .dragovertop {
    padding-top: 35px;
  }

  .dragoverbottom {
    padding-bottom: 35px;
  }

  .droparea {
    background-color: black;
  }
`;

const removeClasses = () => {
  document
    .querySelectorAll(".dragovertop")
    .forEach((droparea) => droparea.classList.remove("dragovertop"));
  document
    .querySelectorAll(".dragoverbottom")
    .forEach((droparea) => droparea.classList.remove("dragoverbottom"));
  document
    .querySelectorAll(".droparea")
    .forEach((element) => element.classList.remove("droparea"));
};

export const handleDragStart = (event) => {
  event.stopPropagation();
  const body = document.querySelector("body");
  body.dataset.dragId = event.currentTarget.id;
  body.dataset.dragContext = event.currentTarget.dataset.dragContext;
  body.dataset.dragPosition = event.currentTarget.dataset.dragPosition;
  event.dataTransfer.setDragImage(event.currentTarget, 10, 10);
  event.dataTransfer.effectAllowed = "move";
  if (body.dataset.dragContext.includes("Page")) {
    document
      .querySelectorAll("[draggable = 'true']")
      .forEach((element) => element.classList.add("droparea"));
    document
      .querySelectorAll(".CollapsibleNavItem-header")
      .forEach((element) => element.classList.add("droparea"));
  }
  if (body.dataset.dragContext === "Folder") {
    document
      .querySelectorAll("[data-drag-context = 'SectionPage']")
      .forEach((element) => element.classList.add("droparea"));
    document
      .querySelectorAll(".CollapsibleNavItem-header")
      .forEach((element) => element.classList.add("droparea"));
  }
};

export const handleDragEnd = () => {
  removeClasses();
};

export const handleDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "move";
};

export const handleDrop = (handleMoveContent) => (event) => {
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
  removeClasses();
  handleMoveContent({
    sourceId,
    sourceContext,
    sourcePosition,
    targetId,
    targetContext,
    targetPosition,
    placement,
  });
};

export const handleDragEnter = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const body = document.querySelector("body");
  const sourceId = body.dataset.dragId;
  const targetId = event.currentTarget.id;
  const sourceContext = body.dataset.dragContext;
  const targetContext = event.currentTarget.dataset?.dragContext;

  if (sourceId === targetId) {
    return;
  }
  if (targetId === body.dataset.currentTargetId) {
    return;
  }
  body.dataset.currentTargetId = event.currentTarget.id;

  document
    .querySelectorAll(".dragovertop")
    .forEach((droparea) => droparea.classList.remove("dragovertop"));
  document
    .querySelectorAll(".dragoverbottom")
    .forEach((droparea) => droparea.classList.remove("dragoverbottom"));

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
    if (targetContext === "Folder") {
      event.currentTarget.classList.add("dragoverbottom");
      return;
    }
    if (targetContext === "Section" && sourceContext === "Section") {
      event.nativeEvent.offsetY < event.nativeEvent.target.offsetHeight / 2
        ? event.currentTarget.firstChild.classList.add("dragoverbottom")
        : event.currentTarget.firstChild.classList.add("dragovertop");
      return;
    }
    if (
      (sourceContext.includes("Page") || sourceContext === "Folder") &&
      targetContext === "Section"
    ) {
      event.currentTarget.firstChild.firstChild.classList.add("dragoverbottom");
      return;
    }
    event.nativeEvent.offsetY < event.nativeEvent.target.offsetHeight / 2
      ? event.currentTarget.lastChild.classList.add("dragoverbottom")
      : event.currentTarget.firstChild.classList.add("dragovertop");
  }
};

export default {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  handleDragEnter,
  dndCSS,
};
