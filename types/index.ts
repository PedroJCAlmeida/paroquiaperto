export interface Distrito {
  id: number;
  nome: string;
}

export interface Conselho {
  id: number;
  nome: string;
  distritoId: number;
}

export interface Horario {
  id: number;
  diaSemana: string;
  hora: string;
  tipo: string;
  paroquiaId: number;
  paroquia?: { id: number; nome: string };
}

export interface Evento {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  descricao?: string | null;
  imagem?: string | null;
  paroquiaId: number;
  paroquia?: { id: number; nome: string };
}

export interface Paroquia {
  id: number;
  nome: string;
  rua: string;           // Adicionado
  numeroPorta?: string | null; // Adicionado
  codigoPostal: string;  // Adicionado
  localidade: string;    // Adicionado
  lat: string;
  lng: string;
  telefone?: string | null;
  email?: string | null;
  site?: string | null;
  imagem?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  descricao?: string | null;
  horarios?: Horario[];
  eventos?: Evento[];
  distrito?: Distrito | null;
  conselho?: Conselho | null;
  distritoId?: number | null;
  conselhoId?: number | null;
  distancia?: number;
}
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  authProvider?: string;
  role?: string;
  image?: string | null;
}
export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  authProvider?: string;
  role?: string;
  image?: string | null;
}
