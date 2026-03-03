---
name: readme-project
description: Cria ou atualiza o README.md do projeto Billy Pet para exibição no GitHub. Inclui logo centralizado, descrição do projeto, comandos disponíveis (.cursor/commands/) e instruções de instalação. Usar quando o usuário pedir para criar, atualizar ou documentar o README do projeto.
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

### 4. Comandos disponíveis

Listar todos os arquivos em `.cursor/commands/` com breve resumo:

| Arquivo | Resumo |
|---------|--------|
| `components.md` | Cria ou modifica componentes React Native seguindo o design system |
| `git-commit.md` | Cria commits no padrão Conventional Commits via github-specialist |
| `create-doc-design-system.md` | Gera documentação completa do design system Billy Pet |

**Importante**: Ler o conteúdo de cada arquivo em `.cursor/commands/` para extrair o resumo correto. O agente deve listar todos os comandos existentes na pasta.

### 5. Instalação e uso

```bash
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

1. Listar arquivos em `.cursor/commands/`
2. Ler cada arquivo para extrair resumo (1 linha)
3. Montar README seguindo a estrutura acima
4. Escrever em `README.md`

## Regras

- Manter conciso; evitar texto excessivo
- Comandos em português (resumos)
- Descrição do projeto em português
