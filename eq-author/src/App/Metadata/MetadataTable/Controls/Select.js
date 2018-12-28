import PropTypes from "prop-types";
import React from "react";
import { flip, map, partial } from "lodash";

import { TableSelect } from "components/DataTable/Controls";

const Select = ({ name, options, value, onChange, onUpdate }) => {
  const handleUpdate = partial(flip(onChange), onUpdate);

  return (
    <TableSelect name={name} value={value} onChange={handleUpdate}>
      {map(options, (value, index) => (
        <option key={index} value={value}>
          {value}
        </option>
      ))}
    </TableSelect>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default Select;
