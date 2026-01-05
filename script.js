// 自定义脚本 - AI年终总结动态效果

document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化Reveal.js - 调整配置适应新的大小
    Reveal.initialize({
        hash: true,
        controls: true,
        progress: true,
        center: false,
        transition: 'slide',
        transitionSpeed: 'fast',
        backgroundTransition: 'fade',
        width: '100%',
        height: '100%',
        margin: 0.075, // 7.5%的边距
        minScale: 0.2,
        maxScale: 2.0,
        
        // 插件配置
        plugins: [ RevealMarkdown, RevealHighlight, RevealZoom, RevealNotes ]
    });
    
    // 设置当前日期
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 初始化粒子背景
    initParticles();
    
    // 初始化图表
    initCharts();
    
    // 初始化计数器
    initCounters();
    
    // 初始化渠道网络图
    initChannelNetwork();
    
    // 键盘快捷键
    document.addEventListener('keydown', function(event) {
        // 空格键：播放/暂停
        if (event.code === 'Space') {
            event.preventDefault();
        }
        
        // F键：全屏切换
        if (event.code === 'KeyF') {
            event.preventDefault();
            toggleFullScreen();
        }
        
        // ESC键：退出全屏
        if (event.code === 'Escape') {
            if (document.fullscreenElement) {
                toggleFullScreen();
            }
        }
    });
    
    // Reveal.js 事件监听
    Reveal.on('slidechanged', function(event) {
        console.log('幻灯片切换到:', event.indexh, event.indexv);
        
        // 当幻灯片切换时，更新动态内容
        updateSlideContent(event.currentSlide);
        
        // 触发计数器动画
        if (event.currentSlide.querySelector('.stats-grid')) {
            animateCounters();
        }
        
        // 如果是渠道生态管理页面，重新绘制网络图
        if (event.currentSlide.querySelector('#channelNetwork')) {
            animateChannelNetwork();
        }
        
        // 如果是雷达图页面，确保图表正确显示
        if (event.currentSlide.querySelector('#skillRadar')) {
            setTimeout(() => {
                const radarChart = Chart.getChart('skillRadar');
                if (radarChart) {
                    radarChart.resize();
                    radarChart.update();
                }
            }, 300);
        }
    });
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', function() {
        setTimeout(() => {
            const charts = ['skillRadar', 'dataFlowChart'];
            charts.forEach(chartId => {
                const chart = Chart.getChart(chartId);
                if (chart) {
                    chart.resize();
                    chart.update();
                }
            });
            
            // 重新绘制网络图
            if (document.querySelector('#channelNetwork')) {
                animateChannelNetwork();
            }
        }, 200);
    });
    
    // 性能监控
    monitorPerformance();
    
    // 网络状态监听
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
});

