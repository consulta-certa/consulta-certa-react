
export interface UBSProxima {
  nome: string;
  endereco: string;
  latitude: number; 
  longitude: number; 
  distancia_km?: number | null; // Opcional, pois pode ser null se não obteve a lat/lon do usuário
}

export interface ResultadoBuscaUBS {
  cep: string;
  cidade: string;
  uf: string;
  ubs_proximas: UBSProxima[];
}