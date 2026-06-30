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
      <div class="topbar-title-group">
        <h1>
          <span class="brand-mark">MF</span>
          Mis Finanzas
        </h1>

        <div class="user-greeting-row">
          <span id="user-greeting">Hola</span>
          <button
            class="tips-btn"
            id="tips-btn"
            type="button"
            aria-label="Ver tip financiero"
          >
            💡
          </button>
        </div>
      </div>

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
      <button class="tab-btn" id="settings-tab">⚙️ Configuración</button>
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

      <button data-scroll-target="#card-dates-section">
        <span class="quick-nav-icon">📅</span>
        <span>Vtos.</span>
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

        <button class="add-btn" id="add-income">+ Agregar</button>
        <div class="expense-list" id="income-list"></div>
      </section>

      <section id="fixed-section" class="card fixed">
        <div class="card-header">
          <h2>Gastos Fijos</h2>
          <span id="fixed-total">$0</span>
        </div>

        <button class="add-btn" id="add-fixed">+ Agregar</button>
        <div class="expense-list" id="fixed-list"></div>
      </section>

      <section id="installments-section" class="card installments">
        <div class="card-header">
          <h2>Cuotas</h2>
          <span id="installments-total">$0</span>
        </div>

        <button class="add-btn" id="add-installment">+ Agregar</button>
        <div class="expense-list" id="installments-list"></div>
      </section>

      <section id="unique-section" class="card unique">
        <div class="card-header">
          <h2>Único Pago</h2>
          <span id="unique-total">$0</span>
        </div>

        <button class="add-btn" id="add-unique">+ Agregar</button>
        <div class="expense-list" id="unique-list"></div>
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

      <div class="summary-card cashflow-chart-card">
        <div class="report-card-header">
          <h3>Evolución mensual</h3>
          <button
            class="report-btn"
            id="monthly-report-btn"
            type="button"
          >
            PDF
          </button>
        </div>

        <div
          id="cashflow-chart"
          class="cashflow-chart"
        ></div>
      </div>

      <div class="summary-card">
        <h3>Tarjetas</h3>
        <div id="accounts-summary"></div>
      </div>

      <div id="card-dates-section" class="summary-card card-dates-card">
        <div class="card-dates-header">
          <h3>Vencimientos</h3>

          <button
            class="notification-btn"
            id="enable-notifications"
            type="button"
          >
            Activar avisos
          </button>
        </div>

        <small class="card-dates-note">
          Tarjetas: aviso el dia anterior. Plazos fijos: aviso el mismo dia.
          El email queda guardado en Configuracion para activar envios cuando
          conectes un servicio de correo.
        </small>

        <div class="card-dates-form">
          <select id="card-date-account">
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Amex">Amex</option>
            <option value="Efectivo">Efectivo</option>
          </select>

          <input
            type="date"
            id="card-closing-day"
            aria-label="Fecha de cierre"
          >

          <input
            type="date"
            id="card-due-day"
            aria-label="Fecha de vencimiento"
          >

          <button id="save-card-date" type="button">
            Guardar
          </button>
        </div>

        <div id="card-dates-list"></div>
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
          <h3>Evolución del patrimonio</h3>
        </div>

        <div
          id="patrimony-chart"
          class="patrimony-chart"
        ></div>

        <div class="investments-detail-title">
          <h3>Detalle de inversiones</h3>
        </div>

        <div class="expense-list" id="investments-list"></div>
      </section>
    </div>

    <div id="settings-section" class="page-section hidden-section">
      <section class="settings-section">
        <div class="settings-header">
          <h2>⚙️ Configuración</h2>
          <small>Personalización e identidad del dispositivo</small>
        </div>

        <div class="settings-grid">
          <div class="summary-card">
            <h3>Perfil</h3>

            <div class="settings-form">
              <input
                type="text"
                id="profile-first-name"
                placeholder="Nombre"
              >

              <input
                type="text"
                id="profile-last-name"
                placeholder="Apellido opcional"
              >

              <input
                type="email"
                id="profile-email"
                placeholder="Email para alertas opcional"
              >

              <button id="save-profile" type="button">
                Guardar perfil
              </button>

              <button
                id="logout-device"
                class="logout-device-btn"
                type="button"
              >
                Cerrar sesion en este dispositivo
              </button>
            </div>

            <div class="token-box">
              <span>Token del dispositivo</span>
              <strong id="profile-token"></strong>
            </div>
          </div>

          <div class="summary-card">
            <h3>Sincronizar dispositivo</h3>

            <div class="sync-panel">
              <div class="sync-qr" id="sync-qr"></div>

              <div class="sync-token-box">
                <span>Codigo de enlace</span>
                <strong id="sync-token-display"></strong>
              </div>

              <div class="settings-form">
                <input
                  type="text"
                  id="sync-token-input"
                  placeholder="Pegar token de otro dispositivo"
                >

                <div class="sync-actions">
                  <button id="copy-sync-token" type="button">
                    Copiar token
                  </button>

                  <button id="link-device-token" type="button">
                    Vincular
                  </button>
                </div>
              </div>

              <small class="settings-note">
                Usa este token para enlazar otro dispositivo. Guardalo antes
                de cerrar sesion.
              </small>
            </div>
          </div>

          <div class="summary-card">
            <h3>Nombres de tarjetas</h3>

            <div
              id="account-aliases-form"
              class="settings-form"
            ></div>

            <button
              class="add-btn"
              id="save-account-aliases"
              type="button"
            >
              Guardar nombres
            </button>
          </div>

          <div class="summary-card">
            <h3>Agregar tarjeta</h3>

            <div class="settings-form">
              <input
                type="text"
                id="new-account-name"
                placeholder="Ej: Visa Macro"
              >

              <button id="add-account" type="button">
                Agregar tarjeta
              </button>
            </div>
          </div>

          <div class="summary-card">
            <h3>Categorías</h3>

            <div class="settings-form">
              <input
                type="text"
                id="new-category-name"
                placeholder="Ej: Mascotas"
              >

              <button id="add-category" type="button">
                Agregar categoría
              </button>
            </div>

            <div
              id="custom-categories-list"
              class="settings-list"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>

<div class="report-modal hidden" id="report-modal">
  <div class="report-modal-header">
    <strong>Informe mensual</strong>

    <div>
      <button id="print-report" type="button">PDF</button>
      <button id="close-report" type="button">Cerrar</button>
    </div>
  </div>

  <iframe
    id="report-frame"
    title="Informe mensual Mis Finanzas"
  ></iframe>
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
      type="text"
      id="investment-bank"
      placeholder="Banco"
      class="hidden-section"
    >

    <input
      type="date"
      id="investment-due-date"
      class="hidden-section"
    >

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
const expandedExpenseSections = {
  income: false,
  fixed: false,
  installments: false,
  unique: false,
  investments: false
}

