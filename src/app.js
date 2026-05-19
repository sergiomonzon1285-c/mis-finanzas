import {
  getExpensesFromDB,
  saveExpenseToDB
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

  await saveExpenseToDB(newExpense)

  expenses.push(newExpense)
}

export function createInstallment(
  name,
  amount,
  installments
) {
  return {
    name,
    amount,
    installments,
    start_month: getCurrentMonthKey()
  }
}