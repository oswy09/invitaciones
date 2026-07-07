import { useEffect, useState } from "react";
import Catalogo from "./Catalogo";
import FormularioConPreview from "./FormularioConPreview";
import FormularioAsistido from "./FormularioAsistido";
import { TemplateInfo } from "../types";

export default function CatalogoIsland() {
  const [selected, setSelected] = useState<TemplateInfo | null>(null);
  const [isAsistido, setIsAsistido] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("contacto") || params.has("whatsapp")) {
      setIsAsistido(true);
    }
  }, []);

  if (isAsistido) return <FormularioAsistido />;

  if (selected) {
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