const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')
const expenseName = document.querySelector('#expense-name')
const expenseAmount = document.querySelector('#expense-amount')
const expenseAccount = document.querySelector('#expense-account')
const expenseCategory = document.querySelector('#expense-category')
const expenseCurrency = document.querySelector('#expense-currency')
const investmentBank = document.querySelector('#investment-bank')
const investmentDueDate = document.querySelector('#investment-due-date')
const expenseInstallments = document.querySelector('#expense-installments')
const monthSelect = document.querySelector('#month-select')
const themeToggle = document.querySelector('#theme-toggle')
const userGreeting = document.querySelector('#user-greeting')
const tipsButton = document.querySelector('#tips-btn')
const monthlyReportButton = document.querySelector('#monthly-report-btn')
const reportModal = document.querySelector('#report-modal')
const reportFrame = document.querySelector('#report-frame')
const closeReportButton = document.querySelector('#close-report')
const printReportButton = document.querySelector('#print-report')
const cardDateAccount = document.querySelector('#card-date-account')
const cardClosingDay = document.querySelector('#card-closing-day')
const cardDueDay = document.querySelector('#card-due-day')
const saveCardDateButton = document.querySelector('#save-card-date')
const cardDatesList = document.querySelector('#card-dates-list')
const enableNotificationsButton =
  document.querySelector('#enable-notifications')
const profileFirstName = document.querySelector('#profile-first-name')
const profileLastName = document.querySelector('#profile-last-name')
const profileEmail = document.querySelector('#profile-email')
const profileToken = document.querySelector('#profile-token')
const saveProfileButton = document.querySelector('#save-profile')
const logoutDeviceButton = document.querySelector('#logout-device')
const syncTokenDisplay = document.querySelector('#sync-token-display')
const syncTokenInput = document.querySelector('#sync-token-input')
const copySyncTokenButton = document.querySelector('#copy-sync-token')
const linkDeviceTokenButton = document.querySelector('#link-device-token')
const syncQr = document.querySelector('#sync-qr')
const accountAliasesForm = document.querySelector('#account-aliases-form')
const saveAccountAliasesButton =
  document.querySelector('#save-account-aliases')
const newAccountName = document.querySelector('#new-account-name')
const addAccountButton = document.querySelector('#add-account')
const newCategoryName = document.querySelector('#new-category-name')
const addCategoryButton = document.querySelector('#add-category')
const customCategoriesList =
  document.querySelector('#custom-categories-list')

const cardRemindersStorageKey = 'mis-finanzas-card-reminders'
const fixedTermRemindersStorageKey = 'mis-finanzas-fixed-term-reminders'
const legacyCardDatesStorageKey = 'mis-finanzas-card-dates'
const profileStorageKey = 'mis-finanzas-profile'
const defaultAccounts = [
  'Visa',
  'Mastercard',
  'Amex',
  'Efectivo'
]
const defaultExpenseCategories = [
  {
    value: 'Otros',
    label: '📦 Otros'
  },
  {
    value: 'Ahorro/Inversión',
    label: '💼 Ahorro/Inversión'
  },
  {
    value: 'Hogar',
    label: '🏠 Hogar'
  },
  {
    value: 'Ropa',
    label: '👕 Ropa'
  },
  {
    value: 'Supermercado',
    label: '🛒 Supermercado'
  },
  {
    value: 'Mantenimiento',
    label: '🔧 Mantenimiento'
  },
  {
    value: 'Impuestos',
    label: '🧾 Impuestos'
  },
  {
    value: 'Emprendimiento',
    label: '🚀 Emprendimiento'
  },
  {
    value: 'Vehiculos',
    label: '🚗 Vehiculos'
  },
  {
    value: 'Ocio',
    label: '🎮 Ocio'
  },
  {
    value: 'Ayudas',
    label: '🤝 Ayudas'
  },
  {
    value: 'Familia',
    label: '👨‍👩‍👧 Familia'
  },
  {
    value: 'Regalos',
    label: '🎁 Regalos'
  }
]

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

tipsButton.addEventListener('click', () => {
  showFinanceTip()
})

const expenseCategories = {
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

monthSelect.addEventListener('change', async () => {
  selectedMonth = monthSelect.value
  await ensureInvestmentsForSelectedMonth()
  renderExpenses()
})

document.querySelectorAll('[data-scroll-target]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.dataset.scrollTarget)
    const navigation = document.querySelector('.top-navigation')

    if (!target || !navigation) return

    const navigationHeight = navigation.offsetHeight
    const targetTop = target.getBoundingClientRect().top + window.scrollY
    const scrollTop = targetTop - navigationHeight - 34

    window.scrollTo({
      top: Math.max(scrollTop, 0),
      behavior: 'smooth'
    })
  })
})

