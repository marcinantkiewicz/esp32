#include <HTTPClient.h>
#include "max6675.h"

#define relay 16
#define SCK 15
#define CS 14
#define SO 13

MAX6675 tc(SCK, CS, SO);

const char* ssid = "derp";
const char* password = PW_HERE;
const char* server = "http://192.168.1.50:3003/sensors/data";
const int report_interval = 60;


void setup() {
  Serial.begin(115200);

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    sleep(1);
  }
  Serial.println();
  Serial.print("WiFi Mac: ");
  Serial.println(WiFi.macAddress());
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Sending to server at: ");
  Serial.println(server);

  pinMode(relay, OUTPUT);
}

void httpGetRequest(const char* server, float h, float t) {
  HTTPClient http;
  const char* schema = "dht";
  const char* sensor_name = "dht1";
  char url[100];
  sprintf(url, "%s/dht?sn=%s&h=%d&t=%d", server, sensor_name, (int)h, (int)t);
  http.begin(url);
  Serial.print("url: ");
  Serial.println(url);

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    Serial.println('url is:' + url);
    Serial.println("HTTP Response Code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.println(url);
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

int counter = 0;
void loop() {
  Serial.print("Counter: ");
  Serial.println(counter++);

  digitalWrite(relay, LOW);
  sleep(1);
  digitalWrite(relay, HIGH);
  sleep(2);

  Serial.println(tc.readFahrenheit());
}