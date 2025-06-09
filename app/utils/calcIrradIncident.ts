


export default function calcIrradIncidente(
  dataStr: string,             // Ex: '2019-03-21'
  horaStr: string,             // Ex: '18:00:00'
  irradianciaGlobal: number,   // W/m²
  angulo_inclinacao: number,   // Inclinação do painel (graus)
  azimute: number = 0,             // Orientação do painel em relação ao norte (graus)
  latitude: number = -9.501,             // Latitude (graus)
  longitude: number = -35.749,           // Longitude local (graus)
  longMeridiano: number = -45,       // Meridiano do fuso (graus)
  horarioVerao: number = 0, 
  mostrar: boolean   // ajuste de horário de verão (em horas)
): { G_inc_real: number,  theta_i: number} {

  // console.log(`data: ${dataStr}, hora: ${horaStr}, iirad: ${ irradianciaGlobal}, inclinacao: ${angulo_inclinacao}, Orientação: ${azimute}, latitude: ${latitude}, longitude: ${longitude}, meridiano: ${longMeridiano}`)

  angulo_inclinacao *= -1
  // --- Utilitários trigonométricos em graus ---
  const degToRad = (deg: number) => deg * Math.PI / 180;
  const radToDeg = (rad: number) => rad * 180 / Math.PI;
  const sind = (deg: number) => Math.sin(degToRad(deg));
  const cosd = (deg: number) => Math.cos(degToRad(deg));
  const tand = (deg: number) => Math.tan(degToRad(deg));
  const acosd = (val: number) => radToDeg(Math.acos(val));
  const atan2d = (y: number, x: number) => radToDeg(Math.atan2(y, x));

  // --- Parse de data e hora ---
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const [hora, minuto, segundo] = horaStr.split(':').map(Number);
  const data = new Date(ano, mes - 1, dia, hora, minuto, segundo);

  // --- Dia do ano ---
  const primeiroDia = new Date(data.getFullYear(), 0, 1);
  const diaDoAno = Math.floor((data.getTime() - primeiroDia.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // --- Equação do tempo (EoT) em horas ---
  const B = (360 / 365) * (diaDoAno - 81);
  let EoT = 9.87 * sind(2 * B) - 7.53 * cosd(B) - 1.5 * sind(B);
  EoT /= 60; // minutos → horas

  // --- Hora local decimal ---
  const horaLocal = hora + minuto / 60 + segundo / 3600;

  // --- Hora solar ---
  const horaSolar = horaLocal - ((longitude - longMeridiano) / 15) + EoT + horarioVerao;

  // --- Declinação solar (graus) ---
  const declinacaoSolar = 23.45 * sind(360 * (284 + diaDoAno) / 365);

  // --- Ângulo horário (omega) ---
  const omega = 15 * (horaSolar - 12);

  // --- Ângulo zenital ---
  const theta_z = acosd(
    sind(latitude) * sind(declinacaoSolar) + cosd(latitude) * cosd(declinacaoSolar) * cosd(omega)
  );

  // --- Azimute solar ---
  const gamma_solar = atan2d(
    sind(omega),
    cosd(omega) * sind(latitude) - tand(declinacaoSolar) * cosd(latitude)
  );

  // --- Ângulo de incidência ---
  const theta_i = acosd(
    sind(theta_z) * cosd(azimute - gamma_solar) * sind(angulo_inclinacao) + cosd(theta_z) * cosd(angulo_inclinacao)
  );

  if (mostrar) console.log("Angulo de incidência", theta_i);
  

  // --- Irradiância incidente ---
  const G_inc = irradianciaGlobal * cosd(theta_i);
  const G_inc_real = Math.max(0, G_inc)
  return  { G_inc_real, theta_i};
}
