import { supabase } from './supabase'

export async function getExpensesFromDB() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function saveExpenseToDB(expense) {
  const { error } = await supabase
    .from('expenses')
    .insert(expense)

  if (error) {
    console.error(error)
  }
}