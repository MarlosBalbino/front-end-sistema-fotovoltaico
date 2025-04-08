export interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  formatted?: string;
}

export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number
): Promise<LocationData | null> {
  const apiKey = "YOUR_OPENCAGE_API_KEY"; // Substitua pela sua chave
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=pt`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar a localização");
    }

    const data = await response.json();
    const result = data.results?.[0];

    if (!result) return null;

    const components = result.components;

    return {
      city: components.city || components.town || components.village,
      state: components.state,
      country: components.country,
      formatted: result.formatted,
    };
  } catch (error) {
    console.error("Erro na API OpenCage:", error);
    return null;
  }
}