import { readToWriteMapper } from "./builder";
import {
  CUSTOM,
  METADATA,
  PREVIOUS_ANSWER
} from "constants/validation-entity-types";

describe("Date validation builder", () => {
  describe("readToWriteMapper", () => {
    it("should map from the read to write structure for custom date", () => {
      const mapper = readToWriteMapper("earliestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: "12/05/1987",
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: CUSTOM
        })
      ).toEqual({
        id: 1,
        earliestDateInput: {
          custom: "12/05/1987",
          previousAnswer: null,
          metadata: null,
          entityType: CUSTOM,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before"
        }
      });
    });

    it("should map from the read to write structure for previous answer", () => {
      const mapper = readToWriteMapper("earliestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: null,
          previousAnswer: { id: "1", displayName: "foobar" },
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: PREVIOUS_ANSWER
        })
      ).toEqual({
        id: 1,
        earliestDateInput: {
          custom: null,
          previousAnswer: "1",
          metadata: null,
          entityType: PREVIOUS_ANSWER,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before"
        }
      });
    });

    it("should map from the read to write structure for metadata", () => {
      const mapper = readToWriteMapper("earliestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: null,
          previousAnswer: null,
          metadata: { id: "1", displayName: "foobar" },
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: METADATA
        })
      ).toEqual({
        id: 1,
        earliestDateInput: {
          custom: null,
          previousAnswer: null,
          metadata: "1",
          entityType: METADATA,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before"
        }
      });
    });

    it("should null custom date when different entity type", () => {
      const mapper = readToWriteMapper("earliestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: "12/12/2000",
          previousAnswer: { id: "1", displayName: "foobar" },
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: PREVIOUS_ANSWER
        })
      ).toMatchObject({
        id: 1,
        earliestDateInput: {
          custom: null,
          previousAnswer: "1",
          entityType: PREVIOUS_ANSWER
        }
      });
    });

    it("should null previous answer when different entity type", () => {
      const mapper = readToWriteMapper("earliestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: "12/12/2000",
          previousAnswer: { id: "1", displayName: "foobar" },
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: CUSTOM
        })
      ).toMatchObject({
        id: 1,
        earliestDateInput: {
          custom: "12/12/2000",
          previousAnswer: null,
          entityType: CUSTOM
        }
      });
    });

    it("should send null when the custom date is empty", () => {
      const mapper = readToWriteMapper("latestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: "",
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: CUSTOM
        })
      ).toEqual({
        id: 1,
        latestDateInput: {
          custom: null,
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          entityType: CUSTOM
        }
      });
    });

    it("should not get previous answer id when previous answer is null", () => {
      const mapper = readToWriteMapper("latestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: null,
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: PREVIOUS_ANSWER
        })
      ).toEqual({
        id: 1,
        latestDateInput: {
          custom: null,
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          entityType: PREVIOUS_ANSWER
        }
      });
    });

    it("should not get metadata id when metadata is null", () => {
      const mapper = readToWriteMapper("latestDateInput");
      expect(
        mapper({
          id: 1,
          customDate: null,
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          enabled: true,
          entityType: METADATA
        })
      ).toEqual({
        id: 1,
        latestDateInput: {
          custom: null,
          previousAnswer: null,
          metadata: null,
          offset: {
            unit: "Months",
            value: 1
          },
          relativePosition: "Before",
          entityType: METADATA
        }
      });
    });
  });
});
