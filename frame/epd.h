#define PIN_SPI_SCK  13
#define PIN_SPI_DIN  14
#define PIN_SPI_CS   15
#define PIN_SPI_BUSY 25
#define PIN_SPI_RST  26
#define PIN_SPI_DC   27

void (*DispLoad)();

void SPIInit()
{
  pinMode(PIN_SPI_BUSY, INPUT);
  pinMode(PIN_SPI_RST, OUTPUT);
  pinMode(PIN_SPI_DC, OUTPUT);
  
  pinMode(PIN_SPI_SCK, OUTPUT);
  pinMode(PIN_SPI_DIN, OUTPUT);
  pinMode(PIN_SPI_CS, OUTPUT);

  digitalWrite(PIN_SPI_CS, HIGH);
  digitalWrite(PIN_SPI_SCK, LOW);
}

void SPITransfer(byte data) 
{
  digitalWrite(PIN_SPI_CS, LOW);
  for (int i = 0; i < 8; i++) {
    if ((data & 0x80) == 0) digitalWrite(PIN_SPI_DIN, LOW); 
    else digitalWrite(PIN_SPI_DIN, HIGH);
    data <<= 1;
    digitalWrite(PIN_SPI_SCK, HIGH);
    digitalWrite(PIN_SPI_SCK, LOW);
  }
  digitalWrite(PIN_SPI_CS, HIGH);
}

void SendCommand(byte command) 
{
  digitalWrite(PIN_SPI_DC, LOW);
  SPITransfer(command);
}

void SendData(byte data) 
{
  digitalWrite(PIN_SPI_DC, HIGH);
  SPITransfer(data);
}

void SendCommandArgs(byte command, const char* args...) {
  SendCommand(command);
  for (; *args != '\0'; ++args) {
    SendData(*args);
  }
}

void Reset() 
{
  digitalWrite(PIN_SPI_RST, LOW);    
  delay(200);
  digitalWrite(PIN_SPI_RST, HIGH); 
  delay(200);    
}

void Load()
{
  BufferIndex -= 8;
  int pos = BufferIndex - getWord(BufferIndex);
  while (pos < BufferIndex)
  {
    int value = getByte(pos);
    SendData((byte)value);
    pos += 2;
  }
}

void LoadFilp()
{
  BufferIndex -= 8;
  int pos = BufferIndex - getWord(BufferIndex);
  while (pos < BufferIndex)
  {
    int value = getByte(pos);
    SendData(~(byte)value);
    pos += 2;
  }
}

void Readbusy(void)
{
  Serial.print("\r\ne-Paper busy\r\n");
  unsigned char busy;
  do{
    SendCommand(0x71);
    busy = digitalRead(PIN_SPI_BUSY);
    busy =!(busy & 0x01);
  } while(busy);   
  delay(200);      
  Serial.print("e-Paper busy release\r\n");
}

void Show(void)
{
  SendCommand(0x12);
  delay(100);
  Readbusy();

  SendCommand(0X02);
  Readbusy();
  SendCommand(0X07);
  SendData(0xA5);
}

void Initalization(void)
{
  Reset();
  SendCommandArgs(0x01, "\x07\x07\x3f\x3f");
  SendCommand(0x04);
  delay(100);
  Readbusy();
  SendCommandArgs(0X00, "\x0F");
  SendCommandArgs(0x61, "\x03\x20\x01\xE0");
  SendCommandArgs(0X15, "\x00");
  SendCommandArgs(0X50, "\x11\x07");
  SendCommandArgs(0X60, "\x22");
  SendCommand(0x10);
  for(int i = 0; i < 800 / 8 * 480; i++) SendData(0x00);
  SendCommand(0x13);
  for(int j = 0; j < 800 / 8 * 480; j++) SendData(0x00);
  SendCommand(0x10);
}
