export type PanelSizingInput = {
  Emes: number;          // Consumo mensal (kWh/mês)
  consumoMinimo: number; // Tarifa mínima ou consumo mínimo (kWh/mês)
  perdas: number;        // Perdas totais do sistema (ex: 0.2 para 20%)
  Pn: number;            // Potência nominal do painel (em W)
  Hs: number;            // Hora de sol (kWh/m²·dia)
  Fcorr: number;         // Fator de correção (ex: 1.0 para nenhum ajuste, ou >1 para margem)
};