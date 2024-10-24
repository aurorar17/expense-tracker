function generateChart() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];

    const selectedMonth = parseInt(document.getElementById("currentMonthSelect").value);
    const currentYear = new Date().getFullYear();

    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate(); 
    const incomeData = Array(daysInMonth).fill(0); 
    const expenseData = Array(daysInMonth).fill(0);

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        expenseDate.setDate(expenseDate.getDate() + 1); 
        
        if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() + 1 === selectedMonth) {
            const day = expenseDate.getDate(); 

            if (expense.income === 'income') {
                incomeData[day - 1] += expense.cost; 
            } else if (expense.income === 'expense') {
                expenseData[day - 1] += expense.cost;
            }
        }
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${selectedMonth}/${i + 1}`);
    
    const dailyChartCanvas = document.getElementById("dailyChart").getContext("2d");
    if (dailyChartCanvas.chart) {
        dailyChartCanvas.chart.destroy();
    }

    dailyChartCanvas.chart = new Chart(dailyChartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Income",
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    data: incomeData,
                },
                {
                    label: "Expense",
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    data: expenseData,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
            }
        },
    });

    // Expense Category Chart
    const categoryData = {};
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        expenseDate.setDate(expenseDate.getDate() + 1); 
        
        if (expense.income === "expense" && expenseDate.getFullYear() === currentYear && expenseDate.getMonth() + 1 === selectedMonth) {
            const category = expense.category;
            const cost = expense.cost;

            if (categoryData[category]) {
                categoryData[category] += cost;
            } else {
                categoryData[category] = cost;
            }
        }
    });

    const categoryLabels = Object.keys(categoryData);
    const categoriesCost = Object.values(categoryData);

    const categoryChartCanvas = document.getElementById("categoryChart").getContext("2d");
    if (categoryChartCanvas.chart) {
        categoryChartCanvas.chart.destroy();
    }

    const chartData = categoriesCost.length === 0 ? [1] : categoriesCost; // if selected month doesn't have a expense list, it's data changes to 1 (for draw a graph)
    const chartLabels = categoriesCost.length === 0 ? ['No Expenses'] : categoryLabels;

    categoryChartCanvas.chart = new Chart(categoryChartCanvas, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Category Expenses',
                data: chartData,
                backgroundColor: chartData[0] === 1 ? ['rgba(169, 169, 169, 1)'] : [
                    'rgba(255, 99, 132, 0.6)',  
                    'rgba(54, 162, 235, 0.6)',  
                    'rgba(255, 206, 86, 0.6)',  
                    'rgba(75, 192, 192, 0.6)',  
                    'rgba(153, 102, 255, 0.6)', 
                    'rgba(255, 159, 64, 0.6)',  
                    'rgba(201, 203, 207, 0.6)', 
                    'rgba(130, 105, 220, 0.6)', 
                    'rgba(255, 182, 193, 0.6)', 
                    'rgba(101, 178, 255, 0.6)', 
                ],
                borderColor: 'rgba(0, 0, 0, 0.1)', 
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                datalabels: {
                    // if the value is 1, it means the selected month doesn't have a expense list. so don't return the label
                    display: (context) => {
                        return context.dataset.data[context.dataIndex] !== 1; 
                    },
                    formatter: (value) => {
                        return value === 1 ? '' : `$${value}`;
                    },
                    anchor: 'center',
                    align: 'center',
                }
            },
            cutoutPercentage: 0,
        },
        plugins: [ChartDataLabels],
    });
}

// the graph is changed according to select box
document.getElementById("currentMonthSelect").addEventListener("change", generateChart);

generateChart();
