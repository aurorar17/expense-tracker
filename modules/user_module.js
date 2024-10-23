import Category from "../../classes/Category.js";
export const categories = new Map();

const mapFiller = (data) => {
  document.querySelector("#user-name").innerHTML =
    data.fname + " " + data.lname;
  //   document.querySelector("#user-email").innerHTML = data.email;
};

const categoryMapFiller = (data) => {
  for (let item of data) {
    let tmpProduct = new Category(item.id, item.name, item.description, item.limit);

    const li = document.createElement("li");
    li.innerHTML = `<div>${tmpProduct.name}</div><div>${tmpProduct.description}</div><div>${tmpProduct.limit}</div>`;
    categories.set(tmpProduct.id, tmpProduct);
    document.querySelector("#bankInformationSection").append(li);
  }
};

load("http://127.0.0.1:5500/const/user_data.json", mapFiller);
load("http://127.0.0.1:5500/const/category_data.json", categoryMapFiller);
