import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client;
export const connectWebSocket = (busNumber, onMessage) => {
  client = new Client({
    webSocketFactory: () => new SockJS("/ws"),
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      client.subscribe(`/topic/bus/${busNumber}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    };
    
  client.activate();
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
    console.log("WebSocket disconnected");
  }
};