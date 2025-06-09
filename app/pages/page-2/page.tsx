'use client';

import { use, useEffect, useState } from 'react';
import { useDailyData } from '@/app/hooks/useDailyData';
import { DimensionForm, PlotData, CompareGraphs, ShowRechartsPlots, IrradChart, ControlSolution, PaybackComponent, Results } from "@organisms";
import style from './style.module.css';
import calcIrradIncidente from '@/app/utils/calcIrradIncident'
import { computeIrradiance } from '@/app/utils/computePerezIrrad';
import calcMeanIrrad from '@/app/utils/calcMeanIrrad'
import calcPanelSizing from '@/app/utils/calcPanelSizing';
import { calcEnergiaGerada } from '@/app/utils/calcEnergy';
import { DataPoint } from '@/app/hooks/useLoadLocalDatabase';
import { FormData } from '@/app/types/FormData'

import { orientationMap } from "@/app/utils/orientationMap";
import { useAllData } from '@/app/hooks/useAllData';
import { PvResult } from '@/app/types/PvResult';
import { ClimaticInput } from '@/app/types/climaticInput';

const tarifa_consumo: Record<string, { tarifa: number, fases: number }> = {
  monofasico: { tarifa: 30, fases: 1 },
  bifasico: { tarifa: 50, fases: 2},
  trifasico: { tarifa: 100, fases: 3 }
}

