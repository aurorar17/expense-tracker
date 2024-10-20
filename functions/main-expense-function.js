// change the date format yyyy-mm-dd -> mm/dd
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

function updateTable() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const tableBody = document.querySelector("#transactionTable tbody");
    tableBody.innerHTML = "";

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.slice(0, 15).forEach((expense) => {
      const newRow = document.createElement("tr");

      if (expense.income === "income") {
        newRow.classList.add("transIncome");
        expense.cost = `<span>+ $ ${expense.cost.toFixed(2)}</span>`
      } else if (expense.income === "expense") {
        newRow.classList.add("transExpense");
        expense.cost = `<span>- $ ${expense.cost.toFixed(2)}</span>`
      }

      newRow.innerHTML = `
        <td></td>
        <td>${formatDate(expense.date)}</td>
        <td>${expense.category}</td>
        <td>${expense.description}</td>
        <td class="cost">${expense.cost}</td>
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

    // If we want to use the filter again, We can change the value to "currentMonthIncome" and uncomment.
    document.querySelector(".monthlyExpense .income h2").textContent = `+ $ ${currentMonthIncome.toFixed(2)}`;
    document.querySelector(".monthlyExpense .expense h2").textContent = `- $ ${currentMonthExpense.toFixed(2)}`;
  }
  
  
  updateBalances();
  
  updateTable();



  // Mobile bottom area
  $(".add-expense").click(function(){
    $("#mobileAddExpenseArea").toggleClass("add-popup")
    if ($("#mobileAddExpenseArea").hasClass("add-popup")) {
      $(".add-expense").html("&#215;"); 
  } else {
      $(".add-expense").html("+");
  }
  })  

