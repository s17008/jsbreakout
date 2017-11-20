window.addEventListener('DOMContentLoaded', () => {
    console.log("breakout initializing...");

    // 初期化
    const canvas = document.getElementById('board');
    const breakout = new Breakout({
        canvas: canvas,
        interval: 1000 / 60,    // 60 FPS
        paddle: {
            width: 100,
            height: 10,
            color: 'white'
        },
        ball: {
            radius: 5,
            color: 'red'
        }
    });
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

    constructor(options) {
        // 受け取ったパラメータをプロパティに保存
        this.canvas = options.canvas;
        this.context = this.canvas.getContext('2d');
        // ゲーム画面のサイズを取得
        this.leftKey = false;
        this.rightKey = false;

        // 内部で使用するプロパティの初期化
        Breakout.width = this.canvas.width;
        Breakout.height = this.canvas.height;

        // Paddleの初期化
        this.paddle = new Paddle(
            options.paddle.width,
            options.paddle.height,
            options.paddle.color);

        this.paddle.setPosition(Breakout.width / 2,
            Breakout.height * 8 / 9);
        this.paddle.setSpeed(Breakout.width / 100);

        // ボールの初期化
        this.ball = new Ball(
            options.ball.radius, options.ball.color);
        this.ball.setPosition(Breakout.width / 2, Breakout.height / 2);

        // ボールに当たり判定してもらうお願い
        this.ball.addTarget(this.paddle);

        // 描画のためのタイマーセット
        setInterval(this.draw.bind(this), options.interval);

        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));
    }

    keydown(evt) {
        if (evt.code === 'ArrowLeft' /* 左キー */) {
            this.leftKey = true;
        } else if (evt.code === 'ArrowRight' /* 右キー */) {
            this.rightKey = true;
        } else if (evt.code === 'Space') {
            // debag
            this.ball.setSpeed(5, 120);
        }
    }

    keyup(evt) {
        if (evt.code === 'ArrowLeft' /* 左キー */) {
            this.leftKey = false;
        } else if (evt.code === 'ArrowRight' /* 右キー */) {
            this.rightKey = false;
        }
    }

    draw() {
        this.context.clearRect(0, 0, Breakout.width, Breakout.height);
        if (this.leftKey) {
            this.paddle.moveLeft();
        }
        if (this.rightKey) {
            this.paddle.moveRight();
        }
        this.ball.draw(this.context);
        this.paddle.draw(this.context);
    }
}

class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    getCornerPoints() {
        return [
            {x: this.x - this.width / 2, y: this.y - this.height / 2},
            {x: this.x + this.width / 2, y: this.y - this.height / 2},
            {x: this.x + this.width / 2, y: this.y + this.height / 2},
            {x: this.x - this.width / 2, y: this.y + this.height / 2}
        ]
    }

    hit() {

    }
}

class Paddle extends Entity {
    constructor(width, height, color) {
        super();
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
    setSpeed(speed) {
        this.speed = speed;
    }

    /**
     * 左へ移動する
     */
    moveLeft() {
        this.x -= this.speed;
        this.fixPosition();
    }

    /**
     * 右へ移動する
     */
    moveRight() {
        this.x += this.speed;
        this.fixPosition();
    }

    /**
     * はみ出ないように位置を調整する
     */
    fixPosition() {
        const left = this.x - (this.width / 2);
        if (left < 0) {
            this.x += Math.abs(left);
        }

        const right = this.x + (this.width / 2);
        if (right > Breakout.width) {
            this.x -= right - Breakout.width;
        }
    }
}

class Ball {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.targetList = [];
    }

    /**
     * 当たり判定をするリストに追加する
     */
    addTarget(object) {
        if (Array.isArray(object)) {
            this.targetList.concat(object);
        } else {
            this.targetList.push(object);
        }
    }

    /**
     * 位置を指定した場所へ移動する
     * @param x
     * @param y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 移動速度と向きを指定する
     * @param speed
     * @param direction
     */
    setSpeed(speed, direction) {
        const rad = direction * Math.PI / 180;
        this.dx = Math.cos(rad) * speed;
        this.dy = Math.sin(rad) * speed;
    }

    /**
     * 移動のメソッド
     */
    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.collision())
    }

    collision() {
        let isCollision = false;
        this.targetList.forEach((target) => {
            // 角チェック
            const points = target.getCornerPoints();
            points.forEach((points) => {
                const a = Math.sqrt(
                    Math.pow(this.x - point[0], 2) + Math.pow(this.y - point[1], 2))
                if (a <= this.radius) {
                    isCollision = true;
                    target.hit();
                }
            }, this);

            // 各側面のチェック
            const bl = this.x - this.radius;
            const br = this.x + this.radius;
            if (points[0].x < br || bl < points[1].x) {
                if (points[0].y < bb || points[2].y) {
                    isCollision = true;
                    target.hit();
                }
            }

        }, this);

        return isCollision;
    }

    /**
     * はみ出ないように位置を調整する
     */
    fixPosition() {
        //画面左側を超えてるか判定と座標修正
        const left = this.x - this.radius;
        if (left < 0) {
            this.x += Math.abs(left);
            this.reflectionX();
        }

        //画面上側を超えてるか判定と座標修正
        const top = this.y - this.radius;
        if (top < 0) {
            this.y += Math.abs(top);
            this.reflectionY();
        }

        //画面右側を超えているか判定と座標修正
        const right = this.x + this.radius;
        if (right > Breakout.width) {
            this.x -= right - Breakout.width;
            this.reflectionX();
        }

        //画面下側を超えてるか判定と一時的に座標修正
        const bottom = this.y + this.radius;
        if (bottom > Breakout.height) {
            this.y -= bottom - Breakout.height;
            this.reflectionY();
        }
    }

    /**
     * 移動スピートの左右反転
     */
    reflectionX() {
        this.dx *= -1;
    }

    /**
     * 移動スピートの左右反転
     */
    reflectionY() {
        this.dy *= -1;
    }

    /**
     * 描画処理するメソッド
     *
     * @param context CanvasRenderingContext2D
     */
    draw(context){
        // 移動関連
        this.move();
        this.fixPosition();

        // 描画関連
        context.save();

        context.fillStyle = this.color;
        context.translate(this.x, this.y);

        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2 * Math.PI);
        context.fill();

        context.restore();
    }
}