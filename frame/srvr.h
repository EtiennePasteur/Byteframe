#include <WiFi.h>

#include "buff.h" 
#include "epd.h"

const char *ssid = "DGSI_VAN_2";
const char *password = "!_W367RE,2_g_1t.2!M92_5oFRy6cL_6";

WiFiServer server(80);

void SrvSetup()
{
    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    server.begin();
    Serial.print("Server started, listening on: ");
    Serial.println(WiFi.localIP());
}

bool SrvLoop()
{
    WiFiClient client = server.available();
    if (!client) return false;
    while (!client.available()) delay(1);

    BufferIndex = 0;
    while (client.available()) {
        int q = client.read();
        BufferArray[BufferIndex++] = (byte)q;

        if ((q == 10) || (q == 13)) {
            BufferIndex = 0;
            continue;
        }

        if (BufferIndex > 4) {
            if (getSignature(BufferIndex - 4, "EPD")) {
                Serial.println("EPD");
                Initalization();
                DispLoad = Load;
                break;
            }
            if (getSignature(BufferIndex - 4, "LOAD")) {
                Serial.println("LOAD");
                DispLoad();
                break;
            }
            if (getSignature(BufferIndex - 4, "NEXT")) {
                Serial.println("NEXT");
                SendCommand(0x13);
                DispLoad = LoadFilp;
                break;
            }
            if (getSignature(BufferIndex - 4, "SHOW")) {
                Serial.println("SHOW");
                Show();
                break;
            }
        }
    }
    client.flush();
    return true;
}
