from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time

chrome_service = Service(executable_path="/usr/bin/chromedriver")
driver = webdriver.Chrome(service=chrome_service)


driver.get("http://127.0.0.1:5500")
driver.maximize_window()
time.sleep(2)
driver.find_element(By.ID, "user").send_keys('1019986037')
driver.find_element(By.ID, "passwd").send_keys("gcc")
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

driver.find_element(By.XPATH, "//table[@id='tareasTable']//button[text()='Editar']").click()
driver.find_element(By.ID, "titulo").send_keys('Titulo')
driver.find_element(By.ID, "descripcion").send_keys('Descripcion')
driver.find_element(By.ID, "fecha_inicio").send_keys('05-20-002025:10:00AM')
driver.find_element(By.ID, "fecha_final").send_keys('05-20-002025:12:00AM')
driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
time.sleep(4)
alert = driver.switch_to.alert
print(alert.text)
alert.accept()

time.sleep(2)
driver.quit()
