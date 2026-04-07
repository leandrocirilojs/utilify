// ============================================
// FRETEX — auth.js
// Utilitários de autenticação compartilhados
// ============================================

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * Protege uma página: redireciona para index se não logado.
 * Retorna { user, userData } se autenticado e perfil correto.
 * @param {string} tipoEsperado - 'cliente' | 'motorista' | 'admin'
 */
export async function protegerPagina(tipoEsperado) {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'index.html';
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists()) {
          window.location.href = 'index.html';
          return;
        }

        const userData = snap.data();

        // Admin pode acessar tudo
        if (userData.tipo !== tipoEsperado && userData.tipo !== 'admin') {
          // Redirecionar para a página correta
          const rotas = {
            cliente:   'cliente.html',
            motorista: 'motorista.html',
            admin:     'admin.html'
          };
          window.location.href = rotas[userData.tipo] || 'index.html';
          return;
        }

        resolve({ user, userData });
      } catch (err) {
        console.error('Erro ao verificar perfil:', err);
        window.location.href = 'index.html';
      }
    });
  });
}

/**
 * Faz logout e redireciona para index
 */
export async function fazerLogout() {
  const auth = getAuth();
  await signOut(auth);
  window.location.href = 'index.html';
}

/**
 * Renderiza o header do app com info do usuário
 * @param {object} userData - dados do Firestore
 * @param {object} user - Firebase Auth user
 */
export function renderizarHeader(userData, user) {
  const header = document.getElementById('appHeader');
  if (!header) return;

  header.innerHTML = `
    <div class="logo">FRETE<span>X</span></div>
    <div class="user-pill" onclick="window._fazerLogout()">
      <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.nome) + '&background=F59E0B&color=111'}" 
           alt="${userData.nome}" />
      <span>${userData.nome.split(' ')[0]}</span>
    </div>
  `;

  window._fazerLogout = fazerLogout;
}

/**
 * Sistema de toast notifications
 */
export function showToast(msg, tipo = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `<span>${icons[tipo] || ''}</span> ${msg}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse both';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Formata data para exibição
 */
export function formatarData(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Labels e cores dos status
 */
export const STATUS = {
  aguardando: { label: 'Aguardando', badge: 'badge-aguardando', emoji: '⏳' },
  aceito:     { label: 'Aceito',     badge: 'badge-aceito',     emoji: '✅' },
  andamento:  { label: 'Em andamento', badge: 'badge-andamento', emoji: '🚛' },
  concluido:  { label: 'Concluído',  badge: 'badge-concluido',  emoji: '🏁' },
  cancelado:  { label: 'Cancelado',  badge: 'badge-cancelado',  emoji: '❌' }
};
