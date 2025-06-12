'use client'

import { CanvasPlot, Plot, RechartsPlot } from '@organisms'
import style from './style.module.css'
import { useState } from 'react';

interface ControlSolutionProps{
  power?: number
}

export default function ControlSolution({power = 0}: ControlSolutionProps) {
  const initialParams = {
    Vp: 220 * Math.sqrt(2),
    // P: 22980,
    L: 1e-3,
    f: 60,
    phaseV: 0,
    numT: 2,
  };

  const [params, setParams] = useState(initialParams);
  const [irr, setIrr] = useState(0);
  const [phaseNum, setPhaseNum] = useState(1);
  const [multiplier, setMultiplier] = useState(12);
  const [showBlackBox, setShowBlackBox] = useState(false); // ✅ checkbox para mostrar/ocultar black_box

  function linspace(start: number, stop: number, num: number): number[] {
    const result = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
      result.push(start + step * i);
    }
    return result;
  }

  const graphWidth = 480;
  const graphHeight = 240;

  // const [power, setPower] = useState(0)

  const w = 2 * Math.PI * params.f;
  const T = 1 / params.f;
  const phaseI = params.phaseV * Math.PI / 180 - Math.PI;

  const Ip = 2 * power / params.Vp;
  const Vf = Math.sqrt(params.Vp ** 2 + (params.L * Ip * w) ** 2);
  const phi = Math.atan(w * params.L * Ip / params.Vp);

  const t = linspace(0, params.numT * T, 1e3);

  // ---------------------saída-------------------------
  const v = t.map(ti => params.Vp * Math.cos(w * ti + params.phaseV * Math.PI / 180));
  const i = t.map(ti => Ip * Math.cos(w * ti + phaseI));
  const p = v.map((vi, idx) => vi * i[idx] * 1e-3); // Potência instantânea em kW

  const pa = t.map(ti => (params.Vp*Ip/2 * Math.cos(2*w*ti )*Math.cos(params.phaseV * Math.PI / 180 + phaseI) + params.Vp*Ip/2 * Math.cos(params.phaseV * Math.PI / 180 - phaseI)) * 1e-3)
  const pr = t.map(ti => (-params.Vp*Ip/2 * Math.sin(2*w*ti )*Math.sin(params.phaseV * Math.PI / 180 + phaseI)) * 1e-3)

  // ---------------------entrada------------------------
  const vf = t.map(ti => Vf * Math.cos(w * ti + params.phaseV * Math.PI / 180 - phi));
  const i_f = t.map(ti => Ip * Math.cos(w * ti + params.phaseV * Math.PI / 180));
  const pf = vf.map((vi, idx) => vi * i_f[idx] * 1e-3);

  const paf = t.map(ti => (Vf*Ip/2 * Math.cos(2*w*ti )*Math.cos(2*params.phaseV * Math.PI / 180 - phi) + Vf*Ip/2 * Math.cos(phi)) * 1e-3)
  const prf = t.map(ti => (-Vf*Ip/2 * Math.sin(2*w*ti )*Math.sin(2*params.phaseV * Math.PI / 180 - phi)) * 1e-3)
  // ----------------------------------------------------

  const pMax = Math.max(...p);
  const pMin = Math.min(...p);
  const sla = pMax - pMin;
  const topYlim = pMax + 0.05 * sla;
  const bottomYlim = Math.abs(pMin) + 0.05 * sla;

  const pfMax = Math.max(...pf);
  const pfMin = Math.min(...pf);
  const sla2 = pfMax - pfMin;
  const pfTopYlim = pfMax + 0.05 * sla2;
  const pfBottomYlim = Math.abs(pfMin) + 0.05 * sla2;

  const handleChange = (key: keyof typeof params) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  // const handlePointClick = (yValue: number) => {
  //   // setIrr();
  //   setPower(yValue * multiplier / phaseNum)
  // };

  const controlGroups = [
    {
      label: 'Amplitude',
      keys: ['Vp'],
    },
  ];

  return (
  <div className={style.main_container}>
      {/* Seção de Parâmetros da Rede Elétrica */}
      <div className={style.plot_container}>
        <h3 className={style.subsection_title}>Parametros da Rede Elétrica:</h3>
        <RechartsPlot
          x={[t, t]}
          y={[v, i]}
          labels={['Tensão', 'Corrente']}
          lineWidths={[1, 1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Tensão (V)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={false}
          colors={['#8884d8', '#82ca9d', '#82ca']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
        <RechartsPlot
          x={[t]}
          y={[p]}
          labels={['Potência', 'Potência ativa', 'Potência reativa']}
          lineWidths={[1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={false}
          colors={['black', 'blue', 'red']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
        <RechartsPlot
          x={[t, t]}
          y={[pa, pr]}
          labels={['Potência ativa', 'Potência reativa']}
          lineWidths={[1, 1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={false}
          colors={['blue', 'red']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
      </div>

      <hr className={style.subsection_divider} />

      {/* Seção de Parâmetros de Entrada */}
      
      <div className={style.plot_container}>
        <h3 className={style.subsection_title}>Parametros da Entrada (Inversor):</h3>
        <RechartsPlot
          x={[t, t]}
          y={[vf, i_f]}
          labels={['Tensão', 'Corrente']}
          lineWidths={[1, 1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Tensão (V)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={true}
          colors={['#8884d8', '#82ca9d']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
        <RechartsPlot
          x={[t]}
          y={[pf]}
          labels={['Potência']}
          lineWidths={[1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={false}
          colors={['black']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
        <RechartsPlot 
          x={[t, t]}
          y={[paf, prf]}
          labels={['Potência ativa', 'Potência reativa']}
          lineWidths={[1, 1]}
          axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
          width={graphWidth}
          height={graphHeight}
          backgroundColor="#ffffff"
          perCurveYScale={false}
          colors={['blue', 'red']}
          gridLineWidth={0.1}
          xPrecision={3}
        />
      </div>

      {/* Painel de Controle */}
      {/* <div className={style.panel}>
        {controlGroups.map(group => (
          <div key={group.label} className={style.control_group}>
            <h4 className={style.group_title}>{group.label}</h4>
            {group.keys.map((key) => {
              const typedKey = key as keyof typeof params;
              return (
                <div key={key} className={style.input_group}>
                  <label className={style.label}>{key === "Vp" ? "Tensão da rede (rms)" : key}</label>
                  <input
                    type="range"
                    className={style.slider}
                    min={key.includes('phase') ? -180 : 0}
                    max={
                      key === 'Vp' ? 400 :
                      key === 'P' ? 50000 :
                      key === 'f' ? 100 :
                      key === 'numT' ? 10 : 360
                    }
                    step="0.1"
                    value={params[typedKey]}
                    onChange={handleChange(typedKey)}
                  />
                  <input
                    type="number"
                    className={style.input}
                    value={params[typedKey]}
                    onChange={handleChange(typedKey)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div> */}
    </div>
);}