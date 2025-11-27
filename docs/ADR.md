# Architecture Decision Records (ADR)

## ADR-001: Eliminación de bcryptjs y jsonwebtoken del Frontend

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** El proyecto tenía bcryptjs y jsonwebtoken implementados en el frontend, lo cual representa una vulnerabilidad crítica de seguridad OWASP A02:2021 (Cryptographic Failures).

**Decisión:** 
- Eliminar bcryptjs y jsonwebtoken del frontend
- Implementar Web Crypto API nativa para hashing
- Crear sistema de tokens mock para desarrollo/demo
- Documentar que en producción se debe usar backend real con OAuth2/JWT

**Consecuencias:**
- ✅ Elimina vulnerabilidad crítica de seguridad
- ✅ Reduce bundle size en ~150KB
- ✅ Usa APIs nativas del navegador (mejor performance)
- ⚠️ Requiere backend real para producción
- ⚠️ Sistema actual es solo para demo/desarrollo

**Alternativas Consideradas:**
1. Mantener las librerías (rechazado por seguridad)
2. Mover autenticación a backend (ideal pero requiere infraestructura)
3. Usar Web Crypto API (seleccionado)

---

## ADR-002: Paleta de Colores Negro/Amarillo Inspirada en Spotify

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** Se requería una UI moderna inspirada en Spotify con paleta negro/amarillo sin ser chillón.

**Decisión:**
- Color primario: #0A0A0A (negro profundo)
- Color accent: #F5C518 (amarillo dorado, similar a IMDb)
- Inspiración: Spotify UI pero con identidad propia
- Contraste WCAG AAA: 12.6:1 (amarillo sobre negro)

**Consecuencias:**
- ✅ Cumple WCAG AAA para accesibilidad
- ✅ Amarillo elegante, no chillón
- ✅ Identidad visual única
- ✅ Excelente legibilidad
- ✅ Profesional y moderno

**Alternativas Consideradas:**
1. Amarillo brillante #FFFF00 (rechazado: muy chillón)
2. Amarillo oscuro #D4A017 (considerado para hover states)
3. Amarillo dorado #F5C518 (seleccionado)

---

## ADR-003: Interfaces Tipadas para Eliminar 'any'

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** El proyecto tenía 30+ usos de tipo 'any', eliminando los beneficios de TypeScript.

**Decisión:**
- Crear archivo central de interfaces: `core/models/interfaces.ts`
- Definir interfaces para: Station, Radio, User, PlayerState, etc.
- Configurar ESLint para prohibir 'any' (`@typescript-eslint/no-explicit-any: error`)
- Refactorizar código existente para usar interfaces

**Consecuencias:**
- ✅ Type safety completo
- ✅ Mejor autocompletado en IDEs
- ✅ Detección de errores en compile-time
- ✅ Documentación implícita del código
- ⚠️ Requiere refactorización de código existente

**Alternativas Consideradas:**
1. Mantener 'any' (rechazado: mala práctica)
2. Usar 'unknown' (considerado pero menos específico)
3. Interfaces tipadas (seleccionado)

---

## ADR-004: Prevención de Memory Leaks con takeUntil

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** Componentes con suscripciones sin unsubscribe causaban memory leaks.

**Decisión:**
- Implementar patrón `takeUntil` con Subject en todos los componentes
- Agregar `OnDestroy` lifecycle hook
- Completar Subject en `ngOnDestroy`
- Linting rule para verificar implementación

**Consecuencias:**
- ✅ Elimina memory leaks
- ✅ Mejor performance a largo plazo
- ✅ Patrón consistente en toda la app
- ⚠️ Código ligeramente más verbose

**Alternativas Consideradas:**
1. Manual unsubscribe (rechazado: propenso a errores)
2. async pipe (ideal pero no siempre aplicable)
3. takeUntil pattern (seleccionado)

---

## ADR-005: Glassmorphism y Efectos Visuales

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** Se requería UI moderna con efectos visuales atractivos.

**Decisión:**
- Implementar glassmorphism con `backdrop-filter: blur()`
- Usar transiciones suaves (300ms cubic-bezier)
- Efectos hover con scale y glow
- Animaciones con `@keyframes` personalizadas

**Consecuencias:**
- ✅ UI moderna y atractiva
- ✅ Feedback visual claro
- ✅ Experiencia premium
- ⚠️ Requiere navegadores modernos
- ⚠️ Puede afectar performance en dispositivos antiguos

**Alternativas Consideradas:**
1. UI plana sin efectos (rechazado: menos atractivo)
2. Efectos pesados (rechazado: performance)
3. Glassmorphism moderado (seleccionado)

---

## ADR-006: HttpInterceptor para Seguridad

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** Faltaban headers de seguridad en las peticiones HTTP.

**Decisión:**
- Crear SecurityInterceptor
- Agregar headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Implementar retry logic (2 intentos)
- Manejo centralizado de errores

**Consecuencias:**
- ✅ Mejora seguridad contra XSS, clickjacking
- ✅ Retry automático en fallos de red
- ✅ Logging centralizado de errores
- ✅ Código más limpio en componentes

**Alternativas Consideradas:**
1. Headers en cada petición (rechazado: repetitivo)
2. Interceptor global (seleccionado)
3. Service Worker (considerado para futuro)

---

## ADR-007: ESLint con Reglas Estrictas

**Fecha:** 2024-01-XX  
**Estado:** Aceptado  
**Contexto:** Falta de linting causaba inconsistencias en el código.

**Decisión:**
- Configurar ESLint con reglas estrictas
- Prohibir 'any' explícitamente
- Enforcar naming conventions
- Reglas de accesibilidad en templates
- Pre-commit hooks con Husky (futuro)

**Consecuencias:**
- ✅ Código consistente
- ✅ Mejor calidad
- ✅ Detección temprana de errores
- ✅ Mejora accesibilidad
- ⚠️ Curva de aprendizaje inicial

**Alternativas Consideradas:**
1. Sin linting (rechazado: mala práctica)
2. Reglas laxas (rechazado: poco efectivo)
3. Reglas estrictas (seleccionado)

---

## Template para Nuevos ADRs

```markdown
## ADR-XXX: [Título]

**Fecha:** YYYY-MM-DD  
**Estado:** [Propuesto | Aceptado | Rechazado | Deprecado]  
**Contexto:** [Descripción del problema o situación]

**Decisión:** 
[Descripción de la decisión tomada]

**Consecuencias:**
- ✅ [Beneficios]
- ⚠️ [Trade-offs]
- ❌ [Desventajas]

**Alternativas Consideradas:**
1. [Alternativa 1] (razón de rechazo)
2. [Alternativa 2] (razón de rechazo)
3. [Alternativa seleccionada]
```

---

## Próximos ADRs a Documentar

- ADR-008: State Management (NgRx vs Signals)
- ADR-009: Testing Strategy (Jest + Cypress)
- ADR-010: Lazy Loading y Code Splitting
- ADR-011: Service Worker y PWA
- ADR-012: Virtual Scrolling para Listas
- ADR-013: Accesibilidad WCAG AAA
