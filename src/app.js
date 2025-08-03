// app.js - Firebase配置和应用逻辑

// 使用全局变量方式引入Firebase SDK
// 注意：在实际项目中，应该使用npm安装Firebase并使用模块化导入
// 这里使用CDN方式简化演示

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyCCbq5fBkoVKV6nAKrbliPz7jxSqNZgckM",
    authDomain: "ai-gift-recommender-d6076.firebaseapp.com",
    projectId: "ai-gift-recommender-d6076",
    storageBucket: "ai-gift-recommender-d6076.firebasestorage.app",
    messagingSenderId: "719636185968",
    appId: "1:719636185968:web:9e6ed11e94dc6416ae05b5",
    measurementId: "G-SFNYKHWSJJ"
  };

// 初始化Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// 多语言支持
const translations = {
    'zh': {
        'login.title': '欢迎回来',
        'login.subtitle': '登录以继续您的灵感之旅',
        'login.google': '使用 Google 登录',
        'login.guest': '以访客身份继续',
        'welcome.title': '告别送礼困难症',
        'welcome.subtitle': '让AI用行为科学为你找到最有心意的礼物。',
        'welcome.button': '开启个性化推荐',
        'step1.progress': '第 1 / 5 步',
        'step1.title': '您要为谁挑选礼物？',
        'step1.opt1': '情侣',
        'step1.opt2': '好朋友',
        'step1.opt3': '同事',
        'step1.opt4': '家人',
        'step2.progress': '第 2 / 5 步',
        'step2.title': '这是一个什么场合？',
        'step2.opt1': '生日',
        'step2.opt2': '纪念日',
        'step2.opt3': '表达感谢',
        'step2.opt4': '庆祝',
        'step3.progress': '第 3 / 5 步',
        'step3.title': '您希望礼物传递什么感觉？',
        'step3.opt1': '惊喜的',
        'step3.opt2': '感动的',
        'step3.opt3': '有趣的',
        'step3.opt4': '治愈的',
        'step4.progress': '第 4 / 5 步',
        'step4.title': '关于TA的性格，哪个描述更贴切？',
        'step4.opt1_title': '深思熟虑的计划者',
        'step4.opt1_desc': '喜欢提前规划，享受一切尽在掌握的感觉。',
        'step4.opt2_title': '随性而为的探险家',
        'step4.opt2_desc': '享受当下的惊喜，喜欢说走就走的旅行。',
        'step5.progress': '第 5 / 5 步',
        'step5.title': 'TA最喜欢用什么方式感受爱？',
        'step5.opt1': '肯定的言语',
        'step5.opt2': '精心的时刻',
        'step5.opt3': '服务的行动',
        'step5.opt4': '收到礼物',
        'loading.title': '正在为您寻找灵感...',
        'loading.subtitle': '正在百万个奇思妙想中为您搜寻',
        'results.title': '我们为您找到了这些灵感！',
        'results.subtitle': '希望能帮你打开思路',
        'feedback.title': '您对这次推荐满意吗？',
        'feedback.placeholder': '可以分享更多想法吗？（可选）',
        'feedback.button': '提交反馈',
        'gift.price': '价格范围',
        'gift.why': '为什么适合',
        'gift.where': '哪里购买',
        'gift.select': '加入心愿单',
        'gift.selected': '已加入心愿单'
    },
    'en': {
        'login.title': 'Welcome Back',
        'login.subtitle': 'Sign in to continue your inspiration journey',
        'login.google': 'Sign in with Google',
        'login.guest': 'Continue as Guest',
        'welcome.title': 'Say Goodbye to Gift Dilemmas',
        'welcome.subtitle': 'Let AI find the most thoughtful gifts using behavioral science.',
        'welcome.button': 'Start Personalized Recommendations',
        'step1.progress': 'Step 1 of 5',
        'step1.title': 'Who are you shopping for?',
        'step1.opt1': 'Partner',
        'step1.opt2': 'Friend',
        'step1.opt3': 'Colleague',
        'step1.opt4': 'Family',
        'step2.progress': 'Step 2 of 5',
        'step2.title': 'What is the occasion?',
        'step2.opt1': 'Birthday',
        'step2.opt2': 'Anniversary',
        'step2.opt3': 'Thank You',
        'step2.opt4': 'Celebration',
        'step3.progress': 'Step 3 of 5',
        'step3.title': 'What feeling do you want to convey?',
        'step3.opt1': 'Surprising',
        'step3.opt2': 'Touching',
        'step3.opt3': 'Fun',
        'step3.opt4': 'Comforting',
        'step4.progress': 'Step 4 of 5',
        'step4.title': 'Which description fits their personality better?',
        'step4.opt1_title': 'Thoughtful Planner',
        'step4.opt1_desc': 'Likes to plan ahead and enjoys having everything under control.',
        'step4.opt2_title': 'Spontaneous Adventurer',
        'step4.opt2_desc': 'Enjoys surprises and likes to go on impromptu adventures.',
        'step5.progress': 'Step 5 of 5',
        'step5.title': 'How do they prefer to receive love?',
        'step5.opt1': 'Words of Affirmation',
        'step5.opt2': 'Quality Time',
        'step5.opt3': 'Acts of Service',
        'step5.opt4': 'Receiving Gifts',
        'loading.title': 'Finding inspiration for you...',
        'loading.subtitle': 'Searching through millions of creative ideas',
        'results.title': 'We found these inspirations for you!',
        'results.subtitle': 'Hope these help spark some ideas',
        'feedback.title': 'Are you satisfied with these recommendations?',
        'feedback.placeholder': 'Would you like to share more thoughts? (optional)',
        'feedback.button': 'Submit Feedback',
        'gift.price': 'Price Range',
        'gift.why': 'Why It Fits',
        'gift.where': 'Where to Buy',
        'gift.select': 'Add to Wishlist',
        'gift.selected': 'Added to Wishlist'
    }
};

