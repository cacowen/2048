class Game {
    constructor(canvasSize, boardSize, val1, val2, valRatio) {
        this.tiles = [];
        this.positions = [];
        this.canvasSize = canvasSize;
        this.boardSize = boardSize;
        this.tileSize = .8 * canvasSize / boardSize;
        this.spacing = .2 * canvasSize / (boardSize + 1);
        this.value1 = val1;
        this.value2 = val2;
        this.valueRatio = valRatio;
        this.score = 0;
        this.highestValue = 0;
    }

    start() {
        this.loadPositions();
        this.addTile();
    }

    loadPositions() {
        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                let posX = this.spacing + x * this.spacing + this.tileSize / 2 + x * this.tileSize;
                let posY = this.spacing + y * this.spacing + this.tileSize / 2 + y * this.tileSize;
                this.positions.push({ x: posX, y: posY, open: true });
            }
        }
    }

    addTile() {
        this.updatePositions();

        let value = random(1) < this.valueRatio ? this.value1 : this.value2;
        let position = random(this.positions.filter(_ => _.open === true));

        if (!position) return;

        position.open = false;
        this.tiles.push(new Tile(this.tileSize, this.tileSize, value, position.x, position.y));
    }

    moveHorizontal(isLeft) {
        let moveMade = false;
        let tileValuesY = Array.from(new Set(this.tiles.map(_ => _.y)));
        let gap = this.tileSize + this.spacing;
        if (isLeft) gap *= -1;
        let firstX = isLeft
            ? this.spacing + this.tileSize / 2
            : this.canvasSize - this.spacing - this.tileSize / 2;

        tileValuesY.forEach(y => {
            let merges = 0;
            let tileRow = this.tiles.filter(_ => _.y === y);
            if (isLeft) tileRow.sort((a, b) => a.x - b.x);
            else tileRow.sort((a, b) => b.x - a.x);

            for (let i = 0; i < tileRow.length; i++) {
                let t = tileRow[i];

                t.newX = firstX - gap * i + gap * merges;

                if (t.x !== t.newX) moveMade = true;

                if (i === 0) continue;

                let tPrior = tileRow[i - 1];

                if (tPrior.isMerged || tPrior.value !== t.value) continue;

                tPrior.remove = true;
                t.value *= 2;
                this.score += t.value;
                t.isMerged = true;
                t.newX = tPrior.newX;

                merges++;
                moveMade = true;
            }
        });

        return moveMade;
    }

    moveVertical(isUp) {
        let moveMade = false;
        let tileValuesX = Array.from(new Set(this.tiles.map(_ => _.x)));
        let gap = this.tileSize + this.spacing;
        if (isUp) gap *= -1;
        let firstY = isUp
            ? this.spacing + this.tileSize / 2
            : this.canvasSize - this.spacing - this.tileSize / 2;

        tileValuesX.forEach(x => {
            let merges = 0;
            let tileRow = this.tiles.filter(_ => _.x === x);
            if (isUp) tileRow.sort((a, b) => a.y - b.y);
            else tileRow.sort((a, b) => b.y - a.y);

            for (let i = 0; i < tileRow.length; i++) {
                let t = tileRow[i];

                t.newY = firstY - gap * i + gap * merges;

                if (t.y !== t.newY) moveMade = true;

                if (i === 0) continue;

                let tPrior = tileRow[i - 1];

                if (tPrior.isMerged || tPrior.value !== t.value) continue;

                tPrior.remove = true;
                t.value *= 2;
                this.score += t.value;
                t.isMerged = true;
                t.newY = tPrior.newY;

                merges++;
                moveMade = true;
            }
        });

        return moveMade;
    }

    setHighestValue() {
        let highestValueTile = this.tiles.sort((a, b) => b.value - a.value)[0];
        if (highestValueTile) this.highestValue = highestValueTile.value;
    }

    updatePositions() {
        this.setHighestValue();

        this.tiles = this.tiles.filter(_ => _.remove === false);
        this.tiles.forEach(t => t.isMerged = false);

        for (let i = 0; i < this.positions.length; i++) {
            let p = this.positions[i];
            p.open = true;
            for (let j = 0; j < this.tiles.length; j++) {
                let t = this.tiles[j];
                if (t.x !== p.x || t.y !== p.y) continue;
                p.open = false;
                break;
            }
        }
    }

    hasValidMove() {
        let tileValuesX = Array.from(new Set(this.tiles.map(_ => _.x)));
        if (tileValuesX.length !== this.boardSize) return true;

        for (let iX = 0; iX < tileValuesX.length; iX++) {
            const x = tileValuesX[iX];
            let tileRow = this.tiles.filter(_ => _.x === x);
            tileRow.sort((a, b) => a.y - b.y);
            if (tileRow.length !== this.boardSize) return true;
            for (let i = 1; i < tileRow.length; i++) {
                if (tileRow[i].value === tileRow[i - 1].value) return true;
            }
        };

        let tileValuesY = Array.from(new Set(this.tiles.map(_ => _.y)));
        if (tileValuesY.length !== this.boardSize) return true;

        for (let iY = 0; iY < tileValuesY.length; iY++) {
            const y = tileValuesY[iY];
            let tileRow = this.tiles.filter(_ => _.y === y);
            tileRow.sort((a, b) => a.x - b.x);
            if (tileRow.length !== this.boardSize) return true;
            for (let i = 1; i < tileRow.length; i++) {
                if (tileRow[i].value === tileRow[i - 1].value) return true;
            }
        };

        return false;
    }

}