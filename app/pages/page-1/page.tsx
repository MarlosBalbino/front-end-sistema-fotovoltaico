'use client';

import { useEffect, useState } from 'react';
import { useDailyData } from '@/app/hooks/useDailyData';
import { DimensionForm, PlotData, CompareGraphs, ShowRechartsPlots, IrradChart, ControlSolution, PaybackComponent, Results } from "@organisms";
import style from './style.module.css';
import calcIrradIncidente from '@/app/utils/calcIrradIncident'

import calcMeanIrrad from '@/app/utils/calcMeanIrrad'
import calcPanelSizing from '@/app/utils/calcPanelSizing';
import { calcEnergiaGerada } from '@/app/utils/calcEnergy';
import { validateIrradianceInputs } from '@/app/utils/validation';
import { DataPoint } from '@/app/hooks/useLoadLocalDatabase';
import { FormData } from '@/app/types/FormData'

import { orientationMap } from "@/app/utils/orientationMap";
import { useAllData } from '@/app/hooks/useAllData';
import { PvResult } from '@/app/types/PvResult';
import { ClimaticInput } from '@/app/types/climaticInput';


import { InfoTooltip } from '@/app/components/molecules';
import { Span } from 'next/dist/trace';
import Link from 'next/link';

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
    perdas: "",
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
  const [inputPanelParamsOk, setInputPanelParamsOk] = useState(false)
  const [validationError, setValidationError] = useState(false)

  const [errorMsg, setErrorMsg] = useState('');
  const [temperatureError, setTemperatureError] = useState(false)

  const [showCompare, setShowCompare] = useState(false)
  const [showPanelCaracteriscts, setShowPanelCaracteristics] = useState(false)
  const [showPanelSizing, setShowPanelSizing] = useState(false)
  const [showIrradTempData, setShowIrradTempData] = useState(false)
  const [showPanelsCaracteriscts, setShowPanelsCaracteristics] = useState(false)
  const [showControlSolution, setShowControlSolution] = useState(false)
  const [showPaybackResults, setShowPaybackResults] = useState(false)

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

  function calcularGeracaoMensal(
    medias: DataPoint[],
    potenciaPaineis: number,
    nPaineis: number,
    perdas: number
  ): { geracaoMensal: DataPoint[]; energiaAcumulada: number } {
    let energiaAcumulada = 0;

    const geracaoMensal = medias.map((item) => {
      const novoItem: DataPoint = { mes: item.mes };

      for (const chave in item) {
        if (chave !== 'mes') {
          const valor = item[chave];
          if (typeof valor === 'number') {
            const energia_mes = calcEnergiaGerada(nPaineis, potenciaPaineis, valor, perdas);
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
    setErrorMsg('');
    setPanelParamsResult(null)

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
        const perdas = parseFloat(formData.perdas)/100
        const nPaineis = calcPanelSizing(
          parseFloat(formData.consumo), 
          tarifa_consumo[formData.perfil].tarifa, 
          data.P_mpp, 
          horaSol,
          perdas
        )

        setNPaneis(nPaineis)     
        const {geracaoMensal, energiaAcumulada } = calcularGeracaoMensal(medias, data.P_mpp, nPaineis, perdas)   
        setGeracaoMensal(geracaoMensal)
        setEnergiaAcumulada(energiaAcumulada)


      } else {
        setErrorMsg('Erro desconhecido.');
      }
    } catch (err) {
      setErrorMsg('Erro ao chamar a API.');
    }
    // setLoading(false);
  };

  // ===================================  SUBMIT =============================================================================

  const handleSubmit = async (formData: any): Promise<string> => {

    setInputPanelParamsOk(false)
    
    setFormData(formData);
    if (!allLoading && !allError && allData) {
      const inclinacao = Number(formData.inclinacao);
      const azimute = orientationMap[formData.orientacao].angle;
      // setAngle(azimute);

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

    setInputPanelParamsOk(true)
    return "ok"
  };

  const extractPanelsParams = async (irrad: number, temp: number) => {
      
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
    };

  // ===================================  HANDLE CLICK =============================================================================
  const [Gglobal, setGglobal] = useState(0) 
  const [GIncReal, setGIncReal] = useState(0)
  const [angIncidencia, setAngIncidencia] = useState(0)
  const [temperatura, setTemperatura] = useState<number | undefined>(0)
  const [hora, setHora] = useState("")
  

  const handlePointClick = ({ xValue, yValue }: { xValue: string; yValue: number }) => {
    setTemperatureError(false)
    setValidationError(false)
    console.log(`${selectedDate} ${xValue},\n Irrad Global: ${yValue}`);

    // Encontrar temperatura no horário correspondente
    const temperaturaItem = dailyData?.temperatura?.find(item => item.x === xValue);
    const temperatura = temperaturaItem?.y;

    const inclinacao = Number(formData.inclinacao);
    const azimute = orientationMap[formData.orientacao]?.angle;

    const isValid = validateIrradianceInputs(
      selectedDate,
      xValue,
      yValue,
      inclinacao,
      azimute,
      latitude,
      longitude,
      longMeridiano
    );

    if (!isValid) {
      setValidationError(true);
    } else {
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

      setTemperatura(temperatura)
      setGglobal(yValue)
      setGIncReal(G_inc_real)
      setAngIncidencia(theta_i)      
      setHora(xValue)

      console.log("Irrad_Inclinada: ", G_inc_real);
      console.log("Paineis:", nPaineis)  
      
      if (temperatura === null || temperatura === undefined || temperatura > 200) {
        console.log(`Temperatura inválida ou não encontrada para o horário ${xValue}`);
        setTemperatureError(true)
        return
      } else {
        console.log(`Temperatura em ${xValue}: ${temperatura}°C`);
      }    

      if (inputPanelParamsOk) {
        extractPanelsParams(G_inc_real, temperatura)
      }    
      setValidationError(false);
    }
  };

  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* =========================================================================================================== */
  /* =========================================================================================================== */

  return (
    <div className={style.main_container}>

      {/* =========================================================================================================== */
      /* =================================== INTRODUÇÃO ======================================================= */}
      <div className={style.intro_container}>        
        <section className={style.intro}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: '1rem'}}>
            <h1 className={style.title}>Simulação do Sistema Fotovoltaico</h1>
            <InfoTooltip iconSize={15} text={"Os dados de irradiância e temperatura utilizados nesta simulação são provenientes de uma base de dados fixa, correspondente à usina solar fotovoltaica localizada no Campus A.C. Simões da UFAL."} />
          </div>
          
          <sub className={style.sub}>Localização fixa:</sub> 

          <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>          
          <label className={style.result_label_level1}>Latitude: {latitude} </label>
          <label className={style.result_label_level1}>Longitude: {longitude} </label>         
          <label className={style.result_label_level1}>Fuso horário: UTC-3</label>
          <label className={style.result_label_level1}>Ano: 2020 </label> 
        </div>      
        </section>
      </div>   

      {/* =========================================================================================================== */
      /* =================================== MANUAL ======================================================= */} 
      <div className={style.section}>
        {/* <h2 className={style.section_title}>Formulário de dimensionamento e Payback</h2> */}
        <p className={style.instructions}>Caso não esteja familiarizado com as funcionalidades desta plataforma acesse as instruções de uso no link abaixo:</p>
        
        <Link className={style.download} target="_blank" rel="noopener noreferrer" href={'https://drive.google.com/file/d/1Vg8ECzCGeAZMMFnbfPnJcBjdsDjLHSRI/view?usp=sharing'}>manual do usuário</Link>
      </div>   

      {/* =========================================================================================================== */
      /* =================================== FORMULÁRIO ======================================================= */}          
      <div className={style.section}>
        <h2 className={style.section_title}>Formulário de dimensionamento e Payback</h2>
        <DimensionForm onSubmit={handleSubmit} />
      </div> 

      {errorMsg && (
        <div className={style.error_message}>
          <strong>Erro:</strong> {errorMsg}
        </div>
      )}    

      {/* ========================================================================================================== */
      /* ================================ COMPARATIVO: DADOS 2020 X CRESESB ======================================== */}
      <div className={style.section}>    
        <h2 className={style.section_title}>
          <input
            className={style.input_box}
            type="checkbox"            
            onChange={() => setShowCompare(!showCompare)}
          />
          Comparativo: Base de dados 2020 x Dados Cresesb
        </h2>        
        
        {showCompare && (
          <CompareGraphs data={medias} data_label={`${formData.inclinacao}° ${formData.orientacao} - Dados 2020`}/>
        )}
      </div>

      {/* =========================================================================================================== */
      /* ============================ CARACTERÍSTICAS DO PAINEL =============================================== */}      
      {panelParamsResult?.Vs &&
      <div className={style.section}>
        <h2 className={style.section_title}>
          <input
            className={style.input_box}
            type="checkbox"            
            onChange={() => setShowPanelCaracteristics(!showPanelCaracteriscts)}
          />
          Características do {formData?.modelo}
        </h2>               
        
        {showPanelCaracteriscts && (
          <div>        
            <ShowRechartsPlots result={panelParamsResult} climaticConditionsForm={climaticConditionsForm}/>

            <h3 className={style.subsection_title}>Pontos de máxima potência:</h3>

            <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
              <label className={style.result_label_level1}>V_mpp: {panelParamsResult.V_mpp.toFixed(2)} V</label>
              <label className={style.result_label_level1}>I_mpp: {panelParamsResult.I_mpp.toFixed(2)} A</label>         
              <label className={style.result_label_level1}>Potência do painel: {panelParamsResult.P_mpp.toFixed(2)} W</label>
            </div> 
          </div>
        )}     
      </div>}

      {/* =========================================================================================================== */
      /* =================================== DIMENSIONAMENTO ======================================================= */}
      {geracaoMensal.length > 0 && (
        <div className={style.section}>          
          <h2 className={style.section_title}>
            <input
              className={style.input_box}
              type="checkbox"            
              onChange={() => setShowPanelSizing(!showPanelSizing)}
            />
            Dimensionamento            
          </h2>         
          
          {showPanelSizing && (
            <div>          
              <div style={{display: "flex", flexDirection: "column"}}>
                <h3 className={style.subsection_title}>Dados:</h3>
                <label className={style.result_label_level1}>Consumo médio mensal: {formData.consumo} kWh</label>
                <label className={style.result_label_level1}>Consumo mínimo ({`${formData.perfil}`}): {tarifa_consumo[formData.perfil].tarifa} kWh</label>
                <label className={style.result_label_level1}>Potência nominal: {panelParamsResult?.P_mpp.toFixed(2)} W</label>
                <label className={style.result_label_level1}>Hora sol: {horaSol.toFixed(2)} kWh/m2.dia</label>
                <label className={style.result_label_level1}>Perdas: {formData.perdas}%</label>
                <label className={style.result_label_level1}>Fator de correção: 1</label>
              </div>

              <hr className={style.subsection_divider} />

              <h3 className={style.subsection_title}>Quantidade de painéis:</h3>
              <h4 className={style.result_label_level2}>{nPaineis == 0 ? "": nPaineis}</h4>

              <h3 className={style.subsection_title}>Área necessária:</h3>
              <h4 className={style.result_label_level2}>{nPaineis == 0 ? "": (nPaineis * parseFloat(formData?.area)).toFixed(2)} m² </h4>

              <hr className={style.subsection_divider} />

              <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
                <h3 className={style.subsection_title}>Geração de energia mensal {<InfoTooltip iconSize={15} text={
                  "Note que o valor gerado mensalmente já desconta a energia cobrada pela concessionária (Ex: 100kWh se for trifásico), pois essa energia já está sendo paga."}/>}:</h3>
                <IrradChart irradiancias={geracaoMensal} yLabel="Energia" yUnit='kWh' labels={["Geração mensal"]} />  

                <h3 className={style.subsection_title}>Energia Anual:</h3>     
                <label className={style.result_label_level1}>Energia acumulada: {energiaAcumulada.toFixed(2)} kWh</label>
                <label className={style.result_label_level1}>Media: {(energiaAcumulada/12).toFixed(2)} kWh/mês</label>
              </div>
            </div>
          )}
        </div>
      )}


      {/* =========================================================================================================== */
      /* =================================== IRRADIÂNCIA E TEMPERATURA ============================================= */}
      <div className={style.section}>        
        <h2 className={style.section_title}>
          <input
            className={style.input_box}
            type="checkbox"            
            onChange={() => setShowIrradTempData(!showIrradTempData)}
          />
          Dados de Irradiância e Temperatura
        </h2>

        {showIrradTempData && (
          <div>        
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
                <label className={style.result_label_level1}>G (global): {Gglobal.toFixed(2)} W/m²</label>
                <label className={style.result_label_level1}>G (plano inclinado): {GIncReal.toFixed(2)} W/m²</label>
                <label className={style.result_label_level1}>Ângulo de incidência: {angIncidencia.toFixed(2)}°</label>

                <label className={style.result_label_level1}>
                  Temperatura: {temperatura != null ? (
                    temperatura > 100 ? 
                      <span className={style.span_label}>{temperatura.toFixed(2)}°C</span> : 
                      <span className={style.result_label_level1}>{temperatura.toFixed(2)}°C</span>
                  ) : (
                    <span className={style.result_label_level1}>--</span>
                  )}
                </label>

                <label className={style.result_label_level1}>Hora: {hora}</label>
              </div>              
            )}

            {dailyData && dailyData.notFound && (
              <div className={style.warning_message}>
                A data requisitada não foi encontrada!
              </div>
            )}

            {dailyData && temperatureError && (
              <div className={style.warning_message}>
                Temperatura inválida ou não encontrada para o horário especificado!
              </div>
            )}

            {dailyData && validationError && (
              <div className={style.warning_message}>
                Erro de validação! Verifique se todos os campos obrigatórios foram preechidos.
              </div>
            )}

            {!dailyLoading && !dailyData && !dailyError && (
              <div className={style.warning_message}>
                Nenhum dado selecionado!
              </div>
            )}
          </div>
        )}
      </div>


      {/* =========================================================================================================== */
      /* ============================= CARACTERÍSTICAS DOS PAINÉIS ================================================== */}
      {panelsParamsResult?.Vs && (
        <div className={style.section}>        
          <h2 className={style.section_title}>
            <input
              className={style.input_box}
              type="checkbox"            
              onChange={() => setShowPanelsCaracteristics(!showPanelsCaracteriscts)}
            />
            Características dos painéis sob as condições de operação
          </h2>
          
          {showPanelsCaracteriscts && (
            <div>          
              <ShowRechartsPlots result={panelsParamsResult} climaticConditionsForm={climaticConditionsForm}/>
              <h3 className={style.subsection_title}>Pontos de máxima potência:</h3>

              <div style={{display: "flex", flexDirection: "column", marginTop: '1rem'}}>
                <label className={style.result_label_level1}>V_mpp: {panelsParamsResult?.V_mpp.toFixed(2)} V</label>
                <label className={style.result_label_level1}>I_mpp: {panelsParamsResult?.I_mpp.toFixed(2)} A</label>         
                <label className={style.result_label_level1}>Potência instantânea nominal gerada: {(panelsParamsResult?.P_mpp/1000).toFixed(2)} kW</label>
              </div>   
            </div> 
          )}
        </div>
      )}

      {/* =========================================================================================================== */
      /* ============================= SOLUÇÃO DE CONTROLE ================================================== */}
      <div className={style.section}>
        <h2 className={style.section_title}>
          <input
            className={style.input_box}
            type="checkbox"            
            onChange={() => setShowControlSolution(!showControlSolution)}
          />
          Solução de Controle
        </h2>

        {showControlSolution && (
          <ControlSolution power={ (panelsParamsResult?.P_mpp ?? 0) / tarifa_consumo[formData.perfil].fases }/>
        )}
      </div>

      {/* =========================================================================================================== */
      /* ==================================== PAYBACK =============================================================== */}
      <div className={style.section}>
        <h2 className={style.section_title}>
          <input
            className={style.input_box}
            type="checkbox"            
            onChange={() => setShowPaybackResults(!showPaybackResults)}
          />
          Análise de Retorno (Payback)
        </h2>

        {showPaybackResults && (
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
        )}
      </div>      
    </div>
  )};
