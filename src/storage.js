const STORAGE_KEY = 'mis_finanzas_data'

export function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    fixed: [],
    installments: [],
    unique: []
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}