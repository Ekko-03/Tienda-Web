const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;


const db = new Database(path.join(__dirname, 'usuarios.db'));


db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS regiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comunas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regiones (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    telefono TEXT,
    region TEXT NOT NULL,
    comuna TEXT NOT NULL,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const totalRegiones = db.prepare('SELECT COUNT(*) as count FROM regiones').get().count;
if (totalRegiones === 0) {
  const regionesData = [
    {
      codigo: 'arica',
      nombre: 'Región de Arica y Parinacota',
      comunas: [
        { codigo: 'arica', nombre: 'Arica' },
        { codigo: 'camarones', nombre: 'Camarones' },
        { codigo: 'putre', nombre: 'Putre' }
      ]
    },
    {
      codigo: 'tarapaca',
      nombre: 'Región de Tarapacá',
      comunas: [
        { codigo: 'iquique', nombre: 'Iquique' },
        { codigo: 'alto_hospicio', nombre: 'Alto Hospicio' },
        { codigo: 'pozo_almonte', nombre: 'Pozo Almonte' }
      ]
    },
    {
      codigo: 'antofagasta',
      nombre: 'Región de Antofagasta',
      comunas: [
        { codigo: 'antofagasta', nombre: 'Antofagasta' },
        { codigo: 'calama', nombre: 'Calama' },
        { codigo: 'tocopilla', nombre: 'Tocopilla' }
      ]
    },
    {
      codigo: 'atacama',
      nombre: 'Región de Atacama',
      comunas: [
        { codigo: 'copiapo', nombre: 'Copiapó' },
        { codigo: 'vallenar', nombre: 'Vallenar' },
        { codigo: 'caldera', nombre: 'Caldera' }
      ]
    },
    {
      codigo: 'coquimbo',
      nombre: 'Región de Coquimbo',
      comunas: [
        { codigo: 'la_serena', nombre: 'La Serena' },
        { codigo: 'coquimbo', nombre: 'Coquimbo' },
        { codigo: 'ovalle', nombre: 'Ovalle' }
      ]
    },
    {
      codigo: 'valparaiso',
      nombre: 'Región de Valparaíso',
      comunas: [
        { codigo: 'valparaiso', nombre: 'Valparaíso' },
        { codigo: 'vina_del_mar', nombre: 'Viña del Mar' },
        { codigo: 'quilpue', nombre: 'Quilpué' },
        { codigo: 'villa_alemana', nombre: 'Villa Alemana' }
      ]
    },
    {
      codigo: 'metropolitana',
      nombre: 'Región Metropolitana de Santiago',
      comunas: [
        { codigo: 'santiago', nombre: 'Santiago' },
        { codigo: 'providencia', nombre: 'Providencia' },
        { codigo: 'las_condes', nombre: 'Las Condes' },
        { codigo: 'maipu', nombre: 'Maipú' },
        { codigo: 'puente_alto', nombre: 'Puente Alto' }
      ]
    },
    {
      codigo: 'ohiggins',
      nombre: "Región del Libertador General Bernardo O'Higgins",
      comunas: [
        { codigo: 'rancagua', nombre: 'Rancagua' },
        { codigo: 'san_fernando', nombre: 'San Fernando' },
        { codigo: 'pichilemu', nombre: 'Pichilemu' }
      ]
    },
    {
      codigo: 'maule',
      nombre: 'Región del Maule',
      comunas: [
        { codigo: 'talca', nombre: 'Talca' },
        { codigo: 'linares', nombre: 'Linares' },
        { codigo: 'longavi', nombre: 'Longaví' },
        { codigo: 'curico', nombre: 'Curicó' }
      ]
    },
    {
      codigo: 'nuble',
      nombre: 'Región de Ñuble',
      comunas: [
        { codigo: 'chillan', nombre: 'Chillán' },
        { codigo: 'san_carlos', nombre: 'San Carlos' },
        { codigo: 'chillan_viejo', nombre: 'Chillán Viejo' }
      ]
    },
    {
      codigo: 'biobio',
      nombre: 'Región del Biobío',
      comunas: [
        { codigo: 'concepcion', nombre: 'Concepción' },
        { codigo: 'talcahuano', nombre: 'Talcahuano' },
        { codigo: 'los_angeles', nombre: 'Los Ángeles' },
        { codigo: 'san_pedro_de_la_paz', nombre: 'San Pedro de la Paz' }
      ]
    },
    {
      codigo: 'araucania',
      nombre: 'Región de la Araucanía',
      comunas: [
        { codigo: 'temuco', nombre: 'Temuco' },
        { codigo: 'padre_las_casas', nombre: 'Padre Las Casas' },
        { codigo: 'villarrica', nombre: 'Villarrica' }
      ]
    },
    {
      codigo: 'los_rios',
      nombre: 'Región de Los Ríos',
      comunas: [
        { codigo: 'valdivia', nombre: 'Valdivia' },
        { codigo: 'la_union', nombre: 'La Unión' },
        { codigo: 'rio_bueno', nombre: 'Río Bueno' }
      ]
    },
    {
      codigo: 'los_lagos',
      nombre: 'Región de Los Lagos',
      comunas: [
        { codigo: 'puerto_montt', nombre: 'Puerto Montt' },
        { codigo: 'osorno', nombre: 'Osorno' },
        { codigo: 'castro', nombre: 'Castro' }
      ]
    },
    {
      codigo: 'aysen',
      nombre: 'Región de Aysén',
      comunas: [
        { codigo: 'coyhaique', nombre: 'Coyhaique' },
        { codigo: 'aysen', nombre: 'Aysén' },
        { codigo: 'chile_chico', nombre: 'Chile Chico' }
      ]
    },
    {
      codigo: 'magallanes',
      nombre: 'Región de Magallanes',
      comunas: [
        { codigo: 'punta_arenas', nombre: 'Punta Arenas' },
        { codigo: 'puerto_natales', nombre: 'Puerto Natales' },
        { codigo: 'porvenir', nombre: 'Porvenir' }
      ]
    }
  ];

  const insertRegion = db.prepare('INSERT INTO regiones (codigo, nombre) VALUES (?, ?)');
  const insertComuna = db.prepare('INSERT INTO comunas (codigo, nombre, region_id) VALUES (?, ?, ?)');

  const seed = db.transaction(() => {
    for (const r of regionesData) {
      const result = insertRegion.run(r.codigo, r.nombre);
      const regionId = result.lastInsertRowid;
      for (const c of r.comunas) {
        insertComuna.run(c.codigo, c.nombre, regionId);
      }
    }
  });

  seed();
  console.log('Regiones y comunas inicializadas en la base de datos.');
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/api/regiones', (req, res) => {
  try {
    const regiones = db.prepare('SELECT id, codigo, nombre FROM regiones ORDER BY id ASC').all();
    res.json(regiones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar las regiones.' });
  }
});

app.get('/api/comunas', (req, res) => {
  try {
    const { region_id, region_codigo } = req.query;
    let comunas = [];

    if (region_id) {
      comunas = db.prepare('SELECT id, codigo, nombre, region_id FROM comunas WHERE region_id = ? ORDER BY nombre ASC').all(region_id);
    } else if (region_codigo) {
      comunas = db.prepare(`
        SELECT c.id, c.codigo, c.nombre, c.region_id
        FROM comunas c
        JOIN regiones r ON c.region_id = r.id
        WHERE r.codigo = ?
        ORDER BY c.nombre ASC
      `).all(region_codigo);
    } else {
      comunas = db.prepare('SELECT id, codigo, nombre, region_id FROM comunas ORDER BY nombre ASC').all();
    }

    res.json(comunas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar las comunas.' });
  }
});

//Validaciones del lado del servidor
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ntre 6 y 20 caracteres y al menos una mayúscula y un caracter especial
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{6,20}$/;

app.post('/api/registro', async (req, res) => {
  try {
    const {
      nombre_completo,
      email,
      confirmar_email,
      password,
      confirmar_password,
      telefono,
      region,
      comuna
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre_completo || !email || !password || !region || !comuna) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'El correo no es válido.' });
    }

    if (email !== confirmar_email) {
      return res.status(400).json({ error: 'Los correos no coinciden.' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: 'La contraseña debe tener entre 6 y 20 caracteres, con al menos una mayúscula y un caracter especial.'
      });
    }

    if (password !== confirmar_password) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    // Nunca se guarda la contraseña en texto plano: se guarda un hash
    const password_hash = await bcrypt.hash(password, 10);

    let regionFinal = region;
    let comunaFinal = comuna;

    // Si viene un ID numérico o código, obtener el nombre correspondiente
    if (/^\d+$/.test(region)) {
      const reg = db.prepare('SELECT nombre FROM regiones WHERE id = ?').get(region);
      if (reg) regionFinal = reg.nombre;
    }
    if (/^\d+$/.test(comuna)) {
      const com = db.prepare('SELECT nombre FROM comunas WHERE id = ?').get(comuna);
      if (com) comunaFinal = com.nombre;
    }

    const stmt = db.prepare(`
      INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, region, comuna)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(nombre_completo, email, password_hash, telefono || null, regionFinal, comunaFinal);

    return res.status(201).json({ mensaje: 'Cuenta creada correctamente.' });

  } catch (err) {
    // El email es UNIQUE en la tabla; este error salta si ya existe
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
