const verifyPublisherRequest = require("../utils/verifyPublisherRequest");

describe("verifyPublisherRequest", () => {
  it("should throw if the key is not verified", () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiUHVibGlzaGVyIiwibmFtZSI6IlB1Ymxpc2hlciIsImVtYWlsIjoiZXEudGVhbUBvbnMuZ292LnVrIiwicGljdHVyZSI6IiIsImlhdCI6MTU1MzA4OTU5NH0.qNdMN4JsTOGCNp6uniAOYH-cqPp0lGevJC_12ZFNUbA";
    verifyPublisherRequest(invalidToken);
  });
  it("return on a successful verification", () => {
    const validToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiUHVibGlzaGVyIiwiaWF0IjoxNTUzMDg5NTA5fQ.T9hBwMmF9o-6Gvf4dEgm4ybM6gNf1Z56858ru7PY_MxkUqVhkQJ34u4OJitBEyZjI6e_78cvnJ0Jmtu5IZxyFnwOMMHFTomiaKEeJuhc51-PyqiZFkC5hxGlmYrfP1y8W1kKqvKO_sLnAT5wx_wOGcWDj5QNz0RjJ8dmFdWB0FrGXSZeXeBn6ySduuw6lvBzGs4-VcO8lB9SZHHEUAd3bYtqbyFWLHXBl9wSZnNp-Mix7EWC6D8VVYIeg3PyW-SDgwpLt6fBvhSIJdJpx-8ln3Xq6Nwdohz35SyYMQ6A7TTBfbYT-R7IgPcKm8nRG7ErSczXKoagWkcE_B_j4J3hsw";
    verifyPublisherRequest(validToken);
  });
});
