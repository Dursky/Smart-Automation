import * as mqtt from 'mqtt';
import { EventEmitter } from 'events';
import { IScene } from '../types/scene';

interface TasmotaDevice {
  id: string;
  topic: string;
  groupTopic?: string;
  state: 'ON' | 'OFF';
}

export class TasmotaManager extends EventEmitter {
  private client: mqtt.MqttClient;
  private devices: Map<string, TasmotaDevice> = new Map();
  private groupTopics: Set<string> = new Set();

  constructor(brokerUrl: string) {
    super();
    this.client = mqtt.connect(brokerUrl);
    this.client.on('connect', this.onConnect.bind(this));
    this.client.on('message', this.onMessage.bind(this));
  }

  private onConnect() {
    console.log('-> Connected to MQTT broker');
    this.client.subscribe('tele/+/+');
    this.client.subscribe('stat/+/+');
    this.client.publish('cmnd/tasmotas/Status', '0');
  }

  private onMessage(topic: string, message: Buffer) {
    const [prefix, id, command] = topic.split('/');

    if (prefix === 'tele' && command === 'LWT') {
      this.handleLWT(id, message.toString());
    } else if (prefix === 'stat' && command === 'STATUS') {
      this.handleStatus(id, message.toString());
    } else if (prefix === 'stat' && command === 'RESULT') {
      this.handleResult(id, message.toString());
    }
  }

  private handleLWT(id: string, message: string) {
    if (message === 'Online') {
      if (!this.devices.has(id)) {
        this.devices.set(id, { id, topic: `cmnd/${id}`, state: 'OFF' });
        this.client.publish(`cmnd/${id}/Status`, '0');
      }
    } else if (message === 'Offline') {
      this.devices.delete(id);
      this.emit('deviceLost', id);
    }
  }

  private handleStatus(id: string, message: string) {
    try {
      const status = JSON.parse(message);
      const device = this.devices.get(id);
      if (device) {
        device.state = status.Status.Power === 1 ? 'ON' : 'OFF';
        if (status.Status.GroupTopic) {
          device.groupTopic = status.Status.GroupTopic;
          this.groupTopics.add(status.Status.GroupTopic);
        }
        this.emit('deviceUpdated', device);
      }
    } catch (error) {
      console.error('Error parsing status:', error);
    }
  }

  private handleResult(id: string, message: string) {
    try {
      const result = JSON.parse(message);
      const device = this.devices.get(id);
      if (device && 'POWER' in result) {
        device.state = result.POWER;
        this.emit('stateChanged', device);
      }
    } catch (error) {
      console.error('Error parsing result:', error);
    }
  }

  listDevices(): TasmotaDevice[] {
    return Array.from(this.devices.values());
  }

  toggleDevice(deviceId: string, state: 'ON' | 'OFF'): { success: boolean; error?: string } {
    const device = this.devices.get(deviceId);
    console.log(`cmnd/${deviceId}/POWER`, state);

    if (device) {
      device.state = state;

      this.client.publish(`cmnd/${deviceId}/POWER`, state);
      this.emit('deviceUpdated', device);
      return { success: true };
    } else {
      return { success: false, error: `Device with id ${deviceId} not found` };
    }
  }
  executeScene(scene: IScene): void {
    scene.actions.forEach((action) => {
      this.toggleDevice(action.deviceId, action.state);
    });
  }
}
