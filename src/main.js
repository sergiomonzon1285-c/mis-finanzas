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

<div class="top-navigation">

  <header class="topbar">

    <h1>💸 Mis Finanzas</h1>

    <div class="topbar-controls">

      <button id="refresh-btn">
        🔄 Refrescar
      </button>

      <select
        class="month-select"
        id="month-select"
      ></select>

    </div>

  </header>

  <div class="tabs">

    <button
      class="tab-btn active"
      id="dashboard-tab"
    >
      📊 Dashboard
    </button>

    <button
      class="tab-btn"
      id="patrimony-tab"
    >
      💼 Patrimonio
    </button>

  </div>

  <div class="quick-nav">

    <button onclick="
      document
        .querySelector('#income-section')
        .scrollIntoView({
          behavior: 'smooth'
        })
    ">
      💰
      Ingresos
    </button>

    <button onclick="
      document
        .querySelector('#fixed-section')
        .scrollIntoView({
          behavior: 'smooth'
        })
    ">
      📌
      Fijos
    </button>

    <button onclick="
      document
        .querySelector('#installments-section')
        .scrollIntoView({
          behavior: 'smooth'
        })
    ">
      💳
      Cuotas
    </button>

    <button onclick="
      document
        .querySelector('#unique-section')
        .scrollIntoView({
          behavior: 'smooth'
        })
    ">
      🛒
      Únicos
    </button>

    <button onclick="
      document
        .querySelector('#balance-section')
        .scrollIntoView({
          behavior: 'smooth'
        })
    ">
      📊
      Balance
    </button>

  </div>

</div>

<main>

<div
  id="dashboard-section"
  class="page-section"
>

  <section
  id="income-section"
  class="card income"
>

    <div class="card-header">
      <h2>Ingresos</h2>
      <span id="income-total">$0</span>
    </div>

    <div class="expense-list" id="income-list"></div>

    <button class="add-btn" id="add-income">
      + Agregar
    </button>

  </section>

  <section
  id="fixed-section"
  class="card fixed"
>

    <div class="card-header">
      <h2>Gastos Fijos</h2>
      <span id="fixed-total">$0</span>
    </div>

    <div class="expense-list" id="fixed-list"></div>

    <button class="add-btn" id="add-fixed">
      + Agregar
    </button>

  </section>

  <section
  id="installments-section"
  class="card installments"
>

    <div class="card-header">
      <h2>Cuotas</h2>
      <span id="installments-total">$0</span>
    </div>

    <div class="expense-list" id="installments-list"></div>

    <button class="add-btn" id="add-installment">
      + Agregar
    </button>

  </section>

  <section
  id="unique-section"
  class="card unique"
>

    <div class="card-header">
      <h2>Gastos Únicos</h2>
      <span id="unique-total">$0</span>
    </div>

    <div class="expense-list" id="unique-list"></div>

    <button class="add-btn" id="add-unique">
      + Agregar
    </button>

  </section>

  <!-- BALANCE -->

  <div
  id="balance-section"
  class="summary-card"
>

<h3>Balance</h3>

    <div class="summary-item">
      <span>Total Gastos</span>
      <strong id="expenses-total">$0</strong>
    </div>

    <div class="summary-item">
      <span>Resto</span>
      <strong id="balance-total">$0</strong>
    </div>

  </div>

  <!-- TARJETAS -->

  <div class="summary-card">

    <h3>Tarjetas</h3>

    <div id="accounts-summary"></div>

  </div>

  <!-- CATEGORÍAS -->

  <div class="summary-card">

    <h3>Categorías</h3>

    <div id="categories-summary"></div>

  </div>

  </div>

<div
  id="patrimony-section"
  class="
    page-section
    hidden-section
  "
>

<section class="investments-section">

  <div class="investments-header">

    <div>

  <h2>
    💼 Patrimonio
  </h2>

  <small id="dollar-rate">
    USD $0
  </small>

