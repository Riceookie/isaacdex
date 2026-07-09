import Sprite from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'

export const metadata = { title: 'Czat — IsaacDex' }

// DEMO: statyczny czat w klimacie Isaaca (jak IsaacHub). Brak backendu — dane mock.
const KANALY = {
  info: ['welcome', 'announcements', 'rules'],
  czat: ['basement-chat', 'item-discussion', 'run-showcase', 'memes', 'music-bot'],
  runs: ['looking-for-group', 'daily-challenge'],
  voice: ['Basement I', 'Basement II'],
}

type Wiad = {
  autor: string
  postac: string
  czas: string
  kolor?: string
  tekst: string[]
  bot?: boolean
}

const WIADOMOSCI: Wiad[] = [
  {
    autor: 'VoidKing',
    postac: 'Azazel',
    czas: 'Dziś o 14:32',
    kolor: '#8a6fd6',
    tekst: ['właśnie miałem najbardziej połamany run w życiu', 'brimstone + tech x + ipecac...'],
  },
  { autor: 'Ananas', postac: 'Isaac', czas: 'Dziś o 14:33', kolor: '#c98a4e', tekst: ['seed?'] },
  {
    autor: 'BasementDweller',
    postac: 'Isaac',
    czas: 'Dziś o 14:33',
    kolor: '#a5342c',
    tekst: ['KJ4D 82LS', 'baw się dobrze'],
  },
  {
    autor: 'Lilith',
    postac: 'Lilith',
    czas: 'Dziś o 14:34',
    kolor: '#8a6fd6',
    tekst: ['damn, na tym seedzie też miałam sacred heart', 'gra wie czego chcemy ❤'],
  },
  {
    autor: 'TheLostEnjoyer',
    postac: 'The Lost',
    czas: 'Dziś o 14:35',
    tekst: ['przeciętny lost run'],
  },
  {
    autor: 'Bot Fly',
    postac: 'Azazel',
    czas: 'Dziś o 14:35',
    bot: true,
    tekst: ['Nowy run showcase wrzucony w #run-showcase!'],
  },
  {
    autor: 'TaintedLostMain',
    postac: 'The Lost',
    czas: 'Dziś o 14:36',
    tekst: ['we ball'],
  },
]

const ONLINE: { nick: string; postac: string; status: string; kolor?: string }[] = [
  { nick: 'BasementDweller', postac: 'Isaac', status: 'Gra jako Tainted Lost', kolor: '#a5342c' },
  { nick: 'VoidKing', postac: 'Azazel', status: 'Gra jako Tainted Isaac', kolor: '#8a6fd6' },
  { nick: 'Ananas', postac: 'Isaac', status: 'W trakcie runu', kolor: '#c98a4e' },
  { nick: 'Lilith', postac: 'Lilith', status: 'Przegląda itemy', kolor: '#8a6fd6' },
  { nick: 'TaintedLostMain', postac: 'The Lost', status: 'Gra jako The Lost', kolor: '#7fa6c9' },
  { nick: 'TheLostEnjoyer', postac: 'The Lost', status: 'chilluje' },
  { nick: 'Jorge', postac: 'Samson', status: 'Idle', kolor: '#c98a4e' },
  { nick: 'GreedEnjoyer', postac: 'Keeper', status: 'Idle', kolor: '#e0b64c' },
]

