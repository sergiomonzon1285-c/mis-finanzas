import { supabase } from './supabase'

export async function getExpensesFromDB() {

  const { data, error } = await supabase
    .from('expenses')
    .select('*')

  if (error) {
    console.error('SELECT ERROR:', error)
    return []
  }

  console.log('DATA:', data)

  return data
}

export async function saveExpenseToDB(expense) {

  console.log('INSERTANDO:', expense)

  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()

  if (error) {
    console.error('INSERT ERROR:', error)
    return
  }

  console.log('INSERT OK:', data)
}