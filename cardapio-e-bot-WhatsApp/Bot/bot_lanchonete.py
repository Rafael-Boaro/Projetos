from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import datetime

# --- CONFIGURAÇÕES ---
ultimas_mensagens_processadas = [] 

def salvar_pedido_no_txt(nome_cliente, pedido_texto, info_pagamento, endereco):
    agora = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
    try:
        with open("vendas_dia.txt", "a", encoding='utf-8') as arquivo:
            arquivo.write("======================================\n")
            arquivo.write(f"DATA: {agora}\n")
            arquivo.write(f"CLIENTE: {nome_cliente}\n")
            arquivo.write(f"PAGAMENTO: {info_pagamento}\n")
            arquivo.write(f"ENTREGA: {endereco}\n")
            arquivo.write("RESUMO:\n")
            if pedido_texto:
                # Limpa o texto para salvar apenas itens do pedido
                for linha in pedido_texto.split('\n'):
                    if "|" in linha: 
                        arquivo.write(f"  > {linha.strip()}\n")
            arquivo.write("======================================\n\n")
        print(f"✅ CAIXA: Pedido de {nome_cliente} salvo!")
    except Exception as e:
        print(f"Erro ao salvar: {e}")

print("--- GARÇOM DIGITAL 4.0 (BLINDADO) ---")
options = webdriver.ChromeOptions()
options.add_argument("--log-level=3")
driver = webdriver.Chrome(options=options)
driver.get("https://web.whatsapp.com/")

print(">>> ESCANEIE O QR CODE <<<")
try:
   
    WebDriverWait(driver, 60).until(
        EC.presence_of_element_located((By.ID, "pane-side"))
    )
    print("Bot Online! 🤖")
except:
    print("QR Code não lido a tempo.")

memoria_clientes = {}

def escutar_mensagens():
    try:
      
        bolinhas = driver.find_elements(By.XPATH, '//span[contains(@aria-label, "não lida")]')
        
        if not bolinhas:
            bolinhas = driver.find_elements(By.XPATH, '//span[@aria-label][contains(.,"não lida")]')

        if len(bolinhas) > 0:
            print(f"⚡ Nova mensagem! Abrindo conversa...")
            conversa = bolinhas[0]
            conversa.click()
            
            ler_e_responder()
            
            try:
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
            except:
                pass
            
    except Exception as e:
        pass

def ler_e_responder():
    global ultimas_mensagens_processadas
    try:

        painel_principal = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "main"))
        )
        
        nome_cliente = "Cliente"
        try:
            nome_element = painel_principal.find_element(By.XPATH, './/header//div[@role="button"]//span')
            nome_cliente = nome_element.text
        except:
            pass

        linhas = painel_principal.find_elements(By.CSS_SELECTOR, 'div[role="row"]')
        
        if not linhas:
            return


        ultima_linha = linhas[-1]
        

        texto_bruto = ultima_linha.text.lower()
        

        if f"{nome_cliente}-{texto_bruto}" in ultimas_mensagens_processadas:
            return


        partes = texto_bruto.split('\n')
        texto_msg = partes[0]
        
        if "#pedido_site" in texto_bruto:
            texto_msg = texto_bruto

        print(f"📩 {nome_cliente}: {texto_msg[:50]}...") 

        processar_resposta(texto_msg, nome_cliente)
        
        chave_unica = f"{nome_cliente}-{texto_bruto}"
        ultimas_mensagens_processadas.append(chave_unica)
        if len(ultimas_mensagens_processadas) > 20:
            ultimas_mensagens_processadas.pop(0)

    except Exception as e:
        print(f"⚠️ Erro ao ler conversa: {e}")

def processar_resposta(texto, nome_cliente):
    global memoria_clientes
    
    # --- INTEGRAÇÃO SITE ---
    if "#pedido_site" in texto:
        print("🎯 PEDIDO IDENTIFICADO!")
        memoria_clientes[nome_cliente] = 'ENDERECO'
        memoria_clientes[nome_cliente + '_resumo'] = texto
        

        total = "?"
        if "total:" in texto:
            try:

                total = texto.split("total:")[1].split("\n")[0].strip()
            except:
                pass
            
        msg = f"🤖 *PEDIDO RECEBIDO!* (Total: {total})\nPara agilizar, digite seu **ENDEREÇO COMPLETO** (Rua, Nº e Bairro):"
        enviar_mensagem(msg)
        return

    if nome_cliente not in memoria_clientes:
        memoria_clientes[nome_cliente] = 'MENU'

        enviar_mensagem("Olá! 🍔 Sou o Robô de Atendimento.\nFaça seu pedido pelo nosso Cardápio Digital:\n👉 [LINK-DO-SEU-SITE-AQUI]")
        return

    estado = memoria_clientes[nome_cliente]

    if estado == 'ENDERECO':
        memoria_clientes[nome_cliente + '_endereco'] = texto
        memoria_clientes[nome_cliente] = 'PAGAMENTO'
        enviar_mensagem("Ok! 📍\nQual a forma de pagamento? (Pix, Dinheiro ou Cartão)")

    elif estado == 'PAGAMENTO':
        salvar_pedido_no_txt(
            nome_cliente,
            memoria_clientes.get(nome_cliente + '_resumo', ''),
            texto, 
            memoria_clientes.get(nome_cliente + '_endereco', '')
        )
        enviar_mensagem("✅ Pedido Confirmado! Enviado para a cozinha.\nTempo estimado: 40-50min.")
        if nome_cliente in memoria_clientes: del memoria_clientes[nome_cliente]

def enviar_mensagem(msg):
    try:
        painel_principal = driver.find_element(By.ID, "main")
        caixa_texto = painel_principal.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
        
        if caixa_texto:
            caixa_texto[0].click()
            time.sleep(0.5)
            
 
            for linha in msg.split('\n'):
                caixa_texto[0].send_keys(linha)
                webdriver.ActionChains(driver).key_down(Keys.SHIFT).send_keys(Keys.ENTER).key_up(Keys.SHIFT).perform()
            
            caixa_texto[0].send_keys(Keys.ENTER)
    except Exception as e:
        print(f"Erro ao enviar: {e}")

while True:
    escutar_mensagens()
    time.sleep(2)