'use client'

import { CanvasPlot } from '@organisms'
import style from './style.module.css'
import { useState } from 'react';

export default function Page4() {
  const initialParams = {
    Vp: 220 * Math.sqrt(2),
    P: 22980,
    L: 1e-3,
    f: 60,
    phaseV: 0,
    numT: 2,
  };

  const [params, setParams] = useState(initialParams);

  function linspace(start: number, stop: number, num: number): number[] {
    const result = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
      result.push(start + step * i);
    }
    return result;
  }

  const w = 2 * Math.PI * params.f;
  const T = 1 / params.f;
  const phaseI = params.phaseV * Math.PI / 180 - Math.PI

  const Ip = 2 * params.P/3 / params.Vp;
  const Vf = Math.sqrt(params.Vp ** 2 + (params.L * Ip * w) ** 2);
  const phi = Math.atan(w * params.L * Ip / params.Vp);

  const t = linspace(0, params.numT * T, 1e3);

  const v = t.map(ti => params.Vp * Math.cos(w * ti + params.phaseV * Math.PI / 180));
  const i = t.map(ti => Ip * Math.cos(w * ti + phaseI));
  const p = v.map((vi, idx) => vi * i[idx] * 1e-3); // Potência instantânea em kW

  const vf = t.map(ti => Vf * Math.cos(w * ti + params.phaseV * Math.PI / 180 - phi));
  const i_f = t.map(ti => Ip * Math.cos(w * ti + params.phaseV * Math.PI / 180));
  const pf = vf.map((vi, idx) => vi * i_f[idx] * 1e-3);

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

  const controlGroups = [
    {
      label: 'Amplitude',
      keys: ['Vp', 'P'], // Ip substituído por P
    },
    // {
    //   label: 'Frequência e Tempo',
    //   keys: ['f', 'numT'],
    // },
    // {
    //   label: 'Fase',
    //   keys: ['phaseV'],
    // },
  ];

  return (
    <div className={style.main_container}>
      <div className={style.plot_container}>
        <h2>Parâmetros da rede elétrica</h2>
        <div className={style.plot1}>
          {/* <h2>Tensão x Corrente</h2> */}
          <CanvasPlot
            x={t}
            y={[v, i]}
            labels={['Tensão', 'Corrente']}
            lineWidths={[1, 1]}
            axisLabels={{ x: 'Tempo (s)', y: 'Tensão (V)' }}
            width={600}
            height={400}
            backgroundColor="#f0f0f0"
            perCurveYScale={false}
            colors={['#8884d8', '#82ca9d']}
            gridLineWidth={0.1}
            xPrecision={4}
            // ylim={[-400, 400]}
          />
          {/* <h2>Potência</h2> */}
          <CanvasPlot
            x={t}
            y={[p]}
            labels={['Potência']}
            lineWidths={[1]}
            axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
            width={600}
            height={400}
            backgroundColor="#f0f0f0"
            perCurveYScale={false}
            colors={['black']}
            gridLineWidth={0.1}
            xPrecision={4}
            ylim={[-bottomYlim, topYlim]}
          />
        </div>
        <h2>Parâmetros de entrada (inversor)</h2>
        <div className={style.plot1}>
          {/* <h2>Tensão x Corrente</h2> */}
          <CanvasPlot
            x={t}
            y={[vf, i_f]}
            labels={['Tensão', 'Corrente']}
            lineWidths={[1, 1]}
            axisLabels={{ x: 'Tempo (s)', y: 'Tensão (V)' }}
            width={600}
            height={400}
            backgroundColor="#f0f0f0"
            perCurveYScale={false}
            colors={['#8884d8', '#82ca9d']}
            gridLineWidth={0.1}
            xPrecision={4}
            // ylim={[-400, 400]}
          />
          {/* <h2>Potência</h2> */}
          <CanvasPlot
            x={t}
            y={[pf]}
            labels={['Potência']}
            lineWidths={[1]}
            axisLabels={{ x: 'Tempo (s)', y: 'Potência (kW)' }}
            width={600}
            height={400}
            backgroundColor="#f0f0f0"
            perCurveYScale={false}
            colors={['black']}
            gridLineWidth={0.1}
            xPrecision={4}
            ylim={[-pfBottomYlim, pfTopYlim]}
          />
        </div>
        
        <div className={style.panel}>
          {controlGroups.map(group => (
            <div key={group.label} className={style.control_group}>
              <h4 className={style.group_title}>{group.label}</h4>
              {group.keys.map((key) => {
                const typedKey = key as keyof typeof params;
                return (
                  <div key={key} className={style.input_group}>
                    <label className={style.label}>{key}</label>
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
        </div>
      </div>
    </div>
  );
}
