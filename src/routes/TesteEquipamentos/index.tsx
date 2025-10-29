import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

// Tipos para melhor tipagem e consistência
type StatusEquipamento = 'carregando' | 'sucesso' | 'erro';
type StatusPosicionamento = 'bom' | 'medio ' | 'ruim' | 'carregando';  // Corresponde ao metadata.json (com espaço)

const VerificadorDeEquipamento: React.FC = () => {
  // Estados principais para controle de status
  const [erro, setErro] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusEquipamento>('carregando');
  const [microfoneAtivo, setMicrofoneAtivo] = useState(false);
  const [internetLatencia, setInternetLatencia] = useState<number | null>(null);
  const [internetStatus, setInternetStatus] = useState<'testando' | 'boa' | 'ruim'>('testando');
  const [statusPosicionamento, setStatusPosicionamento] = useState<StatusPosicionamento>('carregando');
  
  // Estados específicos para Teachable Machine
  const [modelo, setModelo] = useState<tmImage.CustomMobileNet | null>(null);
  const [videoPronto, setVideoPronto] = useState(false);
  const [classificacaoInterval, setClassificacaoInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Refs para elementos DOM
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função para testar latência da internet
  const testarInternet = useCallback(async () => {
    setInternetStatus('testando');
    const start = Date.now();
    try {
      await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      const end = Date.now();
      const latencia = end - start;
      setInternetLatencia(latencia);
      setInternetStatus(latencia < 100 ? 'boa' : 'ruim');
      console.log(`Latência da internet: ${latencia}ms`);
    } catch (error) {
      setInternetStatus('ruim');
      setInternetLatencia(null);
      console.error('Erro ao testar internet:', error);
    }
  }, []);

  // Função para carregar o modelo Teachable Machine
  const carregarModelo = useCallback(async () => {
    try {
      await tf.setBackend('cpu');  // Define backend para CPU para compatibilidade
      console.log('Backend TF.js definido para CPU.');
      
      const URL = '/my_model/';
      const model = await tmImage.load(URL + 'model.json', URL + 'metadata.json');
      setModelo(model);
      console.log('Modelo carregado com sucesso.');
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      setStatusPosicionamento('ruim');  // Fallback para erro
    }
  }, []);

  // Função para iniciar a classificação contínua do vídeo
  const iniciarClassificacao = useCallback(() => {
    if (!modelo || !videoRef.current) return;
    console.log('Iniciando intervalo de classificação.');
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState >= 1) {
        try {
          const prediction = await modelo.predict(videoRef.current);
          const maxPrediction = prediction.reduce((prev, current) => 
            (prev.probability > current.probability) ? prev : current
          );
          console.log(`Classe prevista: ${maxPrediction.className} com ${(maxPrediction.probability * 100).toFixed(0)}%`);
          
          setStatusPosicionamento(maxPrediction.className as StatusPosicionamento);
        } catch (error) {
          console.error('Erro na classificação:', error);
          setStatusPosicionamento('ruim');
        }
      }
    }, 1500);  // Intervalo de 1.5s para não sobrecarregar
    setClassificacaoInterval(interval);
  }, [modelo]);

  // Função para resetar e tentar novamente
  const tentarNovamente = useCallback(() => {
    setStatus('carregando');
    setErro(null);
    setMicrofoneAtivo(false);
    setInternetStatus('testando');
    setInternetLatencia(null);
    setStatusPosicionamento('carregando');
    setVideoPronto(false);
    setModelo(null);
    if (classificacaoInterval) {
      clearInterval(classificacaoInterval);
      setClassificacaoInterval(null);
    }
    window.location.reload();  // Reload para resetar completamente
  }, [classificacaoInterval]);

  // useEffect para debug (remova em produção)
  useEffect(() => {
    console.log('Debug - Status atual:', { status, statusPosicionamento, internetStatus });
  }, [status, statusPosicionamento, internetStatus]);

  // useEffect principal: Inicia verificação de equipamento
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === 'carregando') {
        setStatus('erro');
        setErro('Verificação demorou demais. Tente novamente ou verifique sua conexão.');
      }
    }, 20000);  // Timeout de 20s

    const iniciarVerificacao = async () => {
      setStatus('carregando');
      console.log('Iniciando verificação de equipamento...');
      try {
        // Verifica permissões de câmera (melhora UX em navegadores restritivos)
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permissionStatus.state === 'denied') {
          throw new Error('Permissões de câmera negadas. Permita no navegador e tente novamente.');
        }

        // Lista dispositivos disponíveis
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Dispositivos de vídeo:', devices.filter(d => d.kind === 'videoinput').map(d => d.label));
        console.log('Dispositivos de áudio:', devices.filter(d => d.kind === 'audioinput').map(d => d.label));
        
        // Constraints flexíveis para maior compatibilidade
        const constraints = { 
          video: { width: { ideal: 640 }, height: { ideal: 480 } },  // 'ideal' evita erros em dispositivos antigos
          audio: true 
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Permissão concedida! Stream obtida.');
        
        // Verifica se tracks existem
        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();
        if (videoTracks.length === 0 || audioTracks.length === 0) {
          throw new Error('Câmera ou microfone não encontrados. Verifique se estão conectados.');
        }
        
        // Aguarda um pouco para estabilizar
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setVideoPronto(true);
          setStatus('sucesso');
          setErro(null);
          setMicrofoneAtivo(true);
          console.log('Equipamento pronto.');
          clearTimeout(timeout);
          
          carregarModelo();  // Carrega modelo após sucesso
        } else {
          throw new Error('Falha ao carregar vídeo. Tente recarregar a página.');
        }
      } catch (error: any) {
        clearTimeout(timeout);
        setStatus('erro');
        // Tratamento específico de erros para melhor UX
        if (error.name === 'NotAllowedError') {
          setErro('Permita o acesso à câmera e microfone clicando em "Permitir" no popup do navegador.');
        } else if (error.name === 'NotFoundError') {
          setErro('Câmera ou microfone não encontrados. Verifique se estão conectados.');
        } else if (error.name === 'NotReadableError' || error.message.includes('Could not start video source')) {
          setErro('Erro ao iniciar câmera/microfone. Feche outros apps que usam a câmera ou rode em HTTPS.');
        } else {
          setErro(`Erro inesperado: ${error.message}. Tente novamente.`);
        }
        setMicrofoneAtivo(false);
      }
    };

    iniciarVerificacao();
    testarInternet();

    // Cleanup: Limpa timers e tracks
    return () => {
      clearTimeout(timeout);
      if (classificacaoInterval) clearInterval(classificacaoInterval);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // useEffect para iniciar classificação após modelo e vídeo prontos
  useEffect(() => {
    if (videoPronto && modelo && !classificacaoInterval) {
      setTimeout(() => {
        console.log('Iniciando classificação após delay.');
        iniciarClassificacao();
      }, 500);  // Pequeno delay para estabilizar
    }
  }, [videoPronto, modelo, classificacaoInterval, iniciarClassificacao]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition-all duration-300">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
            Verificação de Equipamento para Teleconsulta
          </h1>
          <p className="text-center mb-8 text-lg text-gray-600">
            Vamos verificar se sua câmera, microfone e internet estão prontos. Role a página para ver tudo.
          </p>

          {/* Seção Câmera e Posicionamento */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 border-l-4 border-blue-500 transition-shadow hover:shadow-md" role="region" aria-labelledby="camera-section">
            <h2 id="camera-section" className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              📹 Câmera e Posicionamento
              {status === 'carregando' && <span className="ml-2 text-yellow-500 animate-pulse">⏳ Verificando...</span>}
              {status === 'sucesso' && <span className="ml-2 text-green-500">✅ Pronta!</span>}
              {status === 'erro' && <span className="ml-2 text-red-500">❌ Problema</span>}
            </h2>
            <p className="mb-4 text-gray-700">Veja você mesmo na tela. Ajuste para ficar confortável.</p>
            {status === 'carregando' && (
              <div className="w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Carregando vídeo...</span>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full max-w-md border-2 rounded-lg mx-auto transition-all duration-300 ${
                status === 'sucesso' ? 'block border-green-500 shadow-md' : 'hidden'
              }`}
              aria-label="Preview da câmera para ajuste de posicionamento"
            />
            {erro && status === 'erro' && <p className="text-red-600 mt-2 font-medium" role="alert">{erro}</p>}

            {/* Subseção Posicionamento com acessibilidade */}
            <div className="mt-6 p-4 bg-white rounded-lg border transition-all duration-300" role="status" aria-live="polite">
              <h3 className="text-lg font-medium mb-2 flex items-center text-gray-800">
                👀 Como você está aparecendo?
                {statusPosicionamento === 'carregando' && <span className="ml-2 text-yellow-500 animate-pulse">⏳ Analisando...</span>}
                {statusPosicionamento === 'bom' && <span className="ml-2 text-green-500">😊 Perfeito!</span>}
                {statusPosicionamento === 'medio ' && <span className="ml-2 text-yellow-500">⚠️ Quase lá!</span>}
                {statusPosicionamento === 'ruim' && <span className="ml-2 text-red-500">👀 Ops, não vejo você!</span>}
              </h3>
              {statusPosicionamento === 'bom' && <p className="text-green-600 font-medium">Tudo certo! Você está visível e claro.</p>}
              {statusPosicionamento === 'medio ' && (
                <div className="text-yellow-700">
                  <p className="mb-3 font-medium">A imagem parece um pouco fora do ideal. Siga estes passos simples para melhorar:</p>
                  <ul className="space-y-2 text-sm md:text-base">
                    <li className="flex items-center"><span className="mr-2">📏</span> Aproxime-se um pouco mais da câmera (cerca de 50cm).</li>
                    <li className="flex items-center"><span className="mr-2">💡</span> Ligue uma luz extra ou mova-se para um local mais iluminado.</li>
                    <li className="flex items-center"><span className="mr-2">🎯</span> Centralize seu rosto no meio da tela e olhe diretamente para a câmera.</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">Isso vai ajudar a teleconsulta a ser mais clara!</p>
                </div>
              )}
              {statusPosicionamento === 'ruim' && (
                <div className="text-red-700">
                  <p className="mb-2 font-medium">Não conseguimos ver você. Tente:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                    <li>Posicionar-se na frente da câmera.</li>
                    <li>Verificar se a lente não está coberta.</li>
                    <li>Clicar em "Tentar Novamente" se precisar.</li>
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Seção Microfone */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 border-l-4 border-green-500 transition-shadow hover:shadow-md" role="region" aria-labelledby="microfone-section">
            <h2 id="microfone-section" className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              🎤 Microfone
              {status === 'carregando' && <span className="ml-2 text-yellow-500 animate-pulse">⏳ Verificando...</span>}
              {status === 'sucesso' && microfoneAtivo && <span className="ml-2 text-green-500">✅ Funcionando!</span>}
              {status === 'erro' && <span className="ml-2 text-red-500">❌ Problema</span>}
            </h2>
            <p className="mb-4 text-gray-700">Fale algo alto para testar. O microfone deve captar o som.</p>
            {status === 'sucesso' && microfoneAtivo && <p className="text-green-600 font-medium">Microfone está captando som!</p>}
            {erro && status === 'erro' && <p className="text-red-600 mt-2 font-medium" role="alert">{erro}</p>}
          </section>

          {/* Seção Internet */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 border-l-4 border-purple-500 transition-shadow hover:shadow-md" role="region" aria-labelledby="internet-section">
            <h2 id="internet-section" className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              🌐 Internet
              {internetStatus === 'testando' && <span className="ml-2 text-yellow-500 animate-pulse">⏳ Testando...</span>}
              {internetStatus === 'boa' && <span className="ml-2 text-green-500">✅ Boa conexão!</span>}
              {internetStatus === 'ruim' && <span className="ml-2 text-red-500">❌ Conexão lenta</span>}
            </h2>
            <p className="mb-4 text-gray-700">Verificamos a velocidade da sua internet para a teleconsulta.</p>
            {internetLatencia !== null && (
              <p className={`font-medium ${internetStatus === 'boa' ? 'text-green-600' : 'text-red-600'}`}>
                Tempo de resposta: {internetLatencia}ms ({internetStatus === 'boa' ? 'Rápido' : 'Lento – pode causar travamentos'})
              </p>
            )}
            {internetStatus === 'ruim' && <p className="text-red-600 mt-2">Dica: Feche outros apps ou conecte-se a uma rede mais rápida.</p>}
          </section>

          {/* Botão Tentar Novamente */}
          {status === 'erro' && (
            <div className="text-center">
              <button
                onClick={tentarNovamente}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Tentar verificar equipamento novamente"
              >
                🔄 Tentar Novamente
              </button>
            </div>
          )}

          {/* Mensagem Final */}
          {status === 'sucesso' && internetStatus === 'boa' && statusPosicionamento === 'bom' && (
            <div className="text-center bg-green-100 p-6 rounded-lg mt-8 border border-green-200">
              <p className="text-green-800 font-semibold text-xl">🎉 Tudo pronto! Você pode começar a teleconsulta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificadorDeEquipamento;