from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time
import os

chrome_service = Service(executable_path="/usr/bin/chromedriver")
driver = webdriver.Chrome(service=chrome_service)


driver.get("http://127.0.0.1:5500")
driver.maximize_window()
time.sleep(2)
driver.find_element(By.ID, "user").send_keys('1019987036')
driver.find_element(By.ID, "passwd").send_keys("no")
driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
time.sleep(2)
mensaje_elementos = driver.find_elements(By.ID, "feedbackText")
if mensaje_elementos:
    mensaje = mensaje_elementos[0].text
    print("Error detectado, mensaje recibido:", mensaje)
else:
    print("login exitoso")

celda_grupo = driver.find_element(By.XPATH, "//td[contains(text(), 'Programacion Lineal Grupo N')]")
celda_grupo.click()

time.sleep(2)
driver.find_element(By.ID, "entregarTareaBtn_1").click()

input_file = driver.find_element(By.ID, "archivo_entrega")
input_file.send_keys('/home/aphroth/Downloads/docxs/Taller Arquitectura y Patrones.docx')
nombre_archivo = os.path.basename('/home/aphroth/Downloads/docxs/Taller Arquitectura y Patrones.docx')
print(f"Archivo seleccionado: {nombre_archivo}")
driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

time.sleep(5)
alert = driver.switch_to.alert
print(alert.text)
alert.accept()

time.sleep(2)
driver.quit()
