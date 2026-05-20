import './style.css'

import {
  addExpense,
  getExpenses,
  createInstallment,
  loadExpenses,
  deleteExpense
} from './app'

import {
  getCurrentMonthKey,
  generateMonthOptions,
  getMonthDifference
} from './months'

// =========================
// HTML APP
// =========================

document.querySelector('#app').innerHTML = `
<div class="app">

<header class="topbar">

  <h1>💸 Mis Finanzas</h1>

  <div style="display:flex; gap:10px; align-items:center;">

    <button id="refresh-btn">
      🔄 Refrescar
    </button>

    <select
      class="month-select"
      id="month-select"
    ></select>

  </div>

</header>

<main class="dashboard">

  <section class="card income">

    <div class="card-header">
      <h2>Ingresos</h2>
      <span id="income-total">$0</span>
    </div>

    <div class="expense-list" id="income-list"></div>

    <button class="add-btn" id="add-income">
      + Agregar
    </button>

  </section>

  <section class="card fixed">

    <div class="card-header">
      <h2>Gastos Fijos</h2>
      <span id="fixed-total">$0</span>
    </div>

    <div class="expense-list" id="fixed-list"></div>

    <button class="add-btn" id="add-fixed">
      + Agregar
    </button>

  </section>

  <section class="card installments">

    <div class="card-header">
      <h2>Cuotas</h2>
      <span id="installments-total">$0</span>
    </div>

    <div class="expense-list" id="installments-list"></div>

    <button class="add-btn" id="add-installment">
      + Agregar
    </button>

  </section>

  <section class="card unique">

    <div class="card-header">
      <h2>Gastos Únicos</h2>
      <span id="unique-total">$0</span>
    </div>

    <div class="expense-list" id="unique-list"></div>

    <button class="add-btn" id="add-unique">
      + Agregar
    </button>

  </section>

  <aside class="summary">

    <h2>Resumen</h2>

<div class="summary-item">
  <span>Total Gastos</span>
  <strong id="expenses-total">$0</strong>
</div>

<div class="summary-item">
  <span>Balance</span>
  <strong id="global-total">$0</strong>
  <div id="accounts-summary"></div>
</div>

<div class="summary-item">

  <h3>Categorías</h3>

</div>

<div id="categories-summary"></div>

  </aside>

</main>

</div>

<div class="modal hidden" id="modal">

  <div class="modal-content">

    <h2 id="modal-title">Agregar</h2>

    <input
      type="text"
      id="expense-name"
      placeholder="Nombre"
    >

    <input
      type="number"
      id="expense-amount"
      placeholder="Monto"
    >

<select id="expense-account">

  <option value="Visa">
    Visa
  </option>

  <option value="Mastercard">
    Mastercard
  </option>

  <option value="Amex">
    Amex
  </option>

  <option value="Efectivo">
    Efectivo
  </option>

</select>

<select id="expense-category">

 <option value="Otros">
  📦 Otros
 </option>

  <option value="Hogar">
    🏠 Hogar
  </option>

  <option value="Ropa">
    👕 Ropa
  </option>

  <option value="Supermercado">
    🛒 Supermercado
  </option>

  <option value="Mantenimiento">
    🔧 Mantenimiento
  </option>

  <option value="Vehículos">
    🚗 Vehículos
  </option>

  <option value="Ocio">
    🎮 Ocio
  </option>

  <option value="Ayudas">
    🤝 Ayudas
  </option>

  <option value="Familia">
    👨‍👩‍👧 Familia
  </option>

  <option value="Regalos">
    🎁 Regalos
  </option>

</select>

    <input
      type="number"
      id="expense-installments"
      placeholder="Cantidad de cuotas"
      class="hidden"
    >

    <button id="save-expense">
      Guardar
    </button>

  </div>

</div>
`

// =========================
// VARIABLES
// =========================

let currentType = null

const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')

const expenseName = document.querySelector('#expense-name')
const expenseAmount = document.querySelector('#expense-amount')
const expenseAccount = document.querySelector('#expense-account')
const expenseCategory = document.querySelector('#expense-category')
const expenseInstallments = document.querySelector('#expense-installments')

const monthSelect = document.querySelector('#month-select')

let selectedMonth = getCurrentMonthKey()

// =========================
// SELECTOR MESES
// =========================

generateMonthOptions().forEach(month => {

  monthSelect.innerHTML += `
    <option value="${month.key}">
      ${month.label}
    </option>
  `
})

monthSelect.value = selectedMonth

monthSelect.addEventListener('change', () => {

  selectedMonth = monthSelect.value

  renderExpenses()
})

// =========================
// BOTONES AGREGAR
// =========================

document
  .querySelector('#add-income')
  .addEventListener('click', () => {
    openModal('income')
  })