// 初始化粒子背景
function initParticles() {
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("particles-js", {
            particles: {
                number: {
                    value: 80, // 减少粒子数量
                    density: {
                        enable: true,
                        value_area: 600
                    }
                },
                color: {
                    value: ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"]
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.4, // 降低透明度
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 2, // 减小粒子大小
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 100, // 减少连接线距离
                    color: "#3498db",
                    opacity: 0.2, // 降低透明度
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2, // 减慢移动速度
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 250,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 250,
                        size: 25,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 3
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// 初始化图表
function initCharts() {
    console.log('初始化图表...');
    
    // 技能雷达图 - 调整尺寸
    const radarCtx = document.getElementById('skillRadar');
    if (radarCtx) {
        radarCtx.width = 500;
        radarCtx.height = 500;
        
        const skillRadar = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['数据驱动力', '流程掌控力', '风险预见力', '资源协调力', '业务洞察力', '技术创新力'],
                datasets: [{
                    label: '2025年初',
                    data: [65, 70, 60, 55, 65, 50],
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    borderColor: '#ff6b6b',
                    borderWidth: 2,
                    pointBackgroundColor: '#ff6b6b',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1
                }, {
                    label: '2025年末',
                    data: [85, 90, 80, 75, 85, 70],
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderColor: '#4ecdc4',
                    borderWidth: 2,
                    pointBackgroundColor: '#4ecdc4',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            lineWidth: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            lineWidth: 1
                        },
                        pointLabels: {
                            color: '#ffffff',
                            font: {
                                size: 12,
                                weight: 'bold',
                                family: 'Segoe UI, Roboto, Arial'
                            },
                            padding: 10
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#ffffff',
                            font: {
                                size: 10
                            },
                            beginAtZero: true,
                            max: 100,
                            stepSize: 20,
                            showLabelBackdrop: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3498db',
                        borderWidth: 1,
                        cornerRadius: 6,
                        padding: 8
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    // 数据流图表
    const flowCtx = document.getElementById('dataFlowChart');
    if (flowCtx) {
        flowCtx.width = 550;
        flowCtx.height = 280;
        
        const dataFlowChart = new Chart(flowCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '数据报表产量',
                    data: [120, 135, 150, 145, 160, 155, 170, 165, 180, 175, 190, 185],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3498db',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1
                }, {
                    label: '数据处理效率',
                    data: [65, 68, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2ecc71',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3498db',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 10,
                                weight: 'bold'
                            },
                            padding: 6
                        },
                        title: {
                            display: true,
                            text: '月份',
                            color: '#b3b3cc',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: {top: 6, bottom: 0}
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            lineWidth: 1
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 10,
                                weight: 'bold'
                            },
                            padding: 6,
                            callback: function(value) {
                                return value + (this.datasetIndex === 0 ? ' 份' : ' %');
                            }
                        },
                        title: {
                            display: true,
                            text: '数值',
                            color: '#b3b3cc',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: {top: 0, bottom: 6}
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// 初始化计数器
function initCounters() {
    // 计数器目标值
    const counters = [
        { id: 'stat1', target: 200, suffix: '+' },
        { id: 'stat2', target: 50, suffix: '+' },
        { id: 'stat3', target: 100, suffix: '%' },
        { id: 'stat4', target: 15, suffix: '+' }
    ];
    
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) {
            element.setAttribute('data-target', counter.target);
            element.setAttribute('data-suffix', counter.suffix);
            element.textContent = '0' + counter.suffix;
        }
    });
}

// 动画计数器
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使动画更平滑
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    });
}

// 初始化渠道网络图
function initChannelNetwork() {
    const networkContainer = document.getElementById('channelNetwork');
    if (!networkContainer) return;
    
    // 清除现有内容
    networkContainer.innerHTML = '';
    
    // 设置容器大小
    networkContainer.style.position = 'relative';
    networkContainer.style.width = '100%';
    networkContainer.style.height = '380px';
}

// 动画渠道网络图
function animateChannelNetwork() {
    const networkContainer = document.getElementById('channelNetwork');
    if (!networkContainer) return;
    
    // 清除现有内容
    networkContainer.innerHTML = '';
    
    // 创建SVG元素
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 650 380");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    // 定义节点数据
    const nodes = [
        { id: 'center', x: 325, y: 190, name: '数据中台', radius: 20, color: '#e74c3c' },
        { id: 'node1', x: 130, y: 70, name: '同花顺', radius: 16, color: '#3498db' },
        { id: 'node2', x: 520, y: 70, name: '九方智投', radius: 16, color: '#3498db' },
        { id: 'node3', x: 90, y: 310, name: '渠道A', radius: 16, color: '#2ecc71' },
        { id: 'node4', x: 325, y: 310, name: 'PB业务', radius: 16, color: '#2ecc71' },
        { id: 'node5', x: 560, y: 310, name: '渠道B', radius: 16, color: '#2ecc71' },
        { id: 'node6', x: 40, y: 190, name: '互联网', radius: 14, color: '#f39c12' },
        { id: 'node7', x: 610, y: 190, name: '移动端', radius: 14, color: '#f39c12' }
    ];
    
    // 定义连接线
    const links = [
        { source: 'center', target: 'node1' },
        { source: 'center', target: 'node2' },
        { source: 'center', target: 'node3' },
        { source: 'center', target: 'node4' },
        { source: 'center', target: 'node5' },
        { source: 'center', target: 'node6' },
        { source: 'center', target: 'node7' },
        { source: 'node1', target: 'node3' },
        { source: 'node2', target: 'node5' }
    ];
    
    // 添加连接线（带有动画）
    links.forEach((link, index) => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        
        if (sourceNode && targetNode) {
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", sourceNode.x);
            line.setAttribute("y1", sourceNode.y);
            line.setAttribute("x2", sourceNode.x);
            line.setAttribute("y2", sourceNode.y);
            line.setAttribute("stroke", "rgba(52, 152, 219, 0.4)");
            line.setAttribute("stroke-width", "1.2");
            line.setAttribute("stroke-dasharray", "4,4");
            line.setAttribute("class", "network-line");
            
            svg.appendChild(line);
            
            // 动画绘制线条
            setTimeout(() => {
                line.setAttribute("x2", targetNode.x);
                line.setAttribute("y2", targetNode.y);
                line.setAttribute("stroke-dasharray", "none");
            }, index * 120);
        }
    });
    
    // 添加节点（带有动画）
    nodes.forEach((node, index) => {
        // 添加节点圆圈
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", "0");
        circle.setAttribute("fill", node.color);
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "1.2");
        circle.setAttribute("class", "network-node");
        circle.setAttribute("data-id", node.id);
        
        svg.appendChild(circle);
        
        // 动画显示节点
        setTimeout(() => {
            const animate = document.createElementNS(svgNS, "animate");
            animate.setAttribute("attributeName", "r");
            animate.setAttribute("from", "0");
            animate.setAttribute("to", node.radius.toString());
            animate.setAttribute("dur", "0.3s");
            animate.setAttribute("fill", "freeze");
            circle.appendChild(animate);
            animate.beginElement();
            
            // 添加脉冲效果
            circle.style.animation = `pulse 2s infinite ${index * 0.1}s`;
        }, index * 100);
        
        // 添加节点文本
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y + node.radius + 18);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "10");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("font-family", "Arial, sans-serif");
        text.textContent = node.name;
        text.setAttribute("opacity", "0");
        
        svg.appendChild(text);
        
        // 动画显示文本
        setTimeout(() => {
            text.setAttribute("opacity", "1");
        }, 600 + index * 70);
    });
    
    // 添加CSS动画
    const style = document.createElementNS(svgNS, "style");
    style.textContent = `
        @keyframes pulse {
            0% { r: ${nodes[0].radius}; }
            50% { r: ${nodes[0].radius + 1.5}; }
            100% { r: ${nodes[0].radius}; }
        }
        .network-node:hover {
            r: ${nodes[0].radius + 2};
            filter: drop-shadow(0 0 5px currentColor);
            cursor: pointer;
        }
        .network-line {
            transition: all 0.3s ease;
        }
    `;
    svg.appendChild(style);
    
    networkContainer.appendChild(svg);
    
    // 添加交互事件
    svg.addEventListener('click', function(event) {
        if (event.target.tagName === 'circle') {
            const nodeId = event.target.getAttribute('data-id');
            const node = nodes.find(n => n.id === nodeId);
            if (node) {
                showNotification(`点击了节点: ${node.name}`, 'info');
            }
        }
    });
}

