document.addEventListener('DOMContentLoaded', () => {
    const face = document.getElementById('face');
    const mouth = document.getElementById('mouth');
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    const likeBtn = document.getElementById('like');
    const dislikeBtn = document.getElementById('dislike');
    const loveText = document.querySelector('.love-text');
    const faceContainer = document.querySelector('.face-container');
    const particlesContainer = document.querySelector('.particles-container');
    const leftBlush = document.querySelector('.blush.left');
    const rightBlush = document.querySelector('.blush.right');
    const likeSound = document.getElementById('likeSound');
    const dislikeSound = document.getElementById('dislikeSound');
    
    // 定义全局变量来跟踪动画状态
    let isAnimating = false;
    let blinkInterval;
    let mouthAnimInterval;
    
    // 眨眼动画
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

    // 嘴巴微动画
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
    
    // 启动默认动画
    function startIdleAnimations() {
        clearTimeout(blinkInterval);
        clearTimeout(mouthAnimInterval);
        
        // 重置眼睛和嘴巴样式
        anime.remove([leftEye, rightEye, mouth]);
        
        leftEye.style.height = '45px';
        rightEye.style.height = '45px';
        leftEye.style.borderRadius = '50%';
        rightEye.style.borderRadius = '50%';
        
        mouth.style.height = '60px';
        mouth.style.borderRadius = '0 0 60px 60px';
        mouth.style.borderTop = 'none';
        mouth.style.borderBottom = '12px solid #333';
        
        // 启动眨眼和嘴巴动画
        setTimeout(blinkEyes, 500);
        setTimeout(mouthAnimation, 500);
    }
    
    // 初始启动待机动画
    startIdleAnimations();
    
    // 创建背景云朵
    function createClouds() {
        for (let i = 0; i < 8; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            const size = Math.random() * 100 + 50;
            cloud.style.width = size + 'px';
            cloud.style.height = size / 2 + 'px';
            cloud.style.top = Math.random() * window.innerHeight + 'px';
            cloud.style.animationDuration = Math.random() * 20 + 10 + 's';
            document.body.appendChild(cloud);
            
            setTimeout(() => cloud.remove(), (Math.random() * 20 + 10) * 1000);
        }
    }
    
    // 定期创建云朵
    setInterval(createClouds, 10000);
    createClouds();
    
    // 鼠标移动时眼睛跟随
    document.addEventListener('mousemove', (e) => {
        const eyeLeft = leftEye.getBoundingClientRect();
        const eyeRight = rightEye.getBoundingClientRect();
        
        // 计算鼠标与按钮的距离
        const likeRect = likeBtn.getBoundingClientRect();
        const dislikeRect = dislikeBtn.getBoundingClientRect();
        
        const distToLike = Math.hypot(
            e.clientX - (likeRect.left + likeRect.width/2),
            e.clientY - (likeRect.top + likeRect.height/2)
        );
        
        const distToDislike = Math.hypot(
            e.clientX - (dislikeRect.left + dislikeRect.width/2),
            e.clientY - (dislikeRect.top + dislikeRect.height/2)
        );
        
        // 根据鼠标位置计算瞳孔偏移
        const leftDx = Math.min(Math.max((e.clientX - eyeLeft.left - eyeLeft.width/2) / 10, -3), 3);
        const leftDy = Math.min(Math.max((e.clientY - eyeLeft.top - eyeLeft.height/2) / 10, -3), 3);
        
        const rightDx = Math.min(Math.max((e.clientX - eyeRight.left - eyeRight.width/2) / 10, -3), 3);
        const rightDy = Math.min(Math.max((e.clientY - eyeRight.top - eyeRight.height/2) / 10, -3), 3);
        
        // 应用瞳孔位置
        anime({
            targets: leftEye.querySelector(':after'),
            translateX: leftDx,
            translateY: leftDy,
            duration: 100,
            easing: 'easeOutQuad'
        });
        
        anime({
            targets: rightEye.querySelector(':after'),
            translateX: rightDx,
            translateY: rightDy,
            duration: 100,
            easing: 'easeOutQuad'
        });
        
        // 直接设置CSS变量来移动瞳孔
        leftEye.style.setProperty('--pupil-x', leftDx + 'px');
        leftEye.style.setProperty('--pupil-y', leftDy + 'px');
        rightEye.style.setProperty('--pupil-x', rightDx + 'px');
        rightEye.style.setProperty('--pupil-y', rightDy + 'px');
    });
    
    // 创建爱心特效
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
    
    // 创建表情符号
    function createEmoji() {
        const emojis = ['❤️', '😊', '✨', '🌟', '💖', '💕', '💓', '💗', '💝'];
        const emoji = document.createElement('div');
        emoji.className = 'emoji';
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 200 + 'px';
        emoji.style.top = Math.random() * 200 + 'px';
        faceContainer.appendChild(emoji);
        
        // 添加更自然的动画
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
    
    // 播放音效并添加错误处理
    function playSound(audioElement) {
        if (audioElement) {
            audioElement.play().catch(error => {
                console.log('音频播放失败:', error);
            });
        }
    }
    
    // 创建背景光晕元素
    const backgroundGlow = document.createElement('div');
    backgroundGlow.className = 'background-glow';
    document.body.appendChild(backgroundGlow);
    
    // 点击喜欢按钮
    likeBtn.addEventListener('click', () => {
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
        leftBlush.style.opacity = '1';
        rightBlush.style.opacity = '1';
        
        // 按钮动画
        anime({
            targets: likeBtn,
            scale: [0.5, 1.2, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .5)'
        });
        
        // 爱心特效
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createHeart();
            }, i * 100);
        }
        
        // 创建表情符号动画
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createEmoji();
            }, i * 150);
        }
        
        // 开心表情 - 使用anime.js动画
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
        
        // 脸部跳动动画
        anime({
            targets: faceContainer,
            scale: [1, 1.1, 1],
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
                }
            });
        }, 3000);
    });
    
    // 点击不喜欢按钮
    dislikeBtn.addEventListener('click', () => {
        // 播放音效
        playSound(dislikeSound);
        
        // 添加加载状态，防止重复点击
        dislikeBtn.classList.add('loading');
        setTimeout(() => dislikeBtn.classList.remove('loading'), 1000);
        
        // 愤怒表情 - 使用anime.js动画
        anime({
            targets: mouth,
            borderRadius: '40px 40px 0 0',
            height: 10,
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
        mouth.style.borderBottom = 'none';
        mouth.style.borderTop = '8px solid #333';
        
        // 表情变红和放大
        anime({
            targets: face,
            backgroundColor: '#ff6b6b',
            scale: 1.2,
            duration: 300,
            easing: 'easeOutQuad',
            complete: function() {
                // 3秒后恢复正常状态
                setTimeout(() => {
                    // 恢复表情
                    anime({
                        targets: face,
                        backgroundColor: '#ffde59',
                        scale: 1,
                        duration: 500,
                        easing: 'easeOutQuad'
                    });
                    
                    // 恢复嘴巴
                    anime({
                        targets: mouth,
                        borderRadius: '0 0 40px 40px',
                        height: 40,
                        duration: 500,
                        easing: 'easeOutElastic(1, .5)'
                    });
                    mouth.style.borderTop = 'none';
                    mouth.style.borderBottom = '8px solid #333';
                    
                    // 恢复眼睛
                    anime({
                        targets: [leftEye, rightEye],
                        height: 30,
                        borderRadius: '50%',
                        duration: 500,
                        easing: 'easeOutElastic(1, .5)',
                        complete: function() {
                            startIdleAnimations();
                        }
                    });
                }, 3000);
            }
        });
        
        anime({
            targets: [leftEye, rightEye],
            height: 5,
            borderRadius: '5px',
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
        
        // 创建愤怒表情符号动画
        for (let i = 0; i < 10; i++) {
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
            }, i * 150);
        }
        
        // 脸部抖动动画
        anime({
            targets: faceContainer,
            translateX: [
                { value: -10, duration: 100, delay: 0 },
                { value: 10, duration: 100, delay: 0 },
                { value: -8, duration: 100, delay: 0 },
                { value: 8, duration: 100, delay: 0 },
                { value: -5, duration: 100, delay: 0 },
                { value: 5, duration: 100, delay: 0 },
                { value: 0, duration: 100, delay: 0 }
            ],
            easing: 'easeInOutSine'
        });
    });
});