-- Adiciona colunas distrito e conselho à tabela paroquias
ALTER TABLE paroquias
ADD COLUMN distrito VARCHAR(100),
ADD COLUMN conselho VARCHAR(100);