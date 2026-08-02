import { useEffect, useState } from "react";
import type { TemplateInfo } from "../types";
import { CATALOGO } from "../types";
import Catalogo from "./Catalogo";
import FormularioConPreview from "./FormularioConPreview";
import FormularioFree from "./FormularioFree";
import FormularioAsistido from "./FormularioAsistido";

export default function CatalogoIsland() {
  const [selected, setSelected] = useState<TemplateInfo | null>(null);
  const [isAsistido, setIsAsistido] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("contacto") || params.has("whatsapp")) {
      setIsAsistido(true);
      history.replaceState(null, "", window.location.pathname);
      return;
    }

    // Lee el template a abrir desde sessionStorage (puesto por el home al hacer clic)
    // o desde ?open= como fallback para enlaces directos antiguos.
    // En ambos casos el URL queda limpio — Google nunca indexa /plantillas?open=XX
    const openId =
      sessionStorage.getItem("openTemplate") || params.get("open");
    sessionStorage.removeItem("openTemplate");

    if (openId) {
      const found = CATALOGO.find((t) => t.id === openId);
      if (found) setSelected(found);
    }

    if (window.location.search) {
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  if (isAsistido) return <FormularioAsistido />;

  if (selected) {
    if (selected.esFree) {
      return (
        <FormularioFree
          template={selected}
          onBack={() => setSelected(null)}
        />
      );
    }
    return (
      <FormularioConPreview
        template={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <Catalogo
      onSelect={setSelected}
      onBack={() => { window.location.href = "/"; }}
    />
  );
}
