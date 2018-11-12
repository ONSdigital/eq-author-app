import React from "react";
import { toHTML, fromHTML } from "./convert";
import { convertToRaw } from "draft-js";
import Raw from "draft-js-raw-content-state";

const stateToRaw = state => convertToRaw(state.getCurrentContent());

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
  });

  describe("fromHTML", () => {
    it("should convert from HTML", () => {
      const convert = fromHTML();
      const state = convert(htmlBasic);

      expect(stateToRaw(state)).toEqual(rawBasic.toRawContentState());
    });

    it("should convert entities from HTML", () => {
      const htmlToEntity = (nodeName, node, createEntity) => {
        if (nodeName === "span") {
          return createEntity("TEST_ENTITY", "IMMUTABLE", {
            text: node.innerText
          });
        }
      };

      const convert = fromHTML(htmlToEntity);
      const editorState = convert(htmlEntity);

      expect(stateToRaw(editorState)).toEqual(rawEntity.toRawContentState());
    });
  });
});
