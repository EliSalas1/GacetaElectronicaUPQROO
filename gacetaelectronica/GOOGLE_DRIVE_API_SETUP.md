# Configuración de Google Drive API con googleapis

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=1039047457855-0pdqq9ae39sa4421h6936vge0gmtu6dt.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:4000/api/drive/callback

# Google Drive API Token (opcional - se genera automáticamente)
GOOGLE_ACCESS_TOKEN=your_access_token_here

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:4000
```

## Configuración en Google Cloud Console

1. **Ir a Google Cloud Console**: https://console.cloud.google.com/
2. **Seleccionar tu proyecto** o crear uno nuevo
3. **Habilitar Google Drive API**:
   - Ve a "APIs y servicios" > "Biblioteca"
   - Busca "Google Drive API"
   - Haz clic en "Habilitar"

4. **Configurar OAuth 2.0**:
   - Ve a "APIs y servicios" > "Credenciales"
   - Haz clic en "Crear credenciales" > "ID de cliente de OAuth 2.0"
   - Configura las URLs autorizadas:
     - `http://localhost:4000`
     - `http://localhost:4000/api/drive/callback`

## APIs Implementadas

### `/api/drive/file-info`
- **POST**: Obtiene información detallada de archivos de Google Drive
- **Body**: `{ url: string, tipo: string }`
- **Response**: Información del archivo con URLs de vista previa

### `/api/drive/token`
- **GET**: Genera URL de autorización OAuth2
- **POST**: Intercambia código por token de acceso
- **Body**: `{ code: string }`

## Flujo de Autenticación

1. **Usuario agrega recurso** → Sistema extrae ID del archivo
2. **Sistema llama a `/api/drive/file-info`** → Obtiene metadatos del archivo
3. **Si no hay token** → Usa URLs públicas como fallback
4. **Si hay token** → Usa API oficial de Google Drive

## Ventajas de usar googleapis

### ✅ **Con API oficial**:
- ✅ URLs de vista previa confiables
- ✅ Metadatos reales del archivo (nombre, tamaño, tipo)
- ✅ Validación de permisos
- ✅ Soporte para archivos privados (con autenticación)

### ✅ **Sin API oficial (fallback)**:
- ✅ Funciona sin configuración adicional
- ✅ URLs públicas de Google Drive
- ✅ Compatible con archivos públicos

## Prueba de Funcionamiento

1. **Agrega un recurso** en el editor de artículos
2. **Verifica en la consola del navegador** si hay errores
3. **Revisa la pestaña Network** para ver las llamadas a la API
4. **Si hay errores 401**, significa que necesitas configurar OAuth2

## Solución de Problemas

### Error 401 (Unauthorized)
```bash
# Significa que necesitas configurar OAuth2
# 1. Configura las credenciales en Google Cloud Console
# 2. Obtén un token de acceso usando el flujo OAuth2
```

### Error 403 (Forbidden)
```bash
# El archivo no es público o no tienes permisos
# Asegúrate de que el archivo esté configurado como "Cualquier persona con el enlace puede ver"
```

### Vista previa no carga
```bash
# 1. Verifica que la URL sea válida
# 2. Asegúrate de que el archivo sea público
# 3. Revisa la consola para errores de CORS
```

## Configuración Automática (Opcional)

Para una configuración completamente automática, puedes:

1. **Configurar OAuth2** en Google Cloud Console
2. **Obtener un token de acceso** usando el flujo OAuth2
3. **Guardar el token** en las variables de entorno

El sistema funcionará con o sin token, pero con token tendrás acceso a más funcionalidades.

## Notas Importantes

- **Archivos públicos**: Funcionan sin autenticación
- **Archivos privados**: Requieren OAuth2 configurado
- **Vista previa**: Depende de la configuración de permisos del archivo
- **Fallback**: Si la API falla, usa URLs públicas automáticamente 