import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import { useQuery } from "@apollo/react-hooks";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import Icon from "assets/icon-select.svg";
import Loading from "components/Loading";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  margin-left: 0;
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0.3rem;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-size: 0.85em;
`;

const Description = styled.p`
  margin-top: 0.3rem;
  margin-left: 0;
  font-size: 0.85em;
  margin-bottom: 0.5em;
`;

const SummaryLabel = styled.label`
  margin-top: 0s;
  margin-bottom: 1.5rem;
  margin-left: 0;
  font-weight: bold;
`;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 2px solid #d6d8da;
  border-radius: 4px;
  appearance: none;
  background: white url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 30%;
  margin-bottom: 1rem;

  &:hover {
    outline: none;
  }
`;

const RepeatingSection = ({ section, handleUpdate }) => {
  const { loading, data } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }
  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }

  return (
    <>
      <SummaryLabel>Repeating section</SummaryLabel>
      <Caption>
        When repeating sections are linked to a collection list, each selected
        item from the list forms a section on the Hub. The repeating section is
        used to ask the same questions for each item selected.
      </Caption>
      <InlineField>
        <Label htmlFor="repeating-section">Repeating section</Label>
        <ToggleWrapper>
          <ToggleSwitch
            id="repeatingSection"
            name="repeatingSection"
            data-test="repeating-section"
            hideLabels={false}
            onChange={handleUpdate}
            checked={section?.repeatingSection}
          />
        </ToggleWrapper>
      </InlineField>
      {section?.repeatingSection && (
        <>
          <Label htmlFor="repeatingSectionlistId">Linked collection list</Label>
          <CustomSelect
            id="repeatingSectionlistId"
            name="repeatingSectionlistId"
            data-test="list-select"
            onChange={({ target }) => {
              handleUpdate({
                name: "repeatingSectionlistId",
                value: target.value,
              });
            }}
            value={section?.repeatingSectionlistId}
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
          </CustomSelect>
          <Label htmlFor="repeatingSectiontitle">Hub section label</Label>
          <Description>
            This is how the label for each item in the collection list will
            appear in the Hub.
          </Description>
          <RichTextEditor
            id="repeatingSectionTitle"
            name="repeatingSectionTitle"
            onUpdate={handleUpdate}
            size="large"
            testSelector="txt-repeating-section-title"
            value={section?.repeatingSectionTitle}
            controls={{ piping: true }}
          />
        </>
      )}
    </>
  );
};

RepeatingSection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  section: PropTypes.object,
  onChange: PropTypes.func,
  onUpdate: PropTypes.func,
  handleUpdate: PropTypes.func,
};

export default RepeatingSection;
