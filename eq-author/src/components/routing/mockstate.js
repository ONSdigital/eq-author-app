export default [
  {
    title: "1. Integer posuere erat a ante",
    displayName: "1. Integer posuere erat a ante",
    pages: [
      {
        title: "1.1 Curabitur blandit tempus porttitor",
        displayName: "1.1 Curabitur blandit tempus porttitor",
        pageType: "QuestionPage",
        options: [
          { label: "Bibendum Cras", id: "3", selected: false },
          { label: "Aenean Quam Venenatis Elit", id: "4", selected: false },
          { label: "Purus Ornare Ipsum", id: "5", selected: false },
          { label: "Nibh", id: "6", selected: false },
          { label: "Risus Mattis Magna Bibendum", id: "7", selected: false },
          {
            label: "Consectetur Ultricies Purus Elit Fermentum",
            id: "8",
            selected: false
          }
        ],
        id: "2",
        disabled: false
      },
      {
        title: "1.2 Nulla vitae elit libero, a pharetra augue.",
        displayName: "1.2 Nulla vitae elit libero, a pharetra augue.",
        pageType: "QuestionPage",
        options: [
          { label: "Yes", id: "10", selected: false },
          { label: "No", id: "11", selected: false }
        ],
        id: "9",
        disabled: false
      }
    ],
    id: "1"
  }
];
