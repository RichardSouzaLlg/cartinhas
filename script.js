let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  getEventPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  init(paper) {
    const updateMousePosition = (e) => {
      const pos = this.getEventPosition(e);
      this.mouseX = pos.x;
      this.mouseY = pos.y;

      if (!this.rotating) {
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      const angle = Math.atan2(dirY / dirLength, dirX / dirLength);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("touchmove", updateMousePosition, { passive: false });

    const onDown = (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      const pos = this.getEventPosition(e);
      this.mouseTouchX = pos.x;
      this.mouseTouchY = pos.y;
      this.mouseX = pos.x;
      this.mouseY = pos.y;
      this.prevMouseX = pos.x;
      this.prevMouseY = pos.y;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      if (e.button === 2 || e.touches?.length > 1) {
        this.rotating = true;
      }
    };

    const onUp = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    paper.addEventListener("mousedown", onDown);
    paper.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
