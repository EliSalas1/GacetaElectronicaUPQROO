import mysql, { Pool } from 'mysql2/promise';
import { exec, ChildProcess } from 'child_process';
import os from 'os';

let pool: Pool | null = null;
let sshProcess: ChildProcess | null = null;
let tunnelEstablished = false;

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'gacetaup',
  password: 'gacetaUP2025',
  database: 'gaceta_bd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Abre el túnel SSH si no está abierto
async function openSshTunnel(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (tunnelEstablished) return resolve();

    // Verifica el sistema operativo para decidir el comando adecuado
    const isWindows = os.platform() === 'win32';
    const sshCommand = isWindows
      ? `"C:\\plink.exe" -ssh gestionvinculacion@academico.upqroo.edu.mx -P 22 -pw GVUpqroo25* -N -L 3307:localhost:3306`
      : `ssh -N -L 3307:localhost:3306 gestionvinculacion@academico.upqroo.edu.mx -p 22`;

    sshProcess = exec(sshCommand, (error) => {
      if (error) {
        console.error('❌ Error creando túnel SSH:', error);
        return reject(error);
      }
    });

    // Esperar 1 segundo para establecer el túnel
    setTimeout(() => {
      tunnelEstablished = true;
      console.log('✅ Túnel SSH creado con éxito');
      resolve();
    }, 1000);
  });
}

// Maneja el cierre del túnel cuando el proceso termina
function setupTunnelCleanup() {
  const cleanup = () => {
    if (sshProcess) {
      console.log('\n⛔ Cerrando túnel SSH...');
      sshProcess.kill();
      sshProcess = null;
      tunnelEstablished = false;
    }
    process.exit();
  };

  process.on('SIGINT', cleanup);   // Ctrl+C
  process.on('SIGTERM', cleanup);  // kill
  process.on('exit', cleanup);     // salida normal
}

// Obtiene el pool de conexiones
export default async function getConnection(): Promise<Pool> {
  if (!pool) {
    await openSshTunnel();
    setupTunnelCleanup(); // solo la primera vez
    pool = mysql.createPool(dbConfig);
    console.log('✅ Pool de conexiones MySQL creado');
  }

  return pool;
}
