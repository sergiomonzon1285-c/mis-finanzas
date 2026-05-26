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
  <div class="top-navigation">
    <header class="topbar">
      <h1>
        <span class="brand-mark">MF</span>
        Mis Finanzas
      </h1>

      <div class="topbar-controls">
        <button
          class="theme-toggle"
          id="theme-toggle"
          type="button"
          aria-label="Cambiar modo noche"
        >
          🌙
        </button>

        <button id="refresh-btn">🔄 Refrescar</button>
        <select class="month-select" id="month-select"></select>
      </div>
    </header>

    <div class="tabs">
      <button class="tab-btn active" id="dashboard-tab">📊 Dashboard</button>
      <button class="tab-btn" id="patrimony-tab">💼 Patrimonio</button>
    </div>

    <div class="quick-nav">
      <button data-scroll-target="#income-section">
        <span class="quick-nav-icon">💰</span>
        <span>Ingresos</span>
      </button>

      <button data-scroll-target="#fixed-section">
        <span class="quick-nav-icon">📌</span>
        <span>Fijos</span>
      </button>

      <button data-scroll-target="#installments-section">
        <span class="quick-nav-icon">💳</span>
        <span>Cuotas</span>
      </button>

      <button data-scroll-target="#unique-section">
        <span class="quick-nav-icon">🛒</span>
        <span>Único Pago</span>
      </button>

      <button data-scroll-target="#balance-section">
        <span class="quick-nav-icon">📊</span>
        <span>Balance</span>
      </button>
    </div>
  </div>

  <main>
    <div id="dashboard-section" class="page-section dashboard-section">
      <section id="income-section" class="card income">
        <div class="card-header">
          <h2>Ingresos</h2>
          <span id="income-total">$0</span>
        </div>

        <div class="expense-list" id="income-list"></div>
        <button class="add-btn" id="add-income">+ Agregar</button>
      </section>

      <section id="fixed-section" class="card fixed">
        <div class="card-header">
          <h2>Gastos Fijos</h2>
          <span id="fixed-total">$0</span>
        </div>

        <div class="expense-list" id="fixed-list"></div>
        <button class="add-btn" id="add-fixed">+ Agregar</button>
      </section>

      <section id="installments-section" class="card installments">
        <div class="card-header">
          <h2>Cuotas</h2>
          <span id="installments-total">$0</span>
        </div>

        <div class="expense-list" id="installments-list"></div>
        <button class="add-btn" id="add-installment">+ Agregar</button>
      </section>

      <section id="unique-section" class="card unique">
        <div class="card-header">
          <h2>Único Pago</h2>
          <span id="unique-total">$0</span>
        </div>

        <div class="expense-list" id="unique-list"></div>
        <button class="add-btn" id="add-unique">+ Agregar</button>
      </section>

      <div id="balance-section" class="summary-card">
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

      <div class="summary-card">
        <h3>Tarjetas</h3>
        <div id="accounts-summary"></div>
      </div>

      <div class="summary-card">
        <h3>Categorías</h3>
        <div id="categories-summary"></div>
      </div>
    </div>

    <div id="patrimony-section" class="page-section hidden-section">
      <section class="investments-section">
        <div class="investments-header">
          <div>
            <h2>💼 Patrimonio</h2>
            <small id="dollar-rate">Dólar hoy: USD $0</small>
          </div>

          <button class="add-btn investments-add-btn" id="add-investments">
            + Agregar inversión
          </button>
        </div>

        <div id="investments-summary"></div>

        <div class="patrimony-totals-title">
          <h3>Totales del patrimonio</h3>
        </div>

        <div id="investments-real-summary"></div>
        <div id="investments-converted-summary"></div>

        <div class="investments-detail-title">
          <h3>Detalle de inversiones</h3>
        </div>

        <div class="expense-list" id="investments-list"></div>
      </section>
    </div>
  </main>
</div>

