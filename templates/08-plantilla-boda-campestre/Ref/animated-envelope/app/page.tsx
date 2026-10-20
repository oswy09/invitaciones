'use client'

import { useState } from 'react'

export default function Page() {
  const [open, setOpen] = useState(false)

  return (
    <main className="invitation-page">
      <section className={`invitation ${open ? 'invitation--open' : ''}`} aria-label="Invitación de boda">
        <div className="invitation-note" aria-hidden="true">
          <span className="note-leaf">♥</span>
          <span>Tenemos una invitación</span>
        </div>

        <button
          className="invitation-envelope"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar invitación' : 'Abrir invitación'}
        >
          <span className="invitation-letter">
            <span className="letter-monogram">M<span>&amp;</span>J</span>
            <span className="letter-copy">Con alegría queremos compartir<br />este momento contigo</span>
          </span>
          <span className="envelope-base" aria-hidden="true" />
          <span className="envelope-fold envelope-fold-left" aria-hidden="true" />
          <span className="envelope-fold envelope-fold-right" aria-hidden="true" />
          <span className="envelope-flap" aria-hidden="true" />
          <span className="wax-seal" aria-hidden="true">M<span>&amp;</span>J</span>
        </button>

        <p className="invitation-for">PARA</p>
        <h1>Diana <span>&amp;</span> Camilo</h1>
        <button className="open-hint" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Cerrar invitación' : 'Toca para abrir'}>
          <span aria-hidden="true">✉</span> {open ? 'TOCA PARA CERRAR' : 'TOCA PARA ABRIR'}
        </button>
      </section>

      <style jsx global>{`
        .invitation-page { min-height: 100svh; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#f1eee5; color:#332b25; }
        .invitation { width:min(100%, 31rem); display:flex; flex-direction:column; align-items:center; padding:3.5rem 1.25rem 4rem; text-align:center; background:radial-gradient(ellipse at center, #f7f4ec 0%, #eeeae0 100%); position:relative; }
        .invitation::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:.22; background-image:radial-gradient(#9f957f .45px, transparent .6px); background-size:4px 4px; mix-blend-mode:multiply; }
        .invitation > * { position:relative; z-index:1; }
        .invitation-note { display:flex; flex-direction:column; align-items:center; justify-content:center; width:10.4rem; height:3.6rem; margin-bottom:1.45rem; border:1px solid #bba786; border-radius:.22rem; color:#493e35; background:#f3eee2; box-shadow:0 2px 8px #8c785022; font-family:var(--font-serif), Georgia, serif; font-size:1.15rem; font-style:italic; line-height:1; }
        .note-leaf { display:block; color:#9aac88; font-family:Georgia, serif; font-size:1.35rem; line-height:.6; transform:rotate(-25deg); margin-bottom:.3rem; }
        .invitation-note::after { content:""; position:absolute; top:7.05rem; width:0; height:0; border-left:.42rem solid transparent; border-right:.42rem solid transparent; border-top:.82rem solid #bba786; }
        .invitation-note::before { content:""; position:absolute; top:7.05rem; width:0; height:0; border-left:.34rem solid transparent; border-right:.34rem solid transparent; border-top:.67rem solid #f3eee2; z-index:2; }
        .invitation-envelope { position:relative; width:min(86vw, 20.5rem); height:13.5rem; margin-bottom:1.55rem; border:0; background:transparent; cursor:pointer; filter:drop-shadow(0 1.4rem 1.25rem #83775a35); perspective:900px; }
        .envelope-base, .envelope-fold, .envelope-flap { position:absolute; inset:0; display:block; border:1px solid #c7b791; border-radius:.12rem; }
        .envelope-base { z-index:1; background:#e9dfc5; }
        .envelope-fold-left, .envelope-fold-right { z-index:4; top:auto; height:100%; border:0; clip-path:polygon(0 0, 50% 50%, 0 100%); background:#eee5cd; }
        .envelope-fold-right { transform:scaleX(-1); }
        .envelope-flap { z-index:5; height:70%; border:0; clip-path:polygon(0 0, 100% 0, 50% 73%); background:#e8dec4; transform-origin:top; transition:transform .8s cubic-bezier(.2,.75,.25,1), z-index 0s .35s; }
        .invitation-letter { position:absolute; z-index:2; left:7%; top:3%; width:86%; height:93%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.4rem; border:1px solid #d2c3a4; background:#faf7ee; color:#75664d; opacity:0; visibility:hidden; transform:translateY(82%); transition:opacity .2s, transform .8s cubic-bezier(.2,.75,.25,1), visibility 0s .8s; font-family:var(--font-serif), Georgia, serif; }
        .letter-monogram { font-size:2rem; font-style:italic; color:#ab9972; }
        .letter-monogram span, .wax-seal span { font-size:.7em; }
        .letter-copy { font-size:.85rem; line-height:1.3; }
        .wax-seal { position:absolute; z-index:7; left:50%; top:51%; display:grid; place-items:center; width:3.1rem; height:3.1rem; border:3px solid #b8c39f; border-radius:50%; color:#e9eedc; background:#718d66; box-shadow:inset 0 0 0 2px #86a47b, 0 4px 10px #52644c66; transform:translate(-50%,-50%); font-family:var(--font-serif), Georgia, serif; font-size:.82rem; transition:opacity .25s, transform .4s; }
        .invitation--open .envelope-flap { z-index:0; transform:rotateX(180deg); }
        .invitation--open .invitation-letter { opacity:1; visibility:visible; transform:translateY(-47%); transition:opacity .25s .1s, transform .8s cubic-bezier(.2,.75,.25,1), visibility 0s; }
        .invitation--open .wax-seal { opacity:0; transform:translate(-50%,-50%) scale(.7); }
        .invitation-for { margin:0 0 .1rem; color:#9b8b73; font-family:var(--font-sans), sans-serif; font-size:.62rem; letter-spacing:.36em; }
        .invitation h1 { margin:0; color:#332b25; font-family:var(--font-serif), Georgia, serif; font-size:2.25rem; font-weight:500; font-style:italic; line-height:1; }
        .invitation h1 span { font-size:.7em; }
        .open-hint { margin-top:1rem; border:0; color:#afa38e; background:transparent; cursor:pointer; font-family:var(--font-sans), sans-serif; font-size:.62rem; letter-spacing:.22em; }
        .open-hint span { margin-right:.35rem; font-size:.75rem; }
        @media (min-width: 700px) { .invitation-page { padding:2rem; } .invitation { min-height:48rem; justify-content:center; } }
        @media (prefers-reduced-motion: reduce) { .envelope-flap, .invitation-letter, .wax-seal { transition-duration:.01ms; } }
      `}</style>
    </main>
  )
}
