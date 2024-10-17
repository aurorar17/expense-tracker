function generateChart() {
    const expenses = JSON.parse(localStorage.getItem("expense")) || [];

    const today = new Date();
    today.setHours(0,0,0,0); //ignore the time

    // total 7 days
    const getSevenDays = (daysOffset) => {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysOffset);
        return targetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' }); // appear : MM/DD
    };

    const labels = [
        getSevenDays(-3),
        getSevenDays(-2),
        getSevenDays(-1),
        today.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' }),
        getSevenDays(1),
        getSevenDays(2),
        getSevenDays(3),
    ];

    const incomeData = [0, 0, 0, 0, 0, 0, 0];
    const expenseData = [0, 0, 0, 0, 0, 0, 0];

    // Calculate of the cost by per day
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        expenseDate.setDate(expenseDate.getDate() + 1); // Date + 1 because it start 0

        const dayDifference = Math.floor((expenseDate - today) / (1000 * 60 * 60 * 24));

        if (dayDifference >= -3 && dayDifference <= 3) {
            const index = dayDifference + 3;
            if (expense.income === 'income') {
                incomeData[index] += expense.cost;
            } else if (expense.income === 'expense') {
                expenseData[index] += expense.cost;
            }
        }
    });

    console.log(expenses);

    // Daily Chart
    const dailyChartCanvas = document.getElementById("dailyChart").getContext("2d");
    const dailyChart = new Chart(dailyChartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Income",
                    backgroundColor: "#4aa76f",
                    data: incomeData,
                },
                {
                    label: "Expense",
                    backgroundColor: "#e44242",
                    data: expenseData,
                },
            ],
        },
        options: {
            responsive: true, // make the responsive layout
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

    // Category Chart
    const categoryData = {};
    expenses.forEach(expense => {
        const category = expense.category;
        const cost = expense.cost;

        if (categoryData[category]) {
            categoryData[category] += cost;
        } else {
            categoryData[category] = cost;
        }
    });

    const categoryLabels = Object.keys(categoryData);
    const categoriesCost = Object.values(categoryData);

    const categoryChartCanvas = document.getElementById("categoryChart").getContext("2d");
    const categoryChart = new Chart(categoryChartCanvas, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Category Expenses',
                data: categoriesCost,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            }]
        },
        options: {
            responsive: true, 
            plugins: {
                legend: {
                    position: 'bottom',
                },
                datalabels: {
                    // color: '#fff',
                    // backgroundColor: "red",
                    formatter: (value, context) => {
                        return `$ ${value}`; 
                    },
                    anchor: 'center', 
                    align: 'center', 
                }
            }
        },
        plugins: [ChartDataLabels],
    });
}

generateChart();
