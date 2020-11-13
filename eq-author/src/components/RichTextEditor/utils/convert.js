import { convertToHTML, convertFromHTML } from "draft-convert";
import { EditorState } from "draft-js";

export const toHTML = entityMap => {
  const entityToHTML = (entity, originalText) => {
    const mapper = entityMap[entity.type];
    return mapper ? mapper(entity) : originalText;
  };

  const convert = convertToHTML({ entityToHTML });

  return editorState => convert(editorState.getCurrentContent());
};

export const fromHTML = nodeToFn => {
  const htmlToEntity = (nodeName, ...otherArgs) => {
    const entity = Object.entries(nodeToFn)
      .filter(([name]) => name === nodeName)
      .map(([, fn]) => fn(nodeName, ...otherArgs))
      .find(result => result);

    return entity || null;
  };

  const convert = convertFromHTML({ htmlToEntity });

  return (html, decorator) =>
    EditorState.createWithContent(convert(html), decorator);
};
