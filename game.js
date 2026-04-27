// 游戏配置
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const TRACK_LEFT_BOUND = 50;
const TRACK_RIGHT_BOUND = 350;
const TRACK_WIDTH = TRACK_RIGHT_BOUND - TRACK_LEFT_BOUND;

// 关卡配置 - 8个关卡
const LEVELS = [
    {
        level: 1,
        name: "新手赛道",
        trackColor: "#2d5016",
        edgeColor: "#ffffff",
        obstacleType: "rectangle",
        obstacleColor: "#ff4444",
        baseSpeed: 3,
        obstacleFrequency: 0.02,
        maxObstacles: 3,
        speedIncrease: 0.2,
        levelTime: 30,
        feature: "基础速度，简单障碍物"
    },
    {
        level: 2,
        name: "蓝色公路",
        trackColor: "#1e3a5f",
        edgeColor: "#ffff00",
        obstacleType: "car",
        obstacleColor: "#ff8800",
        baseSpeed: 3.5,
        obstacleFrequency: 0.025,
        maxObstacles: 4,
        speedIncrease: 0.25,
        levelTime: 30,
        feature: "更快速度，汽车障碍物"
    },
    {
        level: 3,
        name: "紫色峡谷",
        trackColor: "#3d1f5c",
        edgeColor: "#ff00ff",
        obstacleType: "rock",
        obstacleColor: "#8b4513",
        baseSpeed: 4,
        obstacleFrequency: 0.03,
        maxObstacles: 5,
        speedIncrease: 0.3,
        levelTime: 30,
        feature: "岩石障碍物，更频繁出现"
    },
    {
        level: 4,
        name: "红色沙漠",
        trackColor: "#5c1f1f",
        edgeColor: "#ffaa00",
        obstacleType: "barrel",
        obstacleColor: "#ff0000",
        baseSpeed: 4.5,
        obstacleFrequency: 0.035,
        maxObstacles: 6,
        speedIncrease: 0.35,
        levelTime: 30,
        feature: "油桶障碍物，高速挑战"
    },
    {
        level: 5,
        name: "绿色森林",
        trackColor: "#1f5c1f",
        edgeColor: "#00ff00",
        obstacleType: "tree",
        obstacleColor: "#228b22",
        baseSpeed: 5,
        obstacleFrequency: 0.04,
        maxObstacles: 7,
        speedIncrease: 0.4,
        levelTime: 30,
        feature: "树木障碍物，极高速度"
    },
    {
        level: 6,
        name: "橙色日落",
        trackColor: "#5c3d1f",
        edgeColor: "#ff6600",
        obstacleType: "cone",
        obstacleColor: "#ff8c00",
        baseSpeed: 5.5,
        obstacleFrequency: 0.045,
        maxObstacles: 8,
        speedIncrease: 0.45,
        levelTime: 30,
        feature: "锥形路障，极限速度"
    },
    {
        level: 7,
        name: "青色闪电",
        trackColor: "#1f5c5c",
        edgeColor: "#00ffff",
        obstacleType: "mixed",
        obstacleColor: "#00ced1",
        baseSpeed: 6,
        obstacleFrequency: 0.05,
        maxObstacles: 9,
        speedIncrease: 0.5,
        levelTime: 30,
        feature: "混合障碍物，疯狂速度"
    },
    {
        level: 8,
        name: "终极挑战",
        trackColor: "#000000",
        edgeColor: "#ff0000",
        obstacleType: "boss",
        obstacleColor: "#ff0000",
        baseSpeed: 6.5,
        obstacleFrequency: 0.06,
        maxObstacles: 10,
        speedIncrease: 0.6,
        levelTime: 60,
        feature: "终极Boss关卡，生存60秒！"
    }
];

// 游戏状态
let canvas, ctx;
let gameState = {
    isRunning: false,
    currentLevel: 1,
    score: 0,
    time: 0,
    lastSpeedIncreaseTime: 0
};