window.addEventListener('resize', () => {
  syncAppTopOffset()
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

expenseCategory.addEventListener('change', () => {
  updateInvestmentFields()
})

saveCardDateButton.addEventListener('click', () => {
  saveCardDate()
})

enableNotificationsButton.addEventListener('click', async () => {
  await requestCardNotificationPermission()
})

saveProfileButton.addEventListener('click', () => {
  saveProfile()
})

logoutDeviceButton.addEventListener('click', () => {
  logoutCurrentDevice()
})

copySyncTokenButton.addEventListener('click', async () => {
  await copySyncToken()
})

linkDeviceTokenButton.addEventListener('click', () => {
  linkDeviceByToken()
})

saveAccountAliasesButton.addEventListener('click', async () => {
  await saveAccountAliases()
})

addAccountButton.addEventListener('click', async () => {
  await addCustomAccount()
})

addCategoryButton.addEventListener('click', async () => {
  await addCustomCategory()
})

monthlyReportButton.addEventListener('click', () => {
  generateMonthlyReport()
})

closeReportButton.addEventListener('click', () => {
  closeMonthlyReport()
})

printReportButton.addEventListener('click', () => {
  printMonthlyReport()
})

function openModal(type) {
  currentType = type

  expenseAccount.value = 'Visa'
  expenseName.value = ''
  expenseAmount.value = ''
  expenseInstallments.value = ''
  expenseCurrency.value = 'ARS'
  investmentBank.value = ''
  investmentDueDate.value = ''

  expenseAccount.style.display = 'block'
  expenseName.style.display = 'block'
  expenseCurrency.style.display = 'none'
  expenseInstallments.style.display = 'none'
  investmentBank.style.display = 'none'
  investmentDueDate.style.display = 'none'

  expenseCurrency.classList.remove('hidden')
  expenseCurrency.classList.remove('hidden-section')
  expenseInstallments.classList.remove('hidden-section')
  investmentBank.classList.remove('hidden-section')
  investmentDueDate.classList.remove('hidden-section')

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
    updateInvestmentFields()
    return
  }

  const titles = {
    income: 'Agregar ingreso',
    fixed: 'Agregar gasto fijo',
    unique: 'Agregar único pago',
    installments: 'Agregar cuota'
  }

  modalTitle.innerText = titles[type] || 'Agregar'
  expenseCategory.innerHTML = getExpenseCategoryOptions()
  expenseCategory.selectedIndex = 0

  if (type === 'installments') {
    expenseInstallments.style.display = 'block'
  }
}

function updateInvestmentFields() {
  const isFixedTerm =
    currentType === 'investments' &&
    expenseCategory.value === 'Plazo Fijo'

  investmentBank.style.display = isFixedTerm ? 'block' : 'none'
  investmentDueDate.style.display = isFixedTerm ? 'block' : 'none'
}

modal.addEventListener('click', event => {
  if (event.target.id === 'modal') {
    closeModal()
  }
})

document.querySelector('#save-expense').addEventListener('click', async () => {
  const isFixedTerm =
    currentType === 'investments' &&
    expenseCategory.value === 'Plazo Fijo'

  const fixedTermBank = investmentBank.value.trim()
  const fixedTermDueDate = investmentDueDate.value

  const name =
    isFixedTerm
      ? fixedTermBank
      : currentType === 'investments'
      ? expenseCategory.value
      : expenseName.value.trim()

  const amount = Number(expenseAmount.value)

  if ((!name && currentType !== 'investments') || !amount || amount <= 0) {
    alert('Completá nombre y monto')
    return
  }

  if (isFixedTerm && (!fixedTermBank || !fixedTermDueDate)) {
    alert('Completá banco y vencimiento del plazo fijo')
    return
  }

  let expense = {
    name,
    amount,
    account: isFixedTerm ? fixedTermBank : expenseAccount.value,
    category: expenseCategory.value,
    currency: expenseCurrency.value || 'ARS',
    created_month: selectedMonth
  }

  if (isFixedTerm) {
    expense.start_month = fixedTermDueDate
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
  investmentBank.value = ''
  investmentDueDate.value = ''
  modal.classList.add('hidden')
}

function getProfile() {
  try {
    const savedProfile = localStorage.getItem(profileStorageKey)

    if (savedProfile) {
      return JSON.parse(savedProfile)
    }
  } catch (error) {
    console.error('Error leyendo perfil', error)
  }

  return {
    firstName: '',
    lastName: '',
    email: '',
    token: createSecureToken()
  }
}

function saveProfile() {
  const profile = {
    firstName: profileFirstName.value.trim(),
    lastName: profileLastName.value.trim(),
    email: profileEmail.value.trim(),
    token: profileToken.innerText || createSecureToken()
  }

  localStorage.setItem(
    profileStorageKey,
    JSON.stringify(profile)
  )

  renderProfile()
}

function renderProfile() {
  const profile = getProfile()

  profileFirstName.value = profile.firstName || ''
  profileLastName.value = profile.lastName || ''
  profileEmail.value = profile.email || ''
  profileToken.innerText = profile.token
  syncTokenDisplay.innerText = profile.token
  renderSyncQr(profile.token)
  userGreeting.innerText = profile.firstName
    ? `Hola, ${profile.firstName}`
    : 'Hola'

  localStorage.setItem(
    profileStorageKey,
    JSON.stringify(profile)
  )
}

function logoutCurrentDevice() {
  const profile = getProfile()
  const tokenLabel = profile.token
    ? `\n\nToken actual: ${profile.token}`
    : ''

  const shouldLogout = confirm(
    'Cerrar sesion solo borra la identidad guardada en este dispositivo. ' +
    'Anota tu token antes de continuar para no perder el acceso de enlace.' +
    tokenLabel +
    '\n\n¿Queres cerrar sesion en este dispositivo?'
  )

  if (!shouldLogout) return

  localStorage.removeItem(profileStorageKey)
  renderProfile()
  alert('Sesion cerrada en este dispositivo. Se genero un token local nuevo.')
}

async function copySyncToken() {
  const token = getProfile().token

  if (!token) return

  try {
    await navigator.clipboard.writeText(token)
    alert('Token copiado')
  } catch (error) {
    console.error('No se pudo copiar el token', error)
    alert(`Tu token es: ${token}`)
  }
}

function linkDeviceByToken() {
  const token = syncTokenInput.value.trim()

  if (token.length < 24) {
    alert('Pegá un token válido para vincular este dispositivo')
    return
  }

  const currentProfile = getProfile()
  const profile = {
    ...currentProfile,
    token
  }

  localStorage.setItem(
    profileStorageKey,
    JSON.stringify(profile)
  )

  syncTokenInput.value = ''
  renderProfile()
  alert('Dispositivo vinculado con el token indicado')
}

function renderSyncQr(token) {
  if (!syncQr) return

  const cleanToken = token || ''
  const cells = Array.from({ length: 49 }, (_, index) => {
    const charCode = cleanToken.charCodeAt(index % cleanToken.length) || 0
    const active = (charCode + index) % 3 !== 0

    return `<span class="${active ? 'active' : ''}"></span>`
  }).join('')

  syncQr.innerHTML = cells
  syncQr.setAttribute(
    'aria-label',
    `Codigo visual del token ${cleanToken}`
  )
}

function showFinanceTip() {
  const tips = getFinanceTips()
  const tip = tips[Math.floor(Math.random() * tips.length)]

  alert(tip)
}

function getFinanceTips() {
  return [
    'Separá primero un porcentaje para ahorro antes de gastar el resto.',
    'Revisá los gastos chicos repetidos: suelen pesar más de lo que parecen.',
    'Si una categoría crece dos meses seguidos, poné un límite para el próximo mes.',
    'Evitá financiar consumos cotidianos en cuotas largas.',
    'Compará ingresos contra gastos antes de sumar nuevas obligaciones fijas.',
    'Mantené un fondo de emergencia equivalente a varios meses de gastos básicos.',
    'Las tarjetas de crédito son tus mejores aliadas, siempre y cuando las uses con cuidado.',
    'En los gastos con tarjeta, no te excedas más de lo que puedas pagar al vencimiento.',
    'Las cuotas no siempre son tus mejores aliadas: si las acumulás, se comerán tus ahorros o inversiones.',
    'Las inversiones a largo plazo son una de las mejores decisiones en las que podés pensar.'
  ]
}

function createSecureToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)

  return [...bytes]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

function getAccountAliases() {
  return getExpenses('account_aliases')
    .reduce((aliases, item) => {
      if (item.name && item.account) {
        aliases[item.name] = item.account
      }

      return aliases
    }, {})
}

function getAccountLabel(account) {
  return getAccountAliases()[account] || account || 'Sin cuenta'
}

function getKnownAccounts() {
  const accounts = new Set([
    ...defaultAccounts,
    ...getCustomAccounts()
  ])

  ;[
    ...getExpenses('fixed'),
    ...getExpenses('unique'),
    ...getExpenses('installments'),
    ...getExpenses('card_dates')
  ].forEach(item => {
    if (item.account) {
      accounts.add(item.account)
    }
  })

  return [...accounts]
}

function getCustomAccounts() {
  return getExpenses('custom_accounts')
    .map(item => item.name)
    .filter(Boolean)
}

async function addCustomAccount() {
  const account = newAccountName.value.trim()

  if (!account) {
    alert('Ingresá el nombre de la tarjeta')
    return
  }

  if (
    getKnownAccounts()
      .some(item => item.toLowerCase() === account.toLowerCase())
  ) {
    alert('Esa tarjeta ya existe')
    return
  }

  await addExpense('custom_accounts', {
    name: account,
    account,
    amount: 0,
    category: 'Tarjeta personalizada',
    currency: 'ARS',
    created_month: 'settings'
  })

  await loadExpenses()
  newAccountName.value = ''
  renderSettings()
}

function renderAccountOptions() {
  const options = getKnownAccounts()
    .map(account => `
      <option value="${account}">
        ${getAccountLabel(account)}
      </option>
    `)
    .join('')

  expenseAccount.innerHTML = options
  cardDateAccount.innerHTML = options
}

function renderAccountAliasesForm() {
  accountAliasesForm.innerHTML = getKnownAccounts()
    .map(account => `
      <label class="settings-field">
        <span>${account}</span>
        <input
          type="text"
          data-account-alias="${account}"
          placeholder="${account}"
          value="${getAccountAliases()[account] || ''}"
        >
      </label>
    `)
    .join('')
}

function getCustomCategories() {
  return getExpenses('custom_categories')
    .map(item => item.name)
    .filter(Boolean)
}

function getExpenseCategories() {
  const categories = new Map()

  defaultExpenseCategories.forEach(category => {
    categories.set(category.value, category.label)
  })

  getCustomCategories().forEach(category => {
    categories.set(category, `🏷️ ${category}`)
  })

  return [...categories.entries()]
    .map(([value, label]) => ({
      value,
      label
    }))
}

function getExpenseCategoryOptions() {
  return getExpenseCategories()
    .map(category => `
      <option value="${category.value}">
        ${category.label}
      </option>
    `)
    .join('')
}

function renderCustomCategories() {
  const customCategories = getCustomCategories()

  customCategoriesList.innerHTML = customCategories.length
    ? customCategories
      .map(category => `
        <div class="settings-list-item">
          <span>${category}</span>
          <button
            type="button"
            onclick="deleteCustomCategory('${category}')"
            aria-label="Eliminar categoría"
          >
            ${getDeleteIcon()}
          </button>
        </div>
      `)
      .join('')
    : '<div class="empty-card-dates">Sin categorías personalizadas</div>'
}

async function addCustomCategory() {
  const category = newCategoryName.value.trim()

  if (!category) {
    alert('Ingresá el nombre de la categoría')
    return
  }

  if (
    getExpenseCategories()
      .some(item => item.value.toLowerCase() === category.toLowerCase())
  ) {
    alert('Esa categoría ya existe')
    return
  }

  await addExpense('custom_categories', {
    name: category,
    account: 'Configuración',
    amount: 0,
    category: 'Categoría personalizada',
    currency: 'ARS',
    created_month: 'settings'
  })

  await loadExpenses()
  newCategoryName.value = ''
  renderSettings()
}

async function saveAccountAliases() {
  const previousAliases = getExpenses('account_aliases')

  for (const alias of previousAliases) {
    await deleteExpense(alias.id)
  }

  const aliasInputs =
    accountAliasesForm.querySelectorAll('[data-account-alias]')

  for (const input of aliasInputs) {
    const account = input.dataset.accountAlias
    const alias = input.value.trim()

    if (!alias || alias === account) continue

    await addExpense('account_aliases', {
      name: account,
      account: alias,
      amount: 0,
      category: 'Alias tarjeta',
      currency: 'ARS',
      created_month: 'settings'
    })
  }

  await loadExpenses()
  renderSettings()
  renderExpenses()
}

function renderSettings() {
  renderProfile()
  renderAccountOptions()
  renderAccountAliasesForm()
  renderCustomCategories()
}

function getCardDates() {
  return getExpenses('card_dates')
    .map(cardDate => {
      const closingDay = Number(cardDate.installments)
      const dueDay = Number(cardDate.amount)
      const closingDate = isDateKey(cardDate.category)
        ? cardDate.category
        : getProjectedCardDate(closingDay)
      const dueDate = isDateKey(cardDate.start_month)
        ? cardDate.start_month
        : getProjectedCardDate(dueDay)

      return {
        id: cardDate.id,
        account: cardDate.account || cardDate.name,
        closingDay,
        dueDay,
        closingDate,
        dueDate
      }
    })
    .filter(cardDate =>
      cardDate.account &&
      isDateKey(cardDate.closingDate) &&
      isDateKey(cardDate.dueDate)
    )
}

async function saveCardDate() {
  const account = cardDateAccount.value
  const closingDate = cardClosingDay.value
  const dueDate = cardDueDay.value

  if (!account || !isDateKey(closingDate) || !isDateKey(dueDate)) {
    alert('Ingresá fecha de cierre y fecha de vencimiento')
    return
  }

  if (dueDate < closingDate) {
    alert('El vencimiento no puede ser anterior al cierre')
    return
  }

  const existingCardDate = getCardDates()
    .find(cardDate => cardDate.account === account)

  if (existingCardDate) {
    await deleteExpense(existingCardDate.id)
  }

  await addExpense('card_dates', {
    name: account,
    account,
    amount: Number(dueDate.slice(-2)),
    installments: Number(closingDate.slice(-2)),
    category: closingDate,
    currency: 'ARS',
    created_month: selectedMonth,
    start_month: dueDate
  })

  await loadExpenses()

  cardClosingDay.value = ''
  cardDueDay.value = ''

  renderCardDates()
  checkCardReminders()
}

function isValidCardDay(day) {
  return Number.isInteger(day) && day >= 1 && day <= 31
}

function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '')
}

