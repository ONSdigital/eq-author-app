import React from "react";
import { StatelessMetaEditor } from "./MetaEditor";
import { shallow } from "enzyme";
import RichTextEditor from "components/RichTextEditor";

describe("MetaEditor", () => {
  let wrapper, handleUpdate, handleChange, handleTitleRef, page, client;

  const render = (renderer = shallow) =>
    renderer(
      <StatelessMetaEditor
        onChange={handleChange}
        onUpdate={handleUpdate}
        titleRef={handleTitleRef}
        page={page}
        client={client}
      />
    );

  beforeEach(() => {
    handleChange = jest.fn();
    handleUpdate = jest.fn();
    handleTitleRef = jest.fn();
    page = {
      title: "Page title",
      alias: "Page alias",
      description: "Page description",
      guidance: "Page guidance",
      section: {
        questionnaire: {
          metadata: []
        }
      }
    };
    client = { readQuery: jest.fn(), query: jest.fn() };

    wrapper = render();
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should invoke change and update onUpdate", () => {
    const editors = wrapper.find(RichTextEditor);
    expect(editors.length).toBeGreaterThan(0);

    editors.forEach((rte, i) => {
      const change = { name: "title", value: `<p>${i}</p>` };
      rte.simulate("update", change);

      expect(handleChange).toHaveBeenLastCalledWith(change, handleUpdate);
    });
  });
});
