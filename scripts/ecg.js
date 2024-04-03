var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
canvas.height = 200;

c.fillStyle = "#000"; c.fillRect(0, 0, canvas.width, canvas.height);
c.fill();

function Ecg() {
    this.lineX = 0;
    this.lineY = 0;
    this.prevYpos = 100;
    this.rhythm = "disconnected";
    this.baselineWander = 0;
    this.baselineWanderDirection = 1;
    this.tension = false;
    this.tensionLevel = 0;
    this.tensionDirection = 1;
    this.hr = 60;
    this.lastHeartBeatTime = Date.now() / 1000;
    this.drawingComplex = false;

    this.setRhythm = (rhythm) => {
        this.rhythm = rhythm;
    }

    this.setTension = (tension) => {
        this.tension = tension;
    }

    this.setHr = (hr) => {
        this.hr = hr;
    }

    this.draw = () => {
        // Erasing previous line
        c.fillStyle = "#000";
        c.fillRect(this.lineX, 0, 20, canvas.height);
        c.fill();
        c.beginPath();

        var y = 0;

        // Applying artifacts
        if(this.rhythm !== "disconnected") {
            // Baseline wander
            y += this.baselineWander;
            
            // Rattling
            if(Math.floor(Math.random() * 40) == 0) {
                y += Math.random() * 3.5 - 1.75;
            }

            // Patient muscle tension effect
            y += this.tensionEffect();
        }
        
        y += this.lineY;
        y += 100;
        c.moveTo(this.lineX, this.prevYpos);
        c.lineTo(this.lineX+2, y);
        c.strokeStyle = "#0f0";
        c.lineWidth = 2;
        c.stroke();
        this.prevYpos = y;
    }

    this.update = () => {
        this.updateBaselineWander();
        if(this.lineX >= canvas.width) {
            this.lineX = 0;
        } else {
            this.lineX += 2;
        }

        var timeNow = Date.now() / 1000;
        if(timeNow - this.lastHeartBeatTime > (60 / this.hr)) {
            console.log("Heartbeat");
            this.lastHeartBeatTime = timeNow;
        }

        this.draw();
    }

    this.updateBaselineWander = () => {
        if(this.baselineWander >= 5) {
            this.baselineWanderDirection = 0;
        } else if(this.baselineWander <= -5) {
            this.baselineWanderDirection = 1;
        }
        if(this.baselineWanderDirection == 1) {
            this.baselineWander += .01;
        } else if(this.baselineWanderDirection == 0) {
            this.baselineWander -= .01;
        }
    }

    this.tensionEffect = () => {
        if(this.tension && Math.random() * 100 > 10) {
            if(Math.floor(Math.random()* 6) == 0) {
                this.tensionDirection = this.tensionDirection ? 0 : 1;
            }
            if(this.tensionLevel >= 2) {
                this.tensionDirection = 0;
            } else if(this.tensionLevel <= -2) {
                this.tensionDirection = 1;
            }
            if(this.tensionDirection == 1) {
                this.tensionLevel += Math.random() * 5.5 + 6.5;
            } else if(this.tensionDirection == 0) {
                this.tensionLevel -= Math.random() * 5.5 + 6.5;
            }
            if(Math.floor(Math.random()* 12) == 0) {
                this.tensionLevel = this.tensionLevel * 1.5;
            }
            return this.tensionLevel;
        } else return 0;
    }
}

var ecg = new Ecg();
var paused = false;

function animate() {
    requestAnimationFrame(animate);
    if(!paused) ecg.update();
}

animate();