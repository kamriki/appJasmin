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
  private startedLat = null;
  private startedLng = null;
  private player: { x: number, y: number, dLat: number, dLng: number, oLat: number, oLng: number } = {
    x: null, y: null, dLat: null, dLng: null, oLat: null, oLng: null
  };
  locations = [];

  /**
   * prepare Arena (playing Area) by setting width & hight with respect to the browser width/lenght
   * ensure geolocation permission is requested on iPhone - ToDo
   * watch device geolocation
   * start the game & get last level if existed - Todo
   */
  ngOnInit() {
    this.canvas.nativeElement.width = this.mapWidth;
    this.canvas.nativeElement.height = this.mapHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d');

    if (!navigator.geolocation) { console.log('location is not supported'); }
    else { this.watchPosition(); }

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
        if (!this.startedLat) {
          this.startedLat = position.coords.latitude;
          this.startedLng = position.coords.longitude;
        }
        this.plotPlayer(position.coords.latitude, position.coords.longitude);
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
   * setting factor for accelerating player speed for within small area
   * store the started coordination as base (sLat/sLng) to compute the differnce of next moves
   * start palyer position from bottom-middle if no older coordination (starting the game)
   * plotting player by mapping his coordinates to the browser
   * convert from degrees to radians (Mercator projection)
   */
  plotPlayer(lat: number, lng: number) {
    const factor = 1000;
    lat = Math.abs(lat - this.startedLat) * factor + this.startedLat;
    lng = Math.abs(lng - this.startedLng) * factor + this.startedLng;
    const locX = (lng + 180) * (this.mapWidth / 360);
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const locY = (this.mapHeight / 2) - (this.mapWidth * mercN / (2 * Math.PI));
    // const dLat = Math.abs(lat - this.startedLat);
    // const dLng = Math.abs(lng - this.startedLng);
    this.player = {
      x: !this.player.x ? (this.mapWidth/2) : (locX + (dLat * factor)),
      y: !this.player.y ? (this.mapHeight * 0.96) : (locY + (dLng * factor)),
      dLat: dLat,
      dLng: dLng,
      oLat: null, oLng: null
      // oLat: this.player.oLat === lat ? this.player.oLat : lat,
      // oLng: this.player.oLng === lng ? this.player.oLng : lng
    };
    console.log(this.player)
    const timestamp = new Date(); this.locations.push({timestamp, ...this.player, lat, lng})
    this.drawPlayer();
  }

  /** */
  drawPlayer() {
    this.ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }
}