document
  .querySelector('#add-fixed')
  .addEventListener('click', () => {
    openModal('fixed')
  })

document
  .querySelector('#add-installment')
  .addEventListener('click', () => {
    openModal('installments')
  })

document
  .querySelector('#add-unique')
  .addEventListener('click', () => {
    openModal('unique')
  })

// =========================
// ABRIR MODAL
// =========================

function openModal(type) {

  currentType = type

  modal.classList.remove('hidden')

  expenseInstallments.classList.add('hidden')
  
if (type === 'income') {
  modalTitle.innerText = 'Agregar Ingreso'
}
  if (type === 'fixed') {
    modalTitle.innerText = 'Agregar gasto fijo'
  }

  if (type === 'unique') {
    modalTitle.innerText = 'Agregar gasto único'
  }

  if (type === 'installments') {

    modalTitle.innerText = 'Agregar cuota'

    expenseInstallments.classList.remove('hidden')
  }
}

// =========================
// CERRAR MODAL
// =========================

modal.addEventListener('click', (e) => {

  if (e.target.id === 'modal') {
    modal.classList.add('hidden')
  }
})

// =========================
// GUARDAR GASTO
// =========================

document
  .querySelector('#save-expense')
  .addEventListener('click', async () => {

    const name = expenseName.value.trim()

    const amount = Number(expenseAmount.value)

    if (!name || !amount) {
      alert('Completá nombre y monto')
      return
    }

   let expense = {
  name,
  amount,
  account: expenseAccount.value,
  category: expenseCategory.value,
  created_month: selectedMonth
}

    // =========================
    // CUOTAS
    // =========================

    if (currentType === 'installments') {

      const installments = Number(
        expenseInstallments.value
      )

      if (!installments || installments <= 0) {
        alert('Ingresá cantidad de cuotas')
        return
      }

expense = createInstallment(
  name,
  amount,
  installments,
  expenseAccount.value,
  expenseCategory.value
)
    }

    // =========================
    // GUARDAR
    // =========================

    await addExpense(currentType, expense)

    await loadExpenses()

    // =========================
    // LIMPIAR
    // =========================

    expenseName.value = ''
    expenseAmount.value = ''
    expenseInstallments.value = ''

    modal.classList.add('hidden')

    renderExpenses()
  })

// =========================
// RENDER GENERAL
// =========================

function renderExpenses() {

  renderIncome()

  renderFixed()

  renderUnique()

  renderInstallments()

  updateGlobalTotal()
  
  renderAccountsSummary()

renderCategoriesSummary()

}

// =========================
// FIJOS
// =========================
function renderIncome() {

  const list =
    document.querySelector('#income-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('income')
    .filter(expense =>
      expense.created_month === selectedMonth
    )
    .forEach(expense => {

      total += expense.amount

      list.innerHTML += `
        <div class="expense-item">

          <span>${expense.name}</span>

          <div style="display:flex; gap:10px; align-items:center;">

            <strong>
              $${expense.amount.toLocaleString()}
            </strong>

            <button
              onclick="removeExpense('${expense.id}')"
            >
              🗑️
            </button>

          </div>

        </div>
      `
    })

  document.querySelector('#income-total').innerText =
    `$${total.toLocaleString()}`
}
function renderFixed() {

  const list = document.querySelector('#fixed-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('fixed').forEach(expense => {

    total += expense.amount

    list.innerHTML += `
      <div class="expense-item">

        <span>${expense.name}</span>

        <div style="display:flex; gap:10px; align-items:center;">

          <strong>
            $${expense.amount.toLocaleString()}
          </strong>

          <button
            onclick="removeExpense('${expense.id}')"
          >
            🗑️
          </button>

        </div>

      </div>
    `
  })

  document.querySelector('#fixed-total').innerText =
    `$${total.toLocaleString()}`
}

// =========================
// UNICOS
// =========================

function renderUnique() {

  const list = document.querySelector('#unique-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('unique')
    .filter(expense =>
      expense.created_month === selectedMonth
    )
    .forEach(expense => {

      total += expense.amount

      list.innerHTML += `
        <div class="expense-item">

          <span>${expense.name}</span>

          <div style="display:flex; gap:10px; align-items:center;">

            <strong>
              $${expense.amount.toLocaleString()}
            </strong>

            <button
              onclick="removeExpense('${expense.id}')"
            >
              🗑️
            </button>

          </div>

        </div>
      `
    })

  document.querySelector('#unique-total').innerText =
    `$${total.toLocaleString()}`
}

// =========================
// CUOTAS
// =========================

function renderInstallments() {

  const list = document.querySelector('#installments-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('installments').forEach(expense => {

    const monthsPassed = getMonthDifference(
      expense.start_month,
      selectedMonth
    )

    const remaining =
      expense.installments - monthsPassed

    if (remaining <= 0) return

    if (monthsPassed < 0) return

    total += expense.amount

    list.innerHTML += `
      <div class="expense-item">

        <div>

          <span>${expense.name}</span>

          <small>
            ${remaining} cuotas restantes
          </small>

        </div>

        <div style="display:flex; gap:10px; align-items:center;">

          <strong>
            $${expense.amount.toLocaleString()}
          </strong>

          <button
            onclick="removeExpense('${expense.id}')"
          >
            🗑️
          </button>

        </div>

      </div>
    `
  })

  document.querySelector('#installments-total').innerText =
    `$${total.toLocaleString()}`
}

