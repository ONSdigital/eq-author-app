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
  replacePipedValues,
  insertPipedValue,
} from "./entities/PipedValue";

import createLinkPlugin, {
  createLink,
  linkToHTML,
  linkFromHTML,
} from "./LinkPlugin";

import createFormatStripper from "./utils/createFormatStripper";

import { flow, uniq, map, keyBy, mapValues, get } from "lodash/fp";
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
  margin-bottom: 2em;
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

const getContentsOfPipingType = (type) => (contents) =>
  contents.filter((content) => content.entity.data.pipingType === type);

const getAnswerPipes = getContentsOfPipingType("answers");
const getMetadataPipes = getContentsOfPipingType("metadata");

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
    errorValidationMsg: PropTypes.string,
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

    this.updateAnswerPipedValues(pipes);
    this.updateMetadataPipedValues(pipes);
  }

  updateMetadataPipedValues(pipes) {
    if (!this.props.metadata) {
      return;
    }

    const metadataPipes = getMetadataPipes(pipes);
    if (metadataPipes.length === 0) {
      return;
    }

    this.renamePipedValues(
      () => this.props.metadata,
      metadataPipes,
      "Deleted metadata"
    );
  }

  updateAnswerPipedValues(pipes) {
    if (!this.props.fetchAnswers) {
      return;
    }

    const answerPipes = getAnswerPipes(pipes);
    if (answerPipes.length === 0) {
      return;
    }

    const processAnswerType = (answers) => {
      return answers.map((answer) => {
        if (get("entity.data.type", answer) === "DateRange") {
          return {
            ...answer,
            entity: {
              data: {
                id: get("entity.data.id", answer).replace(/(to|from)$/, ""),
              },
            },
          };
        } else {
          return answer;
        }
      });
    };

    const fetchAnswersForPipes = flow(
      processAnswerType,
      map("entity.data.id"),
      uniq,
      this.props.fetchAnswers
    );

    this.renamePipedValues(
      fetchAnswersForPipes(answerPipes),
      answerPipes,
      "Deleted answer"
    );
  }

  renamePipedValues(fetchAuthorEntities, pipes, deletedPlaceholder) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const createIdToDisplayNameMap = flow(
      keyBy("id"),
      mapValues("displayName")
    );

    const replacePipesWithLabels = (labels) =>
      pipes.reduce(
        replacePipedValues(labels, deletedPlaceholder),
        contentState
      );

    const createNewEntryForMultipleValueEntities = (answers) => {
      const processedEntries = [];

      answers.forEach((answer) => {
        if (answer.type === "DateRange") {
          processedEntries.push(
            {
              ...answer,
              id: `${answer.id}from`,
            },
            {
              ...answer,
              id: `${answer.id}to`,
              displayName:
                answer.secondaryLabel || answer.secondaryLabelDefault,
            }
          );
        } else {
          processedEntries.push(answer);
        }
      });

      return processedEntries;
    };

    const performUpdate = flow(
      createNewEntryForMultipleValueEntities,
      createIdToDisplayNameMap,
      replacePipesWithLabels,
      (contentState) =>
        EditorState.push(editorState, contentState, "apply-entity"),
      this.handleChange
    );

    // Cant check for instanceof Promise as uses SynchronousPromise in test
    if (fetchAuthorEntities.then) {
      fetchAuthorEntities.then(performUpdate);
      return;
    }

    performUpdate(fetchAuthorEntities());
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

  handleMouseDown = (e) => {
    // prevent blur when mousedown on non-editor elements
    if (
      !this.editorInstance.getEditorRef().editor.contains(e.target) &&
      e.target.type !== "text"
    ) {
      e.preventDefault();
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
      ...otherProps
    } = this.props;

    return (
      <Wrapper>
        <Field
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          data-test="rte-field"
          disabled={disabled}
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
              editorState={editorState}
              onToggle={this.handleToggle}
              onPiping={this.handlePiping}
              onLinkChosen={this.handleLinkChosen}
              isActiveControl={this.isActiveControl}
              selectionIsCollapsed={selection.isCollapsed()}
              visible={focused}
              testId={`${testSelector}-toolbar`}
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
        {errorValidationMsg && (
          <ValidationError>{errorValidationMsg}</ValidationError>
        )}
      </Wrapper>
    );
  }
}

export default RichTextEditor;
