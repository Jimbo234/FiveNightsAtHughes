class Camera {
  constructor() {
    this.up = false;
    
    this.anim = 0;
    
    this.mouse_below = false;
    
    
    // Useless variables for a fake statistic on the cameras.
    this.ping = 70; 
    this.quality = "XXX";
    
    // Static
    this.static = new Image();
    this.static.src = "static.png";
    
    this.room = new Image();
    this.room.src = "cameratest.jpg";
    
    this.selected = "03";
    
    this.monitor = new Image();
    this.monitor.src = "monitor.png";
    
    this.static_timer = 0;
    
    this.static_anim = 0;
    
    this.cameras = [
    { name: "03",
      desc: "Left Hallway B",
      x: 950, 
      y: 520,},
    { name: "05",
      desc: "Right Hallway B",
      x: 1100, 
      y: 520},
    { name: "04",
      desc: "Left Hallway A",
      x: 950, 
      y: 460},
    { name: "06",
      desc: "Right Hallway A",
      x: 1100, 
      y: 460},
    { name: "09",
      desc: "Laundry Room",
      x: 1020, 
      y: 600},
    { name: "01",
      desc: "Hughes' Bedroom",
      x: 920, 
      y: 380},
    { name: "11",
      desc: "Utility Closet",
      x: 1200, 
      y: 520},
      ];
  }
  
  flip() {
    if (this.up) {
      this.up = false;
      return;
    }
    
    this.up = true;
  }
  
  update() {
    
    // Various fake variables to make the cameras seem more realistic.
    if (globalTimer % 21 == 0) {
      if (Math.random() > 0.4) this.ping += Math.random() * 40 - 20;
      
      this.quality = "XXX";
      if (Math.random() > 0.92) this.quality = "XX";
      if (Math.random() > 0.98) this.quality = "X";
    }
    if (this.ping < 0) {
      this.ping = 0;
      this.ping += Math.random() * 5;
    }
    if (this.ping > 400) {
      this.ping = 0;
      this.ping += this.ping -= Math.random() * 40;
    }
    
    this.static_anim++;

    // Flips camera if the mouse goes to the bottom.
    if (inputs.mouseY > canvas.height - 60) {
      
      if (!this.mouse_below) this.flip();
      this.mouse_below = true;
      
    }
    
    else {
      this.mouse_below = false;
    }
    
    if (this.up && this.anim<1) this.anim += 0.08;
    if (!this.up && this.anim>0) this.anim -= 0.08;
    
    if (this.anim > 1) this.anim = 1;
    if (this.anim < 0) this.anim = 0;
    
    if (this.up) this.static_timer++;
    if (!this.up) this.static_timer = 0;
    
    
    
    // Camera animation.
    
    
    if (this.anim == 1) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    if (this.anim > 0 && this.anim < 1) {
      let animFrame = Math.floor(this.anim * 8);
      ctx.drawImage(this.monitor, 0, 768 * animFrame, 1024, 768, 0, 0, canvas.width, canvas.height);
      this.static_timer = 0;
    }
    
    let static_opacity = 0;
    
    if (this.static_timer <= 25)  static_opacity = 1;
    if (this.static_timer > 25) static_opacity = 1 - (this.static_timer - 25) * 0.008;
    if (this.static_timer > 75) static_opacity = 1 - 0.4;
    
    
    
    
    if (this.anim == 1) {
      let s = globalTimer % 400;
      let scroll = 0;
      
      if (s <= 100) {
        scroll = 100 - s;
      }
      else if (s > 100 && s <= 200) {
        scroll = 0;
      }
      else if (s > 200 && s <= 300) {
        scroll = 0 + (s-200);
      }
      else {
        scroll = 100;
      }
      
      
      if (this.selected == "01") drawRoom(this.room, scroll, 0, 150);
      
      this.doStatic(static_opacity-0.4); 
      this.drawCams();
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "16px Masaaki Regular";
      
      ctx.textAlign = "left";
      
      ctx.fillText("latency: " + this.ping.toFixed(2) + "ms", 30, 40);
      ctx.fillText("health: " + this.quality, 30, 60);
      
      
    }
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    if (this.anim == 1) ctx.strokeRect(20, 20, canvas.width - 40, canvas.height-40);
    
    
    
    if (this.static_timer > 1 && this.static_timer < 3) {
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    if (this.static_timer < 10 && this.up && this.anim == 1) {
      ctx.fillStyle = "white";
      for (var i = 0; i<4; i++){
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 300);
      }
    }
    
  }
  
  drawCams() {
    ctx.strokeStyle = "white";
    
    
    for (var cam of this.cameras) {
      let w = 72;
      let h = 44;
      
      let hover = false;
      let trapped = false;
      
      if (inputs.mouseX > cam.x && inputs.mouseX < cam.x + w && inputs.mouseY > cam.y && inputs.mouseY < cam.y + h){
        if (this.selected != cam.name) hover = true;
        
        if (inputs.mouseClick && this.selected != cam.name) {
          this.selected = cam.name;
          this.static_timer = 0;
          
          this.ping = Math.random() * 200 + 20;
          
        }
      }
      
      ctx.fillStyle = "#192436";
      if (hover) ctx.fillStyle = "#422247";
      if (trapped) ctx.fillStyle = "#692424"; // idea for bugged cams
      if (cam.name == this.selected) {
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        
        //Write name of room.
        ctx.fillText(cam.desc, canvas.width-180, 300);
        
        ctx.fillStyle = "#c7c226";
      }
      ctx.fillRect(cam.x, cam.y, w, h);
      ctx.strokeRect(cam.x+2, cam.y+2, w-4, h-4);
      
      ctx.fillStyle = "white";
      
      ctx.textAlign = "left";
      ctx.font = "20px Masaaki Regular";
      ctx.fillText("CAM", cam.x + 6, cam.y + 19);
      ctx.fillText(cam.name, cam.x + 6, cam.y + 37);
    }
  }
  
  doStatic(opacity){
    let static_a = Math.floor(globalTimer/2)%8;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(this.static, 0, 720*static_a,1280, 720, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
  }
}

class HUD {
  constructor() {
    this.time = 0;
    this.power = 100000;
    
    this.icons = new Image();
    this.icons.src = "HUD.png";
    
    
    this.usage = 1;
    
    
    let outerRadius = canvas.width * 0.6;
		let innerRadius = canvas.width * 0.4;
		this.vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, innerRadius, canvas.width / 2, canvas.height / 2, outerRadius);
		
		this.vignette.addColorStop(0, 'rgba(0,0,0,0)');
		this.vignette.addColorStop(1, 'rgba(0,0,0,1)');
  }
  
  update() {
    this.time++;
    
    this.usage = 1;
    
    if (camera.up) this.usage++;
    
    this.power -= (this.usage*1.3) ** 2.1;
    
    this.draw();
  }
  
  draw() {
    
    
		ctx.fillStyle = this.vignette;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "32px Masaaki Regular";
    
    ctx.fillText("Night 1", canvas.width - 29, 52);
    
    
    ctx.font = "28px Masaaki Regular";
    let h = Math.floor((this.time/60)/45)
    if (h == 0) h = 12;
    
    ctx.fillText(h + " AM", canvas.width - 29, 82);
    
    
    ctx.fillStyle = "gray";
    ctx.font = "16px Masaaki Regular";
    
    //ctx.fillText(this.convertTime(this.time), canvas.width - 29, 106);
    
    if (camera.anim == 0 || camera.anim == 1){
      ctx.save();
      ctx.globalAlpha = 0.26 + inputs.mouseY * 0.0002;
      ctx.drawImage(this.icons, 0, 0, 645, 72, canvas.width/2 - (645 * 0.7)/2, canvas.height - 70, 645 * 0.7, 72 * 0.7);
      ctx.restore();
    }
    this.drawPower();
  }
  
  convertTime(frame) {
    let s = ((frame/60)%60).toFixed(1);
    let m = Math.floor(((frame/60)/60));
    
    s = s.toString();
    m = m.toString();
    
    if (s.length == 3) s = "0" + s;
    
    return m + ":" + s;
  }
  
  drawPower() {
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.font = "23px Masaaki Regular";
    ctx.fillText("Power left: " + Math.ceil(this.power/1000) + "%", 30, canvas.height-62);
    ctx.fillText("Usage:", 30, canvas.height-32);
    
    
    for (var i = 0; i<this.usage; i++){
      // Colors
      let offset = 32;
      if (i < 3) offset = 16;
      if (i < 2) offset = 0;
      ctx.drawImage(this.icons, offset, 134, 16, 29, 122 + i * 20, canvas.height-52, 16, 29);
    }
  }
}

