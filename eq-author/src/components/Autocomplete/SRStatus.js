import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const StatusProps = {
  id: PropTypes.string,
  length: PropTypes.number,
  tNoResults: PropTypes.func,
  tResults: PropTypes.func,
};

export const Status = ({
  id,
  length,
  tNoResults = () => "No search results",
  tResults = length => {
    const words = {
      result: length === 1 ? "result" : "results",
      is: length === 1 ? "is" : "are",
    };

    return `${length} ${words.result} ${words.is} available.`;
  },
}) => {
  const [content, setContent] = useState(null);
  const debounced = useRef(false);
  const bump = useRef(false);

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

  const noResults = length === 0;

  let srContent = null;
  if (noResults) {
    srContent = tNoResults();
  } else {
    srContent = tResults(length);
  }

  debouncer(srContent);

  return (
    <>
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
