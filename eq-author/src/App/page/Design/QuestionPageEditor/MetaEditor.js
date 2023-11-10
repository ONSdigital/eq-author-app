import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import { get, flowRight } from "lodash";

import RichTextEditor from "components/RichTextEditor";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withValidationError from "enhancers/withValidationError";

import pageFragment from "graphql/fragments/questionPage.graphql";
import { getMultipleErrorsByField } from "./validationUtils.js";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelectv3/content-types";

const titleControls = {
  emphasis: true,
  piping: true,
};

export class StatelessMetaEditor extends React.Component {
  description = React.createRef();
  guidance = React.createRef();

  errorMsg = (field) =>
    getMultipleErrorsByField(field, this.props.page.validationErrorInfo.errors);

  render() {
    const { page, onChangeUpdate, fetchAnswers, allCalculatedSummaryPages } =
      this.props;

    return (
      <div>
        <RichTextEditor
          id="question-title"
          name="title"
          label="Question"
          placeholder=""
          value={page.title}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-title"
          pageType={page.pageType}
          allowableTypes={[ANSWER, METADATA, VARIABLES]}
          defaultTab="variables"
          autoFocus={!page.title}
          allCalculatedSummaryPages={allCalculatedSummaryPages}
          listId={
            (page.section?.repeatingSectionListId || page.folder.listId) ?? null
          }
          errorValidationMsg={this.errorMsg("title")}
        />
      </div>
    );
  }
}

StatelessMetaEditor.propTypes = {
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
};

StatelessMetaEditor.fragments = {
  Page: pageFragment,
};

export default flowRight(
  withValidationError("page"),
  withChangeUpdate
)(StatelessMetaEditor);
