/*-importacao Necessaria*/
 
int pinoSensor =A0;
 
int sensorValue_aux = 0;
float valorSensor = 0;
float valorCorrente = 0;
float voltsporUnidade = 0.004887586;// 5%1023
// Para ACS712 de  5 Amperes use 0.185
// Para ACS712 de 10 Amperes use 0.100
//  Para ACS712 de 5 Amperes use 0.066
float sensibilidade = 0.066;
 
//Tensao da rede AC 110 Volts e na verdade (127 volts)
int tensao = 220
int inicio
 
 
void setup() {
 
 
  //Incia a Serial
  Serial.begin(9600);
  pinMode(pinoSensor, INPUT);
  inicio = millis();

}
 
void loop() {
 
  for(int i=1000; i>0; i--){
    // le o sensor na pino analogico A0 e ajusta o valor lido ja que a saída do sensor é (1023)vcc/2 para corrente =0
    sensorValue_aux = (analogRead(pinoSensor) -511);
    // somam os quadrados das leituras.
    valorSensor += pow(sensorValue_aux,2);
  }
 
  // finaliza o calculo da média quadratica e ajusta o valor lido para volts
  valorSensor = (sqrt(valorSensor/ 1000)) * voltsporUnidade;
  // calcula a corrente considerando a sensibilidade do sernsor (185 mV por amper)
  valorCorrente = (valorSensor/sensibilidade);
 
  //tratamento para possivel ruido
  //O ACS712 para 30 Amperes é projetado para fazer leitura
  // de valores alto acima de 0.25 Amperes até 30.
  // por isso é normal ocorrer ruidos de até 0.20A
  //por isso deve ser tratado
  if(valorCorrente <= 0.095){
    valorCorrente = 0;
  }
 
  valorSensor =0;
 
 
 
  //Mostra o valor da corrente
  //Serial.print("Corrente : ");
  // Irms
  //Serial.print(valorCorrente, 3);
  //Serial.print(" A ");

  //Pula para segunda linha na posicao 0

  //Escreve
  //Calcula e mostra o valor da potencia
  //Serial.print(" Valoe (Consumo) : ");
  if(millis() - inicio >= 1000){
    
    Serial.println(valorCorrente * tensao);
    inicio = millis();
  }
  //Serial.println(" Watts ");
  
 
}