// =========================
// TOTAL GENERAL
// =========================
function renderAccountsSummary() {

  const container =
    document.querySelector('#accounts-summary')

  container.innerHTML = ''

  const expenses = [

    ...getExpenses('fixed'),

    ...getExpenses('unique')
      .filter(item =>
        item.created_month === selectedMonth
      ),

    ...getExpenses('installments')
      .filter(expense => {

        const monthsPassed =
          getMonthDifference(
            expense.start_month,
            selectedMonth
          )

        const remaining =
          expense.installments - monthsPassed

        return remaining > 0 && monthsPassed >= 0
      })
  ]

  const totals = {}

  expenses.forEach(expense => {

    const account =
      expense.account || 'Sin cuenta'

    if (!totals[account]) {
      totals[account] = 0
    }

    totals[account] += expense.amount
  })

  Object.entries(totals).forEach(
    ([account, total]) => {

      container.innerHTML += `

        <div class="summary-item">

          <span>${account}</span>

          <strong>
            $${total.toLocaleString()}
          </strong>

        </div>
      `
    }
  )
}

function renderCategoriesSummary() {

  const container =
    document.querySelector('#categories-summary')

  container.innerHTML = ''

  const expenses = [

    ...getExpenses('fixed'),

    ...getExpenses('unique')
      .filter(item =>
        item.created_month === selectedMonth
      ),

    ...getExpenses('installments')
      .filter(expense => {

        const monthsPassed =
          getMonthDifference(
            expense.start_month,
            selectedMonth
          )

        const remaining =
          expense.installments - monthsPassed

        return remaining > 0 && monthsPassed >= 0
      })
  ]

  const totals = {}

  let grandTotal = 0

  expenses.forEach(expense => {

    const category =
      expense.category || 'Otros'

    if (!totals[category]) {
      totals[category] = 0
    }

    totals[category] += expense.amount

    grandTotal += expense.amount
  })

  Object.entries(totals).forEach(
    ([category, total]) => {

      const percent =
        ((total / grandTotal) * 100)
          .toFixed(0)

container.innerHTML += `

  <div class="summary-item category-item">

    <div class="category-header">

      <div>

        <span>${category}</span>

        <small>
          ${percent}%
        </small>

      </div>

      <strong>
        $${total.toLocaleString()}
      </strong>

    </div>

    <div class="category-bar">

      <div
        class="category-fill category-${category}"
        style="width:${percent}%"
      ></div>

    </div>

  </div>
`
    }
  )
}

function updateGlobalTotal() {
const income =
  getExpenses('income')
    .filter(item =>
      item.created_month === selectedMonth
    )
    .reduce((acc, item) => acc + item.amount, 0)
  const fixed =
    getExpenses('fixed')
      .reduce((acc, item) => acc + item.amount, 0)

  const unique =
    getExpenses('unique')
      .filter(item =>
        item.created_month === selectedMonth
      )
      .reduce((acc, item) => acc + item.amount, 0)

  const installments =
    getExpenses('installments')
      .reduce((acc, item) => acc + item.amount, 0)

  const expensesTotal =
  fixed + unique + installments

  const total =
  income - expensesTotal
  
  document.querySelector('#expenses-total').innerText =
  `$${expensesTotal.toLocaleString()}`
  
  document.querySelector('#global-total').innerText =
    `$${total.toLocaleString()}`
}

// =========================
// START
// =========================

async function start() {

  await loadExpenses()

  renderExpenses()
}

start()

// =========================
// REFRESH
// =========================

document
  .querySelector('#refresh-btn')
  .addEventListener('click', async () => {

    await loadExpenses()

    renderExpenses()

    alert('Datos actualizados')
  })

// =========================
// DELETE
// =========================

window.removeExpense = async function(id) {

  const confirmDelete = confirm(
    '¿Eliminar este gasto?'
  )

  if (!confirmDelete) return

  await deleteExpense(id)

  await loadExpenses()

  renderExpenses()
}
const scrollTopBtn =
  document.querySelector('#scroll-top-btn')

scrollTopBtn.addEventListener(
  'click',
  () => {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'
    })
  }
)