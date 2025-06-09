export function calcEnergiaGerada(
  Npainel: number,
  Pn: number,           // Potência nominal do painel (W)
  Hs: number,           // Horas de sol pleno por dia
  perdas: number = 0.20, // 20% de perdas
  Fcorr = 1             // Fator de correção adicional
): number {
  // Potência do painel em kW
  const Pn_kW = Pn / 1000;

  // Energia diária gerada (kWh/dia)
  const Edia = Npainel * Pn_kW * Hs * Fcorr / (1 + perdas);

  // Energia mensal gerada (kWh/mês)
  const Emes = Edia * 30;

  return Emes;
}