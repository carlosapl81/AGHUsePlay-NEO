export interface Video {
  titulo: string;
  modulo: string;
  arquivo: string;
  capa: string;
  views: number;
}

export interface Manual {
  titulo: string;
  modulo: string;
  arquivo: string;
  capa: string;
  views?: number;
}

export interface ViewLogEntry {
  id: string;
  type: 'video' | 'pdf';
  title: string;
  module: string;
  date: string;
}

export interface Noticia {
  texto: string;
}

export interface Feedback {
  id: string;
  nome: string;
  setor: string;
  texto: string;
  data: string;
}

export interface Estatisticas {
  acessos: number;
  views: number;
  online: number;
}

export type ThemeType = 'dark-slate' | 'dark-aurora' | 'light-slate';

export type MenuType = 'inicio' | 'videos' | 'manuais';
