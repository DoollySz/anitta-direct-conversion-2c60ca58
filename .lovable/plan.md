

# Corrigir Navegação SPA no Netlify

## Problema
Quando você navega de volta usando o botão do navegador, o Netlify retorna "Page not found" porque tenta encontrar arquivos físicos para rotas como `/privacy` ou `/checkout`, que são rotas gerenciadas pelo React Router no cliente.

## Solução
Criar um arquivo `_redirects` na pasta `public` que configura o Netlify para redirecionar todas as requisições para o `index.html`.

## Implementação

### Criar arquivo: `public/_redirects`

```
/*    /index.html   200
```

## Como Funciona

```
┌─────────────────────────────────────────────────────────┐
│  Usuário acessa /checkout diretamente ou via "voltar"   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Netlify recebe requisição para /checkout               │
│  (não existe arquivo físico /checkout)                  │
└─────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
      SEM _redirects              COM _redirects
            │                           │
            ▼                           ▼
    ┌───────────────┐          ┌────────────────────┐
    │ 404 Not Found │          │ Serve index.html   │
    │ (Netlify)     │          │ com status 200     │
    └───────────────┘          └────────────────────┘
                                        │
                                        ▼
                               ┌────────────────────┐
                               │ React Router lê    │
                               │ a URL e renderiza  │
                               │ o componente certo │
                               └────────────────────┘
```

## Arquivo Único a Criar

| Arquivo | Descrição |
|---------|-----------|
| `public/_redirects` | Configuração de redirecionamento do Netlify para SPAs |

## Resultado Esperado
Após essa mudança, navegar de volta pelo navegador funcionará corretamente, carregando as páginas `/privacy`, `/checkout` e qualquer outra rota sem erros 404.