// 玩家赛车
let player = {
    x: CANVAS_WIDTH / 2 - 20,
    y: CANVAS_HEIGHT - 120,
    width: 40,
    height: 70,
    speed: 0,
    moveSpeed: 6
};

// 障碍物数组
let obstacles = [];

// 赛道滚动偏移
let trackOffset = 0;

// 按键状态
let keys = {
    left: false,
    right: false
};

// 动画帧ID
let animationId = null;

// 时间间隔变量
let lastTime = 0;
let gameTime = 0;

// DOM元素
let startScreen, gameOverScreen, levelUpScreen;
let startBtn, restartBtn, nextLevelBtn;
let scoreDisplay, levelDisplay, timeDisplay;
let finalScore, finalTime, finalLevel;
let nextLevelNum, levelFeature;

// 初始化游戏
function init() {
    // 获取DOM元素
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    startScreen = document.getElementById('startScreen');
    gameOverScreen = document.getElementById('gameOverScreen');
    levelUpScreen = document.getElementById('levelUpScreen');
    
    startBtn = document.getElementById('startBtn');
    restartBtn = document.getElementById('restartBtn');
    nextLevelBtn = document.getElementById('nextLevelBtn');
    
    scoreDisplay = document.getElementById('score');
    levelDisplay = document.getElementById('level');
    timeDisplay = document.getElementById('time');
    
    finalScore = document.getElementById('finalScore');
    finalTime = document.getElementById('finalTime');
    finalLevel = document.getElementById('finalLevel');
    
    nextLevelNum = document.getElementById('nextLevel');
    levelFeature = document.getElementById('levelFeature');
    
    // 绑定事件
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    nextLevelBtn.addEventListener('click', goToNextLevel);
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // 绘制初始界面
    drawInitialScreen();
}

// 处理键盘按下
function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
        e.preventDefault();
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
        e.preventDefault();
    }
}

// 处理键盘松开
function handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
}

// 获取当前关卡配置
function getCurrentLevel() {
    return LEVELS[gameState.currentLevel - 1];
}

// 开始游戏
function startGame() {
    startScreen.style.display = 'none';
    resetGame();
    gameState.isRunning = true;
    lastTime = performance.now();
    gameLoop();
}

// 重置游戏
function resetGame() {
    gameState.score = 0;
    gameState.time = 0;
    gameState.lastSpeedIncreaseTime = 0;
    gameState.currentLevel = 1;
    
    // 重置玩家位置
    const level = getCurrentLevel();
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - 120;
    player.speed = level.baseSpeed;
    
    // 清空障碍物
    obstacles = [];
    
    // 重置赛道偏移
    trackOffset = 0;
    
    // 重置游戏时间
    gameTime = 0;
    
    // 更新显示
    updateDisplay();
}

// 重新开始游戏
function restartGame() {
    gameOverScreen.style.display = 'none';
    resetGame();
    gameState.isRunning = true;
    lastTime = performance.now();
    gameLoop();
}

// 进入下一关
function goToNextLevel() {
    levelUpScreen.style.display = 'none';
    gameState.currentLevel++;
    const level = getCurrentLevel();
    
    // 重置玩家位置
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - 120;
    player.speed = level.baseSpeed;
    
    // 清空障碍物
    obstacles = [];
    
    // 重置赛道偏移
    trackOffset = 0;
    
    // 重置关卡时间 - 关键修复
    gameState.time = 0;
    gameState.lastSpeedIncreaseTime = 0;
    gameTime = 0; // 这个变量也需要重置
    
    // 更新显示
    updateDisplay();
    
    gameState.isRunning = true;
    lastTime = performance.now();
    gameLoop();
}

