// // src/app/services/mqtt-websocket.service.ts
// import { Injectable } from '@angular/core';
// // import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class MqttWebSocketService {
//   private socket: Socket;
//   private readonly serverUrl = 'http://localhost:3000'; // Replace with your NestJS server URL
//
//   constructor() {
//     this.socket = io(this.serverUrl); // Connect to the WebSocket server
//   }
//
//   // Listen for sensor data from the server
//   listenToSensorData(): Observable<any> {
//     return new Observable((observer) => {
//       // this.socket.on('sensorData', (data) => {
//       //   observer.next(data);
//       // });
//
//       // Handle disconnection
//       return () => this.socket.disconnect();
//     });
//   }
// }
