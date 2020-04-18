#include "srvr.h"

void setup() 
{
  Serial.begin(115200);
  delay(10);
  SPIInit();
  SrvSetup();
}

void loop() 
{
  SrvLoop();
}