// 游戏主循环
function gameLoop(currentTime) {
    if (!gameState.isRunning) return;
    
    // 计算时间差
    if (!currentTime) currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // 更新游戏时间
    gameTime += deltaTime;
    gameState.time = Math.floor(gameTime);
    
    // 每10秒增加速度和分数
    const speedIncreaseInterval = 10;
    const currentInterval = Math.floor(gameTime / speedIncreaseInterval);
    const lastInterval = Math.floor(gameState.lastSpeedIncreaseTime / speedIncreaseInterval);
    
    if (currentInterval > lastInterval) {
        // 增加分数
        gameState.score += 20;
        
        // 增加速度
        const level = getCurrentLevel();
        player.speed += level.speedIncrease;
        
        gameState.lastSpeedIncreaseTime = gameTime;
    }
    
    // 检查关卡完成
    checkLevelComplete();
    
    // 更新游戏对象
    update(deltaTime);
    
    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 渲染
    draw();
    
    // 更新显示
    updateDisplay();
    
    // 继续循环
    animationId = requestAnimationFrame(gameLoop);
}

// 更新游戏对象
function update(deltaTime) {
    // 更新赛道偏移
    const level = getCurrentLevel();
    trackOffset += player.speed * deltaTime * 60;
    if (trackOffset >= 100) {
        trackOffset = 0;
    }
    
    // 更新玩家位置
    if (keys.left) {
        player.x -= player.moveSpeed;
    }
    if (keys.right) {
        player.x += player.moveSpeed;
    }
    
    // 限制玩家在赛道内
    player.x = Math.max(TRACK_LEFT_BOUND, Math.min(TRACK_RIGHT_BOUND - player.width, player.x));
    
    // 生成障碍物
    if (Math.random() < level.obstacleFrequency) {
        spawnObstacle();
    }
    
    // 更新障碍物位置
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += player.speed * deltaTime * 60;
        
        // 移除超出屏幕的障碍物
        if (obstacles[i].y > CANVAS_HEIGHT) {
            obstacles.splice(i, 1);
        }
    }
}

// 生成障碍物
function spawnObstacle() {
    const level = getCurrentLevel();
    
    // 限制最大障碍物数量
    if (obstacles.length >= level.maxObstacles) {
        return;
    }
    
    // 随机位置（在赛道内）
    const obstacleWidth = 40;
    const obstacleHeight = 60;
    const x = TRACK_LEFT_BOUND + Math.random() * (TRACK_WIDTH - obstacleWidth);
    
    obstacles.push({
        x: x,
        y: -obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight,
        type: level.obstacleType,
        color: level.obstacleColor
    });
}

// 检查碰撞
function checkCollision() {
    const level = getCurrentLevel();
    
    // 检查是否撞到赛道边缘
    if (player.x <= TRACK_LEFT_BOUND || player.x + player.width >= TRACK_RIGHT_BOUND) {
        return true;
    }
    
    // 检查是否撞到障碍物
    for (const obstacle of obstacles) {
        if (rectCollision(player, obstacle)) {
            return true;
        }
    }
    
    return false;
}

// 矩形碰撞检测
function rectCollision(rect1, rect2) {
    // 增加一点碰撞容差，让游戏更公平
    const tolerance = 5;
    return rect1.x + tolerance < rect2.x + rect2.width &&
           rect1.x + rect1.width - tolerance > rect2.x &&
           rect1.y + tolerance < rect2.y + rect2.height &&
           rect1.y + rect1.height - tolerance > rect2.y;
}

// 检查关卡完成
function checkLevelComplete() {
    const level = getCurrentLevel();
    
    if (gameState.time >= level.levelTime) {
        // 检查是否是最后一关
        if (gameState.currentLevel >= LEVELS.length) {
            // 恭喜通关
            gameState.score += 500; // 通关奖励
            gameOver(true);
        } else {
            // 进入下一关
            showLevelUp();
        }
    }
}

// 显示关卡完成界面
function showLevelUp() {
    gameState.isRunning = false;
    cancelAnimationFrame(animationId);
    
    const nextLevelConfig = LEVELS[gameState.currentLevel];
    nextLevelNum.textContent = gameState.currentLevel + 1;
    levelFeature.textContent = nextLevelConfig.feature;
    
    levelUpScreen.style.display = 'flex';
}

