/* ==================================================
   EXPENSE TRACKER
   JavaScript
================================================== */


/* ================= DOM ELEMENTS ================= */

const transactionForm =
    document.getElementById("transactionForm");

const amountInput =
    document.getElementById("amount");

const descriptionInput =
    document.getElementById("description");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const transactionList =
    document.getElementById("transactionList");

const emptyState =
    document.getElementById("emptyState");

const balanceElement =
    document.getElementById("balance");

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const formTitle =
    document.getElementById("formTitle");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const typeButtons =
    document.querySelectorAll(".type-btn");


/* ================= DARK MODE ================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");


/* Load saved theme */

const savedTheme =
    localStorage.getItem("expenseTrackerTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.textContent = "☀️";

}


/* Toggle theme */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDarkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        if (isDarkMode) {

            themeIcon.textContent = "☀️";

            localStorage.setItem(
                "expenseTrackerTheme",
                "dark"
            );

        } else {

            themeIcon.textContent = "🌙";

            localStorage.setItem(
                "expenseTrackerTheme",
                "light"
            );

        }

    }
);




/* ================= VARIABLES ================= */

let transactions =
    JSON.parse(
        localStorage.getItem("expenseTrackerTransactions")
    ) || [];


let currentType = "income";

let editingId = null;


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {

    setTodayDate();

    renderTransactions();

    updateSummary();

});


/* ================= SET TODAY DATE ================= */

function setTodayDate() {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.value = today;

}


/* ================= TRANSACTION TYPE ================= */

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        typeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentType =
            button.dataset.type;


        updateCategoryOptions();

    });

});


/* ================= CATEGORY OPTIONS ================= */

function updateCategoryOptions() {

    if (currentType === "income") {

        categoryInput.innerHTML = `

            <option value="">
                Select category
            </option>

            <option value="Salary">
                Salary
            </option>

            <option value="Freelance">
                Freelance
            </option>

            <option value="Other">
                Other
            </option>

        `;

    } else {

        categoryInput.innerHTML = `

            <option value="">
                Select category
            </option>

            <option value="Food">
                Food
            </option>

            <option value="Shopping">
                Shopping
            </option>

            <option value="Transport">
                Transport
            </option>

            <option value="Bills">
                Bills
            </option>

            <option value="Entertainment">
                Entertainment
            </option>

            <option value="Health">
                Health
            </option>

            <option value="Education">
                Education
            </option>

            <option value="Other">
                Other
            </option>

        `;

    }

}


/* ================= FORM SUBMIT ================= */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const amount =
            parseFloat(amountInput.value);

        const description =
            descriptionInput.value.trim();

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        /* Validation */

        if (
            !amount ||
            amount <= 0 ||
            !description ||
            !category ||
            !date
        ) {

            alert(
                "Please fill all fields correctly."
            );

            return;

        }


        /* ================= EDIT ================= */

        if (editingId !== null) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id === editingId
                );


            if (index !== -1) {

                transactions[index] = {

                    ...transactions[index],

                    type: currentType,

                    amount: amount,

                    description: description,

                    category: category,

                    date: date

                };

            }


            editingId = null;


            submitBtn.innerHTML =
                "<span>+</span> Add Transaction";

            cancelBtn.hidden = true;

            formTitle.textContent =
                "Add Transaction";

        }


        /* ================= ADD ================= */

        else {

            const transaction = {

                id: Date.now(),

                type: currentType,

                amount: amount,

                description: description,

                category: category,

                date: date

            };


            transactions.unshift(transaction);

        }


        /* Save */

        saveTransactions();


        /* Refresh UI */

        renderTransactions();

        updateSummary();


        /* Reset */

        transactionForm.reset();

        setTodayDate();


        /* Reset type */

        currentType = "income";


        typeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        document
            .querySelector(".income-type")
            .classList.add("active");


        updateCategoryOptions();

    }
);


/* ================= SAVE LOCAL STORAGE ================= */

function saveTransactions() {

    localStorage.setItem(
        "expenseTrackerTransactions",
        JSON.stringify(transactions)
    );

}


