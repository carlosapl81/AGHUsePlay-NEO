const INITIAL_VIDEOS = [
  {
    titulo: "REDE REDS",
    modulo: "INTERNACAO",
    arquivo: "redereds.mp4",
    capa: "REDS.png",
    views: 41
  },
  {
    titulo: "REGISTRAR LAUDO AIH",
    modulo: "INTERNACAO",
    arquivo: "registrodeaih.mp4",
    capa: "solicitar_AIH.png",
    views: 41
  },
  {
    titulo: "REGISTRANDO EVOLUÇÃO",
    modulo: "INTERNACAO",
    arquivo: "registrandoevolução.mp4",
    capa: "lista_internados.png",
    views: 18
  },
  {
    titulo: "TROCAR EQUIPES",
    modulo: "INTERNACAO",
    arquivo: "trocarequipes.mp4",
    capa: "lista_internados.png",
    views: 5
  },
  {
    titulo: "SOLICITAR CONSULTORIA / PARECER",
    modulo: "INTERNACAO",
    arquivo: "solicitarconsultoria.mp4",
    capa: "exame_em_lote.png",
    views: 10
  },
  {
    titulo: "IMPRIMIR PULSEIRA (EMERGÊNCIA)",
    modulo: "EMERGENCIA",
    arquivo: "imprimirpulseiradeindetificação.mp4",
    capa: "exame_em_lote.png",
    views: 23
  },
  {
    titulo: "ESTORNAR ALTA EMERGÊNCIA",
    modulo: "EMERGENCIA",
    arquivo: "estornaraltaemergencia.mp4",
    capa: "estornar_alta_so.png",
    views: 7
  },
  {
    titulo: "CADASTRAR PACIENTE",
    modulo: "EMERGENCIA",
    arquivo: "cadastropacientes.mp4",
    capa: "pesquisar_pacientes.png",
    views: 6
  },
  {
    titulo: "ALTA PROGRAMADA",
    modulo: "EMERGENCIA",
    arquivo: "altaprogramada.mp4",
    capa: "lista_internados.png",
    views: 2
  },
  {
    titulo: "SOLICITAR EXAMES",
    modulo: "EXAMES",
    arquivo: "solicitarexames.mp4",
    capa: "exame_em_lote.png",
    views: 37
  },
  {
    titulo: "CANCELAR EXAMES",
    modulo: "EXAMES",
    arquivo: "cancelamentodeexames.mp4",
    capa: "cancelar_exames.png",
    views: 18
  },
  {
    titulo: "IMPRESSÃO SOLICITAÇÃO DE EXAME",
    modulo: "EXAMES",
    arquivo: "Impressaosolicitacaoexame.mp4",
    capa: "lista_agenda_de_exames.png",
    views: 9
  },
  {
    titulo: "EXAMES EM LOTE",
    modulo: "EXAMES",
    arquivo: "examesemlote.mp4",
    capa: "exame_em_lote.png",
    views: 11
  },
  {
    titulo: "DIGITAR LAUDOS",
    modulo: "EXAMES",
    arquivo: "digitarlaudos.mp4",
    capa: "digitar_laudos.png",
    views: 9
  },
  {
    titulo: "MARCAR AMBULATÓRIO",
    modulo: "AMBULATORIO",
    arquivo: "marcarambulatorio.mp4",
    capa: "marcar_ambulatorio.png",
    views: 13
  },
  {
    titulo: "RESPONDER CONSULTORIA / PARECER",
    modulo: "AMBULATORIO",
    arquivo: "responderconsultoria.mp4",
    capa: "lista_ambulatorio.png",
    views: 8
  }
];

