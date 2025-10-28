# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/05/22 19:27:59 by agerbaud          #+#    #+#              #
#    Updated: 2025/10/28 17:54:06 by agerbaud         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = ft_transcendence

SECRET_DIR = .SECRET
CERT_FILE_FRONT = $(SECRET_DIR)/certificate.crt
KEY_FILE_FRONT = $(SECRET_DIR)/private_key.key
CERT_FILE_BACK = $(SECRET_DIR)/certificate.pem
KEY_FILE_BACK = $(SECRET_DIR)/private_key.pem

DOMAIN_FRONT = $(NAME).42.fr
DOMAIN_BACK = localhost:9090

DC = docker compose
DC_FILE = srcs/docker-compose.yml
RM = rm -rf

all:
	@echo "\033[0;32mdocker compose:"
	@echo "\tbuild run up down"
	@echo "\033[0;33mstatus:"
	@echo "\tls"
	@echo "\033[0;36mreset:"
	@echo "\tclean vclean fclean"

ls:
	@echo "\033[1;32m"
	@docker ps -a
	@echo "\033[1;33m"
	@docker image ls
	@echo "\033[1;34m"
	@docker volume ls
	@echo "\033[1;35m"
	@docker network ls
	@echo "\033[1;36m"
	-docker logs nginx
	@echo "\033[1;37m"
	-docker logs frontend
	@echo "\033[1;38m"
	-docker logs backend
	@echo "\033[0m"

build: $(SECRET_DIR)
	$(DC) -f $(DC_FILE) build

run:
	$(DC) -f $(DC_FILE) up -d

up: $(SECRET_DIR)
	$(DC) -f $(DC_FILE) up -d --build

down:
	$(DC) -f $(DC_FILE) down

clean: down
	-docker stop $$(docker ps -aq)
	-docker rm $$(docker ps -aq)
	-docker image rm -f $$(docker images -q)
	-docker network prune -f

vclean: clean
	rm -rf $(SECRET_DIR)
	-docker volume prune -a -f

fclean: vclean
	-docker system prune -a -f

re: fclean up

$(SECRET_DIR):
	mkdir -p $(SECRET_DIR)
	openssl req -x509 \
		-newkey rsa:2048 \
		-keyout $(KEY_FILE_FRONT) -out $(CERT_FILE_FRONT) \
		-days 365 -nodes \
		-subj "/C=FR/ST=ARA/L=Lyon/O=42Lyon/OU=IT/CN=$(DOMAIN_FRONT)"
	openssl req -x509 \
		-newkey rsa:2048 \
		-keyout $(KEY_FILE_BACK) -out $(CERT_FILE_BACK) \
		-days 365 -nodes \
		-subj "/C=FR/ST=ARA/L=Lyon/O=42Lyon/OU=IT/CN=$(DOMAIN_BACK)"

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

.PHONY: all ls build run up down clean vclean fclean re dev
