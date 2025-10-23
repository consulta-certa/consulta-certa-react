import React, { useEffect, useRef, useState } from 'react';

// Tipo para o estado de status (para o indicador futuro)
type StatusEquipamento = 'carregando' | 'sucesso' | 'erro';

const VerificadorDeEquipamento: React.FC = () => {
  // Estado para armazenar mensagens de erro ou sucesso
  const [erro, setErro] = useState<string | null>(null);
  // Estado para o status geral (para o indicador futuro)
  const [status, setStatus] = useState<StatusEquipamento>('carregando');
  // Ref para o elemento <video> (usado para atribuir a stream)
  const videoRef = useRef<HTMLVideoElement>(null);
  // Estado para indicar se o microfone está ativo (feedback simples)
  const [microfoneAtivo, setMicrofoneAtivo] = useState(false);

  useEffect(() => {
    // (1) Pedido de permissão: Tentamos acessar câmera e microfone
    const iniciarVerificacao = async () => {
      try {
        // Pedimos permissão para vídeo e áudio
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // (2) Sucesso: Atribuímos a stream ao <video> e ativamos o feedback
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Conecta a stream ao vídeo
          setStatus('sucesso'); // Indicador de sucesso
          setErro(null); // Limpa erros anteriores
          
          // Feedback de microfone: Simples indicador "ativo" (pode ser expandido depois)
          // Aqui, assumimos que se chegou aqui, o microfone está ok (não captamos volume ainda)
          setMicrofoneAtivo(true);
        }
      } catch (error: any) {
        // (3) Tratamento de erros: Lidamos com tipos específicos de erro
        setStatus('erro');
        if (error.name === 'NotAllowedError') {
          setErro('Não é possível acessar sem a permissão. Permita o acesso à câmera e microfone nas configurações do navegador.');
        } else if (error.name === 'NotFoundError') {
          setErro('Não encontramos uma câmera ou microfone conectados. Verifique se estão ligados.');
        } else {
          setErro('Ocorreu um erro inesperado. Tente recarregar a página.');
        }
        setMicrofoneAtivo(false); // Microfone não ativo em caso de erro
      }
    };

    iniciarVerificacao();

    // (4) Função de limpeza: Quando o componente desmonta, paramos a stream para liberar câmera/microfone
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop()); // Para todos os tracks (vídeo e áudio)
      }
    };
  }, []); // Array vazio: roda só uma vez, ao montar

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Verificação de Equipamento</h2>
      
      {/* Indicador de Status (para o futuro: pode ser ícone ou mais detalhes) */}
      <p className="mb-2">
        Status: {status === 'carregando' ? 'Carregando...' : status === 'sucesso' ? 'Equipamento pronto ✅' : 'Erro ❌'}
      </p>
      
      {/* Exibição do Vídeo */}
      {status === 'sucesso' && (
        <video
          ref={videoRef}
          autoPlay
          muted // Muted para evitar eco (usuário se vê, mas não ouve)
          className="w-full max-w-md border rounded"
        />
      )}
      
      {/* Feedback de Microfone */}
      {status === 'sucesso' && (
        <p className="mt-2">
          Microfone: {microfoneAtivo ? 'Ativo ✅' : 'Inativo ❌'}
        </p>
      )}
      
      {/* Mensagem de Erro */}
      {erro && <p className="text-red-500 mt-2">{erro}</p>}
    </div>
  );
};

export default VerificadorDeEquipamento;