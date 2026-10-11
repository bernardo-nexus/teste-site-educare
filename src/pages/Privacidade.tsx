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

const email = import.meta.env.VITE_EMAIL_PRIVACIDADE

export function Privacidade() {
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
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Política de Privacidade</h1>
          <p className="text-sm text-slate-400">Última atualização: 21 de fevereiro de 2026</p>
        </div>

        <Section title="1. Identificação do Controlador">
          <p>
            <strong>Nexus Group Tecnologia LTDA</strong>, pessoa jurídica de direito privado,
            inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede em São Paulo/SP, é a controladora
            dos dados pessoais tratados por meio da plataforma Nexus EduCare.
          </p>
          <p>
            Para questões relacionadas à privacidade, entre em contato com nosso Encarregado de
            Dados (DPO) pelo e-mail:{' '}
            <a href={`mailto:${email}`} className="text-primary-600 hover:underline">
              {email}
            </a>
          </p>
        </Section>

        <Section title="2. Dados Pessoais Tratados">
          <p>Tratamos as seguintes categorias de dados pessoais:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Dados de cadastro da escola:</strong> razão social, CNPJ, endereço, e-mail
              institucional e telefone.
            </li>
            <li>
              <strong>Dados do administrador:</strong> nome completo, e-mail, telefone e cargo.
            </li>
            <li>
              <strong>Dados de professores e funcionários:</strong> nome completo, e-mail e cargo,
              fornecidos pela própria escola.
            </li>
            <li>
              <strong>Dados de alunos e responsáveis:</strong> nome, data de nascimento, informações
              médicas relevantes (alergias, medicamentos), nome e contato dos responsáveis. Esses
              dados são inseridos pela escola, que atua como controladora perante os titulares; a
              Nexus Group atua como operadora.
            </li>
            <li>
              <strong>Dados de uso da plataforma:</strong> logs de acesso, endereço IP, tipo de
              dispositivo e dados de navegação para fins de segurança e melhoria do serviço.
            </li>
          </ul>
        </Section>

        <Section title="3. Finalidades do Tratamento">
          <p>Os dados pessoais são tratados para as seguintes finalidades:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Prestação dos serviços contratados (gestão escolar, comunicação, financeiro).</li>
            <li>Autenticação e controle de acesso à plataforma.</li>
            <li>Suporte técnico e atendimento ao cliente.</li>
            <li>Faturamento e cobrança dos planos contratados.</li>
            <li>Melhoria contínua da plataforma e segurança da informação.</li>
            <li>Cumprimento de obrigações legais e regulatórias.</li>
          </ul>
        </Section>

        <Section title="4. Base Legal (LGPD)">
          <p>O tratamento de dados pessoais é fundamentado nas seguintes bases legais da Lei nº 13.709/2018 (LGPD):</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Execução de contrato</strong> (art. 7º, V): dados necessários para a
              prestação dos serviços contratados.
            </li>
            <li>
              <strong>Legítimo interesse</strong> (art. 7º, IX): dados de uso para segurança e
              melhoria da plataforma.
            </li>
            <li>
              <strong>Cumprimento de obrigação legal</strong> (art. 7º, II): quando exigido por lei
              ou autoridade competente.
            </li>
            <li>
              <strong>Consentimento</strong> (art. 7º, I): para comunicações de marketing, quando
              aplicável.
            </li>
          </ul>
          <p>
            Para dados sensíveis de crianças (art. 11 e art. 14 da LGPD), o tratamento ocorre
            exclusivamente sob instruções da escola, que obtém o consentimento dos responsáveis.
          </p>
        </Section>

        <Section title="5. Compartilhamento de Dados">
          <p>Não vendemos dados pessoais. Podemos compartilhar dados com:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Prestadores de serviços:</strong> infraestrutura de nuvem (Amazon Web Services,
              Google Cloud) e serviços de pagamento, todos vinculados por contratos de
              confidencialidade e conformidade com a LGPD.
            </li>
            <li>
              <strong>Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou
              autoridade reguladora.
            </li>
          </ul>
        </Section>

        <Section title="6. Segurança dos Dados">
          <p>Adotamos medidas técnicas e organizacionais para proteger os dados pessoais:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Criptografia em trânsito (TLS) e em repouso (AES-256).</li>
            <li>Banco de dados isolado por escola (tenant isolation) — seus dados nunca se misturam com os de outras instituições.</li>
            <li>Autenticação multifator disponível para administradores.</li>
            <li>Controles de acesso baseados em papéis (RBAC).</li>
            <li>Monitoramento contínuo e logs de auditoria.</li>
          </ul>
        </Section>

        <Section title="7. Retenção de Dados">
          <p>
            Os dados são mantidos durante a vigência do contrato e pelo prazo necessário para
            cumprimento de obrigações legais (mínimo de 5 anos após o encerramento, nos termos do
            Código Civil e legislação tributária). Após esse período, os dados são anonimizados ou
            excluídos de forma segura.
          </p>
        </Section>

        <Section title="8. Direitos dos Titulares">
          <p>Nos termos da LGPD, você tem direito a:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Confirmação da existência de tratamento e acesso aos dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li>Portabilidade dos dados a outro fornecedor de serviço.</li>
            <li>Eliminação dos dados tratados com base no consentimento.</li>
            <li>Informação sobre compartilhamento com terceiros.</li>
            <li>Revogação do consentimento, a qualquer momento.</li>
          </ul>
          <p>
            Para exercer seus direitos, envie solicitação para{' '}
            <a href={`mailto:${email}`} className="text-primary-600 hover:underline">
              {email}
            </a>
            . Responderemos em até 15 dias úteis.
          </p>
        </Section>

        <Section title="9. Contato">
          <p>
            Dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais?
            Entre em contato com nosso DPO:
          </p>
          <p>
            <strong>E-mail:</strong>{' '}
            <a href={`mailto:${email}`} className="text-primary-600 hover:underline">
              {email}
            </a>
          </p>
        </Section>

        <div className="mt-12 border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-400">
            Esta Política pode ser atualizada periodicamente. A versão vigente sempre estará
            disponível nesta página com a data da última atualização.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
