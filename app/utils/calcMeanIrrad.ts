import calcIrradIncidente from "./calcIrradIncident";
import { DataPoint } from "@/app/types/DataPoint";
import { computeIrradiance } from "./computePerezIrrad";

const MESES: Record<string, string> = {
  '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr',
  '05': 'mai', '06': 'jun', '07': 'jul', '08': 'ago',
  '09': 'set', '10': 'out', '11': 'nov', '12': 'dez'
};

export default function calcMeanIrradMensal(
  dados: DataPoint[],
  inclinacao: number,
  azimute: number,
  latitude: number,
  longitude: number,
  longMeridiano: number,
  horarioVerao: number
) {
  const resultados: Record<string, number[]> = {};

  for (const ponto of dados) {
    const { x: horaStr, y: irradianciaGlobal, date: dataStr } = ponto;

    const {G_inc_real: valorInclinado, theta_i} = calcIrradIncidente(
      dataStr,
      horaStr,
      irradianciaGlobal,
      inclinacao,
      azimute,
      latitude,
      longitude,
      longMeridiano,
      horarioVerao,
      false
    );

    // const valorInclinado = computeIrradiance(
    //   dataStr,
    //   horaStr,
    //   irradianciaGlobal,
    //   inclinacao,
    //   azimute,
    //   latitude,
    //   longitude,
    //   longMeridiano
    // );

    if (!resultados[dataStr]) resultados[dataStr] = [];
    resultados[dataStr].push(valorInclinado);
  }

  // Calcula a média diária por data
  const mediasDiarias = Object.entries(resultados).map(([data, valores]) => {
    const mediaWm2 = valores.reduce((a, b) => a + b, 0) / valores.length;
    return { data, mediaWm2 };
  });

  // Agrupa por mês e calcula a média mensal (convertida para kWh/m².dia)
  const resultadosMensais: Record<string, number[]> = {};

  for (const { data, mediaWm2 } of mediasDiarias) {
    const mes = data.slice(0, 7); // "YYYY-MM"
    if (!resultadosMensais[mes]) resultadosMensais[mes] = [];
    resultadosMensais[mes].push(mediaWm2);
  }
  
  const mediasMensais = Object.entries(resultadosMensais).map(([Mes, valores]) => {
    const mediaMensal = valores.reduce((a, b) => a + b, 0) / valores.length;
    const mediaMensal_kWh = mediaMensal * 0.024;
    const mes = MESES[Mes.split("-")[1]]
    return { mes, media_kWh_m2_dia: mediaMensal_kWh };
  });

  return mediasMensais;
}
