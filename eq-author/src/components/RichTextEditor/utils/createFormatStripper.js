import { mapKeys } from "lodash";
import { filterEditorState } from "draftjs-filters";
import { filterConfig as pipedFilterConfig } from "components/RichTextEditor/entities/PipedValue";
import { filterConfig as linkFilterConfig } from "components/RichTextEditor/LinkPlugin";

const mapper = {
  bold: { format: "BOLD", type: "styles" },
  emphasis: { format: "ITALIC", type: "styles" },
  list: { format: "unordered-list-item", type: "blocks" },
  heading: { format: "header-two", type: "blocks" },
};

// Custom filter function to replace multiple spaces with a single space
function replaceMultipleSpaces(contentState) {
  const text = contentState.getText();
  const transformedText = text.replace(/\s+/g, " "); // Replace multiple spaces with a single space
  return contentState.merge({
    text: transformedText,
  });
}

export default function createFormatStripper(controls) {
  const filterConfiguration = {
    blocks: [],
    styles: [],
    entities: [pipedFilterConfig, linkFilterConfig],
    maxNesting: 0,
    whitespacedCharacters: [replaceMultipleSpaces],
  };

  mapKeys(controls, (value, key) => {
    if (mapper[key] && controls[key]) {
      filterConfiguration[mapper[key].type].push(mapper[key].format);
    }
  });

  return (editorState) => filterEditorState(filterConfiguration, editorState);
}
