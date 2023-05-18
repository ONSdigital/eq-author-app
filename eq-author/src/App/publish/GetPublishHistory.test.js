import React from "react";
import { render, screen } from "@testing-library/react";

import PublishHistory, { formatDate } from "./GetPublishHistory";

const emptyCirReturn = [];
const validCirReturn = [
  {
    ci_version: 5,
    data_version: "0.0.1",
    form_type: "0005",
    id: "fcc74c4f-400b-430c-8a77-b18bff92332c",
    language: "en",
    published_at: "2023-05-09T07:25:29.342666Z",
    schema_version: "0.0.1",
    status: "DRAFT",
    survey_id: "134",
    title: "What is most important in data structures.",
  },
  {
    ci_version: 4,
    data_version: "0.0.1",
    form_type: "0005",
    id: "bd780acf-6c8f-436c-8bcc-501627536b53",
    language: "en",
    published_at: "2023-05-09T07:25:28.564217Z",
    schema_version: "0.0.1",
    status: "DRAFT",
    survey_id: "134",
    title: "What is most important in data structures.",
  },
  {
    ci_version: 3,
    data_version: "0.0.1",
    form_type: "0005",
    id: "0fe75d47-face-44c9-b511-7a31ea067e59",
    language: "en",
    published_at: "2023-05-09T07:25:26.229856Z",
    schema_version: "0.0.1",
    status: "DRAFT",
    survey_id: "134",
    title: "What is most important in data structures.",
  },
  {
    ci_version: 2,
    data_version: "0.0.1",
    form_type: "0005",
    id: "284ee417-67d1-4715-a020-d3db24c2e751",
    language: "en",
    published_at: "2023-05-09T07:25:25.044209Z",
    schema_version: "0.0.1",
    status: "DRAFT",
    survey_id: "134",
    title: "What is most important in data structures.",
  },
  {
    ci_version: 1,
    data_version: "0.0.1",
    form_type: "0005",
    id: "a3e2d8d0-806e-4562-ae7b-d30ef129328e",
    language: "en",
    published_at: "2023-05-09T07:25:13.209653Z",
    schema_version: "0.0.1",
    status: "DRAFT",
    survey_id: "134",
    title: "What is most important in data structures.",
  },
];

describe("Test empty return", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(emptyCirReturn),
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("Should return no data text", async () => {
    render(<PublishHistory />);
    const text = await screen.findByTestId("no-published-versions-text");
    expect(text.textContent).toBe(
      "No versions of this questionnaire have been published"
    );
  });
});

describe("Test valid return", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(validCirReturn),
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("Should return history table and not no data message", async () => {
    render(<PublishHistory />);
    const table = await screen.findByTestId("history-table");
    expect(table).toBeTruthy();

    const text = screen.queryByTestId("no-published-versions-text");
    expect(text).not.toBeInTheDocument();
  });
});

// describe("Test date time conversation", () => {
//     it('Should convert a timestamp to human readble date time format', () => {
//         expect(formatDate('2023-05-09T07:25:29.342666Z')).toBe('09/05/2023 at 08:25:29');
//     });
// });
