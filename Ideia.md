# Ideia — Personalização SO

## O que é?

Uma ferramenta para **personalizar completamente o Windows 11 Pro** de forma centralizada, visual e fácil — mesmo para quem é leigo em tecnologia.

---

## Motivação

Atualmente, personalizar o Windows 11 é espalhado e complicado. As configurações estão espalhadas por vários lugares, não há forma de salvar combinações de configurações, e funcionalidades simples (como wallpaper animado) não existem nativamente. A ideia é **centralizar tudo em uma ferramenta**.

---

## Para começar (MVP)

Inicialmente, foco em 3 áreas principais:

### 1. **Plano de Fundo**

O que quero poder fazer:
- Escolher **wallpaper parado** (imagem estática)
- Escolher **wallpaper animado** (GIF ou vídeo)
- Configurar **cronograma** — associar diferentes wallpapers a horários do dia (ex: de manhã mostra praia, à noite mostra cidade escura)
- Configurar **variação automática** — selecionar múltiplos wallpapers e deixar o PC alternar entre eles automaticamente em um período que eu escolho (de X em X minutos/horas, aleatório ou em ordem)
- Deixar **fixo** (um wallpaper só) ou **variável** (alterna automático)

### 2. **Barra de Tarefas**

O que quero poder fazer:
- Mudar **posição** da barra (onde ela fica — baixo, esquerda, etc.)
- Mudar **transparência** da barra
- Mudar **cor** da barra
- Configurar **formato** da barra (visual, tamanho)
- Configurar **posição dos itens** dentro da barra (onde os ícones ficam)
- Configurar **formato dos itens** (tamanho dos ícones, espaçamento)
- Controlar o que **aparece ou desaparece** — mostrar/ocultar serviços, widgets, relógio, pesquisa, Copilot, ícones de programas na bandeja
- E outras coisas que podem auxiliar a usar a barra de forma melhor

### 3. **Interface / Tema do Sistema**

O que quero poder fazer:
- Mudar **tema** (modo escuro/claro)
- Mudar **cor** do tema (cores de destaque e acentuação)
- Mudar **fonte** do sistema (se possível)

### 4. **Gerenciador de Comandos e Atalhos** (importante!)

Isso é especial. O que quero:
- **Trazer uma lista COMPLETA** de todos os comandos/atalhos disponíveis no meu Windows (Win+D, Alt+Tab, etc.)
- Poder **gerenciar**:
  - Buscar por função (ex: "mostrar área de trabalho" → aparece Win+D)
  - Buscar por tecla (ex: "Win+D" → aparece a função)
  - Adicionar novos atalhos personalizados
  - Modificar atalhos existentes
  - Remover atalhos
  - Aprender quais atalhos existem (muita gente não sabe)
- Poder **fixar/favoritizar** os atalhos que eu mais uso — eles ficam no topo da lista

---

## Sistema de Perfis

Em qualquer uma dessas áreas, eu quero poder **salvar a combinação de configurações** com um nome (ex: "Tema Trabalho", "Tema Noite", "Tema Gaming") e depois **carregar** esse perfil para aplicar todas as configurações de uma vez.

Exemplo:
- Salvo um perfil "Trabalho" com: wallpaper estático, barra em baixo, tema claro
- Salvo um perfil "Noite" com: wallpaper animado + cronograma, barra com transparência, tema escuro
- Quero poder trocar entre esses perfis com um clique

---

## Como deve ser?

- **Ferramenta desktop** — não web, não na nuvem. Roda no meu PC, mexe nas configurações do meu PC
- **Interface visual e moderna** — com design escuro/dark mode legal
- **Fácil de usar** — eu sou leigo em tecnologia, então precisa ser intuitivo
- **Executável único** — tipo um .exe que eu duplo-clico e funciona. Sem instalar nada além disso
- **Sem complicação** — sem terminal, sem linhas de comando, tudo visual

---

## Escopo Futuro (v2, v3, etc.)

Com o MVP pronto, ideias para expandir:
- Mais personalizações (sons do sistema, cursor, animações)
- Integração com múltiplos monitores
- Sincronização de perfis em nuvem
- Temas de terceiros
- E o que mais surgir como necessidade

---

## Resumo

Uma ferramenta simples, visual e centralizada para um usuário leigo personalizar:
- Wallpaper (estático, animado, agendado, variável)
- Barra de tarefas (posição, transparência, cor, visibilidade, formato)
- Tema (escuro/claro, cores, fonte)
- Atalhos/comandos (lista, busca, favoritos, personalização)
- Tudo isso salvo em perfis que podem ser carregados a qualquer momento

Pronto para começar a documentação formal.
