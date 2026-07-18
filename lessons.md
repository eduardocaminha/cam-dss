# lessons.md - cam-dss

Diário cronológico de correções e descobertas. Cada entrada aponta pro
local canônico onde a regra é aplicada, não duplica a regra aqui.

## 2026-07-18 - reskin do /dashboard para o CAM Runtime DS

Situação: usuário pediu para trocar o design do /dashboard aplicando o
`CAM_DESIGN_SYSTEM.md` (industrial/brutalist: flat, hard edges, clipped
corners por role, Acid Pop, mono, badges de estado com texto+símbolo,
evidence cards). Decisão: reskin fiel completo + repensar layout (página
única assimétrica, control panel). Saiu a estética "Otter" (pastel, pills,
grain, shimmer, gradiente).

Achado 1: para um scroller horizontal interno (`overflow-x-auto`, ex.
FlowStrip do pipeline, DragScroll dos implementers) rolar em vez de alargar
a página, TODA a cadeia de ancestrais `flex flex-col` precisa de `min-w-0`
(não só o scroller). Sem isso o item flex cresce até o conteúdo e estoura o
body no mobile. Corrigido em page.tsx (wrapper `Rise`) e pipeline.tsx.

Achado 2 (pré-existente, corrigido na mesma sessão a pedido): `site-nav.tsx`
tinha overflow horizontal abaixo de ~420px (conteúdo 515px em viewport 400) -
os 5 links + 2 botões de tema não cabiam, afetando TODAS as páginas. Fix:
a nav virou scrollável (`min-w-0 overflow-x-auto` + scrollbar escondida
inline; links `shrink-0 whitespace-nowrap`), e no header (`app/(app)/
layout.tsx`) o grupo do logo+nav ganhou `min-w-0` e o grupo dos botões
`shrink-0`. Fresh load em 375px: sem overflow (documentElement scrollWidth =
clientWidth). Nota: ao redimensionar AO VIVO de wide->375, o ResponsiveContainer
do recharts (tokens-card) fica stale e reporta largura antiga até o reflow -
não acontece em load direto no mobile (comportamento upstream do recharts).

Local canônico: descrição do dashboard em `README.md` (§Structure); tokens
`--cam-*` e motion vivem em `app/(app)/dashboard/dashboard.css` (escopados,
protegidos do `shadcn apply`); mapas role/state em `cam-tokens.ts`.

## 2026-07-05 - sweep de style-<name>: inerte ficou incompleta

Situação: usuário reportou que o exemplo "With Borders" do Accordion
estava sem borda. Uma sweep anterior (sessão passada) já tinha corrigido
o padrão de `style-<name>:` inerte (variantes que só existem no monorepo
shadcn-ui/ui, sem efeito neste projeto) em vários arquivos, mas só
verificou arquivos onde o sintoma já era conhecido (accordion "With
Disabled", tabs, dialog) - não fez grep do padrão completo no projeto
inteiro. `AccordionWithBorders` (mesmo arquivo, exemplo vizinho) tinha o
mesmo bug e passou despercebido.

Achado: é bug por ocorrência, não por arquivo - toda vez que esse padrão
for investigado de novo, grep `style-[a-z]+:(rounded-|border|gap-)` em
`components/*-example.tsx` inteiro, não só nos arquivos já suspeitos.

Local canônico: `CLAUDE.md` seção "Known gaps" (entrada sobre
`style-<name>:` inert variants).
