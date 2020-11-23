import React from "react";
import PropTypes from "prop-types";

const StatusProps = {
  id: PropTypes.string,
  length: PropTypes.number,
  queryLength: PropTypes.number,
  selectedOption: PropTypes.string,
  selectedOptionIndex: PropTypes.number,
  isInFocus: PropTypes.number,
  validChoiceMade: PropTypes.string,
  tNoResults: PropTypes.func,
  tSelectedOption: PropTypes.func,
  tResults: PropTypes.func,
};

export const Status = ({
  id,
  length,
  selectedOption,
  selectedOptionIndex,
  tNoResults = () => "No search results",
  tSelectedOption = (selectedOption, length, index) =>
    `${selectedOption} ${index + 1} of ${length} is highlighted`,
  tResults = (length, contentSelectedOption) => {
    const words = {
      result: length === 1 ? "result" : "results",
      is: length === 1 ? "is" : "are",
    };

    return `${length} ${words.result} ${words.is} available. ${contentSelectedOption}`;
  },
}) => {
  const noResults = length === 0;

  const contentSelectedOption = selectedOption
    ? tSelectedOption(selectedOption, length, selectedOptionIndex)
    : "";

  let content = null;
  if (noResults) {
    content = tNoResults();
  } else {
    content = tResults(length, contentSelectedOption);
  }
  return (
    <div
      style={{
        border: "0",
        clip: "rect(0 0 0 0)",
        height: "1px",
        marginBottom: "-1px",
        marginRight: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        whiteSpace: "nowrap",
        width: "1px",
      }}
    >
      <div
        id={id + "__status--A"}
        role="status"
        aria-atomic="true"
        aria-live="polite"
      >
        {content}
      </div>
    </div>
  );
};

Status.propTypes = StatusProps;
