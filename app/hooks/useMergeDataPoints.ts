type DataPoint = { mes: string; [key: string]: number | string };

export function useMergeDataPoints(lista1: DataPoint[], lista2: DataPoint[]): DataPoint[] {
  const mergedMap = new Map<string, DataPoint>();

  const normalizeMes = (mes: string) => mes.trim().toLowerCase();

  // Processa lista1
  for (const item of lista1) {
    const mesKey = normalizeMes(item.mes);
    mergedMap.set(mesKey, { ...item, mes: mesKey });
  }

  // Processa lista2 e mescla
  for (const item of lista2) {
    const mesKey = normalizeMes(item.mes);
    const existing = mergedMap.get(mesKey);
    if (existing) {
      mergedMap.set(mesKey, { ...existing, ...item, mes: mesKey });
    } else {
      mergedMap.set(mesKey, { ...item, mes: mesKey });
    }
  }

  return Array.from(mergedMap.values());
}
