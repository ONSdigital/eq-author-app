export const enableOn = (flags) => {
  const enabledFlags = process.env.REACT_APP_FEATURE_FLAGS.split(" ");

  const displayFeature = flags.every((flag) => enabledFlags.includes(flag));

  return displayFeature;
};

export const disableOn = (flags) => !enableOn(flags);