<div class="modal hidden" id="modal">
  <div class="modal-content">
    <h2 id="modal-title">Agregar</h2>

    <input type="text" id="expense-name" placeholder="Nombre">
    <input type="number" id="expense-amount" placeholder="Monto">

    <select id="expense-account">
      <option value="Visa">Visa</option>
      <option value="Mastercard">Mastercard</option>
      <option value="Amex">Amex</option>
      <option value="Efectivo">Efectivo</option>
    </select>

    <select id="expense-category"></select>

    <select id="expense-currency" class="hidden">
      <option value="ARS">🇦🇷 Pesos ARS</option>
      <option value="USD">🇺🇸 Dólares USD</option>
    </select>

    <input
      type="number"
      id="expense-installments"
      placeholder="Cantidad de cuotas"
      class="hidden-section"
    >

    <button id="save-expense">Guardar</button>
  </div>
</div>
`

let currentType = null
let editingId = null
let selectedMonth = getCurrentMonthKey()
let dollarRate = 1230
let expandedCategory = null
let expandedAccount = null

const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')
const expenseName = document.querySelector('#expense-name')
const expenseAmount = document.querySelector('#expense-amount')
const expenseAccount = document.querySelector('#expense-account')
const expenseCategory = document.querySelector('#expense-category')
const expenseCurrency = document.querySelector('#expense-currency')
const expenseInstallments = document.querySelector('#expense-installments')
const monthSelect = document.querySelector('#month-select')
const themeToggle = document.querySelector('#theme-toggle')

const savedTheme = localStorage.getItem('theme')

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode')
  themeToggle.innerText = '☀️'
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode')

  const isDarkMode = document.body.classList.contains('dark-mode')

  themeToggle.innerText = isDarkMode ? '☀️' : '🌙'
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
})

const expenseCategories = {
  expenses: `
    <option value="Otros">📦 Otros</option>
    <option value="Ahorro/Inversión">💼 Ahorro/Inversión</option>
    <option value="Hogar">🏠 Hogar</option>
    <option value="Ropa">👕 Ropa</option>
    <option value="Supermercado">🛒 Supermercado</option>
    <option value="Mantenimiento">🔧 Mantenimiento</option>
    <option value="Impuestos">🧾 Impuestos</option>
    <option value="Vehiculos">🚗 Vehiculos</option>
    <option value="Ocio">🎮 Ocio</option>
    <option value="Ayudas">🤝 Ayudas</option>
    <option value="Familia">👨‍👩‍👧 Familia</option>
    <option value="Regalos">🎁 Regalos</option>
  `,
  investments: `
    <option value="Acciones">📈 Acciones</option>
    <option value="Crypto">🪙 Crypto</option>
    <option value="Plazo Fijo">🏦 Plazo Fijo</option>
    <option value="Fondos Comunes">📊 Fondos Comunes</option>
    <option value="Dólares">💵 Dólares</option>
  `
}

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

document.querySelectorAll('[data-scroll-target]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.dataset.scrollTarget)
    const navigation = document.querySelector('.top-navigation')

    if (!target || !navigation) return

    const navigationHeight = navigation.offsetHeight
    const targetTop = target.getBoundingClientRect().top + window.scrollY
    const scrollTop = targetTop - navigationHeight - 14

    window.scrollTo({
      top: Math.max(scrollTop, 0),
      behavior: 'smooth'
    })
  })
})

document.querySelector('#add-income').addEventListener('click', () => {
  openModal('income')
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

document.querySelector('#add-investments').addEventListener('click', () => {
  openModal('investments')
})

function openModal(type) {
  currentType = type

  expenseAccount.value = 'Visa'
  expenseName.value = ''
  expenseAmount.value = ''
  expenseInstallments.value = ''
  expenseCurrency.value = 'ARS'

  expenseAccount.style.display = 'block'
  expenseName.style.display = 'block'
  expenseCurrency.style.display = 'none'
  expenseInstallments.style.display = 'none'

  expenseCurrency.classList.remove('hidden')
  expenseCurrency.classList.remove('hidden-section')
  expenseInstallments.classList.remove('hidden-section')

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
    return
  }

  const titles = {
    income: 'Agregar ingreso',
    fixed: 'Agregar gasto fijo',
    unique: 'Agregar único pago',
    installments: 'Agregar cuota'
  }

  modalTitle.innerText = titles[type] || 'Agregar'
  expenseCategory.innerHTML = expenseCategories.expenses
  expenseCategory.selectedIndex = 0

  if (type === 'installments') {
    expenseInstallments.style.display = 'block'
  }
}

modal.addEventListener('click', event => {
  if (event.target.id === 'modal') {
    closeModal()
  }
})

document.querySelector('#save-expense').addEventListener('click', async () => {
  const name =
    currentType === 'investments'
      ? expenseCategory.value
      : expenseName.value.trim()

  const amount = Number(expenseAmount.value)

  if ((!name && currentType !== 'investments') || !amount || amount <= 0) {
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

  if (currentType === 'installments') {
    const installments = Number(expenseInstallments.value)

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

    expense.start_month = selectedMonth
    expense.created_month = selectedMonth
  }

  if (editingId) {
    await deleteExpense(editingId)
    expense.id = editingId
  }

  await addExpense(currentType, expense)
  editingId = null

  await loadExpenses()
  renderExpenses()
  closeModal()
})

function closeModal() {
  expenseName.value = ''
  expenseAmount.value = ''
  expenseInstallments.value = ''
  modal.classList.add('hidden')
}

function getActiveInstallments() {
  return getExpenses('installments')
    .filter(expense => {
      const monthsPassed = getMonthDifference(
        expense.start_month,
        selectedMonth
      )

      const remaining = expense.installments - monthsPassed

      return remaining > 0 && monthsPassed >= 0
    })
}

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

function renderIncome() {
  const list = document.querySelector('#income-list')
  list.innerHTML = ''

  let total = 0

  getExpenses('income')
    .filter(expense => expense.created_month === selectedMonth)
    .forEach(expense => {
      total += expense.amount
      list.innerHTML += createExpenseItem(expense, 'income')
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
    list.innerHTML += createExpenseItem(expense, 'fixed')
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
      list.innerHTML += createExpenseItem(expense, 'unique')
    })

  document.querySelector('#unique-total').innerText =
    `$${total.toLocaleString()}`
}

function renderInstallments() {
  const list = document.querySelector('#installments-list')
  list.innerHTML = ''

  let total = 0

  getActiveInstallments().forEach(expense => {
    const monthsPassed = getMonthDifference(
      expense.start_month,
      selectedMonth
    )

    const remaining = expense.installments - monthsPassed

    total += expense.amount

    list.innerHTML += `
      <div class="expense-item">
        <div>
          <span>${expense.name}</span>
          <small>${expense.account || 'Sin cuenta'} · ${remaining} cuotas restantes</small>
        </div>

        <div class="expense-actions">
          <strong>$${expense.amount.toLocaleString()}</strong>
          <button onclick="editExpense('${expense.id}', 'installments')" aria-label="Editar">
            ${getEditIcon()}
          </button>

          <button onclick="removeExpense('${expense.id}')" aria-label="Eliminar">
            ${getDeleteIcon()}
          </button>
        </div>
      </div>
    `
  })

  document.querySelector('#installments-total').innerText =
    `$${total.toLocaleString()}`
}

function renderInvestments() {
  const list = document.querySelector('#investments-list')
  list.innerHTML = ''

  getExpenses('investments').forEach(expense => {
    list.innerHTML += `
      <div class="expense-item">
        <div>
          <span>${expense.name}</span>
          <small>${expense.category || 'Otros'}</small>
        </div>

        <div class="expense-actions">
          <strong>
            ${expense.currency || 'ARS'}
            ${expense.amount.toLocaleString()}
          </strong>

          <button onclick="editExpense('${expense.id}', 'investments')" aria-label="Editar">
            ${getEditIcon()}
          </button>

          <button onclick="removeExpense('${expense.id}')" aria-label="Eliminar">
            ${getDeleteIcon()}
          </button>
        </div>
      </div>
    `
  })
}

function createExpenseItem(expense, type) {
  return `
    <div class="expense-item">
      <div>
        <span>${expense.name}</span>
        <small>${expense.account || 'Sin cuenta'}</small>
      </div>

      <div class="expense-actions">
        <strong>$${expense.amount.toLocaleString()}</strong>
        <button onclick="editExpense('${expense.id}', '${type}')" aria-label="Editar">
          ${getEditIcon()}
        </button>

        <button onclick="removeExpense('${expense.id}')" aria-label="Eliminar">
          ${getDeleteIcon()}
        </button>
      </div>
    </div>
  `
}

function getEditIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4.2L18.9 9.3l-4.2-4.2L4 15.8V20Z"></path>
      <path d="m13.5 6.3 4.2 4.2"></path>
    </svg>
  `
}

function getDeleteIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12"></path>
      <path d="M9 7V5h6v2"></path>
      <path d="M9 10v8"></path>
      <path d="M15 10v8"></path>
      <path d="M7 7l1 13h8l1-13"></path>
    </svg>
  `
}

function renderInvestmentsSummary() {
  const container = document.querySelector('#investments-summary')
  container.innerHTML = ''

  const grouped = {}

  getExpenses('investments').forEach(item => {
    const category = item.category || 'Otros'

    if (!grouped[category]) {
      grouped[category] = {
        ARS: 0,
        USD: 0
      }
    }

    if (item.currency === 'USD') {
      grouped[category].USD += item.amount
    } else {
      grouped[category].ARS += item.amount
    }
  })

  Object.entries(grouped).forEach(([category, values]) => {
    const emojis = {
      Acciones: '📈',
      Crypto: '🪙',
      'Plazo Fijo': '🏦',
      'Fondos Comunes': '📊',
      Dólares: '💵'
    }

    container.innerHTML += `
      <div class="summary-card">
        <h3>${emojis[category] || '💼'} ${category}</h3>

        <div class="summary-item">
          <span>ARS</span>
          <strong>$${values.ARS.toLocaleString()}</strong>
        </div>

        <div class="summary-item">
          <span>USD</span>
          <strong>${values.USD.toLocaleString()} USD</strong>
        </div>
      </div>
    `
  })
}

function renderRealCurrencySummary() {
  const container = document.querySelector('#investments-real-summary')
  container.innerHTML = ''

  let arsTotal = 0
  let usdTotal = 0

  getExpenses('investments').forEach(item => {
    if (item.currency === 'USD') {
      usdTotal += item.amount
    } else {
      arsTotal += item.amount
    }
  })

  container.innerHTML = `
    <div class="summary-card">
      <div class="summary-item">
        <span>🇦🇷 Pesos reales</span>
        <strong>$${arsTotal.toLocaleString()}</strong>
      </div>

      <div class="summary-item">
        <span>🇺🇸 Dólares reales</span>
        <strong>${usdTotal.toLocaleString()} USD</strong>
      </div>
    </div>
  `
}

function renderConvertedInvestmentsSummary() {
  const dollarElement = document.querySelector('#dollar-rate')
  const container = document.querySelector('#investments-converted-summary')

  if (dollarElement) {
    dollarElement.innerText = `Dólar hoy: USD $${dollarRate}`
  }

  if (!container) return

  let arsTotal = 0
  let usdTotal = 0

  getExpenses('investments').forEach(item => {
    const amount = Number(item.amount) || 0

    if (item.currency === 'USD') {
      usdTotal += amount
      arsTotal += amount * dollarRate
    } else {
      arsTotal += amount
      usdTotal += amount / dollarRate
    }
  })

  container.innerHTML = `
    <div class="summary-card">
      <div class="summary-item">
        <span>💰 Total en pesos</span>
        <strong>$${arsTotal.toLocaleString()}</strong>
      </div>

      <div class="summary-item">
        <span>💵 Total en dólares</span>
        <strong>${usdTotal.toFixed(2)} USD</strong>
      </div>
    </div>
  `
}

function renderAccountsSummary() {
  const container = document.querySelector('#accounts-summary')
  container.innerHTML = ''

  const expenses = [
    ...getExpenses('fixed')
      .map(expense => ({ ...expense, type: 'fixed' })),
    ...getExpenses('unique')
      .filter(item => item.created_month === selectedMonth)
      .map(expense => ({ ...expense, type: 'unique' })),
    ...getActiveInstallments()
      .map(expense => ({ ...expense, type: 'installments' }))
  ]

  const grouped = {}

  expenses.forEach(expense => {
    const account = expense.account || 'Sin cuenta'

    if (!grouped[account]) {
      grouped[account] = {
        total: 0,
        items: []
      }
    }

    grouped[account].total += expense.amount
    grouped[account].items.push(expense)
  })

  Object.entries(grouped)
    .map(([account, data]) => ({
      account,
      total: data.total,
      items: data.items.sort((a, b) => b.amount - a.amount)
    }))
    .sort((a, b) => b.total - a.total)
    .forEach(({ account, total, items }) => {
      const isOpen = expandedAccount === account
      const detailItems = items
        .map(expense => createAccountDetailItem(expense))
        .join('')

      container.innerHTML += `
        <div class="account-item ${isOpen ? 'open' : ''}">
          <button
            class="account-summary"
            type="button"
            data-account="${account}"
          >
            <span>${account}</span>
            <strong>$${total.toLocaleString()}</strong>
          </button>

          ${
            isOpen
              ? `
                <div class="account-detail">
                  <div class="account-detail-title">
                    Gastos con ${account}
                  </div>

                  ${detailItems}
                </div>
              `
              : ''
          }
        </div>
      `
    })
}

document.querySelector('#accounts-summary').addEventListener('click', event => {
  const summaryButton = event.target.closest('.account-summary')

  if (!summaryButton) return

  const account = summaryButton.dataset.account

  expandedAccount =
    expandedAccount === account
      ? null
      : account

  renderAccountsSummary()
})

function createAccountDetailItem(expense) {
  const label = getExpenseTypeLabel(expense.type)
  const category = expense.category || 'Otros'

  return `
    <div class="account-detail-item">
      <div>
        <strong>${expense.name || 'Sin nombre'}</strong>
        <small>${label} · ${category}</small>
      </div>

      <span>$${expense.amount.toLocaleString()}</span>
    </div>
  `
}

function renderCategoriesSummary() {
  const container = document.querySelector('#categories-summary')
  container.innerHTML = ''

  const expenses = [
    ...getExpenses('fixed')
      .map(expense => ({ ...expense, type: 'fixed' })),
    ...getExpenses('unique')
      .filter(item => item.created_month === selectedMonth)
      .map(expense => ({ ...expense, type: 'unique' })),
    ...getActiveInstallments()
      .map(expense => ({ ...expense, type: 'installments' }))
  ]

  const grouped = {}
  let grandTotal = 0

  expenses.forEach(expense => {
    const category = expense.category || 'Otros'

    if (!grouped[category]) {
      grouped[category] = {
        total: 0,
        items: []
      }
    }

    grouped[category].total += expense.amount
    grouped[category].items.push(expense)
    grandTotal += expense.amount
  })

  Object.entries(grouped)
    .map(([category, data]) => {
      const total = data.total
      const percent = grandTotal > 0 ? (total / grandTotal) * 100 : 0
      return {
        category,
        total,
        percent,
        items: data.items.sort((a, b) => b.amount - a.amount)
      }
    })
    .sort((a, b) => b.percent - a.percent)
    .forEach(({ category, total, percent, items }) => {
      const safePercent = Math.max(Math.round(percent), 4)
      const isOpen = expandedCategory === category
      const detailItems = items
        .map(expense => createCategoryDetailItem(expense))
        .join('')

      container.innerHTML += `
        <div class="category-item ${isOpen ? 'open' : ''}">
          <button
            class="category-summary"
            type="button"
            data-category="${category}"
          >
            <div class="category-line">
              <span class="category-name">${category}</span>
              <span class="category-right">
                <strong class="category-amount">$${total.toLocaleString()}</strong>
                <span class="category-chevron">${isOpen ? '⌃' : '⌄'}</span>
              </span>
            </div>

            <div class="category-meter">
              <span class="category-percent-inline">${Math.round(percent)}%</span>

              <div class="category-bar">
                <div
                  class="category-fill"
                  style="width:${safePercent}%; background:${getCategoryColor(category)};"
                ></div>
              </div>
            </div>
          </button>

          ${
            isOpen
              ? `
                <div class="category-detail">
                  <div class="category-detail-title">
                    Gastos en ${category}
                  </div>

                  ${detailItems}
                </div>
              `
              : ''
          }
        </div>
      `
    })
}

document.querySelector('#categories-summary').addEventListener('click', event => {
  const summaryButton = event.target.closest('.category-summary')

  if (!summaryButton) return

  const category = summaryButton.dataset.category

  expandedCategory =
    expandedCategory === category
      ? null
      : category

  renderCategoriesSummary()
})

function createCategoryDetailItem(expense) {
  const label = getExpenseTypeLabel(expense.type)
  const account = expense.account || 'Sin cuenta'

  return `
    <div class="category-detail-item">
      <div>
        <strong>${expense.name || 'Sin nombre'}</strong>
        <small>${label} · ${account}</small>
      </div>

      <span>$${expense.amount.toLocaleString()}</span>
    </div>
  `
}

function getExpenseTypeLabel(type) {
  const labels = {
    fixed: 'Fijo',
    unique: 'Único pago',
    installments: 'Cuota'
  }

  return labels[type] || 'Gasto'
}

function getCategoryColor(category) {
  const safeCategory = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '')
    .replace(/\//g, '')

  const colors = {
    Otros: '#64748b',
    AhorroInversion: '#6366f1',
    Hogar: '#3b82f6',
    Ropa: '#ec4899',
    Supermercado: '#22c55e',
    Mantenimiento: '#f59e0b',
    Impuestos: '#0ea5e9',
    Vehiculos: '#9c0909',
    Ocio: '#8b5cf6',
    Ayudas: '#06b6d4',
    Familia: '#14b8a6',
    Regalos: '#eab308',
    Acciones: '#22c55e',
    Crypto: '#f59e0b',
    PlazoFijo: '#3b82f6',
    FondosComunes: '#8b5cf6',
    Dolares: '#16a34a'
  }

  return colors[safeCategory] || '#64748b'
}

function updateGlobalTotal() {
  const income = getExpenses('income')
    .filter(item => item.created_month === selectedMonth)
    .reduce((acc, item) => acc + item.amount, 0)

  const fixed = getExpenses('fixed')
    .reduce((acc, item) => acc + item.amount, 0)

  const unique = getExpenses('unique')
    .filter(item => item.created_month === selectedMonth)
    .reduce((acc, item) => acc + item.amount, 0)

  const installments = getActiveInstallments()
    .reduce((acc, item) => acc + item.amount, 0)

  const expensesTotal = fixed + unique + installments
  const total = income - expensesTotal

  document.querySelector('#expenses-total').innerText =
    `$${expensesTotal.toLocaleString()}`

  document.querySelector('#balance-total').innerText =
    `$${total.toLocaleString()}`
}

async function loadDollarRate() {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue')
    const data = await response.json()
    dollarRate = data.venta
  } catch (error) {
    console.error('Error obteniendo dólar', error)
  }
}

async function start() {
  const appShell = document.querySelector('.app')
  const dashboardTab = document.querySelector('#dashboard-tab')
  const patrimonyTab = document.querySelector('#patrimony-tab')
  const dashboardSection = document.querySelector('#dashboard-section')
  const patrimonySection = document.querySelector('#patrimony-section')

  dashboardTab.addEventListener('click', () => {
    appShell.classList.remove('patrimony-view')
    patrimonySection.classList.add('hidden-section')
    dashboardSection.classList.remove('hidden-section')
    dashboardTab.classList.add('active')
    patrimonyTab.classList.remove('active')
    animateSection(dashboardSection)
  })

  patrimonyTab.addEventListener('click', () => {
    appShell.classList.add('patrimony-view')
    dashboardSection.classList.add('hidden-section')
    patrimonySection.classList.remove('hidden-section')
    patrimonyTab.classList.add('active')
    dashboardTab.classList.remove('active')
    animateSection(patrimonySection)
  })

  await loadDollarRate()
  await loadExpenses()
  renderExpenses()
}

function animateSection(section) {
  section.animate(
    [
      {
        opacity: 0,
        transform: 'translateX(50px)'
      },
      {
        opacity: 1,
        transform: 'translateX(0)'
      }
    ],
    {
      duration: 350,
      easing: 'ease'
    }
  )
}

document.querySelector('#refresh-btn').addEventListener('click', async () => {
  await loadExpenses()
  renderExpenses()
  alert('Datos actualizados')
})

window.removeExpense = async function(id) {
  const confirmDelete = confirm('¿Eliminar este gasto?')

  if (!confirmDelete) return

  await deleteExpense(id)
  await loadExpenses()
  renderExpenses()
}

window.editExpense = function(id, type) {
  const expense = getExpenses(type)
    .find(item => item.id === id)

  if (!expense) return

  editingId = id
  openModal(type)

  expenseName.value = expense.name || ''
  expenseAmount.value = expense.amount || ''
  expenseCategory.value = expense.category || ''

  if (expense.account) {
    expenseAccount.value = expense.account
  }

  if (expense.currency) {
    expenseCurrency.value = expense.currency
  }

  if (type === 'installments') {
    expenseInstallments.value = expense.installments || ''
  }
}

start()
