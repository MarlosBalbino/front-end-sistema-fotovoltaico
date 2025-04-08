"use client";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import Papa from "papaparse";
import { IrradChart } from "@organisms";

type DataPoint = {
  mes: string;
  [key: string]: number | string;
};

interface Estacao {
  nome: string;
  municipio: string;
  latitude: string;
  longitude: string;
  inclinacao: string;
  orientacao: string;
  irradiancias: { [key: string]: (number | string)[] };
  // irradiancias: [];
  dados_est: { [key: string]: { [key: string]: string | number } };
  origemArquivo: string;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export default function DataProcessing({ update }: { update: boolean }) {
  
  const [formData, setFormData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [selecionada, setSelecionada] = useState<Estacao | null>(null);
  const [irradiancias, setIrradiancias] = useState<DataPoint[]>([])
  const [irradianciasSelecionadas, setIrradianciasSelecionadas] = useState<string[]>([]);

  const arquivos = [
    "/cresesb/irradiância_maceio_localidade1.csv",
    "/cresesb/irradiância_maceio_localidade2.csv",
    "/cresesb/irradiância_maceio_localidade3.csv"
  ];

  // conversão numero string => float
  const parseNumberFromString = (value: string | number): number => {
    if (typeof value === 'number') return value;
    
    const cleanValue = value.replace(/\./g, '')
      .replace(/,/g, '.');
    
    return parseFloat(cleanValue);
  };

  function processarDadosGrafico(chavesSelecionadas: string[], dados: { [key: string]: (number | string)[] }): DataPoint[] {
    if (chavesSelecionadas.length === 0 || MESES.length === 0) {
      return [];
    }
  
  
    const dadosSelecionados: DataPoint[] = MESES.map((mes, index) => {
      const ponto: DataPoint = { mes };
      
      chavesSelecionadas.forEach(chave => {
        if (dados[chave] && dados[chave][index] !== undefined) {
          ponto[chave] = parseNumberFromString(dados[chave][index]);
        }
      });
      
      return ponto;
    });
  
    return dadosSelecionados;
  }

  const carregarDados = async () => {
    const todasEstacoes: Estacao[] = [];

    for (const caminho of arquivos) {
      const response = await fetch(caminho);
      const text = await response.text();
      const parsed = Papa.parse<string[]>(text, { header: false });
      const dados = parsed.data.filter((row) => row.length > 1);
      
      const chaves = dados[0].slice(4, 20); //cabeçalho da tabela (inclinação,..., delta)
      const dados_est: { [key: string]: { [key: string]: string | number } } = {};      
      for (let j = 1; j < dados.length; j++) {
        const valores = dados[j].slice(4, 20);    
        
        const chave = `${valores[0]}° ${valores[1]}`
        dados_est[chave] = Object.fromEntries(
          chaves.map((key, i) => [key, valores[i]])
        );
      }      

      const irradiancias: { [key: string]: (number | string)[] } = {};
      for (const [key, value] of Object.entries(dados_est)) {
        irradiancias[key] = MESES.map(mes => value[mes as keyof typeof value] || null)
          .filter(val => val !== null) as (number | string)[];
      }

      const estacao: Estacao = {
        nome: dados[1][0],
        municipio: dados[1][1],
        latitude: dados[1][2],
        longitude: dados[1][3],
        inclinacao: dados[1][4],
        orientacao: dados[1][5],
        irradiancias: irradiancias,
        dados_est: dados_est,
        origemArquivo: caminho
      };
      
      todasEstacoes.push(estacao);
    }

    setEstacoes(todasEstacoes);
  };

  useEffect(() => {
    const form = localStorage.getItem("solarFormData");
    const csv = localStorage.getItem("solarCsvData");

    if (csv) {
      setCsvData(JSON.parse(csv));
      setFormData(null);
    } else if (form) {
      setFormData(JSON.parse(form));
      setCsvData([]);
    }

    carregarDados();
  }, [update]);

  const toggleSerie = (key: string) => {
    setIrradianciasSelecionadas((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  useEffect(() => {
    if (selecionada) {
      const dadosSelecionados = processarDadosGrafico(irradianciasSelecionadas, selecionada.irradiancias);
      setIrradiancias(dadosSelecionados)
    }
    
  }, [irradianciasSelecionadas]);

  return (
    <div className={style.main_container}>
      <div className={style.locations}>
          <label className={style.label}>Localidades disponíveis (estações)</label>

          {estacoes.map((estacao, idx) => (
            <div
              key={idx}
              className={style.estacaoBox}
              onClick={() => setSelecionada(estacao)}
              style={{ cursor: "pointer" }}
            >
              <h3>
                {estacao.nome}
              </h3>
              <p>
                Municipio: {estacao.municipio}, Lat: {estacao.latitude}, Lon: {estacao.longitude}
              </p>
            </div>
          ))}
      </div>

      <div className={style.vertical_line}></div>

      {selecionada && (
        <div className={style.data}>
          <div className={style.location_data}>
            <label className={style.label}>Dados da localidade</label>
          
            <div className={style.scroll_container}>
              <table className={style.table}>
                <thead>                  
                  <tr> 
                    <th>''</th>                   
                    {Object.values(selecionada.dados_est).slice(0, 1).map((dados_k) => (
                      Object.keys(dados_k).map((mes, i) => (
                        <th key={i}>{mes}</th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>          
                  {Object.keys(selecionada.dados_est).map((dados_k, j) => (
                    <tr key={j}>
                      <td>
                        <input className={style.input_box}
                          type="checkbox"
                          checked={irradianciasSelecionadas.includes(dados_k)}
                          onChange={() => toggleSerie(dados_k)}
                        />
                      </td>
                      {Object.values(selecionada.dados_est[dados_k]).map((value, i) => (
                        <th key={i}>{value}</th>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <div>
                {irradianciasSelecionadas.map((serie, i) => (
                  <label key={i}>{serie}</label>
                ))}
              </div> */}
            </div>          
          </div>

          <div className={style.vertical_line}></div>

          {irradianciasSelecionadas.length > 0 && (
            <div className={style.irr_data}>
              <label className={style.label}>Gráfico de Irradiância</label>          
                <IrradChart irradiancias={irradiancias} labels={irradianciasSelecionadas}/>            
            </div>
          )}
        </div>
      )}
    </div>
  );
}