export interface Testimonial {
  name: string
  role: string
  school: string
  content: string
  avatar: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Maria Clara Oliveira',
    role: 'Diretora',
    school: 'Creche Pequenos Brilhantes',
    content:
      'O Nexus EduCare transformou a gestao da nossa creche. Antes gastava horas com planilhas e bilhetes de papel. Agora tenho um dashboard completo com a frequencia e as metricas de todas as turmas em tempo real. A inadimplencia caiu 40% desde que implementamos o controle financeiro pelo app.',
    avatar: 'MC',
  },
  {
    name: 'Fernanda Santos',
    role: 'Professora',
    school: 'Escola Infantil Arco-Iris',
    content:
      'O registro diario ficou muito mais rapido. Antes eu precisava preencher fichas de papel para cada crianca no final do dia. Agora marco presenca, refeicoes e sono com poucos toques durante a rotina, e os pais ja recebem tudo na hora. O chat direto com os responsaveis tambem facilitou muito a comunicacao.',
    avatar: 'FS',
  },
  {
    name: 'Rafael Mendes',
    role: 'Pai de aluno',
    school: 'Creche Mundo Encantado',
    content:
      'Como pai, a tranquilidade de acompanhar o dia do meu filho em tempo real nao tem preco. Recebo notificacao quando ele chega, vejo as fotos das atividades e sei exatamente o que ele comeu no almoco. O chat com a professora tambem e muito pratico para avisar sobre medicamentos ou faltas.',
    avatar: 'RM',
  },
  {
    name: 'Ana Beatriz Costa',
    role: 'Secretaria',
    school: 'Centro Educacional Sementinha',
    content:
      'A parte administrativa ficou muito mais organizada. Consigo gerenciar matriculas, enviar comunicados com confirmacao de leitura e gerar relatorios de frequencia em poucos cliques. Os pais tambem pararam de ligar toda hora pedindo boleto porque agora esta tudo no app.',
    avatar: 'AB',
  },
]
