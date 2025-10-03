# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/05/22 19:27:59 by agerbaud          #+#    #+#              #
#    Updated: 2025/09/10 14:49:40 by agerbaud         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = ft_transcendence

SECRET_DIR = .SECRET
CERT_FILE = $(SECRET_DIR)/certificate.crt
KEY_FILE = $(SECRET_DIR)/private_key.key

LOGIN = agerbaud
DOMAIN = $(LOGIN).42.fr

DC = docker compose
DC_FILE = srcs/docker-compose.yml
RM = rm -rf

all: up

build:
	$(DC) -f $(DC_FILE) build

run: $(SECRET_DIR)
	$(DC) -f $(DC_FILE) up -d

up: build run

down:
	$(DC) -f $(DC_FILE) down -v

# DEV : Rebuild frontend + supprime le volume + redémarre tout
dev:
	$(DC) -f $(DC_FILE) down -v
# 	@docker volume rm srcs_frontend_assets 2>/dev/null || true
	$(DC) -f $(DC_FILE) build 
# 	--no-cache frontend
	$(DC) -f $(DC_FILE) up -d
# 	@sleep 3
# 	@docker exec nginx ls -lh /usr/share/nginx/html/ || true

# dev:
# 	$(DC) -f $(DC_FILE) down frontend
# 	$(DC) -f $(DC_FILE) volume rm -f frontend_assets || true
# 	$(DC) -f $(DC_FILE) build --no-cache frontend
# 	$(DC) -f $(DC_FILE) up -d frontend
# 	$(DC) -f $(DC_FILE) restart nginx
# dev:
# 	$(DC) -f $(DC_FILE) down -v
# 	$(MAKE) build
# 	$(MAKE) run

clean:
	$(DC) -f $(DC_FILE) down

fclean:
	$(RM) -r $(SECRET_DIR)
	$(DC) -f $(DC_FILE) down -v

re: fclean
	$(MAKE) all

$(SECRET_DIR):
	mkdir -p $(SECRET_DIR)
	openssl req -x509 \
		-newkey rsa:2048 \
		-keyout $(KEY_FILE) -out $(CERT_FILE) \
		-days 365 -nodes \
		-subj "/C=FR/ST=ARA/L=Lyon/O=42Lyon/OU=IT/CN=$(DOMAIN)"


.PHONY: all clean fclean re build run stop up down
