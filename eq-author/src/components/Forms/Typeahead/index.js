import React from "react";
import Downshift from "downshift";

const Typeahead = (props) => (
  <Downshift
    id="keyList"
    itemToString={(item) => (item ? item.value : "")}
    {...props}
  />
);

export default Typeahead;
