from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time

chrome_service = Service(executable_path="/usr/bin/chromedriver")
driver = webdriver.Chrome(service=chrome_service)

try:
    driver.get("http://127.0.0.1:5500")
    driver.maximize_window()
    time.sleep(2)

    campo_user = driver.find_element(By.ID, "user")
    campo_pass = driver.find_element(By.ID, "passwd")
    campo_pass.send_keys("no")

    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)

    mensaje_validacion = driver.execute_script(
        'return arguments[0].validationMessage;',
        campo_user
    )

    if mensaje_validacion:
        print("Mensaje de validación del navegador:", mensaje_validacion)
    else:
        print("No se encontró un mensaje de validación nativo.")

except Exception as e:
    print("Error durante la prueba:", e)
finally:
    time.sleep(2)
    driver.quit()
