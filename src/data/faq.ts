export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: 'Quanto tempo leva para implementar o Nexus EduCare na minha escola?',
    answer:
      'A implementacao completa leva de 3 a 7 dias uteis, dependendo do plano escolhido. Nos planos Completo e Enterprise, oferecemos onboarding dedicado com treinamento para toda a equipe. Nos planos Essencial e Profissional, disponibilizamos tutoriais em video e suporte para configuracao inicial.',
  },
  {
    question: 'E possivel migrar dados de outro sistema?',
    answer:
      'Sim! Nossa equipe auxilia na migracao de dados de alunos, responsaveis e turmas a partir de planilhas ou outros sistemas. Nos planos Enterprise, oferecemos integracao direta via API com os principais sistemas do mercado.',
  },
  {
    question: 'O aplicativo funciona sem internet?',
    answer:
      'Sim, o Nexus EduCare foi desenvolvido com tecnologia offline-first. Professores podem registrar a agenda diaria mesmo sem conexao, e os dados sao sincronizados automaticamente quando a internet retornar. Pais tambem podem consultar as informacoes mais recentes armazenadas em cache no dispositivo.',
  },
  {
    question: 'Como funciona a seguranca dos dados e a conformidade com a LGPD?',
    answer:
      'Levamos a seguranca muito a serio. Todos os dados sao criptografados em transito e em repouso. Cada escola possui seu proprio banco de dados isolado, garantindo total separacao de informacoes. Estamos em total conformidade com a LGPD (Lei Geral de Protecao de Dados), com politicas claras de consentimento e direito ao esquecimento.',
  },
  {
    question: 'Existe fidelidade ou contrato de permanencia?',
    answer:
      'Nao! Todos os planos sao mensais, sem fidelidade ou multa de cancelamento. Voce pode fazer upgrade, downgrade ou cancelar a qualquer momento. Nos planos anuais, oferecemos desconto de 20% sobre o valor mensal.',
  },
  {
    question: 'Como funciona o suporte tecnico?',
    answer:
      'O suporte varia conforme o plano: no Essencial, atendemos por email em ate 48 horas uteis. No Profissional, adicionamos chat com resposta em ate 12 horas. No Completo, o suporte e prioritario com resposta em ate 4 horas. No Enterprise, voce conta com um gerente de sucesso dedicado e suporte 24/7.',
  },
  {
    question: 'Os pais precisam pagar para usar o aplicativo?',
    answer:
      'Nao! O aplicativo e totalmente gratuito para os pais e responsaveis. Eles podem baixar o app na App Store ou Google Play e acessar todas as funcionalidades incluidas no plano contratado pela escola, sem nenhum custo adicional.',
  },
  {
    question: 'Existe limite de usuarios ou funcionarios?',
    answer:
      'Nao ha limite de usuarios. O valor e calculado por aluno matriculado ativo, independente do numero de pais, professores ou funcionarios administrativos que utilizem a plataforma. Todos os responsaveis vinculados a um aluno tem acesso completo ao app.',
  },
  {
    question: 'O Nexus EduCare funciona em celulares antigos?',
    answer:
      'O aplicativo e compativel com iPhones a partir do iOS 14 e smartphones Android a partir da versao 8.0, cobrindo a grande maioria dos dispositivos em uso no Brasil. O app e leve e otimizado para funcionar bem mesmo em aparelhos com recursos limitados.',
  },
  {
    question: 'Posso testar antes de contratar?',
    answer:
      'Sim! Os planos Profissional e Completo oferecem 7 dias de teste gratuito, sem necessidade de cartao de credito. Durante o periodo de teste, voce tem acesso a todas as funcionalidades do plano escolhido. Para o plano Enterprise, oferecemos uma demonstracao personalizada com nossa equipe de vendas.',
  },
]
