# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/05/22 19:27:59 by agerbaud          #+#    #+#              #
#    Updated: 2025/11/26 17:54:47 by agerbaud         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# -------------------------------     HEAD     ------------------------------- #

# -------------------------------   preamble   ------------------------------- #

NAME	= ft_transcendence

DOMAIN_FRONT	= $(NAME).42.fr
DOMAIN_BACK		= localhost:3000

RM		= rm -rf
MKDIR	= mkdir -p $@
ECHO	= echo


# ---------------------------    docker compose    --------------------------- #

DC		= docker compose
DC_FILE	= srcs/docker-compose.yml
CMD_DC	= $(DC) -f $(DC_FILE)


# ---------------------------    command docker    --------------------------- #

DC_UP		= $(CMD_DC) up -d
DC_REFRESH	= $(CMD_DC) up --build -d
DC_BUILD	= $(CMD_DC) build
DC_DOWN		= $(CMD_DC) down
DC_VDOWN	= $(CMD_DC) down -v --remove-orphans
DC_START	= $(CMD_DC) start
DC_STOP		= $(CMD_DC) stop
DC_RESTART	= $(CMD_DC) restart


# ----------------------------    databases    ---------------------------- #

AUTH_DB	= srcs/backend/auth/db
GAME_DB	= srcs/backend/game/db
USER_DB	= srcs/backend/user/db
JWT_DB	= srcs/backend/jwt/db


# ----------------------------    key and cert    ---------------------------- #

SECRET_DIR		= .SECRET
CERT_FRONT		= $(SECRET_DIR)/certificate.crt
KEY_FRONT		= $(SECRET_DIR)/private_key.key
CERT_BACK		= $(SECRET_DIR)/certificate.pem
KEY_BACK		= $(SECRET_DIR)/private_key.pem
CERT_AND_KEY	= $(CERT_FRONT) $(KEY_FRONT) $(CERT_BACK) $(KEY_BACK)


# ------------------------------    openssl    ------------------------------ #

CMD_OPENSSL	= openssl req -x509 -newkey rsa:2048 \
		-keyout $(1) -out $(2) -days 365 -nodes \
		-subj "/C=FR/ST=ARA/L=Lyon/O=42Lyon/OU=IT/CN=$(3)"


# --------------------------    build directory    -------------------------- #

BUILD_DIR		= $(SECRET_DIR) $(AUTH_DB) $(GAME_DB) $(USER_DB) $(JWT_DB)


# -------------------------------    colors    ------------------------------- #

include color.mk


# ------------------------------   list rule   ------------------------------ #

LST_RULE_DC		= all up build down start stop restart
LST_RULE_INFO	= help info ls logs
LST_RULE_CLEAN	= vdown clean vclean fclean
LST_RULE_OTHER	= re fullre refresh dev


# -------------------------------   message   ------------------------------- #

MSG_RESET	= $(ECHO) "$(RESET)"
MSG_CMD		= @$(ECHO) "$(B_WHITE)Running: [ $(1) ]$(2)";
MSG_HELP	= @$(ECHO) "$(GREEN)docker compose:\n\t$(LST_RULE_DC)"; \
	$(ECHO) "$(YELLOW)status:\n\t$(LST_RULE_INFO)"; \
	$(ECHO) "$(BLUE)reset:\n\t$(LST_RULE_CLEAN)"; \
	$(ECHO) "$(MAGENTA)other:\n\t$(LST_RULE_OTHER)"; \
	$(MSG_RESET)


# ---------------------------------   run   --------------------------------- #

RUN_CMD = $(call MSG_CMD,$(1),$(2)) $(1); $(MSG_RESET)



# -------------------------------    RULES    ------------------------------- #

# ---------------------------------   all   --------------------------------- #

.DEFAULT_GOAL	:= all
.PHONY	: all
all		: refresh


# ----------------------------   transcendence   ---------------------------- #

.PHONY	: $(NAME)
$(NAME)	: up


# ----------------------------------   up   ---------------------------------- #

.PHONY	: up
up		: $(CERT_AND_KEY) | $(BUILD_DIR)
	$(call RUN_CMD,$(DC_UP))


