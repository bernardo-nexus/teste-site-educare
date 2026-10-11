import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'
import { Footer } from '../components/layout/Footer'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-slate-600">{children}</div>
    </section>
  )
}

const email = import.meta.env.VITE_EMAIL_TERMOS

export function Termos() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-slate-900 px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>
        <img src={logo} alt="Nexus EduCare" className="h-8 w-auto object-contain" />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Termos de Uso</h1>
          <p className="text-sm text-slate-400">Última atualização: 21 de fevereiro de 2026</p>
        </div>

        <Section title="1. Partes e Definições">
          <p>
            Estes Termos de Uso regulam a relação contratual entre a{' '}
            <strong>Nexus Group Tecnologia LTDA</strong> ("Nexus Group", "nós") e a instituição de
            ensino que contrata a plataforma Nexus EduCare ("Escola", "Contratante", "você").
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Plataforma:</strong> conjunto de sistemas, aplicativos e serviços que compõem
              o Nexus EduCare (app móvel, painel web e APIs associadas).
            </li>
            <li>
              <strong>Usuários:</strong> administradores, professores, funcionários, pais e
              responsáveis que acessam a Plataforma mediante autorização da Escola.
            </li>
            <li>
              <strong>Conteúdo:</strong> dados, informações e arquivos inseridos ou gerados pelos
              Usuários na Plataforma.
            </li>
          </ul>
        </Section>

        <Section title="2. Aceitação dos Termos">
          <p>
            Ao cadastrar a escola na Plataforma ou utilizar qualquer funcionalidade do Nexus EduCare,
            a Escola declara ter lido, compreendido e aceitado integralmente estes Termos de Uso e
            a{' '}
            <Link to="/privacy-policy" className="text-primary-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
          <p>
            Se a Escola não concordar com qualquer disposição destes Termos, deverá se abster de
            utilizar a Plataforma.
          </p>
        </Section>

        <Section title="3. Cadastro e Conta">
          <p>
            O cadastro é realizado pelo representante legal ou administrador autorizado pela Escola.
            A Escola é responsável por:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Fornecer informações verdadeiras, completas e atualizadas.</li>
            <li>Manter a confidencialidade das credenciais de acesso.</li>
            <li>Notificar imediatamente a Nexus Group sobre qualquer acesso não autorizado.</li>
            <li>
              Garantir que todos os Usuários conheçam e cumpram estes Termos ao utilizar a
              Plataforma.
            </li>
          </ul>
        </Section>

        <Section title="4. Planos e Pagamento">
          <p>
            A Plataforma é disponibilizada mediante pagamento de assinatura mensal ou anual, conforme
            o plano escolhido. Os preços vigentes estão disponíveis na{' '}
            <Link to="/#pricing" className="text-primary-600 hover:underline">
              página de planos
            </Link>
            .
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>O valor é calculado por aluno matriculado ativo na Plataforma.</li>
            <li>
              Os planos anuais oferecem desconto equivalente a 2 meses gratuitos em relação ao
              valor mensal.
            </li>
            <li>
              Em caso de inadimplência superior a 15 dias, a Nexus Group poderá suspender o acesso
              à Plataforma, sem prejuízo da cobrança dos valores devidos.
            </li>
            <li>Os preços podem ser reajustados mediante aviso prévio de 30 dias.</li>
          </ul>
        </Section>

        <Section title="5. Cancelamento e Reembolso">
          <p>
            A Escola pode cancelar a assinatura a qualquer momento, sem multa ou fidelidade. O
            cancelamento deve ser solicitado por e-mail para{' '}
            <a href={`mailto:${email}`} className="text-primary-600 hover:underline">
              {email}
            </a>
            .
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Plano mensal:</strong> o cancelamento encerra a assinatura ao final do período
              vigente. Não há reembolso proporcional.
            </li>
            <li>
              <strong>Plano anual:</strong> reembolso proporcional aos meses restantes, descontado
              o equivalente ao desconto anual usufruído.
            </li>
            <li>
              Após o cancelamento, os dados da Escola ficam disponíveis para exportação por 30
              dias. Após esse prazo, são excluídos definitivamente.
            </li>
          </ul>
        </Section>

        <Section title="6. Obrigações da Escola">
          <p>A Escola se compromete a:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Utilizar a Plataforma exclusivamente para fins educacionais e administrativos lícitos.</li>
            <li>
              Não compartilhar credenciais de acesso com pessoas não autorizadas.
            </li>
            <li>
              Obter os consentimentos necessários dos responsáveis legais pelos alunos antes de
              inserir dados pessoais de crianças na Plataforma.
            </li>
            <li>
              Não tentar acessar, modificar ou interferir nos sistemas da Nexus Group ou de outras
              escolas.
            </li>
            <li>
              Manter suas informações cadastrais atualizadas, especialmente o número de alunos
              ativos.
            </li>
          </ul>
        </Section>

        <Section title="7. Obrigações da Nexus Group">
          <p>A Nexus Group se compromete a:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Disponibilizar a Plataforma com uptime de 99,9% ao mês (exceto manutenções programadas).</li>
            <li>Notificar a Escola com antecedência mínima de 48 horas sobre manutenções planejadas.</li>
            <li>Tratar os dados da Escola e de seus Usuários em conformidade com a LGPD.</li>
            <li>Fornecer suporte técnico conforme o nível do plano contratado.</li>
            <li>Garantir a segurança dos dados com isolamento por escola (banco de dados dedicado).</li>
          </ul>
        </Section>

        <Section title="8. Propriedade Intelectual">
          <p>
            Todos os direitos de propriedade intelectual sobre a Plataforma (código, design, marca,
            funcionalidades) pertencem exclusivamente à Nexus Group.
          </p>
          <p>
            A Escola retém a propriedade sobre o Conteúdo que inserir na Plataforma. Ao inserir
            Conteúdo, a Escola concede à Nexus Group uma licença não exclusiva, limitada ao
            necessário para a prestação dos serviços.
          </p>
        </Section>

        <Section title="9. Limitação de Responsabilidade">
          <p>
            A Nexus Group não se responsabiliza por: (i) danos indiretos, lucros cessantes ou
            perda de dados decorrentes de uso inadequado da Plataforma; (ii) falhas de
            conectividade de internet fora do controle da Nexus Group; (iii) atos ou omissões de
            terceiros, incluindo prestadores de infraestrutura.
          </p>
          <p>
            A responsabilidade total da Nexus Group, em qualquer hipótese, fica limitada ao valor
            pago pela Escola nos últimos 3 meses anteriores ao evento danoso.
          </p>
        </Section>

        <Section title="10. Disposições Gerais">
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir
            quaisquer controvérsias, as partes elegem o Foro Central da Comarca de São Paulo/SP,
            com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
          <p>
            A Nexus Group pode alterar estes Termos mediante aviso prévio de 15 dias. O uso
            continuado da Plataforma após a vigência das alterações implica aceitação dos novos
            Termos.
          </p>
          <p>
            Dúvidas:{' '}
            <a href={`mailto:${email}`} className="text-primary-600 hover:underline">
              {email}
            </a>
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
