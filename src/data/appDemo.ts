/*
 * Clickable prototype of the real app, built from simulator screenshots of the fictional
 * demo school "Escola Girassol" (see scripts/seed-demo-school.mjs).
 *
 * Each screen lists its tappable areas as percentages of the screenshot, so a hotspot keeps
 * its place at any phone size. To add a screen: drop the image in /public/prints, add an
 * entry here and point a hotspot at its id.
 *
 *   to: '<id>'      push that screen
 *   to: BACK        pop back to the previous screen (the app's own back arrow)
 *   replace: true   switch in place without stacking (tabs inside a screen)
 *   hint: true      the target the idle "ghost tap" shows (default: first non-back target)
 */

export const BACK = '__back';

export interface DemoHotspot {
  /** Left edge, % of screen width */
  x: number;
  /** Top edge, % of screen height */
  y: number;
  /** Width, % of screen width */
  w: number;
  /** Height, % of screen height */
  h: number;
  /** Screen id this tap opens, or BACK */
  to: string;
  /** Accessible name for the tap target */
  label: string;
  replace?: boolean;
  /** The target the idle "ghost tap" demonstrates on this screen */
  hint?: boolean;
}

export interface DemoScreen {
  id: string;
  src: string;
  /** Targets fixed to the phone screen (header, back arrow, floating buttons) — % of the viewport */
  hotspots: DemoHotspot[];
  /**
   * Scrollable screen: `src` is a stitched screenshot taller than the phone.
   * The top `header` px stay fixed while the rest scrolls; `hotspots` here are % of the full image.
   */
  tall?: { height: number; header: number; hotspots: DemoHotspot[] };
}

/** Screenshot size (iPhone 17 Pro, @3x) — tall screens keep this width */
export const SHOT_W = 1206;
export const SHOT_H = 2622;

/** Full-width row on a tall screen, given its top/bottom in screenshot pixels */
export const tallRow = (height: number) => (y0: number, y1: number, to: string, label: string, hint = false): DemoHotspot => ({
  x: 2,
  y: (y0 / height) * 100,
  w: 96,
  h: ((y1 - y0) / height) * 100,
  to,
  label,
  hint,
});

const back: DemoHotspot = { x: 1, y: 7, w: 13, h: 6, to: BACK, label: 'Voltar' };

/** Full-width list row / card */
const row = (y: number, h: number, to: string, label: string, hint = false): DemoHotspot => ({ x: 2, y, w: 96, h, to, label, hint });

/** Minha Escola has four tabs; each tab screen links to the other three */
const schoolTabs = (current: string): DemoHotspot[] =>
  [
    { id: 'g-escola-resumo', label: 'Resumo', x: 4.5, w: 22 },
    { id: 'g-escola-plano', label: 'Plano', x: 27.5, w: 21 },
    { id: 'g-escola-config', label: 'Config.', x: 49.5, w: 21 },
    { id: 'g-escola-backups', label: 'Backups', x: 71.5, w: 24 },
  ]
    .filter((t) => t.id !== current)
    .map((t, i) => ({ x: t.x, y: 44.9, w: t.w, h: 4.4, to: t.id, label: t.label, replace: true, hint: i === 0 }));

/** Bump when screenshots are replaced, so browsers don't keep the old file */
const PRINTS_VERSION = 3;
const p = (path: string) => `/prints/${path}.webp?v=${PRINTS_VERSION}`;
const screen = (id: string, file: string, hotspots: DemoHotspot[]): [string, DemoScreen] => [id, { id, src: p(file), hotspots }];

