function addExpense() {
  fetch("/pages/add-expense/index.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#inputFormArea").innerHTML = data;

      import("/modules/category_module.js").then(({ categories }) => {
        document.getElementById("inputForm").addEventListener("submit", (e) => {
          e.preventDefault();

          const income = document.querySelector("#income").value;
          const category = document.querySelector("#categoryList").value;
          const date = document.querySelector("input[type=date]").value;
          const description = document.querySelector("#description").value;
          const cost =
            parseFloat(document.querySelector("input[type=number]").value) || 0;
          const categoryName = categories.get(Number(category)).name;

          let expenses = JSON.parse(localStorage.getItem("expense")) || [];
          const lastExpense = expenses.slice(-1)[0];
          const id = lastExpense ? lastExpense.id + 1 : 1;

          const newExpense = {
            id,
            income,
            category: categoryName,
            date,
            description,
            cost,
          };

          expenses.push(newExpense);
          localStorage.setItem("expense", JSON.stringify(expenses));

          document.getElementById("inputForm").reset();

          alert("Expense added successfully!");

          updateTable();
        });
      });
    });
}

function updateTable() {
  let expenses = JSON.parse(localStorage.getItem("expense")) || [];
  const tableBody = document.querySelector("#transactionTable");
  tableBody.innerHTML = "";

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  expenses.forEach((expense) => {
    const newRow = document.createElement("div");
    newRow.className = "row-container";

    if (expense.income === "income") {
      newRow.classList.add("transIncome");
    } else if (expense.income === "expense") {
      newRow.classList.add("transExpense");
    }

    let deleteBtn = btCreator("Delete");
    let editBtn = btCreator("Edit");
    deleteBtn.value = expense.id;
    editBtn.value = expense.id;

    deleteBtn.addEventListener("click", (e) => {
      const currentTarget = e.target.value;

      expenses = expenses.filter(
        (expense) => expense.id !== Number(currentTarget)
      );
      localStorage.setItem("expense", JSON.stringify(expenses));

      updateTable();
    });

    const editModal = document.createElement("div");
    editModal.classList.add("popover");
    editModal.innerHTML = `
      <h3>Edit Expense</h3>
      <div class="category-list">
        <label for="category">Category</label>
        <div class="category-value">${expense.category}</div>
      </div>
      <div class="category-list">
        <label for="description">Description</label>
        <input class="category-value" type="text" id="editDescription" value="${expense.description}">
      </div>
      <div class="category-list">
        <label for="cost">Cost</label>
        <input class="category-value" type="number" id="editCost" value="${expense.cost}">
      </div>
      <button id="saveChanges">Save</button>
    `;

    editBtn.addEventListener("click", (e) => {
      if (editModal.classList.contains("show")) {
        editModal.classList.remove("show");
      } else {
        document.querySelectorAll(".popover.show").forEach((popover) => {
          popover.classList.remove("show");
        });

        editModal.classList.add("show");
        const rect = editBtn.getBoundingClientRect();
        editModal.style.top = `${rect.bottom + window.scrollY}px`;
        editModal.style.left = `${rect.left + window.scrollX}px`;
      }
    });

    editModal.querySelector("#saveChanges").addEventListener("click", () => {
      const updatedDescription =
        editModal.querySelector("#editDescription").value;
      const updatedCost = parseFloat(
        editModal.querySelector("#editCost").value
      );

      expense.description = updatedDescription;
      expense.cost = updatedCost;

      localStorage.setItem("expense", JSON.stringify(expenses));
      updateTable();
      editModal.classList.remove("show");
    });

    newRow.innerHTML = `
        <div class="left-side">
            <img class="category-img" src=${`/img/Categories/${expense.category}.svg`} />
            <div class="content-container">
                <div class="title-container">
                    <div>Title</div>
                    <div class="date">${expense.date}</div>
                </div>
                <div class="description">${expense.description}</div>
            </div>
            <div class="expense-price ${
              expense.income === "income" ? "income" : "expense"
            }">${expense.income === "income" ? "+" : "-"}$${
      expense.cost !== undefined && expense.cost !== null
        ? expense.cost.toFixed(2)
        : "0.00"
    }</div>
        </div>
      `;
    const div = document.createElement("div");
    div.append(editBtn, deleteBtn);
    div.className = "option-btn";
    newRow.append(div);
    tableBody.append(editModal);
    tableBody.appendChild(newRow);
  });
}

