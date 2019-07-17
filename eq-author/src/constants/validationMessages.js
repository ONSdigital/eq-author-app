export default {
  ERR_VALID_REQUIRED: ({ label }) => `${label} is required`,
  ERR_UNIQUE_REQUIRED: ({ label }) => `${label} must be unique`,
  ERR_REQUIRED_WHEN_SETTING: ({ message }) => message,
};
