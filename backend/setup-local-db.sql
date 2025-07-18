-- Script para criar a base de dados local PostgreSQL
-- Execute estes comandos no pgAdmin ou psql

-- Criar a base de dados
CREATE DATABASE paroquiaperto
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Portugal.1252'
    LC_CTYPE = 'Portuguese_Portugal.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Comentário da base de dados
COMMENT ON DATABASE paroquiaperto IS 'Base de dados da aplicação Paróquia Perto';

-- Conectar à base de dados
\c paroquiaperto

-- As tabelas serão criadas automaticamente pelo Hibernate
-- quando executar a aplicação Spring Boot
