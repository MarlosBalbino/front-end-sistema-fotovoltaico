import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type PaybackInput = {
  consumoMensal: number[]; // vetor de 12 meses
  nPaineis: number;
  geracaoMensalPorPainel: number[]; // vetor de 12 meses
  fase: number;
  tarifaEnergia: number;
  tarifaBandeira: number;
  custoPainel: number;
  custoInversor: number;
  custoMaoDeObra: number;
  inflacaoEnergia: number;
  anosAnalise: number;
  depreciacaoAnual: number;
  taxaFioB: number; // se 0, será calculado como 55%
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

  console.log(geracaoMensalPorPainel)

  const kfase = fase === 1 ? 30 : fase === 2 ? 50 : 100;
  const txFioB = taxaFioB === 0 ? tarifaEnergia * 0.55 : taxaFioB;

  let investimentoTotal =
    nPaineis * custoPainel + custoInversor + custoMaoDeObra * (1 + inflacaoAnual);

  let economiaAcumulada = 0;
  let creditosKWh = 0;
  let paybackMeses: number | null = null;
  let economiaAnual = 0;
  const economiaPorMes: { mes: string; economia: number }[] = [];

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

      if (!paybackMeses && economiaAcumulada >= investimentoTotal) {
        paybackMeses = ano * 12 + mes + 1;
        break outer;
      }
    }
  }

  economiaAnual = consumoMensal.reduce((acc, mes) => acc + mes, 0) * tarifaEnergia;
  const paybackSimples = investimentoTotal / economiaAnual;

  return {
    investimentoTotal,
    economiaAcumulada,
    paybackMeses,
    paybackSimples,
    economiaAnual,
    economiaPorMes
  };
}

type PaybackEntrada = {
  consumoMensal: number; // vetor de 12 meses
  geracaoMensalPorPainel: number;
  nPaineis: number;
   // vetor de 12 meses
  fase: number;
  tarifaEnergia: number;
  tarifaBandeira: number;
  custoPainel: number;
  custoInversor: number;
  custoMaoDeObra: number;
  inflacaoEnergia: number;
  anosAnalise: number;
  depreciacaoAnual: number;
  taxaFioB: number; // se 0, será calculado como 55%
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
      nPaineis: nPaineis,
      geracaoMensalPorPainel: Array(12).fill(geracaoMensalPorPainel),
      fase: fase,
      tarifaEnergia: tarifaEnergia,
      tarifaBandeira: tarifaBandeira,
      custoPainel: custoPainel,
      custoInversor: custoInversor,
      custoMaoDeObra: custoMaoDeObra,
      inflacaoEnergia: inflacaoEnergia,
      anosAnalise: anosAnalise,
      depreciacaoAnual: depreciacaoAnual,
      taxaFioB: taxaFioB,
      inflacaoAnual: inflacaoAnual,
      anoAtual: new Date().getFullYear(),
    };

    const resultado = calcularPayback(entrada);
    setResultado(resultado);
  };

  return (
    <div>
      <h2>Simulação de Payback Fotovoltaico</h2>
      <button onClick={handleCalculo}>Calcular Payback</button>
      {resultado && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Investimento Total:</strong> R$ {resultado.investimentoTotal.toFixed(2)}</p>
          <p><strong>Economia Acumulada:</strong> R$ {resultado.economiaAcumulada.toFixed(2)}</p>
          <p><strong>Payback Real (meses):</strong> {resultado.paybackMeses ?? 'Não atingido'}</p>
          <p><strong>Payback Simples (anos):</strong> {resultado.paybackSimples.toFixed(2)}</p>
          <p><strong>Economia Anual:</strong> R$ {resultado.economiaAnual.toFixed(2)}</p>
          <h3>Gráfico de Economia Acumulada</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={resultado.economiaPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} interval={11} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="economia" stroke="#82ca9d" name="Economia Acumulada" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
