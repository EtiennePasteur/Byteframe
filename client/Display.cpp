#include "Display.h"

#include "ErrorImage.h"
#include "WifiImage.h"

// The SPI pin definitions.
#define PIN_SPI_SCK 13
#define PIN_SPI_DIN 14
#define PIN_SPI_CS 15
#define PIN_SPI_BUSY 25
#define PIN_SPI_RST 26
#define PIN_SPI_DC 27

// The length in bytes per chunk when sending a static image.
const size_t kStaticImageChunkLength = 1024;

void Display::Initialize() {
  Serial.println("Initializing display");

  // Initialize SPI.
  pinMode(PIN_SPI_BUSY, INPUT);
  pinMode(PIN_SPI_RST, OUTPUT);
  pinMode(PIN_SPI_DC, OUTPUT);
  pinMode(PIN_SPI_SCK, OUTPUT);
  pinMode(PIN_SPI_DIN, OUTPUT);
  pinMode(PIN_SPI_CS, OUTPUT);
  digitalWrite(PIN_SPI_CS, HIGH);
  digitalWrite(PIN_SPI_SCK, LOW);

  // Initialize the display.
  Reset();
  SendCommandArgs(0x01, "\x07\x07\x3f\x3f");
  SendCommand(0x04);
  delay(100);
  WaitForIdle();
  SendCommandArgs(0X00, "\x0F");
  SendCommandArgs(0x61, "\x03\x20\x01\xE0");
  SendCommandArgs(0X15, "\x00");
  SendCommandArgs(0X50, "\x11\x07");
  SendCommandArgs(0X60, "\x22");
  SendCommand(0x10);
  for(int i = 0; i < 800 / 8 * 480; i++) SendData(0x00);
  SendCommand(0x13);
  for(int j = 0; j < 800 / 8 * 480; j++) SendData(0x00);
  SetBlackChanel();
}

void Display::SetBlackChanel() {
  SendCommand(0x10);
}

void Display::SetRedChanel() {
  SendCommand(0x13);
}

void Display::Load(const char* image_data, size_t length, bool isRedChanel) {
  Serial.printf("Loading image data: %d bytes\n", length);
  for (int i = 0; i < length;) {
    int value = ((int)image_data[i] - 'a') + (((int)image_data[i + 1] - 'a') << 4);
    if (!isRedChanel) SendData(value);
    else SendData(~value);
    i += 2;
  }
}

void Display::Update() {
  // Refresh.
  Serial.println("Refreshing image");
  SendCommand(0x12);  // DISPLAY_REFRESH
  delay(100);
  WaitForIdle();

  // Sleep.
  Serial.println("Suspending display");
  SendCommand(0x02);  // POWER_OFF
  WaitForIdle();
  SendCommandArgs(0x07, "\xA5");  // DEEP_SLEEP
}

void Display::ShowError() { ShowStatic(kErrorImageBlack, kErrorImageRed, sizeof(kErrorImageBlack)); }

void Display::ShowWifiSetup() { ShowStatic(kWifiImageBlack, kWifiImageRed, sizeof(kWifiImageBlack)); }

void Display::Reset() {
  digitalWrite(PIN_SPI_RST, LOW);
  delay(200);
  digitalWrite(PIN_SPI_RST, HIGH);
  delay(200);
}

void Display::SendCommandArgs(char command, const char* args...) {
  SendCommand(command);
  for (; *args != '\0'; ++args) {
    SendData(*args);
  }
}

void Display::SendCommand(char command) {
  digitalWrite(PIN_SPI_DC, LOW);
  SendSpi(command);
}

void Display::SendData(char data) {
  digitalWrite(PIN_SPI_DC, HIGH);
  SendSpi(data);
}

void Display::SendSpi(char data) {
  digitalWrite(PIN_SPI_CS, LOW);
  for (int i = 0; i < 8; ++i) {
    if ((data & 0x80) == 0) {
      digitalWrite(PIN_SPI_DIN, LOW);
    } else {
      digitalWrite(PIN_SPI_DIN, HIGH);
    }
    data <<= 1;
    digitalWrite(PIN_SPI_SCK, HIGH);
    digitalWrite(PIN_SPI_SCK, LOW);
  }
  digitalWrite(PIN_SPI_CS, HIGH);
}

void Display::WaitForIdle() {
  unsigned char busy;
  do{
    SendCommand(0x71);
    busy = digitalRead(PIN_SPI_BUSY);
    busy =!(busy & 0x01);
  } while(busy);
  delay(200);
}

void Display::ShowStatic(const char* imageBlack, const char* imageRed, size_t length) {
  Serial.println("Showing static image");

  Initialize();

  const char* black_ptr = imageBlack;
  const char* black_end = black_ptr + length - 1 /* null terminator */;
  do {
    size_t chunk_length = min(kStaticImageChunkLength, static_cast<size_t>(black_end - black_ptr));
    Load(black_ptr, chunk_length, false);
    black_ptr += chunk_length;
  } while (black_ptr < black_end);

  SetRedChanel();

  const char* red_ptr = imageRed;
  const char* red_end = red_ptr + length - 1 /* null terminator */;
  do {
    size_t chunk_length = min(kStaticImageChunkLength, static_cast<size_t>(red_end - red_ptr));
    Load(red_ptr, chunk_length, true);
    red_ptr += chunk_length;
  } while (red_ptr < red_end);

  Update();
}
