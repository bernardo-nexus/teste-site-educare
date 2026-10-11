import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'
import { Footer } from '../components/layout/Footer'

const email = import.meta.env.VITE_EMAIL_ABOUT

export function Sobre() {
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

      <main className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        {/* Hero */}
        <div className="mb-16 grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Sobre
            </p>
            <h1 className="text-3xl font-light leading-snug text-slate-900 md:text-4xl">
              Engenharia de software para operações críticas de negócio.
            </h1>
          </div>
          <div className="space-y-5">
            <p className="text-base leading-relaxed text-slate-600">
              A Nexus Group é uma empresa de engenharia de software focada em construir sistemas
              escaláveis para operações críticas. Não somos uma agência que entrega websites. Não
              somos uma consultoria que vende diagnósticos.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Construímos software que funciona. Arquitetura sólida, código confiável, sistemas que
              crescem com o seu negócio. Projetos de escopo fixo com entregas claras e soluções SaaS
              proprietárias para problemas específicos de indústria.
            </p>
          </div>
        </div>

        {/* EduCare callout */}
        <div className="mb-16 rounded-2xl border border-primary-100 bg-primary-50 p-8">
          <h2 className="mb-3 text-xl font-bold text-primary-800">Nexus EduCare</h2>
          <p className="text-base leading-relaxed text-primary-700">
            O Nexus EduCare é o produto da Nexus Group desenvolvido especificamente para creches e
            escolas infantis no Brasil. Uma plataforma completa de gestão escolar que conecta pais,
            professores e gestores — com conformidade LGPD, suporte dedicado e infraestrutura
            projetada para crescer junto com a sua instituição.
          </p>
        </div>

        {/* Metrics */}
        <div className="border-t border-slate-100 pt-14">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <div>
              <p className="text-4xl font-light text-slate-900 md:text-5xl">8+</p>
              <p className="mt-2 text-sm tracking-wide text-slate-500">Anos de operação</p>
            </div>
            <div>
              <p className="text-4xl font-light text-slate-900 md:text-5xl">50+</p>
              <p className="mt-2 text-sm tracking-wide text-slate-500">Projetos entregues</p>
            </div>
            <div>
              <p className="text-4xl font-light text-slate-900 md:text-5xl">99.9%</p>
              <p className="mt-2 text-sm tracking-wide text-slate-500">Uptime garantido</p>
            </div>
            <div>
              <p className="text-4xl font-light text-slate-900 md:text-5xl">B2B</p>
              <p className="mt-2 text-sm tracking-wide text-slate-500">Enterprise global</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-500">
            Dúvidas?{' '}
            <a
              href={`mailto:${email}`}
              className="text-primary-600 hover:underline"
            >
              {email}
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
