# Deploy plantilla publica con index.html de Cata & Cami
$original = "index.html"
$backup   = "index.cliente.html"
$template = "index.template.html"

# Guardar original
Copy-Item $original $backup -Force

# Usar index de plantilla
Copy-Item $template $original -Force

# Build y deploy
npm run build
netlify deploy --prod --site 750c7daa-64a4-4cb1-be4d-72c433cf4f9e

# Restaurar original
Copy-Item $backup $original -Force
Remove-Item $backup -Force

Write-Host "✅ Deploy plantilla listo. index.html restaurado al cliente."
