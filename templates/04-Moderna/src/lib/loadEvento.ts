import { supabase } from "./supabase";
import { InvitationData } from "../types";
import { DEFAULT_INVITATION } from "../constants";

export interface EventoResult {
  data: InvitationData;
  pagado: boolean;
  aprobado: boolean;
  notFound: boolean;
}

function getEventoIdFromUrl(): string {
  const path = window.location.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (path) return decodeURIComponent(path.split("/")[0]);
  const params = new URLSearchParams(window.location.search);
  return params.get("evento") ?? "boda-demo";
}

export { fromCoreData };

// Maps the core InvitationData schema (stored in Supabase) to the wedding InvitationData shape.
// Core fields: nombresPrincipales[], fecha, hora, lugar{nombre,direccion,mapUrl},
//              mensajePersonalizado, extra{} (wedding-specific extras go here)
function fromCoreData(core: Record<string, unknown>): InvitationData {
  const extra = (core.extra ?? {}) as Record<string, unknown>;
  const lugar = (core.lugar ?? {}) as Record<string, unknown>;
  const nombres = (core.nombresPrincipales as string[]) ?? [];

  return {
    ...DEFAULT_INVITATION,
    id: (core.id as string) ?? DEFAULT_INVITATION.id,
    brideName: nombres[0] ?? DEFAULT_INVITATION.brideName,
    groomName: (extra.groomName as string) ?? nombres[1] ?? DEFAULT_INVITATION.groomName,
    phrase: (core.mensajePersonalizado as string) || DEFAULT_INVITATION.phrase,
    welcomeText: (extra.welcomeText as string) || DEFAULT_INVITATION.welcomeText,

    // Ceremony
    ceremonyName: (lugar.nombre as string) || DEFAULT_INVITATION.ceremonyName,
    ceremonyDate: (core.fecha as string) || DEFAULT_INVITATION.ceremonyDate,
    ceremonyTime: (core.hora as string) || DEFAULT_INVITATION.ceremonyTime,
    ceremonyAddress: (lugar.direccion as string) || DEFAULT_INVITATION.ceremonyAddress,
    ceremonyMapUrl: (lugar.mapUrl as string) || DEFAULT_INVITATION.ceremonyMapUrl,

    // Reception (all extra)
    receptionName: (extra.receptionName as string) || DEFAULT_INVITATION.receptionName,
    receptionDate: (extra.receptionDate as string) || DEFAULT_INVITATION.receptionDate,
    receptionTime: (extra.receptionTime as string) || DEFAULT_INVITATION.receptionTime,
    receptionAddress: (extra.receptionAddress as string) || DEFAULT_INVITATION.receptionAddress,
    receptionMapUrl: (extra.receptionMapUrl as string) || DEFAULT_INVITATION.receptionMapUrl,

    // Dress code
    dressCodeType: (extra.dressCodeType as InvitationData["dressCodeType"]) ?? DEFAULT_INVITATION.dressCodeType,
    dressCodeText: (extra.dressCodeText as string) || DEFAULT_INVITATION.dressCodeText,

    // Gift table
    giftTableText: (extra.giftTableText as string) || DEFAULT_INVITATION.giftTableText,
    giftRegistryAmazon: (extra.giftRegistryAmazon as string) || DEFAULT_INVITATION.giftRegistryAmazon,
    giftRegistryLiverpool: (extra.giftRegistryLiverpool as string) || DEFAULT_INVITATION.giftRegistryLiverpool,
    bankAccountOwner: (extra.bankAccountOwner as string) || DEFAULT_INVITATION.bankAccountOwner,
    bankAccountNumber: (extra.bankAccountNumber as string) || DEFAULT_INVITATION.bankAccountNumber,
    bankName: (extra.bankName as string) || DEFAULT_INVITATION.bankName,
    clabe: (extra.clabe as string) || DEFAULT_INVITATION.clabe,

    // UI & audio
    musicUrl: (extra.musicUrl as string) || DEFAULT_INVITATION.musicUrl,
    musicTitle: (extra.musicTitle as string) || DEFAULT_INVITATION.musicTitle,
    selectedThemeId: (extra.selectedThemeId as string) || DEFAULT_INVITATION.selectedThemeId,
    selectedFontId: (extra.selectedFontId as string) || DEFAULT_INVITATION.selectedFontId,
    illustrationType: (extra.illustrationType as InvitationData["illustrationType"]) ?? DEFAULT_INVITATION.illustrationType,

    // Parents
    brideParents: (extra.brideParents as string) || DEFAULT_INVITATION.brideParents,
    groomParents: (extra.groomParents as string) || DEFAULT_INVITATION.groomParents,
    godparents: (extra.godparents as string) || DEFAULT_INVITATION.godparents,

    // Section toggles
    showCountdown: (extra.showCountdown as boolean) ?? DEFAULT_INVITATION.showCountdown,
    showWelcome: (extra.showWelcome as boolean) ?? DEFAULT_INVITATION.showWelcome,
    showCeremony: (extra.showCeremony as boolean) ?? DEFAULT_INVITATION.showCeremony,
    showReception: (extra.showReception as boolean) ?? DEFAULT_INVITATION.showReception,
    showDressCode: (extra.showDressCode as boolean) ?? DEFAULT_INVITATION.showDressCode,
    showGiftTable: (extra.showGiftTable as boolean) ?? DEFAULT_INVITATION.showGiftTable,
    showGallery: (extra.showGallery as boolean) ?? DEFAULT_INVITATION.showGallery,
    showRSVP: (extra.showRSVP as boolean) ?? DEFAULT_INVITATION.showRSVP,
    showGuestbook: (extra.showGuestbook as boolean) ?? DEFAULT_INVITATION.showGuestbook,
  };
}

export async function loadEvento(): Promise<EventoResult> {
  const eventoId = getEventoIdFromUrl();

  const { data, error } = await supabase
    .from("eventos")
    .select("datos, pagado, aprobado")
    .eq("id", eventoId)
    .single();

  if (error || !data) {
    return { data: DEFAULT_INVITATION, pagado: true, aprobado: true, notFound: true };
  }

  return {
    data: fromCoreData(data.datos as Record<string, unknown>),
    pagado: data.pagado,
    aprobado: data.aprobado,
    notFound: false,
  };
}
