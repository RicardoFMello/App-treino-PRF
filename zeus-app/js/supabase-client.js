// Conexão com Supabase — usado em toda a aplicação
const SUPABASE_URL = 'https://ypdtjhhsdjqbubekgbsl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_A_pyJjucZwHaZXhrSdUpWw_t5cZyDks';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