function getProjectedCardDate(day) {
  if (!isValidCardDay(day)) return ''

  const [year, month] = selectedMonth
    .split('-')
    .map(Number)
  const projectedDate = new Date(year, month, 1)
  const lastDay =
    new Date(projectedDate.getFullYear(), projectedDate.getMonth() + 1, 0)
      .getDate()

  projectedDate.setDate(Math.min(day, lastDay))

  return getDateKey(projectedDate)
}

function renderCardDates() {
  const cardDates = getCardDates()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  cardDatesList.innerHTML = ''

  if (cardDates.length === 0) {
    cardDatesList.innerHTML = `
      <div class="empty-card-dates">
        Sin vencimientos cargados
      </div>
    `

    return
  }

  cardDates.forEach(cardDate => {
    cardDatesList.innerHTML += `
      <div class="card-date-item">
        <div>
          <strong>${getAccountLabel(cardDate.account)}</strong>
          <small>
            Cierre ${formatDateLabel(cardDate.closingDate)}
            · Vence ${formatDateLabel(cardDate.dueDate)}
          </small>
        </div>

        <button
          type="button"
          onclick="deleteCardDate('${cardDate.account}')"
          aria-label="Eliminar vencimiento"
        >
          ${getDeleteIcon()}
        </button>
      </div>
    `
  })
}

async function requestCardNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Este navegador no soporta notificaciones')
    return
  }

  const permission = await Notification.requestPermission()

  enableNotificationsButton.innerText =
    permission === 'granted'
      ? 'Avisos activos'
      : 'Activar avisos'

  checkCardReminders()
}

async function checkCardReminders() {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const todayKey = getDateKey(new Date())
  const sentReminders = getSentCardReminders()
  const expiredCardDateIds = []

  getCardDates().forEach(cardDate => {
    const dueReminderDate = new Date(`${cardDate.dueDate}T12:00:00`)
    dueReminderDate.setDate(dueReminderDate.getDate() - 1)

    const reminderKey =
      `${cardDate.id || cardDate.account}-${cardDate.dueDate}`

    if (
      getDateKey(dueReminderDate) === todayKey &&
      !sentReminders.includes(reminderKey)
    ) {
      new Notification('Mis Finanzas', {
        body:
          `${getAccountLabel(cardDate.account)} vence mañana ` +
          `(${formatDateLabel(cardDate.dueDate)})`
      })

      sentReminders.push(reminderKey)

      if (cardDate.id) {
        expiredCardDateIds.push(cardDate.id)
      }
    }
  })

  localStorage.setItem(
    cardRemindersStorageKey,
    JSON.stringify(sentReminders)
  )

  for (const id of expiredCardDateIds) {
    await deleteExpense(id)
  }

  if (expiredCardDateIds.length > 0) {
    await loadExpenses()
    renderCardDates()
  }
}

