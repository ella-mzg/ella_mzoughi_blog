### 1. Set up the environment variables

Create a .env.local file at the root of the project and add the following configurations:

```bash
DB_CONNECTION=postgres://user:password@localhost:5432/db_name
LOGGER_PATHS_INFO=./logs/info.log
SECURITY_JWT_SECRET=jwt_secret
```

### 2. Install the dependencies

```bash
npm install
```

### 3. Run the migrations

Before running the migrations, ensure you have created your PostgreSQL database.

```bash
npx knex migrate:latest
```

### 4. Seed the database

```bash
npx knex seed:run
```

### 5. Start the development server

```bash
npm run dev
```
