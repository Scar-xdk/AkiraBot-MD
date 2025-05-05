#!/usr/bin/env bash

# Função para imprimir texto em vermelho
print_red() {
  echo -e "\e[1;31m$1\e[0m"
}

# ASCII Art de "AKUMA"
akuma_banner="
 █████╗ ██╗  ██╗██╗   ██╗███╗   ███╗ █████╗     
██╔══██╗██║ ██╔╝██║   ██║████╗ ████║██╔══██╗    
███████║█████╔╝ ██║   ██║██╔████╔██║███████║    
██╔══██║██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║    
██║  ██║██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    
"

clear

# Exibe o banner AKUMA
print_red "$akuma_banner"

# Informações do bot
echo ""
echo -e "\e[1;35mCriador:\e[0m By Dark (5534998769175)"
echo -e "\e[1;36mBot:\e[0m AkumaBot-MD"
echo -e "\e[1;32mStatus:\e[0m Inicializando...\n"

# Iniciar o bot
node .
