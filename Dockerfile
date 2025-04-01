# Usa a imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /my-app

# Copia o package.json e o package-lock.json para instalar as dependências primeiro
COPY package.json package-lock.json ./

RUN node -v && npm -v

# Instala as dependências
RUN npm install --force

# Copia o restante do código para dentro do container
COPY . .

# Expõe a porta que o frontend roda
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
