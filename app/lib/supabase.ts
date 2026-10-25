import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wjanehdeqmprvthxdkos.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xgMyFBBLBv720erWKkRUfg_g1tAcUlH'

export const supabase = createClient(supabaseUrl, supabaseKey)