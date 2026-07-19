// Controla o dashboard: proteção de rota, logout e tema

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const sessao = await verificarSessao();
    if (!sessao) {
      window.location.href = 'index.html';
      return;
    }
  } catch (e) {
    console.error('Erro ao verificar sessão:', e.message);
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('btn-sair').addEventListener('click', sair);

  document.getElementById('btn-tema').addEventListener('click', () => {
    document.documentElement.classList.toggle('tema-escuro-forcado');
    document.documentElement.classList.toggle('tema-claro-forcado');
  });

  // Próxima fase: carregar cards com dados reais do perfil e TAF
  document.getElementById('area-cards').innerHTML =
    '<p class="carregando">Cards de estatísticas na próxima fase.</p>';
});
