import { supabase } from './supabase'

const localStorageKey = 'mis-finanzas-expenses'

function getLocalExpenses() {
  try {
    const savedExpenses =
      localStorage.getItem(localStorageKey)

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : []
  } catch (error) {
    console.error('Error leyendo datos locales', error)
    return []
  }
}

function saveLocalExpenses(expenses) {
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(expenses)
  )
}

function createLocalId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()}`
}

// =========================
// GET
// =========================

export async function getExpensesFromDB() {

  console.log('PROBANDO SELECT...')

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')

    console.log('DATA:', data)
    console.log('ERROR:', error)

    if (error) {
      console.error(error)
      return getLocalExpenses()
    }

    return data
  } catch (error) {
    console.error(error)
    return getLocalExpenses()
  }
}

// =========================
// INSERT
// =========================

export async function saveExpenseToDB(expense) {

  console.log('PROBANDO INSERT...')
  console.log(expense)

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()

    console.log('INSERT DATA:', data)
    console.log('INSERT ERROR:', error)

    if (error) {
      console.error(error)
      return saveExpenseLocally(expense)
    }

    return data
  } catch (error) {
    console.error(error)
    return saveExpenseLocally(expense)
  }
}

// =========================
// DELETE
// =========================

export async function deleteExpenseFromDB(id) {

  console.log('ELIMINANDO:', id)

  try {
    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .select()

    console.log('DELETE DATA:', data)
    console.log('DELETE ERROR:', error)

    if (error) {
      console.error(error)
      deleteExpenseLocally(id)
      return []
    }

    return data
  } catch (error) {
    console.error(error)
    deleteExpenseLocally(id)
    return []
  }
}

function saveExpenseLocally(expense) {
  const localExpenses = getLocalExpenses()
  const savedExpense = {
    ...expense,
    id: expense.id || createLocalId()
  }

  saveLocalExpenses([
    ...localExpenses,
    savedExpense
  ])

  return [savedExpense]
}

function deleteExpenseLocally(id) {
  const localExpenses = getLocalExpenses()

  saveLocalExpenses(
    localExpenses.filter(expense => expense.id !== id)
  )
}
