import replaceEntityText from "components/RichTextEditor/utils/replaceEntityText";
import Raw from "draft-js-raw-content-state";
import { convertToRaw } from "draft-js";

// https://github.com/facebook/draft-js/issues/702
jest.mock("draft-js/lib/generateRandomKey", () => () => "123");

describe("replaceEntityText", () => {
  it("should replace an entity's text", () => {
    const entity = {
      type: "MY_ENTITY",
      mutability: "IMMUTABLE",
    };

    const content = new Raw()
      .addBlock("hello world")
      .addEntity(entity, 0, 5)
      .toContentState();

    const expectedContent = new Raw()
      .addBlock("goodbye world")
      .addEntity(entity, 0, 7)
      .toRawContentState();

    const block = content.getFirstBlock();
    const entityKey = block.getEntityAt(0);

    const updatedContent = replaceEntityText(
      content,
      entityKey,
      block.key,
      "goodbye"
    );

    expect(convertToRaw(updatedContent)).toEqual(expectedContent);
  });
});
