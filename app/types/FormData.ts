export type FormData = {

  consumo: string,
  perfil: string,
  inclinacao: string,
  orientacao: string,
  modelo: string,
  isc: string,
  voc: string,
  imp: string,
  vmp: string,
  ns: string,
  ki: string,
  kv: string,
  area: string,
  eficiencia: string,
  fileName: string,
  importFile: boolean,
  useDefaultData: boolean,
  
  // Dados do Payback
  tarifa_de_energia: string,
  tarifa_da_bandeira: string,
  custo_por_painel: string,
  custo_por_inversor: string,
  custo_mao_de_obra: string,
  inflacao_de_energia: string,
  anos_de_analise: string,
  depreciacao_anual: string,
  taxa_do_fio_b: string,
  inflacao_anual: string
}