"use client";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import { IrradChart } from "@organisms";
import { useLoadLocalDatabase, Estacao, DataPoint } from "@/app/hooks/useLoadLocalDatabase";
import { useMergeDataPoints } from "@/app/hooks/useMergeDataPoints"

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function CompareGraphs( { data, data_label = "" }: { data: DataPoint[], data_label?: string}) {
  const estacoes = useLoadLocalDatabase();
  const [selecionada, setSelecionada] = useState<Estacao | null>(null);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [dados, setDados] = useState<DataPoint[]>([]);
  const [labels, setLabels] = useState<string[]>([])

  const parse = (val: string | number) =>
    typeof val === 'number' ? val : parseFloat(val.replace(/\./g, '').replace(',', '.'));

  const processar = (chaves: string[], base: Record<string, (string | number)[]>): DataPoint[] =>
    MESES.map((mes, i) => {
      const ponto: DataPoint = { mes };
      chaves.forEach(k => {
        if (base[k] && base[k][i] != null) ponto[k] = parse(base[k][i]);
      });
      return ponto;
    });

  useEffect(() => {
    setDados(data)
    setLabels([data_label])
  }, [data, data_label])

  const toggle = (k: string) => {
    const nova = selecionadas.includes(k)
      ? selecionadas.filter(x => x !== k)
      : [...selecionadas, k];

    setSelecionadas(nova);

    if (selecionada) {
      const dados_processados = processar(nova, selecionada.irradiancias);
      const dados_reunidos = useMergeDataPoints(dados_processados, data);
      setDados(dados_reunidos);
      setLabels([...nova, data_label]); 
    }
  };

  return (
    <div className={style.main_container}>
      <div className={style.content_container}>
        {/* Estação: Select */}
        <div> 
          <div>
            <label htmlFor="selectEstacao" className={style.label}>Escolha uma estação:</label>         
            <select
              id="selectEstacao"
              className={style.select}
              value={selecionada?.nome || ''}
              onChange={(e) => {
                const est = estacoes.find(est => est.nome === e.target.value);
                setSelecionada(est || null);
                setSelecionadas([]);
                setDados([]);
                setLabels([])
              }}
            >
              <option value="">Selecione...</option>
              {estacoes.map((e, i) => (
                <option key={i} value={e.nome}>
                  {e.nome.slice(0, -4)} — {e.municipio} | latitude: {e.latitude}; longitude: {e.longitude}                
                </option>
              ))}
            </select>
          </div>          
        </div>

        {/* Tabela de dados da estação */}
        {selecionada && (
          <>
            <div className={style.table_container}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th className={style.checkbox_header}>Selecionar</th>
                    {Object.keys(Object.values(selecionada.dados_est)[0]).map((m, i) => (
                      <th key={i} className={style.table_header}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selecionada.dados_est).map(([k, v], j) => (
                    <tr key={j} className={selecionadas.includes(k) ? style.selected_row : ''}>
                      <td className={style.checkbox_cell}>
                        <input
                          type="checkbox"
                          className={style.checkbox}
                          checked={selecionadas.includes(k)}
                          onChange={() => toggle(k)}
                        />
                      </td>
                      {Object.values(v).map((val, i) => (
                        <td key={i} className={style.table_cell}>{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gráfico */}
            {dados.length > 0 && (
              <div className={style.chart_container}>
                <IrradChart irradiancias={dados} yLabel="Irradiação" yUnit="kWh/m2.dia" labels={labels} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}