import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkkwljarmfqneoolntyi.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZra3dsamFybWZxbmVvb2xudHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTg0MDksImV4cCI6MjA5NDc3NDQwOX0.q4fftq783lxfiZ8bqcH-8lm9YK2sdQdqq6RNxgzsP7w'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)