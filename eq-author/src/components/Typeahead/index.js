import React from "react";
import Downshift from "downshift";

const Typeahead = props => (
  <Downshift itemToString={item => (item ? item.value : "")} {...props} />
);

export default Typeahead;
