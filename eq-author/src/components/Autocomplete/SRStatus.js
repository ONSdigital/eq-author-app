import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";

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
  const [content, setContent] = useState(null);
  const debounced = useRef(false);
  const bump = useRef(false);
  const noResults = length === 0;

  // ----------------------------------------------------------------------
  // check this works in the morning
  const contentSelectedOption = selectedOption
    ? tSelectedOption(selectedOption, length, selectedOptionIndex)
    : "";
  // ----------------------------------------------------------------------
  const debouncer = useCallback(
    debounce(content => {
      setContent(content);
      debounced.current = true;
      bump.current = !bump.current;
    }, 1500),
    []
  );

  useEffect(() => {
    debounced.current = false;
  }, [content]);

  let srContent = null;
  if (noResults) {
    srContent = tNoResults();
  } else {
    srContent = tResults(length, contentSelectedOption);
  }

  debouncer(srContent);

  return (
    <>
      {/* <p>{`${bump.current} - bump`}</p>
      <p>{`${debounced.current} - debounced`}</p>
      <p>!bump - {!bump.current && debounced.current ? content : ""}</p>
      <p>bump - {bump.current && debounced.current ? content : ""}</p> */}
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
          {!bump.current && debounced.current ? content : ""}
        </div>
        <div
          id={id + "__status--B"}
          role="status"
          aria-atomic="true"
          aria-live="polite"
        >
          {bump.current && debounced.current ? content : ""}
        </div>
      </div>
    </>
  );
};

Status.propTypes = StatusProps;