// 当前语言
let currentLang = 'zh';

// 用户会话数据
let sessionCreated = false; // 添加标志防止重复创建会话
let sessionData = {
    userId: null,
    sessionId: null,
    answers: {},
    recommendations: [],
    selectedGifts: [],
    feedback: {
        rating: 0,
        comment: ''
    },
    events: [],
    metrics: {
        sessionStartTime: null,
        totalTimeSpent: 0,
        stepCompletionTimes: {},
        errorCount: 0,
        retryCount: 0
    },
    userBehavior: {
        clickCount: 0,
        scrollCount: 0,
        languageSwitches: 0,
        backButtonUsage: 0
    }
};

// 事件类型常量定义
const EVENT_TYPES = {
    SESSION_START: 'session_start',      // 用户会话开始
    SESSION_END: 'session_end',          // 用户会话结束
    LOGIN_ATTEMPT: 'login_attempt',      // 用户尝试登录
    LOGIN_SUCCESS: 'login_success',      // 用户登录成功
    LOGIN_FAILURE: 'login_failure',      // 用户登录失败
    QUIZ_START: 'quiz_start',            // 用户开始回答与礼物推荐相关的问题
    STEP_START: 'step_start',            // 开始回答某个问题步骤
    STEP_COMPLETE: 'step_complete',      // 完成某个问题步骤
    ANSWER_SELECTED: 'answer_selected',  // 用户选择了某个答案
    QUIZ_COMPLETED: 'quiz_completed',    // 用户完成了所有问题的回答
    RECOMMENDATION_GENERATED: 'recommendation_generated',  // 生成礼物推荐列表
    GIFT_VIEWED: 'gift_viewed',          // 用户查看了某个礼物推荐结果
    GIFT_SELECTED: 'gift_selected',      // 用户选择了某个礼物
    FEEDBACK_SUBMITTED: 'feedback_submitted',  // 用户提交反馈
    LANGUAGE_CHANGED: 'language_changed',      // 切换语言
    ERROR_OCCURRED: 'error_occurred',          // 发生错误
};

