import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  CompositeDecorator
} from "draft-js";
import "draft-js/dist/Draft.css";
import { toHTML, fromHTML } from "./utils/convert";
import Toolbar, { STYLE_BLOCK } from "./Toolbar";
import PipedValueDecorator, {
  entityToHTML as pipedEntityToHTML,
  htmlToEntity as htmlToPipedEntity,
  findPipedEntities,
  replacePipedValues,
  insertPipedValue
} from "./entities/PipedValue";

import createFormatStripper from "./utils/createFormatStripper";

import { flow, uniq, map, keyBy, mapValues } from "lodash/fp";
import { sharedStyles } from "../Forms/css";
import { Field, Label } from "../Forms";

const styleMap = {
  ITALIC: {
    backgroundColor: "#cbe2c8"
  }
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
  `,

  medium: css`
    font-size: 1.1em;
    font-weight: 700;
  `,

  small: css`
    font-size: 1em;
  `
};

const Wrapper = styled.div`
  position: relative;
  line-height: 1.5;
  margin-bottom: 2em;
`;

Wrapper.defaultProps = {
  size: "small"
};

const Input = styled.div`
  ${sharedStyles};
  padding: 0;

  .header-two,
  .unstyled,
  .unordered-list-item {
    margin: 0;
  }

  .header-two {
    ${heading};
    margin-bottom: 1rem;
  }

  .unordered-list-item {
    ${list};
    margin-bottom: 0.25rem;
  }

  ${props => sizes[props.size]};

  .DraftEditor-root {
    padding: 1rem;
  }

  .public-DraftEditorPlaceholder-root {
    /* style placeholder based on prospective style */
    ${props => props.placeholderStyle === "header-two" && heading};
    ${props => props.placeholderStyle === "unordered-list-item" && list};
    color: #a3a3a3;
  }
`;

const convertToHTML = toHTML(pipedEntityToHTML);
const convertFromHTML = fromHTML(htmlToPipedEntity);

const getBlockStyle = block => block.getType();

const getContentsOfPipingType = type => contents =>
  contents.filter(content => content.entity.data.pipingType === type);

const getAnswerPipes = getContentsOfPipingType("answers");
const getMetadataPipes = getContentsOfPipingType("metadata");

class RichTextEditor extends React.Component {
  static defaultProps = {
    placeholder: "",
    multiline: false,
    autoFocus: false
  };

  state = {
    focused: false
  };

  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    size: PropTypes.oneOf(Object.keys(sizes)),
    fetchAnswers: PropTypes.func,
    testSelector: PropTypes.string,
    autoFocus: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    controls: PropTypes.object,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        __typename: PropTypes.string,
        id: PropTypes.string,
        alias: PropTypes.string
      })
    )
  };

  constructor(props) {
    super(props);

    const editorState = this.configureEditorState(props.value, props.controls);

    this.state = { editorState };
  }

  configureEditorState(value, controls) {
    const decorator = new CompositeDecorator([PipedValueDecorator]);

    this.stripFormatting = createFormatStripper(controls);

    return value
      ? convertFromHTML(value, decorator)
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
    if (!prevProps.autoFocus && this.props.autoFocus) {
      this.focus();
    }
    /*eslint-disable react/no-did-update-set-state */
    if (prevProps.value !== this.props.value) {
      const editorState = this.configureEditorState(
        this.props.value,
        this.props.controls
      );
      this.setState({
        editorState
      });
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
      "Deleted Metadata"
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

    const fetchAnswersForPipes = flow(
      map("entity.data.id"),
      uniq,
      this.props.fetchAnswers
    );

    this.renamePipedValues(
      fetchAnswersForPipes(answerPipes),
      answerPipes,
      "Deleted Answer"
    );
  }

  renamePipedValues(fetchAuthorEntities, pipes, deletedPlaceholder) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const createIdToDisplayNameMap = flow(
      keyBy("id"),
      mapValues("displayName")
    );

    const replacePipesWithLabels = labels =>
      pipes.reduce(
        replacePipedValues(labels, deletedPlaceholder),
        contentState
      );

    const performUpdate = flow(
      createIdToDisplayNameMap,
      replacePipesWithLabels,
      contentState =>
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

  handlePiping = answer => {
    const { editorState } = this.state;

    const newContent = insertPipedValue(
      answer,
      editorState.getCurrentContent(),
      editorState.getSelection()
    );

    this.handleChange(
      EditorState.push(editorState, newContent, "insert-characters"),
      () => this.focus()
    );
  };

  focus() {
    if (this.editorInstance) {
      this.editorInstance.focus();
    }
  }

  getHTML() {
    return convertToHTML(this.state.editorState);
  }

  setEditorInstance = editorInstance => {
    this.editorInstance = editorInstance;
  };

  handleClick = () => {
    if (!this.state.focused) {
      this.focus();
    }
  };

  handleMouseDown = e => {
    // prevent blur when mousedown on non-editor elements
    if (!this.editorInstance.editor.contains(e.target)) {
      e.preventDefault();
    }
  };

  handleChange = (editorState, callback) => {
    editorState = this.stripFormatting(editorState);
    return this.setState({ editorState }, callback);
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
      name: this.props.name ? this.props.name : this.props.id,
      value: this.getHTML()
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

  handlePaste = text => {
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
        >
          <Label id={`label-${id}`}>{label}</Label>
          <Input
            className={className}
            size={size}
            placeholderStyle={contentState
              .getBlockMap()
              .first()
              .getType()}
          >
            <Toolbar
              editorState={editorState}
              onToggle={this.handleToggle}
              onPiping={this.handlePiping}
              isActiveControl={this.isActiveControl}
              selectionIsCollapsed={selection.isCollapsed()}
              visible={focused}
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
            />
          </Input>
        </Field>
      </Wrapper>
    );
  }
}

export default RichTextEditor;
