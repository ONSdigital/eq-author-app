const dropDatatypeFieldFromPipedValues = require("./dropDatatypeFieldFromPipedValues.js");

describe("dropDatatypeFieldFromPipedValues", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          randomNum: 100,
          introductionTitle:
            '<p>Intro content <span data-piped="answers" data-id="a06d223f-667a-45d4-85ce-22a9d8ff07d8" data-type="Currency">[Revenue 2018]</span></p>',
          introductionContent:
            '<p>Section 2 intro <span data-piped="answers"data-id="a06d223f-667a-45d4-85ce-22a9d8ff07d8"data-type="Currency">[Revenue 2018]</span></p>',
          pages: [
            {
              title:
                '<p>How much of <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588"data-type="Currency">[Revenue 2018]</span> was sales?</p>',
            },
          ],
        },
        {
          pages: [
            {
              randomBool: true,
              title:
                '<p>Revenue was <span data-piped="answers"data-id="2dfcd4f9-4d54-4a28-984a-4fbc8ec2ef38"data-type="Currency">[Your revenue]</span> and sold cars was <span data-piped="answers"data-id="88b3930f-5d15-432e-a7e9-04a33f6a5aaa"data-type="Number">[Sold cars]</span></p>',
              description:
                '<p>Question description <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588"data-type="Currency">[Revenue 2018]</span></p>',
              guidance:
                '<p>Include/exclude <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588"data-type="Currency">[Revenue 2018]</span></p>',
              additionalInfoContent:
                '<p>Additional info content <span data-piped="answers"data-id="6e4cb076-a6f9-4f27-90c5-db5f93ffada1"data-type="Currency">[Revenue 2018]</span></p>',
              confirmation: {
                title:
                  '<p>Confirmation question <span data-piped="answers"data-id="9bb4c3ad-3882-45cc-a824-bb832a6e4b34"data-type="Currency">[Sales 2018]</span></p>',
              },
            },
            {
              totalTitle:
                '<p>Total title <span data-piped="answers"data-id="6134"data-type="Currency">[Value at start of period]</span></p>',
            },
          ],
        },
      ],
    };
  });
  it("should remove data-type from span in title", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[0].pages[0].title).toEqual(
      '<p>How much of <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588">[Revenue 2018]</span> was sales?</p>'
    );
  });
  it("should remove data-type from span in description", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[0].description).toEqual(
      '<p>Question description <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588">[Revenue 2018]</span></p>'
    );
  });
  it("should remove data-type from span in guidance", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[0].guidance).toEqual(
      '<p>Include/exclude <span data-piped="answers"data-id="b4a52321-b404-473f-a459-c50b57cf1588">[Revenue 2018]</span></p>'
    );
  });
  it("should remove data-type from span in two piped values", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[0].title).toEqual(
      '<p>Revenue was <span data-piped="answers"data-id="2dfcd4f9-4d54-4a28-984a-4fbc8ec2ef38">[Your revenue]</span> and sold cars was <span data-piped="answers"data-id="88b3930f-5d15-432e-a7e9-04a33f6a5aaa">[Sold cars]</span></p>'
    );
  });
  it("should remove data-type from span in introductionTitle", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[0].introductionTitle).toEqual(
      '<p>Intro content <span data-piped="answers" data-id="a06d223f-667a-45d4-85ce-22a9d8ff07d8">[Revenue 2018]</span></p>'
    );
  });
  it("should remove data-type from span in introductionContent", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[0].introductionContent).toEqual(
      '<p>Section 2 intro <span data-piped="answers"data-id="a06d223f-667a-45d4-85ce-22a9d8ff07d8">[Revenue 2018]</span></p>'
    );
  });
  it("should remove data-type from span in additionalInfoContent", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[0].additionalInfoContent).toEqual(
      '<p>Additional info content <span data-piped="answers"data-id="6e4cb076-a6f9-4f27-90c5-db5f93ffada1">[Revenue 2018]</span></p>'
    );
  });
  it("should remove data-type from span in confirmation question", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[0].confirmation.title).toEqual(
      '<p>Confirmation question <span data-piped="answers"data-id="9bb4c3ad-3882-45cc-a824-bb832a6e4b34">[Sales 2018]</span></p>'
    );
  });
  it("should remove data-type from span in summary question", () => {
    const result = dropDatatypeFieldFromPipedValues(questionnaire);
    expect(result.sections[1].pages[1].totalTitle).toEqual(
      '<p>Total title <span data-piped="answers"data-id="6134">[Value at start of period]</span></p>'
    );
  });
});
