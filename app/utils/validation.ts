export const isValidNumber = (value: any): boolean =>
  typeof value === 'number' && !isNaN(value) && isFinite(value);

export const isValidDate = (dateStr: string): boolean =>
  typeof dateStr === 'string' && !isNaN(Date.parse(dateStr));

export const isValidTime = (timeStr: string): boolean =>
  typeof timeStr === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(timeStr);

export const validateIrradianceInputs = (
  selectedDate: string,
  xValue: string, // hora
  yValue: number,
  inclinacao: number,
  azimute: number,
  latitude: number,
  longitude: number,
  longMeridiano: number
): boolean => {
  return (
    isValidDate(selectedDate) &&
    isValidTime(xValue) &&
    isValidNumber(yValue) &&
    isValidNumber(inclinacao) &&
    isValidNumber(azimute) &&
    isValidNumber(latitude) &&
    isValidNumber(longitude) &&
    isValidNumber(longMeridiano)
  );
};