"use client";
import { useState } from "react";
import style from "./style.module.css";
import { IrradChart } from "@organisms";
import { useLoadLocalDatabase, Estacao, DataPoint } from "@/app/hooks/useLoadLocalDatabase";

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function DataProcessing() {
  const estacoes = useLoadLocalDatabase();
  const [selecionada, setSelecionada] = useState<Estacao | null>(null);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [dados, setDados] = useState<DataPoint[]>([]);

  const parse = (val: string | number) => typeof val === 'number' ? val : parseFloat(val.replace(/\./g, '').replace(',', '.'));

  const processar = (chaves: string[], base: Record<string, (string | number)[]>): DataPoint[] =>
    MESES.map((mes, i) => {
      const ponto: DataPoint = { mes };
      chaves.forEach(k => {
        if (base[k] && base[k][i] != null) ponto[k] = parse(base[k][i]);
      });
      return ponto;
    });

  const toggle = (k: string) => {
    const nova = selecionadas.includes(k)
      ? selecionadas.filter(x => x !== k)
      : [...selecionadas, k];
    setSelecionadas(nova);
    if (selecionada) setDados(processar(nova, selecionada.irradiancias));
  };

  return (
    <div className={style.main_container}>
      <div className={style.content_container}>
        
        <div className={style.locations_grid}>
          {estacoes.map((e, i) => (
            <div
              key={i}
              className={`${style.estacao_card} ${selecionada?.nome === e.nome ? style.selected : ''}`}
              onClick={() => {
                setSelecionada(e);
                setSelecionadas([]);
                setDados([]);
              }}
            >
              <h4>{e.nome}</h4>
              <p>{e.municipio}</p>
            </div>
          ))}
        </div>

        {selecionada && (
          <>
            <div className={style.table_container}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    {Object.keys(Object.values(selecionada.dados_est)[0]).map((m, i) => <th key={i}>{m}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selecionada.dados_est).map(([k, v], j) => (
                    <tr key={j}>
                      <td><input type="checkbox" checked={selecionadas.includes(k)} onChange={() => toggle(k)} /></td>
                      {Object.values(v).map((v, i) => <td key={i}>{String(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {dados.length > 0 && (
              <div className={style.chart_container}>
                <IrradChart irradiancias={dados} labels={selecionadas} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
