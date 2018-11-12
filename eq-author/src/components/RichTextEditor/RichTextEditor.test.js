import React from "react";
import { shallow } from "enzyme";
import { SynchronousPromise } from "synchronous-promise";
import { RichUtils, Editor, EditorState, convertToRaw } from "draft-js";
import Raw from "draft-js-raw-content-state";
import { omit } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import Toolbar, {
  STYLE_BLOCK,
  STYLE_INLINE,
  styleButtons
} from "components/RichTextEditor/Toolbar";
import findById from "utils/findById";

import { createPipedEntity } from "./entities/PipedValue";

// https://github.com/facebook/draft-js/issues/702
jest.mock("draft-js/lib/generateRandomKey", () => () => "123");

let wrapper, props, editorInstance;

const content = `
  <h2>List of styles:</h2>
  <ul>
    <li>Regular</li>
    <li><strong>Bold</strong></li>
    <li><em>Emphasis</em></li>
  </ul>
`;

describe("components/RichTextEditor", function() {
  beforeEach(() => {
    props = {
      onUpdate: jest.fn(),
      label: "I am a label",
      id: "test"
    };
    editorInstance = {
      focus: jest.fn()
    };
    wrapper = shallow(<RichTextEditor {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly un-mount component", () => {
    const instance = wrapper.instance();
    expect(instance.unmounted).toBeFalsy();
    wrapper.unmount();
    expect(instance.unmounted).toBeTruthy();
  });

  it("should update state when new props passed in", () => {
    wrapper = shallow(<RichTextEditor {...props} value={content} />);

    wrapper.setProps({ value: "Foo" });

    const html = wrapper.instance().getHTML();

    expect(html).toContain("Foo");
  });

  it("should render existing content", () => {
    wrapper = shallow(<RichTextEditor {...props} value={content} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow multiline input", () => {
    wrapper = shallow(<RichTextEditor {...props} multiline />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should store a reference to the editor DOM node", () => {
    wrapper.instance().setEditorInstance(editorInstance);
    expect(wrapper.instance().editorInstance).toEqual(editorInstance);
  });

  it("should focus upon click", () => {
    wrapper = shallow(<RichTextEditor {...props} />, {
      disableLifecycleMethods: true
    });
    wrapper.instance().setEditorInstance(editorInstance);
    wrapper.find("[data-test='rte-field']").simulate("click");

    expect(editorInstance.focus).toHaveBeenCalled();
  });

  it("should autoFocus", () => {
    wrapper.instance().setEditorInstance(editorInstance);
    wrapper.setProps({ autoFocus: true });
    expect(editorInstance.focus).toHaveBeenCalled();
  });

  it("should store editorState in local state upon change event", () => {
    const editorState = EditorState.createEmpty();
    wrapper.find(Editor).simulate("change", editorState);
    expect(wrapper.state("editorState")).toBe(editorState);
  });

  it("should handle toggling a control", () => {
    const toolbar = wrapper.find(Toolbar);
    const handleChange = jest.fn();
    wrapper.instance().handleChange = handleChange;

    toolbar.simulate("toggle", { type: STYLE_BLOCK, style: "heading" });
    expect(RichUtils.toggleBlockType).toHaveBeenCalled();
    toolbar.simulate("toggle", { type: STYLE_INLINE, style: "heading" });
    expect(RichUtils.toggleInlineStyle).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("should call onUpdate with raw editor state onBlur", () => {
    wrapper.find("[data-test='rte-field']").simulate("blur");
    expect(props.onUpdate).toHaveBeenCalledWith({
      name: "test",
      value: "<p></p>"
    });
  });

  it("should call the relevant method to determine if the element is active", () => {
    const inlineStyle = findById(styleButtons, "bold");
    const blockElement = findById(styleButtons, "heading");

    const instance = wrapper.instance();
    instance.hasInlineStyle = jest.fn();
    instance.hasBlockStyle = jest.fn();

    instance.isActiveControl(inlineStyle);
    expect(instance.hasInlineStyle).toHaveBeenCalled();

    instance.isActiveControl(blockElement);
    expect(instance.hasBlockStyle).toHaveBeenCalled();
  });

  it("should remove carriage returns on paste", () => {
    const text = "hello\nworld";

    const handled = wrapper.find(Editor).prop("handlePastedText")(text);
    const html = wrapper.instance().getHTML();

    expect(handled).toBe("handled");
    expect(html).toContain("hello world");
  });

  it("should disable enter key", () => {
    var result = wrapper.find(Editor).prop("handleReturn")();
    expect(result).toBe("handled");
  });

  it("should set focus to true when Editor is focused", () => {
    wrapper.find("[data-test='rte-field']").simulate("focus");
    expect(wrapper.state("focused")).toBe(true);
  });

  it("should be able to determine current block style", () => {
    const selection = {
      getStartKey: jest.fn(() => "selection")
    };
    const block = {
      getType: () => "block-type"
    };
    const currentContent = {
      getBlockForKey: jest.fn(() => block)
    };
    const editorState = {
      getCurrentContent: () => currentContent,
      getSelection: () => selection
    };

    let result = wrapper.instance().hasBlockStyle(editorState, "block-type");
    expect(result).toBe(true);
    expect(selection.getStartKey).toHaveBeenCalled();
    expect(currentContent.getBlockForKey).toHaveBeenCalledWith("selection");

    result = wrapper.instance().hasBlockStyle(editorState, "blah");
    expect(result).toBe(false);
  });

  it("should be able to determine current inline style", () => {
    const currentStyle = {
      has: jest.fn()
    };
    const editorState = {
      getCurrentInlineStyle: () => currentStyle
    };

    wrapper.instance().hasInlineStyle(editorState, "foo");
    expect(currentStyle.has).toHaveBeenCalledWith("foo");
  });

  describe("piping", () => {
    const toRaw = wrapper =>
      convertToRaw(wrapper.state("editorState").getCurrentContent());

    const createEntity = (type, mutability, data) => ({
      type,
      mutability,
      data
    });

    describe("existing piped values", () => {
      const answers = [
        {
          id: "1",
          displayName: "answer 1",
          label: "answer 1",
          type: "TextField"
        },
        {
          id: "2",
          displayName: "answer 2",
          label: "answer 2",
          type: "TextField"
        },
        {
          id: "3",
          displayName: "answer 3",
          label: "answer 3",
          type: "TextField"
        }
      ];

      const metadata = [
        {
          id: "1",
          displayName: "metadata 1"
        }
      ];

      let fetch;

      beforeEach(() => {
        fetch = jest.fn(() => SynchronousPromise.resolve(answers));
      });

      it("should load labels for piped answers when mounted", () => {
        const html = `<p><span data-piped="answers" data-id="1" data-type="TextField">[Piped Value]</span> <span data-piped="answers" data-id="2" data-type="TextField">[Piped Value]</span> <span data-piped="metadata" data-id="1">[Piped Value]</span></p>`;

        wrapper = shallow(
          <RichTextEditor
            {...props}
            fetchAnswers={fetch}
            metadata={metadata}
            value={html}
          />
        );

        const expected = new Raw()
          .addBlock("[answer 1] [answer 2] [metadata 1]")
          .addEntity(
            createPipedEntity(createEntity, {
              id: answers[0].id,
              type: answers[0].type,
              pipingType: "answers"
            }),
            0,
            10
          )
          .addEntity(
            createPipedEntity(createEntity, {
              id: answers[1].id,
              type: answers[1].type,
              pipingType: "answers"
            }),
            11,
            10
          )
          .addEntity(
            createPipedEntity(createEntity, {
              id: metadata[0].id,
              type: null,
              pipingType: "metadata"
            }),
            22,
            12
          )
          .toRawContentState();

        expect(toRaw(wrapper)).toEqual(expected);
      });

      it("should handle piped values for answers that no longer exist", () => {
        const nonExistentAnswer = {
          id: "4",
          type: "TextField",
          pipingType: "answers"
        };
        const nonExistentMetadata = {
          id: "2",
          type: null,
          pipingType: "metadata"
        };
        const html = `<p><span data-piped="answers" data-id="4" data-type="TextField">[Piped Value]</span> <span data-piped="answers" data-id="2" data-type="TextField">[Piped Value]</span> <span data-piped="metadata" data-id="2">[Piped Value]</span></p>`;

        wrapper = shallow(
          <RichTextEditor
            {...props}
            fetchAnswers={fetch}
            value={html}
            metadata={metadata}
          />
        );

        const expected = new Raw()
          .addBlock("[Deleted Answer] [answer 2] [Deleted Metadata]")
          .addEntity(createPipedEntity(createEntity, nonExistentAnswer), 0, 16)
          .addEntity(
            createPipedEntity(createEntity, {
              id: answers[1].id,
              type: answers[1].type,
              pipingType: "answers"
            }),
            17,
            10
          )
          .addEntity(
            createPipedEntity(createEntity, nonExistentMetadata),
            28,
            18
          )
          .toRawContentState();

        expect(toRaw(wrapper)).toEqual(expected);
      });

      it("should not request no answers when none are found", () => {
        wrapper = shallow(<RichTextEditor {...props} fetchAnswers={fetch} />);
        expect(fetch).not.toHaveBeenCalled();
      });

      it("should not update piped value text if answer or metadata doesn't have name to display", () => {
        const html = `<p><span data-piped="answers" data-id="123" data-type="TextField">[Piped Value]</span> <span data-piped="metadata" data-id="456">[Piped Metadata]</span></p>`;
        const answer = { id: "123", type: "TextField", pipingType: "answers" };
        const metadataNoAlias = {
          id: "456",
          type: null,
          pipingType: "metadata"
        };
        fetch = jest.fn(() => Promise.resolve([answer]));

        wrapper = shallow(
          <RichTextEditor
            {...props}
            fetchAnswers={fetch}
            metadata={[metadataNoAlias]}
            value={html}
          />
        );

        const expected = new Raw()
          .addBlock("[Piped Value] [Piped Metadata]")
          .addEntity(createPipedEntity(createEntity, answer), 0, 13)
          .addEntity(createPipedEntity(createEntity, metadataNoAlias), 14, 16)
          .toRawContentState();

        expect(toRaw(wrapper)).toEqual(expected);
      });
    });

    describe("inserting piped values", () => {
      it("should allow for new answer piped values to be added", () => {
        const answer = {
          id: "123",
          displayName: "FooBar",
          type: "TextField",
          pipingType: "answers"
        };

        wrapper.find(Toolbar).simulate("piping", answer);

        const expected = new Raw()
          .addBlock("[FooBar]")
          .addEntity(
            createPipedEntity(createEntity, omit(answer, ["displayName"])),
            0,
            8
          )
          .toRawContentState();

        expect(toRaw(wrapper)).toEqual(expected);
      });

      it("should allow for new answer metadata values to be added", () => {
        const answer = {
          id: "123",
          displayName: "FooBar",
          pipingType: "metadata"
        };

        wrapper.find(Toolbar).simulate("piping", answer);

        const expected = new Raw()
          .addBlock("[FooBar]")
          .addEntity(
            createPipedEntity(createEntity, omit(answer, ["displayName"])),
            0,
            8
          )
          .toRawContentState();

        expect(toRaw(wrapper)).toEqual(expected);
      });
    });
  });

  describe("formatting", () => {
    it("should not strip piped values", () => {
      const answer = {
        id: "123",
        label: "pipe",
        type: "TextField",
        displayName: "FooBar",
        pipingType: "answers"
      };

      wrapper.find(Toolbar).simulate("piping", answer);
      wrapper.find(`[data-test="rte-field"]`).simulate("blur");

      const { value } = props.onUpdate.mock.calls[0][0];
      expect(value).toEqual(
        '<p><span data-piped="answers" data-id="123" data-type="TextField">[FooBar]</span></p>'
      );
    });
  });
});
