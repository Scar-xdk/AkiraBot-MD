#!/bin/bash

# Limpar a tela
clear

# Arte ASCII do nome do bot
echo -e "\e[31m
        _     _  __  ___   ___     _           __  __   ___
   /_\   | |/ / |_ _| | _ \   /_\    ___  |  \/  | |   \
  / _ \  | ' <   | |  |   /  / _ \  |___| | |\/| | | |) |
 /_/ \_\ |_|\_\ |___| |_|_\ /_/ \_\       |_|  |_| |___/
\e[0m"

# Adicionar texto centralizado abaixo do nome
echo ""
echo -e "\e[32mCriador: By Dark (5534998769175)"
echo -e "\e[34mBot: AkiraBot-MD"
echo -e "\e[33mBot Conectado com Sucesso!"
echo ""

# Iniciar o bot com Node.js
node index.js