</div>

  </div>

  <div id="investments-summary"></div>

  <div id="investments-real-summary"></div>

  <div id="investments-converted-summary"></div>

  <div
    class="expense-list"
    id="investments-list"
  ></div>

  <button
    class="add-btn"
    id="add-investments"
  >
    + Agregar inversión
  </button>

</section>

</div>

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

<select id="expense-category"></select>

<select
  id="expense-currency"
  class="hidden"
>

  <option value="ARS">
    🇦🇷 Pesos ARS
  </option>

  <option value="USD">
    🇺🇸 Dólares USD
  </option>

</select>

  <input
  type="number"
  id="expense-installments"
  placeholder="Cantidad de cuotas"
  class="hidden-section"
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

let editingId = null

const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')

const expenseName =
  document.querySelector('#expense-name')

const expenseAmount =
  document.querySelector('#expense-amount')

const expenseAccount =
  document.querySelector('#expense-account')

const expenseCategory =
  document.querySelector('#expense-category')

const expenseCurrency =
  document.querySelector('#expense-currency')  

const expenseCategories = {

  expenses: `

    <option value="Otros">
      📦 Otros
    </option>

    <option value="Ahorro/Inversión">
  💼 Ahorro/Inversión
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

    <option value="Vehiculos">
      🚗 Vehiculos
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
  `,

  investments: `

    <option value="Acciones">
      📈 Acciones
    </option>

    <option value="Crypto">
      🪙 Crypto
    </option>

    <option value="Plazo Fijo">
      🏦 Plazo Fijo
    </option>

    <option value="Fondos Comunes">
      📊 Fondos Comunes
    </option>

    <option value="Dólares">
      💵 Dólares
    </option>
  `
}
const expenseInstallments = document.querySelector('#expense-installments')

const monthSelect = document.querySelector('#month-select')

let selectedMonth = getCurrentMonthKey()

let dollarRate = 1230

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

document
  .querySelector('#add-investments')
  .addEventListener('click', () => {

    openModal('investments')
  })

// =========================
// ABRIR MODAL
// =========================