export default function Page2() {
  const [formData, setFormData] = useState<FormData>({
    consumo: "",
    perfil: "monofasico",
    inclinacao: "",
    orientacao: "",
    modelo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    ns: "",
    ki: "",
    kv: "",
    area: "",
    eficiencia: "",
    fileName: "",
    importFile: false,
    useDefaultData: true,
    
    // Dados do Payback
    tarifa_de_energia: "",
    tarifa_da_bandeira: "",
    custo_por_painel: "",
    custo_por_inversor: "",
    custo_mao_de_obra: "",
    inflacao_de_energia: "",
    anos_de_analise: "",
    depreciacao_anual: "",
    taxa_do_fio_b: "",
    inflacao_anual: ""
  })

  const [ panelParamsResult, setPanelParamsResult ] = useState<PvResult | null>(null)
  const [climaticConditionsForm, setClimaticConditionsForm] = useState<ClimaticInput>({
    T: "25",
    G: "1000"
  })

  const anosDisponiveis = ['2020'];

  const [ano, setAno] = useState(anosDisponiveis[0]);
  const [mes, setMes] = useState('01');
  const [dia, setDia] = useState('01');
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [medias, setMedias] = useState<DataPoint[]>([])
  const [horaSol, setHoraSol] = useState(0)
  const [nPaineis, setNPaneis] = useState(0)
  const [geracaoMensal, setGeracaoMensal] = useState<DataPoint[]>([])
  const [energiaAcumulada, setEnergiaAcumulada] = useState(0)

  const [panelsParamsResult, setPanelsParamsResult] = useState<PvResult | null>(null);

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

  const { data: dailyData, loading: dailyLoading, error: dailyError } = useDailyData(selectedDate);
  const { data: allData, loading: allLoading, error: allError } = useAllData();

  const latitude = -9.55766947266527;
  const longitude = -35.78090672062049;
  const longMeridiano = -45;
  const horarioVerao = 0;

  const handleSelectDateClick = () => {
    const dataCompleta = `${ano}-${mes}-${dia}`;
    setSelectedDate(dataCompleta);
  };

  const [graphData, setGraphData] = useState(0)

  const [angle, setAngle] = useState(0) // temporário

  function calcularGeracaoMensal(
    medias: DataPoint[],
    potenciaPaineis: number,
    nPaineis: number
  ): { geracaoMensal: DataPoint[]; energiaAcumulada: number } {
    let energiaAcumulada = 0;

    const geracaoMensal = medias.map((item) => {
      const novoItem: DataPoint = { mes: item.mes };

      for (const chave in item) {
        if (chave !== 'mes') {
          const valor = item[chave];
          if (typeof valor === 'number') {
            const energia_mes = calcEnergiaGerada(nPaineis, potenciaPaineis, valor);
            novoItem[chave] = energia_mes;
            energiaAcumulada += energia_mes;
          }
        }
      }

    return novoItem;
  });

  return {
    geracaoMensal,
    energiaAcumulada,
  };
}

  const extractPanelParams = async (formData: FormData, horaSol: number, medias: DataPoint[]) => {
    // setLoading(true);
    // setErrorMsg('');
    // setResult(null);

    // Validação dos campos obrigatórios
    const requiredFields: string[] = [
      'Isc', 'Voc', 'Imp', 'Vmp', 'Ns', 'ki', 'kv', 'T', 'G'
    ];

    // const errors: Record<string, boolean> = {};
    // for (const field of requiredFields) {
    //   const value = field in panelModelForm
    //     ? panelModelForm[field as keyof PvInput]
    //     : climaticConditionsForm[field as keyof ClimaticInput];
    //   if (!value || value.trim() === "") {
    //     errors[field] = true;
    //   }
    // }

    // if (Object.keys(errors).length > 0) {
    //   setInputErrors(errors);
    //   setErrorMsg("Campo obrigatório não preenchido");
    //   setLoading(false);
    //   return;
    // }

    // setInputErrors({});

    let isValid = true;

    for (const [key, value] of Object.entries(formData)) {
      if (value === null || value === undefined || value === '') {
        console.warn(`Campo "${key}" está vazio ou ausente.`);
        isValid = false;
        break;
      }

      // if (numericFields.includes(key) && isNaN(parseFloat(value))) {
      //   console.warn(`Campo "${key}" deve ser um número válido.`);
      //   isValid = false;
      //   break;
      // }
    }

    if (!isValid) {
      alert('Preencha todos os campos corretamente.');
      return
    }

    try {
      const numericForm = {
        Isc: parseFloat(formData.isc),
        Voc: parseFloat(formData.voc),
        Imp: parseFloat(formData.imp),
        Vmp: parseFloat(formData.vmp),
        Ns: parseFloat(formData.ns),
        ki: parseFloat(formData.ki),
        kv: parseFloat(formData.kv),
        T: 25,
        G: 1000,
        n_series: 1,
        n_parallel: 1
      };
      
      const url_vercel = 'https://python-vercel-35m9ym18x-marlosbalbinos-projects.vercel.app/extract'
      const url_local = 'http://127.0.0.1:5000/extract'

      const res = await fetch(url_vercel, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericForm)
      });

      const data: PvResult = await res.json();

      if (res.ok) {

        setPanelParamsResult(data);

        const nPaineis = calcPanelSizing(
          parseFloat(formData.consumo), 
          tarifa_consumo[formData.perfil].tarifa, 
          data.P_mpp, 
          horaSol,
        )

        setNPaneis(nPaineis)     
        const {geracaoMensal, energiaAcumulada } = calcularGeracaoMensal(medias, data.P_mpp, nPaineis)   
        setGeracaoMensal(geracaoMensal)
        setEnergiaAcumulada(energiaAcumulada)


      } else {
        // setErrorMsg('Erro desconhecido.');
        console.log("Fudeu")
      }
    } catch (err) {
      // setErrorMsg('Erro ao chamar a API.');
      console.error('API Error:', err);
    }
    // setLoading(false);
  };

  // ===================================  SUBMIT =============================================================================

  const handleSubmit = async (formData: any) => {
    setFormData(formData);
    if (!allLoading && !allError && allData) {
      const inclinacao = Number(formData.inclinacao);
      const azimute = orientationMap[formData.orientacao].angle;
      setAngle(azimute);

      const medias_inclinadas = calcMeanIrrad(
        allData.irradiancia,
        inclinacao,
        azimute,
        latitude,
        longitude,
        longMeridiano,
        horarioVerao
      );

      setMedias(medias_inclinadas);
      const horaSol = Math.min(...medias_inclinadas.map(obj => obj.media_kWh_m2_dia));
      setHoraSol(horaSol);

      // Esperar o término da função assíncrona
      await extractPanelParams(formData, horaSol, medias_inclinadas);

      console.log("Médias diárias:", medias_inclinadas);
    }
  };

  const extractPanelsParams = async (irrad: number, temp: number) => {
      // setLoading(true);
      // setErrorMsg('');
      // setResult(null);
  
      // Validação dos campos obrigatórios
      const requiredFields: string[] = [
        'Isc', 'Voc', 'Imp', 'Vmp', 'Ns', 'ki', 'kv', 'T', 'G'
      ];
  
      // const errors: Record<string, boolean> = {};
      // for (const field of requiredFields) {
      //   const value = field in panelModelForm
      //     ? panelModelForm[field as keyof PvInput]
      //     : climaticConditionsForm[field as keyof ClimaticInput];
      //   if (!value || value.trim() === "") {
      //     errors[field] = true;
      //   }
      // }
  
      // if (Object.keys(errors).length > 0) {
      //   setInputErrors(errors);
      //   setErrorMsg("Campo obrigatório não preenchido");
      //   setLoading(false);
      //   return;
      // }
  
      // setInputErrors({});
      try {
        const numericForm = {
          Isc: parseFloat(formData.isc),
          Voc: parseFloat(formData.voc),
          Imp: parseFloat(formData.imp),
          Vmp: parseFloat(formData.vmp),
          Ns: parseFloat(formData.ns),
          ki: parseFloat(formData.ki),
          kv: parseFloat(formData.kv),
          T: temp,
          G: irrad,
          n_series: nPaineis,
          n_parallel: 1
        };
        
        const url_vercel = 'https://python-vercel-35m9ym18x-marlosbalbinos-projects.vercel.app/extract'
        const url_local = 'http://127.0.0.1:5000/extract'
  
        console.log('Sending:', JSON.stringify(numericForm));
  
        const res = await fetch(url_vercel, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(numericForm)
        });
  
        const data: PvResult = await res.json();
  
        if (res.ok) {
          setPanelsParamsResult(data);
          const climatic: ClimaticInput = {G: irrad.toString(), T: temp.toString()}
          setClimaticConditionsForm(climatic)
        } else {
          console.log("Erro nos calculos dos parametros dos painéis")
        }
      } catch (err) {
        console.error('API Error:', err);
      }
      // setLoading(false);
    };

  // ===================================  HANDLE CLICK =============================================================================
  
  const [GIncReal, setGIncReal] = useState(0)
  const [theta, setTheta] = useState(0)  

  const handlePointClick = ({ xValue, yValue }: { xValue: string; yValue: number }) => {
    console.log(`${selectedDate} ${xValue},\n Irrad Global: ${yValue}`);

    // Encontrar temperatura no horário correspondente
    const temperaturaItem = dailyData?.temperatura?.find(item => item.x === xValue);
    const temperatura = temperaturaItem?.y;

    if (temperatura !== undefined) {
      console.log(`Temperatura em ${xValue}: ${temperatura}°C`);
    } else {
      console.warn(`Temperatura não encontrada para o horário ${xValue}`);
      return
    }

    const inclinacao = Number(formData.inclinacao);
    const azimute = orientationMap[formData.orientacao].angle;

    const { G_inc_real, theta_i } = calcIrradIncidente(
      selectedDate,
      xValue,
      yValue,
      inclinacao,
      azimute,
      latitude,
      longitude,
      longMeridiano,
      0,
      true
    );

    console.log("Irrad_Inclinada: ", G_inc_real);
    console.log("Paineis:", nPaineis)
    setGIncReal(G_inc_real)
    setTheta(theta_i)
    extractPanelsParams(G_inc_real, temperatura)
  };

  return (
    <div className={style.main_container}>
      <div className={style.section}>
        <h2 className={style.section_title}>Formulário de dimensionamento e Payback</h2>
        <DimensionForm onSubmit={handleSubmit} />
      </div>     

      {/* Dados Formulário:
      <div>
        <ul>         
          {Object.entries(formData).map(([key, value]) => (
            <li key={key}>{key}: {value} {key === "orientacao" ? `(${angle}°)` : ""} </li>
          ))}
        </ul>
      </div> */}

      <div className={style.section}>
        <h2 className={style.section_title}>Comparativo: Base de dados 2020 x Dados Cresesb</h2>
        <CompareGraphs data={medias} data_label={`${formData.inclinacao}° ${formData.orientacao}`}/>
      </div>

      {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

      {/* Paramestros do painel:
      {panelParamsData && (
        <ul>
          {Object.entries(panelParamsData).map(([key, value]) => (
            Array.isArray(value) ?
            null : <li key={key}>
              {key}: {String(value)}
            </li>
          ))}
        </ul>
      )} */}

      {/* Parametros para dimensionamento:
      <ul>
        <li>Consumo médio mensal: {formData.consumo}</li>
        <li>Hora Sol: {horaSol}</li>
        <li>Potencia do painel: {panelParamsData?.P_mpp}</li>
        <li>Tarifa de consumo: {tarifa_consumo[formData.perfil].tarifa}</li>
      </ul> */}
      
      {panelParamsResult?.Vs &&
      <div className={style.section}>
        <h2 className={style.section_title}>Características do {formData?.modelo}</h2>
        <ShowRechartsPlots result={panelParamsResult} climaticConditionsForm={climaticConditionsForm}/>

        <h3 className={style.subsection_title}>Pontos de máxima potência:</h3>

        <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
          <label className={style.result_label_level1}>V_mpp: {panelParamsResult.V_mpp.toFixed(2)} V</label>
          <label className={style.result_label_level1}>I_mpp: {panelParamsResult.I_mpp.toFixed(2)} A</label>         
          <label className={style.result_label_level1}>Potência do painel: {panelParamsResult.P_mpp.toFixed(2)} W</label>
        </div>      
      </div>}

      {geracaoMensal.length > 0 && (
        <div className={style.section}>
          <h2 className={style.section_title}>Dimensionamento</h2>
          
          <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
            <h3 className={style.subsection_title}>Dados:</h3>
            <label className={style.result_label_level1}>Consumo médio mensal: {formData.consumo} kWh</label>
            <label className={style.result_label_level1}>Consumo mínimo ({`${formData.perfil}`}): {tarifa_consumo[formData.perfil].tarifa} kWh</label>
            <label className={style.result_label_level1}>Potência nominal: {panelParamsResult?.P_mpp.toFixed(2)} W</label>
            <label className={style.result_label_level1}>Hora sol: {horaSol.toFixed(2)} kWh/m2.dia</label>
            <label className={style.result_label_level1}>Perdas: 20%</label>
            <label className={style.result_label_level1}>Fator de correção: 1</label>
          </div>

          <hr className={style.subsection_divider} />

          <h3 className={style.subsection_title}>Quantidade de painéis:</h3>
          <h4 className={style.result_label_level2}>{nPaineis == 0 ? "": nPaineis}</h4>

          <h3 className={style.subsection_title}>Área necessária:</h3>
          <h4 className={style.result_label_level2}>{nPaineis == 0 ? "": (nPaineis * parseFloat(formData?.area)).toFixed(2)} m² </h4>

          <hr className={style.subsection_divider} />

          <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
            <h3 className={style.subsection_title}>Geração de energia mensal:</h3>
            <IrradChart irradiancias={geracaoMensal} yLabel="Energia" yUnit='kWh' labels={["Geração mensal"]} />  

            <h3 className={style.subsection_title}>Energia Anual:</h3>     
            <label className={style.result_label_level1}>Energia acumulada: {energiaAcumulada.toFixed(2)} kWh</label>
            <label className={style.result_label_level1}>Media: {(energiaAcumulada/12).toFixed(2)} kWh/mês</label>
          </div>
        </div>
      )}

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
            onClick={handleSelectDateClick} 
            disabled={dailyLoading}
            className={style.search_button}
          >
            {dailyLoading ? (
              <span className={style.loading_text}>
                <span className={style.loading_dots}>...</span>
              </span>
            ) : 'Buscar dados'}
          </button>
        </div>

        {dailyError && <div className={style.error_message}>Erro: {dailyError}</div>}

        {dailyData && (
          <div style={{display:"flex", flexDirection: "column"}}>          
            <div className={style.plot_container}>
              <div className={style.plot_wrapper}>
                <h3 className={style.plot_title}>Irradiância Solar</h3>
                <PlotData                 
                  data={dailyData.irradiancia} 
                  xLabel='Hora do dia' 
                  yLabel='Irradiância (W/m²)'
                  onPointClick={handlePointClick}
                />
              </div>           
              <div className={style.plot_wrapper}>
                <h3 className={style.plot_title}>Temperatura do Painel</h3>
                <PlotData 
                  data={dailyData.temperatura} 
                  xLabel='Hora do dia' 
                  yLabel='Temperatura (°C)'                
                  color='#82ca9d'               
                />
              </div>
            </div>
            <label className={style.result_label_level1}>G (plano inclinado): {GIncReal.toFixed(2)} W/m2</label>
            <label className={style.result_label_level1}>Ângulo de incidência: {theta.toFixed(2)}° </label>
          </div>
          
        )}

        {dailyData && dailyData.notFound && (
          <div className={style.warning_message}>
            A data requisitada não foi encontrada!
          </div>
        )}

        {!dailyLoading && !dailyData && !dailyError && (
          <div className={style.warning_message}>
            Nenhum dado selecionado!
          </div>
        )}
      </div>

      {panelsParamsResult?.Vs && <div className={style.section}>        
        <h2 className={style.section_title}>Características dos painéis sob as condições de operação</h2>
        <ShowRechartsPlots result={panelsParamsResult} climaticConditionsForm={climaticConditionsForm}/>
        <h3 className={style.subsection_title}>Pontos de máxima potência:</h3>

        <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
          <label className={style.result_label_level1}>V_mpp: {panelsParamsResult?.V_mpp.toFixed(2)} V</label>
          <label className={style.result_label_level1}>I_mpp: {panelsParamsResult?.I_mpp.toFixed(2)} A</label>         
          <label className={style.result_label_level1}>Potência instantânea nominal gerada: {(panelsParamsResult?.P_mpp/1000).toFixed(2)} kW</label>
        </div>    
      </div>}
      
      <div className={style.section}>
        <h2 className={style.section_title}>Solução de Controle</h2>
        <ControlSolution power={ (panelsParamsResult?.P_mpp ?? 0) / tarifa_consumo[formData.perfil].fases }/>
      </div> 

      <div className={style.section}>
        <h2 className={style.section_title}>Análise de Retorno (Payback)</h2>
        <PaybackComponent 
          consumoMensal={parseFloat(formData.consumo)}
          geracaoMensalPorPainel={energiaAcumulada/(12* nPaineis)}
          tarifaBandeira={parseFloat(formData.tarifa_da_bandeira)}
          tarifaEnergia={parseFloat(formData.tarifa_de_energia)}
          nPaineis={nPaineis}
          fase={tarifa_consumo[formData.perfil].fases}
          custoPainel={parseFloat(formData.custo_por_painel)}
          custoInversor={parseFloat(formData.custo_por_inversor)}
          custoMaoDeObra={parseFloat(formData.custo_mao_de_obra)}
          inflacaoEnergia={parseFloat(formData.inflacao_de_energia)/100}
          anosAnalise={parseFloat(formData.anos_de_analise)}
          depreciacaoAnual={parseFloat(formData.depreciacao_anual)/100}
          taxaFioB={parseFloat(formData.taxa_do_fio_b)}
          inflacaoAnual={parseFloat(formData.inflacao_anual)/100}
        />
      </div>      
    </div>
  );}