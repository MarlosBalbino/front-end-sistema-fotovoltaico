// Modelo de Perez em TypeScript com entrada simplificada
// Entradas: Irradiância global horizontal, localização, data/hora, orientação e inclinação do painel

// Constantes
const SOLAR_CONSTANT = 1367; // W/m²
const ALBEDO = 0.1;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function extraterrestrialIrradiance(doy: number): number {
  return SOLAR_CONSTANT * (1 + 0.033 * Math.cos((2 * Math.PI * doy) / 365));
}

function solarDeclination(doy: number): number {
  return degToRad(23.45) * Math.sin((2 * Math.PI * (284 + doy)) / 365);
}

function equationOfTime(doy: number): number {
  const B = (2 * Math.PI * (doy - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

function solarTime(
  localTime: Date,
  longitude: number,
  standardMeridian: number,
  eqTime: number
): Date {
  const offset = 4 * (longitude - standardMeridian) + eqTime;
  const solarMinutes = localTime.getMinutes() + offset;
  const solarTime = new Date(localTime);
  solarTime.setMinutes(solarMinutes);
  return solarTime;
}

function hourAngle(solarTime: Date): number {
  return degToRad(15 * (solarTime.getHours() + solarTime.getMinutes() / 60 - 12));
}

function solarZenith(latDeg: number, decl: number, hAngle: number): number {
  const lat = degToRad(latDeg);
  const cosZ =
    Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hAngle);
  return Math.acos(Math.min(Math.max(cosZ, -1), 1));
}

function angleOfIncidence(
  betaDeg: number,
  gammaDeg: number,
  latDeg: number,
  decl: number,
  hAngle: number
): number {
  const beta = degToRad(betaDeg);
  const phi = degToRad(latDeg);
  const gamma = degToRad(gammaDeg);

  const cosTheta =
    Math.sin(decl) * Math.sin(phi) * Math.cos(beta) -
    Math.sin(decl) * Math.cos(phi) * Math.sin(beta) * Math.cos(gamma) +
    Math.cos(decl) * Math.cos(phi) * Math.cos(beta) * Math.cos(hAngle) +
    Math.cos(decl) * Math.sin(phi) * Math.sin(beta) * Math.cos(gamma) +
    Math.cos(decl) * Math.sin(beta) * Math.sin(gamma) * Math.sin(hAngle);

  return Math.acos(Math.min(Math.max(cosTheta, -1), 1));
}

function erbsModel(Gh: number, zenith: number, doy: number): { Dh: number; Bn: number } {
  const G_on = extraterrestrialIrradiance(doy);
  const cosZ = Math.cos(zenith);
  const Kt = Gh / (G_on * cosZ + 1e-6);

  let Kd = 0;
  if (Kt <= 0.22) Kd = 1.0;
  else if (Kt <= 0.80) Kd = 1.0 - 0.09 * Kt;
  else Kd = 0.165;

  const Dh = Kd * Gh;
  const Bh = Gh - Dh;
  const Bn = Bh / (cosZ + 1e-6);

  return { Dh, Bn };
}

function perezModel(
  Dh: number,
  Bn: number,
  theta: number,
  thetaZ: number,
  betaDeg: number
): number {
  const beta = degToRad(betaDeg);
  const cosTheta = Math.cos(theta);
  const cosZ = Math.cos(thetaZ);
  const epsilon = ((Dh + Bn * cosZ) / Dh + 1.041 * Math.pow(thetaZ, 3)) / (1 + 1.041 * Math.pow(thetaZ, 3));

  let F1 = 0, F2 = 0;
  if (epsilon < 1.065) [F1, F2] = [-0.008, 0.588];
  else if (epsilon < 1.23) [F1, F2] = [0.130, 0.683];
  else if (epsilon < 1.5) [F1, F2] = [0.330, 0.487];
  else if (epsilon < 1.95) [F1, F2] = [0.568, 0.187];
  else if (epsilon < 2.8) [F1, F2] = [0.873, 0.073];
  else if (epsilon < 4.5) [F1, F2] = [1.132, -0.057];
  else if (epsilon < 6.2) [F1, F2] = [1.060, -0.129];
  else [F1, F2] = [0.678, -0.327];

  const R = Math.max(cosTheta / (cosZ + 1e-6), 0);
  return Dh * ((1 - F1) * (1 + Math.cos(beta)) / 2 + F1 * R + F2 * Math.sin(beta));
}

export function computeIrradiance(
  dataStr: string,
  horaStr: string,
  irradianciaGlobal: number,
  angulo_inclinacao: number,
  azimute: number = 0,
  latitude: number = -9.501,
  longitude: number = -35.749,
  longMeridiano: number = -45
): number {
  const data = new Date(`${dataStr}T${horaStr}`);
  const doy = dayOfYear(data);
  const decl = solarDeclination(doy);
  const eqTime = equationOfTime(doy);
  const solTime = solarTime(data, longitude, longMeridiano, eqTime);
  const hAngle = hourAngle(solTime);
  const thetaZ = solarZenith(latitude, decl, hAngle);
  const theta = angleOfIncidence(angulo_inclinacao, azimute, latitude, decl, hAngle);
  const { Dh, Bn } = erbsModel(irradianciaGlobal, thetaZ, doy);
  const D_tilt = perezModel(Dh, Bn, theta, thetaZ, angulo_inclinacao);
  const B_tilt = Bn * Math.cos(theta);
  const R_tilt = irradianciaGlobal * ALBEDO * (1 - Math.cos(degToRad(angulo_inclinacao))) / 2;
  const G_tilt = D_tilt + B_tilt + R_tilt;
  return G_tilt;
}