function checkFixedTermReminders() {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const today = new Date()
  const todayKey = getDateKey(today)
  const sentReminders = getSentFixedTermReminders()

  getExpenses('investments')
    .filter(investment =>
      investment.category === 'Plazo Fijo' &&
      investment.start_month === todayKey
    )
    .forEach(investment => {
      const reminderKey =
        `${todayKey}-${investment.id || investment.name}-${investment.start_month}`

      if (sentReminders.includes(reminderKey)) return

      new Notification('Mis Finanzas', {
        body:
          `El plazo fijo de ${investment.account || investment.name} ` +
          `vence hoy (${formatDateLabel(investment.start_month)})`
      })

      sentReminders.push(reminderKey)
    })

  localStorage.setItem(
    fixedTermRemindersStorageKey,
    JSON.stringify(sentReminders)
  )
}

function getSentFixedTermReminders() {
  try {
    const sentReminders =
      localStorage.getItem(fixedTermRemindersStorageKey)

    return sentReminders
      ? JSON.parse(sentReminders)
      : []
  } catch (error) {
    console.error('Error leyendo avisos de plazos fijos', error)
    return []
  }
}

function getSentCardReminders() {
  try {
    const sentReminders =
      localStorage.getItem(cardRemindersStorageKey)

    return sentReminders
      ? JSON.parse(sentReminders)
      : []
  } catch (error) {
    console.error('Error leyendo avisos enviados', error)
    return []
  }
}

function getReminderDate(day) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  const targetDay = Math.min(day, lastDay)
  const reminderDate = new Date(year, month, targetDay)

  reminderDate.setDate(reminderDate.getDate() - 1)

  return reminderDate
}

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
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
  renderPatrimonyChart()
  renderInstallments()
  updateGlobalTotal()
  renderCashflowChart()
  renderAccountsSummary()
  renderCategoriesSummary()
  checkFixedTermReminders()
}

function syncAppTopOffset() {
  const navigation = document.querySelector('.top-navigation')

  if (!navigation) return

  document.documentElement.style.setProperty(
    '--app-top-offset',
    `${navigation.offsetHeight + 28}px`
  )
}

function renderIncome() {
  const list = document.querySelector('#income-list')
  const expenses = getExpenses('income')
    .filter(expense => expense.created_month === selectedMonth)
  const total = expenses
    .reduce((acc, expense) => acc + expense.amount, 0)

  renderLimitedExpenseList(list, expenses, 'income')

  document.querySelector('#income-total').innerText =
    `$${total.toLocaleString()}`
}

function renderFixed() {
  const list = document.querySelector('#fixed-list')
  const expenses = getExpenses('fixed')
  const total = expenses
    .reduce((acc, expense) => acc + expense.amount, 0)

  renderLimitedExpenseList(list, expenses, 'fixed')

  document.querySelector('#fixed-total').innerText =
    `$${total.toLocaleString()}`
}

function renderUnique() {
  const list = document.querySelector('#unique-list')
  const expenses = getExpenses('unique')
    .filter(expense => expense.created_month === selectedMonth)
  const total = expenses
    .reduce((acc, expense) => acc + expense.amount, 0)

  renderLimitedExpenseList(list, expenses, 'unique')

  document.querySelector('#unique-total').innerText =
    `$${total.toLocaleString()}`
}

function renderInstallments() {
  const list = document.querySelector('#installments-list')
  const expenses = getActiveInstallments()

  const total = expenses
    .reduce((acc, expense) => acc + expense.amount, 0)

  renderLimitedExpenseList(
    list,
    expenses,
    'installments',
    createInstallmentExpenseItem
  )

  document.querySelector('#installments-total').innerText =
    `$${total.toLocaleString()}`
}

function renderLimitedExpenseList(
  list,
  expenses,
  type,
  renderItem = createExpenseItem
) {
  const limit = 5
  const isExpanded = expandedExpenseSections[type]
  const visibleExpenses = isExpanded
    ? expenses
    : expenses.slice(0, limit)

  list.innerHTML = ''

  visibleExpenses.forEach(expense => {
    list.innerHTML += renderItem(expense, type)
  })

  if (expenses.length > limit) {
    list.innerHTML += `
      <button
        class="expand-list-btn ${isExpanded ? 'expanded' : ''}"
        type="button"
        onclick="toggleExpenseSection('${type}')"
        aria-label="${isExpanded ? 'Contraer' : 'Desplegar'} listado"
      >
        <span class="expand-list-icon">⌄</span>
      </button>
    `
  }
}

function createInstallmentExpenseItem(expense) {
    const monthsPassed = getMonthDifference(
      expense.start_month,
      selectedMonth
    )

    const remaining = expense.installments - monthsPassed

    return `
      <div class="expense-item">
        <div>
          <span>${expense.name}</span>
          <small>${getAccountLabel(expense.account)} · ${remaining} cuotas restantes</small>
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
}

function getInvestmentsForMonth(monthKey = selectedMonth) {
  return getExpenses('investments')
    .filter(expense => expense.created_month === monthKey)
}

async function ensureInvestmentsForSelectedMonth() {
  if (getInvestmentsForMonth(selectedMonth).length > 0) return

  const previousMonth = getLatestInvestmentMonthBefore(selectedMonth)

  if (!previousMonth) return

  const previousInvestments = getInvestmentsForMonth(previousMonth)

  for (const investment of previousInvestments) {
    const clonedInvestment = {
      ...investment,
      created_month: selectedMonth
    }

    delete clonedInvestment.id

    await addExpense('investments', clonedInvestment)
  }

  await loadExpenses()
}

function getLatestInvestmentMonthBefore(monthKey) {
  return [...new Set(
    getExpenses('investments')
      .map(expense => expense.created_month)
      .filter(Boolean)
      .filter(month => month < monthKey)
  )].sort().at(-1)
}

function renderInvestments() {
  const list = document.querySelector('#investments-list')
  const investments = getInvestmentsForMonth()

  renderLimitedExpenseList(
    list,
    investments,
    'investments',
    createInvestmentExpenseItem
  )
}

function createInvestmentExpenseItem(expense) {
  const details = getInvestmentDetails(expense)

  return `
      <div class="expense-item">
        <div>
          <span>${expense.name}</span>
          <small>${details}</small>
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
}

function getInvestmentDetails(expense) {
  if (expense.category === 'Plazo Fijo') {
    const bank = expense.account || expense.name || 'Banco sin indicar'
    const dueDate = expense.start_month
      ? ` · Vence ${formatDateLabel(expense.start_month)}`
      : ''

    return `${expense.category} · ${bank}${dueDate}`
  }

  return expense.category || 'Otros'
}

function formatDateLabel(value) {
  if (!value || !value.includes('-')) return value

  const [year, month, day] = value.split('-')

  if (!day) return value

  return `${day}/${month}/${year}`
}