class Office {
  constructor() {
    this.img = new Image();
    this.img.src = "HughesRoom.png";
    
    this.scroll = 0;
  }
  
  update() {
    drawRoom(this.img, this.scroll, 100, 217);
    
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    
    let intensity = Math.abs(inputs.mouseX - canvas.width/2);
    
    if (inputs.mouseX > canvas.width/2 && intensity > 50) {
      
      
      this.scroll -= (intensity - 40)/50;
    }
    
    if (inputs.mouseX < canvas.width/2 && intensity > 50) {
      this.scroll += (intensity - 40)/50;
    }
    
    if (this.scroll > 217) this.scroll = 217;
    if (this.scroll < -217) this.scroll = -217;
  }
  
  
}

function drawRoom(image, scroll, vadjust, roomcenter) {
  for (var i = 0; i<canvas.width; i+=4){
      let dist = Math.abs(canvas.width/2-i);
      
      let distortion = Math.cos((dist/(canvas.width/1.3)) * Math.PI);
      let amp = 50;
      
      ctx.drawImage(image, i - scroll + roomcenter, vadjust, 4, 768, i, distortion * amp - 50, 4, 768 - distortion * amp * 2 + 100);
    }
}
function main() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  
  state = 0;
  
  globalTimer = 0;
  
  hchan = new Image();
  hchan.src = "778482686946967574.webp";
  
  resize();
  
  lastMouse = false;
  
  camera = new Camera();
  hud = new HUD();
  office = new Office();
  
  
  
  init_input();
  
  //start();
  
  update();
}

