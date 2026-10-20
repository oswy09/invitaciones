import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Catalogo from "./components/Catalogo";
import DemoViewer from "./components/DemoViewer";
import FormularioConPreview from "./components/FormularioConPreview";
import FormularioAsistido from "./components/FormularioAsistido";
import FormularioFree from "./components/FormularioFree";
import { type TemplateInfo, CATALOGO } from "./types";

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

  // Auto-select template cuando viene de HomePlantillas (página de categoría)
  useEffect(() => {
    const autoId = sessionStorage.getItem("openTemplate");
    if (autoId) {
      sessionStorage.removeItem("openTemplate");
      const t = CATALOGO.find((tmpl) => tmpl.id === autoId);
      if (t) setSelected(t);
    }
  }, []);

  const isWhatsappMode = window.location.search.includes("contacto=1") || window.location.search.includes("whatsapp=1");
  if (isWhatsappMode) return <FormularioAsistido />;

  if (selected) {
    if (selected.esFree) {
      return (
        <FormularioFree
          template={selected}
          onBack={() => { setSelected(null); navigate("/plantillas"); }}
        />
      );
    }
    return (
      <FormularioConPreview
        template={selected}
        onBack={() => { setSelected(null); navigate("/plantillas"); }}
      />
    );
  }

  if (path === "/demo") {
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    return (
      <DemoViewer
        templateId={id}
        onPersonalizar={(t) => { setSelected(t); navigate("/plantillas"); }}
        onBack={() => navigate("/plantillas")}
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
