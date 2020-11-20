import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// function debounce(func, wait, immediate) {
//   let timeout;
//   return function() {
//     /* eslint-disable babel/no-invalid-this */
//     let context = this;
//     let args = arguments;
//     let later = function() {
//       timeout = null;
//       if (!immediate) {
//         func.apply(context, args);
//       }
//     };
//     let callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) {
//       func.apply(context, args);
//     }
//   };
// }
// const statusDebounceMillis = 1400;

/* eslint-disable react/forbid-prop-types */
const StatusProps = {
  id: PropTypes.any,
  length: PropTypes.any,
  queryLength: PropTypes.any,
  minQueryLength: PropTypes.any,
  selectedOption: PropTypes.any,
  selectedOptionIndex: PropTypes.any,
  isInFocus: PropTypes.any,
  validChoiceMade: PropTypes.any,
  tQueryTooShort: PropTypes.any,
  tNoResults: PropTypes.any,
  tSelectedOption: PropTypes.any,
  tResults: PropTypes.any,
};

export const Status = ({
  id,
  length,
  queryLength,

  selectedOption,
  selectedOptionIndex,
  isInFocus,
  validChoiceMade,
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
  //   const [state, setState] = useState({
  //     bump: false,
  //     debounced: false,
  //     silenced: false,
  //   });

  //   const { bump, debounced, silenced } = state;

  //   useEffect(() => {
  //     debounce(function() {
  //       if (!debounced) {
  //         const shouldSilence = !isInFocus || validChoiceMade;
  //         setState(({ bump }) => ({
  //           bump: !bump,
  //           debounced: true,
  //           silenced: shouldSilence,
  //         }));
  //       }
  //     }, statusDebounceMillis);
  //   }, [debounced, isInFocus, validChoiceMade]);

  //   useEffect(() => {
  //     setState(prev => ({ ...prev, debounced: false }));
  //   }, [queryLength]);

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
  console.log("hello world");
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
      {/* <div
        id={id + "__status--B"}
        role="status"
        aria-atomic="true"
        aria-live="polite"
      >
        {content}
      </div> */}
    </div>
  );
};

Status.propTypes = StatusProps;
