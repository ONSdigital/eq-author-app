const {
  buildSchema,
  findBreakingChanges,
  isObjectType,
  isInterfaceType,
  BreakingChangeType,
  isInputObjectType,
  isEnumType
} = require("graphql");

const tail = ([, ...rest]) => rest;
const re = re => data => re.exec(data);
const flow = (...fns) => arg => fns.reduce((acc, fn) => fn(acc), arg);
const get = prop => obj => obj[prop];
const startsWith = needle => haystack => haystack.indexOf(needle) === 0;

const parseEnumBreakage = data => {
  const stripFullStops = /\./g;
  const words = data.replace(stripFullStops, "").split(" ");
  return [words[0], words[words.length - 1]];
};

const isIntrospectionType = flow(
  get("name"),
  startsWith("__")
);
const parseBreakage = flow(
  get("description"),
  re(/^(.*?)\.(.*?) /),
  tail
);

const findDeprecatedDirective = directives => {
  if (directives.length === 0) {
    return false;
  } else {
    const deprecatedDirectives = directives.filter(
      directive => directive.name.value === "deprecated"
    );
    return deprecatedDirectives.length > 0 ? true : false;
  }
};

const findDeprecatedFields = schema => {
  const deprecatedFields = [];
  const typeMap = schema.getTypeMap();

  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];

    if (
      !(
        isObjectType(type) ||
        isInterfaceType(type) ||
        isInputObjectType(type) ||
        isEnumType(type)
      ) ||
      isIntrospectionType(type)
    ) {
      return;
    }

    if (isEnumType(type)) {
      const values = type.getValues();
      values.map(value => {
        if (value.isDeprecated) {
          deprecatedFields.push({
            field: value.name,
            type: type.toString()
          });
        }
      });
    } else {
      const fields = type.getFields();

      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (
          field.isDeprecated ||
          findDeprecatedDirective(field.astNode.directives)
        ) {
          deprecatedFields.push({
            field: fieldName,
            type: typeName
          });
        }
        if (field.hasOwnProperty("args") && field.args.length > 0) {
          field.args.map(arg => {
            if (findDeprecatedDirective(arg.astNode.directives)) {
              deprecatedFields.push({
                field: fieldName,
                type: typeName
              });
            }
          });
        }
      });
    }
  });
  return deprecatedFields;
};

const filterOutDeprecatedFields = (breakages, deprecated) => {
  return breakages.filter(breakage => {
    if (
      [
        BreakingChangeType.FIELD_REMOVED,
        BreakingChangeType.ARG_REMOVED,
        BreakingChangeType.VALUE_REMOVED_FROM_ENUM
      ].includes(breakage.type)
    ) {
      let type, field;
      if (breakage.type === BreakingChangeType.VALUE_REMOVED_FROM_ENUM) {
        [field, type] = parseEnumBreakage(get("description")(breakage));
      } else {
        [type, field] = parseBreakage(breakage);
      }
      const isDeprecatedField = deprecated.some(
        x => x.type === type && x.field === field
      );

      return !isDeprecatedField;
    }
    return true;
  });
};

module.exports = (oldSchema, newSchema) =>
  filterOutDeprecatedFields(
    findBreakingChanges(oldSchema, newSchema),
    findDeprecatedFields(oldSchema)
  );
