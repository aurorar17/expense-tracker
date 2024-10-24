import Category from "../../classes/Category.js";

export const userFiller = (data) => {
  const localStorageUser = JSON.parse(localStorage.getItem("user"));

  const fname = localStorageUser?.fname || data.fname;
  const lname = localStorageUser?.lname || data.lname;
  const email = localStorageUser?.email || data.email;
  const phone = localStorageUser?.phone || data.phone;

  document.querySelector("#user-name").innerHTML = fname + " " + lname;
  document.querySelector("#lname").innerHTML = localStorageUser?.lname || lname;
  document.querySelector("#fname").innerHTML = fname;
  document.querySelector("#email").innerHTML = email;
  document.querySelector("#phone").innerHTML = phone;

  delete data.password;

  localStorage.setItem("user", JSON.stringify(localStorageUser || data));
};

const categoryMapFiller = (data) => {
  const localStorageCategories = JSON.parse(localStorage.getItem("categories"));
  const categories = [];

  for (let item of data) {
    let tmpProduct = new Category(
      item.id,
      item.name,
      item.description,
      item.limit
    );

    const li = document.createElement("li");
    li.innerHTML = `<div>${tmpProduct.name}</div><div>${tmpProduct.description}</div><div>${tmpProduct.limit}</div>`;
    const category = JSON.parse(JSON.stringify(tmpProduct));
    categories.push(category);
    document.querySelector("#bankInformationSection").append(li);
  }

  localStorage.setItem(
    "categories",
    JSON.stringify(localStorageCategories || categories)
  );
};

load("http://127.0.0.1:5500/const/user_data.json", userFiller);
load("http://127.0.0.1:5500/const/category_data.json", categoryMapFiller);
