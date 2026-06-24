import { useState } from "react";
import Catalogo from "./components/Catalogo";
import FormularioConPreview from "./components/FormularioConPreview";
import FormularioAsistido from "./components/FormularioAsistido";
import { TemplateInfo } from "./types";

export default function App() {
  const [selected, setSelected] = useState<TemplateInfo | null>(null);

  const isWhatsappMode = window.location.search.includes("contacto=1") || window.location.search.includes("whatsapp=1");

  const handleSelect = (template: TemplateInfo) => {
    setSelected(template);
  };

  const handleBack = () => {
    setSelected(null);
  };

  if (isWhatsappMode) {
    return <FormularioAsistido />;
  }

  if (selected) {
    return <FormularioConPreview template={selected} onBack={handleBack} />;
  }

  return <Catalogo onSelect={handleSelect} />;
}
