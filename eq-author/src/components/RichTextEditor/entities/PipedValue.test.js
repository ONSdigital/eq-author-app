import React from "react";
import { shallow } from "enzyme";
import PipedValueDecorator, {
  entityToHTML,
  ENTITY_TYPE,
  htmlToEntity,
  findPipedEntities
} from "./PipedValue";
import Raw from "draft-js-raw-content-state";

// https://github.com/facebook/draft-js/issues/702
jest.mock("draft-js/lib/generateRandomKey", () => () => "123");

describe("PipedValue", () => {
  describe("findPipedEntities", () => {
    it("should find piped entities only", () => {
      const pipeEntity = {
        type: ENTITY_TYPE,
        mutability: "IMMUTABLE"
      };
      const otherEntity = {
        type: "NOT_PIPED",
        mutability: "MUTABLE"
      };

      const contentState = new Raw()
        .addBlock("hello world")
        .addEntity(pipeEntity, 0, 5)
        .addEntity(otherEntity, 5, 1)
        .addEntity(pipeEntity, 6, 5)
        .toContentState();

      const entities = findPipedEntities(contentState);
      expect(entities).toHaveLength(2);
    });
  });

  describe("decorator", () => {
    it("should find and convert entities", () => {
      const pipeEntity = {
        type: ENTITY_TYPE,
        mutability: "IMMUTABLE"
      };
      const otherEntity = {
        type: "NOT_PIPED",
        mutability: "MUTABLE"
      };

      const content = new Raw()
        .addBlock("hello world")
        .addEntity(pipeEntity, 0, 5)
        .addEntity(otherEntity, 5, 1)
        .addEntity(pipeEntity, 6, 5)
        .toContentState();
      const block = content.getFirstBlock();
      const callback = jest.fn();

      PipedValueDecorator.strategy(block, callback, content);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should render piped value entities", () => {
      const Component = PipedValueDecorator.component;
      const wrapper = shallow(<Component>Hello world</Component>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("entityToHTML", () => {
    it("should convert entity to HTML", () => {
      const Component = entityToHTML[ENTITY_TYPE];
      const data = {
        id: "123",
        text: "hello world",
        type: "TextField",
        pipingType: "SomeType"
      };

      const wrapper = shallow(<Component data={data} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("htmlToEntity", () => {
    const type = "TextField";
    const id = "123";
    const text = "hello world";
    const pipingType = "SomeType";

    let elem, createEntity, entity;

    beforeEach(() => {
      elem = document.createElement("span");
      elem.innerText = text;
      elem.setAttribute("data-piped", pipingType);
      elem.setAttribute("data-id", id);
      elem.setAttribute("data-type", type);

      entity = {};
      createEntity = jest.fn(() => entity);
    });

    it("should return the entity", () => {
      const result = htmlToEntity("span", elem, createEntity);
      expect(result).toBe(entity);
    });

    it("should convert piped value elements to entities", () => {
      htmlToEntity("span", elem, createEntity);

      expect(createEntity).toHaveBeenCalledWith(ENTITY_TYPE, "IMMUTABLE", {
        pipingType,
        type,
        id
      });
    });

    it("will ignore other types of element", () => {
      const elem = document.createElement("span");
      htmlToEntity("span", elem, createEntity);

      expect(createEntity).not.toHaveBeenCalled();
    });
  });
});
