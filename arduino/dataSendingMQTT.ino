
#include "DHT.h" 
#include <WiFiEspClient.h> 
#include <WiFiEsp.h> 
#include <PubSubClient.h> 
#include "SoftwareSerial.h" 

#define WIFI_AP "" //Name of the WIFI
#define WIFI_PASSWORD "" //Password
#define DHTPIN 5 
#define DHTTYPE DHT11 

IPAddress server(192, 168, 50, 121); //IP
WiFiEspClient espClient; 
DHT dht(DHTPIN, DHTTYPE); 
PubSubClient client(espClient);
SoftwareSerial soft(10, 11); // RX, TX int status = WL_IDLE_STATUS; unsigned long lastSend; 
int status = WL_IDLE_STATUS; 

void setup() {
  Serial.begin(9600);   
  dht.begin();   
  InitWiFi();   
  client.setServer( server, 1883 );   
}

void loop() {  
  if ( !client.connected() ) reconnect();
  getAndSendTemperatureAndHumidityData();  
  client.loop(); 
  delay(1000);
}

void getAndSendTemperatureAndHumidityData() {   
  Serial.println("Collecting temperature data.");   
  float h = dht.readHumidity();   
  float t = dht.readTemperature();   
  if (isnan(h) || isnan(t)) {     
    Serial.println("Failed to read from DHT sensor!");     
    return;   
  }
  String temperature = String(t);   
  String humidity = String(h);
 
  String payload = "{";   
  payload += "\"temperature\":";    
  payload += temperature;    
  payload +=     ",";   
  payload += "\"humidity\":";    
  payload += humidity;   
  payload += "}";   
  char attributes[100];   
  payload.toCharArray( attributes, 100 );   
  client.publish( "arduino", attributes );   
  Serial.println( attributes ); 
}

void InitWiFi() {
  soft.begin(9600);   
  WiFi.init(&soft);   
  if (WiFi.status() == WL_NO_SHIELD) {     
    Serial.println("WiFi shield not present");     
    while (true);   
  } 
  Serial.println("Connecting to AP ...");  
  while (status != WL_CONNECTED) {
     Serial.print("Attempting to connect to WPA SSID: ");       
     Serial.println(WIFI_AP);      
     status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
     delay(500);     
  }     
  Serial.println("Connected to AP");     
} 

void reconnect() {
  while (!client.connected()) {
    Serial.print("MQTT conectando...");
    if(client.connect("")){
       Serial.println("conectado !");
    }else{
       Serial.print("fallo, rc=");
       Serial.print(client.state());
       Serial.println(" try again in 5 seconds");
       delay(5000);
    }
  }
}
