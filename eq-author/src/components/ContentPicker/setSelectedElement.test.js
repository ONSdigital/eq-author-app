import setSelectedElement from "./setSelectedElement";
import generateMockPiping from "tests/utils/generateMockPiping";

describe("setSelectedElement", () => {
  it("Should get the selected items when asking for the data 3 levels deep", () => {
    const data = generateMockPiping(3, 3, 1);
    const config = [
      {
        id: "section",
        title: "Section",
        childKey: "pages",
      },
      {
        id: "page",
        title: "Question",
        childKey: "answers",
      },
      {
        id: "answer",
        title: "Answer",
      },
    ];
    const selectedItems = setSelectedElement(config, "Answer 8", data);
    expect(selectedItems).toMatchObject([
      data[2],
      data[2].pages[1],
      data[2].pages[1].answers[0],
    ]);
  });
  it("Should get the selected items when asking for the data 2 levels deep", () => {
    const data = generateMockPiping(3, 3, 1);
    const config = [
      {
        id: "section",
        title: "Section",
        childKey: "pages",
      },
      {
        id: "page",
        title: "Question",
      },
    ];

    const selectedItems = setSelectedElement(config, "Page 6", data);
    expect(selectedItems).toMatchObject([data[1], data[1].pages[2]]);
  });
});
