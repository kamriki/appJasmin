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
   * get or watch device geolocation
   * ensure geolocation permission is requested on iPhone - ToDo
   */
  ngOnInit() {
    if (!navigator.geolocation) { console.log('location is not supported'); }
    else {
      // navigator.geolocation.getCurrentPosition((position) => {
      //   this.latitude = position.coords.latitude;
      //   this.longitude = position.coords.longitude;
      // });
      this.watchPosition();
    }
  }

  /**
   * update device geolocation every 5 sec
   */
  watchPosition() {
    navigator.geolocation.watchPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.saveLocal('coordinate', {
          time: new Date(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => { console.log(err); },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  /**
   * save coordinate with time in localStorage
   */
  saveLocal(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * get data from localStorage
   */
  getLocal(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(JSON.parse(value));
      //return JSON.parse(value)
    }
  }
}
