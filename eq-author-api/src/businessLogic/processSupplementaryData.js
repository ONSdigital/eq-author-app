const { v4: uuidv4 } = require("uuid");

/* 
Function to process the SDS schema v1 
This function takes the schema and iterates through the various properties 
and converts them to objects to allow us to do piping.
*/

const processSupplementaryData = (schema) => {
  const supplementaryData = [];

  const addSupplementaryfield = (schemaField, identifier, list, selector) => {
    supplementaryData.push({
      id: uuidv4(),
      type: schemaField.type,
      identifier: identifier,
      selector: selector,
      list: list,
      example: schemaField.examples[0],
      description: schemaField.description,
    });
  };

  const processProperties = (properties, list = "", identifier = "") => {
    const keys = Object.keys(properties).filter(
      (key) =>
        key !== "items" && key !== "identifier" && key !== "schema_version"
    );

    keys.forEach((key) => {
      if (properties[key].properties) {
        processProperties(properties[key].properties, list, key);
      } else {
        addSupplementaryfield(
          properties[key],
          identifier || key,
          list,
          identifier ? key : ""
        );
      }
    });
  };

  // process root level fields
  processProperties(schema.properties);

  // process lists in the items object
  const lists = schema.properties.items.properties;
  const listKeys = Object.keys(lists).filter(
    (key) => key !== "items" && key !== "identifier" && key !== "schema_version"
  );
  listKeys.forEach((itemKey) => {
    processProperties(lists[itemKey].items.properties, itemKey);
  });

  return supplementaryData;
};

module.exports = processSupplementaryData;