function start() {
  
  state = 1;
}

function update() {
  globalTimer++;
  
  ctx.clearRect(0,0,canvas.width, canvas.height);
  
  if (state == 1) {
    office.update();
    camera.update();
    hud.update();
  }
  
  if (state == 0) {
    ctx.font = "50px Masaaki Regular";
    ctx.fillStyle = "white";
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.drawImage(hchan, 610, 0, 800, 1000);
    ctx.restore();
    
    ctx.fillText("Five", 240, 50);
    ctx.fillText("Nights", 240, 100);
    ctx.fillText("at", 240, 150);
    ctx.fillText("Hughes'", 240, 200);
    
    ctx.font = "30px Masaaki Regular";
    
    if (inputs.mouseX > 240 && inputs.mouseX < 560 && inputs.mouseY > 480 && inputs.mouseY < 510) {
      ctx.fillText(">>", 240, 500);
      
      if (inputs.mouseClick) {
        timer = 250;
        state = 2;
      }
    }
    ctx.fillText("New Game", 280, 500);
    
    camera.doStatic(0.3);
  }
  
  if (state == 2) {
    timer--;
    if (timer < 1) start();
    
    ctx.font = "32px Masaaki Regular";
    
    ctx.textAlign = "center";
    ctx.fillText("12:00 AM", canvas.width/2, canvas.height/2) - 40;
    ctx.fillText("First Night", canvas.width/2, canvas.height/2 + 40);
  }
  
  
  lastMouse = inputs.mouseDown;
  
  inputs.mouseClick = false;
  
  requestAnimationFrame(update);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init_input() {
  inputs = {
    mouseX: 0,
    mouseY: 0,
    
    mouseDown: false,
    mouseClick: false,
  };
  
  document.addEventListener("mousemove", function(e){
    inputs.mouseX = e.clientX;
    inputs.mouseY = e.clientY;
  });
  
  document.addEventListener("mousedown", function(e){
    inputs.mouseDown = true;
  });
  
  document.addEventListener("mouseup", function(e){
    inputs.mouseDown = false;
  });
  
  document.addEventListener("click", function(e){
    inputs.mouseClick = true;
  });
}
