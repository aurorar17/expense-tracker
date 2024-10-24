import Category from "../../classes/Category.js";

export const userFiller = (data) => {
  const localStorageUser = JSON.parse(localStorage.getItem("user"));

  const fname = localStorageUser?.fname || data.fname;
  const lname = localStorageUser?.lname || data.lname;
  const email = localStorageUser?.email || data.email;
  const phone = localStorageUser?.phone || data.phone;
  const image = localStorageUser?.image || data.image;

  document.querySelector("#user-name").innerHTML = fname + " " + lname;
  const lElement = document.querySelector("#lname");
  if (lElement && localStorageUser) {
    lElement.innerHTML = localStorageUser.lname || lname;
  } else {
    console.error("Element or localStorageUser is not defined");
  }
  const fElement = document.querySelector("#fname");
  if (fElement && localStorageUser) {
    fElement.innerHTML = localStorageUser.fname || fname;
  } else {
    console.error("Element or localStorageUser is not defined");
  }
  const emailElement = document.querySelector("#email");
  if (emailElement && localStorageUser) {
    emailElement.innerHTML = localStorageUser.email || email;
  } else {
    console.error("Element or localStorageUser is not defined");
  }
  const pElement = document.querySelector("#phone");
  if (pElement && localStorageUser) {
    pElement.innerHTML = localStorageUser.phone || phone;
  } else {
    console.error("Element or localStorageUser is not defined");
  }
  const uImgElement = document.querySelector("#user-image");
  if (uImgElement && localStorageUser) {
    uImgElement.src = localStorageUser.image || image;
  } else {
    console.error("Element or localStorageUser is not defined");
  }

  delete data.password;

  localStorage.setItem("user", JSON.stringify(localStorageUser || data));
};

const categoryMapFiller = (data) => {
  const localStorageCategories = JSON.parse(localStorage.getItem("categories"));
  const categories = [];

  const tableBody = document.querySelector("#categoryTable tbody");
  data.forEach((item) => {
    const targetCategory = localStorageCategories?.find(
      (c) => c.id === item.id
    );
    let tmpProduct = new Category(
      item.id,
      item.name,
      item.description,
      item.limit
    );

    const category = JSON.parse(JSON.stringify(tmpProduct));
    categories.push(category);

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = category.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = category.name;
    row.appendChild(nameCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = category.description;
    row.appendChild(descriptionCell);

    const limitCell = document.createElement("td");
    limitCell.textContent = targetCategory?.limit || category.limit;
    limitCell.addEventListener("click", (e) => {
      const input = document.createElement("input");
      const currentValue = e.target.textContent;
      input.value = currentValue;

      limitCell.innerHTML = "";
      limitCell.appendChild(input);
      input.focus();

      input.onblur = function () {
        const newValue = input.value;
        limitCell.textContent = newValue;
        const filterCategories = localStorageCategories.filter(
          (c) => c.id !== item.id
        );
        targetCategory.limit = Number(newValue);
        filterCategories.push(targetCategory);
        localStorage.setItem("categories", JSON.stringify(filterCategories));
      };
    });
    row.appendChild(limitCell);

    if (tableBody) {
      tableBody.appendChild(row);
    } else {
      console.error("no table");
    }
  });

  localStorage.setItem(
    "categories",
    JSON.stringify(localStorageCategories || categories)
  );
};

load("http://127.0.0.1:5500/const/user_data.json", userFiller);
load("http://127.0.0.1:5500/const/category_data.json", categoryMapFiller);
