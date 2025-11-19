# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    color.mk                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: agerbaud <agerbaud@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/11/08 00:43:58 by mreynaud          #+#    #+#              #
#    Updated: 2025/11/19 16:39:08 by agerbaud         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# -------------------------------   FORMATTING   ------------------------------- #

ESC		= \033


# -------------------------------   TEXT STYLES   ------------------------------- #

NORMAL		= 0
BOLD		= 1
FAINT		= 2
ITALIC		= 3
UNDERLINE	= 4


# -------------------------------   FOREGROUND   ------------------------------- #

FG_BLACK	= 30
FG_RED		= 31
FG_GREEN	= 32
FG_YELLOW	= 33
FG_BLUE		= 34
FG_MAGENTA	= 35
FG_CYAN		= 36
FG_WHITE	= 37


# -------------------------------   BACKGROUND   ------------------------------- #

BG_BLACK	= 40
BG_RED		= 41
BG_GREEN	= 42
BG_YELLOW	= 43
BG_BLUE		= 44
BG_MAGENTA	= 45
BG_CYAN		= 46
BG_WHITE	= 47


# -------------------------------   RESET   ------------------------------- #

RESET	= $(ESC)[$(NORMAL)m


# -------------------------------   COLOR   ------------------------------- #

GRAY	= $(ESC)[$(NORMAL);$(FG_BLACK)m
RED		= $(ESC)[$(NORMAL);$(FG_RED)m
GREEN	= $(ESC)[$(NORMAL);$(FG_GREEN)m
YELLOW	= $(ESC)[$(NORMAL);$(FG_YELLOW)m
BLUE	= $(ESC)[$(NORMAL);$(FG_BLUE)m
MAGENTA	= $(ESC)[$(NORMAL);$(FG_MAGENTA)m
CYAN	= $(ESC)[$(NORMAL);$(FG_CYAN)m
WHITE	= $(ESC)[$(NORMAL);$(FG_WHITE)m


# -------------------------------   CUSTOM COLOR   ------------------------------- #

B_WHITE	= $(ESC)[$(BOLD);$(FG_WHITE)m
F_GRAY	= $(ESC)[$(FAINT);$(FG_GRAY)m