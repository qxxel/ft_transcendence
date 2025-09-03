# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile.builder                                 :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/09/03 11:40:36 by agerbaud          #+#    #+#              #
#    Updated: 2025/09/03 11:48:26 by agerbaud         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM	node:18-bookworm

WORKDIR	/app

# Copy config files
COPY	package*.json ./
COPY	tsconfig.json ./

# Install dependencies
RUN		npm install

# Copy source code
COPY	src/ ./src/

# Expose a volume to retrieve the compiled files
VOLUME	["/app/dist"]

# Par défaut, juste compiler (on peut override avec docker run)
CMD	["npm", "run", "build"]