function createExpenseItem(expense, type) {
  return `
    <div class="expense-item">
      <div>
        <span>${expense.name}</span>
        <small>${getAccountLabel(expense.account)}</small>
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

  getInvestmentsForMonth().forEach(item => {
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

  getInvestmentsForMonth().forEach(item => {
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

  getInvestmentsForMonth().forEach(item => {
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

function renderPatrimonyChart() {
  const container = document.querySelector('#patrimony-chart')

  if (!container) return

  const monthlyTotals = getMonthlyPatrimonyTotals()

  if (monthlyTotals.length === 0) {
    container.innerHTML = `
      <div class="empty-card-dates">
        Sin datos patrimoniales para graficar
      </div>
    `

    return
  }

  const width = 640
  const height = 220
  const padding = 34
  const maxTotal = Math.max(...monthlyTotals.map(item => item.total), 1)
  const minTotal = Math.min(...monthlyTotals.map(item => item.total), 0)
  const range = Math.max(maxTotal - minTotal, 1)

  const points = monthlyTotals.map((item, index) => {
    const x = monthlyTotals.length === 1
      ? width / 2
      : padding + (
        index * (width - padding * 2)
      ) / (monthlyTotals.length - 1)

    const y = height - padding - (
      (item.total - minTotal) *
      (height - padding * 2)
    ) / range

    return {
      ...item,
      x,
      y
    }
  })

  const polyline = points
    .map(point => `${point.x},${point.y}`)
    .join(' ')

  container.innerHTML = `
    <svg
      class="patrimony-chart-svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-label="Evolución mensual del patrimonio"
    >
      <line
        class="patrimony-chart-axis"
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
      ></line>

      <polyline
        class="patrimony-chart-line"
        points="${polyline}"
      ></polyline>

      ${points.map(point => `
        <g>
          <circle
            class="patrimony-chart-point"
            cx="${point.x}"
            cy="${point.y}"
            r="4.8"
          ></circle>

          <text
            class="patrimony-chart-label"
            x="${point.x}"
            y="${height - 10}"
            text-anchor="middle"
          >
            ${getShortMonthLabel(point.month)}
          </text>

          <text
            class="patrimony-chart-value"
            x="${point.x}"
            y="${Math.max(point.y - 10, 14)}"
            text-anchor="middle"
          >
            ${formatCompactCurrency(point.total)}
          </text>
        </g>
      `).join('')}
    </svg>
  `
}

function renderCashflowChart() {
  const container = document.querySelector('#cashflow-chart')

  if (!container) return

  const monthlyTotals = getMonthlyCashflowTotals()

  if (monthlyTotals.length === 0) {
    container.innerHTML = `
      <div class="empty-card-dates">
        Sin datos mensuales para graficar
      </div>
    `

    return
  }

  const width = 640
  const height = 230
  const padding = 34
  const maxTotal = Math.max(
    ...monthlyTotals.map(item => item.income),
    ...monthlyTotals.map(item => item.expenses),
    1
  )

  const incomePoints = getChartPoints(
    monthlyTotals,
    'income',
    width,
    height,
    padding,
    maxTotal
  )

  const expensePoints = getChartPoints(
    monthlyTotals,
    'expenses',
    width,
    height,
    padding,
    maxTotal
  )

  container.innerHTML = `
    <div class="chart-legend">
      <span class="legend-income">Ingresos</span>
      <span class="legend-expenses">Gastos</span>
    </div>

    <svg
      class="patrimony-chart-svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-label="Comparativa mensual de ingresos y gastos"
    >
      <line
        class="patrimony-chart-axis"
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
      ></line>

      <polyline
        class="cashflow-line income-line"
        points="${incomePoints.map(point => `${point.x},${point.y}`).join(' ')}"
      ></polyline>

      <polyline
        class="cashflow-line expense-line"
        points="${expensePoints.map(point => `${point.x},${point.y}`).join(' ')}"
      ></polyline>

      ${monthlyTotals.map((item, index) => {
        const incomePoint = incomePoints[index]
        const expensePoint = expensePoints[index]

        return `
          <g>
            <circle
              class="cashflow-point income-point"
              cx="${incomePoint.x}"
              cy="${incomePoint.y}"
              r="4"
            ></circle>

            <circle
              class="cashflow-point expense-point"
              cx="${expensePoint.x}"
              cy="${expensePoint.y}"
              r="4"
            ></circle>

            <text
              class="patrimony-chart-label"
              x="${incomePoint.x}"
              y="${height - 10}"
              text-anchor="middle"
            >
              ${getShortMonthLabel(item.month)}
            </text>
          </g>
        `
      }).join('')}
    </svg>
  `
}

function getMonthlyCashflowTotals() {
  const months = getExpenseMonths()

  return months.map(month => {
    const income = getExpenses('income')
      .filter(item => item.created_month === month)
      .reduce((acc, item) => acc + item.amount, 0)

    const fixed = getExpenses('fixed')
      .reduce((acc, item) => acc + item.amount, 0)

    const unique = getExpenses('unique')
      .filter(item => item.created_month === month)
      .reduce((acc, item) => acc + item.amount, 0)

    const installments = getExpenses('installments')
      .filter(expense => isInstallmentActiveInMonth(expense, month))
      .reduce((acc, item) => acc + item.amount, 0)

    return {
      month,
      income,
      expenses: fixed + unique + installments
    }
  })
}

function getExpenseMonths() {
  const months = new Set()

  ;[
    ...getExpenses('income'),
    ...getExpenses('unique'),
    ...getExpenses('installments')
  ].forEach(expense => {
    if (expense.created_month) {
      months.add(expense.created_month)
    }
  })

  if (months.size === 0 && getExpenses('fixed').length > 0) {
    months.add(selectedMonth)
  }

  return [...months].sort()
}

function isInstallmentActiveInMonth(expense, month) {
  const monthsPassed = getMonthDifference(
    expense.start_month,
    month
  )

  const remaining =
    expense.installments - monthsPassed

  return remaining > 0 && monthsPassed >= 0
}

function getChartPoints(items, key, width, height, padding, maxTotal) {
  return items.map((item, index) => {
    const x = items.length === 1
      ? width / 2
      : padding + (
        index * (width - padding * 2)
      ) / (items.length - 1)

    const y = height - padding - (
      item[key] * (height - padding * 2)
    ) / maxTotal

    return {
      x,
      y
    }
  })
}

function generateMonthlyReport() {
  const report = buildMonthlyReportData()
  reportFrame.srcdoc = getMonthlyReportHTML(report)
  reportModal.classList.remove('hidden')
  document.body.classList.add('report-open')
}

function closeMonthlyReport() {
  reportModal.classList.add('hidden')
  document.body.classList.remove('report-open')
  reportFrame.srcdoc = ''
}

function printMonthlyReport() {
  const reportWindow = reportFrame.contentWindow

  if (!reportWindow) return

  reportWindow.focus()
  reportWindow.print()
}

function buildMonthlyReportData() {
  const cashflow = getMonthlyCashflowTotals()
    .filter(item => item.month <= selectedMonth)

  const patrimony = getMonthlyPatrimonyTotals()
    .filter(item => item.month <= selectedMonth)

  const currentCashflow =
    cashflow.find(item => item.month === selectedMonth) ||
    cashflow.at(-1) ||
    {
      month: selectedMonth,
      income: 0,
      expenses: 0
    }

  const categories = getCategoryBreakdownForMonth(selectedMonth)
  const topCategory = categories[0]
  const balance = currentCashflow.income - currentCashflow.expenses
  const currentPatrimony =
    patrimony.find(item => item.month === selectedMonth) ||
    patrimony.at(-1) ||
    {
      total: 0,
      usdTotal: 0
    }

  return {
    month: selectedMonth,
    cashflow,
    patrimony,
    currentCashflow,
    categories,
    topCategory,
    balance,
    currentPatrimony,
    tips: getReportTips(currentCashflow, categories, balance)
  }
}

function getCategoryBreakdownForMonth(month) {
  const expenses = [
    ...getExpenses('fixed'),
    ...getExpenses('unique')
      .filter(item => item.created_month === month),
    ...getExpenses('installments')
      .filter(expense => isInstallmentActiveInMonth(expense, month))
  ]

  const totals = {}

  expenses.forEach(expense => {
    const category = expense.category || 'Otros'

    if (!totals[category]) {
      totals[category] = 0
    }

    totals[category] += expense.amount
  })

  return Object.entries(totals)
    .map(([category, total]) => ({
      category,
      total
    }))
    .sort((a, b) => b.total - a.total)
}

function getReportTips(cashflow, categories, balance) {
  const tips = []
  const topCategory = categories[0]
  const ocioCategory =
    categories.find(item => item.category === 'Ocio')
  const installmentsCategory =
    categories.find(item => item.category === 'Cuotas')
  const entrepreneurshipCategory =
    categories.find(item => item.category === 'Emprendimiento')

  if (balance < 0) {
    tips.push(
      'Este periodo cerró con saldo negativo. Conviene revisar gastos variables antes de asumir nuevos compromisos.'
    )
  }

  if (topCategory) {
    const share =
      cashflow.expenses > 0
        ? Math.round((topCategory.total / cashflow.expenses) * 100)
        : 0

    tips.push(
      `El principal drenaje de dinero está en ${topCategory.category}: representa aproximadamente el ${share}% del gasto del periodo.`
    )

    if (share >= 35) {
      tips.push(
        `Hay mucha concentración de gasto en ${topCategory.category}. Definí un tope mensual para que no absorba el resto del presupuesto.`
      )
    }
  }

  if (cashflow.income > 0 && cashflow.expenses / cashflow.income > 0.8) {
    tips.push(
      'Tus gastos superan el 80% de tus ingresos. El próximo mes conviene separar ahorro al inicio y ajustar consumos variables.'
    )
  }

  if (ocioCategory && cashflow.expenses > 0) {
    const ocioShare =
      Math.round((ocioCategory.total / cashflow.expenses) * 100)

    if (ocioShare >= 15) {
      tips.push(
        `Ocio pesa un ${ocioShare}% del gasto mensual. Reducir algunos consumos puntuales puede liberar dinero sin tocar gastos esenciales.`
      )
    }
  }

  if (installmentsCategory) {
    tips.push(
      'Las cuotas acumuladas están ocupando parte del flujo mensual. Revisalas antes de sumar nuevas compras financiadas.'
    )
  }

  if (entrepreneurshipCategory) {
    tips.push(
      'Los gastos de Emprendimiento deberían medirse contra ingresos o retorno esperado para distinguir inversión productiva de fuga de caja.'
    )
  }

  if (balance > 0) {
    tips.push(
      'El periodo dejó margen positivo. Una mejora posible es asignar una parte fija a fondo de emergencia o inversiones.'
    )
  }

  if (tips.length === 0) {
    tips.push(
      'El mes se ve equilibrado. Mantené el seguimiento para detectar cambios temprano.'
    )
  }

  return tips
}

function getMonthlyReportHTML(report) {
  const maxCashflow = Math.max(
    ...report.cashflow.map(item => item.income),
    ...report.cashflow.map(item => item.expenses),
    1
  )

  const maxPatrimony = Math.max(
    ...report.patrimony.map(item => item.total),
    1
  )

  const cashflowBars = report.cashflow
    .map(item => `
      <div class="bar-row">
        <span>${item.month}</span>
        <div class="bar-track">
          <i
            class="bar income-bar"
            style="width:${Math.max((item.income / maxCashflow) * 100, 2)}%;"
          ></i>
          <i
            class="bar expense-bar"
            style="width:${Math.max((item.expenses / maxCashflow) * 100, 2)}%;"
          ></i>
        </div>
      </div>
    `)
    .join('')

  const patrimonyBars = report.patrimony
    .map(item => `
      <div class="bar-row">
        <span>${item.month}</span>
        <div class="bar-track single">
          <i
            class="bar patrimony-bar"
            style="width:${Math.max((item.total / maxPatrimony) * 100, 2)}%;"
          ></i>
        </div>
      </div>
    `)
    .join('')

  const cashflowRows = report.cashflow
    .map(item => `
      <tr>
        <td>${item.month}</td>
        <td>${formatMoney(item.income)}</td>
        <td>${formatMoney(item.expenses)}</td>
        <td>${formatMoney(item.income - item.expenses)}</td>
      </tr>
    `)
    .join('')

  const categoryRows = report.categories
    .map(item => `
      <tr>
        <td>${item.category}</td>
        <td>${formatMoney(item.total)}</td>
      </tr>
    `)
    .join('')

  const patrimonyRows = report.patrimony
    .map(item => `
      <tr>
        <td>${item.month}</td>
        <td>${formatMoney(item.total)}</td>
        <td>${formatNumber(item.usdTotal)} USD</td>
        <td>USD $${dollarRate.toLocaleString()}</td>
      </tr>
    `)
    .join('')

  return `
    <!doctype html>
    <html>
      <head>
        <title>Informe Mis Finanzas ${report.month}</title>
        <style>
          body {
            font-family: Inter, Arial, sans-serif;
            color: #111827;
            padding: 28px;
          }

          h1 {
            margin: 0 0 4px;
          }

          h2 {
            margin-top: 26px;
            font-size: 18px;
          }

          .muted {
            color: #64748b;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin: 22px 0;
          }

          .card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 14px;
            background: #f8fafc;
          }

          .card span {
            display: block;
            color: #64748b;
            font-size: 12px;
            margin-bottom: 6px;
          }

          .card strong {
            font-size: 18px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th,
          td {
            border-bottom: 1px solid #e5e7eb;
            padding: 9px 6px;
            text-align: left;
            font-size: 13px;
          }

          th {
            color: #334155;
            background: #f8fafc;
          }

          .tips {
            margin-top: 10px;
            padding-left: 18px;
          }

          .chart-box {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            background: #f8fafc;
            padding: 14px;
            margin-top: 10px;
          }

          .bar-row {
            display: grid;
            grid-template-columns: 72px 1fr;
            gap: 10px;
            align-items: center;
            margin: 9px 0;
            font-size: 12px;
            color: #475569;
            font-weight: 700;
          }

          .bar-track {
            display: grid;
            gap: 4px;
          }

          .bar {
            display: block;
            height: 8px;
            border-radius: 999px;
          }

          .income-bar {
            background: #16a34a;
          }

          .expense-bar {
            background: #dc2626;
          }

          .patrimony-bar {
            background: #2563eb;
          }

          @media print {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <h1>Informe mensual Mis Finanzas</h1>
        <p class="muted">Periodo seleccionado: ${report.month}</p>

        <div class="cards">
          <div class="card">
            <span>Ingresos</span>
            <strong>${formatMoney(report.currentCashflow.income)}</strong>
          </div>

          <div class="card">
            <span>Gastos</span>
            <strong>${formatMoney(report.currentCashflow.expenses)}</strong>
          </div>

          <div class="card">
            <span>Patrimonio estimado</span>
            <strong>${formatMoney(report.currentPatrimony.total)}</strong>
          </div>

          <div class="card">
            <span>Patrimonio en USD</span>
            <strong>${formatNumber(report.currentPatrimony.usdTotal)} USD</strong>
          </div>
        </div>

        <h2>Alertas y tips</h2>
        <ul class="tips">
          ${report.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>

        <h2>Ingresos vs gastos acumulado</h2>
        <div class="chart-box">
          ${cashflowBars || '<p class="muted">Sin datos para graficar</p>'}
        </div>

        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Ingresos</th>
              <th>Gastos</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>${cashflowRows || '<tr><td colspan="4">Sin datos</td></tr>'}</tbody>
        </table>

        <h2>Categorías del periodo</h2>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${categoryRows || '<tr><td colspan="2">Sin gastos registrados</td></tr>'}</tbody>
        </table>

        <h2>Evolución patrimonial</h2>
        <p class="muted">
          Conversión estimada con tipo de cambio actual:
          USD $${dollarRate.toLocaleString()}
        </p>

        <div class="chart-box">
          ${patrimonyBars || '<p class="muted">Sin datos patrimoniales para graficar</p>'}
        </div>

        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Patrimonio ARS</th>
              <th>Patrimonio USD</th>
              <th>Tipo de cambio</th>
            </tr>
          </thead>
          <tbody>${patrimonyRows || '<tr><td colspan="4">Sin datos patrimoniales</td></tr>'}</tbody>
        </table>
      </body>
    </html>
  `
}

function formatMoney(value) {
  return `$${Math.round(value || 0).toLocaleString()}`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2
  })
}

function getMonthlyPatrimonyTotals() {
  const grouped = {}

  getExpenses('investments')
    .filter(investment => investment.created_month)
    .forEach(investment => {
      if (!grouped[investment.created_month]) {
        grouped[investment.created_month] = {
          total: 0,
          usdTotal: 0
        }
      }

      grouped[investment.created_month].total +=
        getInvestmentAmountInARS(investment)

      grouped[investment.created_month].usdTotal +=
        getInvestmentAmountInUSD(investment)
    })

  return Object.entries(grouped)
    .map(([month, values]) => ({
      month,
      total: values.total,
      usdTotal: values.usdTotal
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

function getInvestmentAmountInARS(investment) {
  const amount = Number(investment.amount) || 0

  return investment.currency === 'USD'
    ? amount * dollarRate
    : amount
}

function getInvestmentAmountInUSD(investment) {
  const amount = Number(investment.amount) || 0

  return investment.currency === 'USD'
    ? amount
    : amount / dollarRate
}

function getShortMonthLabel(monthKey) {
  const [, month] = monthKey.split('-').map(Number)
  const labels = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ]

  return labels[month - 1] || monthKey
}

function formatCompactCurrency(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`
  }

  return `$${Math.round(value)}`
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
      accountLabel: getAccountLabel(account),
      total: data.total,
      items: data.items.sort((a, b) => b.amount - a.amount)
    }))
    .sort((a, b) => b.total - a.total)
    .forEach(({ account, accountLabel, total, items }) => {
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
            <span>${accountLabel}</span>
            <strong>$${total.toLocaleString()}</strong>
          </button>

          ${
            isOpen
              ? `
                <div class="account-detail">
                  <div class="account-detail-title">
                    Gastos con ${accountLabel}
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
  const account = getAccountLabel(expense.account)

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
    Emprendimiento: '#10b981',
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
  const settingsTab = document.querySelector('#settings-tab')
  const dashboardSection = document.querySelector('#dashboard-section')
  const patrimonySection = document.querySelector('#patrimony-section')
  const settingsSection = document.querySelector('#settings-section')

  dashboardTab.addEventListener('click', () => {
    appShell.classList.remove('patrimony-view')
    patrimonySection.classList.add('hidden-section')
    settingsSection.classList.add('hidden-section')
    dashboardSection.classList.remove('hidden-section')
    dashboardTab.classList.add('active')
    patrimonyTab.classList.remove('active')
    settingsTab.classList.remove('active')
    syncAppTopOffset()
    animateSection(dashboardSection)
  })

  patrimonyTab.addEventListener('click', () => {
    appShell.classList.add('patrimony-view')
    dashboardSection.classList.add('hidden-section')
    settingsSection.classList.add('hidden-section')
    patrimonySection.classList.remove('hidden-section')
    patrimonyTab.classList.add('active')
    dashboardTab.classList.remove('active')
    settingsTab.classList.remove('active')
    syncAppTopOffset()
    animateSection(patrimonySection)
  })

  settingsTab.addEventListener('click', () => {
    appShell.classList.add('patrimony-view')
    dashboardSection.classList.add('hidden-section')
    patrimonySection.classList.add('hidden-section')
    settingsSection.classList.remove('hidden-section')
    settingsTab.classList.add('active')
    dashboardTab.classList.remove('active')
    patrimonyTab.classList.remove('active')
    renderSettings()
    syncAppTopOffset()
    animateSection(settingsSection)
  })

  await loadDollarRate()
  await loadExpenses()
  await ensureInvestmentsForSelectedMonth()
  renderSettings()
  renderExpenses()
  renderCardDates()
  checkCardReminders()
  syncAppTopOffset()
  setTimeout(syncAppTopOffset, 150)

  if (
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    enableNotificationsButton.innerText = 'Avisos activos'
  }
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

window.toggleExpenseSection = function(type) {
  expandedExpenseSections[type] =
    !expandedExpenseSections[type]

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

  if (type === 'investments') {
    updateInvestmentFields()

    if (expense.category === 'Plazo Fijo') {
      investmentBank.value = expense.account || expense.name || ''
      investmentDueDate.value = expense.start_month || ''
    }
  }

  if (type === 'installments') {
    expenseInstallments.value = expense.installments || ''
  }
}

window.deleteCardDate = async function(account) {
  const confirmDelete = confirm(
    `¿Eliminar vencimientos de ${account}?`
  )

  if (!confirmDelete) return

  const cardDate = getCardDates()
    .find(item => item.account === account)

  if (!cardDate) return

  await deleteExpense(cardDate.id)
  await loadExpenses()

  renderCardDates()
}

window.deleteCustomCategory = async function(category) {
  const confirmDelete = confirm(
    `¿Eliminar la categoría ${category}?`
  )

  if (!confirmDelete) return

  const customCategory = getExpenses('custom_categories')
    .find(item => item.name === category)

  if (!customCategory) return

  await deleteExpense(customCategory.id)
  await loadExpenses()
  renderSettings()
}

start()
