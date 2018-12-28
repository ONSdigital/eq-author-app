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

export const fromHTML = htmlToEntity => {
  const convert = convertFromHTML({ htmlToEntity });

  return (html, decorator) =>
    EditorState.createWithContent(convert(html), decorator);
};
