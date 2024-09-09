#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();

}

void loop() {
  // Verifica se existe um novo cartão presente
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Verifica se é possível ler o cartão
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Mostra o UID do cartão na Serial
  Serial.print("UID:");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();
  
  mfrc522.PICC_HaltA(); // Para a leitura do cartão
}