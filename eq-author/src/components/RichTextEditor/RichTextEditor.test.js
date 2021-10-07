import React from "react";
import { shallow } from "enzyme";
import { SynchronousPromise } from "synchronous-promise";
import { RichUtils, EditorState, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import Raw from "draft-js-raw-content-state";
import { omit } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import Toolbar, {
  STYLE_BLOCK,
  STYLE_INLINE,
  styleButtons,
} from "components/RichTextEditor/Toolbar";
import findById from "utils/findById";

import { createPipedEntity } from "components/RichTextEditor/entities/PipedValue";

// https://github.com/facebook/draft-js/issues/702
jest.mock("draft-js/lib/generateRandomKey", () => () => "123");

let wrapper, props, editorInstance, editorFocus;

const content = `
  <h2>List of styles:</h2>
  <ul>
    <li>Regular</li>
    <li><strong>Bold</strong></li>
    <li><em>Emphasis</em></li>
  </ul>
`;

describe("components/RichTextEditor", function () {
  beforeEach(() => {
    props = {
      onUpdate: jest.fn(),
      label: "I am a label",
      id: "test",
      name: "test-name",
      testSelector: "test-selector-foo",
    };
    editorFocus = jest.fn();
    editorInstance = {
      getEditorRef: () => ({
        editor: {
          focus: editorFocus,
        },
      }),
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

  it("should show as disabled and readonly when disabled", () => {
    wrapper = shallow(<RichTextEditor {...props} disabled />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should store a reference to the editor DOM node", () => {
    wrapper.instance().setEditorInstance(editorInstance);
    expect(wrapper.instance().editorInstance).toEqual(editorInstance);
  });

  it("should focus upon click", () => {
    wrapper = shallow(<RichTextEditor {...props} />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setEditorInstance(editorInstance);
    wrapper.find("[data-test='rte-field']").simulate("click");

    expect(editorFocus).toHaveBeenCalled();
  });

  it("should autoFocus on mount if prop set", () => {
    wrapper = shallow(<RichTextEditor {...props} autoFocus />, {
      disableLifecycleMethods: true,
    });
    wrapper.instance().setEditorInstance(editorInstance);
    wrapper.instance().componentDidMount();
    expect(editorFocus).toHaveBeenCalled();
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

  it("empty RTE should call onUpdate with empty value onBlur", () => {
    wrapper.find("[data-test='rte-field']").simulate("blur");
    expect(props.onUpdate).toHaveBeenCalledWith({
      name: "test-name",
      value: "",
    });
  });

  it("should not strip tags with a value", () => {
    wrapper.setProps({ value: "<p>test</p>" });
    wrapper.find("[data-test='rte-field']").simulate("blur");
    expect(props.onUpdate).toHaveBeenCalledWith({
      name: "test-name",
      value: "<p>test</p>",
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
      getStartKey: jest.fn(() => "selection"),
    };
    const block = {
      getType: () => "block-type",
    };
    const currentContent = {
      getBlockForKey: jest.fn(() => block),
    };
    const editorState = {
      getCurrentContent: () => currentContent,
      getSelection: () => selection,
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
      has: jest.fn(),
    };
    const editorState = {
      getCurrentInlineStyle: () => currentStyle,
    };

    wrapper.instance().hasInlineStyle(editorState, "foo");
    expect(currentStyle.has).toHaveBeenCalledWith("foo");
  });

  describe("piping", () => {
    const toRaw = (wrapper) =>
      convertToRaw(wrapper.state("editorState").getCurrentContent());

    const createEntity = (type, mutability, data) => ({
      type,
      mutability,
      data,
    });

    describe("existing piped values", () => {
      const answers = [
        {
          id: "1",
          displayName: "answer 1",
          label: "answer 1",
        },
        {
          id: "2",
          displayName: "answer 2",
          label: "answer 2",
        },
        {
          id: "3",
          displayName: "answer 3",
          label: "answer 3",
        },
      ];

      let fetch;

      beforeEach(() => {
        fetch = jest.fn(() => SynchronousPromise.resolve(answers));
      });

      it("should not request no answers when none are found", () => {
        wrapper = shallow(<RichTextEditor {...props} fetchAnswers={fetch} />);
        expect(fetch).not.toHaveBeenCalled();
      });

      it("should not update piped value text if answer or metadata doesn't have name to display", () => {
        const html = `<p><span data-piped="answers" data-id="123" data-type="number">[Piped Value]</span> <span data-piped="metadata" data-id="456" data-type="number">[Piped Metadata]</span></p>`;
        const answer = { id: "123", pipingType: "answers", type: "number" };
        const metadataNoAlias = {
          id: "456",
          pipingType: "metadata",
          type: "number",
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
          pipingType: "answers",
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
          pipingType: "metadata",
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

      it("should process Date Range entity type so correct id is used", () => {
        const answer = {
          id: "123",
          displayName: "FooBar",
          label: "from label",
          secondaryLabel: "to label",
          pipingType: "answers",
          type: "DateRange",
        };

        const fetchDateRange = jest.fn(() => Promise.resolve([answer]));
        const html = `<p><span data-piped="answers" data-id="123" data-type="DateRange">[FooBar]</span></p>`;

        wrapper = shallow(
          <RichTextEditor
            {...props}
            fetchAnswers={fetchDateRange}
            metadata={[]}
            value={html}
          />
        );

        const expected = new Raw()
          .addBlock("[FooBar]")
          .addEntity(
            createPipedEntity(
              createEntity,
              omit(answer, ["displayName", "label", "secondaryLabel"])
            ),
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
        displayName: "FooBar",
        pipingType: "answers",
      };

      wrapper.find(Toolbar).simulate("piping", answer);
      wrapper.find(`[data-test="rte-field"]`).simulate("blur");

      const { value } = props.onUpdate.mock.calls[0][0];
      expect(value).toEqual(
        '<p><span data-piped="answers" data-id="123">[FooBar]</span></p>'
      );
    });
  });

  describe("validation", () => {
    it("should set input as valid if no validation message is passed as parameter", () => {
      expect(wrapper.find("RichTextEditor__Input").prop("invalid")).toEqual(
        false
      );
    });

    it("should not display error message if no validation message passed as parameter", () => {
      expect(wrapper.find("ErrorInline")).toHaveLength(0);
    });

    it("should set input as invalid if validation message is passed as parameter", () => {
      const errorValidationMsg = "Validation Message";

      const validationProps = {
        ...props,
        errorValidationMsg,
      };

      const validationWrapper = shallow(
        <RichTextEditor {...validationProps} />
      );

      expect(
        validationWrapper.find("RichTextEditor__Input").prop("invalid")
      ).toEqual(true);
    });

    it("should display validation message is passed as parameter", () => {
      const errorValidationMsg = "Validation Message";

      const validationProps = {
        ...props,
        errorValidationMsg,
      };

      const validationWrapper = shallow(
        <RichTextEditor {...validationProps} />
      );

      expect(validationWrapper.find("ValidationError")).toHaveLength(1);
    });
  });
});
