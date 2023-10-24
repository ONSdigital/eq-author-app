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

export default function createFormatStripper(controls) {
  const filterConfiguration = {
    blocks: [],
    styles: [],
    entities: [pipedFilterConfig, linkFilterConfig],
    maxNesting: 0,
    whitespacedCharacters: [],
  };

  mapKeys(controls, (value, key) => {
    if (mapper[key] && controls[key]) {
      filterConfiguration[mapper[key].type].push(mapper[key].format);
    }
  });

  return (editorState) => filterEditorState(filterConfiguration, editorState);
}
