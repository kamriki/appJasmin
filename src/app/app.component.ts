import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appJasmin';
  latitude: number;
  longitude: number;

  /**
   * get device geolocation
   * ensure geolocation permission is requested on iPhone - ToDo
   */
  ngOnInit() {
    if (!navigator.geolocation) { console.log('location is not supported'); }
    else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }
}
