// src/app/publica/unauthorized/page.tsx

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <CardTitle className="text-lg font-bold">Acceso denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-gray-600">
            Lo sentimos, no tienes permisos para ver esta sección.
          </p>
          <Link
            href="/publica/login"
            className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Volver a iniciar sesión
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
