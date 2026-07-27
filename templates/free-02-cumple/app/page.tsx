import { readFile } from "node:fs/promises"
import path from "node:path"

export default async function Page() {
  const html = await readFile(path.join(process.cwd(), "public", "invitacion.html"), "utf8")

  return (
    <iframe
      srcDoc={html}
      title="Invitación de cumpleaños"
      style={{ border: "none", width: "100vw", height: "100vh", display: "block" }}
    />
  )
}
