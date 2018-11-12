import { mapKeys } from "lodash";
import { filterEditorState } from "draftjs-filters";
import { filterConfig } from "../entities/PipedValue";

const mapper = {
  bold: { format: "BOLD", type: "styles" },
  emphasis: { format: "ITALIC", type: "styles" },
  list: { format: "unordered-list-item", type: "blocks" },
  heading: { format: "header-two", type: "blocks" }
};

export default function createFormatStripper(controls) {
  const filterConfiguration = {
    blocks: [],
    styles: [],
    entities: [filterConfig],
    maxNesting: 0,
    whitespacedCharacters: []
  };

  mapKeys(controls, (value, key) => {
    if (mapper[key] && controls[key]) {
      filterConfiguration[mapper[key].type].push(mapper[key].format);
    }
  });

  return editorState => filterEditorState(filterConfiguration, editorState);
}
