# Guía de Contribución

¡Gracias por tu interés en contribuir a Radio App! 🎉

## Código de Conducta

Este proyecto y todos los participantes están gobernados por nuestro Código de Conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables.

## ¿Cómo puedo contribuir?

### Reportando Bugs

- Usa la plantilla de issue para bugs
- Incluye pasos detallados para reproducir
- Incluye screenshots si es posible
- Especifica tu entorno (navegador, OS, versión)

### Sugiriendo Mejoras

- Usa la plantilla de issue para features
- Explica claramente el beneficio
- Considera el alcance y complejidad
- Discute alternativas

### Pull Requests

1. Fork el repositorio
2. Crea una rama desde `main`
3. Haz tus cambios
4. Escribe/actualiza tests
5. Actualiza documentación
6. Commit siguiendo convenciones
7. Push y abre un PR

## Estándares de Código

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añadir búsqueda por género
fix: corregir error en reproductor
docs: actualizar README
style: formatear código
refactor: reorganizar servicios
test: añadir tests para auth
chore: actualizar dependencias
```

### TypeScript

- Tipado estricto siempre
- Interfaces para todos los modelos
- Documentación JSDoc en funciones públicas
- No usar `any` (usar `unknown` si es necesario)

### Angular

- Seguir la guía de estilo oficial de Angular
- Un componente por archivo
- Lazy loading para features
- Reactive Forms sobre Template-Driven
- OnPush change detection cuando sea posible

### Testing

- Unit tests para servicios y pipes
- Component tests para componentes
- E2E tests para flujos críticos
- Cobertura mínima del 80%

## Proceso de Revisión

1. El PR será revisado por mantenedores
2. Cambios pueden ser solicitados
3. Una vez aprobado, será mergeado
4. El PR será incluido en el próximo release

## Preguntas

¿Tienes preguntas? Abre un issue o contacta a los mantenedores.

¡Gracias por contribuir! 🚀
