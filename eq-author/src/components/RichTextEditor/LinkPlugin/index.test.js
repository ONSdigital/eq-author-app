import React from "react";
import { render, screen, waitFor, fireEvent, cleanup } from "tests/utils/rtl";
import RichTextEditor from "../";
import { EditorState, ContentState } from "draft-js";
import LinkToolbarButton from "./ToolbarButton";
import { linkToHTML, linkFromHTML, ENTITY_TYPE as LINK_TYPE } from ".";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("componentWillMount has been renamed", "warn");
suppressConsoleMessage("componentWillReceiveProps has been renamed", "warn");

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

describe("Link plugin for RichTextEditor", () => {
  describe("user interactions", () => {
    let toolbarButton;

    const getInsertButton = () =>
      screen.getByRole("button", { name: "Insert", hidden: true });
    const getInputFields = () => ({
      textInput: screen.getByLabelText("Text"),
      urlInput: screen.getByLabelText("Link"),
    });

    beforeEach(() => {
      render(
        <RichTextEditor
          controls={{ link: true }}
          onUpdate={() => true}
          label="test editor"
          id="test_editor"
          name="test_editor"
          value="Existing editor text"
        />
      );

      toolbarButton = screen.getByRole("button", { name: /insert link/i });

      // Focus the editor - otherwise all controls are disabled
      screen.getByRole("textbox", { name: /test editor/i }).focus();
    });

    it("should show enabled link button when controls.link set to true", async () => {
      expect(toolbarButton).not.toHaveAttribute("disabled");
    });

    it("should initially not show modal", () => {
      let textInput = screen.queryByLabelText("Text");
      let urlInput = screen.queryByLabelText("Link");
      expect(textInput).toBeNull();
      expect(urlInput).toBeNull();
    });

    it("should open modal when button pushed", async () => {
      // Click button...
      fireEvent.click(toolbarButton);

      let textInput, urlInput;
      await waitFor(() => {
        ({ textInput, urlInput } = getInputFields());
      });

      expect(urlInput).toBeVisible();
      expect(textInput).toBeVisible();
    });

    it("should disable Insert button when URL not entered", async () => {
      fireEvent.click(toolbarButton);

      let insertButton;
      await waitFor(() => {
        insertButton = getInsertButton();
      });

      expect(insertButton).toBeDisabled();
    });

    it("should allow creating a link using the modal", async () => {
      fireEvent.click(toolbarButton);

      let textInput, urlInput;
      await waitFor(() => {
        ({ textInput, urlInput } = getInputFields());
      });

      const linkText = "Example link";
      const linkHref = "http://www.example.com/";

      fireEvent.change(textInput, { target: { value: linkText } });
      fireEvent.change(urlInput, { target: { value: linkHref } });
      fireEvent.click(getInsertButton());

      let link;
      await waitFor(() => {
        link = screen.getByRole("link", { name: linkText });
      });

      expect(link.href).toBe(linkHref);
    });

    it("should pre-populate the link text in the modal when text selected in the editor", async () => {
      const dummyText = "Hello, world!";

      let dummyState = EditorState.createWithContent(
        ContentState.createFromText(dummyText)
      );
      const content = dummyState.getCurrentContent();
      const selection = dummyState.getSelection();
      const firstBlockKey = content.getBlockMap().first().getKey();
      const lastBlock = content.getBlockMap().last();
      const lastBlockKey = lastBlock.getKey();
      const lengthOfLastBlock = lastBlock.getLength();

      dummyState = EditorState.forceSelection(
        dummyState,
        selection.merge({
          anchorKey: firstBlockKey,
          anchorOffset: 0,
          focusKey: lastBlockKey,
          focusOffset: lengthOfLastBlock,
        })
      );

      cleanup();
      const { getByRole, getByLabelText } = render(
        <LinkToolbarButton
          editorState={dummyState}
          canFocus
          onLinkChosen={() => true}
        />
      );

      fireEvent.click(getByRole("button"));

      let textInput;
      await waitFor(() => {
        textInput = getByLabelText("Text");
      });

      expect(textInput).toHaveValue(dummyText);
    });
  });

  describe("HTML conversions", () => {
    let linkText, linkUrl;
    beforeEach(() => {
      linkUrl = "http://www.example.com/";
      linkText = "Super example link";
    });

    it("should process html into LINK entity", () => {
      const nodeName = "a";
      const node = document.createElement(nodeName);
      node.href = linkUrl;
      node.innerText = linkText;

      const createEntity = jest.fn();
      linkFromHTML[nodeName](nodeName, node, createEntity);

      expect(createEntity).toHaveBeenCalledWith("LINK", "IMMUTABLE", {
        url: linkUrl,
      });
    });

    it("should convert LINK entities into HTML", () => {
      const entity = {
        data: { url: linkUrl },
      };

      render(linkToHTML[LINK_TYPE](entity, linkText));

      const createdLink = screen.getByRole("link", { name: linkText });

      expect(createdLink.href).toBe(linkUrl);
    });
  });
});
