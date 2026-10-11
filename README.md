# Nexus EduCare - Landing Page

Site institucional e onboarding da plataforma Nexus EduCare. Marketing page com fluxo de cadastro multi-etapas e acompanhamento de provisionamento.

## Tecnologias

| Tecnologia | Versao | Finalidade |
|-----------|--------|------------|
| React | 19 | UI library |
| TypeScript | 5.9 | Seguranca de tipos |
| Vite | 7 | Build tool |
| Tailwind CSS | v4 | Estilizacao (via `@tailwindcss/vite`, config em `src/index.css`) |
| Framer Motion | — | Animacoes de scroll e transicoes |
| Lucide React | — | Icones (tree-shaken) |
| Zod | 4 | Validacao de formularios |
| React Router DOM | 7 | SPA routing |
| clsx | — | Classes condicionais |

## Comandos

```bash
npm install              # Instalar dependencias
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de producao (tsc -b + vite build)
npm run preview          # Preview do build de producao
npm run lint             # ESLint
```

Deploy: `npx vercel --prod`

## Arquitetura

### Rotas (SPA com react-router-dom)

| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/` | Home | Landing page com secoes verticais (scroll-snap) |
| `/cadastro` | Signup | Formulario de onboarding multi-etapas |
| `/onboarding` | OnboardingProgress | Tracker de provisionamento |
| `/:lang` | — | Redirect de prefixo de idioma legado |

### i18n

Sistema customizado em `src/i18n/` (sem lib externa):
- 3 locales: `pt-BR.json`, `en-US.json`, `es-ES.json`
- `pt-BR.json` e o type source (`type Locale = typeof ptBR`)
- Deteccao: URL path > idioma do browser > padrao `br`
- Codigos na URL: `br`, `en`, `es`
- Hook: `const { t } = useI18n()`

### Estrutura de Pastas

```
src/
├── components/
│   ├── layout/        # Header, Footer
│   ├── sections/      # Secoes da Home (Hero, Problems, Solution, HowItWorks, Features, etc.)
│   ├── signup/        # Etapas do cadastro (SchoolInfoStep, AdminInfoStep, PlanConfirmStep)
│   ├── onboarding/    # Provisionamento (ProgressTracker, SuccessScreen, ErrorScreen)
│   └── ui/            # FloatingLangSwitcher, ScrollIndicator
├── data/              # Dados estaticos (features, pricing, faq, testimonials)
├── i18n/              # Sistema de i18n + locales
├── pages/             # Home, Signup, OnboardingProgress
└── utils/             # masks.ts (CNPJ/telefone), schemas.ts (Zod)
```

### Cores do Tema (definidas em `src/index.css` via `@theme`)

- Primary: verde (`#43A047` at 500)
- Secondary: lima (`#7CB342` at 500)
- Accent: ambar (`#F59E0B` at 500)
- Fonte: Inter

### IDs de Secao (navegacao por hash)

`desafios`, `solucao`, `como-funciona`, `features`, `diferenciais`, `pricing`, `testimonials`, `faq`, `contato`

## Variaveis de Ambiente

```bash
VITE_API_URL=http://localhost:3000
```

## Patterns

### Layout Split-Screen (Signup + Onboarding)

- **Desktop**: painel esquerdo com gradiente verde (logo, headline, features, social proof) + conteudo direito em `bg-slate-50`
- **Mobile**: header strip verde (logo + voltar) + conteudo abaixo

### Validacao com Zod

Schemas em `src/utils/schemas.ts`. Mensagens de erro sao chaves i18n mapeadas em render via `t.signup.validation[key]`.

### Fluxo de Onboarding

1. Cadastro (escola + admin + plano) → `start-onboarding` Edge Function
2. Pagamento → `process-payment` Edge Function
3. Provisionamento → `provision-school` Edge Function (3 etapas)
4. Tela de sucesso com credenciais (email + senha temporaria)
