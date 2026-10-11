export interface PricingPlan {
  name: string
  price: string
  priceDetail: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Essencial',
    price: 'R$ 5',
    priceDetail: 'aluno/mes',
    description: 'Ideal para comecar',
    features: [
      'Agenda diaria basica',
      'Notificacoes push',
      'Calendario escolar',
      'Suporte por email',
      'App para pais e professores',
    ],
    highlighted: false,
    cta: 'Comecar Agora',
  },
  {
    name: 'Profissional',
    price: 'R$ 9',
    priceDetail: 'aluno/mes',
    description: 'Mais popular',
    features: [
      'Tudo do Essencial +',
      'Chat com texto',
      'Galeria de fotos (500MB)',
      'Cardapio semanal',
      'Lista de materiais',
      'Relatorios intermediarios',
      'Suporte por email e chat',
    ],
    highlighted: true,
    cta: 'Teste Gratis por 7 Dias',
  },
  {
    name: 'Completo',
    price: 'R$ 15',
    priceDetail: 'aluno/mes',
    description: 'Experiencia completa',
    features: [
      'Tudo do Profissional +',
      'Chat com midia (fotos/audio/video)',
      'Galeria expandida (5GB)',
      'Controle financeiro completo',
      'Gestao de medicamentos',
      'Documentos e declaracoes',
      'Enquetes e autorizacoes',
      'Relatorios avancados',
      'Suporte prioritario',
      'Onboarding dedicado',
    ],
    highlighted: false,
    cta: 'Teste Gratis por 7 Dias',
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    priceDetail: 'para grandes redes',
    description: 'Solucao personalizada',
    features: [
      'Tudo do Completo +',
      'Galeria ilimitada',
      'Multi-unidade centralizada',
      'API e integracoes',
      'Relatorios personalizados',
      'Suporte dedicado 24/7',
      'Onboarding white-glove',
      'SLA garantido',
    ],
    highlighted: false,
    cta: 'Falar com Vendas',
  },
]
