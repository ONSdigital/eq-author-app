const scrollIntoView = node =>
  node.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start"
  });

export default scrollIntoView;
