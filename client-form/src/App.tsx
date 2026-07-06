import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Catalogo from "./components/Catalogo";
import FormularioConPreview from "./components/FormularioConPreview";
import FormularioAsistido from "./components/FormularioAsistido";
import { TemplateInfo } from "./types";

function getPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const [path, setPath] = useState(getPath);
  const [selected, setSelected] = useState<TemplateInfo | null>(null);

  useEffect(() => {
    const handler = () => setPath(getPath());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const isWhatsappMode = window.location.search.includes("contacto=1") || window.location.search.includes("whatsapp=1");
  if (isWhatsappMode) return <FormularioAsistido />;

  if (selected) {
    return (
      <FormularioConPreview
        template={selected}
        onBack={() => { setSelected(null); navigate("/plantillas"); }}
      />
    );
  }

  if (path === "/plantillas") {
    return (
      <Catalogo
        onSelect={(t) => setSelected(t)}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <Landing
      onVerPlantillas={() => navigate("/plantillas")}
    />
  );
}
