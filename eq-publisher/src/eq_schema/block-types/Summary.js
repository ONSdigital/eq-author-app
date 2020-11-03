class Summary {
  constructor({ collapsible }) {
    this.id = "summary-group";
    this.title = "Summary";

    const summaryBlock = {
      type: "Summary",
      id: "summary-block",
    };
    if (collapsible) {
      summaryBlock.collapsible = true;
    }

    this.blocks = [summaryBlock];
  }
}

module.exports = Summary;