export const DEMO_SCREENS: Record<string, DemoScreen> = Object.fromEntries([
  /* ─── Gestão (diretora Helena — Escola Girassol) ─── */
  screen('g-inicio', 'gestao/inicio', [
    { x: 3, y: 7.5, w: 42, h: 5.5, to: 'g-perfil', label: 'Perfil' },
    { x: 22, y: 38.3, w: 18, h: 7.5, to: 'g-escola-resumo', label: 'Minha Escola', hint: true },
    { x: 41, y: 38.3, w: 17.5, h: 7.5, to: 'g-equipe', label: 'Equipe' },
    { x: 59, y: 38.3, w: 18, h: 7.5, to: 'g-turmas', label: 'Turmas' },
    { x: 78, y: 38.3, w: 18, h: 7.5, to: 'g-responsaveis', label: 'Responsáveis' },
    { x: 3, y: 46.5, w: 17.5, h: 7.5, to: 'g-alunos', label: 'Alunos' },
    { x: 3, y: 60, w: 94, h: 34.5, to: 'g-agenda', label: 'Agenda diária' },
    { x: 72, y: 94.5, w: 25, h: 4, to: 'g-agenda', label: 'Ver mais' },
  ]),
  screen('g-perfil', 'gestao/perfil', [
    back,
    row(40.5, 7.5, 'g-escola-plano', 'Plano Completo'),
    row(52, 8, 'g-escola-resumo', 'Minha Escola', true),
    row(60.5, 8, 'g-equipe', 'Equipe'),
    row(68.5, 8, 'g-turmas', 'Turmas'),
    row(77, 8, 'g-responsaveis', 'Responsáveis'),
    row(85, 8, 'g-alunos', 'Alunos'),
  ]),
  screen('g-escola-resumo', 'gestao/escola-resumo', [
    back,
    ...schoolTabs('g-escola-resumo'),
    { x: 4, y: 51.5, w: 29, h: 11.5, to: 'g-equipe', label: 'Equipe' },
    { x: 35.5, y: 51.5, w: 29, h: 11.5, to: 'g-turmas', label: 'Turmas' },
    { x: 67, y: 51.5, w: 29, h: 11.5, to: 'g-alunos', label: 'Alunos' },
  ]),
  screen('g-escola-plano', 'gestao/escola-plano', [back, ...schoolTabs('g-escola-plano')]),
  screen('g-escola-config', 'gestao/escola-config', [
    back,
    ...schoolTabs('g-escola-config'),
    { x: 4, y: 78.3, w: 92, h: 5.8, to: 'g-anos', label: 'Anos letivos', hint: true },
  ]),
  screen('g-escola-backups', 'gestao/escola-backups', [back, ...schoolTabs('g-escola-backups')]),
  screen('g-anos', 'gestao/anos-letivos', [back]),

  screen('g-equipe', 'gestao/equipe', [
    back,
    row(18.4, 10, 'g-funcionario', 'Ana Souza', true),
    { x: 42, y: 91.2, w: 16, h: 7, to: 'g-novo-funcionario', label: 'Novo funcionário' },
  ]),
  screen('g-funcionario', 'gestao/funcionario', [back]),
  screen('g-novo-funcionario', 'gestao/novo-funcionario', [back]),

  screen('g-turmas', 'gestao/turmas', [
    back,
    row(14.8, 10.4, 'g-turma', 'Berçário', true),
  ]),
  screen('g-turma', 'gestao/turma', [back]),

  screen('g-responsaveis', 'gestao/responsaveis', [
    back,
    row(14.8, 9, 'g-responsavel', 'Aline Barbosa', true),
  ]),
  screen('g-responsavel', 'gestao/responsavel', [back]),

  screen('g-alunos', 'gestao/alunos', [
    back,
    row(19, 9, 'g-aluno', 'Alice Costa', true),
  ]),
  screen('g-aluno', 'gestao/aluno', [back]),

  screen('g-agenda', 'gestao/agenda', [
    back,
    row(15, 6.4, 'g-agenda-turma', 'Berçário', true),
  ]),
  screen('g-agenda-turma', 'gestao/agenda-turma', [back]),

  // Reached from the scrollable home once it is captured end to end
  screen('g-comunicado', 'gestao/comunicado', [back]),
  screen('g-enquetes', 'gestao/enquetes', [back]),
  screen('g-calendario', 'gestao/calendario', [back]),
  screen('g-financeiro', 'gestao/financeiro', [back]),
  screen('g-presencas', 'gestao/presencas', [back]),
  screen('g-medicacoes', 'gestao/medicacoes', [back, row(20, 9.5, 'g-medicacao-aberta', 'Antialérgico', true)]),
  screen('g-medicacao-aberta', 'gestao/medicacao-aberta', [back, row(20, 9.5, 'g-medicacoes', 'Recolher', true)]),
  screen('g-lista-material', 'gestao/lista-material', [back]),

  /* ─── Professores (Prof. Ana — Maternal I) ─── */
  screen('p-inicio', 'professores/inicio', [
    { x: 3, y: 7.8, w: 42, h: 5, to: 'p-perfil', label: 'Perfil' },
    { x: 3.5, y: 25.7, w: 17, h: 7.2, to: 'p-presenca', label: 'Presenças' },
    { x: 41, y: 25.7, w: 17, h: 7.2, to: 'p-turma', label: 'Agenda diária' },
    { x: 3, y: 40.5, w: 94, h: 32, to: 'p-turma', label: 'Agenda diária', hint: true },
    { x: 74, y: 73.4, w: 22, h: 3.6, to: 'p-turma', label: 'Ver mais' },
    row(83.3, 6.6, 'p-comunicado', 'Passeio ao Jardim Botânico'),
  ]),
  screen('p-turma', 'professores/turma-diario', [
    back,
    row(41.8, 6, 'p-diario', 'Davi Rocha', true),
  ]),
  screen('p-diario', 'professores/diario-aluno', [
    back,
    // tapping the meal/sleep options "fills" the report — shows the filled version
    { x: 3, y: 21, w: 94, h: 31, to: 'p-diario-preenchido', label: 'Preencher relatório', hint: true },
  ]),
  screen('p-diario-preenchido', 'professores/diario-preenchido', [back]),
  screen('p-comunicado', 'professores/comunicado', [back]),
  ['p-perfil', (() => {
    const H = 6548;
    const r = tallRow(H);
    return {
      id: 'p-perfil',
      src: p('professores/perfil'),
      hotspots: [back],
      tall: {
        height: H,
        header: 342,
        hotspots: [
          r(2531, 2747, 'p-agenda-turma', 'Agenda Diária', true),
          r(2969, 3185, 'p-cardapio', 'Cardápio'),
          r(3188, 3404, 'p-medicacoes', 'Medicação'),
          r(3407, 3623, 'p-presenca', 'Presenças'),
          r(4064, 4280, 'p-ponto', 'Ponto Eletrônico'),
          r(4853, 5069, 'p-materiais', 'Materiais'),
        ],
      },
    } satisfies DemoScreen;
  })()],
  screen('p-presenca', 'professores/presenca', [back]),
  screen('p-agenda-turma', 'professores/agenda-turma', [back, row(30.5, 7.2, 'p-agenda-aluno', 'Alice Costa', true)]),
  screen('p-agenda-aluno', 'professores/agenda-aluno', [back, { x: 2, y: 30.5, w: 96, h: 7.2, to: BACK, label: 'Recolher', hint: true }]),
  screen('p-cardapio', 'professores/cardapio', [back]),
  screen('p-medicacoes', 'professores/medicacoes', [back]),
  screen('p-ponto', 'professores/ponto', [back]),
  screen('p-materiais', 'professores/materiais', [back]),

  /* ─── Pais (Maria — responsável) ─── */
  screen('r-inicio', 'pais/inicio', [
    { x: 3, y: 7.8, w: 42, h: 5, to: 'r-perfil', label: 'Perfil' },
    { x: 22.4, y: 64.9, w: 17, h: 7.2, to: 'r-calendario', label: 'Calendário', hint: true },
  ]),
  screen('r-calendario', 'pais/calendario', [back]),
  screen('r-perfil', 'pais/perfil', [back]),
]);

/**
 * Where each profile's tour starts (order matches t.solution.roles: pais, professores, gestão).
 * null = screenshots for that profile not captured yet; its button shows as "coming soon".
 */
export const DEMO_ROLE_START: (string | null)[] = ['r-inicio', 'p-inicio', 'g-inicio'];
