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

  await carregarCards();
});

async function carregarCards() {
  const area = document.getElementById('area-cards');
  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: perfil } = await supabaseClient
    .from('perfis')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: tentativas } = await supabaseClient
    .from('tentativas_taf')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('etapa', '1_etapa')
    .order('data_registro', { ascending: false });

  // Pega apenas a tentativa mais recente de cada exercício
  const ultimaPorExercicio = {};
  (tentativas || []).forEach((t) => {
    if (!ultimaPorExercicio[t.exercicio]) ultimaPorExercicio[t.exercicio] = t;
  });

  let html = '';

  // Card de perfil
  if (perfil && perfil.data_nascimento && perfil.altura_cm && perfil.peso_kg) {
    const idade = new Date().getFullYear() - new Date(perfil.data_nascimento).getFullYear();
    const alturaM = perfil.altura_cm / 100;
    const imc = (perfil.peso_kg / (alturaM * alturaM)).toFixed(1);
    html += `<div class="card"><h3>Perfil</h3><p>${idade} anos • ${perfil.altura_cm}cm • ${perfil.peso_kg}kg</p><p class="destaque">IMC ${imc}</p></div>`;
  } else {
    html += `<div class="card"><h3>Perfil</h3><p class="carregando">Complete seu perfil em breve para ver idade e IMC.</p></div>`;
  }

  // Cards por exercício
  let somaPontos = 0;
  let qtdRegistrados = 0;

  for (const exercicio of Object.keys(NOMES_EXERCICIOS)) {
    const tentativa = ultimaPorExercicio[exercicio];
    if (tentativa) {
      const pontos = await calcularPontuacao('1_etapa', exercicio, tentativa.valor);
      somaPontos += pontos;
      qtdRegistrados++;
      html += `<div class="card"><h3>${NOMES_EXERCICIOS[exercicio]}</h3><p>${tentativa.valor} ${UNIDADES_EXERCICIOS[exercicio]}</p><p class="destaque">${pontos.toFixed(2)} pts</p></div>`;
    } else {
      html += `<div class="card"><h3>${NOMES_EXERCICIOS[exercicio]}</h3><p class="carregando">Nenhum registro ainda</p></div>`;
    }
  }

  // Card de média geral
  if (qtdRegistrados > 0) {
    const media = (somaPontos / qtdRegistrados).toFixed(2);
    const aprovado = media >= 3.0;
    html += `<div class="card card-destaque"><h3>Média TAF (1ª etapa)</h3><p class="destaque">${media} pts</p><p>${aprovado ? '✅ Acima do mínimo' : '⚠️ Abaixo do mínimo (3,00)'}</p></div>`;
  }

  area.innerHTML = html;
}