// 模拟的礼物推荐数据
const mockRecommendations = [
    {
        id: 1,
        title: '定制星空投影灯',
        description: '可以投影出特定日期的星空图，让浪漫的记忆永存。',
        price: '¥199 - ¥299',
        reason: '结合了浪漫元素和个性化定制，非常适合纪念日或生日礼物。',
        where: '淘宝、亚马逊、天猫',
        image: 'https://via.placeholder.com/150?text=星空灯'
    },
    {
        id: 2,
        title: '手工制作的皮革钱包',
        description: '可以刻上名字或特殊日期的高质量皮革钱包。',
        price: '¥300 - ¥500',
        reason: '实用且有纪念意义，适合喜欢精致物品的人。',
        where: '手工艺品网站、Etsy、定制皮具店',
        image: 'https://via.placeholder.com/150?text=皮革钱包'
    },
    {
        id: 3,
        title: '定制照片书',
        description: '收集你们共同的回忆，制作成精美的硬皮照片书。',
        price: '¥150 - ¥300',
        reason: '充满情感价值，可以记录你们的故事和珍贵时刻。',
        where: '美图秀秀、小红书推荐的照片书App',
        image: 'https://via.placeholder.com/150?text=照片书'
    }
];

// DOM元素
const loginPage = document.getElementById('login-page');
const welcomePage = document.getElementById('welcome-page');
const questionsContainer = document.getElementById('questions-container');
const loadingPage = document.getElementById('loading-page');
const resultsPage = document.getElementById('results-page');

const googleLoginBtn = document.getElementById('google-login');
const guestLoginBtn = document.getElementById('guest-login');
const startButton = document.getElementById('start-button');

const stepRelationship = document.getElementById('step-relationship');
const stepOccasion = document.getElementById('step-occasion');
const stepIntent = document.getElementById('step-intent');
const stepPersonality = document.getElementById('step-personality');
const stepLoveLanguage = document.getElementById('step-love-language');

const recommendationsContainer = document.getElementById('recommendations-container');
const starRating = document.getElementById('star-rating');
const feedbackForm = document.getElementById('feedback-form');
const submitFeedbackBtn = document.getElementById('submit-feedback');

const langZhBtn = document.getElementById('lang-zh');
const langEnBtn = document.getElementById('lang-en');

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    // 应用当前语言
    applyTranslations();
    
    // 监听认证状态变化
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // 用户已登录
            sessionData.userId = user.uid;
            
            recordEvent(EVENT_TYPES.LOGIN_SUCCESS, {
                userId: user.uid,
                loginMethod: user.isAnonymous ? 'anonymous' : 'authenticated',
                timestamp: new Date()
            });
            
            showPage(welcomePage);
            if (!sessionCreated) {
                createSession();
            }
        } else {
            // 用户未登录
            recordEvent(EVENT_TYPES.LOGIN_ATTEMPT, {
                status: 'no_user',
                timestamp: new Date()
            });
            showPage(loginPage);
        }
    });
    
    // 添加全局用户行为监听器
    addGlobalEventListeners();
});

// 添加全局事件监听器
function addGlobalEventListeners() {
    // 页面离开事件追踪
    window.addEventListener('beforeunload', function() {
        if (sessionData.sessionId) {
            // 计算总会话时间
            if (sessionData.metrics.sessionStartTime) {
                sessionData.metrics.totalTimeSpent = Date.now() - sessionData.metrics.sessionStartTime.getTime();
            }
            
            recordEvent(EVENT_TYPES.SESSION_END, {
                sessionId: sessionData.sessionId,
                totalTimeSpent: sessionData.metrics.totalTimeSpent,
                completedSteps: Object.keys(sessionData.answers).length,
                finalMetrics: sessionData.metrics,
                finalBehavior: sessionData.userBehavior,
                exitType: 'beforeunload'
            });
            
            // 尝试保存最终数据
            if (navigator.sendBeacon && sessionData.sessionId) {
                const finalData = {
                    events: sessionData.events,
                    metrics: sessionData.metrics,
                    userBehavior: sessionData.userBehavior,
                    sessionEndTime: new Date()
                };
                
                navigator.sendBeacon('/api/save-session-data', JSON.stringify({
                    sessionId: sessionData.sessionId,
                    data: finalData
                }));
            }
        }
    });
}

// 登录按钮事件监听
googleLoginBtn.addEventListener('click', function() {
    // 使用重定向方式而不是弹窗，避免被浏览器阻止
    auth.signInWithRedirect(provider)
        .catch(function(error) {
            console.error('Google登录失败:', error);
            alert('登录失败: ' + error.message);
        });
});