# -------------------------------   refresh   ------------------------------- #

.PHONY	: refresh
refresh	: $(CERT_AND_KEY) | $(BUILD_DIR)
	$(call RUN_CMD,$(DC_REFRESH))


# --------------------------------   build   -------------------------------- #

.PHONY	: build
build	: $(CERT_AND_KEY) | $(BUILD_DIR)
	$(call RUN_CMD,$(DC_BUILD))


# ---------------------------------   down   --------------------------------- #

.PHONY	: down
down	:
	$(call RUN_CMD,$(DC_DOWN))


# --------------------------------   vdown   -------------------------------- #

.PHONY	: vdown
vdown	:
	$(call RUN_CMD,$(DC_VDOWN))


# --------------------------------   start   -------------------------------- #

.PHONY	: start
start	:
	$(call RUN_CMD,$(DC_START))


# ---------------------------------   stop   --------------------------------- #

.PHONY	: stop
stop	:
	$(call RUN_CMD,$(DC_STOP))


# -------------------------------   restart   ------------------------------- #

.PHONY	: restart
restart	:
	$(call RUN_CMD,$(DC_RESTART))


# ----------------------------------   re   ---------------------------------- #

.PHONY	: re
re		: down up


# --------------------------------   fullre   -------------------------------- #

.PHONY	: fullre
fullre	: fclean up


# -------------------------------   openssl   ------------------------------- #

$(CERT_AND_KEY) : | $(BUILD_DIR)
	$(call RUN_CMD,$(call CMD_OPENSSL,$(KEY_FRONT),$(CERT_FRONT),$(DOMAIN_FRONT)),$(F_GRAY))
	$(call RUN_CMD,$(call CMD_OPENSSL,$(KEY_BACK),$(CERT_BACK),$(DOMAIN_BACK)),$(F_GRAY))


# ---------------------------   build directory   --------------------------- #

$(BUILD_DIR) :
	$(call RUN_CMD,$(MKDIR))


# ---------------------------------   help   --------------------------------- #

.PHONY	: help
help	:
	$(MSG_HELP)


# ---------------------------------   info   --------------------------------- #

.PHONY	: info
info	: ls logs


# ----------------------------------   ls   ---------------------------------- #

.PHONY	: ls
ls		:
	$(call RUN_CMD,docker ps -as,$(GREEN))
	$(call RUN_CMD,docker image ls,$(YELLOW))
	$(call RUN_CMD,docker volume ls,$(BLUE))
	$(call RUN_CMD,docker network ls,$(MAGENTA))


# ---------------------------------   logs   --------------------------------- #

.PHONY	: logs
logs	:
	-$(call RUN_CMD,docker logs nginx,$(GREEN))
	-$(call RUN_CMD,docker logs frontend,$(YELLOW))
	-$(call RUN_CMD,docker logs gateway,$(BLUE))
	-$(call RUN_CMD,docker logs auth,$(BLUE))
	-$(call RUN_CMD,docker logs game,$(BLUE))
	-$(call RUN_CMD,docker logs user,$(BLUE))
	-$(call RUN_CMD,docker logs jwt,$(BLUE))


# --------------------------------   clean   -------------------------------- #

.PHONY	: clean
clean	: down
	-$(call RUN_CMD,docker stop $$(docker ps -aq),$(YELLOW))
	-$(call RUN_CMD,docker rm $$(docker ps -aq),$(BLUE))
	-$(call RUN_CMD,docker image rm -f $$(docker images -q),$(MAGENTA))
	-$(call RUN_CMD,docker réseau rm $$(docker network ls -q),$(CYAN))


# --------------------------------   vclean   -------------------------------- #

.PHONY	: vclean
vclean	: clean
	-$(call RUN_CMD,$(RM) $(BUILD_DIR),$(YELLOW))
	-$(call RUN_CMD,docker volume rm $$(docker volume ls -q),$(BLUE))


# --------------------------------   fclean   -------------------------------- #

.PHONY	: fclean
fclean	: vclean
	-$(call RUN_CMD,docker system prune -a -f,$(MAGENTA))


# ---------------------------------   dev   --------------------------------- #

.PHONY	: dev
dev	: vdown refresh