// 游戏结束
function gameOver(isWin = false) {
    gameState.isRunning = false;
    cancelAnimationFrame(animationId);
    
    // 更新最终分数显示
    finalScore.textContent = gameState.score;
    finalTime.textContent = gameState.time;
    finalLevel.textContent = gameState.currentLevel;
    
    // 更新标题
    const h1 = gameOverScreen.querySelector('h1');
    if (isWin) {
        h1.textContent = '恭喜通关！';
    } else {
        h1.textContent = '游戏结束';
    }
    
    gameOverScreen.style.display = 'flex';
}

// 更新显示
function updateDisplay() {
    scoreDisplay.textContent = gameState.score;
    levelDisplay.textContent = gameState.currentLevel;
    timeDisplay.textContent = gameState.time;
}

// 绘制游戏
function draw() {
    const level = getCurrentLevel();
    
    // 清空画布
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制赛道
    drawTrack(level);
    
    // 绘制障碍物
    drawObstacles();
    
    // 绘制玩家赛车
    drawPlayer();
}

// 绘制赛道
function drawTrack(level) {
    // 赛道主体
    ctx.fillStyle = level.trackColor;
    ctx.fillRect(TRACK_LEFT_BOUND, 0, TRACK_WIDTH, CANVAS_HEIGHT);
    
    // 赛道边缘
    ctx.strokeStyle = level.edgeColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(TRACK_LEFT_BOUND, 0);
    ctx.lineTo(TRACK_LEFT_BOUND, CANVAS_HEIGHT);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(TRACK_RIGHT_BOUND, 0);
    ctx.lineTo(TRACK_RIGHT_BOUND, CANVAS_HEIGHT);
    ctx.stroke();
    
    // 绘制赛道中间的虚线
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -trackOffset;
    
    // 中间分隔线
    const centerX = TRACK_LEFT_BOUND + TRACK_WIDTH / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();
    
    ctx.setLineDash([]);
}

// 绘制障碍物
function drawObstacles() {
    for (const obstacle of obstacles) {
        drawObstacle(obstacle);
    }
}

// 绘制单个障碍物
function drawObstacle(obstacle) {
    ctx.save();
    
    // 根据类型绘制不同的障碍物
    switch (obstacle.type) {
        case 'rectangle':
            // 简单矩形
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 添加边框
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            break;
            
        case 'car':
            // 汽车形状
            drawCarShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        case 'rock':
            // 岩石形状
            drawRockShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        case 'barrel':
            // 油桶形状
            drawBarrelShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        case 'tree':
            // 树木形状
            drawTreeShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        case 'cone':
            // 锥形路障
            drawConeShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        case 'mixed':
            // 混合类型，随机选择一种
            const types = ['rectangle', 'car', 'rock', 'barrel'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            obstacle.type = randomType;
            drawObstacle(obstacle);
            break;
            
        case 'boss':
            // Boss级障碍物
            drawBossShape(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.color);
            break;
            
        default:
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
    
    ctx.restore();
}

// 绘制汽车形状
function drawCarShape(x, y, width, height, color) {
    // 车身
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 10, width, height - 20);
    
    // 车顶
    ctx.fillStyle = '#333333';
    ctx.fillRect(x + 5, y + 20, width - 10, 20);
    
    // 车灯
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x + 2, y + 5, 8, 8);
    ctx.fillRect(x + width - 10, y + 5, 8, 8);
    
    // 轮子
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 3, y + height - 15, 8, 12);
    ctx.fillRect(x + width - 5, y + height - 15, 8, 12);
    ctx.fillRect(x - 3, y + 5, 8, 12);
    ctx.fillRect(x + width - 5, y + 5, 8, 12);
}

// 绘制岩石形状
function drawRockShape(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height * 0.3);
    ctx.lineTo(x + width * 0.8, y + height);
    ctx.lineTo(x + width * 0.2, y + height);
    ctx.lineTo(x, y + height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    // 添加纹理
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 绘制油桶形状
function drawBarrelShape(x, y, width, height, color) {
    // 主体
    ctx.fillStyle = color;
    ctx.fillRect(x, y + 5, width, height - 10);
    
    // 顶部和底部
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(x - 2, y, width + 4, 8);
    ctx.fillRect(x - 2, y + height - 8, width + 4, 8);
    
    // 反光条
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 20, width - 10, 5);
    ctx.fillRect(x + 5, y + height - 25, width - 10, 5);
}