// 处理重定向登录后的结果
auth.getRedirectResult().then(function(result) {
    if (result.user) {
        // 登录成功
        var user = result.user;
        sessionData.userId = user.uid;
        if (!sessionCreated) {
            createSession();
        }
    }
}).catch(function(error) {
    console.error('Google登录失败:', error);
    // 显示错误信息给用户
    if (error.code === 'auth/account-exists-with-different-credential') {
        alert('此邮箱已经使用其他登录方式注册过账号');
    }
});

guestLoginBtn.addEventListener('click', function() {
    auth.signInAnonymously()
        .then(function(result) {
            // 匿名登录成功
            if (result && result.user) {
                sessionData.userId = result.user.uid;
            } else if (auth.currentUser) {
                sessionData.userId = auth.currentUser.uid;
            }
            if (!sessionCreated) {
                createSession();
            }
            console.log('匿名登录成功，用户ID:', sessionData.userId);
        })
        .catch(function(error) {
            console.error('匿名登录失败:', error);
            alert('匿名登录失败: ' + error.message);
        });
});

// 开始按钮事件监听
startButton.addEventListener('click', function() {
    // 记录问答开始事件
    recordEvent(EVENT_TYPES.QUIZ_START, {
        timestamp: new Date(),
        totalQuestions: 5
    });
    
    showPage(questionsContainer);
    showStep(stepRelationship);
    
    // 记录第一个步骤开始
    recordEvent(EVENT_TYPES.STEP_START, {
        stepName: 'step-relationship',
        timestamp: new Date()
    });
});

// 选项按钮事件监听
document.querySelectorAll('.option-btn').forEach(function(button) {
    button.addEventListener('click', function(e) {
        const step = e.currentTarget.closest('div[id^="step-"]').id;
        const value = e.currentTarget.dataset.value;
        
        // 记录步骤完成事件
        recordEvent(EVENT_TYPES.STEP_COMPLETE, {
            stepName: step,
            answer: value,
            timestamp: new Date()
        });
        
        // 记录用户回答
        recordAnswer(step, value);
        
        // 根据当前步骤显示下一步
        if (step === 'step-relationship') {
            hideStep(stepRelationship);
            recordEvent(EVENT_TYPES.STEP_START, {
                stepName: 'step-occasion',
                timestamp: new Date()
            });
            showStep(stepOccasion);
        } else if (step === 'step-occasion') {
            hideStep(stepOccasion);
            recordEvent(EVENT_TYPES.STEP_START, {
                stepName: 'step-intent',
                timestamp: new Date()
            });
            showStep(stepIntent);
        } else if (step === 'step-intent') {
            hideStep(stepIntent);
            recordEvent(EVENT_TYPES.STEP_START, {
                stepName: 'step-personality',
                timestamp: new Date()
            });
            showStep(stepPersonality);
        } else if (step === 'step-personality') {
            hideStep(stepPersonality);
            recordEvent(EVENT_TYPES.STEP_START, {
                stepName: 'step-love-language',
                timestamp: new Date()
            });
            showStep(stepLoveLanguage);
        } else if (step === 'step-love-language') {
            hideStep(stepLoveLanguage);
            
            // 记录问答完成事件
            recordEvent(EVENT_TYPES.QUIZ_COMPLETED, {
                totalStepsCompleted: 5,
                allAnswers: sessionData.answers,
                timestamp: new Date()
            });
            
            showPage(loadingPage);
            
            // 模拟加载时间
            setTimeout(function() {
                const recommendationStartTime = Date.now();
                generateRecommendations();
                
                recordEvent(EVENT_TYPES.RECOMMENDATION_GENERATED, {
                    totalStepsCompleted: 5,
                    allAnswers: sessionData.answers,
                    generationTime: Date.now() - recommendationStartTime,
                    timestamp: new Date()
                });
                
                showPage(resultsPage);
                
                recordEvent(EVENT_TYPES.GIFT_VIEWED, {
                    recommendationCount: sessionData.recommendations.length,
                    timestamp: new Date()
                });
            }, 2000);
        }
    });
});

