## 🚀 Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **PostgreSQL** - Base de datos
- **TypeORM** - ORM para base de datos
- **Class Validator** - Validación de DTOs

### Base de Datos
- **PostgreSQL 14+**
- **Triggers** - Validación de datos
- **Stored Procedures** - Reportes optimizados
- **Índices** - Optimización de consultas

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd demo-sermaluc
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en `/backend`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=sermaluc

# Application
PORT=3001
NODE_ENV=development
```

### 4. Configurar Base de Datos

```bash
# Crear la base de datos
createdb sermaluc

# Ejecutar migraciones
cd backend/src/database
psql -U postgres -d sermaluc -f scripts/setup-database.sql
```

### 5. Ejecutar la aplicación

```bash
cd backend
npm run start:dev
```

La API estará disponible en: `http://localhost:3001/api`