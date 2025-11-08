export type tipoPaciente = {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    emailConfirmado: string;
    senha: string;
    senhaConfirmada: string;
    acompanhantes: string;
}

export type tipoTokenPayload = {
    sub: string;
    nome: string;
    email: string;
    telefone: string;
    acompanhantes: string;
    exp: number;
    dadosSaude: string;
}