// 星级评分事件监听
starRating.querySelectorAll('.star').forEach(function(star) {
    star.addEventListener('mouseover', function(e) {
        const value = parseInt(e.currentTarget.dataset.value);
        highlightStars(value);
    });
    
    star.addEventListener('mouseout', function() {
        highlightStars(sessionData.feedback.rating);
    });
    
    star.addEventListener('click', function(e) {
        const value = parseInt(e.currentTarget.dataset.value);
        sessionData.feedback.rating = value;
        highlightStars(value);
        feedbackForm.classList.remove('hidden');
    });
});

// 提交反馈按钮事件监听
submitFeedbackBtn.addEventListener('click', function() {
    const commentTextarea = feedbackForm.querySelector('textarea');
    const feedbackStartTime = Date.now();
    
    sessionData.feedback.comment = commentTextarea.value;
    
    // 记录反馈提交事件
    recordEvent(EVENT_TYPES.FEEDBACK_SUBMITTED, {
        rating: sessionData.feedback.rating,
        hasComment: !!sessionData.feedback.comment,
        commentLength: sessionData.feedback.comment.length,
        totalTimeSpent: sessionData.metrics.totalTimeSpent,
        completedSteps: Object.keys(sessionData.answers).length,
        timestamp: new Date()
    });
    
    // 保存反馈到Firebase
    saveFeedback();
    
    // 记录会话结束事件
    recordEvent(EVENT_TYPES.SESSION_END, {
        sessionId: sessionData.sessionId,
        totalTimeSpent: sessionData.metrics.totalTimeSpent,
        completedSteps: Object.keys(sessionData.answers).length,
        finalRating: sessionData.feedback.rating,
        finalMetrics: sessionData.metrics,
        finalBehavior: sessionData.userBehavior,
        exitType: 'feedback_completed'
    });
    
    // 显示感谢信息
    feedbackForm.innerHTML = `<p class="text-green-600 font-semibold">${translations[currentLang]['feedback.thanks'] || '感谢您的反馈！'}</p>`;
});

// 数据导出和分析功能
function exportSessionData() {
    if (!sessionData.sessionId) {
        console.log('没有活跃会话数据可导出');
        return null;
    }
    
    const exportData = {
        sessionInfo: {
            sessionId: sessionData.sessionId,
            userId: sessionData.userId,
            startTime: sessionData.metrics.sessionStartTime,
            endTime: new Date(),
            totalDuration: sessionData.metrics.totalTimeSpent
        },
        userAnswers: sessionData.answers,
        recommendations: sessionData.recommendations,
        feedback: sessionData.feedback,
        events: sessionData.events,
        metrics: sessionData.metrics,
        userBehavior: sessionData.userBehavior,
        deviceInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        }
    };
    
    return exportData;
}

// 获取会话统计信息
function getSessionStats() {
    const stats = {
        totalEvents: sessionData.events.length,
        eventsByType: {},
        averageStepTime: 0,
        totalClicks: sessionData.userBehavior.clickCount,
        totalScrolls: sessionData.userBehavior.scrollCount,
        languageSwitches: sessionData.userBehavior.languageSwitches,
        backButtonUsage: sessionData.userBehavior.backButtonUsage,
        errorCount: sessionData.metrics.errorCount,
        retryCount: sessionData.metrics.retryCount
    };
    
    // 统计各类型事件数量
    sessionData.events.forEach(event => {
        stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });
    
    // 计算平均步骤完成时间
    const stepTimes = Object.values(sessionData.metrics.stepCompletionTimes);
    if (stepTimes.length > 0) {
        stats.averageStepTime = stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length;
    }
    
    return stats;
}

// 控制台调试功能
if (typeof window !== 'undefined') {
    window.giftAppDebug = {
        exportData: exportSessionData,
        getStats: getSessionStats,
        viewEvents: () => sessionData.events,
        viewMetrics: () => sessionData.metrics,
        viewBehavior: () => sessionData.userBehavior,
        clearEvents: () => { sessionData.events = []; },
        simulateError: (message) => {
            recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                error: message || '模拟错误',
                context: 'debug_simulation',
                timestamp: new Date()
            });
        }
    };
    
    console.log('调试工具已加载。使用 window.giftAppDebug 访问调试功能。');
}

