import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkkwljarmfqneoolntyi.supabase.co'

const supabaseKey = 'sb_publishable_xy_jEvZZ9cBUt3JuV-ZYFw_hqwDi_2c'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)