const INITIAL_MANUAIS = [
  {
    titulo: "GRADE DE AGENDAMENTO AMBULATÓRIO",
    modulo: "AMBULATORIO",
    arquivo: "AMBULATORIO-GRADE-DE-AGENDAMENTO.pdf",
    capa: "grades_de_agendamento.png"
  },
  {
    titulo: "RELATÓRIO CONSULTA DO AMBULATÓRIO",
    modulo: "AMBULATORIO",
    arquivo: "AMBULATORIO-RELATORIO-CONSULTA-DO-AMBULATORIO.pdf",
    capa: "lista_ambulatorio.png"
  },
  {
    titulo: "MARCAR AMBULATÓRIO",
    modulo: "AMBULATORIO",
    arquivo: "AMBULATORIO-MARCAR-AMBULATORIO.docx.pdf",
    capa: "marcar_ambulatorio.png"
  },
  {
    titulo: "SOLICITAR EXAMES - LISTA AMBULATÓRIO",
    modulo: "AMBULATORIO",
    arquivo: "SOLICITAR-EXAMES-PELO-LISTA-AMBULATORIO.pdf",
    capa: "lista_ambulatorio.png"
  },
  {
    titulo: "PREENCHER LAUDO AIH",
    modulo: "INTERNACAO",
    arquivo: "INTERNAÇÃO-PREENCHER-LAUDO-AIH.pdf",
    capa: "solicitar_AIH.png"
  },
  {
    titulo: "SOLICITAR EXAMES - LISTA DE INTERNADOS",
    modulo: "INTERNACAO",
    arquivo: "SOLICITAR-EXAMES-PELO-LISTA-DE-INTERNADOS.pdf",
    capa: "lista_internados.png"
  },
  {
    titulo: "RECEPCIONAR PACIENTE",
    modulo: "EMERGENCIA",
    arquivo: "EMERGENCIA-RECEPCIONAR-PACIENTE.pdf",
    capa: "lista_paciente_emerg.png"
  },
  {
    titulo: "SOLICITAR EXAMES - EMERGÊNCIA",
    modulo: "EMERGENCIA",
    arquivo: "SOLICITAR-EXAMES-PELO-LISTA-PACIENTES-EMERGENCIA.pdf",
    capa: "lista_paciente_emerg.png"
  },
  {
    titulo: "SOLICITAÇÃO EXAMES EXTERNO",
    modulo: "EXAMES",
    arquivo: "EXAME-SOLICITAÇÃO-EXAMES-EXTERNO.pdf",
    capa: "aviso_de_solicitacao.png"
  },
  {
    titulo: "AGENDAR EXAMES",
    modulo: "EXAMES",
    arquivo: "EXAMES-AGENDAR-EXAMES.pdf",
    capa: "grades_de_agendamento_de_exames.png"
  },
  {
    titulo: "LISTA AGENDA DE EXAMES - RECEPCIONAR",
    modulo: "EXAMES",
    arquivo: "LISTA-AGENDA-DE-EXAMES-RECEPCIONARPACIENTES.pdf",
    capa: "lista_agenda_de_exames.png"
  },
  {
    titulo: "REGISTRANDO LAUDOS",
    modulo: "EXAMES",
    arquivo: "EXAMES-REGISTRANDO-LAUDOS.pdf",
    capa: "digitar_laudos.png"
  },
  {
    titulo: "CANCELAR MARCAÇÃO DE EXAMES",
    modulo: "EXAMES",
    arquivo: "CANCELAR-MARCAÇÃO-DE-EXAMES.pdf",
    capa: "cancelar_exames.png"
  },
  {
    titulo: "GRADE DE AGENDAMENTO DE EXAMES",
    modulo: "EXAMES",
    arquivo: "Grades-de-AGENDAMENTO-DE-EXAMES.pdf",
    capa: "grades_de_agendamento_de_exames.png"
  }
];

const INITIAL_NOTICIAS = [
  { texto: "Bem-vindo ao AGHUse PLAY, plataforma premium de vídeos e manuais de instrução!" },
  { texto: "Caso sinta falta de algum vídeo ou manual, envie uma sugestão no Painel de Sugestões!" },
  { texto: "⚠️ AVISO: O cadastro de usuários só será validado mediante termo assinado do responsável." }
];

const INITIAL_FEEDBACKS = [
  {
    id: "f1",
    nome: "Paulo Santos Jr",
    setor: "Sistemas em Saúde",
    texto: "Excelente iniciativa! A plataforma unificada vai auxiliar imensamente os novos colaboradores e agilizar o suporte no dia a dia.",
    data: "21/05/2026"
  },
  {
    id: "f2",
    nome: "Enfermeira Mariana",
    setor: "Urgência e Emergência",
    texto: "Os vídeos explicativos sobre como registrar os laudos de AIH e pulseiras facilitaram muito nossa rotina de plantão.",
    data: "21/05/2026"
  }
];