// 语言切换按钮事件监听
langZhBtn.addEventListener('click', function() {
    const previousLang = currentLang;
    currentLang = 'zh';
    
    trackUserBehavior('language_switch', {
        from: previousLang,
        to: currentLang,
        timestamp: new Date()
    });
    
    recordEvent(EVENT_TYPES.LANGUAGE_CHANGED, {
        previousLanguage: previousLang,
        newLanguage: currentLang,
        timestamp: new Date()
    });
    
    updateLanguageButtons();
    applyTranslations();
});

langEnBtn.addEventListener('click', function() {
    const previousLang = currentLang;
    currentLang = 'en';
    
    trackUserBehavior('language_switch', {
        from: previousLang,
        to: currentLang,
        timestamp: new Date()
    });
    
    recordEvent(EVENT_TYPES.LANGUAGE_CHANGED, {
        previousLanguage: previousLang,
        newLanguage: currentLang,
        timestamp: new Date()
    });
    
    updateLanguageButtons();
    applyTranslations();
});

// 事件记录函数
function recordEvent(eventType, eventData = {}) {
    const event = {
        type: eventType,
        timestamp: new Date(),
        data: eventData,
        sessionId: sessionData.sessionId,
        userId: sessionData.userId
    };
    
    sessionData.events.push(event);
    
    // 实时保存重要事件到Firestore
    if (shouldSaveEventImmediately(eventType)) {
        saveEventToFirestore(event);
    }
    
    console.log('事件记录:', event);
}

// 判断是否需要立即保存事件
function shouldSaveEventImmediately(eventType) {
    const immediateEvents = [
        // 暂时任何Event都不视为重要事件
        // EVENT_TYPES.SESSION_START,
        // EVENT_TYPES.SESSION_END,
        // EVENT_TYPES.LOGIN_SUCCESS,
        // EVENT_TYPES.ERROR_OCCURRED,
    ];
    return immediateEvents.includes(eventType);
}

// 保存事件到Firestore
function saveEventToFirestore(event) {
    try {
        if (!sessionData.sessionId) return;
        
        db.collection('HighPriorityEvents').add({
            ...event,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(eventRef) {
            console.log('事件已保存:', eventRef.id);
        });
    } catch (error) {
        console.error('保存事件失败:', error);
    }
}

// 用户行为追踪函数
function trackUserBehavior(behaviorType, data = {}) {
    switch (behaviorType) {
        case 'click':
            sessionData.userBehavior.clickCount++;
            break;
        case 'scroll':
            sessionData.userBehavior.scrollCount++;
            break;
        case 'language_switch':
            sessionData.userBehavior.languageSwitches++;
            break;
        case 'back_button':
            sessionData.userBehavior.backButtonUsage++;
            break;
    }
    
    // 只更新行为计数，不再记录USER_INTERACTION事件
}

// 性能指标追踪
function trackPerformanceMetric(metricType, value) {
    switch (metricType) {
        case 'step_completion_time':
            const stepName = value.stepName;
            const duration = value.duration;
            sessionData.metrics.stepCompletionTimes[stepName] = duration;
            break;
        case 'error_count':
            sessionData.metrics.errorCount++;
            break;
        case 'retry_count':
            sessionData.metrics.retryCount++;
            break;
        case 'total_time':
            sessionData.metrics.totalTimeSpent = value;
            break;
    }
}

// Firebase相关函数

// 创建新会话
function createSession() {
    if (sessionCreated) {
        console.log('会话已存在，跳过创建');
        return;
    }
    
    try {
        sessionData.metrics.sessionStartTime = new Date();
        
        db.collection('sessions').add({
            userId: sessionData.userId,
            startTime: firebase.firestore.FieldValue.serverTimestamp(),
            device: navigator.userAgent,
            language: currentLang,
            events: [],
            metrics: sessionData.metrics,
            userBehavior: sessionData.userBehavior
        }).then(function(sessionRef) {
            sessionData.sessionId = sessionRef.id;
            sessionCreated = true; // 标记会话已创建
            
            recordEvent(EVENT_TYPES.SESSION_START, {
                sessionId: sessionData.sessionId,
                device: navigator.userAgent,
                language: currentLang
            });
            
            console.log('会话已创建:', sessionData.sessionId);
        });
    } catch (error) {
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            error: error.message,
            context: 'createSession'
        });
        trackPerformanceMetric('error_count');
        console.error('创建会话失败:', error);
    }
}

