// Controla a tela de login/cadastro

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const sessao = await verificarSessao();
    if (sessao) {
      window.location.href = 'dashboard.html';
      return;
    }
  } catch (e) {
    console.error('Erro ao verificar sessão:', e.message);
  }

  const form = document.getElementById('form-auth');
  const btnAlternar = document.getElementById('btn-alternar');
  const titulo = document.getElementById('titulo-form');
  const btnSubmit = document.getElementById('btn-submit');
  const mensagem = document.getElementById('mensagem');

  let modoCadastro = false;

  btnAlternar.addEventListener('click', () => {
    modoCadastro = !modoCadastro;
    titulo.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
    btnSubmit.textContent = modoCadastro ? 'Cadastrar' : 'Entrar';
    btnAlternar.textContent = modoCadastro ? 'Já tenho conta' : 'Criar nova conta';
    mensagem.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Aguarde...';
    mensagem.textContent = '';

    const resultado = modoCadastro
      ? await cadastrar(email, senha)
      : await entrar(email, senha);

    if (resultado.error) {
      mensagem.textContent = traduzirErro(resultado.error.message);
      mensagem.className = 'mensagem erro';
      btnSubmit.disabled = false;
      btnSubmit.textContent = modoCadastro ? 'Cadastrar' : 'Entrar';
    } else if (modoCadastro) {
      mensagem.textContent = 'Conta criada. Verifique seu e-mail para confirmar.';
      mensagem.className = 'mensagem sucesso';
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Cadastrar';
    } else {
      window.location.href = 'dashboard.html';
    }
  });
});

function traduzirErro(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado.';
  if (msg.includes('Password should be')) return 'A senha deve ter no mínimo 6 caracteres.';
  return 'Erro: ' + msg;
}
