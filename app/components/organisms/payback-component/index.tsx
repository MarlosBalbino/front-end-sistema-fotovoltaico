import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import style from './style.module.css'

type PaybackInput = {
  consumoMensal: number[];
  nPaineis: number;
  geracaoMensalPorPainel: number[];
  fase: number;
  tarifaEnergia: number;
  tarifaBandeira: number;
  custoPainel: number;
  custoInversor: number;
  custoMaoDeObra: number;
  inflacaoEnergia: number;
  anosAnalise: number;
  depreciacaoAnual: number;
  taxaFioB: number;
  inflacaoAnual: number;
  anoAtual: number;
};

type PaybackOutput = {
  investimentoTotal: number;
  economiaAcumulada: number;
  paybackMeses: number | null;
  paybackSimples: number;
  economiaAnual: number;
  economiaPorMes: { mes: string; economia: number }[];
  paybackPorAno: { ano: string; valorAcumulado: number }[];
};

function calcularPayback(input: PaybackInput): PaybackOutput {
  const {
    consumoMensal,
    nPaineis,
    geracaoMensalPorPainel,
    fase,
    tarifaEnergia,
    tarifaBandeira,
    custoPainel,
    custoInversor,
    custoMaoDeObra,
    inflacaoEnergia,
    anosAnalise,
    depreciacaoAnual,
    taxaFioB,
    inflacaoAnual,
    anoAtual
  } = input;

  const kfase = fase === 1 ? 30 : fase === 2 ? 50 : 100;
  const txFioB = taxaFioB === 0 ? tarifaEnergia * 0.55 : taxaFioB;

  let investimentoTotal = nPaineis * custoPainel + custoInversor + custoMaoDeObra * (1 + inflacaoAnual*anosAnalise);

  let economiaAcumulada = -investimentoTotal;
  let creditosKWh = 0;
  let paybackMeses: number | null = null;
  let economiaAnual = 0;
  const economiaPorMes: { mes: string; economia: number }[] = [];
  const paybackPorAno: { ano: string; valorAcumulado: number }[] = [];

  paybackPorAno.push({ ano: `Ano 0`, valorAcumulado: economiaAcumulada });

  outer: for (let ano = 0; ano < anosAnalise; ano++) {
    const fatorInflacao = Math.pow(1 + inflacaoEnergia, ano);
    const tarifaTotalAno = (tarifaEnergia + tarifaBandeira) * fatorInflacao;

    const fatorDepreciacao = Math.pow(1 - depreciacaoAnual, ano);
    const fatorValorizacaoCredito = Math.min(1, 0.45 + ((anoAtual + ano) - 2025) * 0.15);
    const taxaParcialFioB = tarifaTotalAno * txFioB * fatorValorizacaoCredito;
    const valorCredito = tarifaTotalAno - taxaParcialFioB;

    for (let mes = 0; mes < 12; mes++) {
      const consumoMes = consumoMensal[mes % 12];
      const geracaoBruta = nPaineis * geracaoMensalPorPainel[mes % 12];
      const geracaoLiquida = geracaoBruta * fatorDepreciacao;

      let contaSemFV = consumoMes * tarifaTotalAno;
      let contaComFV = 0;

      if (geracaoLiquida < consumoMes) {
        const energiaFaturada = Math.max(0, consumoMes - geracaoLiquida - creditosKWh);
        contaComFV = (energiaFaturada + kfase) * tarifaTotalAno;
        creditosKWh = Math.max(0, creditosKWh - (consumoMes - geracaoLiquida));
      } else {
        const creditoGerado = geracaoLiquida - consumoMes;
        const custoFaturavel = (creditoGerado + kfase) * tarifaTotalAno;
        const valorCreditoMes = creditoGerado * valorCredito;
        contaComFV = Math.max(0, custoFaturavel - valorCreditoMes);
        creditosKWh += creditoGerado;
      }

      const economiaMes = contaSemFV - contaComFV;
      economiaAcumulada += economiaMes;
      economiaPorMes.push({ mes: `Ano ${ano + 1} - Mês ${mes + 1}`, economia: economiaAcumulada });

      if (!paybackMeses && economiaAcumulada >= 0) {
        paybackMeses = ano * 12 + mes + 1;
      }
    }

    paybackPorAno.push({ ano: `Ano ${ano + 1}`, valorAcumulado: economiaAcumulada });
  }

  economiaAnual = consumoMensal.reduce((acc, mes) => acc + mes, 0) * tarifaEnergia;
  const paybackSimples = investimentoTotal / economiaAnual;

  return {
    investimentoTotal,
    economiaAcumulada,
    paybackMeses,
    paybackSimples,
    economiaAnual,
    economiaPorMes,
    paybackPorAno
  };
}

