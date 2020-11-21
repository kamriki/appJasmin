import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appJasmin';

  @ViewChild('canvas', { static: true })
  protected canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private mapWidth =  window.innerWidth * 0.9;
  private mapHeight = window.innerHeight * 0.7;
  private virusWidth = 10;
  public player: { x: number, y: number } = { x: null, y: null }; //!! set as private

  /**
   * get or watch device geolocation
   * ensure geolocation permission is requested on iPhone - ToDo
   * prepare Arena (playing Area) by setting width & hight with respect to the browser width/lenght
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

    this.canvas.nativeElement.width = this.mapWidth;
    this.canvas.nativeElement.height = this.mapHeight;

    this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.sendVirus(100, 10);
  }

  /**
   * to specify direction - ToDo
   */
  sendVirus(posY: number, speed: number) {
    var x = 0;
    setInterval(() => {
      this.ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
      this.creatVirus(x % this.mapWidth + this.virusWidth, posY);
      x++;
    }, speed);
  }

  /**
   * drawing of viruse
   */
  creatVirus(posX: number, posY: number) {
    this.ctx.beginPath();
    this.ctx.arc(posX, posY, this.virusWidth, 0, 2 * Math.PI);
    this.ctx.fillStyle = "purple";
    this.ctx.fill();
  }

  /** */
  // update() {
  //   // console.log(this.ctx);
  //   this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  //   this.drawCircle();

  //   // chnage position
  //   this.circle.x += this.circle.dx;
  //   this.circle.y += this.circle.dy;

  //   // detect side walls | top & bottom walls
  //   if (this.circle.x + this.circle.size > this.canvas.nativeElement.width || this.circle.x - this.circle.size < 0) {
  //     this.circle.dx *= -1;
  //   }
  //   if (this.circle.y + this.circle.size > this.canvas.nativeElement.height || this.circle.y - this.circle.size < 0) {
  //     this.circle.dy *= -1;
  //   }
  //   window.requestAnimationFrame(this.update);
  // }

  /**
   * update device geolocation every 5 sec
   * save location to storage - !! to remove
   */
  watchPosition() {
    navigator.geolocation.watchPosition(
      (position) => {
        // this.player.latitude = position.coords.latitude;
        // this.player.longitude = position.coords.longitude;
        this.mapCoordinates(position.coords.latitude, position.coords.longitude);
        // this.saveLocal('coordinate', {
        //   time: new Date(),
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude
        // });
      },
      (err) => { console.log(err); },
      {
        enableHighAccuracy: false,
        timeout: 0,
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

  /** !! NOT USED
   * get data from localStorage
   */
  getLocal(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(JSON.parse(value));
      //return JSON.parse(value)
    }
  }

  /**
   * get x
   * convert from degrees to radians
   */
  mapCoordinates(lat: number, lng: number) {
    const locX = (lng + 180) * (this.mapWidth / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const locY = (this.mapHeight / 2) - (this.mapWidth * mercN / (2 * Math.PI));
    this.player = {x: locX, y: locY };
  }
}