// 记录用户回答
function recordAnswer(step, value) {
    try {
        if (!sessionData.sessionId) {
            recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                error: '会话未创建',
                context: 'recordAnswer',
                step
            });
            throw new Error('会话未创建');
        }

        const startTime = Date.now();
        // 更新本地数据
        sessionData.answers[step] = value;
        
        // 保存到Firebase
        const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
        sessionRef.update({
            answers: sessionData.answers,
            events: sessionData.events,
            metrics: sessionData.metrics,
            userBehavior: sessionData.userBehavior,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            const duration = Date.now() - startTime;
            trackPerformanceMetric('step_completion_time', {
                stepName: step,
                duration
            });

            recordEvent(EVENT_TYPES.ANSWER_SELECTED, {
                step,
                value,
                duration,
                timestamp: new Date()
            });

            console.log('回答已记录:', step, value);
        }).catch(function(error) {
            recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                error: error.message,
                context: 'recordAnswer',
                step
            });
            trackPerformanceMetric('error_count');
            console.error('记录回答失败:', error);
        });
    } catch (error) {
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            error: error.message,
            context: 'recordAnswer',
            step
        });
        trackPerformanceMetric('error_count');
        console.error('记录回答失败:', error);
    }
}

// 保存推荐结果
function saveRecommendations() {
    if (sessionData.sessionId) {
        try {
            const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
            sessionRef.update({
                recommendations: sessionData.recommendations,
                events: sessionData.events,
                metrics: sessionData.metrics,
                userBehavior: sessionData.userBehavior,
                recommendationTime: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                recordEvent(EVENT_TYPES.RECOMMENDATION_GENERATED, {
                    recommendationCount: sessionData.recommendations.length,
                    answers: sessionData.answers,
                    timestamp: new Date()
                });
                console.log('推荐结果已保存');
            }).catch(function(error) {
                recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                    error: error.message,
                    context: 'saveRecommendations'
                });
                trackPerformanceMetric('error_count');
                console.error('保存推荐结果失败:', error);
            });
        } catch (error) {
            recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                error: error.message,
                context: 'saveRecommendations'
            });
            trackPerformanceMetric('error_count');
            console.error('保存推荐结果失败:', error);
        }
    }
}

// 保存用户反馈
function saveFeedback() {
    if (sessionData.sessionId) {
        try {
            // 计算总会话时间
            if (sessionData.metrics.sessionStartTime) {
                sessionData.metrics.totalTimeSpent = Date.now() - sessionData.metrics.sessionStartTime.getTime();
            }

            const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
            sessionRef.update({
                feedback: sessionData.feedback,
                events: sessionData.events,
                metrics: sessionData.metrics,
                userBehavior: sessionData.userBehavior,
                feedbackTime: firebase.firestore.FieldValue.serverTimestamp(),
                sessionEndTime: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                recordEvent(EVENT_TYPES.FEEDBACK_SUBMITTED, {
                    rating: sessionData.feedback.rating,
                    hasComment: !!sessionData.feedback.comment,
                    totalTimeSpent: sessionData.metrics.totalTimeSpent,
                    timestamp: new Date()
                });

                recordEvent(EVENT_TYPES.SESSION_END, {
                    sessionId: sessionData.sessionId,
                    totalTimeSpent: sessionData.metrics.totalTimeSpent,
                    completedSteps: Object.keys(sessionData.answers).length,
                    finalMetrics: sessionData.metrics,
                    finalBehavior: sessionData.userBehavior
                });

                console.log('反馈已保存');
            }).catch(function(error) {
                recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                    error: error.message,
                    context: 'saveFeedback'
                });
                trackPerformanceMetric('error_count');
                console.error('保存反馈失败:', error);
            });
        } catch (error) {
            recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
                error: error.message,
                context: 'saveFeedback'
            });
            trackPerformanceMetric('error_count');
            console.error('保存反馈失败:', error);
        }
    }
}

// 辅助函数

