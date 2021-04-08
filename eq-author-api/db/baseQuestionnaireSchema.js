const id = {
  type: String,
  required: true,
};

const isPublic = {
  type: Boolean,
  required: true,
};

const title = {
  type: String,
};

const createdBy = {
  type: String,
};

const createdAt = {
  type: String,
  required: true,
};

const type = {
  type: String,
};

const shortTitle = {
  type: String,
  required: true,
};

const publishStatus = {
  type: String,
  required: true,
};

const introduction = {
  type: Object,
};

const editors = {
  type: Array,
};

const locked = {
  type: Boolean,
};

const baseQuestionnaireFields = {
  id,
  isPublic,
  title,
  createdBy,
  createdAt,
  type,
  shortTitle,
  publishStatus,
  introduction,
  editors,
  locked,
};

module.exports = {
  baseQuestionnaireFields,
  ...baseQuestionnaireFields,
};
