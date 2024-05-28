# ChatPDF

This is a ChatPDF app. It is build using Nextjs 14. Tanstack Query v5 (React Query) is used for data fetching, caching, etc. Zustand is used for state management, TailwindCSS. Nodejs, Redis, BullMQ, postgreSQL in the backend.


## Tables
```sql
CREATE TABLE project ( 
	title VARCHAR(50) NOT NULL, 
	id SERIAL PRIMARY KEY, 
	embedding_status VARCHAR(20) DEFAULT 'creating' CHECK (embedding_status IN ('creating', 'failed', 'created')), 
	description TEXT NOT NULL, 
	pdf_url VARCHAR(100) NOT NULL, 
	chat_history JSONB, 
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
);
```

```sql
CREATE TABLE pdf_embeddings ( 
	id SERIAL PRIMARY KEY, 
	project_id INTEGER REFERENCES project(id) ON DELETE CASCADE, 
	chunk TEXT NOT NULL, 
	embedding VECTOR NOT NULL 
);
```

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```


In this project, the table are manually created, so make sure to create the table before running the project.