// 显示页面
function showPage(page) {
    // 隐藏所有页面
    [loginPage, welcomePage, questionsContainer, loadingPage, resultsPage].forEach(p => {
        p.classList.add('hidden');
    });
    
    // 显示指定页面
    page.classList.remove('hidden');
}

// 显示步骤
function showStep(step) {
    step.classList.remove('hidden');
}

// 隐藏步骤
function hideStep(step) {
    step.classList.add('hidden');
}

// 生成推荐结果
function generateRecommendations() {
    // 在实际应用中，这里应该根据用户回答调用AI服务获取推荐
    // 这里使用模拟数据
    sessionData.recommendations = mockRecommendations;
    
    // 保存推荐结果到Firebase
    saveRecommendations();
    
    // 渲染推荐结果
    recommendationsContainer.innerHTML = '';
    
    sessionData.recommendations.forEach(gift => {
        const giftElement = document.createElement('div');
        giftElement.className = 'bg-stone-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow';
        
        const isSelected = sessionData.selectedGifts.some(selectedGift => selectedGift.id === gift.id);
        
        giftElement.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <div class="w-full md:w-1/4 flex-shrink-0">
                    <img src="${gift.image}" alt="${gift.title}" class="w-full h-auto rounded-lg">
                </div>
                <div class="flex-grow">
                    <h3 class="text-xl font-bold text-stone-900">${gift.title}</h3>
                    <p class="text-stone-600 mt-1">${gift.description}</p>
                    
                    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h4 class="text-sm font-semibold text-stone-500">${translations[currentLang]['gift.price']}</h4>
                            <p>${gift.price}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-stone-500">${translations[currentLang]['gift.why']}</h4>
                            <p>${gift.reason}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-stone-500">${translations[currentLang]['gift.where']}</h4>
                            <p>${gift.where}</p>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <button class="gift-select-btn px-4 py-2 rounded-lg font-medium transition-colors ${
                            isSelected 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }" data-gift-id="${gift.id}" ${isSelected ? 'disabled' : ''}>
                            ${isSelected ? translations[currentLang]['gift.selected'] : translations[currentLang]['gift.select']}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        recommendationsContainer.appendChild(giftElement);
    });
    
    // 添加选择按钮事件监听
    document.querySelectorAll('.gift-select-btn').forEach(button => {
        button.addEventListener('click', function() {
            const giftId = parseInt(this.dataset.giftId);
            const gift = sessionData.recommendations.find(g => g.id === giftId);
            
            if (gift && !sessionData.selectedGifts.some(selectedGift => selectedGift.id === giftId)) {
                // 添加到选中列表
                sessionData.selectedGifts.push(gift);
                
                // 记录GIFT_SELECTED事件
                recordEvent(EVENT_TYPES.GIFT_SELECTED, {
                    giftId: gift.id,
                    giftTitle: gift.title,
                    giftPrice: gift.price,
                    selectionOrder: sessionData.selectedGifts.length,
                    totalRecommendations: sessionData.recommendations.length,
                    timestamp: new Date()
                });
                
                // 更新按钮状态
                this.textContent = translations[currentLang]['gift.selected'];
                this.className = 'gift-select-btn px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white cursor-default';
                this.disabled = true;
            }
        });
    });
}

// 高亮星级
function highlightStars(count) {
    starRating.querySelectorAll('.star').forEach((star, index) => {
        if (index < count) {
            star.classList.add('text-amber-400');
            star.classList.remove('text-stone-300');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-stone-300');
        }
    });
}

// 更新语言按钮样式
function updateLanguageButtons() {
    if (currentLang === 'zh') {
        langZhBtn.classList.add('bg-amber-400', 'text-white');
        langZhBtn.classList.remove('bg-white', 'text-stone-700');
        
        langEnBtn.classList.add('bg-white', 'text-stone-700');
        langEnBtn.classList.remove('bg-amber-400', 'text-white');
    } else {
        langEnBtn.classList.add('bg-amber-400', 'text-white');
        langEnBtn.classList.remove('bg-white', 'text-stone-700');
        
        langZhBtn.classList.add('bg-white', 'text-stone-700');
        langZhBtn.classList.remove('bg-amber-400', 'text-white');
    }
}

// 应用翻译
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            element.setAttribute('placeholder', translations[currentLang][key]);
        }
    });
}