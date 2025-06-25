import { exec } from 'child_process';
import mysql, { Connection } from 'mysql2';

let connection: Connection | null = null;
let tunnelEstablished = false;

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'gacetaup',
  password: 'gacetaUP2025',
  database: 'gaceta_bd'
};

// Abre el túnel SSH si no está abierto
function openSshTunnel(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (tunnelEstablished) return resolve();

    const sshCommand = `plink.exe -ssh gestionvinculacion@academico.upqroo.edu.mx -P 22 -pw GVUpqroo25* -N -L 3307:localhost:3306`;

    const sshProcess = exec(sshCommand, (error) => {
      if (error) {
        console.error('❌ Error creando túnel SSH:', error);
        return reject(error);
      }
    });

    // Esperamos 1 segundo para que el túnel se abra
    setTimeout(() => {
      tunnelEstablished = true;
      console.log('✅ Túnel SSH creado con éxito');
      resolve();
    }, 1000);
  });
}

export default async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  await openSshTunnel();

  return new Promise((resolve, reject) => {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
      if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return reject(err);
      }
      console.log('✅ Conectado a la base de datos MySQL');
      resolve(connection!);
    });
  });
}
