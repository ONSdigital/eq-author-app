import React from "react";
import { toHTML, fromHTML } from "components/RichTextEditor/utils/convert";
import { convertToRaw, EditorState } from "draft-js";
import Raw from "draft-js-raw-content-state";

const stateToRaw = (state) => convertToRaw(state.getCurrentContent());

// https://github.com/facebook/draft-js/issues/702
jest.mock("draft-js/lib/generateRandomKey", () => () => "123");

describe("convert", () => {
  const htmlBasic = "<p>hello world</p>";
  const rawBasic = new Raw().addBlock("hello world");

  const htmlEntity = "<p>hello <span>world</span></p>";
  const rawEntity = new Raw()
    .addBlock("hello world")
    .addEntity({ type: "TEST_ENTITY", mutability: "IMMUTABLE" }, 6, 5);

  const Entity = ({ children }) => <span>{children}</span>; // eslint-disable-line

  describe("toHTML", () => {
    it("should convert to HTML", () => {
      const convert = toHTML({});
      const html = convert(rawBasic.toEditorState());

      expect(html).toEqual(htmlBasic);
    });

    it("should convert entities to HTML", () => {
      const convert = toHTML({ TEST_ENTITY: Entity });
      const html = convert(rawEntity.toEditorState());

      expect(html).toEqual(htmlEntity);
    });

    it("should convert BOLD style to HTML", () => {
      const rawBoldText = new Raw()
        .addBlock("Test text")
        .addInlineStyle("BOLD", 0, 4); // Applies BOLD style to first four characters in "Test text"
      const expectedHtmlBold = `<p><strong class="bold">Test</strong> text</p>`;

      const convert = toHTML({});
      const convertedHtml = convert(rawBoldText.toEditorState());

      expect(convertedHtml).toEqual(expectedHtmlBold);
    });

    it("should convert HIGHLIGHT style to HTML", () => {
      const rawHighlightText = new Raw()
        .addBlock("Test text")
        .addInlineStyle("HIGHLIGHT", 0, 4); // Applies HIGHLIGHT style to first four characters in "Test text"
      const expectedHtmlHighlight = `<p><strong class="highlight">Test</strong> text</p>`;

      const convert = toHTML({});
      const convertedHtml = convert(rawHighlightText.toEditorState());

      expect(convertedHtml).toEqual(expectedHtmlHighlight);
    });
  });

  describe("fromHTML", () => {
    it("should convert from HTML", () => {
      const convert = fromHTML({});
      const state = EditorState.createWithContent(convert(htmlBasic));

      expect(stateToRaw(state)).toEqual(rawBasic.toRawContentState());
    });

    it("should convert entities from HTML", () => {
      const nodeToEntity = {
        span: (nodeName, node, createEntity) =>
          createEntity("TEST_ENTITY", "IMMUTABLE", { text: node.innerText }),
      };

      const convert = fromHTML(nodeToEntity);
      const editorState = EditorState.createWithContent(convert(htmlEntity));

      expect(stateToRaw(editorState)).toEqual(rawEntity.toRawContentState());
    });

    it("should convert BOLD from HTML", () => {
      const htmlBold = `<p><strong class="bold">Test</strong> text</p>`;
      const rawBoldText = new Raw()
        .addBlock("Test text")
        .addInlineStyle("BOLD", 0, 4); // Applies BOLD style to first four characters in "Test text"

      const convert = fromHTML({});
      const editorState = EditorState.createWithContent(convert(htmlBold));

      expect(stateToRaw(editorState)).toEqual(rawBoldText.toRawContentState());
    });

    it("should convert HIGHLIGHT from HTML", () => {
      const htmlHighlight = `<p><strong class="highlight">Test</strong> text</p>`;
      const rawHighlightText = new Raw()
        .addBlock("Test text")
        .addInlineStyle("HIGHLIGHT", 0, 4); // Applies HIGHLIGHT style to first four characters in "Test text"

      const convert = fromHTML({});
      const editorState = EditorState.createWithContent(convert(htmlHighlight));

      expect(stateToRaw(editorState)).toEqual(
        rawHighlightText.toRawContentState()
      );
    });
  });
});
