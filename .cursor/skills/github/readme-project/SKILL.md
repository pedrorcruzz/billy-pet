---
name: readme-project
description: Cria ou atualiza o README.md do projeto Billy Pet para exibição no GitHub. Inclui logo centralizado, descrição do projeto, capturas de tela (assets/github/) em tabela, comandos disponíveis (.cursor/commands/) e instruções de instalação. Usar quando o usuário pedir para criar, atualizar ou documentar o README do projeto.
---

# README do Projeto Billy Pet

## Objetivo

Gerar o `README.md` do repositório para exibição no GitHub, com foco em clareza e completude das informações essenciais.

## Estrutura Obrigatória

### 1. Logo (primeira linha)

- Imagem centralizada: `assets/images/splash-icon.png`
- Usar HTML para centralizar no GitHub: `<p align="center"><img src="assets/images/splash-icon.png" width="200" alt="Billy Pet" /></p>`

### 2. Linha divisória

- Após o logo: `---`

### 3. Descrição do projeto

- **O que é**: Billy Pet é um aplicativo de pet shop
- **Desenvolvido para**: Faculdade CESMAC
- **Stack**: Projeto mobile com React Native e Expo
- **Domínio**: Venda de produtos para pets (ração, acessórios, medicamentos, brinquedos, etc.)

### 4. Capturas de tela (assets/github/)

Logo abaixo da descrição do projeto, adicionar seção **"## Capturas de tela"** com as imagens em tabela.

- **Origem**: Listar todos os arquivos em `assets/github/` (png, jpg, jpeg, webp)
- **Formato**: Tabela com 2 ou 3 colunas — cada célula contém a imagem centralizada
- **Label**: Derivar do nome do arquivo (ex: `tela-login.png` → "Tela de login", `tela-carrosel1.png` → "Carrossel 1")
- **Caminho**: `assets/github/<nome-do-arquivo>`
- **Exemplo de célula**: `<p align="center"><img src="assets/github/tela-login.png" width="200" alt="Tela de login" /></p>`
- **Regra**: Se `assets/github/` estiver vazio, omitir a seção. Sempre que houver arquivos, incluí-los na tabela.

### 5. Comandos disponíveis

Listar todos os arquivos em `.cursor/commands/` com breve resumo:

| Arquivo | Resumo |
|---------|--------|
| `components.md` | Cria ou modifica componentes React Native seguindo o design system |
| `doc-design-system.md` | Gera documentação completa do design system Billy Pet via design-system-documenter |
| `git-commit.md` | Cria commits no padrão Conventional Commits via github-specialist |
| `readme.md` | Cria ou atualiza o README do projeto via github-specialist |
| `screen-workflow.md` | Cria, edita ou remove telas via frontend-specialist |
| `test.md` | Cria ou debuga testes com Jest e Expo via testing-specialist |

**Importante**: Ler o conteúdo de cada arquivo em `.cursor/commands/` para extrair o resumo correto. O agente deve listar todos os comandos existentes na pasta.

### 6. Instalação e uso

```bash
# Clonar o repositório (HTTPS)
git clone https://github.com/pedrorcruzz/billy-pet.git

# Ou via SSH
git clone git@github.com:pedrorcruzz/billy-pet.git

# Instalar dependências
npm install

# Iniciar o projeto
npm start

# Plataformas específicas
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

## Workflow

1. Listar arquivos em `assets/github/` — se houver imagens, incluir seção "Capturas de tela" em tabela
2. Listar arquivos em `.cursor/commands/`
3. Ler cada arquivo de comandos para extrair resumo (1 linha)
4. Montar README seguindo a estrutura acima
5. Escrever em `README.md`

## Regras

- Manter conciso; evitar texto excessivo
- Comandos em português (resumos)
- Descrição do projeto em português
