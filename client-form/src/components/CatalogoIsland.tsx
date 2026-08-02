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
      // Limpia el param del URL para que Google no indexe variantes con query string
      history.replaceState(null, "", window.location.pathname);
      return;
    }
    const openId = params.get("open");
    if (openId) {
      const found = CATALOGO.find((t) => t.id === openId);
      if (found) setSelected(found);
    }
    // Siempre limpia el URL: la canonical de /plantillas no lleva parámetros
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
