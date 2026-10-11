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

const email = import.meta.env.VITE_EMAIL_LGPD

export function Lgpd() {
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
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Conformidade com a LGPD
          </h1>
          <p className="text-sm text-slate-400">Última atualização: 21 de fevereiro de 2026</p>
          <p className="mt-4 text-base text-slate-600">
            A Nexus Group adota a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados (LGPD) — como
            diretriz central no tratamento de dados pessoais em toda a plataforma Nexus EduCare.
            Este documento detalha como cumprimos a lei e como você pode exercer seus direitos.
          </p>
        </div>

        <Section title="1. Agentes de Tratamento">
          <p>
            Na plataforma Nexus EduCare, os papéis de tratamento são definidos da seguinte forma:
          </p>
          <ul className="ml-5 list-disc space-y-3">
            <li>
              <strong>Nexus Group — Controladora</strong> dos dados de cadastro das escolas e de
              seus administradores, utilizados para a prestação e operação dos serviços.
            </li>
            <li>
              <strong>Nexus Group — Operadora</strong> dos dados pessoais de alunos, responsáveis,
              professores e funcionários inseridos pelas escolas. Nesse caso, a escola é a
              controladora e a Nexus Group processa os dados apenas sob suas instruções.
            </li>
            <li>
              <strong>Escola — Controladora</strong> dos dados pessoais de seus alunos,
              responsáveis e funcionários. A escola é responsável por obter as bases legais
              adequadas (em especial o consentimento dos responsáveis por menores) antes de
              inserir esses dados na plataforma.
            </li>
          </ul>
        </Section>

        <Section title="2. Dados Tratados e Bases Legais">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Categoria</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Dados</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Base Legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">Escola</td>
                  <td className="px-4 py-3 text-slate-600">CNPJ, razão social, e-mail, telefone</td>
                  <td className="px-4 py-3 text-slate-600">Execução de contrato (art. 7º, V)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">Administrador</td>
                  <td className="px-4 py-3 text-slate-600">Nome, e-mail, telefone, cargo</td>
                  <td className="px-4 py-3 text-slate-600">Execução de contrato (art. 7º, V)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">Alunos</td>
                  <td className="px-4 py-3 text-slate-600">Nome, data nasc., dados médicos</td>
                  <td className="px-4 py-3 text-slate-600">Consentimento responsável (art. 14)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">Responsáveis</td>
                  <td className="px-4 py-3 text-slate-600">Nome, e-mail, telefone</td>
                  <td className="px-4 py-3 text-slate-600">Execução de contrato (art. 7º, V)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">Uso da plataforma</td>
                  <td className="px-4 py-3 text-slate-600">Logs, IP, device, analytics</td>
                  <td className="px-4 py-3 text-slate-600">Legítimo interesse (art. 7º, IX)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Proteção de Dados de Crianças">
          <p>
            O Nexus EduCare trata dados de crianças (menores de 12 anos) e adolescentes. Nos
            termos do art. 14 da LGPD:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              O tratamento dos dados de alunos menores ocorre sob responsabilidade da escola
              (controladora), que deve obter o consentimento específico e destacado dos
              responsáveis legais.
            </li>
            <li>
              A Nexus Group, como operadora, não processa dados de menores para finalidades
              próprias ou terceiros sem instrução expressa da escola.
            </li>
            <li>
              Dados médicos e informações sensíveis (alergias, medicamentos) são armazenados com
              criptografia e acessíveis somente a usuários autorizados pela escola.
            </li>
          </ul>
        </Section>

        <Section title="4. Medidas de Segurança">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Isolamento por escola:</strong> cada instituição possui banco de dados
              dedicado — os dados nunca se misturam entre escolas.
            </li>
            <li>
              <strong>Criptografia:</strong> dados em trânsito protegidos por TLS 1.3; dados em
              repouso por AES-256.
            </li>
            <li>
              <strong>Controle de acesso:</strong> autenticação por papéis (diretor, professor,
              pai) com permissões granulares.
            </li>
            <li>
              <strong>Logs de auditoria:</strong> todas as ações sensíveis são registradas com
              timestamp, usuário e IP.
            </li>
            <li>
              <strong>Backups:</strong> cópias de segurança automáticas com retenção configurável,
              disponíveis para download pelos administradores.
            </li>
          </ul>
        </Section>

        <Section title="5. Direitos dos Titulares de Dados">
          <p>Conforme os arts. 17 a 22 da LGPD, você tem direito a:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Acesso:</strong> confirmar se seus dados são tratados e obter cópia.
            </li>
            <li>
              <strong>Correção:</strong> atualizar dados incompletos, inexatos ou desatualizados.
            </li>
            <li>
              <strong>Eliminação:</strong> solicitar a exclusão de dados desnecessários ou tratados
              em desconformidade com a LGPD.
            </li>
            <li>
              <strong>Portabilidade:</strong> receber seus dados em formato estruturado
              (JSON/CSV).
            </li>
            <li>
              <strong>Oposição:</strong> opor-se ao tratamento realizado com base em legítimo
              interesse.
            </li>
            <li>
              <strong>Revogação do consentimento:</strong> quando o tratamento se basear em
              consentimento.
            </li>
            <li>
              <strong>Informação sobre compartilhamento:</strong> saber com quais terceiros seus
              dados são compartilhados.
            </li>
          </ul>
        </Section>

        <Section title="6. Como Exercer seus Direitos">
          <p>
            Titulares de dados (ou seus responsáveis legais, no caso de menores) podem exercer seus
            direitos diretamente na plataforma ou por e-mail:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>E-mail:</strong>{' '}
              <a
                href={`mailto:${email}`}
                className="text-primary-600 hover:underline"
              >
                {email}
              </a>
            </li>
            <li>Prazo de resposta: até 15 dias úteis.</li>
            <li>
              Pode ser necessário verificar a identidade do solicitante antes de atender a
              requisição.
            </li>
          </ul>
          <p>
            Se a Escola (controladora) receber pedidos de seus Usuários relativos a dados inseridos
            na plataforma, ela é responsável por responder ou encaminhar à Nexus Group quando
            necessário.
          </p>
        </Section>

        <Section title="7. Encarregado de Dados (DPO)">
          <p>
            Nos termos do art. 41 da LGPD, a Nexus Group designou um Encarregado de Proteção de
            Dados:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Contato:</strong>{' '}
              <a
                href={`mailto:${email}`}
                className="text-primary-600 hover:underline"
              >
                {email}
              </a>
            </li>
            <li>
              O DPO atua como canal de comunicação entre a Nexus Group, os titulares de dados e a
              Autoridade Nacional de Proteção de Dados (ANPD).
            </li>
          </ul>
        </Section>

        <Section title="8. Notificação de Incidentes de Segurança">
          <p>
            Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
            titulares, a Nexus Group comunicará:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              À <strong>ANPD</strong> e às <strong>Escolas afetadas</strong> em prazo razoável,
              conforme art. 48 da LGPD (em regra, em até 72 horas após a ciência do incidente).
            </li>
            <li>
              A comunicação conterá: natureza dos dados afetados, número de titulares envolvidos,
              medidas adotadas e contato do DPO.
            </li>
          </ul>
        </Section>

        <Section title="9. Transferência Internacional de Dados">
          <p>
            A plataforma utiliza infraestrutura de nuvem com servidores localizados no Brasil e nos
            Estados Unidos (Amazon Web Services e Google Cloud). Transferências internacionais
            ocorrem com base nas garantias previstas no art. 33 da LGPD, incluindo cláusulas
            contratuais padrão e certificações de conformidade dos fornecedores.
          </p>
        </Section>

        <Section title="10. Atualizações">
          <p>
            Este documento é revisado periodicamente conforme mudanças na legislação, na
            plataforma ou nas práticas de privacidade. Alterações relevantes serão comunicadas às
            Escolas com antecedência mínima de 15 dias.
          </p>
          <p>
            Para a{' '}
            <Link to="/privacy-policy" className="text-primary-600 hover:underline">
              Política de Privacidade completa
            </Link>{' '}
            e os{' '}
            <Link to="/terms-and-conditions" className="text-primary-600 hover:underline">
              Termos de Uso
            </Link>
            , acesse as páginas correspondentes.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
