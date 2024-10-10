import Expense from "../../classes/Expense.js";

const mapFiller = (data) => {
  for (let item of data) {
    let tmpProduct = new Expense(
      item.id,
      item.title,
      item.amount,
      item.category,
      item.description,
      item.date
    );

    const tr = document.createElement("li");
    tr.innerText = tmpProduct.title;
    document.querySelector("ul").append(tr);
  }
};

load("http://127.0.0.1:5500/const/expense_data.json", mapFiller);