/* ================= FORMAT CURRENCY ================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(amount);

}


/* ================= FORMAT DATE ================= */

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= UPDATE SUMMARY ================= */

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome +=
                Number(transaction.amount);

        } else {

            totalExpense +=
                Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpense;


    totalIncomeElement.textContent =
        formatCurrency(totalIncome);


    totalExpenseElement.textContent =
        formatCurrency(totalExpense);


    balanceElement.textContent =
        formatCurrency(balance);


    /* Balance colour */

    if (balance < 0) {

        balanceElement.style.color =
            "var(--expense)";

    } else {

        balanceElement.style.color =
            "var(--dark)";

    }

}


/* ================= RENDER TRANSACTIONS ================= */

function renderTransactions() {

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    let filteredTransactions =
        transactions.filter(transaction => {

            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return (
                matchesType &&
                matchesCategory
            );

        });


    transactionList.innerHTML = "";


    /* Empty State */

    if (filteredTransactions.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    /* Display transactions */

    filteredTransactions.forEach(
        transaction => {

            const item =
                document.createElement("div");


            item.className =
                "transaction-item";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const arrow =
                transaction.type === "income"
                    ? "↗"
                    : "↘";


            item.innerHTML = `

                <div class="transaction-icon
                    ${transaction.type}">

                    ${arrow}

                </div>


                <div class="transaction-info">

                    <h4>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </h4>

                    <div class="transaction-meta">

                        <span class="category-badge">
                            ${escapeHTML(
                                transaction.category
                            )}
                        </span>

                        <span class="transaction-date">
                            ${formatDate(
                                transaction.date
                            )}
                        </span>

                    </div>

                </div>


                <div class="transaction-amount
                    ${transaction.type}">

                    ${sign}${formatCurrency(
                        transaction.amount
                    )}

                </div>


                <div class="transaction-actions">

                    <button
                        class="action-btn edit-btn"
                        title="Edit"
                        onclick="editTransaction(
                            ${transaction.id}
                        )">

                        ✎

                    </button>


                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                        onclick="deleteTransaction(
                            ${transaction.id}
                        )">

                        ×

                    </button>

                </div>

            `;


            transactionList.appendChild(item);

        }
    );

}


/* ================= EDIT TRANSACTION ================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );


    if (!transaction) {

        return;

    }


    editingId = id;


    /* Set type */

    currentType =
        transaction.type;


    typeButtons.forEach(button => {

        button.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `[data-type="${transaction.type}"]`
        );


    activeButton.classList.add("active");


    /* Update categories */

    updateCategoryOptions();


    /* Fill form */

    amountInput.value =
        transaction.amount;

    descriptionInput.value =
        transaction.description;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;


    /* Update buttons */

    submitBtn.innerHTML =
        "<span>✓</span> Update Transaction";

    cancelBtn.hidden = false;

    formTitle.textContent =
        "Edit Transaction";


    /* Scroll to form */

    document
        .querySelector(".form-card")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* ================= CANCEL EDIT ================= */

cancelBtn.addEventListener(
    "click",
    cancelEdit
);


function cancelEdit() {

    editingId = null;


    transactionForm.reset();

    setTodayDate();


    currentType = "income";


    typeButtons.forEach(button => {

        button.classList.remove("active");

    });


    document
        .querySelector(".income-type")
        .classList.add("active");


    updateCategoryOptions();


    submitBtn.innerHTML =
        "<span>+</span> Add Transaction";

    cancelBtn.hidden = true;

    formTitle.textContent =
        "Add Transaction";

}


/* ================= DELETE ================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            transaction =>
                transaction.id === id
        );


    if (!transaction) {

        return;

    }


    const confirmDelete =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    renderTransactions();

    updateSummary();

}


/* ================= CLEAR ALL ================= */

clearAllBtn.addEventListener(
    "click",
    () => {

        if (transactions.length === 0) {

            alert(
                "There are no transactions to clear."
            );

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmClear) {

            return;

        }


        transactions = [];


        saveTransactions();

        renderTransactions();

        updateSummary();


        cancelEdit();

    }
);


/* ================= FILTERS ================= */

typeFilter.addEventListener(
    "change",
    renderTransactions
);


categoryFilter.addEventListener(
    "change",
    renderTransactions
);


/* ================= HTML SECURITY ================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ================= INITIAL CATEGORY ================= */

updateCategoryOptions();