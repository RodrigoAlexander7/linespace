# Cross-Site Cookies Setup

## Problema resuelto

Cuando el frontend y backend están en dominios diferentes (ej: frontend en Vercel, backend en Render), las cookies necesitan configuración especial para funcionar correctamente.

## Cambios aplicados

### Frontend (`apps/frontend`)

**Archivo: `apps/frontend/src/lib/apis.ts`**
- Cambiado `process.env.BACKEND_URL` a `process.env.NEXT_PUBLIC_BACKEND_URL` para que funcione en el browser

**Archivo: `apps/frontend/src/features/auth/actions/auth.ts`**
- Cambiado `sameSite: 'lax'` a `sameSite: 'none'` en producción (requerido para cross-site)
- Reemplazado llamada `api.get('/users/me')` por `fetch` server-side para evitar mezclar cliente/servidor
- Las cookies ahora tienen: `sameSite: 'none', secure: true, httpOnly: true`

### Backend (`apps/backend`)

**Archivo: `apps/backend/src/main.ts`**
- CORS ya está configurado correctamente con `credentials: true`
- El backend usa la variable `FRONTEND_URL` para el origin permitido

## Variables de entorno requeridas

### Frontend (Vercel)

```bash
NEXT_PUBLIC_BACKEND_URL=https://linespace.onrender.com
BACKEND_URL=https://linespace.onrender.com  # Para server actions
```

### Backend (Render)

```bash
FRONTEND_URL=https://linespace-core.vercel.app
DATABASE_URL=postgresql://...
PORT=3000
NODE_ENV=production
```

## Cómo verificar que funciona

1. **Abrir DevTools → Application → Cookies**
   - Buscar `access_token`
   - Verificar que tenga:
     - ✅ `Domain`: tu dominio frontend
     - ✅ `SameSite`: `None`
     - ✅ `Secure`: `true`
     - ✅ `HttpOnly`: `true`

2. **Abrir DevTools → Network**
   - Hacer una petición a `/notes` o `/categories`
   - En Request Headers verificar que aparezca: `Cookie: access_token=...`
   - Si no aparece, la cookie no se está enviando

3. **Probar login**
   - Hacer login en la app
   - Si el login funciona, la cookie debería aparecer en Application → Cookies
   - Las peticiones subsiguientes deberían llevar la cookie automáticamente

## Troubleshooting

### Error: 401 Unauthorized
- ✅ Verificar que `FRONTEND_URL` en el backend sea exactamente el origen del frontend (sin trailing slash)
- ✅ Verificar que la cookie exista en el navegador con `SameSite=None` y `Secure=true`
- ✅ Verificar que el backend esté recibiendo la cookie en los headers (revisar logs)

### Cookie no aparece después del login
- ✅ Verificar que el login responda correctamente desde el backend
- ✅ Verificar que la server action de Next esté seteando la cookie con `cookies().set()`
- ✅ Verificar que el dominio de la cookie sea accesible desde el frontend

### Cookie aparece pero no se envía
- ✅ Cambiar `sameSite: 'lax'` a `'none'` (ya aplicado)
- ✅ Asegurar que `secure: true` en producción (ya aplicado)
- ✅ Verificar que axios tenga `withCredentials: true` (ya configurado)

## Próximos pasos

1. **Desplegar frontend** con las nuevas variables de entorno
2. **Verificar backend** que tenga `FRONTEND_URL` configurada correctamente
3. **Probar login** y verificar cookies en DevTools
4. **Si sigue fallando**: revisar logs del backend para ver si recibe las cookies

## Comandos útiles

```bash
# Local testing (frontend)
cd apps/frontend
pnpm dev

# Local testing (backend)
cd apps/backend
pnpm dev

# Check git status
git status

# Deploy (seguir instrucciones de tu plataforma)
```

## Notas adicionales

- Las cookies `httpOnly` no son accesibles desde JavaScript del browser (por seguridad)
- `sameSite: 'none'` requiere `secure: true` (solo HTTPS)
- El backend CORS NO puede usar `origin: '*'` cuando `credentials: true`
- En desarrollo local (`localhost`), `sameSite: 'lax'` funciona bien
