// Find a current Month
const today = new Date();
const currentMonth = today.getMonth() + 1; 
document.getElementById("currentMonthSelect").value = currentMonth;

// Change the date format yyyy-mm-dd -> mm/dd
function formatDate(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

// Monthly income & monthly expense -- key => selected Month from top
function updateBalances(selectedMonthValue) {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const currentYear = new Date().getFullYear();

    // Calculate total income & expense
    const totalIncome = expenses
        .filter((expense) => expense.income === "income")
        .reduce((sum, income) => sum + (income.cost || 0), 0);

    const totalExpense = expenses
        .filter((expense) => expense.income === "expense")
        .reduce((sum, expense) => sum + (expense.cost || 0), 0);

    const totalBalance = totalIncome - totalExpense;

    // Add the current Balance in UI
    document.querySelector(".current-box h1").textContent = `$ ${totalBalance.toFixed(2)}`;

    // Filtering of the selected Month
    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        expenseDate.setUTCHours(0, 0, 0, 0);
        const selectedDate = new Date(currentYear, selectedMonthValue - 1);
        selectedDate.setUTCHours(0, 0, 0, 0); // Selected month's first day
        const nextMonthDate = new Date(currentYear, selectedMonthValue);
        nextMonthDate.setUTCHours(0, 0, 0, 0); // Next month's first day
        return expenseDate >= selectedDate && expenseDate < nextMonthDate;
    });

    const currentIncome = filteredExpenses
        .filter((expense) => expense.income === "income")
        .reduce((sum, income) => sum + (income.cost || 0), 0);

    const currentExpense = filteredExpenses
        .filter((expense) => expense.income === "expense")
        .reduce((sum, expense) => sum + (expense.cost || 0), 0);


    // Add the monthly income & expense in UI
    document.querySelector(".monthlyExpense .income h2").textContent = `+ $ ${currentIncome.toFixed(2)}`;
    document.querySelector(".monthlyExpense .expense h2").textContent = `- $ ${currentExpense.toFixed(2)}`;
    document.querySelector(".monthly-total").textContent = `$ ${currentExpense}`


    // GET the limit data from localStorage
    const categoriesData = localStorage.getItem('categories');

    if (categoriesData) {
      const categories = JSON.parse(categoriesData);
      // add all limit's value
      const totalLimit = categories.reduce((sum, category) => {
        return sum + category.limit;
      }, 0);

      document.querySelector(".total-limit").textContent = `Total Limit : $ ${totalLimit}`

      $(".limit-fill").css("width", `${currentExpense/totalLimit*100}%`)
    } 
        
    } 

// Update balances on initial load
updateBalances(currentMonth);

// Add change event to select box "currentMonthSelect"
document.getElementById("currentMonthSelect").addEventListener("change", function () {
    const selectedMonthValue = parseInt(this.value); 
    updateBalances(selectedMonthValue);
    updateTable(selectedMonthValue); // Update table when month changes
});

// Transaction table list filtering by month
function updateTable(selectedMonthValue) {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];
    const tableBody = document.querySelector("#transactionTable tbody");
    tableBody.innerHTML = "";

    const currentYear = new Date().getFullYear();
    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        expenseDate.setUTCHours(0, 0, 0, 0);
        const selectedDate = new Date(currentYear, selectedMonthValue - 1);
        selectedDate.setUTCHours(0, 0, 0, 0); // Selected month's first day
        const nextMonthDate = new Date(currentYear, selectedMonthValue);
        nextMonthDate.setUTCHours(0, 0, 0, 0); // Next month's first day
        return expenseDate >= selectedDate && expenseDate < nextMonthDate;
    });

    // Date sort recent -> old
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredExpenses.forEach((expense) => {
        const newRow = document.createElement("tr");

        if (expense.income === "income") {
            newRow.classList.add("transIncome");
            expense.cost = `<span>+ $ ${expense.cost.toFixed(2)}</span>`;
        } else if (expense.income === "expense") {
            newRow.classList.add("transExpense");
            expense.cost = `<span>- $ ${expense.cost.toFixed(2)}</span>`;
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
}

// Initial table update
const initialSelectedMonth = parseInt(document.getElementById("currentMonthSelect").value);
updateTable(initialSelectedMonth);

// Function to add an expense
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
            const title = document.querySelector("#title").value;
            const description = document.querySelector("#description").value;
            const cost = parseFloat(document.querySelector("input[type=number]").value) || 0;
            const currentCategory = categories.get(Number(category));

            let expenses = JSON.parse(localStorage.getItem("expense")) || [];

            const currentSpendAmount = expenses.reduce((result, expense) => {
              if (
                expense.category === currentCategory.name &&
                expense.income === "income"
              ) {
                return result + expense.cost;
              }
              return result;
            }, 0);

            if (income === "expense") {
              if (currentSpendAmount + cost > currentCategory.limit) {
                alert(`You have exceeded your $${currentCategory.limit} limit.`);
                return;
              } else if (
                currentCategory.limit - (currentSpendAmount + cost) <= 10
              ) {
                alert("There's not much left in the budget.");
              }
            }

            const lastExpense = expenses.slice(-1)[0];
            const id = lastExpense ? lastExpense.id + 1 : 1;

            const newExpense = {
              id,
              income,
              category: currentCategory.name,
              date,
              title,
              description,
              cost,
            };

            expenses.push(newExpense);
            localStorage.setItem("expense", JSON.stringify(expenses));

            document.getElementById("inputForm").reset();

            alert("Expense added successfully!");

            // Update the table after adding expense
            const selectedMonthValue = parseInt(document.getElementById("currentMonthSelect").value);
            updateTable(selectedMonthValue); 

            // Close popup
            $("#mobileAddExpenseArea").removeClass("add-popup");
            $(".add-expense").html("+");
          });
        });
      });
}

// Mobile bottom area
$(".add-expense").click(function(){
    $("#mobileAddExpenseArea").toggleClass("add-popup");
    if ($("#mobileAddExpenseArea").hasClass("add-popup")) {
        $(".add-expense").html("&#215;"); 
    } else {
        $(".add-expense").html("+");
    }
});
