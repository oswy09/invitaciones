import { useState } from "react";
import Catalogo from "./components/Catalogo";
import FormularioConPreview from "./components/FormularioConPreview";
import { TemplateInfo } from "./types";

export default function App() {
  const [selected, setSelected] = useState<TemplateInfo | null>(null);

  return selected ? (
    <FormularioConPreview template={selected} onBack={() => setSelected(null)} />
  ) : (
    <Catalogo onSelect={setSelected} />
  );
}
