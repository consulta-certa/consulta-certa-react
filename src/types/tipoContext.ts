import type { tipoTokenPayload } from "./tipoPaciente";

export type tipoContext = {
    paciente: tipoTokenPayload | null;
    login: (paciente: string) => void;
    logout: () => void;
}