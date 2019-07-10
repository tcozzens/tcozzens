import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as signalR from '@aspnet/signalr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css']
})
export class SignalrComponent implements OnInit {
  userName = new FormControl('');
  message = new FormControl('');

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit(): void {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('http://localhost:5000/notify')
      // For prod
      // .withUrl('http://signalrapi-prod.us-east-1.elasticbeanstalk.com/notify')
      .build();

    connection
      .start()
      .then(() => console.log('Connected!'))
      .catch(err => console.log(err.toString()));

    connection.on('BroadcastMessage', (type: string, payload: string) => {
      const payloadObject = JSON.parse(payload);

      this.snackBar.open(payloadObject.Message, 'Close', { duration: 3000 });
    });
  }

  open() {
    this.http.post('http://localhost:5000/api/message',
      {
        Type: 'message',
        Payload: JSON.stringify({ UserName: this.userName.value, Message: this.message.value, Date: new Date().toUTCString() })
      }).subscribe();
  }

}
