import React, { useState, useEffect } from 'react';
import {
  Edit3, Calendar, ShieldCheck, Palette, FileSpreadsheet, MessageSquare,
  Plus, Trash2, Download, Music, Landmark, Check, RefreshCw, Eye
} from 'lucide-react';
import { InvitationData, ColorTheme, FontOption, RSVPResponse, GuestbookSignature } from '../types';
import { THEMES, FONTS } from '../constants';

interface InvitationEditorProps {
  data: InvitationData;
  onChange: (newData: InvitationData) => void;
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function InvitationEditor({
  data,
  onChange,
  onReset,
  activeTab,
  setActiveTab
}: InvitationEditorProps) {
  // Local lists for RSVP and Guestbook moderation
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [signatures, setSignatures] = useState<GuestbookSignature[]>([]);

  // Predefined tracks
  const MUSIC_TRACKS = [
    { title: 'Love Story (Piano Solo)', url: 'https://assets.mixkit.co/music/preview/mixkit-love-story-piano-solo-830.mp3' },
    { title: 'Beautiful Wedding Bells', url: 'https://assets.mixkit.co/music/preview/mixkit-wedding-bells-474.mp3' },
    { title: 'Beautiful Dream', url: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3' },
    { title: 'Canon in D (Orchestral)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  ];

  // Load RSVP and Guestbook entries from localStorage
  const loadStoredData = () => {
    try {
      const storedRsvps = localStorage.getItem('wedding_rsvp_responses');
      if (storedRsvps) {
        setRsvps(JSON.parse(storedRsvps));
      } else {
        setRsvps([]);
      }

      const storedSigs = localStorage.getItem('wedding_guestbook_signatures');
      if (storedSigs) {
        setSignatures(JSON.parse(storedSigs));
      } else {
        setSignatures([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStoredData();
    window.addEventListener('storage', loadStoredData);
    return () => window.removeEventListener('storage', loadStoredData);
  }, []);

  const handleChange = (field: keyof InvitationData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const deleteRSVP = (id: string) => {
    try {
      const filtered = rsvps.filter(r => r.id !== id);
      localStorage.setItem('wedding_rsvp_responses', JSON.stringify(filtered));
      setRsvps(filtered);
      // Trigger update
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSignature = (id: string) => {
    try {
      const filtered = signatures.filter(s => s.id !== id);
      localStorage.setItem('wedding_guestbook_signatures', JSON.stringify(filtered));
      setSignatures(filtered);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  const exportRSVPs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Invitado,Asistencia,Adultos,Niños,Dietario,Mensaje,Fecha"].join(",") + "\n"
      + rsvps.map(r => [
          `"${r.guestName}"`,
          r.isAttending ? "Sí" : "No",
          r.adultCount,
          r.childCount,
          `"${r.dietaryRestrictions || ''}"`,
          `"${r.message || ''}"`,
          new Date(r.submittedAt).toLocaleDateString('es-ES')
        ].join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invitaciones_confirmadas_${data.brideName}_${data.groomName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-white border-l border-stone-200 flex flex-col shadow-xl">
      {/* HEADER */}
      <div className="p-6 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Palette className="text-[#c4a47c]" size={20} />
            Editor de Invitación
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">Diseña tu plantilla y sigue respuestas</p>
        </div>
        <button
          onClick={onReset}
          className="p-2 text-xs font-semibold text-stone-500 hover:text-[#8c251e] border border-stone-200 rounded-lg hover:bg-stone-100 flex items-center gap-1 transition"
          title="Restaurar a valores predeterminados"
        >
          <RefreshCw size={13} />
          <span>Restablecer</span>
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-stone-100 overflow-x-auto scrollbar-none bg-stone-50/50">
        {[
          { id: 'content', label: 'Contenido', icon: Edit3 },
          { id: 'details', label: 'Fecha / Lugar', icon: Calendar },
          { id: 'gift', label: 'Regalos', icon: Landmark },
          { id: 'design', label: 'Diseño', icon: Palette },
          { id: 'rsvp', label: 'Invitados', icon: FileSpreadsheet, badge: rsvps.length },
          { id: 'signatures', label: 'Firmas', icon: MessageSquare, badge: signatures.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[90px] py-3 px-2 border-b-2 text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition ${
                isActive
                  ? 'border-[#c4a47c] text-stone-800 bg-white shadow-sm'
                  : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'
              }`}
            >
              <div className="relative">
                <Icon size={16} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORM CONTENTS */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        {/* TAB 1: CONTENIDO */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">DATOS PRINCIPALES</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Nombre Novia</label>
                <input
                  type="text"
                  value={data.brideName}
                  onChange={(e) => handleChange('brideName', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] px-3 py-2 rounded-lg outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Nombre Novio</label>
                <input
                  type="text"
                  value={data.groomName}
                  onChange={(e) => handleChange('groomName', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] px-3 py-2 rounded-lg outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Frase del Encabezado (Ej: Cover)</label>
              <input
                type="text"
                value={data.phrase}
                onChange={(e) => handleChange('phrase', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Mensaje de Bienvenida (Welcome Text)</label>
              <textarea
                rows={4}
                value={data.welcomeText}
                onChange={(e) => handleChange('welcomeText', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">FAMILIARES (TRADICIONAL)</h3>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Padres de la Novia</label>
              <input
                type="text"
                value={data.brideParents}
                placeholder="Ej: Sofía Valenzuela & Roberto García"
                onChange={(e) => handleChange('brideParents', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Padres del Novio</label>
              <input
                type="text"
                value={data.groomParents}
                placeholder="Ej: Victoria Henderson & John Smith"
                onChange={(e) => handleChange('groomParents', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Padrinos de Honor</label>
              <input
                type="text"
                value={data.godparents}
                placeholder="Ej: Isabel Ortega & Fernando Sánchez"
                onChange={(e) => handleChange('godparents', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: FECHA Y LUGAR */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">CEREMONIA</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Fecha</label>
                <input
                  type="date"
                  value={data.ceremonyDate}
                  onChange={(e) => handleChange('ceremonyDate', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Hora</label>
                <input
                  type="text"
                  value={data.ceremonyTime}
                  onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Lugar de Ceremonia</label>
              <input
                type="text"
                value={data.ceremonyName}
                onChange={(e) => handleChange('ceremonyName', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Dirección de Ceremonia</label>
              <input
                type="text"
                value={data.ceremonyAddress}
                onChange={(e) => handleChange('ceremonyAddress', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Enlace de Google Maps Ceremonia</label>
              <input
                type="text"
                value={data.ceremonyMapUrl}
                onChange={(e) => handleChange('ceremonyMapUrl', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">RECEPCIÓN</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Fecha Recepción</label>
                <input
                  type="date"
                  value={data.receptionDate}
                  onChange={(e) => handleChange('receptionDate', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Hora Recepción</label>
                <input
                  type="text"
                  value={data.receptionTime}
                  onChange={(e) => handleChange('receptionTime', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Lugar de Recepción</label>
              <input
                type="text"
                value={data.receptionName}
                onChange={(e) => handleChange('receptionName', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Dirección de Recepción</label>
              <input
                type="text"
                value={data.receptionAddress}
                onChange={(e) => handleChange('receptionAddress', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Enlace de Google Maps Recepción</label>
              <input
                type="text"
                value={data.receptionMapUrl}
                onChange={(e) => handleChange('receptionMapUrl', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* TAB 3: REGALOS Y VESTIMENTA */}
        {activeTab === 'gift' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">CÓDIGO DE VESTIMENTA</h3>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Tipo de Attire / Código</label>
              <select
                value={data.dressCodeType}
                onChange={(e) => handleChange('dressCodeType', e.target.value)}
                className="w-full text-xs border border-stone-200 px-3 py-2 rounded-lg outline-none"
              >
                <option value="formal">Formal de Gala (Traje / Vestido largo)</option>
                <option value="formal_guayabera">Formal Guayabera</option>
                <option value="cocktail">Cocktail</option>
                <option value="casual">Semicasual / Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Consejo / Indicaciones Adicionales</label>
              <input
                type="text"
                value={data.dressCodeText}
                onChange={(e) => handleChange('dressCodeText', e.target.value)}
                className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">DATOS TRANSFERENCIA (EFECTIVO)</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Nombre del Banco</label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Titular Cuenta</label>
                <input
                  type="text"
                  value={data.bankAccountOwner}
                  onChange={(e) => handleChange('bankAccountOwner', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Número de Cuenta</label>
                <input
                  type="text"
                  value={data.bankAccountNumber}
                  onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">CLABE Interbancaria</label>
                <input
                  type="text"
                  value={data.clabe}
                  onChange={(e) => handleChange('clabe', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">MESAS DE REGALOS (ONLINE)</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Id Amazon Wishlist</label>
                <input
                  type="text"
                  value={data.giftRegistryAmazon}
                  onChange={(e) => handleChange('giftRegistryAmazon', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Id Liverpool</label>
                <input
                  type="text"
                  value={data.giftRegistryLiverpool}
                  onChange={(e) => handleChange('giftRegistryLiverpool', e.target.value)}
                  className="w-full text-xs border border-stone-200 focus:border-[#c4a47c] px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-stone-600 uppercase mb-1">Mensaje Explicativo Mesa</label>
              <input
                type="text"
                value={data.giftTableText}
                onChange={(e) => handleChange('giftTableText', e.target.value)}
                className="w-full text-xs border border-stone-200 px-3 py-2 rounded-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 4: TEMAS Y DISEÑO */}
        {activeTab === 'design' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">PALETA DE COLORES (ESTILO)</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleChange('selectedThemeId', theme.id)}
                  className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    data.selectedThemeId === theme.id
                      ? 'border-[#c4a47c] bg-stone-50 shadow-sm'
                      : 'border-stone-150 hover:bg-stone-50/50'
                  }`}
                >
                  <div>
                    <strong className="text-xs text-stone-800 block">{theme.name}</strong>
                    <span className="text-[10px] text-stone-400">Arreglos florales estilo: {theme.floralStyle}</span>
                  </div>
                  
                  {/* Colors Preview dots */}
                  <div className="flex gap-1.5 items-center">
                    <span className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: theme.primary }} />
                    <span className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: theme.secondary }} />
                    <span className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: theme.accent }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">EMPAREJAMIENTO TIPOGRÁFICO</h3>

            <div className="grid grid-cols-1 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleChange('selectedFontId', font.id)}
                  className={`p-3 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    data.selectedFontId === font.id
                      ? 'border-[#c4a47c] bg-stone-50 shadow-sm'
                      : 'border-stone-150 hover:bg-stone-50/50'
                  }`}
                >
                  <div>
                    <strong className="text-xs text-stone-800 block">{font.name}</strong>
                    <div className="flex gap-2 items-center mt-1">
                      <span className={`text-base ${font.headingClass}`}>Anna & Richard</span>
                      <span className="text-stone-300">|</span>
                      <span className={`text-[10px] text-stone-500 ${font.bodyClass}`}>Inter / Montserrat</span>
                    </div>
                  </div>
                  {data.selectedFontId === font.id && (
                    <Check className="text-amber-600" size={16} />
                  )}
                </button>
              ))}
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">MÚSICA DE FONDO (AUTO-PLAY)</h3>

            <div className="space-y-2">
              {MUSIC_TRACKS.map((track, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleChange('musicUrl', track.url);
                    handleChange('musicTitle', track.title);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                    data.musicUrl === track.url
                      ? 'border-[#c4a47c] bg-[#faf6f0] text-stone-800 font-semibold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Music size={14} className={data.musicUrl === track.url ? "text-amber-600 animate-pulse" : "text-stone-400"} />
                    {track.title}
                  </span>
                  {data.musicUrl === track.url && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded uppercase">ACTIVA</span>
                  )}
                </button>
              ))}
            </div>

            <div className="w-full h-[1px] bg-stone-100 my-4" />

            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">HABILITAR / DESHABILITAR SECCIONES</h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { field: 'showCountdown', label: 'Cuenta Atrás' },
                { field: 'showWelcome', label: 'Unión y Padres' },
                { field: 'showCeremony', label: 'Ceremonia religiosa' },
                { field: 'showReception', label: 'Banquete / Recepción' },
                { field: 'showDressCode', label: 'Código Vestimenta' },
                { field: 'showGiftTable', label: 'Mesa de Regalos' },
                { field: 'showGallery', label: 'Galería Fotos' },
                { field: 'showRSVP', label: 'Formulario RSVP' },
                { field: 'showGuestbook', label: 'Libro de Firmas' }
              ].map((sec) => (
                <label
                  key={sec.field}
                  className="flex items-center gap-2 py-2 px-3 border border-stone-150 rounded-lg hover:bg-stone-50 cursor-pointer text-xs font-medium text-stone-600 transition"
                >
                  <input
                    type="checkbox"
                    checked={!!(data as any)[sec.field]}
                    onChange={(e) => handleChange(sec.field as any, e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  {sec.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RESPUESTAS (RSVP) */}
        {activeTab === 'rsvp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">CONFIRMACIONES ({rsvps.length})</h3>
              {rsvps.length > 0 && (
                <button
                  onClick={exportRSVPs}
                  className="text-xs font-semibold text-green-700 hover:bg-green-50 px-2.5 py-1 rounded-md border border-green-200 flex items-center gap-1.5 transition"
                >
                  <Download size={13} />
                  <span>Exportar CSV</span>
                </button>
              )}
            </div>

            {rsvps.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <FileSpreadsheet className="mx-auto text-stone-300 mb-2" size={32} />
                <p className="text-xs text-stone-500 font-semibold">Sin respuestas todavía</p>
                <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto mt-1">
                  Usa el formulario RSVP de la invitación para realizar pruebas y verás las confirmaciones en tiempo real aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="p-4 bg-stone-50 border border-stone-150 rounded-xl space-y-2 relative shadow-xs">
                    <button
                      onClick={() => deleteRSVP(rsvp.id)}
                      className="absolute top-3 right-3 text-stone-300 hover:text-red-600 transition p-1"
                      title="Eliminar registro"
                    >
                      <Trash2 size={13} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-stone-800 font-bold tracking-tight block max-w-[180px] truncate">
                        {rsvp.guestName}
                      </strong>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        rsvp.isAttending
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.isAttending ? 'Asistirá' : 'No asistirá'}
                      </span>
                    </div>

                    {rsvp.isAttending && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-500 border-t border-stone-200/50 pt-1.5">
                        <span className="font-semibold text-stone-700">Pases: {rsvp.adultCount} adultos</span>
                        {rsvp.childCount > 0 && <span>Niños: {rsvp.childCount}</span>}
                        {rsvp.dietaryRestrictions && (
                          <span className="col-span-2 text-amber-800 italic bg-amber-50 px-1.5 py-0.5 rounded truncate mt-1">
                            Alergia: {rsvp.dietaryRestrictions}
                          </span>
                        )}
                      </div>
                    )}

                    {rsvp.message && (
                      <p className="text-xs text-stone-600 bg-white p-2 border border-stone-100 rounded-md font-serif italic">
                        "{rsvp.message}"
                      </p>
                    )}

                    <div className="text-[9px] text-stone-400 text-right pt-1">
                      Enviado: {new Date(rsvp.submittedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LIBRO DE FIRMAS MODERACION */}
        {activeTab === 'signatures' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">MODERAR FIRMAS ({signatures.length})</h3>
            
            {signatures.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                <MessageSquare className="mx-auto text-stone-300 mb-2" size={32} />
                <p className="text-xs text-stone-500 font-semibold">Sin firmas registradas</p>
                <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto mt-1">
                  Los mensajes enviados en el Libro de Firmas por tus invitados se listarán aquí para que los puedas administrar.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {signatures.map((sig) => (
                  <div key={sig.id} className="p-4 bg-stone-50 border border-stone-150 rounded-xl relative shadow-xs">
                    <button
                      onClick={() => deleteSignature(sig.id)}
                      className="absolute top-3 right-3 text-stone-300 hover:text-red-600 transition p-1"
                      title="Borrar firma"
                    >
                      <Trash2 size={13} />
                    </button>
                    
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs text-stone-800 font-bold font-wedding-heading truncate pr-4">
                        {sig.guestName}
                      </strong>
                      <span className="text-[9px] text-stone-400">
                        {new Date(sig.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 bg-white p-2.5 border border-stone-100 rounded-md font-serif italic leading-relaxed">
                      "{sig.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
