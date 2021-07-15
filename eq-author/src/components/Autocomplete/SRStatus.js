import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import VisuallyHidden from "components/VisuallyHidden";

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
  tResults = (length) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncer = useCallback(
    debounce((content) => {
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
  if (!length) {
    srContent = tNoResults();
  } else {
    srContent = tResults(length);
  }

  debouncer(srContent);

  return (
    <>
      <VisuallyHidden>
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
      </VisuallyHidden>
    </>
  );
};

Status.propTypes = StatusProps;
