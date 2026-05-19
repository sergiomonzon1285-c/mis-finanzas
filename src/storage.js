import { supabase } from './supabase'

export async function getExpensesFromDB() {

  console.log('PROBANDO SELECT...')

  const { data, error } = await supabase
    .from('expenses')
    .select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)

  return data || []
}

export async function saveExpenseToDB(expense) {

  console.log('PROBANDO INSERT...')
  console.log(expense)

  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()

  console.log('INSERT DATA:', data)
  console.log('INSERT ERROR:', error)
}