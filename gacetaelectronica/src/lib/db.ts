import mysql, { Pool } from 'mysql2/promise';
import { exec, ChildProcess } from 'child_process';
import os from 'os';

declare global {
  var _mysqlPool: Pool | null;
  var _sshProcess: ChildProcess | null;
  var _tunnelEstablished: boolean | null;
}

let sshProcess: ChildProcess | null = global._sshProcess || null;
let tunnelEstablished: boolean = global._tunnelEstablished || false;

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'gacetaup',
  password: 'gacetaUP2025',
  database: 'gaceta_bd',
  waitForConnections: true,
  connectionLimit: 10, // usa un número razonable
  queueLimit: 0,
};

// Abrir túnel SSH
async function openSshTunnel(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (tunnelEstablished) return resolve();

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

    setTimeout(() => {
      tunnelEstablished = true;
      global._sshProcess = sshProcess;
      global._tunnelEstablished = true;
      console.log('✅ Túnel SSH creado con éxito');
      resolve();
    }, 1000);
  });
}

// Cleanup en salida
function setupTunnelCleanup() {
  const cleanup = () => {
    if (sshProcess) {
      console.log('\n⛔ Cerrando túnel SSH...');
      sshProcess.kill();
      sshProcess = null;
      tunnelEstablished = false;
      global._sshProcess = null;
      global._tunnelEstablished = false;
    }
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

// Singleton de conexión
export default async function getConnection(): Promise<Pool> {
  if (!global._mysqlPool) {
    await openSshTunnel();
    setupTunnelCleanup();
    global._mysqlPool = mysql.createPool(dbConfig);
    console.log('✅ Pool de conexiones MySQL creado');
  }

  return global._mysqlPool;
}
