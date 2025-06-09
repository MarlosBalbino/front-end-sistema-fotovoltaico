import { PanelSizingInput } from "../types/PanelSizingInput";

export default function calcPanelSizing(
  Emes: number,
  consumoMinimo: number,   
  Pn: number,
  Hs: number,
  perdas: number = 0.15, // 20%
  Fcorr = 1
): number {
  // Energia que deve ser compensada (em kWh)
  const energiaGerar = Math.max(Emes - consumoMinimo, 0);

  // Consumo diário médio (em kWh/dia)
  const Edia = energiaGerar / 30;

  // Potência do painel em kW (conversão de W para kW)
  const Pn_kW = Pn / 1000;

  // Fórmula de dimensionamento
  const Npainel = (Edia * (1 + perdas)) / (Pn_kW * Hs * Fcorr);

  // Arredonda para cima, pois não podemos instalar frações de painel
  return Math.ceil(Npainel);
}
