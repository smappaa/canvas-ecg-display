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
    this.trembling = false;
    this.tremblingLevel = 0;
    this.tremblingDirection = 1;

    this.setRhythm = (rhythm) => {
        this.rhythm = rhythm;
    }

    this.setTrembling = (trembling) => {
        this.trembling = trembling;
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

            // Patient trembling effect
            y += this.tremblingEffect();
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

    this.tremblingEffect = () => {
        if(this.trembling && Math.random() * 100 > 10) {
            if(Math.floor(Math.random()* 6) == 0) {
                this.tremblingDirection = this.tremblingDirection ? 0 : 1;
            }
            if(this.tremblingLevel >= 4) {
                this.tremblingDirection = 0;
            } else if(this.tremblingLevel <= -4) {
                this.tremblingDirection = 1;
            }
            if(this.tremblingDirection == 1) {
                this.tremblingLevel += Math.random() * 3.5 + 6.5;
            } else if(this.tremblingDirection == 0) {
                this.tremblingLevel -= Math.random() * 3.5 + 6.5;
            }
            if(Math.floor(Math.random()* 12) == 0) {
                this.tremblingLevel = this.tremblingLevel * 1.5;
            }
            return this.tremblingLevel;
        } else return 0;
    }
}

var ecg = new Ecg();

function animate() {
    requestAnimationFrame(animate);
    ecg.update();
}

animate();