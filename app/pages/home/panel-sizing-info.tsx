

import React, { useState } from 'react';
import style from './style.module.css';
import { SimpleButton } from '@/app/components/atoms';

const PvSizingInfo: React.FC = () => {
  const [mostrarMais, setMostrarMais] = useState(false);

  return (
    <section className={style.section}>
      <h2 className={style.h2}>Energia Solar e Dimensionamento de Painéis</h2>
      <div className={style.alguma_coisa}>          
        <p>
          A energia solar fotovoltaica tem se destacado como uma solução sustentável e econômica para a geração de eletricidade. Utilizando a luz do sol como fonte primária, os sistemas fotovoltaicos convertem a radiação solar em energia elétrica por meio de painéis solares. Essa tecnologia contribui significativamente para a redução da dependência de combustíveis fósseis, além de oferecer vantagens como baixo impacto ambiental e economia na conta de luz.
        </p>

        <p>
          Para que um sistema fotovoltaico funcione de forma eficiente, é essencial que ele seja dimensionado corretamente. O dimensionamento considera variáveis como o consumo mensal de energia, a disponibilidade solar da região, a potência dos painéis utilizados e possíveis perdas no sistema (como sombreamento, temperatura e desalinhamento). A partir dessas informações, é possível calcular com precisão o número ideal de painéis necessários para atender à demanda energética de uma residência, comércio ou propriedade rural.
        </p>

        <p>
          O objetivo desta plataforma é proporcionar uma experiência educativa e acessível para todos que desejam entender melhor a tecnologia solar fotovoltaica, simulando o funcionamento completo de um sistema, desde o dimensionamento adequado dos painéis até sua operação em condições reais, incluindo o ajuste de parâmetros para conexão à rede elétrica e a estimativa do retorno financeiro (payback) do investimento.
        </p>     
      </div>
      <div className={style.button_div}>
        <SimpleButton link={'/pages/page-1'} label={'Ir Para Simulação'} iconOption="hiArrowRight"/>
      </div>
    </section>
  );
};

export default PvSizingInfo;

