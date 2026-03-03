---
name: auth-routes
description: Implementa rotas com autenticação obrigatória no Billy Pet. Usuário deve estar logado para acessar o app; se não logado, permanece em login ou cadastro. Segue rigorosamente .cursor/rules/auth-routes.mdc. Usar ao criar ou modificar rotas, proteção de rotas ou fluxo de login.
---

# Auth Routes — Billy Pet (E-commerce)

Seguir **rigorosamente** as regras em `.cursor/rules/auth-routes.mdc`. Esta skill detalha o passo a passo para implementar.

## Princípio

Autenticação **obrigatória**. Usuário **deve** estar logado para acessar o sistema. Se não logado, permanece na tela de **login** ou **cadastro**.

---

## Passo 1: Estrutura de rotas (Expo Router)

```
app/
  _layout.tsx       # Verificar auth na raiz; redirecionar para (auth) se não logado
  (auth)/           # Login, cadastro — exibido quando NÃO logado
    login.tsx
    sign-up.tsx
  (tabs)/           # Protegido — só quando logado
  (admin)/          # Protegido — só admin
    _layout.tsx     # Verificar role, redirecionar se não admin
```

- Rotas de auth em `(auth)/` — únicas acessíveis sem login
- Rotas principais em `(tabs)/` — protegidas, exigem login
- Admin em `(admin)/` — protegido, exige role admin

---

## Passo 2: Proteção na raiz

No `_layout.tsx` raiz (ou em um layout que envolva as rotas protegidas):

1. Verificar se usuário está autenticado (token, sessão, contexto)
2. Se **não logado** → `router.replace('/(auth)/login')` ou exibir stack `(auth)` com login/cadastro
3. Se **logado** → liberar acesso a `(tabs)` e demais rotas

---

## Passo 3: Níveis de acesso

| Tipo | Acesso |
|------|--------|
| Não logado | Apenas login e cadastro |
| Usuário | Catálogo, produto, carrinho, checkout, pedidos, perfil |
| Admin | + rotas admin |

**Implementar**: no `_layout.tsx` de `(admin)/`, verificar `user?.role === 'admin'`. Se não for admin → `router.replace('/(auth)/login')` ou redirecionar para home.

---

## Passo 4: Telas de auth

- **Login**: formulário de email/senha; ao sucesso → redirecionar para `/(tabs)` ou home
- **Cadastro**: formulário de registro; ao sucesso → redirecionar para login ou `/(tabs)`
- Link entre login e cadastro (ex: "Não tem conta? Cadastre-se")

---

## Checklist

- [ ] Layout raiz verifica autenticação
- [ ] Não logado → redireciona para login ou cadastro
- [ ] Logado → acessa (tabs) e rotas principais
- [ ] Rotas admin protegidas (verificar role)
- [ ] Telas de login e cadastro funcionais
