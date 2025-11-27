# 📦 Instrucciones de Instalación - Radio App

## 🚀 Inicio Rápido

### Prerequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18.19.0
- **npm** >= 9.0.0
- **Angular CLI** >= 16.2.0

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/radio-app.git
cd radio-app

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start

# 4. Abrir en navegador
# La aplicación estará disponible en http://localhost:4200
```

---

## 🔐 Configuración de Seguridad (IMPORTANTE)

### Antes de Producción

⚠️ **CRÍTICO**: Debes cambiar las claves de seguridad antes de desplegar en producción.

#### 1. JWT Secret

Edita `src/app/core/services/jwt.service.ts`:

```typescript
// Línea 35
private readonly JWT_SECRET = process.env['JWT_SECRET'] || 'TU-SECRET-AQUI';
```

#### 2. Encryption Key

Edita `src/app/shared/utils/storage.util.ts`:

```typescript
// Línea 16
private static readonly ENCRYPTION_KEY = process.env['ENCRYPTION_KEY'] || 'TU-ENCRYPTION-KEY-AQUI';
```

### Generación de Claves Seguras

```bash
# Generar JWT Secret (Unix/Mac)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar Encryption Key (Unix/Mac)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔄 Migración de Datos Antiguos (Opcional)

Si estás actualizando desde una versión anterior, los datos en localStorage necesitan ser migrados porque:
- Password hashes cambiaron de SHA-256 a BCrypt
- Datos ahora están encriptados con AES-256

### Opción 1: Migración Automática

Agrega esto en `app.component.ts` en el `ngOnInit()`:

```typescript
import { StorageUtil } from './shared/utils/storage.util';

ngOnInit() {
  // Migrar datos antiguos a formato encriptado
  StorageUtil.migrateToEncrypted('radio_app_users');
  StorageUtil.migrateToEncrypted('radio_app_auth_token');
  StorageUtil.migrateToEncrypted('radio_app_user_data');
}
```

### Opción 2: Limpiar localStorage

```typescript
// Limpiar todo y empezar de cero
localStorage.clear();
```

⚠️ **Nota**: Los usuarios deberán hacer login nuevamente después de la migración.

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm start                # Inicia servidor de desarrollo
npm run watch            # Build con watch mode

# Producción
npm run build            # Build de desarrollo
npm run build:prod       # Build de producción optimizado

# Testing
npm test                 # Ejecuta tests unitarios
npm run test:coverage    # Tests con cobertura

# Linting
npm run lint             # Ejecuta ESLint

# Documentación
npm run docs:generate    # Genera documentación con Compodoc
npm run compodoc         # Abre documentación generada
```

---

## 🗂️ Estructura del Proyecto

```
radio-app/
├── src/
│   ├── app/
│   │   ├── core/                    # Núcleo de la aplicación
│   │   │   ├── constants/           # Constantes globales
│   │   │   ├── enums/               # Enumeraciones
│   │   │   ├── guards/              # Route guards
│   │   │   ├── handlers/            # Error handlers
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── models/              # Interfaces centralizadas
│   │   │   └── services/            # Servicios core (crypto, jwt)
│   │   │
│   │   ├── features/                # Módulos de características
│   │   │   ├── auth/                # Autenticación
│   │   │   ├── home/                # Página principal
│   │   │   ├── radio-player/        # Reproductor de radio
│   │   │   ├── search/              # Buscador
│   │   │   ├── legal/               # Páginas legales
│   │   │   └── not-found/           # Página 404
│   │   │
│   │   └── shared/                  # Recursos compartidos
│   │       ├── components/          # Componentes reutilizables
│   │       ├── pipes/               # Pipes personalizados
│   │       ├── validators/          # Validadores custom
│   │       ├── utils/               # Utilidades
│   │       └── services/            # Servicios compartidos
│   │
│   ├── assets/                      # Recursos estáticos
│   └── environments/                # Configuraciones de entorno
│
├── documentation/                   # Documentación generada
├── REFACTORING_SUMMARY.md          # Resumen de mejoras
└── INSTALL.md                      # Este archivo
```

---

## 🌍 Configuración de Entornos

### Development

`src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://de1.api.radio-browser.info',
  jwtSecret: 'development-secret',
  encryptionKey: 'development-encryption-key'
};
```

### Production

`src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://de1.api.radio-browser.info',
  jwtSecret: process.env['JWT_SECRET'],
  encryptionKey: process.env['ENCRYPTION_KEY']
};
```

---

## 🐛 Troubleshooting

### Error: "Module not found bcryptjs"

```bash
npm install bcryptjs @types/bcryptjs
```

### Error: "Cannot find module crypto-js"

```bash
npm install crypto-js @types/crypto-js
```

### Error: "jsonwebtoken not found"

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### Puerto 4200 en uso

```bash
ng serve --port 4201
```

### Problemas con permisos en npm

```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

---

## 🚢 Deploy en Producción

### Netlify

```bash
# Build
npm run build:prod

# Deploy folder
dist/radio-app/
```

### Vercel

```bash
vercel --prod
```

### Firebase Hosting

```bash
npm run build:prod
firebase deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod
EXPOSE 4200
CMD ["npm", "start"]
```

---

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación principal
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Resumen de refactorización
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía de contribución
- [Documentación Técnica](./documentation/index.html) - Generada con Compodoc

---

## 🤝 Soporte

Si encuentras problemas:

1. Revisa los [Issues](https://github.com/TU_USUARIO/radio-app/issues)
2. Crea un nuevo issue con detalles
3. Incluye logs de error y versión de Node/npm

---

## 📝 Licencia

MIT © NaktoG
