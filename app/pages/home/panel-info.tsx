import React, { useState } from 'react';
import style from './style.module.css';
import { SimpleButton } from '@/app/components/atoms';

const PvPanelInfo: React.FC = () => {
  const [mostrarMais, setMostrarMais] = useState(false);

  return (
    <section className={style.section}>
      <h2 className={style.h2}>Funcionamento de Painéis Fotovoltaicos e Curvas Características</h2>

      <div className={style.alguma_coisa}>
        <p>
          Os painéis fotovoltaicos operam a partir do efeito fotovoltaico, no qual a incidência de radiação solar sobre os materiais semicondutores da célula gera pares elétron-buraco, resultando em uma corrente elétrica contínua. O modelo físico mais utilizado para descrever esse comportamento é o <strong>modelo de um diodo simples com cinco parâmetros</strong>, que representa a célula como uma fonte de corrente em paralelo com um diodo, resistência de shunt (R<sub>sh</sub>) e em série com uma resistência (R<sub>s</sub>).
        </p>

        <p>
          A equação que representa esse modelo é:
        </p>

        <code>
          I = I<sub>ph</sub> − I<sub>o</sub>(exp[(V + IR<sub>s</sub>) / (nV<sub>t</sub>)] − 1) − (V + IR<sub>s</sub>) / R<sub>sh</sub>
        </code>

        <p>Onde:</p>
        <ul>
          <li>I<sub>ph</sub>: corrente fotogerada</li>
          <li>I<sub>o</sub>: corrente de saturação em escuridão</li>
          <li>R<sub>s</sub> e R<sub>sh</sub>: resistências série e paralela</li>
          <li>n: fator de idealidade do diodo</li>
          <li>V<sub>t</sub>: tensão térmica</li>
        </ul>

        {!mostrarMais && (
          <button className={style.verMais} onClick={() => setMostrarMais(true)}>
            Ver mais
          </button>
        )}

        {mostrarMais && (
          <>
            <h3>Curvas I–V e P–V</h3>
            <p>
              As <strong>curvas características</strong> I–V (Corrente × Tensão) e P–V (Potência × Tensão) descrevem o comportamento elétrico de um painel sob diferentes condições de operação:
            </p>
            <ul>
              <li><strong>Curva I–V:</strong> mostra a relação entre a corrente gerada e a tensão nos terminais. Possui como extremos a corrente de curto-circuito (I<sub>sc</sub>) e a tensão de circuito aberto (V<sub>oc</sub>).</li>
              <li><strong>Curva P–V:</strong> representa a potência gerada em função da tensão. Seu ponto de maior valor define o <em>Ponto de Máxima Potência (MPP)</em>.</li>
            </ul>

            <h3>Importância da Curva Característica</h3>
            <p>O traçado dessas curvas permite:</p>
            <ul>
              <li>Avaliar o desempenho do painel em diferentes condições ambientais;</li>
              <li>Determinar o ponto de máxima extração de potência (MPP);</li>
              <li>Modelar eletricamente o painel usando apenas dados da ficha técnica;</li>
              <li>Validar algoritmos de rastreamento de máxima potência (MPPT);</li>
              <li>Detectar falhas, perdas e impactos de sombreamento parcial ou aquecimento.</li>
            </ul>

            <p>
              Esses modelos são fundamentais no dimensionamento e controle de sistemas fotovoltaicos conectados à rede ou autônomos. A precisão na representação do comportamento elétrico do painel permite simulações realistas e decisões técnicas mais seguras.
            </p>
          </>
        )}
      </div>
      <div className={style.button_div}>
        <SimpleButton link={'/pages/page-3'} label={'Ir Para Curva Característica'} iconOption="hiArrowRight"/>
      </div>
    </section>
  );
};

export default PvPanelInfo;

