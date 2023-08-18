const { v4: uuidv4 } = require("uuid");

/* 
Function to process the SDS schema v1.
This function takes the schema and iterates through the various properties 
and converts them to objects to allow us to do piping.
*/

const processSupplementaryData = (schema) => {
  const supplementaryData = [];

  const addSupplementaryField = (
    schemaFields,
    schemaProperty,
    identifier,
    selector
  ) => {
    const schemaField = {
      id: uuidv4(),
      type: schemaProperty.type,
      identifier: identifier,
      selector: selector,
      description: schemaProperty.description,
    };
    if (schemaProperty.type === "array") {
      schemaField.exampleArray = schemaProperty.examples[0];
    } else {
      schemaField.example = schemaProperty.examples[0];
    }
    schemaFields.push(schemaField);
  };

  const processProperties = (schemaFields, properties, identifier = "") => {
    const keys = Object.keys(properties).filter(
      (key) =>
        key !== "items" && key !== "identifier" && key !== "schema_version"
    );

    keys.forEach((key) => {
      if (properties[key].properties) {
        processProperties(schemaFields, properties[key].properties, key);
      } else {
        addSupplementaryField(
          schemaFields,
          properties[key],
          identifier || key,
          identifier ? key : ""
        );
      }
    });
  };

  // process root level fields
  const rootFields = {
    id: uuidv4(),
    listName: "",
    schemaFields: [],
  };
  processProperties(rootFields.schemaFields, schema.properties);
  supplementaryData.push(rootFields);

  // process lists in the items object
  const lists = schema.properties.items.properties;
  const listKeys = Object.keys(lists);

  listKeys.forEach((listKey) => {
    const listObject = {
      id: uuidv4(),
      listName: listKey,
      schemaFields: [],
    };
    processProperties(
      listObject.schemaFields,
      lists[listKey].items.properties,
      listKey
    );
    supplementaryData.push(listObject);
  });

  return supplementaryData;
};

module.exports = processSupplementaryData;
