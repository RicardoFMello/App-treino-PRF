// Cálculo de pontuação TAF — consulta taf_indices e retorna os pontos do valor informado

async function calcularPontuacao(etapa, exercicio, valor) {
  const { data, error } = await supabaseClient
    .from('taf_indices')
    .select('*')
    .eq('etapa', etapa)
    .eq('exercicio', exercicio);

  if (error || !data || data.length === 0) return null;

  const sentido = data[0].sentido;

  // Ordena do melhor pro pior índice e encontra a primeira faixa que o valor atinge
  const faixas = [...data].sort((a, b) =>
    sentido === 'maior_melhor' ? b.pontos - a.pontos : b.pontos - a.pontos
  );

  for (const faixa of faixas) {
    if (sentido === 'maior_melhor') {
      const min = faixa.valor_min;
      const max = faixa.valor_max === null ? Infinity : faixa.valor_max;
      if (valor >= min && valor <= max) return faixa.pontos;
    } else {
      // menor_melhor: valor_min é o "limite pior ou igual", valor_max é o limite melhor
      const pior = faixa.valor_min;
      const melhor = faixa.valor_max === null ? -Infinity : faixa.valor_max;
      if (valor <= pior && valor >= melhor) return faixa.pontos;
    }
  }
  return 0;
}

const NOMES_EXERCICIOS = {
  barra_fixa: 'Barra Fixa',
  shuttle_run: 'Shuttle Run',
  impulsao_horizontal: 'Impulsão Horizontal',
  abdominal: 'Abdominal',
  corrida_12min: 'Corrida 12min'
};

const UNIDADES_EXERCICIOS = {
  barra_fixa: 'reps',
  shuttle_run: 's',
  impulsao_horizontal: 'm',
  abdominal: 'reps',
  corrida_12min: 'm'
};
