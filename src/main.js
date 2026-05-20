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
        <span>Total general</span>
        <strong id="global-total">$0</strong>
      </div>
    </aside>

  </main>

</div>

<div class="modal hidden" id="modal">
  <div class="modal-content">

    <h2 id="modal-title">Agregar</h2>

    <input type="text" id="expense-name" placeholder="Nombre">

    <input type="number" id="expense-amount" placeholder="Monto">

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

let currentType = null

const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')

const expenseName = document.querySelector('#expense-name')
const expenseAmount = document.querySelector('#expense-amount')
const expenseInstallments = document.querySelector('#expense-installments')

const monthSelect = document.querySelector('#month-select')

let selectedMonth = getCurrentMonthKey()

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

document.querySelector('#add-fixed').addEventListener('click', () => {
  openModal('fixed')
})

document.querySelector('#add-installment').addEventListener('click', () => {
  openModal('installments')
})

document.querySelector('#add-unique').addEventListener('click', () => {
  openModal('unique')
})

function openModal(type) {
  currentType = type

  modal.classList.remove('hidden')

  expenseInstallments.classList.add('hidden')

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

modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    modal.classList.add('hidden')
  }
})

document.querySelector('#save-expense').addEventListener('click', async () => {

  const name = expenseName.value.trim()
  const amount = Number(expenseAmount.value)

  if (!name || !amount) {
    alert('Completá nombre y monto')
    return
  }

  let expense = {
    id: crypto.randomUUID(),
    name,
    amount,
    created_month: selectedMonth
  }

  // =========================
  // CUOTAS
  // =========================
  if (currentType === 'installments') {

    const installments = Number(expenseInstallments.value)

    if (!installments || installments <= 0) {
      alert('Ingresá cantidad de cuotas')
      return
    }

    expense = createInstallment(
      name,
      amount,
      installments
    )
  }

  // =========================
  // GUARDAR EN SUPABASE
  // =========================
  await addExpense(currentType, expense)

  // =========================
  // RECARGAR DESDE SUPABASE
  // =========================
  await loadExpenses()

  // =========================
  // CERRAR MODAL
  // =========================
  modal.classList.add('hidden')

  // =========================
  // LIMPIAR INPUTS
  // =========================
  expenseName.value = ''
  expenseAmount.value = ''
  expenseInstallments.value = ''

  // =========================
  // RENDER
  // =========================
  renderExpenses()
})

function renderExpenses() {
  renderFixed()
  renderUnique()
  renderInstallments()

  updateGlobalTotal()
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

        <div style="display:flex; align-items:center; gap:10px;">

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
function renderUnique() {

  const list = document.querySelector('#unique-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('unique')
    .filter(expense => expense.created_month === selectedMonth)
    .forEach(expense => {

      total += expense.amount

      list.innerHTML += `
        <div class="expense-item">

          <span>${expense.name}</span>

          <div style="display:flex; align-items:center; gap:10px;">

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

function renderInstallments() {
  const list = document.querySelector('#installments-list')

  list.innerHTML = ''

  let total = 0

  getExpenses('installments').forEach(expense => {

    const monthsPassed = getMonthDifference(
      expense.startMonth,
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

        <strong>$${expense.amount.toLocaleString()}</strong>
      </div>
    `
  })

  document.querySelector('#installments-total').innerText =
    `$${total.toLocaleString()}`
}

function updateGlobalTotal() {
  const fixed =
    getExpenses('fixed')
      .reduce((acc, item) => acc + item.amount, 0)

  const unique =
    getExpenses('unique')
      .filter(item => item.created_month === selectedMonth)
      .reduce((acc, item) => acc + item.amount, 0)

  const installments =
    getExpenses('installments')
      .reduce((acc, item) => acc + item.amount, 0)

  const total = fixed + unique + installments

  document.querySelector('#global-total').innerText =
    `$${total.toLocaleString()}`
}

async function start() {
  await loadExpenses()
  renderExpenses()
}

start()
document
  .querySelector('#refresh-btn')
  .addEventListener('click', async () => {

    await loadExpenses()

    renderExpenses()

    alert('Datos actualizados')
})
window.removeExpense = async function(id) {

  const confirmDelete = confirm(
    '¿Eliminar este gasto?'
  )

  if (!confirmDelete) return

  await deleteExpense(id)

  await loadExpenses()

  renderExpenses()
}