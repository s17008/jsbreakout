window.addEventListener('DOMContentLoaded', () => {
    console.log("breakout initializing...");
    // 定数値
    const DRAW_INTERVAL = 1000 / 60;
    const PADDLE_WIDTH = 100;
    const PADDLE_HEIGHT = 10;
    const PADDLE_COLOR = 'white';

    // 初期化
    const canvas = document.getElementById('board');
    const breakout = new Breakout(canvas, DRAW_INTERVAL,
        PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
});

class Breakout {
    static set width(w) {
        Breakout.gameWidth = w;
    }

    static get width() {
        return Breakout.gameWidth;
    }

    static set height(h) {
        Breakout.gameHeight = h;
    }

    static get height() {
        return Breakout.gameHeight;
    }

    constructor(canvas, interval, pw, ph, pc) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        Breakout.width = canvas.width;
        Breakout.height = canvas.height;
        this.paddle = new Paddle(pw, ph, pc);
        this.paddle.setPosition(Breakout.width / 2,
            Breakout.height * 4 / 5);
        setInterval(this.draw.apply(this), interval);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }

    draw() {
        this.context.clearRect(0, 0, Breakout.width, Breakout.height);
        this.paddle.draw(this.context);
    }
}

class Paddle {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
    }

    /**
     * 描画処理するメソッド
     *
     * @param context CanvasRenderingContext2D
     */
    draw(context) {
        context.save();

        context.translate(this.x, this.y);
        context.fillStyle = this.color;
        context.fillRect(-(this.width / 2), -(this.height / 2),
            this.width, this.height);

        context.restore();
    }

    /**
     * 位置を指定した座標へ移動する
     * @param x
     * @param y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.fixPosition();
    }

    /**
     * 移動スピードを指定する
     * @param speed
     */
    setSpeed() {
        this.speed = speed;
    }

    /**
     * 左へ移動する
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * 右へ移動する
     */
    moveRight() {
        this.y -= this.speed;
        this.fixPosition();
    }

    /**
     * はみ出ないように位置を調整する
     */
    fixPosition() {
        const left = this.x - (this.width / 2);
        if (left < 0) {
            this.x += ~~left;
        }

        const right = this.x + (this.width / 2);
        if (right > Breakout.width) {
            this.x -= ~ Breakout.width;
        }
    }
}