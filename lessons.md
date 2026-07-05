# lessons.md - cam-dss

Diário cronológico de correções e descobertas. Cada entrada aponta pro
local canônico onde a regra é aplicada, não duplica a regra aqui.

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
