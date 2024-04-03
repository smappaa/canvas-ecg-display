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
    this.rhythm = "sinus";
    this.baselineWanderOn = true;
    this.baselineWander = 0;
    this.baselineWanderDirection = 1;
    this.tension = false;
    this.tensionLevel = 0;
    this.tensionDirection = 1;
    this.rattling = true;
    this.hr = 60;
    this.lastHeartBeatTime = Date.now() / 1000;
    this.drawingComplex = false;
    this.complexParts = [];
    this.currentComplexStep = 0;
    this.prevComplexDrawTime = 0;
    this.yGlide = 100;

    this.setRhythm = (rhythm) => {
        this.rhythm = rhythm;
    }

    this.setBaselineWander = (baselineWanderOn) => {
        this.baselineWanderOn = baselineWanderOn;
    }

    this.setTension = (tension) => {
        this.tension = tension;
    }

    this.setRattling = (rattling) => {
        this.rattling = rattling;
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
            // Drawing rhythms
            if(this.drawingComplex) {
                y = this.drawComplex(this.rhythm);
            }

            // Baseline wander
            if(this.baselineWanderOn) y += this.baselineWander;
            
            // Rattling
            if(this.rattling) {
                if(Math.floor(Math.random() * 40) == 0) {
                    y += Math.random() * 3.5 - 1.75;
                }
            }

            // Patient muscle tension effect
            y += this.tensionEffect();

            if(this.yGlide < 120) this.yGlide += .05;
        } else if(this.yGlide != 100) this.yGlide = 100;

        y += this.lineY;
        y += this.yGlide;
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
        if(timeNow - this.lastHeartBeatTime > (60 / this.hr) 
        || this.rhythm == "afib" && Math.random() * 100 > 99) {
            this.drawingComplex = true;
            this.complexParts = [];
            this.currentComplexStep = 0;
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
            if(this.tensionLevel >= 1) {
                this.tensionDirection = 0;
            } else if(this.tensionLevel <= -1) {
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

    this.drawComplex = (complex) => {
        var toReturn = 0;
        if(this.complexParts.length == 0) {
            switch(complex) {
                case "sinus": this.complexParts = [-1, -4, -7, -4, 0, 0, 0, 1, -55, 3, 1, 0, 0, 0, -3, -5, -7, -7, -5, -3, 
                    0, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 4.5, 4.5, 4.5, 4.5, 4.5, 4, 4, 4, 4, 4, 3.5, 3.5, 3.5, 3.5, 3.5, 3, 3, 
                    3, 2.5, 2.5, 2.5, 2, 2, 2, 1.5, 1.5, 1.5, 1.5, 1, 1, 1, 1, .5, .5, .5, .5];
                break;
                case "afib": this.complexParts = [-1, 3, -2, 2, 0, 3, -3, 1, -55, 3, -3, 2, 3, 1, -4, -5, -7, -5, -2, -3];
                for(var i = 0; i < 60; i++) {
                    this.complexParts.push(Math.floor(Math.random() * 11) - 5.5);
                }
                break;
            }
        } else if(this.complexParts.length > 0) {
            if(this.currentComplexStep < this.complexParts.length) {
                    toReturn = this.complexParts[this.currentComplexStep];
                    this.currentComplexStep++;
            } else {
                this.drawingComplex = false;
                this.complexParts = [];
                this.currentComplexStep = 0;
            }
        }

        return toReturn;
    }
}

var ecg = new Ecg();
var paused = false;

function animate() {
    requestAnimationFrame(animate);
    if(!paused) ecg.update();
}

animate();