# 🚀 Deploy en Netlify - Guía Rápida

## Método 1: Deploy Automático desde GitHub (Recomendado)

### Paso 1: Crear cuenta en Netlify
1. Ve a [https://www.netlify.com](https://www.netlify.com)
2. Click en **"Sign up"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza Netlify para acceder a tu GitHub

### Paso 2: Importar el repositorio
1. En el dashboard de Netlify, click en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Busca y selecciona el repositorio **"Atonix-Dev/Atonix"**
4. Configura el build:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist/radio-app`
5. Click en **"Deploy site"**

### Paso 3: Esperar el deploy
- Netlify detectará automáticamente `netlify.toml`
- El build tardará ~2-5 minutos
- Una vez completado, tendrás una URL tipo: `https://random-name-123456.netlify.app`

### Paso 4: Configurar dominio personalizado (Opcional)
1. En el dashboard del site, ve a **"Site settings"** → **"Domain management"**
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio

---

## Método 2: Deploy Manual con Netlify CLI

### Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Login en Netlify
```bash
netlify login
```

### Build del proyecto
```bash
npm run build:prod
```

### Deploy
```bash
# Deploy de prueba
netlify deploy

# Deploy a producción
netlify deploy --prod
```

Cuando te pregunte por el **publish directory**, ingresa: `dist/radio-app`

---

## Método 3: Drag & Drop Manual

### Paso 1: Build local
```bash
npm install
npm run build:prod
```

### Paso 2: Deploy
1. Ve a [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta `dist/radio-app` al área de drop
3. ¡Listo! Tu sitio estará live en segundos

---

## 🔧 Configuración de Variables de Entorno (Opcional)

Si quieres usar variables de entorno en Netlify:

1. Ve a **Site settings** → **Build & deploy** → **Environment**
2. Click en **"Add variable"**
3. Agrega:
   - `JWT_SECRET`: tu clave JWT
   - `ENCRYPTION_KEY`: tu clave de encriptación

Luego actualiza los servicios para usar `process.env`:

```typescript
// jwt.service.ts
private readonly JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

// storage.util.ts
private static readonly ENCRYPTION_KEY = process.env['ENCRYPTION_KEY'] || 'fallback-key';
```

---

## 📊 Verificación del Deploy

Una vez deployado, verifica:

- ✅ La app carga correctamente
- ✅ El routing funciona (prueba navegar a diferentes páginas y recargar)
- ✅ Las estaciones de radio cargan
- ✅ El login/registro funciona
- ✅ No hay errores en la consola del navegador

---

## 🐛 Troubleshooting

### Error: "Page Not Found" al navegar
**Solución**: El archivo `_redirects` debe estar en `dist/radio-app/`. Verifica que `angular.json` incluya `src/_redirects` en assets.

### Error: Build falla en Netlify
**Posibles causas**:
- Node version incorrecta → Verifica `netlify.toml` tenga `NODE_VERSION = "18.19.0"`
- Dependencias faltantes → Asegúrate que `package.json` tenga todas las dependencias

### Error: La app carga pero las estaciones no
**Solución**: Verifica que la API de Radio Browser esté disponible. Prueba en tu navegador:
```
https://de1.api.radio-browser.info/json/stations/search?limit=10
```

---

## 🎯 Optimizaciones Post-Deploy

### 1. Configurar notificaciones de deploy
En **Site settings** → **Build & deploy** → **Deploy notifications**

### 2. Habilitar HTTPS
Netlify lo hace automáticamente, pero verifica en **Domain settings**

### 3. Configurar Analytics (Opcional)
En **Integrations** → **Analytics**, puedes habilitar Netlify Analytics

### 4. Deploy Previews
Netlify creará automáticamente previews para cada PR desde la rama `dev`

---

## 📱 Deploy desde la rama dev

Para probar cambios antes de producción:

1. En Netlify, ve a **Site settings** → **Build & deploy** → **Branches**
2. En **Branch deploys**, selecciona **"Let me add individual branches"**
3. Agrega la rama `dev`
4. Ahora cada push a `dev` creará un deploy preview

---

## 🔗 URLs Útiles

- **Netlify Dashboard**: https://app.netlify.com
- **Netlify Docs**: https://docs.netlify.com
- **Netlify Status**: https://www.netlifystatus.com

---

## 📝 Workflow Recomendado

```bash
# 1. Desarrollo en rama dev
git checkout dev
# ... hacer cambios ...
git add .
git commit -m "feat: nueva funcionalidad"
git push origin dev

# 2. Verificar deploy preview en Netlify

# 3. Cuando todo esté OK, merge a main
git checkout main
git merge dev
git push origin main

# 4. Deploy automático a producción
```

---

**¡Tu app estará live en minutos!** 🎉

Para cualquier problema, consulta: https://docs.netlify.com/configure-builds/troubleshooting-tips/
