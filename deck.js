const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const VALUE_RANKS = { A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13 };

function createDeck(count = 1) {
  const deck = [];
  for (let d = 0; d < count; d++) {
    for (const suit of SUITS) {
      for (const value of VALUES) {
        deck.push({
          suit,
          value,
          rank: VALUE_RANKS[value],
          color: suit === '♥' || suit === '♦' ? 'red' : 'black',
          id: `${value}${suit}_${d}`
        });
      }
    }
  }
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cardHTML(card, extra = '') {
  if (!card) {
    return `<div class="card face-down ${extra}"><div class="card-back"></div></div>`;
  }
  return `
    <div class="card ${card.color} ${extra}">
      <div class="card-corner tl">
        <div class="cv">${card.value}</div>
        <div class="cs">${card.suit}</div>
      </div>
      <div class="card-mid">${card.suit}</div>
      <div class="card-corner br">
        <div class="cv">${card.value}</div>
        <div class="cs">${card.suit}</div>
      </div>
    </div>`;
}

function rankLabel(rank) {
  const map = { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
  return map[rank] || String(rank);
}

// ─── Shared setup-panel helpers (used by every game) ───
function cleanName(s) {
  return s.replace(/[<>]/g, '').trim();
}

function addPlayerRow() {
  const list = document.getElementById('player-list');
  const max  = window.MAX_PLAYERS || 12;
  if (list.children.length >= max) {
    alert(`Maximum ${max} players for this game.`);
    return;
  }
  const n = list.children.length + 1;
  const row = document.createElement('div');
  row.className = 'player-row';
  row.innerHTML = `<input class="form-input" placeholder="Player ${n}" value="Player ${n}"/><button class="btn btn-ghost btn-sm" onclick="removePlayer(this)">✕</button>`;
  list.appendChild(row);
}

function removePlayer(btn) {
  if (document.getElementById('player-list').children.length <= 2) return;
  btn.closest('.player-row').remove();
}

function toggleRules(btn) {
  btn.classList.toggle('open');
  document.getElementById('rules-body').classList.toggle('open');
}

function readPlayerNames() {
  const inputs = document.querySelectorAll('#player-list .form-input');
  return Array.from(inputs).map((el, i) => cleanName(el.value) || `Player ${i + 1}`);
}

// ─── Roster persistence (shared across games via localStorage) ───
const ROSTER_KEY = 'cardgames-roster';

function saveRoster(names) {
  try { localStorage.setItem(ROSTER_KEY, JSON.stringify(names)); } catch (e) {}
}

function restoreRoster() {
  let names;
  try { names = JSON.parse(localStorage.getItem(ROSTER_KEY)); } catch (e) { return; }
  if (!Array.isArray(names) || names.length < 2) return;
  const list = document.getElementById('player-list');
  if (!list) return;
  const max = window.MAX_PLAYERS || 12;
  list.innerHTML = names.slice(0, max).map((nm, i) =>
    `<div class="player-row"><input class="form-input" placeholder="Player ${i + 1}" value="${cleanName(nm)}"/><button class="btn btn-ghost btn-sm" onclick="removePlayer(this)">✕</button></div>`
  ).join('');
}
