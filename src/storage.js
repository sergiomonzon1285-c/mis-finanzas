import { supabase } from './supabase'

// =========================
// GET
// =========================

export async function getExpensesFromDB() {

  console.log('PROBANDO SELECT...')

  const { data, error } = await supabase
    .from('expenses')
    .select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)

  if (error) {
    console.error(error)
    return []
  }

  return data
}

// =========================
// INSERT
// =========================

export async function saveExpenseToDB(expense) {

  console.log('PROBANDO INSERT...')
  console.log(expense)

  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()

  console.log('INSERT DATA:', data)
  console.log('INSERT ERROR:', error)

  if (error) {
    console.error(error)
  }

  return data
}

// =========================
// DELETE
// =========================

export async function deleteExpenseFromDB(id) {

  console.log('ELIMINANDO:', id)

  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .select()

  console.log('DELETE DATA:', data)
  console.log('DELETE ERROR:', error)

  if (error) {
    console.error(error)
  }

  return data
}