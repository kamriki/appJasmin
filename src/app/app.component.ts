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
  public gameStarted = false;
  public isWinner: boolean = null;
  public storedSpeed: number;
  private gameSpeed = 10000;
  private gameLevel: Number;
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
    this.gameSetting();
  }

  /**
   * store selected speed
   * set Speed factor for accelerating player speed within small area
   */
  setGameSpeed(speed) {
    this.saveLocalStorage('speed', Number(speed));
    this.gameSpeed *= Number(speed);
    // console.log(speed);
  }

  /**
   * get permission for browser location
   * send viruses on level > 1
   */
  startGame() {
    if (!navigator.geolocation) { console.log('location is not supported'); }
    else {
      this.gameStarted = true;
      // this.watchPosition();

      this.testWalking();
    }

    if (this.gameLevel > 1) { this.sendVirus(100, 10); }
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

  /**
   * store started coordination as base (startedLat/startedLng) to compute the differnce of next moves
   * update device geolocation every 0 sec
   */
  watchPosition() {
    navigator.geolocation.watchPosition(
      (position) => {
        if (!this.startedLat) {
          this.startedLat = position.coords.latitude;
          this.startedLng = position.coords.longitude;
        }
        this.plotPlayer(position.coords.latitude, position.coords.longitude);
      },
      (err) => { console.log(err); },
      {
        enableHighAccuracy: false,
        timeout: 0,
        maximumAge: 0
      }
    );
  }

  /** !! NOT USED
   * save coordinate with time in localStorage
   */
  saveLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /** !! NOT USED
   * get data from localStorage
   */
  getLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    if (value) { return JSON.parse(value) }
  }

  /**
   * compute the differance of changes of new position with the started one
   * choose the biggest difference (delta) between lat or lng
   * add delta to locY for only changing player Y pixels and keep X position in the middle
   * start palyer position from bottom-middle then use difference in of moving to accelerate toward end of pathway
   * check Y value if reached end of canvas to win the game
   */
  plotPlayer(lat: number, lng: number) {
    const dLat = Math.abs(lat - this.startedLat) * this.gameSpeed;
    const dLng = Math.abs(lng - this.startedLng) * this.gameSpeed;
    const delta = dLat > dLng ? dLat : dLng;
    const locX = this.mapWidth/2;
    const locY = this.mapHeight * 0.96 - delta;

    const timestamp = new Date();
    // this.locations.push({timestamp, lat, lng, dLat, dLng, locX, locY}); // Stats Analysis
    console.info({timestamp, lat, lng, dLat, dLng, locX, locY});

    if (locY < 10) {
      this.gameWin();
    } else {
      this.drawPlayer(locX, locY);
    }
  }

  /**
   * draw player as black circle using X & Y Pixel values inside the canvas
   */
  drawPlayer(x: number, y: number) {
    this.ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }

  /**
   * Retrive stored level & Speed Factor if available
   * otherwise set & store level as 1
   */
  gameSetting() {
    const storedLevel = this.getLocalStorage('level');
    if (storedLevel !== undefined) {
      this.gameLevel = Number(storedLevel);
    } else {
      this.gameLevel = 1;
      this.saveLocalStorage('level', 1);
    }

    this.storedSpeed = Number(this.getLocalStorage('speed'));
    if (this.storedSpeed) {
      this.gameSpeed = this.storedSpeed * 10000;
    } else {
      this.gameSpeed = 1 * 10000;
    }
  }

  /**
   *
   */
  gameWin() {
    this.isWinner = true;
    this.gameStarted = false;
    alert('You Win');
  }

  /** Game Simulatation */
  testWalking() {
    let x = this.mapWidth/2;
    let y = this.mapHeight * 0.96;
    setInterval(() => {
      console.log(x, y)
      this.drawPlayer(x, y);
      y -= 10;
      if (y < 10) { alert('You Win'); }
    }, 200);
  }
}
