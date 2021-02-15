import jwt from "jsonwebtoken";
import config from "config";

const url = `https://securetoken.googleapis.com/v1/token?key=${config.REACT_APP_FIREBASE_API_KEY}`;

const fetchNewToken = (refreshToken) =>
  window
    .fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    })
    .then((response) => response.json());

const getQuestionnaireId = () => {
  const hash = window.location.hash;
  const matches = /#\/q\/([0-9a-zA-Z-_]+)\/?/.exec(hash);
  if (matches && matches.length > 1) {
    return matches[1];
  }
};

export default (headers) => {
  const accessToken = localStorage.getItem("accessToken");

  const returnedHeaders = {
    ...headers,
  };

  if (!accessToken) {
    return returnedHeaders;
  }

  const questionnaireId = getQuestionnaireId();
  if (questionnaireId) {
    returnedHeaders.questionnaireId = questionnaireId;
  }

  const decodedToken = jwt.decode(accessToken);

  if (decodedToken.exp < Math.floor(Date.now()) / 1000 || !decodedToken.name) {
    const refreshToken = localStorage.getItem("refreshToken");
    return fetchNewToken(refreshToken).then((res) => {
      localStorage.setItem("refreshToken", res.refresh_token);
      localStorage.setItem("accessToken", res.access_token);
      returnedHeaders.authorization = `Bearer ${res.access_token}`;
      return { ...returnedHeaders };
    });
  }

  returnedHeaders.authorization = `Bearer ${accessToken}`;

  return returnedHeaders;
};
