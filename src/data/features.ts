export interface Feature {
  icon: string
  title: string
  description: string
}

export const parentFeatures: Feature[] = [
  {
    icon: 'CalendarDays',
    title: 'Agenda Diaria',
    description:
      'Acompanhe presenca, refeicoes, sono e atividades do seu filho em tempo real',
  },
  {
    icon: 'MessageCircle',
    title: 'Chat com Professores',
    description:
      'Converse diretamente com professores via texto, fotos, audio e video',
  },
  {
    icon: 'CreditCard',
    title: 'Controle Financeiro',
    description:
      'Visualize mensalidades, boletos e pagamentos com status em tempo real',
  },
  {
    icon: 'Camera',
    title: 'Galeria de Fotos',
    description:
      'Acesse fotos e videos das atividades escolares do seu filho',
  },
  {
    icon: 'UtensilsCrossed',
    title: 'Cardapio Semanal',
    description:
      'Veja o cardapio da semana com alertas de alergia personalizados',
  },
  {
    icon: 'Pill',
    title: 'Medicamentos',
    description:
      'Acompanhe medicamentos, dosagens e historico de administracao',
  },
  {
    icon: 'FileText',
    title: 'Documentos',
    description: 'Acesse declaracoes, avaliacoes e documentos da escola',
  },
  {
    icon: 'Calendar',
    title: 'Calendario Escolar',
    description: 'Fique por dentro de eventos, feriados e reunioes',
  },
  {
    icon: 'Vote',
    title: 'Enquetes',
    description: 'Responda pesquisas e autorizacoes da escola',
  },
  {
    icon: 'ClipboardList',
    title: 'Lista de Materiais',
    description: 'Acompanhe a lista de materiais com status de compra',
  },
]

export const teacherFeatures: Feature[] = [
  {
    icon: 'ClipboardCheck',
    title: 'Registro Diario',
    description:
      'Registre presenca, refeicoes, sono e atividades de toda a turma',
  },
  {
    icon: 'Users',
    title: 'Gestao de Turma',
    description:
      'Visualize todos os alunos, informacoes medicas e contatos dos responsaveis',
  },
  {
    icon: 'MessageSquare',
    title: 'Chat com Pais',
    description:
      'Comunique-se diretamente com os responsaveis de cada aluno',
  },
  {
    icon: 'TrendingUp',
    title: 'Acompanhamento',
    description: 'Estatisticas de frequencia e padroes da turma',
  },
  {
    icon: 'UserCheck',
    title: 'Perfil do Aluno',
    description:
      'Acesse dados completos incluindo alergias e medicamentos',
  },
  {
    icon: 'Zap',
    title: 'Relatorio Rapido',
    description: 'Salve o relatorio de toda a turma com poucos toques',
  },
]

export const managementFeatures: Feature[] = [
  {
    icon: 'LayoutDashboard',
    title: 'Dashboard Executivo',
    description:
      'Visao 360 com metricas de alunos, turmas e frequencia',
  },
  {
    icon: 'Settings',
    title: 'Gestao Completa',
    description:
      'Gerencie alunos, turmas, funcionarios e matriculas',
  },
  {
    icon: 'Megaphone',
    title: 'Comunicados',
    description:
      'Envie circulares e alertas com confirmacao de leitura',
  },
  {
    icon: 'BarChart3',
    title: 'Relatorios',
    description: 'Analytics de frequencia, engajamento e refeicoes',
  },
  {
    icon: 'DollarSign',
    title: 'Financeiro',
    description: 'Controle de mensalidades e inadimplencia',
  },
  {
    icon: 'CalendarRange',
    title: 'Calendario',
    description: 'Gerencie eventos, feriados e reunioes da escola',
  },
]
