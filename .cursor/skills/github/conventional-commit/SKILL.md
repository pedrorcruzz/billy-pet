---
name: conventional-commit
description: Gera mensagens de commit no padrão Conventional Commits. Usar ao criar commits, escrever mensagens de commit ou quando o usuário pedir para commitar alterações.
---

# Conventional Commit — Billy Pet

Gera mensagens de commit no formato `tipo(escopo): descrição`.

## Workflow

1. **git add .** — coloca no stage tudo que não está
2. **git commit** — commita com mensagem no padrão Conventional Commits
3. **git push** — **obrigatório** — envia para o remoto; se falhar, usar `git push origin <branch>` (branch atual)

> **Importante:** O passo 3 (git push) deve ser executado sempre após o commit. Não omitir.

## Formato

```
tipo(escopo opcional): descrição em imperativo

Corpo opcional.
```

**Regra**: descrição em imperativo, minúscula, sem ponto final. Ex: "adiciona" não "adicionado".

---

## Prefixos (tipos)

| Prefixo      | Uso                                                          |
| ------------ | ------------------------------------------------------------ |
| **feat**     | Nova funcionalidade — adiciona algo ao usuário               |
| **fix**      | Correção de bug — resolve problema no código                 |
| **docs**     | Documentação — altera apenas .md, comentários, README        |
| **style**    | Formatação — espaços, vírgulas, aspas; não altera lógica     |
| **refactor** | Refatoração — melhora código sem mudar comportamento         |
| **perf**     | Performance — otimização de velocidade ou memória            |
| **test**     | Testes — adiciona ou ajusta testes                           |
| **build**    | Build — dependências, scripts, config de compilação          |
| **ci**       | CI/CD — pipelines, workflows, integração contínua            |
| **chore**    | Tarefas gerais — lint, config, coisas que não encaixam acima |

---

## Exemplos

```
feat(cart): adiciona botão de remover item
fix(auth): corrige validação de token expirado
docs(readme): atualiza instruções de instalação
style(components): aplica formatação do Prettier
refactor(api): extrai lógica de fetch para hook
perf(list): usa FlatList com windowSize reduzido
test(cart): adiciona testes do useCart
chore(deps): atualiza expo para 55
```

---

## Escopo opcional

Usar quando fizer sentido: `feat(cart)`, `fix(product-detail)`, `docs(design-system)`.

---

## Breaking change

Para mudanças incompatíveis: `feat!: remove API antiga` ou `BREAKING CHANGE:` no corpo.

---
