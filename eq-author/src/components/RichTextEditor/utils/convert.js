import React from "react";
import { convertToHTML, convertFromHTML } from "draft-convert";

export const toHTML = (entityMap) => {
  const entityToHTML = (entity, originalText) => {
    const mapper = entityMap[entity.type];
    return mapper ? mapper(entity) : originalText;
  };

  // Adds strong tags with class names to text based on the text's style
  const styleToHTML = (style) => {
    if (style === "BOLD") {
      return <strong className="bold" />;
    }

    if (style === "HIGHLIGHT") {
      return <strong className="highlight" />;
    }
  };

  const convert = convertToHTML({ styleToHTML, entityToHTML });

  return (editorState) => convert(editorState.getCurrentContent());
};

export const fromHTML = (nodeToFn) => {
  const htmlToEntity = (nodeName, ...otherArgs) => {
    const entity = Object.entries(nodeToFn)
      .filter(([name]) => name === nodeName)
      .map(([, fn]) => fn(nodeName, ...otherArgs))
      .find((result) => result);

    return entity || null;
  };

  // Applies specific styles based on tags and class names - buttons in the toolbar are activated based on these styles
  const htmlToStyle = (nodeName, node, currentStyle) => {
    if (nodeName === "strong" && node.className === "highlight") {
      return currentStyle.add("HIGHLIGHT").remove("BOLD");
    }
    if (nodeName === "strong" && node.className === "bold") {
      return currentStyle.add("BOLD");
    }
    return currentStyle;
  };

  return convertFromHTML({ htmlToStyle, htmlToEntity });
};
