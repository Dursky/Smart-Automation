export default {
	port: process.env.PORT || 3000,
	mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/tasmota-control",
	jwtSecret: process.env.JWT_SECRET || "your-secret-key",
	mqttBrokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
}
