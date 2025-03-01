let likeClickCount = 0;
let dislikeClickCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 获取所有需要的 DOM 元素
    const face = document.getElementById('face');
    const mouth = document.getElementById('mouth');
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    const likeBtn = document.getElementById('like');
    const dislikeBtn = document.getElementById('dislike');
    const loveText = document.querySelector('.love-text');
    const faceContainer = document.querySelector('.face-container');
    
    const leftBlush = document.querySelector('.blush.left');
    const rightBlush = document.querySelector('.blush.right');
    const likeSound = document.getElementById('likeSound');
    const dislikeSound = document.getElementById('dislikeSound');
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.5;

    // 定义全局变量来跟踪动画状态
    let isAnimating = false;
    let blinkInterval;
    let mouthAnimInterval;
    let isMusicPlaying = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // 添加鼠标移动事件监听器
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateEyesPosition();
    });

    // 更新眼睛位置的函数
    function updateEyesPosition() {
        if (isAnimating) return;

        const faceRect = face.getBoundingClientRect();
        const faceCenterX = faceRect.left + faceRect.width / 2;
        const faceCenterY = faceRect.top + faceRect.height / 2;

        const angle = Math.atan2(mouseY - faceCenterY, mouseX - faceCenterX);
        const distance = Math.min(10, Math.sqrt(Math.pow(mouseX - faceCenterX, 2) + Math.pow(mouseY - faceCenterY, 2)) / 20);

        const eyeX = Math.cos(angle) * distance;
        const eyeY = Math.sin(angle) * distance;

        leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
    }

    // 修改 startIdleAnimations 函数
    function startIdleAnimations() {
        clearTimeout(blinkInterval);
        clearTimeout(mouthAnimInterval);
        
        // 重置眼睛和嘴巴样式
        anime.remove([leftEye, rightEye, mouth]);
        
        leftEye.style.height = '45px';
        rightEye.style.height = '45px';
        leftEye.style.borderRadius = '50%';
        rightEye.style.borderRadius = '50%';
        leftEye.style.transition = 'transform 0.3s ease';
        rightEye.style.transition = 'transform 0.3s ease';
        
        // 设置默认笑脸
        mouth.style.height = '60px';
        mouth.style.borderRadius = '0 0 60px 60px';
        mouth.style.borderTop = 'none';
        mouth.style.borderBottom = '12px solid #333';
        mouth.style.transform = 'scale(1.1)';

        // 添加默认笑脸动画
        anime({
            targets: mouth,
            scale: [1.1, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .5)',
            complete: function() {
                // 启动持续的微笑动画
                anime({
                    targets: mouth,
                    scale: [1, 1.05, 1],
                    duration: 3000,
                    easing: 'easeInOutQuad',
                    loop: true
                });
            }
        });

        // 启动眨眼动画
        function blinkEyes() {
            if (isAnimating) return;
            
            anime({
                targets: [leftEye, rightEye],
                height: [
                    {value: 5, duration: 100},
                    {value: 45, duration: 100}
                ],
                easing: 'easeInOutQuad',
                complete: function() {
                    // 随机间隔眨眼
                    blinkInterval = setTimeout(blinkEyes, Math.random() * 3000 + 2000);
                }
            });
        }

        // 启动嘴巴微动画
        function mouthAnimation() {
            if (isAnimating) return;
            
            anime({
                targets: mouth,
                height: [
                    {value: 58, duration: 800},
                    {value: 60, duration: 800}
                ],
                easing: 'easeInOutQuad',
                complete: function() {
                    mouthAnimInterval = setTimeout(mouthAnimation, 1600);
                }
            });
        }
        
        // 启动动画
        setTimeout(blinkEyes, 500);
        setTimeout(mouthAnimation, 500);

        // 初始化眼睛位置
        updateEyesPosition();
    }

    // 添加 createHeart 函数定义
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'particle';
        heart.style.backgroundColor = `hsl(${Math.random() * 60 + 330}, 100%, 60%)`;
        heart.style.left = Math.random() * 200 + 'px';
        heart.style.top = Math.random() * 200 + 'px';
        faceContainer.appendChild(heart);
        
        anime({
            targets: heart,
            translateX: Math.random() * 200 - 100,
            translateY: -100 - Math.random() * 100,
            scale: [0, 1],
            opacity: {
                value: [1, 0],
                duration: 1000,
                easing: 'linear'
            },
            duration: 1000,
            easing: 'easeOutCubic',
            complete: function() {
                heart.remove();
            }
        });
    }

    // 添加 createEmoji 函数定义
    function createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        const emojis = ['❤️', '😊', '✨', '🌟', '💖', '💕', '💓', '💗', '💝'];
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 200 + 'px';
        emoji.style.top = Math.random() * 200 + 'px';
        faceContainer.appendChild(emoji);
        
        const angle = Math.random() * Math.PI;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1000 + 1500;
        
        anime({
            targets: emoji,
            translateY: -distance * Math.sin(angle),
            translateX: distance * Math.cos(angle),
            rotate: Math.random() * 360,
            scale: [0, 1.5],
            opacity: {
                value: [0, 1, 0],
                duration: duration,
                easing: 'easeOutQuad'
            },
            easing: 'easeOutCirc',
            duration: duration,
            complete: function() {
                emoji.remove();
            }
        });
    }

    // 添加 playSound 函数定义
    function playSound(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0; // 重置音频到开始位置
            audioElement.play().catch(error => {
                console.log('音频播放失败:', error);
            });
        }
    }

    // 添加 createRipple 函数
    function createRipple(event, button) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        button.appendChild(ripple);
    
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
    
        const x = event.clientX - rect.left - size/2;
        const y = event.clientY - rect.top - size/2;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
    
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    // 创建一个函数来处理音乐播放
    function handleBackgroundMusic() {
        if (!isMusicPlaying) {
            // 添加ended事件监听器实现循环播放
            bgMusic.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play().catch(error => {
                    console.log('音乐循环播放失败:', error);
                });
            });
            
            bgMusic.play().catch(error => {
                console.log('音乐播放失败:', error);
            });
            isMusicPlaying = true;
        }
    }

    // 修改 like 按钮的事件监听器
    likeBtn.addEventListener('click', (event) => {
        handleBackgroundMusic(); // 只在第一次点击时会真正播放音乐
        likeClickCount = (likeClickCount % 3) + 1;
        createRipple(event, likeBtn);
        // 删除重复的音乐控制代码
        // bgMusic.pause();
        // bgMusic.currentTime = 0;
        // bgMusic.play().catch(error => {
        //     console.log('音乐播放失败:', error);
        // });
        // 停止当前音效并播放新的音效
        likeSound.pause();
        likeSound.currentTime = 0;
        playSound(likeSound);
        // 清除所有已存在的emoji元素
        const existingEmojis = document.querySelectorAll('.emoji');
        existingEmojis.forEach(emoji => emoji.remove());

        // 清除所有正在进行的动画
        anime.remove(face);
        anime.remove(mouth);
        anime.remove(leftEye);
        anime.remove(rightEye);
        anime.remove(faceContainer);

        // 重置表情状态
        face.style.backgroundColor = '#ffde59';
        face.style.transform = 'scale(1)';
        
        // 播放音效
        playSound(likeSound);
        
        // 添加加载状态，防止重复点击
        likeBtn.classList.add('loading');
        setTimeout(() => likeBtn.classList.remove('loading'), 1000);
        
        // 显示文字和红晕
        loveText.style.opacity = '1';
        loveText.style.transform = 'translateY(0)';
        leftBlush.style.opacity = likeClickCount >= 2 ? '1' : '0';
        rightBlush.style.opacity = likeClickCount >= 2 ? '1' : '0';
        
        // 根据点击次数设置不同的动画效果
        switch(likeClickCount) {
            case 1: // 第一级动画
                // 基础开心表情
                anime({
                    targets: mouth,
                    borderRadius: '0 0 40px 40px',
                    height: 50,
                    duration: 500,
                    easing: 'easeOutElastic(1, .5)'
                });
                mouth.style.borderTop = 'none';
                mouth.style.borderBottom = '8px solid #333';
                
                anime({
                    targets: [leftEye, rightEye],
                    height: 10,
                    borderRadius: '50% 50% 0 0',
                    duration: 500,
                    easing: 'easeOutElastic(1, .5)'
                });
                break;
                
            case 2: // 第二级动画
                // 更夸张的开心表情
                anime({
                    targets: mouth,
                    borderRadius: '0 0 60px 60px',
                    height: 70,
                    duration: 800,
                    easing: 'easeOutElastic(1, .3)'
                });
                mouth.style.borderTop = 'none';
                mouth.style.borderBottom = '12px solid #333';
                
                anime({
                    targets: [leftEye, rightEye],
                    height: 8,
                    borderRadius: '50% 50% 0 0',
                    duration: 800,
                    easing: 'easeOutElastic(1, .3)'
                });
                
                // 添加彩虹背景
                face.style.background = 'linear-gradient(45deg, #ffde59, #ff9999, #ff99cc, #99ff99)';
                break;
                
            case 3: // 第三级动画
                // 超级夸张的开心表情
                anime({
                    targets: mouth,
                    borderRadius: '0 0 80px 80px',
                    height: 90,
                    duration: 1000,
                    easing: 'easeOutElastic(1, .2)'
                });
                mouth.style.borderTop = 'none';
                mouth.style.borderBottom = '15px solid #333';
                
                anime({
                    targets: [leftEye, rightEye],
                    height: 5,
                    borderRadius: '50% 50% 0 0',
                    duration: 1000,
                    easing: 'easeOutElastic(1, .2)'
                });
                
                // 添加闪光效果
                face.style.background = 'linear-gradient(45deg, #ffde59, #ffd700, #ffde59)';
                face.style.animation = 'sparkle 1s infinite';
                break;
        }
        
        // 按钮动画
        anime({
            targets: likeBtn,
            scale: [0.5, 1.2, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .5)'
        });
        
        // 爱心特效数量随级别增加
        const heartCount = likeClickCount * 10;
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                createHeart();
            }, i * 100);
        }
        
        // 表情符号数量随级别增加
        const emojiCount = likeClickCount * 5;
        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                createEmoji();
            }, i * 150);
        }
        
        // 脸部跳动动画
        anime({
            targets: faceContainer,
            scale: [1, 1.1 + (likeClickCount * 0.1), 1],
            duration: 600,
            easing: 'easeInOutQuad'
        });
        
        // 3秒后隐藏文字和红晕，并恢复待机动画
        setTimeout(() => {
            anime({
                targets: loveText,
                opacity: 0,
                translateY: -10,
                duration: 1000,
                easing: 'easeOutQuad'
            });
            
            anime({
                targets: [leftBlush, rightBlush],
                opacity: 0,
                duration: 1000,
                complete: function() {
                    startIdleAnimations();
                    face.style.background = '#ffde59';
                    face.style.animation = 'none';
                }
            });
        }, 3000);
    });
    
    // 点击不喜欢按钮
    dislikeBtn.addEventListener('click', (event) => {
        dislikeClickCount = (dislikeClickCount % 3) + 1; // 1-3循环
        createRipple(event, dislikeBtn);
        // 播放背景音乐
        bgMusic.play().catch(error => {
            console.log('音乐播放失败:', error);
        });
        // 播放音效
        playSound(dislikeSound);
        
        // 添加加载状态，防止重复点击
        dislikeBtn.classList.add('loading');
        setTimeout(() => dislikeBtn.classList.remove('loading'), 1000);
        
        // 根据点击次数设置不同的动画效果
        switch(dislikeClickCount) {
            case 1: // 第一级生气
                anime({
                    targets: mouth,
                    borderRadius: '40px 40px 0 0',
                    height: 10,
                    duration: 300,
                    easing: 'easeOutElastic(1, .5)'
                });
                mouth.style.borderBottom = 'none';
                mouth.style.borderTop = '8px solid #333';
                
                anime({
                    targets: face,
                    backgroundColor: '#ff6b6b',
                    scale: 1.2,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                break;
                
            case 2: // 第二级暴怒
                anime({
                    targets: mouth,
                    borderRadius: '60px 60px 0 0',
                    height: 5,
                    duration: 500,
                    easing: 'easeOutElastic(1, .3)'
                });
                mouth.style.borderBottom = 'none';
                mouth.style.borderTop = '12px solid #333';
                
                anime({
                    targets: face,
                    backgroundColor: '#ff4444',
                    scale: 1.3,
                    duration: 500,
                    easing: 'easeOutQuad'
                });
                break;
                
            case 3: // 第三级狂怒
                anime({
                    targets: mouth,
                    borderRadius: '80px 80px 0 0',
                    height: 3,
                    duration: 700,
                    easing: 'easeOutElastic(1, .2)'
                });
                mouth.style.borderBottom = 'none';
                mouth.style.borderTop = '15px solid #333';
                
                anime({
                    targets: face,
                    backgroundColor: '#ff0000',
                    scale: 1.4,
                    duration: 700,
                    easing: 'easeOutQuad'
                });
                
                // 添加火焰效果
                face.style.boxShadow = '0 0 20px #ff0000';
                break;
        }
        
        // 眼睛动画
        anime({
            targets: [leftEye, rightEye],
            height: 5 - (dislikeClickCount * 1),
            borderRadius: '5px',
            duration: 300 + (dislikeClickCount * 100),
            easing: 'easeOutElastic(1, .5)'
        });
        
        // 创建愤怒表情符号动画，数量随级别增加
        const emojiCount = dislikeClickCount * 5;
        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'emoji';
                const angryEmojis = ['😠', '😡', '💢', '😤', '😾', '👿', '🤬', '💀', '☠️', '⚡'];
                emoji.innerHTML = angryEmojis[Math.floor(Math.random() * angryEmojis.length)];
                emoji.style.left = Math.random() * 200 + 'px';
                emoji.style.top = Math.random() * 200 + 'px';
                faceContainer.appendChild(emoji);
                
                const angle = Math.random() * Math.PI;
                const distance = Math.random() * 100 + 50;
                const duration = Math.random() * 1000 + 1500;
                
                anime({
                    targets: emoji,
                    translateY: -distance * Math.sin(angle),
                    translateX: distance * Math.cos(angle),
                    rotate: Math.random() * 360,
                    scale: [0, 1.5 + (dislikeClickCount * 0.2)],
                    opacity: {
                        value: [0, 1, 0],
                        duration: duration,
                        easing: 'easeOutQuad'
                    },
                    easing: 'easeOutCirc',
                    duration: duration,
                    complete: function() {
                        emoji.remove();
                    }
                });
            }, i * (150 - dislikeClickCount * 20));
        }
        
        // 脸部抖动动画，强度随级别增加
        const shakeIntensity = dislikeClickCount * 5;
        anime({
            targets: faceContainer,
            translateX: [
                { value: -shakeIntensity * 2, duration: 100, delay: 0 },
                { value: shakeIntensity * 2, duration: 100, delay: 0 },
                { value: -shakeIntensity * 1.5, duration: 100, delay: 0 },
                { value: shakeIntensity * 1.5, duration: 100, delay: 0 },
                { value: -shakeIntensity, duration: 100, delay: 0 },
                { value: shakeIntensity, duration: 100, delay: 0 },
                { value: 0, duration: 100, delay: 0 }
            ],
            easing: 'easeInOutSine'
        });
        
        // 3秒后恢复正常状态
        setTimeout(() => {
            anime({
                targets: face,
                backgroundColor: '#ffde59',
                scale: 1,
                duration: 500,
                easing: 'easeOutQuad',
                complete: function() {
                    face.style.boxShadow = 'none';
                    startIdleAnimations();
                }
            });
        }, 3000);
    });
});