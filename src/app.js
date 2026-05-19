import { getData, saveData } from './storage'
import { getCurrentMonthKey } from './months'

let data = getData()

export function addExpense(type, expense) {
  data[type].push(expense)
  saveData(data)
}

export function getExpenses(type) {
  return data[type]
}

export function createInstallment(name, amount, installments) {
  return {
    id: crypto.randomUUID(),
    name,
    amount,
    installments,
    remaining: installments,
    startMonth: getCurrentMonthKey()
  }
}