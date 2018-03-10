class Tile {
    constructor(height, width, value, x, y) {
        this.height = height;
        this.width = width;
        this.value = value;
        this.x = x;
        this.y = y;
        this.newX = x;
        this.newY = y;
        this.isMerged = false;
        this.isNew = true;
        this.remove = false;
    }

    textSize() {
        let l = this.value.toString().length;
        return Math.floor(map(l, 1, 4, 64, 34));
    }

    color() {
        let colors = ["#f9f871", "#ffc75f", "#ff9671", "#ff6f91", "#d65db1", "#845ec2", "#2c73d2", "#0081cf", "#0089ba", "#008e9b", "#008f7a", "#ffffff"];
        let values = ["2", "4", "8", "16", "32", "64", "128", "256", "512", "1024", "2048"];
        let index = values.indexOf(this.value.toString());
        if (index < 0) index = 11;
        return colors[index];
    }

    setNewPosition(speed) {
        if (this.x === this.newX && this.y === this.newY) return false;

        if (this.x + speed < this.newX) this.x += speed;
        else if (this.x - speed > this.newX) this.x -= speed;
        else this.x = this.newX;

        if (this.y + speed < this.newY) this.y += speed;
        else if (this.y - speed > this.newY) this.y -= speed;
        else this.y = this.newY;

        return true;
    }
}