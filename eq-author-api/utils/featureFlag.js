const enableOn = (flags) => {
  const featureFlagsInfo = process.env.FEATURE_FLAGS || "";

  const enabledFlags = featureFlagsInfo.split(",");

  const displayFeature = flags.every((flag) => enabledFlags.includes(flag));

  return displayFeature;
};

const disableOn = (flags) => !enableOn(flags);

module.exports = {
  enableOn,
  disableOn,
};
