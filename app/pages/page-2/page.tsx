'use client';

import { useEffect, useState } from 'react';
import { useDailyData } from '@/app/hooks/useDailyData';
import { PlotData } from "@organisms";
import style from './style.module.css';

export default function Page2() {
  const anosDisponiveis = ['2020', '2021'];

  const [ano, setAno] = useState(anosDisponiveis[0]);
  const [mes, setMes] = useState('01');
  const [dia, setDia] = useState('01');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, loading, error } = useDailyData(selectedDate);

  // Calcula dinamicamente os dias válidos do mês
  const diasNoMes = new Date(Number(ano), Number(mes), 0).getDate();
  const diasDisponiveis = Array.from({ length: diasNoMes }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  // Garante que o dia selecionado seja válido quando ano ou mês mudar
  useEffect(() => {
    if (Number(dia) > diasNoMes) {
      setDia(String(diasNoMes).padStart(2, '0'));
    }
  }, [ano, mes]);

  const handleClick = () => {
    const dataCompleta = `${ano}-${mes}-${dia}`;
    setSelectedDate(dataCompleta);
  };

  return (
    <div className={style.main_container}>
      <div className={style.section}>
        <h2 className={style.section_title}>Dados de Irradiância e Temperatura</h2>

        <div className={style.input_container}>
          <div className={style.date_input_group}>
            <label className={style.input_label}>Selecione a data:</label>

            <div className={style.date_input}>
              <select value={ano} onChange={(e) => setAno(e.target.value)}>
                {anosDisponiveis.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select value={mes} onChange={(e) => setMes(e.target.value)}>
                {[...Array(12)].map((_, i) => {
                  const m = String(i + 1).padStart(2, '0');
                  return <option key={m} value={m}>{m}</option>;
                })}
              </select>

              <select value={dia} onChange={(e) => setDia(e.target.value)}>
                {diasDisponiveis.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleClick} 
            disabled={loading}
            className={style.search_button}
          >
            {loading ? (
              <span className={style.loading_text}>
                <span className={style.loading_dots}>...</span>
              </span>
            ) : 'Buscar dados'}
          </button>
        </div>

        {error && <div className={style.error_message}>Erro: {error}</div>}

        {data && (
          <div className={style.plot_container}>
            <div className={style.plot_wrapper}>
              <h3 className={style.plot_title}>Irradiância Solar</h3>
              <PlotData 
                data={data.irradiancia} 
                xLabel='Hora do dia' 
                yLabel='Irradiância (W/m²)'
              />
            </div>
            <div className={style.plot_wrapper}>
              <h3 className={style.plot_title}>Temperatura do Painel</h3>
              <PlotData 
                data={data.temperatura} 
                xLabel='Hora do dia' 
                yLabel='Temperatura (°C)'
              />
            </div>
          </div>
        )}

        {data && data.notFound && (
          <div className={style.warning_message}>
            A data requisitada não foi encontrada!
          </div>
        )}

        {!loading && !data && !error && (
          <div className={style.warning_message}>
            Nenhum dado selecionado!
          </div>
        )}
      </div>
    </div>
  );
}
