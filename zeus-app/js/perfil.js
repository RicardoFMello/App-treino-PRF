// Carrega e salva os dados de perfil do usuário

document.addEventListener('DOMContentLoaded', async () => {
  const sessao = await verificarSessao().catch(() => null);
  if (!sessao) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('btn-sair').addEventListener('click', sair);
  document.getElementById('btn-tema').addEventListener('click', () => {
    document.documentElement.classList.toggle('tema-escuro-forcado');
    document.documentElement.classList.toggle('tema-claro-forcado');
  });

  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: perfil } = await supabaseClient
    .from('perfis')
    .select('*')
    .eq('id', user.id)
    .single();

  if (perfil) {
    if (perfil.nome) document.getElementById('nome').value = perfil.nome;
    if (perfil.data_nascimento) document.getElementById('data_nascimento').value = perfil.data_nascimento;
    if (perfil.altura_cm) document.getElementById('altura_cm').value = perfil.altura_cm;
    if (perfil.peso_kg) document.getElementById('peso_kg').value = perfil.peso_kg;
  }

  const form = document.getElementById('form-perfil');
  const mensagem = document.getElementById('mensagem');
  const btnSalvar = document.getElementById('btn-salvar');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';

    const atualizacao = {
      nome: document.getElementById('nome').value.trim() || null,
      data_nascimento: document.getElementById('data_nascimento').value || null,
      altura_cm: parseFloat(document.getElementById('altura_cm').value) || null,
      peso_kg: parseFloat(document.getElementById('peso_kg').value) || null
    };

    const { error } = await supabaseClient
      .from('perfis')
      .update(atualizacao)
      .eq('id', user.id);

    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';

    if (error) {
      mensagem.textContent = 'Erro ao salvar: ' + error.message;
      mensagem.className = 'mensagem erro';
    } else {
      mensagem.textContent = 'Perfil salvo com sucesso.';
      mensagem.className = 'mensagem sucesso';
    }
  });
});
