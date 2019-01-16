const AWS = jest.genMockFromModule("aws-sdk");

let secretValueToReturn;
let shouldError = false;

AWS.__setSecretValue = function(secretValue) {
  secretValueToReturn = secretValue;
};

AWS.__setShouldError = function(error) {
  shouldError = error;
};

AWS.SecretsManager = function() {
  const getSecretValue = function() {
    const promise = function() {
      if (shouldError) {
        throw Error("Failed");
      }
      return {
        SecretString: secretValueToReturn,
      };
    };

    return {
      promise,
    };
  };

  return {
    getSecretValue,
  };
};

module.exports = AWS;
