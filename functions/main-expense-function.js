function updateTable() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const tableBody = document.querySelector("#transactionTable tbody");
    tableBody.innerHTML = "";

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.slice(0, 10).forEach((expense) => {
      const newRow = document.createElement("tr");

      if (expense.income === "income") {
        newRow.classList.add("transIncome");
      } else if (expense.income === "expense") {
        newRow.classList.add("transExpense");
      }

      newRow.innerHTML = `
        <td></td>
        <td>${expense.date}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td>${
          expense.cost !== undefined && expense.cost !== null
            ? expense.cost.toFixed(2)
            : "0.00"
        }</td>
      `;
      tableBody.appendChild(newRow);
    });

    updateBalances(expenses);
}


function updateBalances() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    // calculate of total income & total expense for total balance
    const totalIncome = expenses
      .filter((expense) => expense.income === "income")
      .reduce((sum, income) => sum + (income.cost || 0), 0);
  
    const totalExpense = expenses
      .filter((expense) => expense.income === "expense")
      .reduce((sum, expense) => sum + (expense.cost || 0), 0);
  
    const totalBalance = totalIncome - totalExpense;
  
    // Filtering of current Month
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      );
    });
  
    // calculate of current Income & Expense according to Filtering
    const currentMonthIncome = currentMonthExpenses
      .filter((expense) => expense.income === "income")
      .reduce((sum, income) => sum + (income.cost || 0), 0);
  
    const currentMonthExpense = currentMonthExpenses
      .filter((expense) => expense.income === "expense")
      .reduce((sum, expense) => sum + (expense.cost || 0), 0);
  
    document.querySelector(".current-box h1").textContent = `$ ${totalBalance.toFixed(2)}`;
    document.querySelector(".monthlyExpense .income h2").textContent = `$ ${currentMonthIncome.toFixed(2)}`;
    document.querySelector(".monthlyExpense .expense h2").textContent = `$ ${currentMonthExpense.toFixed(2)}`;
  }
  
  // 함수를 호출하여 값을 업데이트
  updateBalances();
  




  updateTable();


