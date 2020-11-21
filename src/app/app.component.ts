import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appJasmin';
  latitude: number;
  longitude: number;
  //private canvas: HTMLCanvasElement;
  // private ctx: CanvasRenderingContext2D;
  private circle = { x: 100, y: 100, size: 20, dx: 3, dy: 2 };

  @ViewChild('canvas', { static: true })
  protected canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

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
      // this.watchPosition();
    }

    this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // this.ctx = this.canvas.getContext("2d");

    //this.drawCircle();
    this.update();

    // var x = 0;
    // setInterval(() => {
    //   this.ctx.clearRect(0, 0, 200, 200);
    //   this.drawCircle(x % 200);
    //   // this.drawBorder(x % 200);
    //   x++;
    // }, 25);
  }

  /**
   *
   */
  drawCircle() {
    this.ctx.beginPath();
    this.ctx.arc(this.circle.x, this.circle.y, this.circle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = 'purple';
    this.ctx.fill();
  }
  // drawCircle(x) {
  //   this.ctx.beginPath();
  //   this.ctx.arc(x, 100, 10, 0, 2 * Math.PI);
  //   this.ctx.fillStyle = "red";
  //   this.ctx.fill();
  // }

  /** */
  drawBorder(x) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(200, 0);
    this.ctx.lineTo(200, 200);
    this.ctx.lineTo(0, 200);
    this.ctx.lineTo(0, 0);
    this.ctx.stroke();
  }

  /** */
  update() {
    // console.log(this.ctx);
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawCircle();

    // chnage position
    this.circle.x += this.circle.dx;
    this.circle.y += this.circle.dy;

    // detect side walls | top & bottom walls
    if (this.circle.x + this.circle.size > this.canvas.nativeElement.width || this.circle.x - this.circle.size < 0) {
      this.circle.dx *= -1;
    }
    if (this.circle.y + this.circle.size > this.canvas.nativeElement.height || this.circle.y - this.circle.size < 0) {
      this.circle.dy *= -1;
    }
    window.requestAnimationFrame(this.update);
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
