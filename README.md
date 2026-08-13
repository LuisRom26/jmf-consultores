# JMF Consultores

Sitio corporativo estático de JMF Consultores, compatible con hosting tradicional y GitHub Pages.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

La aplicación se sirve en http://localhost:3000.

## Producción

```bash
npm run build
```

El output generado queda en la carpeta `dist/` y puede publicarse en cualquier hosting estático, incluyendo GitHub Pages, Netlify o un servidor web tradicional.

## Despliegue en GitHub Pages

1. Configura el repositorio en GitHub con Pages usando la opción "GitHub Actions".
2. Asegúrate de que el archivo `CNAME` contenga `jmfconsultores.mx` si se usa el dominio custom.
3. El workflow del repositorio compila el sitio con Vite y publica el contenido de `dist/`.
4. Si se despliega en un hosting tradicional, sube todo el contenido generado en `dist/` al directorio público.

## Nota importante

Antes de publicar formalmente en producción, debe completarse el aviso de privacidad y validarse la dirección de correo y dominio definitivos. El archivo `PENDIENTES-PUBLICACION.md` documenta los bloqueadores pendientes.
