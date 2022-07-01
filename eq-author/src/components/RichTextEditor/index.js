import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Editor from "draft-js-plugins-editor";
import { EditorState, RichUtils, Modifier, CompositeDecorator } from "draft-js";
import "draft-js/dist/Draft.css";
import createBlockBreakoutPlugin from "draft-js-block-breakout-plugin";

import { toHTML, fromHTML } from "./utils/convert";
import Toolbar, { STYLE_BLOCK } from "./Toolbar";
import PipedValueDecorator, {
  entityToHTML as pipedEntityToHTML,
  htmlToEntity as htmlToPipedEntity,
  findPipedEntities,
  insertPipedValue,
} from "./entities/PipedValue";

import createLinkPlugin, {
  createLink,
  linkToHTML,
  linkFromHTML,
} from "./LinkPlugin";

import createFormatStripper from "./utils/createFormatStripper";

import { sharedStyles } from "components/Forms/css";
import { Field, Label } from "components/Forms";
import ValidationError from "components/ValidationError";

const styleMap = {
  ITALIC: {
    backgroundColor: "#cbe2c8",
  },
};

const heading = css`
  font-size: 1.3em;
  line-height: 1.4;
  font-weight: bold;
`;

const list = css`
  margin-left: 1.5em;
`;

const sizes = {
  large: css`
    font-size: 1.3em;
    font-weight: 700;
    line-height: 1.3;

    @media only screen and (max-width: 84em) {
      font-size: 1em;
    }
  `,

  medium: css`
    font-size: 1.1em;
    font-weight: 700;
  `,

  small: css`
    font-size: 1em;
  `,
};

const Wrapper = styled.div`
  position: relative;
  line-height: 1.5;
  margin-bottom: ${(props) =>
    props.hasError || props.withoutMargin ? "0" : "2"}em;
`;

Wrapper.defaultProps = {
  size: "small",
};

const Input = styled.div`
  ${sharedStyles};
  padding: 0;

  .header-two,
  .unordered-list-item {
    margin: 0;
  }

  .unstyled:not(:last-of-type) {
    margin: 0 0 1em;
  }

  .header-two {
    ${heading};
    margin-bottom: 1rem;
  }

  .unordered-list-item {
    ${list};
    margin-bottom: 0.25rem;
  }

  ${(props) => sizes[props.size]};

  .DraftEditor-root {
    padding: 1rem;
  }

  .public-DraftEditorPlaceholder-root {
    /* style placeholder based on prospective style */
    ${(props) => props.placeholderStyle === "header-two" && heading}
    ${(props) => props.placeholderStyle === "unordered-list-item" && list};
    color: #a3a3a3;
  }
`;

const convertToHTML = toHTML({ ...pipedEntityToHTML, ...linkToHTML });
const convertFromHTML = fromHTML({ ...htmlToPipedEntity, ...linkFromHTML });

const getBlockStyle = (block) => block.getType();

const filterEmptyTags = (value) =>
  new DOMParser().parseFromString(value, "text/html").body.textContent.trim()
    ? value
    : "";

class RichTextEditor extends React.Component {
  static defaultProps = {
    placeholder: "",
    multiline: false,
    autoFocus: false,
    disabled: false,
    maxHeight: 12,
  };

  state = {
    focused: false,
  };

