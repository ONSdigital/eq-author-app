import config from "config";

export const enableOn = (flags) => {
  const enabledFlags = config.REACT_APP_FEATURE_FLAGS.split(",");
  console.log("config.REACT_APP_FEATURE_FLAGS", config.REACT_APP_FEATURE_FLAGS);

  const displayFeature = flags.every((flag) => enabledFlags.includes(flag));

  return displayFeature;
};

export const disableOn = (flags) => !enableOn(flags);
