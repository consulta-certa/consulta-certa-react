import type { tipoPaciente } from "./tipoPaciente";

export type tipoContext = {
    paciente: tipoPaciente | null;
    login: (paciente: tipoPaciente) => void;
    logout: () => void;
}