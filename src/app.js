import {
  getExpensesFromDB,
  saveExpenseToDB,
  deleteExpenseFromDB
} from './storage'

import { getCurrentMonthKey } from './months'

let expenses = []

export async function loadExpenses() {
  expenses = await getExpensesFromDB()
}

export function getExpenses(type) {
  return expenses.filter(
    expense => expense.type === type
  )
}

export async function addExpense(type, expense) {

  const newExpense = {
    ...expense,
    type
  }

  const savedExpense =
    await saveExpenseToDB(newExpense)

  if (savedExpense && savedExpense[0]) {

    expenses.push(savedExpense[0])
  }
}

export function createInstallment(
  name,
  amount,
  installments,
  account
) {

  return {
    name,
    amount,
    installments,
    account,
    start_month: getCurrentMonthKey()
  }
}
export async function deleteExpense(id) {

  await deleteExpenseFromDB(id)

  expenses = expenses.filter(
    expense => expense.id !== id
  )
}