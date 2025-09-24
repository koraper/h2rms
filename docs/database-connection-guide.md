# Database Connection Guide

## Connection Methods

H2RMS supports two ways to connect to the Supabase database:

### 1. Supabase SDK (Current/Recommended)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Advantages:**
- ✅ Built-in Row Level Security (RLS)
- ✅ Real-time subscriptions
- ✅ File storage integration
- ✅ Authentication integration
- ✅ Automatic API generation

### 2. Direct PostgreSQL Connection (Optional)

When you need direct database access:

```env
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project.supabase.co:5432/postgres
```

## When to Use Direct Connection

### 1. Data Migration Scripts
```javascript
// scripts/migrate-data.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateData() {
  const client = await pool.connect();
  try {
    // Bulk operations that bypass RLS
    await client.query(`
      INSERT INTO profiles (id, email, role)
      SELECT * FROM temp_user_data
    `);
  } finally {
    client.release();
  }
}
```

### 2. Complex Analytics Queries
```javascript
// lib/analytics.js
import { Pool } from 'pg';

export async function generateComplexReport() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  const result = await pool.query(`
    SELECT
      d.name as department,
      COUNT(DISTINCT p.id) as employee_count,
      AVG(attendance_rate) as avg_attendance
    FROM departments d
    LEFT JOIN profiles p ON p.department = d.name
    LEFT JOIN (
      SELECT
        employee_id,
        COUNT(*) * 100.0 / 22 as attendance_rate
      FROM attendance
      WHERE date >= date_trunc('month', CURRENT_DATE)
      GROUP BY employee_id
    ) a ON a.employee_id = p.id
    GROUP BY d.name
  `);

  return result.rows;
}
```

### 3. Database Administration Tasks
```javascript
// scripts/backup.js
import { exec } from 'child_process';

const connectionString = process.env.DATABASE_URL;

// Create backup
exec(`pg_dump "${connectionString}" > backup-$(date +%Y%m%d).sql`,
  (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error);
      return;
    }
    console.log('Backup created successfully');
  }
);
```

### 4. Bulk Data Operations
```javascript
// lib/bulk-operations.js
import { Pool } from 'pg';

export async function bulkUpdateAttendance(records) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const record of records) {
      await client.query(`
        INSERT INTO attendance (employee_id, date, status, check_in, check_out)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (employee_id, date)
        DO UPDATE SET
          status = EXCLUDED.status,
          check_in = EXCLUDED.check_in,
          check_out = EXCLUDED.check_out,
          updated_at = NOW()
      `, [record.employee_id, record.date, record.status, record.check_in, record.check_out]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Getting Your Connection String

### From Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Look for **Connection string** section
3. Copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
   ```

### Format Options:

#### URI Format (Recommended):
```env
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres?sslmode=require
```

#### Separate Components:
```env
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_SSL=require
```

## Environment Configuration

### Development (.env.local):
```env
# Supabase SDK (Primary)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Direct DB Connection (Optional)
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres?sslmode=require
```

### Production:
```env
# Same as development, but with production Supabase project
DATABASE_URL=postgresql://postgres:prod-password@db.prod-project.supabase.co:5432/postgres?sslmode=require
```

## Security Considerations

### 1. Connection String Security
- ⚠️ **Never commit** connection strings to version control
- ⚠️ **Rotate passwords** regularly
- ✅ Use environment variables
- ✅ Enable SSL/TLS connections

### 2. When NOT to Use Direct Connection
- ❌ Client-side JavaScript (browser)
- ❌ Public API endpoints
- ❌ Operations that should respect RLS
- ❌ Real-time subscriptions (use Supabase SDK)

### 3. Best Practices
- Use Supabase SDK for 90% of operations
- Use direct connection only for:
  - Admin scripts
  - Data migrations
  - Complex analytics
  - Bulk operations

## Code Examples

### Conditional Connection:
```javascript
// lib/database.js
import { supabase } from './supabase';
import { Pool } from 'pg';

// For regular app operations
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  return { data, error };
};

// For admin operations
export const bulkCreateUsers = async (users) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Direct database connection not configured');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Bulk insert bypassing RLS
  const result = await pool.query(`
    INSERT INTO auth.users (id, email, encrypted_password)
    SELECT * FROM unnest($1::uuid[], $2::text[], $3::text[])
  `, [users.map(u => u.id), users.map(u => u.email), users.map(u => u.password)]);

  await pool.end();
  return result;
};
```

## Summary

**For H2RMS:**
- **Primary**: Use Supabase SDK (URL + API Keys) ✅
- **Secondary**: Direct connection for admin tasks only
- **DB Password**: Store securely, use for direct connections
- **Connection String**: Optional, for advanced operations

The current setup with SDK is sufficient for most HR operations!