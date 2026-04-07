# 🚛 Fretex — Fretes & Mudanças

PWA de agendamento de fretes e mudanças para a Baixada Santista.

---

## 🚀 Setup rápido

### 1. Criar projeto Firebase

1. Acesse https://console.firebase.google.com
2. Criar novo projeto → nome: `fretex`
3. Ativar **Authentication** → Google como provedor
4. Ativar **Firestore** → modo produção
5. Ativar **Storage**

### 2. Configurar credenciais

Abrir `js/firebase.js` e `index.html` e substituir:

```js
const firebaseConfig = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "SEU_PROJECT.firebaseapp.com",
  projectId:         "SEU_PROJECT_ID",
  storageBucket:     "SEU_PROJECT.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId:             "SEU_APP_ID"
};
```

### 3. Regras do Firestore

No console Firebase → Firestore → Regras:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários: só lê/edita o próprio perfil
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tipo == 'admin';
    }

    // Pedidos: cliente cria, motorista lê disponíveis
    match /pedidos/{pedidoId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth != null;
    }

    // Avaliações
    match /avaliacoes/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Criar usuário admin manualmente

No Firestore, criar documento em `users/{seu-uid}`:
```json
{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "tipo": "admin",
  "ativo": true
}
```

---

## 📁 Estrutura

```
fretex/
├── index.html        ← Login / splash
├── cliente.html      ← App do cliente (Fase 2)
├── motorista.html    ← App do motorista (Fase 2)
├── admin.html        ← Painel admin (Fase 4)
├── css/
│   ├── global.css    ✅ Design system
│   ├── cliente.css
│   ├── motorista.css
│   └── admin.css
├── js/
│   ├── firebase.js   ✅ Config Firebase
│   ├── auth.js       ✅ Auth utils
│   ├── cliente.js
│   ├── motorista.js
│   └── admin.js
├── manifest.json     ✅ PWA
└── sw.js             ✅ Service Worker
```

---

## 🗃️ Modelo de dados Firestore

### `users/{uid}`
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "foto": "https://...",
  "tipo": "cliente | motorista | admin",
  "telefone": "13999999999",
  "criadoEm": "timestamp",
  "ativo": true
}
```

### `veiculos/{uid}` (motoristas)
```json
{
  "tipo": "Fiorino | Sprinter | Caminhão 3/4 | ...",
  "placa": "ABC1D23",
  "capacidade_kg": 600,
  "volume_m3": 4,
  "foto": "https://..."
}
```

### `pedidos/{id}`
```json
{
  "clienteId": "uid",
  "motoristaId": "uid | null",
  "origem": "Rua X, Santos",
  "destino": "Rua Y, Guarujá",
  "descricao": "Sofá, geladeira, 10 caixas",
  "fotos": ["url1", "url2"],
  "dataAgendada": "2025-08-15T09:00:00",
  "status": "aguardando | aceito | andamento | concluido | cancelado",
  "valor": 350.00,
  "criadoEm": "timestamp"
}
```

---

## 📦 Fases do MVP

- [x] **Fase 1** — Auth + estrutura base
- [ ] **Fase 2** — Criação e listagem de pedidos
- [ ] **Fase 3** — Fluxo aceite + orçamento
- [ ] **Fase 4** — Painel admin
- [ ] **Fase 5** — Notificações + PWA polish
