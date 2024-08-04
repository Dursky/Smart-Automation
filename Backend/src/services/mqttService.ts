import * as mqtt from 'mqtt';
import config from '../config';

class MqttService {
  private client: mqtt.MqttClient;

  constructor() {
    this.client = mqtt.connect(config.mqttBrokerUrl);

    this.client.on('connect', () => {
      console.log('-> Connected to MQTT broker');
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error);
    });
  }

  publish(topic: string, message: string): void {
    this.client.publish(topic, message);
  }

  subscribe(topic: string, callback: (topic: string, message: Buffer) => void): void {
    this.client.subscribe(topic);
    this.client.on('message', callback);
  }
}

export default new MqttService();