function openModal(type) {

  currentType = type

  expenseAccount.value = 'Visa'
  expenseName.value = ''
  expenseAmount.value = ''
  expenseInstallments.value = ''

  expenseAccount.style.display = 'block'
  expenseName.style.display = 'block'

  // Sacamos el hidden fuerte para poder controlar con style.display
  expenseCurrency.classList.remove('hidden-section')
  expenseInstallments.classList.remove('hidden-section')

  expenseCurrency.style.display = 'none'
  expenseInstallments.style.display = 'none'

  expenseCurrency.value = 'ARS'

  modal.classList.remove('hidden')
  modal.classList.remove('hidden-section')

  if (type === 'investments') {

    modalTitle.innerText = 'Agregar inversión'

    expenseCurrency.value = 'USD'
    expenseCurrency.style.display = 'block'

    expenseCategory.innerHTML = expenseCategories.investments
    expenseCategory.selectedIndex = 0

    expenseAccount.style.display = 'none'
    expenseName.style.display = 'none'

  } else {

    if (type === 'income') {
      modalTitle.innerText = 'Agregar Ingreso'
    } else if (type === 'fixed') {
      modalTitle.innerText = 'Agregar gasto fijo'
    } else if (type === 'unique') {
      modalTitle.innerText = 'Agregar gasto único'
    } else if (type === 'installments') {
      modalTitle.innerText = 'Agregar cuota'
      expenseInstallments.style.display = 'block'
    } else {
      modalTitle.innerText = 'Agregar'
    }

    expenseCategory.innerHTML = expenseCategories.expenses
    expenseCategory.selectedIndex = 0
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

let name = ''

if (currentType === 'investments') {

  name = expenseCategory.value

} else {

  name = expenseName.value.trim()
}

    const amount = Number(expenseAmount.value)

  if (
  (!name && currentType !== 'investments')
  || !amount
) {

  alert('Completá nombre y monto')

  return
}

   let expense = {
  name,
  amount,
  account: expenseAccount.value,
  category: expenseCategory.value,
  currency: expenseCurrency.value || 'ARS',
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

if (editingId) {

  await deleteExpense(editingId)

  expense.id = editingId
}

await addExpense(currentType, expense)

console.log(currentType)
console.log(expense)

editingId = null

    await loadExpenses()
    renderExpenses()

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

  renderInvestments()

  renderInvestmentsSummary()

  renderRealCurrencySummary()

  renderConvertedInvestmentsSummary()

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
  onclick="editExpense('${expense.id}', 'income')"
>
  ✏️
</button>

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
  onclick="editExpense('${expense.id}', 'fixed')"
>
  ✏️
</button>

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

function renderInvestments() {

  const list =
    document.querySelector('#investments-list')

  list.innerHTML = ''

  let total = 0

 getExpenses('investments')

    .forEach(expense => {

      total += expense.amount

      list.innerHTML += `

        <div class="expense-item">

          <div>

            <span>${expense.name}</span>

            <small>
              ${expense.category || 'Otros'}
            </small>

          </div>

          <div style="
            display:flex;
            gap:10px;
            align-items:center;
          ">

       <strong>

  ${expense.currency || 'ARS'}

  ${expense.amount.toLocaleString()}

</strong>

<button
  onclick="editExpense('${expense.id}', 'investments')"
>
  ✏️
</button>

<button
  onclick="removeExpense('${expense.id}')"
>
  🗑️
</button>

          </div>

        </div>
      `
    })

}

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
  onclick="editExpense('${expense.id}', 'unique')"
>
  ✏️
</button>

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

function renderInvestmentsSummary() {

  const container =
    document.querySelector(
      '#investments-summary'
    )

  container.innerHTML = ''

  const investments =
    getExpenses('investments')

  const grouped = {}

  investments.forEach(item => {

    const category =
      item.category || 'Otros'

    if (!grouped[category]) {

      grouped[category] = {
        ARS: 0,
        USD: 0
      }
    }

    if (item.currency === 'USD') {

      grouped[category].USD +=
        item.amount

    } else {

      grouped[category].ARS +=
        item.amount
    }
  })

  Object.entries(grouped).forEach(
    ([category, values]) => {

      let emoji = '💼'

      if (category === 'Acciones') {
        emoji = '📈'
      }

      if (category === 'Crypto') {
        emoji = '🪙'
      }

      if (category === 'Plazo Fijo') {
        emoji = '🏦'
      }

      if (category === 'Fondos Comunes') {
        emoji = '📊'
      }

      if (category === 'Dólares') {
        emoji = '💵'
      }

      container.innerHTML += `

        <div class="summary-card">

          <h3>
            ${emoji} ${category}
          </h3>

          <div class="summary-item">

            <span>
              ARS
            </span>

            <strong>
              $${values.ARS.toLocaleString()}
            </strong>

          </div>

          <div class="summary-item">

            <span>
              USD
            </span>

            <strong>
              ${values.USD.toLocaleString()} USD
            </strong>

          </div>

        </div>
      `
    }
  )
}

function renderRealCurrencySummary() {

  const container =
    document.querySelector(
      '#investments-real-summary'
    )

  container.innerHTML = ''

  const investments =
    getExpenses('investments')

  let arsTotal = 0

  let usdTotal = 0

  investments.forEach(item => {

    if (item.currency === 'USD') {

      usdTotal += item.amount

    } else {

      arsTotal += item.amount
    }
  })

  container.innerHTML = `

    <div class="summary-card">

      <div class="summary-item">

        <span>
          🇦🇷 Pesos reales
        </span>

        <strong>
          $${arsTotal.toLocaleString()}
        </strong>

      </div>

      <div class="summary-item">

        <span>
          🇺🇸 Dólares reales
        </span>

        <strong>
          ${usdTotal.toLocaleString()} USD
        </strong>

      </div>

    </div>
  `
}

function renderConvertedInvestmentsSummary() {

  const dollarElement =
    document.querySelector(
      '#dollar-rate'
    )

  if (dollarElement) {

    dollarElement.innerText =
      `USD $${dollarRate}`
  }

  const container =
    document.querySelector(
      '#investments-converted-summary'
    )

  if (!container) return

  container.innerHTML = ''

  const investments =
    getExpenses('investments') || []

  let arsTotal = 0

  let usdTotal = 0

  investments.forEach(item => {

    const amount =
      Number(item.amount) || 0

    if (item.currency === 'USD') {

      usdTotal += amount

      arsTotal +=
        amount * dollarRate

    } else {

      arsTotal += amount

      usdTotal +=
        amount / dollarRate
    }
  })

  container.innerHTML = `

    <div class="summary-card">

      <div class="summary-item">

        <span>
          💰 Total en pesos
        </span>

        <strong>
          $${arsTotal.toLocaleString()}
        </strong>

      </div>

      <div class="summary-item">

        <span>
          💵 Total en dólares
        </span>

        <strong>
          ${usdTotal.toFixed(2)} USD
        </strong>

      </div>

    </div>
  `
}

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
  onclick="editExpense('${expense.id}', 'installments')"
>
  ✏️
</button>

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
    document.querySelector(
      '#categories-summary'
    )

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

        return (
          remaining > 0 &&
          monthsPassed >= 0
        )
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
        grandTotal > 0
          ? Math.round(
              (total / grandTotal) * 100
            )
          : 0

      const safePercent =
        Math.max(percent, 4)

      const safeCategory =
        category
          .replace(/\s/g, '')
          .replace('/', '')

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
              class="category-fill category-${safeCategory}"
              style="width:${safePercent}%"
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
  
    .reduce((acc, item) => acc + item.amount, 0)
const fixed =
  getExpenses('fixed')
    .reduce((acc, item) =>
      acc + item.amount, 0)

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
  
  document.querySelector('#balance-total').innerText =
    `$${total.toLocaleString()}`
}

// =========================
// START
// =========================

async function loadDollarRate() {

  try {

    const response =
      await fetch(
        'https://dolarapi.com/v1/dolares/blue'
      )

    const data =
      await response.json()

    dollarRate = data.venta

    console.log(
      'Dólar actualizado:',
      dollarRate
    )

  } catch (error) {

    console.error(
      'Error obteniendo dólar',
      error
    )
  }
}

async function start() {

  const dashboardTab =
  document.querySelector(
    '#dashboard-tab'
  )

const patrimonyTab =
  document.querySelector(
    '#patrimony-tab'
  )

const dashboardSection =
  document.querySelector(
    '#dashboard-section'
  )

const patrimonySection =
  document.querySelector(
    '#patrimony-section'
  )

dashboardTab.addEventListener(
  'click',
  () => {

    patrimonySection.classList.add(
      'hidden-section'
    )

    dashboardSection.classList.remove(
      'hidden-section'
    )

    dashboardSection.animate(
      [
        {
          opacity: 0,
          transform:
            'translateX(50px)'
        },

        {
          opacity: 1,
          transform:
            'translateX(0)'
        }
      ],
      {
        duration: 350,
        easing: 'ease'
      }
    )

    dashboardTab.classList.add(
      'active'
    )

    patrimonyTab.classList.remove(
      'active'
    )
  }
)

patrimonyTab.addEventListener(
  'click',
  () => {

    dashboardSection.classList.add(
      'hidden-section'
    )

    patrimonySection.classList.remove(
      'hidden-section'
    )

    patrimonySection.animate(
      [
        {
          opacity: 0,
          transform:
            'translateX(50px)'
        },

        {
          opacity: 1,
          transform:
            'translateX(0)'
        }
      ],
      {
        duration: 350,
        easing: 'ease'
      }
    )

    patrimonyTab.classList.add(
      'active'
    )

    dashboardTab.classList.remove(
      'active'
    )
  }
)

  await loadDollarRate()

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
window.editExpense = function(id, type) {

  const expense =
    getExpenses(type)
      .find(item => item.id === id)

  if (!expense) return

  editingId = id

  openModal(type)

  expenseName.value =
    expense.name || ''

  expenseAmount.value =
    expense.amount || ''

  expenseCategory.value =
    expense.category || ''

  if (expense.account) {

    expenseAccount.value =
      expense.account
  }
}