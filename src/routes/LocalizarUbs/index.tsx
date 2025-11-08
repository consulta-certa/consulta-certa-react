
import { useState } from 'react';
import type { FormEvent } from 'react';
import Titulo from '../../components/Titulo/Titulo';
import { BsFillPinMapFill } from 'react-icons/bs';
import type { ResultadoBuscaUBS } from '../../types/tipoUbs'; 

// URL API no RENDER!
const API_BASE_URL = 'https:///buscar-ubs-perto-api.onrender.com';

function LocalizarUBS() {
  const [cep, setCep] = useState('');
  const [resultado, setResultado] = useState<ResultadoBuscaUBS | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErro(null);
    setResultado(null);

    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErro('Por favor, digite um CEP válido com 8 dígitos.');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/ubs/perto?cep=${cepLimpo}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('🔗 Buscando:', url);

      if (response.ok) {
      setResultado(data as ResultadoBuscaUBS);
      } else {
      setErro(data.erro || 'Ocorreu um erro ao buscar as UBS.');
      }
    } catch (e) {
        console.error("Erro na requisição:", e);
        setErro('❌ Não foi possível conectar ao serviço de busca de UBS. Verifique se a API está no ar.');
    } finally {
      setLoading(false);
    }
  };	

  return (
    <main className="container mx-auto p-4">
      <Titulo titulo="Localizar UBS Mais Próxima" />

      <section className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="titulo-2 flex items-center mb-4">
          <BsFillPinMapFill className="mr-2 text-cc-azul" />
          Encontre a UBS
        </h2>

        {/* Formulário de Busca */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <label htmlFor="cep" className="text-lg font-medium">
            Digite seu CEP:
          </label>
          <input
            id="cep"
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="Ex: 01001-000"
            maxLength={9}
            className="p-3 border border-gray-300 rounded-md"
            disabled={loading}
          />
          <button
            type="submit"
            className={`p-3 text-white font-bold rounded-md transition duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-cc-azul hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar UBS'}
          </button>
        </form>

        {/* Exibição de Erro */}
        {erro && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {erro}
          </div>
        )}

        {/* Exibição de Resultados (Lista) */}
        {resultado && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
              Encontradas em {resultado.cidade} - {resultado.uf}:
            </h3>
            {resultado.ubs_proximas.length > 0 ? (
              <ul className="space-y-4">
                {resultado.ubs_proximas.map((ubs, index) => (
                  <li
                    key={index}
                    className="p-4 border border-gray-200 rounded-md shadow-sm"
                  >
                    <p className="font-bold text-lg text-cc-verde">{ubs.nome}</p>
                    <p className="text-gray-600">{ubs.endereco}</p>
                    {ubs.distancia_km && (
                      <p className="text-sm text-gray-500 mt-1">
                        **Distância: {Number(ubs.distancia_km).toFixed(2)} km**
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                Nenhuma UBS encontrada na cidade.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default LocalizarUBS;