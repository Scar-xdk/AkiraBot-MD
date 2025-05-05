#!/bin/bash

# Navega para o diretório do bot
cd "$(dirname "$0")" || exit

# Limpa arquivos desnecessários (opcional)
echo "Removendo arquivos desnecessários..."
rm -rf lib node_modules temp

# Atualiza dependências com Yarn
echo "Atualizando dependências..."
yarn install --frozen-lockfile

# Verifica a integridade do código (se você tiver esse script)
echo "Verificando integridade do código..."
node verificarIntegridade.js

# Adiciona todas as alterações ao Git
echo "Adicionando arquivos ao Git..."
git add .

# Realiza o commit
echo "Digite a mensagem de commit:"
read commit_message
git commit -m "$commit_message"

# Envia para o repositório remoto (branch main)
echo "Enviando para o repositório remoto..."
git push origin main

# Fim
echo "Atualização concluída!"