  static propTypes = {
    pageType: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
    label: PropTypes.node,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    maxHeight: PropTypes.number,
    size: PropTypes.oneOf(Object.keys(sizes)),
    fetchAnswers: PropTypes.func,
    testSelector: PropTypes.string,
    autoFocus: PropTypes.bool,
    controls: PropTypes.shape({
      piping: PropTypes.bool,
      link: PropTypes.bool,
      bold: PropTypes.bool,
      emphasis: PropTypes.bool,
      list: PropTypes.bool,
      heading: PropTypes.bool,
    }),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        __typename: PropTypes.string,
        id: PropTypes.string,
        alias: PropTypes.string,
      })
    ),
    disabled: PropTypes.bool,
    errorValidationMsg: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    linkCount: PropTypes.number,
    linkLimit: PropTypes.number,
    withoutMargin: PropTypes.bool,
    allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
  };

  constructor(props) {
    super(props);
    const editorState = this.configureEditorState(props.value, props.controls);

    this.plugins = [createBlockBreakoutPlugin(), createLinkPlugin()];

    this.state = { editorState };
  }

  configureEditorState(value, controls) {
    const decorator = new CompositeDecorator([PipedValueDecorator]);

    this.stripFormatting = createFormatStripper(controls);

    return value
      ? EditorState.createWithContent(convertFromHTML(value), decorator)
      : EditorState.createEmpty(decorator);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    this.updatePipedValues();

    if (autoFocus) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps) {
    /*eslint-disable react/no-did-update-set-state */
    if (
      prevProps.value !== this.props.value &&
      typeof this.props.value === "string" &&
      this.props.value !== filterEmptyTags(this.getHTML())
    ) {
      const { editorState } = this.state;
      const anchorOffset = editorState.getSelection().get("anchorOffset");
      let selectionUpdated = EditorState.push(
        editorState,
        convertFromHTML(this.props.value),
        "insert-characters"
      );
      if (this.state.focused) {
        selectionUpdated = EditorState.forceSelection(
          selectionUpdated,
          selectionUpdated.getSelection().merge({
            anchorOffset,
            focusOffset: anchorOffset,
          })
        );
      }

      this.handleChange(selectionUpdated);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  updatePipedValues() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const pipes = findPipedEntities(contentState);

    if (!pipes.length) {
      return;
    }
  }

  handlePiping = (answer) => {
    const { editorState } = this.state;

    const newContent = insertPipedValue(
      answer,
      editorState.getCurrentContent(),
      editorState.getSelection()
    );

    const insertedEditorState = EditorState.push(
      editorState,
      newContent,
      "insert-characters"
    );

    const selectedState = EditorState.forceSelection(
      insertedEditorState,
      newContent.getSelectionAfter()
    );

    this.handleChange(selectedState, () => this.focus());
  };

  focus() {
    if (this.editorInstance) {
      this.editorInstance.getEditorRef().editor.focus();
    }
  }

  getHTML() {
    return convertToHTML(this.state.editorState);
  }

  setEditorInstance = (editorInstance) => {
    this.editorInstance = editorInstance;
  };

  handleClick = () => {
    if (!this.state.focused) {
      this.focus();
    }
  };

  handleChange = (editorState) => {
    editorState = this.stripFormatting(editorState);
    return this.setState({ editorState });
  };

  handleToggle = ({ type, style }) => {
    const toggle =
      type === STYLE_BLOCK
        ? RichUtils.toggleBlockType
        : RichUtils.toggleInlineStyle;

    const editorState = toggle(this.state.editorState, style);
    this.handleChange(editorState);
  };

  handleBlur = () => {
    this.props.onUpdate({
      name: this.props.name,
      value: filterEmptyTags(this.getHTML()),
    });

    this.timeoutID = setTimeout(() => {
      if (!this.unmounted && this.state.focused) {
        this.setState({ focused: false });
      }
    }, 0);
  };

  handleFocus = () => {
    clearTimeout(this.timeoutID);

    if (!this.unmounted && !this.state.focused) {
      this.setState({ focused: true });
    }
  };

  hasBlockStyle = (editorState, style) => {
    const selection = editorState.getSelection();

    const blockStyle = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return blockStyle === style;
  };

  hasInlineStyle = (editorState, style) =>
    editorState.getCurrentInlineStyle().has(style);

  isActiveControl = ({ style, type }) => {
    const { editorState } = this.state;

    return type === STYLE_BLOCK
      ? this.hasBlockStyle(editorState, style)
      : this.hasInlineStyle(editorState, style);
  };

  handlePaste = (text) => {
    this.handleChange(
      EditorState.push(
        this.state.editorState,
        Modifier.replaceText(
          this.state.editorState.getCurrentContent(),
          this.state.editorState.getSelection(),
          text.replace(/\n/g, " ")
        )
      )
    );

    return "handled";
  };

  handleReturn = () => {
    return "handled";
  };

  handleLinkChosen = (text, url) => {
    this.handleChange(createLink(text, url, this.state.editorState));
  };

  render() {
    const { editorState, focused } = this.state;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const {
      pageType,
      label,
      multiline,
      size,
      className,
      testSelector,
      id,
      placeholder,
      disabled,
      errorValidationMsg,
      maxHeight,
      linkCount,
      linkLimit,
      withoutMargin,
      allCalculatedSummaryPages,
      ...otherProps
    } = this.props;

    const hasError = errorValidationMsg && true;

    return (
      <Wrapper hasError={hasError} withoutMargin={withoutMargin}>
        <Field
          onClick={this.handleClick}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          data-test="rte-field"
          disabled={disabled}
          last={hasError}
        >
          {label && <Label id={`label-${id}`}>{label}</Label>}
          <Input
            className={className}
            size={size}
            maxHeight={maxHeight}
            multiline={multiline}
            placeholderStyle={contentState.getBlockMap().first().getType()}
            invalid={Boolean(errorValidationMsg)}
          >
            <Toolbar
              pageType={pageType}
              editorState={editorState}
              onToggle={this.handleToggle}
              onPiping={this.handlePiping}
              onLinkChosen={this.handleLinkChosen}
              isActiveControl={this.isActiveControl}
              selectionIsCollapsed={selection.isCollapsed()}
              visible={focused}
              testId={`${testSelector}-toolbar`}
              linkCount={linkCount}
              linkLimit={linkLimit}
              allCalculatedSummaryPages={allCalculatedSummaryPages}
              {...otherProps}
            />

            <Editor
              ariaLabel={label}
              ariaLabelledBy={`label-${id}`}
              editorState={editorState}
              onChange={this.handleChange}
              ref={this.setEditorInstance}
              customStyleMap={styleMap}
              blockStyleFn={getBlockStyle}
              handleReturn={multiline ? undefined : this.handleReturn}
              handlePastedText={multiline ? undefined : this.handlePaste}
              spellCheck
              webDriverTestID={testSelector}
              placeholder={placeholder}
              decorators={[PipedValueDecorator]}
              plugins={this.plugins}
              readOnly={disabled}
            />
          </Input>
        </Field>
        {errorValidationMsg &&
          (Array.isArray(errorValidationMsg) ? (
            errorValidationMsg.map((errMsg) => (
              <ValidationError key={errMsg}>{errMsg}</ValidationError>
            ))
          ) : (
            <ValidationError>{errorValidationMsg}</ValidationError>
          ))}
      </Wrapper>
    );
  }
}

export default RichTextEditor;
