## ChatPDF - upload your pdf, chat with it

### Steps to setup the project locally
1. create a .env file according to the sample provided
2. run this command to build and run the container `docker-compose build then docker-compose up`
3. Since no ODM or querybuilder is used, create the tables manually. 
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

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
4. Since frontend is not dockerized, navigate to `chatpdf-frontend`, install the packages and start the app