type PaybackEntrada = {
  consumoMensal: number;
  geracaoMensalPorPainel: number;
  nPaineis: number;
  fase: number;
  tarifaEnergia: number;
  tarifaBandeira: number;
  custoPainel: number;
  custoInversor: number;
  custoMaoDeObra: number;
  inflacaoEnergia: number;
  anosAnalise: number;
  depreciacaoAnual: number;
  taxaFioB: number;
  inflacaoAnual: number;
};

export default function PaybackComponent({
  consumoMensal,
  geracaoMensalPorPainel,
  nPaineis,
  fase,
  tarifaEnergia,
  tarifaBandeira,
  custoPainel,
  custoInversor,
  custoMaoDeObra,
  inflacaoEnergia,
  anosAnalise,
  depreciacaoAnual,
  taxaFioB,
  inflacaoAnual,
}: PaybackEntrada) {
  const [resultado, setResultado] = useState<PaybackOutput | null>(null);

  const handleCalculo = () => {
    const entrada: PaybackInput = {
      consumoMensal: Array(12).fill(consumoMensal),
      nPaineis,
      geracaoMensalPorPainel: Array(12).fill(geracaoMensalPorPainel),
      fase,
      tarifaEnergia,
      tarifaBandeira,
      custoPainel,
      custoInversor,
      custoMaoDeObra,
      inflacaoEnergia,
      anosAnalise,
      depreciacaoAnual,
      taxaFioB,
      inflacaoAnual,
      anoAtual: new Date().getFullYear(),
    };

    const resultado = calcularPayback(entrada);
    setResultado(resultado);
  };

  return (
    <div>
      <button className={style.submit_button} onClick={handleCalculo}>Calcular Payback</button>
      {resultado && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: "column" }}>
            <label className={style.result_label_level1}>Investimento Total: R$ {resultado.investimentoTotal.toFixed(2)} </label>
            <label className={style.result_label_level1}>Economia Acumulada: R$ {resultado.economiaAcumulada.toFixed(2)}</label>
            <label className={style.result_label_level1}>Payback Real (meses): {resultado.paybackMeses ?? 'Não atingido'} </label>
            <label className={style.result_label_level1}>Payback Simples (anos): {resultado.paybackSimples.toFixed(2)}</label>
            <label className={style.result_label_level1}>Economia Anual: R$ {resultado.economiaAnual.toFixed(2)}</label>
          </div>
          

          {/* <p><strong>Investimento Total:</strong> R$ {resultado.investimentoTotal.toFixed(2)}</p> */}
          {/* <p><strong>Economia Acumulada:</strong> R$ {resultado.economiaAcumulada.toFixed(2)}</p>
          <p><strong>Payback Real (meses):</strong> {resultado.paybackMeses ?? 'Não atingido'}</p>
          <p><strong>Payback Simples (anos):</strong> {resultado.paybackSimples.toFixed(2)}</p>
          <p><strong>Economia Anual:</strong> R$ {resultado.economiaAnual.toFixed(2)}</p> */}

          <hr className={style.subsection_divider} />

          <div style={{ display: 'flex', flexDirection:"column"}}>
            <div style={{ flex: 1, minWidth: 300 }}>              
              <h3 className={style.subsection_title}>Gráfico de Economia Acumulada (Mensal)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resultado.economiaPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="economia" stroke="#82ca9d" name="Economia Mensal Acumulada (R$)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: 1, minWidth: 300 }}>
              <h3 className={style.subsection_title}>Gráfico de Payback por Ano</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resultado.paybackPorAno}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valorAcumulado" fill="#8884d8" name="Economia Anual Acumulada (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>        
        </div>
      )}
    </div>
  );
}