// 绘制树木形状
function drawTreeShape(x, y, width, height, color) {
    // 树干
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + width * 0.35, y + height * 0.6, width * 0.3, height * 0.4);
    
    // 树冠
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height * 0.6);
    ctx.lineTo(x, y + height * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // 第二层树冠
    ctx.fillStyle = '#2e8b2e';
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y + height * 0.15);
    ctx.lineTo(x + width * 0.9, y + height * 0.5);
    ctx.lineTo(x + width * 0.1, y + height * 0.5);
    ctx.closePath();
    ctx.fill();
}

// 绘制锥形路障
function drawConeShape(x, y, width, height, color) {
    // 锥形主体
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
    
    // 白色条纹
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + width * 0.2, y + height * 0.3, width * 0.6, 5);
    ctx.fillRect(x + width * 0.15, y + height * 0.6, width * 0.7, 5);
    
    // 底座
    ctx.fillStyle = '#333333';
    ctx.fillRect(x - 5, y + height - 5, width + 10, 8);
}

// 绘制Boss形状
function drawBossShape(x, y, width, height, color) {
    // 主体
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    
    // 邪恶的眼睛
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x + 8, y + 15, 10, 10);
    ctx.fillRect(x + width - 18, y + 15, 10, 10);
    
    // 眼睛瞳孔
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 12, y + 18, 4, 4);
    ctx.fillRect(x + width - 14, y + 18, 4, 4);
    
    // 嘴巴
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 10, y + 40, width - 20, 8);
    
    // 尖牙
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12, y + 42, 5, 5);
    ctx.fillRect(x + width - 17, y + 42, 5, 5);
    
    // 边框
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
}

// 绘制玩家赛车
function drawPlayer() {
    ctx.save();
    
    // 赛车主体
    ctx.fillStyle = '#0066ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // 赛车车顶
    ctx.fillStyle = '#0044cc';
    ctx.fillRect(player.x + 5, player.y + 20, player.width - 10, 25);
    
    // 挡风玻璃
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(player.x + 8, player.y + 25, player.width - 16, 15);
    
    // 前灯
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(player.x + 3, player.y, 8, 8);
    ctx.fillRect(player.x + player.width - 11, player.y, 8, 8);
    
    // 尾灯
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x + 3, player.y + player.height - 10, 8, 8);
    ctx.fillRect(player.x + player.width - 11, player.y + player.height - 10, 8, 8);
    
    // 轮子
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x - 3, player.y + 5, 8, 12);
    ctx.fillRect(player.x + player.width - 5, player.y + 5, 8, 12);
    ctx.fillRect(player.x - 3, player.y + player.height - 17, 8, 12);
    ctx.fillRect(player.x + player.width - 5, player.y + player.height - 17, 8, 12);
    
    // 赛车编号
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('01', player.x + player.width / 2, player.y + 55);
    
    ctx.restore();
}

// 绘制初始界面
function drawInitialScreen() {
    // 绘制一个简单的背景
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 绘制赛道预览
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(TRACK_LEFT_BOUND, 0, TRACK_WIDTH, CANVAS_HEIGHT);
    
    // 边缘
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(TRACK_LEFT_BOUND, 0);
    ctx.lineTo(TRACK_LEFT_BOUND, CANVAS_HEIGHT);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(TRACK_RIGHT_BOUND, 0);
    ctx.lineTo(TRACK_RIGHT_BOUND, CANVAS_HEIGHT);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // 绘制预览赛车
    ctx.fillStyle = '#0066ff';
    ctx.fillRect(CANVAS_WIDTH / 2 - 20, CANVAS_HEIGHT - 150, 40, 70);
}

// 页面加载完成后初始化
window.addEventListener('load', init);
