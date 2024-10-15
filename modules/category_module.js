import Category from "../../classes/Category.js";

export const categories = new Map();

const mapFiller = (data) => {
  for (let item of data) {
    let tmpProduct = new Category(item.id, item.name, item.description);

    const option = document.createElement("option");
    option.innerText = tmpProduct.name;
    option.value = tmpProduct.id;
    categories.set(tmpProduct.id, tmpProduct);
    document.querySelector("#categoryList").append(option);
  }
};

load("http://127.0.0.1:5500/const/category_data.json", mapFiller);
