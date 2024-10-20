const btCreator = (label) => {
  let btn = document.createElement("button");
  btn.innerText = label;

  return btn;
};

const tdCreator = (node) => {
  let td = document.createElement("td");
  td.append(node);

  return td;
};

const divCreator = (node) => {
  let div = document.createElement("div");
  div.append(node);

  return div;
};
