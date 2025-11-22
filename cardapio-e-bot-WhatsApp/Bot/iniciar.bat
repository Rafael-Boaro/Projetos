@echo off
title SISTEMA DE PEDIDOS - GARCOM DIGITAL
color 0A
echo ==========================================
echo      INICIANDO O ROBO DE ATENDIMENTO
echo ==========================================
echo.
echo 1. O Navegador vai abrir em instantes.
echo 2. Se pedir permissao de firewall, aceite.
echo.
echo MANTENHA ESTA JANELA ABERTA ENQUANTO TRABALHA.
echo.

:: --- MODO DESENVOLVEDOR ---
python bot_lanchonete.py

pause