// Autenticação — login, cadastro e verificação de sessão

async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  return { data, error };
}

async function cadastrar(email, senha) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  return { data, error };
}

async function sair() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

async function verificarSessao() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
