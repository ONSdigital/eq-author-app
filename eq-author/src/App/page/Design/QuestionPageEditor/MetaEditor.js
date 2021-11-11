import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import { get, flowRight } from "lodash";

import RichTextEditor from "components/RichTextEditor";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withValidationError from "enhancers/withValidationError";

import pageFragment from "graphql/fragments/page.graphql";
import { getErrorByField } from "./validationUtils.js";

const titleControls = {
  emphasis: true,
  piping: true,
};

export class StatelessMetaEditor extends React.Component {
  description = React.createRef();
  guidance = React.createRef();

  errorMsg = (field) =>
    getErrorByField(field, this.props.page.validationErrorInfo.errors);

  render() {
    const { page, onChangeUpdate, fetchAnswers } = this.props;
    return (
      <div>
        {console.log(`this.props.page`, this.props.page)}
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
          autoFocus={!page.title}
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
};

StatelessMetaEditor.fragments = {
  Page: pageFragment,
};

export default flowRight(
  withValidationError("page"),
  withChangeUpdate
)(StatelessMetaEditor);