// 更新幻灯片内容
function updateSlideContent(slide) {
    const slideIndex = Reveal.getIndices();
    console.log('当前幻灯片索引:', slideIndex.h, slideIndex.v);
    
    // 根据不同幻灯片索引执行不同操作
    switch(slideIndex.h) {
        case 2: // 数据枢纽角色
            if (slideIndex.v === 0) {
                animateCounters();
            }
            break;
        case 5: // 渠道生态管理
            if (slideIndex.v === 0) {
                setTimeout(() => {
                    animateChannelNetwork();
                    // 更新渠道统计数据
                    updateChannelStats();
                }, 300);
            }
            break;
        case 6: // 年度能力评估
            if (slideIndex.v === 0) {
                setTimeout(() => {
                    const radarChart = Chart.getChart('skillRadar');
                    if (radarChart) {
                        radarChart.resize();
                        radarChart.update('active');
                    }
                }, 300);
            }
            break;
    }
}

// 更新渠道统计数据
function updateChannelStats() {
    const stats = [
        { id: 'activeChannels', target: 12, duration: 1000 },
        { id: 'channelROI', target: 156, duration: 1400 },
        { id: 'newSystems', target: 2, duration: 600 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateValue(element, 0, stat.target, stat.duration);
        }
    });
}

// 通用数值动画函数
function animateValue(element, start, end, duration) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const update = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // 使用缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + easeOutCubic * (end - start));
        
        element.textContent = current.toString();
        
        if (now < endTime) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toString();
        }
    };
    
    update();
}

// 全屏切换
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`全屏请求失败: ${err.message}`);
                showNotification('全屏模式请求失败', 'error');
            });
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 打字机效果
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 网络状态指示器
function updateConnectionStatus() {
    const status = navigator.onLine ? '在线' : '离线';
    console.log(`网络状态: ${status}`);
    
    if (!navigator.onLine) {
        showNotification('网络连接已断开，部分动态功能可能受限', 'warning');
    } else {
        console.log('网络连接正常');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 
                         type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        background: ${type === 'error' ? 'rgba(231, 76, 60, 0.9)' :
                    type === 'warning' ? 'rgba(241, 196, 15, 0.9)' :
                    type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
        color: white;
        padding: 10px 14px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
        z-index: 10000;
        font-family: 'Segoe UI', sans-serif;
        font-size: 12px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏通知
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 性能监控
function monitorPerformance() {
    if ('performance' in window) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`页面加载时间: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn(`页面加载较慢: ${loadTime}ms`);
            showNotification('页面加载时间较长，建议检查网络连接', 'warning');
        }
    }
    
    // 监控FPS
    let lastTime = performance.now();
    let frames = 0;
    
    function checkFPS() {
        const currentTime = performance.now();
        frames++;
        
        if (currentTime > lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (currentTime - lastTime));
            frames = 0;
            lastTime = currentTime;
            
            if (fps < 30) {
                console.warn(`低FPS警告: ${fps}`);
            }
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    requestAnimationFrame(checkFPS);
}

// 初始化一些动态效果
window.addEventListener('load', function() {
    // 添加打字机效果到终端
    const typingElements = document.querySelectorAll('.typing-effect code');
    typingElements.forEach(element => {
        const originalText = element.textContent;
        element.textContent = '';
        setTimeout(() => {
            typeWriter(element, originalText, 70);
        }, 800);
    });
    
    // 添加鼠标跟随效果
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelector('#particles-js');
        if (particles) {
            particles.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(52, 152, 219, 0.06) 0%, transparent 50%)`;
        }
    });
});