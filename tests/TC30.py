from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time

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
driver.find_element(By.ID, "cambiarOrdenBtn").click()

print("Ejecucion correcta")

time.sleep(2)
driver.quit()
