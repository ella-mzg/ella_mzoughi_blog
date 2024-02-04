## Before you run this project:

### 1. Create your .env.local

```bash
DB_CONNECTION=postgres://user:password@localhost:5432/db_name
LOGGER_PATHS_DEBUG=./logs/debug.log
LOGGER_PATHS_INFO=./logs/info.log
LOGGER_PATHS_ERROR=./logs/error.log
SECURITY_JWT_SECRET=jwt_secret
```

### 2. Run migrations

```bash
npx knex migrate:latest
```

### 3. Run seeds

```bash
npx knex seed:run
```

### 4. Lower your expectations
