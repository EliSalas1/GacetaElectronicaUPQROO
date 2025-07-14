# Configuración de Google Drive para Recursos

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=1039047457855-0pdqq9ae39sa4421h6936vge0gmtu6dt.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/api/drive/callback

# NextAuth Configuration
NEXTAUTH_SECRET=43p9f8hmUPnANbHE1d%0fWaJXyM8
NEXTAUTH_URL=http://localhost:3000
```

## Funcionalidades Implementadas

### 1. Validación de URLs de Google Drive
- ✅ URLs de archivos de Google Drive
- ✅ URLs de documentos de Google Docs
- ✅ URLs de hojas de cálculo de Google Sheets
- ✅ URLs de presentaciones de Google Slides

### 2. Tipos de Archivos Soportados
- ✅ Imágenes (jpg, jpeg, png, gif, bmp, webp)
- ✅ Videos (mp4, avi, mov, wmv, flv, webm)
- ✅ PDFs

### 3. Interfaz de Usuario
- ✅ Diálogo modal para agregar recursos
- ✅ Validación en tiempo real de URLs
- ✅ Selección de tipos de archivo
- ✅ Lista de recursos agregados
- ✅ Eliminación de recursos

### 4. Base de Datos
- ✅ API para guardar recursos en la tabla `Recursos`
- ✅ Validación de duplicados
- ✅ Relación con artículos

## Uso

1. **Acceder al Editor de Artículos**: Ve a `/redactor` y selecciona "Nuevo Artículo"

2. **Agregar Recursos**: 
   - Haz clic en "Agregar Recursos de Google Drive"
   - Completa el formulario:
     - Tipo de archivo (Imagen, Video, PDF)
     - Link de Google Drive
   - El nombre se genera automáticamente basado en el tipo y el ID del archivo

3. **Validación**: El sistema validará automáticamente:
   - Que la URL sea válida de Google Drive
   - Que el tipo de archivo sea correcto
   - Que no haya duplicados

4. **Enviar a Revisión**: Al hacer clic en "Enviar a Revisión":
   - Se validan todos los campos del artículo
   - Se guardan los recursos en la base de datos
   - Se muestra confirmación de éxito

## Estructura de la Base de Datos

La tabla `Recursos` debe tener los siguientes campos:
- `IdRecurso` (Primary Key)
- `Nombre` (VARCHAR)
- `Ruta` (VARCHAR) - Contiene el link de Google Drive
- `Tipo` (VARCHAR) - Tipo de archivo (imagen, video, pdf)
- `Articulos_idArticulo` (Foreign Key)

## APIs Implementadas

### `/api/drive/validate`
- **POST**: Valida URLs de Google Drive
- **Body**: `{ url: string, tipo: string }`
- **Response**: `{ valid: boolean, error?: string }`

### `/api/recursos/batch`
- **POST**: Guarda múltiples recursos
- **Body**: `{ recursos: Array, articuloId: number }`
- **Response**: `{ message: string, created: Array, errors?: Array }`

## Próximos Pasos

Para una integración completa con Google Drive API:

1. Instalar la dependencia `googleapis`:
   ```bash
   npm install googleapis
   ```

2. Configurar scopes adicionales para acceso a archivos
3. Implementar autenticación OAuth2 completa
4. Agregar funcionalidad para obtener metadatos de archivos
5. Implementar vista previa de archivos

## Notas

- Las URLs de Google Drive deben ser públicas o compartidas con permisos de lectura
- El sistema actual valida el formato de URL pero no verifica la existencia del archivo
- Para producción, se recomienda implementar autenticación OAuth2 completa 