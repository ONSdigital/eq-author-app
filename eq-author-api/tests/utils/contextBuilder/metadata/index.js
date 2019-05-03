const { createMetadata, createMetadataMutation } = require("./createMetadata");
const { updateMetadata, updateMetadataMutation } = require("./updateMetadata");
const { queryMetadata, queryMetadataMutation } = require("./queryMetadata");
const { deleteMetadata, deleteMetadataMutation } = require("./deleteMetadata");

module.exports = {
  createMetadata,
  createMetadataMutation,
  updateMetadata,
  updateMetadataMutation,
  queryMetadata,
  queryMetadataMutation,
  deleteMetadata,
  deleteMetadataMutation,
};