export default function CzatPage() {
  const aktywny = 'basement-chat'
  return (
    <section className="chat">
      <div className="chat-grid">
        {/* Kolumna serwerów / kanałów */}
        <aside className="chat-channels note">
          <div className="chan-server">
            <img src={ikonaPostaci('Isaac')} alt="" />
            <span>IsaacDex</span>
            <span className="chan-caret">▾</span>
          </div>

          <div className="chan-group">Info</div>
          {KANALY.info.map((k) => (
            <div key={k} className="chan">
              <span className="hash">#</span>
              {k}
            </div>
          ))}

          <div className="chan-group">Czat</div>
          {KANALY.czat.map((k) => (
            <div key={k} className={'chan' + (k === aktywny ? ' active' : '')}>
              <span className="hash">#</span>
              {k}
            </div>
          ))}

          <div className="chan-group">Runs</div>
          {KANALY.runs.map((k) => (
            <div key={k} className="chan">
              <span className="hash">#</span>
              {k}
            </div>
          ))}

          <div className="chan-group">Voice</div>
          {KANALY.voice.map((k) => (
            <div key={k} className="chan voice">
              <svg
                className="chan-voice-ic"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinecap="round" />
                <path d="M17 8a5 5 0 010 8" strokeLinecap="round" />
              </svg>
              {k}
            </div>
          ))}

          <div className="chan-group">Wiadomości prywatne</div>
          {['VoidKing', 'Ananas', 'Lilith', 'TaintedLostMain'].map((n) => (
            <div key={n} className="chan dm">
              <img
                src={ikonaPostaci(
                  n === 'VoidKing'
                    ? 'Azazel'
                    : n === 'TaintedLostMain'
                      ? 'The Lost'
                      : n === 'Ananas'
                        ? 'Isaac'
                        : n,
                )}
                alt=""
              />
              {n}
            </div>
          ))}
        </aside>

        {/* Główna kolumna wiadomości */}
        <div className="chat-main note">
          <header className="chat-head">
            <div className="chat-head-title">
              <span className="hash">#</span> {aktywny}
            </div>
            <p className="chat-head-sub">Ogólny czat dla wszystkich fanów Isaaca.</p>
          </header>

          <div className="chat-msgs">
            {WIADOMOSCI.map((w, i) => (
              <div className="msg" key={i}>
                <img className="msg-av" src={ikonaPostaci(w.postac)} alt="" />
                <div className="msg-body">
                  <div className="msg-top">
                    <span className="msg-author" style={{ color: w.kolor }}>
                      {w.autor}
                    </span>
                    {w.bot && <span className="msg-bot">BOT</span>}
                    <span className="msg-time">{w.czas}</span>
                  </div>
                  {w.tekst.map((t, j) => (
                    <p className="msg-line" key={j}>
                      {w.bot && j === 0 && <Sprite name="trophy" size={16} />} {t}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <span className="ci-plus">+</span>
            <input className="ci-field" placeholder={`Napisz na #${aktywny}`} readOnly />
            <span className="ci-gif">GIF</span>
            <Sprite name="coin" size={18} />
            <Sprite name="heart" size={18} />
          </div>
        </div>

        {/* Panel informacji + online */}
        <aside className="chat-side">
          <div className="note chat-info">
            <h3>
              <span className="hash">#</span> {aktywny}
            </h3>
            <p className="muted small">
              Ogólny czat dla wszystkich fanów Isaaca. Bądź miły i nie płacz o skill issue.
            </p>
            <div className="info-stats">
              <span>
                <Sprite name="friends" size={16} /> 1 263 <em>członków</em>
              </span>
              <span>
                <Sprite name="heart" size={16} /> 8 <em>online</em>
              </span>
            </div>
          </div>

          <div className="note chat-online">
            <h3>
              <Sprite name="friendfinder" size={18} /> Online — {ONLINE.length}
            </h3>
            <ul className="online-list">
              {ONLINE.map((o) => (
                <li key={o.nick}>
                  <img src={ikonaPostaci(o.postac)} alt="" />
                  <span className="on-body">
                    <span className="on-nick" style={{ color: o.kolor }}>
                      {o.nick}
                    </span>
                    <span className="on-status">{o.status}</span>
                  </span>
                  <span className="on-dot" />
                </li>
              ))}
            </ul>
            <div className="online-offline muted small">
              <span>Offline — 1 255</span>
              <span className="chan-caret">Pokaż ▾</span>
            </div>
          </div>

          <div className="note chat-typing">
            <span className="typing-avs">
              <img src={ikonaPostaci('Isaac')} alt="" />
              <img src={ikonaPostaci('Azazel')} alt="" />
            </span>
            <span className="muted small">
              <b>Ananas</b>, <b>VoidKing</b> piszą<span className="typing-dots">…</span>
            </span>
          </div>
        </aside>
      </div>
    </section>
  )
}
