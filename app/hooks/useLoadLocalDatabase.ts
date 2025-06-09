import { useEffect, useState } from "react";
import Papa from "papaparse";

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export type DataPoint = { mes: string; [key: string]: number | string };
export interface Estacao {
  nome: string;
  municipio: string;
  latitude: string;
  longitude: string;
  inclinacao: string;
  orientacao: string;
  irradiancias: { [key: string]: (number | string)[] };
  dados_est: { [key: string]: { [key: string]: string | number } };
  origemArquivo: string;
}

const arquivos = [
  "/cresesb/irradiância_maceio_localidade1.csv",
  "/cresesb/irradiância_maceio_localidade2.csv",
  "/cresesb/irradiância_maceio_localidade3.csv"
];

export function useLoadLocalDatabase() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);

  useEffect(() => {
    (async () => {
      const todas: Estacao[] = [];

      for (const caminho of arquivos) {
        const text = await (await fetch(caminho)).text();
        const dados = Papa.parse<string[]>(text).data.filter(r => r.length > 1);

        const chaves = dados[0].slice(4, 20);
        const dados_est: Record<string, Record<string, string | number>> = {};
        for (let j = 1; j < dados.length; j++) {
          const valores = dados[j].slice(4, 20);
          const chave = `${valores[0]}° ${valores[1]}`;
          dados_est[chave] = Object.fromEntries(chaves.map((k, i) => [k, valores[i]]));
        }

        const irradiancias: Record<string, (number | string)[]> = {};
        for (const [k, v] of Object.entries(dados_est)) {
          irradiancias[k] = MESES.map(mes => v[mes] ?? null).filter(x => x !== null) as (number | string)[];
        }

        todas.push({
          nome: dados[1][0],
          municipio: dados[1][1],
          latitude: dados[1][2],
          longitude: dados[1][3],
          inclinacao: dados[1][4],
          orientacao: dados[1][5],
          irradiancias,
          dados_est,
          origemArquivo: caminho
        });
      }

      setEstacoes(todas);
    })();
  }, []);

  return estacoes;
}