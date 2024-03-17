### 1. .env.local

```bash
DB_CONNECTION=postgres://user:password@localhost:5432/db_name
LOGGER_PATHS_INFO=./logs/info.log
SECURITY_JWT_SECRET=jwt_secret
```

### 2. migrations

```bash
npx knex migrate:latest
```

### 3. seeds

```bash
npx knex seed:run
```
