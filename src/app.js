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

// 维度配置系统 - 可扩展的礼物推荐维度定义
const DIMENSION_CONFIG = {
    // 维度定义
    dimensions: {
        relationship: {
            id: 'relationship',
            name: '关系类型',
            description: '了解您与收礼人的关系',
            priority: 1,
            required: true,
            dataType: 'single_choice',
            options: [
                { value: 'partner', label: '情侣', weight: 1.0 },
                { value: 'friend', label: '好朋友', weight: 0.8 },
                { value: 'colleague', label: '同事', weight: 0.6 },
                { value: 'family', label: '家人', weight: 0.9 }
            ]
        },
        occasion: {
            id: 'occasion',
            name: '场合',
            description: '了解送礼的具体场合',
            priority: 2,
            required: true,
            dataType: 'single_choice',
            options: [
                { value: 'birthday', label: '生日', weight: 1.0 },
                { value: 'anniversary', label: '纪念日', weight: 0.9 },
                { value: 'gratitude', label: '表达感谢', weight: 0.7 },
                { value: 'celebration', label: '庆祝', weight: 0.8 }
            ]
        },
        intent: {
            id: 'intent',
            name: '情感意图',
            description: '您希望礼物传递的感觉',
            priority: 3,
            required: true,
            dataType: 'single_choice',
            options: [
                { value: 'surprise', label: '惊喜的', weight: 1.0 },
                { value: 'touching', label: '感动的', weight: 0.9 },
                { value: 'fun', label: '有趣的', weight: 0.8 },
                { value: 'healing', label: '治愈的', weight: 0.7 }
            ]
        },
        personality: {
            id: 'personality',
            name: '性格特征',
            description: '收礼人的性格类型',
            priority: 4,
            required: true,
            dataType: 'single_choice',
            options: [
                { value: 'planner', label: '深思熟虑的计划者', description: '喜欢提前规划，享受一切尽在掌握的感觉', weight: 1.0 },
                { value: 'adventurer', label: '随性而为的探险家', description: '享受当下的惊喜，喜欢说走就走的旅行', weight: 0.9 }
            ]
        },
        loveLanguage: {
            id: 'loveLanguage',
            name: '爱的语言',
            description: 'TA最喜欢感受爱的方式',
            priority: 5,
            required: true,
            dataType: 'single_choice',
            options: [
                { value: 'words', label: '肯定的言语', weight: 0.8 },
                { value: 'time', label: '精心的时刻', weight: 0.9 },
                { value: 'service', label: '服务的行动', weight: 0.7 },
                { value: 'gifts', label: '收到礼物', weight: 1.0 }
            ]
        }
    },
    
    // 维度完整性评估配置
    completeness: {
        required_dimensions: ['relationship', 'occasion', 'intent'],
        optional_dimensions: ['personality', 'loveLanguage'],
        minimum_score: 0.6  // 最低完整性分数
    },
    
    // Agent行为配置
    agent: {
        conversation_style: 'natural_guided',  // 自然引导式
        max_questions_per_dimension: 3,        // 每个维度最多问3个问题
        context_memory_turns: 10,              // 记住最近10轮对话
        fallback_to_direct_questions: true     // 是否允许回退到直接问题
    }
};

// 多语言支持
const translations = {
    'zh': {
        'login.title': '欢迎回来',
        'login.subtitle': '登录以继续您的灵感之旅',
        'login.google': '使用 Google 登录',
        'login.email': '使用邮箱登录',
        'login.phone': '使用手机登录',
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
        'login.email': 'Sign in with Email',
        'login.phone': 'Sign in with Phone',
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
    },
    // 新增：维度追踪系统
    dimensions: {
        collected: {},           // 已收集的维度信息 {dimensionId: {value, confidence, source, timestamp}}
        completeness: 0,         // 完整性分数 (0-1)
        missing: [],             // 缺失的维度列表
        inProgress: null,        // 当前正在收集的维度
        extractedFromChat: {}    // 从聊天中提取的信息
    },
    // 新增：Agent状态管理
    agent: {
        conversationTurns: 0,           // 对话轮次
        currentStrategy: 'open_ended',   // 当前对话策略
        systemMessage: null,             // 系统消息模板
        contextHistory: [],              // 上下文历史
        lastDimensionUpdate: null,       // 最后一次维度更新时间
        needsRecommendation: false       // 是否需要生成推荐
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
    STEP_COMPLETE: 'step_complete',      // 完成某个问题步骤（包含用户选择的答案和完成时间）
    QUIZ_COMPLETED: 'quiz_completed',    // 用户完成了所有问题的回答
    RECOMMENDATION_GENERATED: 'recommendation_generated',  // 生成礼物推荐列表
    GIFT_VIEWED: 'gift_viewed',          // 用户查看了某个礼物推荐结果
    GIFT_SELECTED: 'gift_selected',      // 用户选择了某个礼物
    FEEDBACK_SUBMITTED: 'feedback_submitted',  // 用户提交反馈
    LANGUAGE_CHANGED: 'language_changed',      // 切换语言
    ERROR_OCCURRED: 'error_occurred',          // 发生错误
    CHAT_WITH_AI: 'chat_with_ai',        // 用户与AI聊天交互
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
        image: 'https://i.etsystatic.com/5996810/r/il/de6316/1957231659/il_800x800.1957231659_rkvl.jpg'
    },
    {
        id: 2,
        title: '手工制作的皮革钱包',
        description: '可以刻上名字或特殊日期的高质量皮革钱包。',
        price: '¥300 - ¥500',
        reason: '实用且有纪念意义，适合喜欢精致物品的人。',
        where: '手工艺品网站、Etsy、定制皮具店',
        image: 'https://i.etsystatic.com/15339935/r/il/524abc/6624037822/il_1588xN.6624037822_koh5.jpg'
    },
    {
        id: 3,
        title: '定制照片书',
        description: '收集你们共同的回忆，制作成精美的硬皮照片书。',
        price: '¥150 - ¥300',
        reason: '充满情感价值，可以记录你们的故事和珍贵时刻。',
        where: '美图秀秀、小红书推荐的照片书App',
        image: 'https://img-1.kwcdn.com/product/Fancyalgo/VirtualModelMatting/80be66f6b9b344007357f3a077691cbb.jpg?imageView2/2/w/264/q/70/format/webp'
    }
];

// 工具函数
function createTimestamp() {
    return new Date();
}

function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    // 如果是 Firestore 时间戳对象
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // 如果是 Date 对象
    if (timestamp instanceof Date) {
        return timestamp.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // 如果是字符串，尝试解析
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    return '';
}

// DOM元素
const loginPage = document.getElementById('login-page');
const welcomePage = document.getElementById('welcome-page');
const questionsContainer = document.getElementById('questions-container');
const loadingPage = document.getElementById('loading-page');
const resultsPage = document.getElementById('results-page');

const googleLoginBtn = document.getElementById('google-login');
const guestLoginBtn = document.getElementById('guest-login');
const emailLoginBtnMain = document.getElementById('email-login-btn');
const phoneLoginBtnMain = document.getElementById('phone-login-btn');
const sendEmailLinkBtn = document.getElementById('send-email-link');
const backToMainBtn = document.getElementById('back-to-main');
const sendCodeBtn = document.getElementById('send-code');
const verifyCodeBtn = document.getElementById('verify-code');
const startButton = document.getElementById('start-button');

// 登录表单元素
const emailInputForm = document.getElementById('email-input-form');
const phoneLoginForm = document.getElementById('phone-login-form');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone-input');
const verificationCodeInput = document.getElementById('verification-code');
const verificationSection = document.getElementById('verification-section');
const emailSentMessage = document.getElementById('email-sent-message');

// 全局变量
let confirmationResult = null; // 用于存储电话验证结果

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

// 初始化维度配置系统
function initializeDimensionSystem() {
    // 重置维度状态
    sessionData.dimensions = {
        collected: {},
        completeness: 0,
        missing: [],
        inProgress: null,
        extractedFromChat: {}
    };
    
    // 初始化所有维度
    Object.values(DIMENSION_CONFIG.dimensions).forEach(dim => {
        sessionData.dimensions.collected[dim.id] = {
            value: null,
            confidence: 0,
            source: null,
            attempts: 0,
            lastAttempt: null
        };
    });
    
    // 重置Agent状态
    sessionData.agent = {
        conversationTurns: 0,
        currentStrategy: 'open_ended',
        systemMessage: null,
        contextHistory: [],
        lastDimensionUpdate: null,
        needsRecommendation: false
    };
    
    // 评估初始完整性
    assessDimensionCompleteness();
    
    console.log('维度配置系统已初始化', {
        dimensions: Object.keys(sessionData.dimensions.collected),
        completeness: sessionData.dimensions.completeness
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    // 应用当前语言
    applyTranslations();
    
    // 初始化维度配置系统
    initializeDimensionSystem();
    
    // 监听认证状态变化
    auth.onAuthStateChanged(async function(user) {
        if (user && !user.isAnonymous) {
            // 用户已通过真实方式登录（非匿名）
            sessionData.userId = user.uid;
            
            // 尝试从localStorage恢复sessionId
            const storedSessionId = localStorage.getItem('currentSessionId');
            if (storedSessionId) {
                sessionData.sessionId = storedSessionId;
                console.log('已恢复会话ID:', storedSessionId);
                
                // 重新加载聊天历史
                await loadChatHistoryFromFirestore();
            } else {
                // 如果没有现有会话，创建新会话
                console.log('没有现有会话，为用户创建新会话');
                await createSession();
            }
            
            recordEvent(EVENT_TYPES.LOGIN_SUCCESS, {
                userId: user.uid,
                loginMethod: 'authenticated',
                timestamp: new Date()
            });
            
            showPage(welcomePage);
        } else if (user && user.isAnonymous) {
            // 匿名用户登录
            sessionData.userId = user.uid;
            
            // 尝试从localStorage恢复sessionId
            const storedSessionId = localStorage.getItem('currentSessionId');
            if (storedSessionId) {
                sessionData.sessionId = storedSessionId;
                console.log('已恢复匿名用户会话ID:', storedSessionId);
                
                // 重新加载聊天历史
                await loadChatHistoryFromFirestore();
            } else {
                // 如果没有现有会话，创建新会话
                console.log('没有现有会话，为匿名用户创建新会话');
                await createSession();
            }
        } else if (!user) {
            // 用户未登录，显示登录页面
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
    // 在开发环境使用弹窗，在生产环境使用重定向
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
        // 开发环境使用弹窗方式
        auth.signInWithPopup(provider)
            .then(function(result) {
                if (result.user) {
                    // 登录成功
                    var user = result.user;
                    sessionData.userId = user.uid;
                    console.log('Google登录成功:', user.email);
                }
            })
            .catch(function(error) {
                console.error('Google登录失败:', error);
                if (error.code === 'auth/account-exists-with-different-credential') {
                    alert('此邮箱已经使用其他登录方式注册过账号');
                } else {
                    alert('登录失败: ' + error.message);
                }
            });
    } else {
        // 生产环境使用重定向方式
        auth.signInWithRedirect(provider)
            .catch(function(error) {
                console.error('Google登录失败:', error);
                alert('登录失败: ' + error.message);
            });
    }
});

// 处理重定向登录后的结果
auth.getRedirectResult()
    .then(function(result) {
        if (result.user) {
            // 登录成功
            var user = result.user;
            sessionData.userId = user.uid;
        }
    })
    .catch(function(error) {
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
            console.log('匿名登录成功，用户ID:', sessionData.userId);
            
            // 跳转到欢迎页面
            showPage(welcomePage);
        })
        .catch(function(error) {
            console.error('匿名登录失败:', error);
            alert('匿名登录失败: ' + error.message);
        });
});

// 邮箱登录按钮事件监听
emailLoginBtnMain.addEventListener('click', function() {
    // 显示邮箱输入表单，隐藏其他登录选项
    emailInputForm.classList.remove('hidden');
    phoneLoginForm.classList.add('hidden');
    googleLoginBtn.style.display = 'none';
    emailLoginBtnMain.style.display = 'none';
    phoneLoginBtnMain.style.display = 'none';
    guestLoginBtn.style.display = 'none';
});

// 返回主登录界面
backToMainBtn.addEventListener('click', function() {
    // 隐藏邮箱输入表单，显示主登录选项
    emailInputForm.classList.add('hidden');
    phoneLoginForm.classList.add('hidden');
    googleLoginBtn.style.display = 'flex';
    emailLoginBtnMain.style.display = 'flex';
    phoneLoginBtnMain.style.display = 'flex';
    guestLoginBtn.style.display = 'flex';
    emailSentMessage.classList.add('hidden');
    emailInput.value = '';
});

// 发送邮箱登录链接
sendEmailLinkBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('请输入邮箱地址');
        return;
    }
    
    recordEvent(EVENT_TYPES.LOGIN_ATTEMPT, {
        method: 'email_link',
        timestamp: new Date()
    });
    
    // 配置邮箱链接登录设置
    const actionCodeSettings = {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true
    };
    
    auth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
            // 保存邮箱到本地存储
            window.localStorage.setItem('emailForSignIn', email);
            
            // 显示成功消息
            emailSentMessage.classList.remove('hidden');
            sendEmailLinkBtn.textContent = '链接已发送';
            sendEmailLinkBtn.disabled = true;
            
            console.log('邮箱登录链接已发送');
        })
        .catch(function(error) {
            recordEvent(EVENT_TYPES.LOGIN_FAILURE, {
                method: 'email_link',
                error: error.code,
                timestamp: new Date()
            });
            console.error('发送邮箱登录链接失败:', error);
            
            let errorMessage = '发送失败: ';
            switch(error.code) {
                case 'auth/invalid-email':
                    errorMessage += '邮箱格式不正确';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += '请求过于频繁，请稍后再试';
                    break;
                default:
                    errorMessage += error.message;
            }
            alert(errorMessage);
        });
});

// 手机登录按钮事件监听
phoneLoginBtnMain.addEventListener('click', function() {
    // 显示手机登录表单，隐藏其他登录选项
    phoneLoginForm.classList.remove('hidden');
    emailInputForm.classList.add('hidden');
    googleLoginBtn.style.display = 'none';
    emailLoginBtnMain.style.display = 'none';
    phoneLoginBtnMain.style.display = 'none';
    guestLoginBtn.style.display = 'none';
});

// 发送验证码事件监听
sendCodeBtn.addEventListener('click', function() {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        alert('请输入手机号码');
        return;
    }
    
    // 添加中国区号（如果没有的话）
    const formattedPhone = phoneNumber.startsWith('+86') ? phoneNumber : '+86' + phoneNumber;
    
    recordEvent(EVENT_TYPES.LOGIN_ATTEMPT, {
        method: 'phone_send_code',
        timestamp: new Date()
    });
    
    // 设置reCAPTCHA
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': function(response) {
                console.log('reCAPTCHA验证成功');
            }
        });
        // 显示reCAPTCHA容器
        document.getElementById('recaptcha-container').classList.remove('hidden');
    }
    
    auth.signInWithPhoneNumber(formattedPhone, window.recaptchaVerifier)
        .then(function(result) {
            confirmationResult = result;
            verificationSection.classList.remove('hidden');
            sendCodeBtn.textContent = '验证码已发送';
            sendCodeBtn.disabled = true;
            console.log('验证码已发送');
            alert('验证码已发送到您的手机');
        })
        .catch(function(error) {
            recordEvent(EVENT_TYPES.LOGIN_FAILURE, {
                method: 'phone_send_code',
                error: error.code,
                timestamp: new Date()
            });
            console.error('发送验证码失败:', error);
            
            let errorMessage = '发送验证码失败: ';
            switch(error.code) {
                case 'auth/invalid-phone-number':
                    errorMessage += '手机号格式不正确';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += '请求过于频繁，请稍后再试';
                    break;
                default:
                    errorMessage += error.message;
            }
            alert(errorMessage);
            
            // 重置reCAPTCHA
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
            // 隐藏reCAPTCHA容器
            document.getElementById('recaptcha-container').classList.add('hidden');
        });
});

// 验证码登录事件监听
verifyCodeBtn.addEventListener('click', function() {
    const code = verificationCodeInput.value.trim();
    
    if (!code) {
        alert('请输入验证码');
        return;
    }
    
    if (!confirmationResult) {
        alert('请先发送验证码');
        return;
    }
    
    recordEvent(EVENT_TYPES.LOGIN_ATTEMPT, {
        method: 'phone_verify',
        timestamp: new Date()
    });
    
    confirmationResult.confirm(code)
        .then(function(result) {
            sessionData.userId = result.user.uid;
            recordEvent(EVENT_TYPES.LOGIN_SUCCESS, {
                userId: result.user.uid,
                loginMethod: 'phone',
                timestamp: new Date()
            });
            console.log('手机登录成功，用户ID:', sessionData.userId);
        })
        .catch(function(error) {
            recordEvent(EVENT_TYPES.LOGIN_FAILURE, {
                method: 'phone_verify',
                error: error.code,
                timestamp: new Date()
            });
            console.error('验证码验证失败:', error);
            
            let errorMessage = '验证失败: ';
            switch(error.code) {
                case 'auth/invalid-verification-code':
                    errorMessage += '验证码错误';
                    break;
                case 'auth/code-expired':
                    errorMessage += '验证码已过期，请重新发送';
                    break;
                default:
                    errorMessage += error.message;
            }
            alert(errorMessage);
        });
});

// 检查是否是邮箱链接登录
if (auth.isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('请输入您的邮箱地址以完成登录');
    }
    
    if (email) {
        auth.signInWithEmailLink(email, window.location.href)
            .then(function(result) {
                sessionData.userId = result.user.uid;
                recordEvent(EVENT_TYPES.LOGIN_SUCCESS, {
                    userId: result.user.uid,
                    loginMethod: 'email_link',
                    timestamp: new Date()
                });
                console.log('邮箱链接登录成功，用户ID:', sessionData.userId);
                
                // 清除本地存储的邮箱
                window.localStorage.removeItem('emailForSignIn');
                
                // 清除URL中的登录参数
                window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(function(error) {
                recordEvent(EVENT_TYPES.LOGIN_FAILURE, {
                    method: 'email_link',
                    error: error.code,
                    timestamp: new Date()
                });
                console.error('邮箱链接登录失败:', error);
                alert('登录失败: ' + error.message);
            });
    }
}

// 开始按钮事件监听
startButton.addEventListener('click', function() {
    // 检查是否已经创建会话，避免重复创建
    if (!sessionCreated) {
        // 在用户真正开始问答时创建会话
        createSession().then(function() {
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
        }).catch(function(error) {
            console.error('创建会话失败，无法开始问答:', error);
            // 即使创建会话失败，也允许用户继续使用（但不会保存数据）
            showPage(questionsContainer);
            showStep(stepRelationship);
        });
    } else {
        // 会话已存在，直接开始问答
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
    }
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
        
        // 同时更新维度信息系统
        const dimensionMapping = {
            'step-relationship': 'relationship',
            'step-occasion': 'occasion', 
            'step-intent': 'intent',
            'step-personality': 'personality',
            'step-love-language': 'loveLanguage'
        };
        
        const dimensionId = dimensionMapping[step];
        if (dimensionId) {
            updateDimensionInfo(dimensionId, value, 1.0, 'ui_selection');
        }
        
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
            setTimeout(async function() {
                const recommendationStartTime = Date.now();
                await generateRecommendations();
                
                recordEvent(EVENT_TYPES.RECOMMENDATION_GENERATED, {
                    totalStepsCompleted: 5,
                    allAnswers: sessionData.answers,
                    // generationTime: Date.now() - recommendationStartTime,    // 暂时不需要记录这个字段
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
        // 聊天记录需要立即保存
        EVENT_TYPES.CHAT_WITH_AI,
        // 暂时其他Event都不视为重要事件
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
            savedAt: firebase.firestore.FieldValue.serverTimestamp()
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
        return Promise.resolve();
    }
    
    try {
        sessionData.metrics.sessionStartTime = new Date();
        
        // 定义session document的字段顺序
        const sessionDoc = {
            userId: sessionData.userId,
            sessionStartTime: firebase.firestore.FieldValue.serverTimestamp(),
            device: navigator.userAgent,
            language: currentLang,
            answers: {},
            selectedGifts: [],
            feedback: {
                rating: 0,
                comment: ''
            },
            events: [],
            metrics: {
                sessionStartTime: sessionData.metrics.sessionStartTime,
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
            },
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        return db.collection('sessions').add(sessionDoc).then(function(sessionRef) {
            sessionData.sessionId = sessionRef.id;
            sessionCreated = true; // 标记会话已创建
            
            // 保存sessionId到localStorage以便页面刷新后恢复
            localStorage.setItem('sessionId', sessionData.sessionId);
            
            // 更新document以包含sessionId字段
            sessionRef.update({
                sessionId: sessionData.sessionId
            }).catch(function(error) {
                console.error('更新sessionId失败:', error);
            });
            
            recordEvent(EVENT_TYPES.SESSION_START, {
                sessionId: sessionData.sessionId,
                device: navigator.userAgent,
                language: currentLang
            });
            
            console.log('会话已创建:', sessionData.sessionId);
            return sessionRef;
        });
    } catch (error) {
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            error: error.message,
            context: 'createSession'
        });
        trackPerformanceMetric('error_count');
        console.error('创建会话失败:', error);
        return Promise.reject(error);
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
                selectedGifts: sessionData.selectedGifts,
                events: sessionData.events,
                metrics: sessionData.metrics,
                userBehavior: sessionData.userBehavior
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

// AI生成推荐结果
async function generateAIRecommendations() {
    try {
        // 构建用户画像和偏好信息
        const userProfile = buildUserProfile();
        
        // 构建AI推荐提示词
        const prompt = `
你是一个专业的礼物推荐专家。请根据以下用户信息，推荐3个最适合的礼物。

用户信息：
${userProfile}

请严格按照以下JSON格式返回推荐结果，不要包含任何其他文字：

[
  {
    "id": 1,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合用户偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  },
  {
    "id": 2,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合用户偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  },
  {
    "id": 3,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合用户偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  }
]

注意：
1. 必须返回有效的JSON格式
2. image字段请使用合适的商品图片URL
3. 价格要符合中国市场实际情况
4. 推荐要有针对性和个性化
        `;
        
        console.log('AI推荐提示词:', prompt);
        
        // 调用AI API
        const aiResponse = await callAIAPI(prompt, 'recommendation');
        
        // 解析AI返回的JSON
        const recommendations = parseAIRecommendations(aiResponse);
        // 打印每个推荐礼物的标题
        recommendations.forEach(recommendation => {
            console.log('推荐礼物标题:', recommendation.title);
        });
        
        return recommendations;
        
    } catch (error) {
        console.error('AI推荐生成失败:', error);
        return null;
    }
}

// 构建用户画像
function buildUserProfile() {
    const profile = [];
    
    // 优先使用维度信息系统的数据，避免重复
    if (sessionData.dimensions && sessionData.dimensions.collected) {
        const collected = sessionData.dimensions.collected;
        
        if (collected.relationship) {
            const relationshipLabel = DIMENSION_CONFIG.dimensions.relationship.options
                .find(opt => opt.value === collected.relationship.value)?.label;
            profile.push(`关系类型: ${relationshipLabel || collected.relationship.value}`);
        }
        
        if (collected.occasion) {
            const occasionLabel = DIMENSION_CONFIG.dimensions.occasion.options
                .find(opt => opt.value === collected.occasion.value)?.label;
            profile.push(`送礼场合: ${occasionLabel || collected.occasion.value}`);
        }
        
        if (collected.intent) {
            const intentLabel = DIMENSION_CONFIG.dimensions.intent.options
                .find(opt => opt.value === collected.intent.value)?.label;
            profile.push(`情感意图: ${intentLabel || collected.intent.value}`);
        }
        
        if (collected.personality) {
            const personalityLabel = DIMENSION_CONFIG.dimensions.personality.options
                .find(opt => opt.value === collected.personality.value)?.label;
            profile.push(`性格特征: ${personalityLabel || collected.personality.value}`);
        }
        
        if (collected.loveLanguage) {
            const loveLanguageLabel = DIMENSION_CONFIG.dimensions.loveLanguage.options
                .find(opt => opt.value === collected.loveLanguage.value)?.label;
            profile.push(`爱的语言: ${loveLanguageLabel || collected.loveLanguage.value}`);
        }
    } else if (sessionData.answers) {
        // 如果维度信息系统没有数据，则回退到传统问卷答案
        const stepToDimension = {
            'step-relationship': 'relationship',
            'step-occasion': 'occasion',
            'step-intent': 'intent', 
            'step-personality': 'personality',
            'step-love-language': 'loveLanguage'
        };
        
        // 遍历所有答案
        for (const [stepName, value] of Object.entries(sessionData.answers)) {
            const dimensionId = stepToDimension[stepName];
            if (dimensionId && DIMENSION_CONFIG.dimensions[dimensionId]) {
                const dimension = DIMENSION_CONFIG.dimensions[dimensionId];
                const option = dimension.options.find(opt => opt.value === value);
                const label = option ? option.label : value;
                
                // 根据维度类型添加到profile
                switch (dimensionId) {
                    case 'relationship':
                        profile.push(`关系类型: ${label}`);
                        break;
                    case 'occasion':
                        profile.push(`送礼场合: ${label}`);
                        break;
                    case 'intent':
                        profile.push(`情感意图: ${label}`);
                        break;
                    case 'personality':
                        profile.push(`性格特征: ${label}`);
                        break;
                    case 'loveLanguage':
                        profile.push(`爱的语言: ${label}`);
                        break;
                }
            }
        }
    }
    
    // 收集聊天历史中的关键信息
    if (chatState.chatHistory && chatState.chatHistory.length > 0) {
        const recentChats = chatState.chatHistory.slice(-5); // 最近5条对话
        const chatSummary = recentChats.map(chat => 
            `用户: ${chat.userMessage}\nAI: ${chat.aiResponse}`
        ).join('\n\n');
        profile.push(`最近对话内容:\n${chatSummary}`);
    }
    
    return profile.length > 0 ? profile.join('\n') : '暂无用户偏好信息';
}

// 解析AI返回的推荐结果
function parseAIRecommendations(aiResponse) {
    try {
        // 清理AI响应，移除可能的markdown格式
        let cleanResponse = aiResponse.trim();
        
        // 移除可能的代码块标记
        cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // 尝试解析JSON
        const recommendations = JSON.parse(cleanResponse);
        
        // 验证数据格式
        if (!Array.isArray(recommendations)) {
            throw new Error('AI返回的不是数组格式');
        }
        
        // 验证每个推荐项的必要字段
        const validRecommendations = recommendations.filter(item => {
            return item.id && item.title && item.description && 
                   item.price && item.reason && item.where;
        }).map((item, index) => {
            // 确保有默认图片
            if (!item.image || item.image === 'https://example.com/image.jpg') {
                // 使用默认图片或根据类型选择合适的图片
                item.image = getDefaultGiftImage(item.title);
            }
            
            // 确保ID是数字
            item.id = index + 1;
            
            return item;
        });
        
        if (validRecommendations.length === 0) {
            throw new Error('没有有效的推荐结果');
        }
        
        console.log('解析成功的AI推荐:', validRecommendations);
        return validRecommendations;
        
    } catch (error) {
        console.error('解析AI推荐结果失败:', error);
        console.log('原始AI响应:', aiResponse);
        return null;
    }
}

// 根据礼物类型获取默认图片
function getDefaultGiftImage(title) {
    const defaultImages = {
        '投影': 'https://i.etsystatic.com/5996810/r/il/de6316/1957231659/il_800x800.1957231659_rkvl.jpg',
        '钱包': 'https://i.etsystatic.com/15339935/r/il/524abc/6624037822/il_1588xN.6624037822_koh5.jpg',
        '照片': 'https://img-1.kwcdn.com/product/Fancyalgo/VirtualModelMatting/80be66f6b9b344007357f3a077691cbb.jpg?imageView2/2/w/264/q/70/format/webp',
        '书': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        '花': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
        '手表': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        '首饰': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        '香水': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
    };
    
    // 根据标题关键词匹配图片
    for (const [keyword, image] of Object.entries(defaultImages)) {
        if (title.includes(keyword)) {
            return image;
        }
    }
    
    // 默认图片
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400';
}

// 生成推荐结果
async function generateRecommendations() {
    try {
        // 显示加载状态
        recommendationsContainer.innerHTML = '<div class="text-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p class="mt-4 text-stone-600">AI正在为您生成个性化推荐...</p></div>';
        
        // 调用AI生成推荐
        const aiRecommendations = await generateAIRecommendations();
        
        if (aiRecommendations && aiRecommendations.length > 0) {
            sessionData.recommendations = aiRecommendations;
        } else {
            // 如果AI生成失败，使用备用数据
            console.warn('AI推荐生成失败，使用备用推荐');
            sessionData.recommendations = mockRecommendations;
        }
        
        // 保存推荐结果到Firebase
        saveRecommendations();
        
        // 渲染推荐结果
        recommendationsContainer.innerHTML = '';
        
    } catch (error) {
        console.error('生成推荐时出错:', error);
        // 出错时使用备用数据
        sessionData.recommendations = mockRecommendations;
        saveRecommendations();
        recommendationsContainer.innerHTML = '';
    }
    
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
                
                // 更新Firebase中的selectedGifts字段
                if (sessionData.sessionId) {
                    const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
                    sessionRef.update({
                        selectedGifts: sessionData.selectedGifts,
                        events: sessionData.events
                    }).catch(function(error) {
                        console.error('更新选中礼物失败:', error);
                    });
                }
                
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
            star.classList.add('text-yellow-500', 'stroke-black');
            star.classList.remove('text-gray-400');
        } else {
            star.classList.remove('text-yellow-500', 'stroke-black');
            star.classList.add('text-gray-400');
        }
    });
}

// 更新语言按钮样式
function updateLanguageButtons() {
    if (currentLang === 'zh') {
        langZhBtn.classList.add('bg-yellow-500', 'text-white');
        langZhBtn.classList.remove('bg-white', 'text-stone-700');
        
        langEnBtn.classList.add('bg-white', 'text-black');
        langEnBtn.classList.remove('bg-yellow-500', 'text-white');
    } else {
        langEnBtn.classList.add('bg-yellow-500', 'text-white');
        langEnBtn.classList.remove('bg-white', 'text-stone-700');
        
        langZhBtn.classList.add('bg-white', 'text-black');
        langZhBtn.classList.remove('bg-yellow-500', 'text-white');
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

// ==================== 聊天窗口功能 ====================

// 聊天窗口状态管理
const chatState = {
    activeWindows: new Set(),
    conversations: {},
    // 统一的聊天历史，不再按步骤分组
    chatHistory: []
};

// 初始化聊天窗口事件监听器
// 从Firestore加载聊天历史
async function loadChatHistoryFromFirestore() {
    if (!sessionData.userId || !sessionData.sessionId) {
        console.log('用户未登录或会话未创建，跳过聊天历史加载');
        return;
    }
    
    try {
        const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
        const sessionDoc = await sessionRef.get();
        
        if (sessionDoc.exists) {
            const data = sessionDoc.data();
            const chatHistory = data.chatHistory || [];
            
            // 清空本地聊天历史
            chatState.chatHistory = [];
            chatState.conversations = {};
            
            // 重新组织聊天历史（不再按步骤分组）
            chatHistory.forEach(interaction => {
                // 添加到统一的聊天历史
                chatState.chatHistory.push({
                    user_message: interaction.user_message,
                    ai_response: interaction.ai_response,
                    timestamp: interaction.timestamp,
                    context: interaction.context
                });
                
                // 为了保持UI兼容性，仍然按对话窗口组织
                if (!chatState.conversations['general']) {
                    chatState.conversations['general'] = [];
                }
                
                // 添加用户消息
                chatState.conversations['general'].push({
                    type: 'user',
                    message: interaction.user_message,
                    timestamp: interaction.timestamp
                });
                
                // 添加AI回复
                chatState.conversations['general'].push({
                    type: 'ai',
                    message: interaction.ai_response,
                    timestamp: interaction.timestamp
                });
            });
            
            console.log(`已加载聊天历史，共 ${chatHistory.length} 条交互记录`);
        }
    } catch (error) {
        console.error('加载聊天历史失败:', error);
    }
}

// 更新聊天窗口UI
function updateChatUI(stepNumber) {
    const chatMessages = document.getElementById(`chat-messages-step${stepNumber}`);
    if (!chatMessages) return;
    
    // 清空现有消息
    chatMessages.innerHTML = '';
    
    // 重新添加所有消息
    const conversations = chatState.conversations[`step${stepNumber}`] || [];
    conversations.forEach(msg => {
        addMessageToChat(stepNumber, msg.message, msg.type);
    });
}

async function initializeChatWindows() {
    // 先加载聊天历史
    await loadChatHistoryFromFirestore();
    
    // 为每个步骤的聊天窗口添加事件监听器
    for (let i = 1; i <= 5; i++) {
        const toggleBtn = document.getElementById(`chat-toggle-step${i}`);
        const chatWindow = document.getElementById(`chat-window-step${i}`);
        const sendBtn = document.getElementById(`chat-send-step${i}`);
        const input = document.getElementById(`chat-input-step${i}`);
        
        if (toggleBtn && chatWindow && sendBtn && input) {
            // 折叠/展开聊天窗口
            toggleBtn.addEventListener('click', () => toggleChatWindow(i));
            
            // 发送消息
            sendBtn.addEventListener('click', () => sendChatMessage(i));
            
            // 回车发送消息
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendChatMessage(i);
                }
            });
            
            // 初始化对话记录（如果还没有的话）
            if (!chatState.conversations[`step${i}`]) {
                chatState.conversations[`step${i}`] = [];
            }
        }
    }
}

// 折叠/展开聊天窗口
function toggleChatWindow(stepNumber) {
    const chatWindow = document.getElementById(`chat-window-step${stepNumber}`);
    const toggleBtn = document.getElementById(`chat-toggle-step${stepNumber}`);
    
    if (chatWindow.classList.contains('hidden')) {
        // 展开窗口
        chatWindow.classList.remove('hidden');
        chatState.activeWindows.add(`step${stepNumber}`);
        toggleBtn.innerHTML = '<i class="fa-solid fa-robot mr-2"></i>收起AI聊天';
        
        // 检查是否是首次打开聊天窗口（没有聊天历史）
        const hasHistory = chatState.conversations[`step${stepNumber}`] && 
                          chatState.conversations[`step${stepNumber}`].length > 0;
        
        if (!hasHistory) {
            // 显示AI引导语
            const welcomeMessage = getWelcomeMessage(stepNumber);
            addMessageToChat(stepNumber, welcomeMessage, 'ai');
            
            // 保存引导语到聊天历史
            if (!chatState.conversations[`step${stepNumber}`]) {
                chatState.conversations[`step${stepNumber}`] = [];
            }
            chatState.conversations[`step${stepNumber}`].push({
                type: 'ai',
                message: welcomeMessage,
                timestamp: new Date()
            });
        }
        
        // 记录事件
        recordEvent('chat_window_opened', {
            step: stepNumber,
            first_time: !hasHistory
        });
    } else {
        // 折叠窗口
        chatWindow.classList.add('hidden');
        chatState.activeWindows.delete(`step${stepNumber}`);
        toggleBtn.innerHTML = '<i class="fa-solid fa-robot mr-2"></i>试试与AI深度聊';
        
        // 记录事件
        recordEvent('chat_window_closed', {
            step: stepNumber
        });
    }
}

// 获取AI引导语
function getWelcomeMessage(stepNumber) {
    const welcomeMessages = {
        1: "Hi！我是你的AI礼物助手 🎁 很高兴认识你！\n\n我可以帮你深入了解收礼人的特征，比如：\n• 他们的兴趣爱好和生活方式\n• 平时喜欢什么类型的东西\n• 有什么特别的需求或偏好\n• 你们之间有什么特殊的回忆\n\n告诉我任何你想到的关于TA的信息，我会帮你找到最合适的礼物灵感！",
        2: "Hi！我是你的AI礼物助手 🎁\n\n在这个步骤，我们可以聊聊这次送礼的具体情况：\n• 这个场合对你们来说有什么特殊意义吗？\n• 你希望通过这份礼物表达什么？\n• 有什么预算考虑或特殊要求？\n\n分享更多细节，让我帮你找到最贴心的礼物想法！",
        3: "Hi！我是你的AI礼物助手 🎁\n\n让我们聊聊你想通过礼物传递的情感：\n• 你最希望TA收到礼物时是什么感受？\n• 有什么特别想要表达的心意吗？\n• TA平时对什么样的惊喜比较有感觉？\n\n告诉我你的想法，我会帮你找到最能打动TA的礼物！",
        4: "Hi！我是你的AI礼物助手 🎁\n\n我们来深入了解一下TA的性格特点：\n• TA在生活中是什么样的人？\n• 有什么独特的习惯或癖好？\n• TA通常如何度过空闲时间？\n• 什么样的东西最能吸引TA的注意？\n\n越了解TA，我们就越能找到完美的礼物！",
        5: "Hi！我是你的AI礼物助手 🎁\n\n最后，让我们聊聊TA接受爱意的方式：\n• TA平时喜欢怎样的关怀表达？\n• 什么样的举动最能让TA感到被爱？\n• TA对物质礼物的态度如何？\n• 有什么特别能触动TA心弦的方式？\n\n这些信息将帮我为你推荐最有意义的礼物！"
    };
    
    return welcomeMessages[stepNumber] || welcomeMessages[1];
}

// 发送聊天消息
async function sendChatMessage(stepNumber) {
    const input = document.getElementById(`chat-input-step${stepNumber}`);
    const messagesContainer = document.getElementById(`chat-messages-step${stepNumber}`);
    
    const message = input.value.trim();
    if (!message) return;
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息到界面
    addMessageToChat(stepNumber, message, 'user');
    
    // 从用户消息中提取维度信息（现在是异步的）
    let extractedDimensions = {};
    try {
        extractedDimensions = await extractDimensionsFromMessage(message);
        console.log('提取到的维度信息:', extractedDimensions);
    } catch (error) {
        console.error('维度提取失败:', error);
        // 继续执行，但没有提取到维度信息
    }
    
    // 更新维度信息
    Object.entries(extractedDimensions).forEach(([dimId, info]) => {
        updateDimensionInfo(dimId, info.value, info.confidence, info.source);
    });
    
    // 实时更新completeness（无论是否提取到维度信息）
    const previousCompleteness = sessionData.dimensions.completeness.score || 0;
    assessDimensionCompleteness();
    const currentCompleteness = sessionData.dimensions.completeness.score || 0;
    
    // 如果完整性发生变化，记录事件
    if (previousCompleteness !== currentCompleteness) {
        recordEvent('completeness_updated', {
            step: stepNumber,
            previous_score: previousCompleteness,
            current_score: currentCompleteness,
            extracted_dimensions: Object.keys(extractedDimensions),
            missing_dimensions: sessionData.dimensions.completeness.missingDimensions
        });
        console.log(`完整性更新: ${previousCompleteness} -> ${currentCompleteness}`);
    }
    
    // 添加到上下文历史
    sessionData.agent.contextHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        stepNumber: stepNumber,
        extractedDimensions: extractedDimensions
    });
    
    // 显示加载状态
    const loadingMessageId = addLoadingMessage(stepNumber);
    
    try {
        // 调用AI API获取回复
        const aiResponse = await callAIAPI(message, stepNumber);
        
        // 移除加载状态
        removeLoadingMessage(stepNumber, loadingMessageId);
        
        // 添加AI回复到界面
        addMessageToChat(stepNumber, aiResponse, 'ai');
        
        // 添加AI回复到上下文历史
        sessionData.agent.contextHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString(),
            stepNumber: stepNumber
        });
        
        // 保存对话记录到Firebase
        await saveChatToFirestore(message, aiResponse);
        
        // 记录聊天事件
        recordEvent(EVENT_TYPES.CHAT_WITH_AI, {
            userMessage: message,
            aiResponse: aiResponse,
            extractedDimensions: extractedDimensions,
            completeness: sessionData.dimensions.completeness,
            ai_extraction_used: Object.values(extractedDimensions).some(dim => dim.source === 'ai_extraction'),
            extraction_methods: Object.values(extractedDimensions).map(dim => dim.source),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('AI回复失败:', error);
        
        // 移除加载状态
        removeLoadingMessage(stepNumber, loadingMessageId);
        
        // 根据错误类型显示不同的错误消息
        let errorMessage = '抱歉，我现在无法回复。请稍后再试。';
        
        if (error.message.includes('503') || error.message.includes('overloaded')) {
            errorMessage = '服务器目前比较繁忙，我已经尝试了多次重试。请稍等片刻再试，或者您可以继续与我对话。';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = '网络连接似乎有问题，请检查您的网络连接后再试。';
        } else if (error.message.includes('API')) {
            errorMessage = 'AI服务暂时不可用，请稍后再试。您也可以继续浏览其他功能。';
        }
        
        // 显示错误消息
        addMessageToChat(stepNumber, errorMessage, 'ai');
        
        // 记录错误事件
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            step: stepNumber,
            error: error.message,
            errorType: error.message.includes('503') ? 'server_overload' : 
                      error.message.includes('network') ? 'network_error' : 'api_error',
            timestamp: new Date().toISOString()
        });
    }
}

// 添加消息到聊天界面
function addMessageToChat(stepNumber, message, sender) {
    const messagesContainer = document.getElementById(`chat-messages-step${stepNumber}`);
    const messageDiv = document.createElement('div');
    const timestamp = new Date().toISOString();
    
    if (sender === 'user') {
        messageDiv.className = 'user-message flex items-start space-x-2 justify-end';
        messageDiv.innerHTML = `
            <div class="bg-purple-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                <p class="text-sm">${escapeHtml(message)}</p>
            </div>
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-user text-gray-600 text-sm"></i>
            </div>
        `;
    } else {
        messageDiv.className = 'ai-message flex items-start space-x-2';
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-robot text-white text-sm"></i>
            </div>
            <div class="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                <p class="text-sm text-gray-800">${escapeHtml(message)}</p>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 保存到本地对话记录
    chatState.conversations[`step${stepNumber}`].push({
        message,
        sender,
        timestamp
    });
}

// 添加加载消息
function addLoadingMessage(stepNumber) {
    const messagesContainer = document.getElementById(`chat-messages-step${stepNumber}`);
    const loadingDiv = document.createElement('div');
    const loadingId = `loading-${Date.now()}`;
    
    loadingDiv.id = loadingId;
    loadingDiv.className = 'ai-message flex items-start space-x-2';
    loadingDiv.innerHTML = `
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-robot text-white text-sm"></i>
        </div>
        <div class="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
            <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <p class="text-sm text-gray-600">消息正在处理中...</p>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return loadingId;
}

// 移除加载消息
function removeLoadingMessage(stepNumber, loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// 调用AI API
async function callAIAPI(message, stepNumber, retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 1000; // 1秒
    
    try {
        // 检查Google AI SDK是否可用
        if (typeof window.GoogleGenerativeAI === 'undefined' && typeof GoogleGenerativeAI === 'undefined') {
            throw new Error('Google Generative AI SDK未加载');
        }
        
        // 初始化Gemini API
        const API_KEY = "AIzaSyBEuFVK35-OtMCZfzxQHdLpGljR3DKSqFA";
        const GoogleAI = window.GoogleGenerativeAI || GoogleGenerativeAI;
        const genAI = new GoogleAI(API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // 构建上下文信息
        const context = buildChatContext();
        
        // 构建提示词
        const prompt = `
你是一个专业的礼物推荐助手。请根据以下信息提供建议：

用户消息：${message}

${context.fullContext}

请用简短友好的语气回复，并给出具体的建议。如果用户提到了具体的关系、场合、情感意图等信息，请记住这些信息并在后续对话中使用。
        `;

        console.log('发送给AI的提示词:', prompt);
        console.log('重试次数:', retryCount);

        // 调用Gemini API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        // 验证响应内容
        if (!aiResponse) {
            throw new Error('Gemini API返回空响应');
        }

        console.log('AI回复:', aiResponse);
        return aiResponse.trim();

    } catch (error) {
        console.error(`Gemini API调用失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, error);
        
        // 检查是否是503错误（服务过载）或网络错误，且还有重试次数
        if (retryCount < maxRetries && 
            (error.message.includes('503') || 
             error.message.includes('overloaded') || 
             error.message.includes('fetch') ||
             error.message.includes('network'))) {
            
            console.log(`等待 ${retryDelay * (retryCount + 1)}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
            return callAIAPI(message, stepNumber, retryCount + 1);
        }
        
        // 记录错误事件
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            error: error.message,
            stepNumber: stepNumber,
            retryCount: retryCount,
            timestamp: new Date().toISOString()
        });
        
        // API调用失败时返回备选响应
        return generateMockAIResponse(message, stepNumber);
    }
}

// 构建聊天上下文（使用维度配置系统和会话持续策略）
function buildChatContext() {
    // 生成或更新系统消息
    const systemMessage = generateSystemMessage();
    
    // 构建动态上下文
    let dynamicContext = '';
    
    // 添加已收集的维度信息
    const collected = sessionData.dimensions.collected;
    if (Object.keys(collected).length > 0) {
        dynamicContext += '\n**已了解的信息：**\n';
        Object.entries(collected).forEach(([dimId, info]) => {
            const dimension = DIMENSION_CONFIG.dimensions[dimId];
            if (dimension) {
                dynamicContext += `- ${dimension.name}：${info.label} (置信度: ${Math.round(info.confidence * 100)}%)\n`;
            }
        });
    }
    
    // 添加最近的对话历史
    const recentHistory = sessionData.agent.contextHistory.slice(-DIMENSION_CONFIG.agent.context_memory_turns);
    if (recentHistory.length > 0) {
        dynamicContext += '\n**最近对话：**\n';
        recentHistory.forEach((turn, index) => {
            dynamicContext += `${turn.role}: ${turn.content}\n`;
        });
    }
    
    // 添加当前策略指导
    const nextDimension = getNextDimension();
    if (nextDimension) {
        dynamicContext += `\n**当前重点：**\n重点了解${nextDimension.name}（${nextDimension.description}）\n`;
    } else {
        dynamicContext += '\n**当前重点：**\n信息收集完成，可以提供礼物推荐\n';
    }
    
    // 更新Agent状态
    sessionData.agent.systemMessage = systemMessage;
    sessionData.agent.conversationTurns++;
    
    return {
        systemMessage: systemMessage,
        dynamicContext: dynamicContext,
        fullContext: systemMessage + dynamicContext
    };
}

// 生成模拟AI回复（作为备选方案）
function generateMockAIResponse(message, stepNumber) {
    const responses = {
        1: [
            '了解你们的关系很重要！不同的关系需要不同程度的亲密感。',
            '选择合适的关系类型能帮我更好地为你推荐礼物。',
            '每种关系都有其特殊的表达方式，告诉我更多吧！'
        ],
        2: [
            '场合决定了礼物的风格和意义，选择对了事半功倍！',
            '不同的场合需要不同的礼物策略，让我来帮你分析。',
            '了解场合能让礼物更有针对性和意义。'
        ],
        3: [
            '你想传达的感觉很重要，这决定了礼物的情感价值。',
            '每种感觉都有对应的礼物类型，让我为你详细分析。',
            '明确意图能让礼物更有感染力和表达力。'
        ],
        4: [
            '了解TA的性格能帮我推荐最合适的礼物类型。',
            '性格决定了喜好，这是选择礼物的重要依据。',
            '每种性格都有其偏爱的礼物风格，告诉我更多细节吧！'
        ],
        5: [
            '爱的语言是表达情感的方式，选对了能让礼物更有意义。',
            '了解TA接受爱的方式，能让你的心意更好地传达。',
            '每个人感受爱的方式不同，这很重要！'
        ]
    };
    
    const stepResponses = responses[stepNumber] || responses[1];
    return stepResponses[Math.floor(Math.random() * stepResponses.length)];
}

// ===== 维度管理系统 =====

// 评估维度收集完整性
function assessDimensionCompleteness() {
    const config = DIMENSION_CONFIG;
    const collected = sessionData.dimensions.collected;
    
    let totalWeight = 0;
    let collectedWeight = 0;
    let missing = [];
    
    // 计算必需维度
    config.completeness.required_dimensions.forEach(dimId => {
        const dimension = config.dimensions[dimId];
        if (dimension) {
            totalWeight += 1.0;
            if (collected[dimId] && collected[dimId].confidence > 0.5) {
                collectedWeight += collected[dimId].confidence;
            } else {
                missing.push(dimId);
            }
        }
    });
    
    // 计算可选维度（权重较低）
    config.completeness.optional_dimensions.forEach(dimId => {
        const dimension = config.dimensions[dimId];
        if (dimension) {
            totalWeight += 0.5;
            if (collected[dimId] && collected[dimId].confidence > 0.5) {
                collectedWeight += collected[dimId].confidence * 0.5;
            } else {
                missing.push(dimId);
            }
        }
    });
    
    const completeness = totalWeight > 0 ? collectedWeight / totalWeight : 0;
    
    // 更新会话数据
    sessionData.dimensions.completeness = completeness;
    sessionData.dimensions.missing = missing;
    
    return {
        completeness,
        missing,
        isComplete: completeness >= config.completeness.minimum_score
    };
}

// 从用户消息中提取维度信息（使用AI智能推理）
async function extractDimensionsFromMessage(message) {
    const config = DIMENSION_CONFIG;
    const extracted = {};
    
    try {
        // 使用AI进行智能维度提取
        const aiExtracted = await extractDimensionsWithAI(message);
        Object.assign(extracted, aiExtracted);
    } catch (error) {
        console.warn('AI维度提取失败，回退到关键词匹配:', error);
    }
    
    // 关键词匹配作为备选方案
    Object.keys(config.dimensions).forEach(dimId => {
        // 如果AI已经提取到该维度，跳过关键词匹配
        if (extracted[dimId]) return;
        
        const dimension = config.dimensions[dimId];
        
        dimension.options.forEach(option => {
            // 检查消息中是否包含选项标签
            if (message.toLowerCase().includes(option.label.toLowerCase()) ||
                message.toLowerCase().includes(option.value.toLowerCase())) {
                
                extracted[dimId] = {
                    value: option.value,
                    label: option.label,
                    confidence: 0.6,  // 关键词匹配的置信度较低
                    source: 'keyword_matching',
                    timestamp: new Date().toISOString(),
                    // stepNumber: stepNumber
                };
            }
        });
    });
    
    return extracted;
}

// 使用AI进行智能维度提取
async function extractDimensionsWithAI(message) {
    const config = DIMENSION_CONFIG;
    const extracted = {};
    
    try {
        // 检查Google AI SDK是否可用
        if (typeof window.GoogleGenerativeAI === 'undefined' && typeof GoogleGenerativeAI === 'undefined') {
            throw new Error('Google Generative AI SDK未加载');
        }
        
        // 初始化Gemini API
        const API_KEY = "AIzaSyBEuFVK35-OtMCZfzxQHdLpGljR3DKSqFA";
        const GoogleAI = window.GoogleGenerativeAI || GoogleGenerativeAI;
        const genAI = new GoogleAI(API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.3,  // 降低温度以获得更一致的结果
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 512,
            }
        });
        
        // 构建维度提取提示词   // TODO: 提示词内容待拓展
        const dimensionPrompt = `
你是一个专业的信息提取助手。请分析以下用户消息，提取礼物推荐相关的维度信息。

用户消息："${message}"

请识别以下维度（如果消息中包含相关信息）：

1. 关系类型：
   - partner（情侣、男朋友、女朋友、爱人、伴侣）
   - friend（朋友、好友、闺蜜、兄弟）
   - colleague（同事、同学、老师、上司、下属）
   - family（家人、父母、兄弟姐妹、亲戚）

2. 场合：
   - birthday（生日、生辰）
   - anniversary（纪念日、周年、情人节、结婚纪念日）
   - gratitude（感谢、感恩、答谢、回礼）
   - celebration（庆祝、升职、毕业、成功）

3. 情感意图：
   - surprise（惊喜、意外、神秘）
   - touching（感动、温馨、浪漫、深情）
   - fun（有趣、搞笑、娱乐、轻松）
   - healing（治愈、安慰、温暖、放松）

请仅返回JSON格式，包含识别到的维度。如果某个维度未识别到，请不要包含该字段。
置信度范围：0.7-0.95（0.7=可能，0.8=较确定，0.9=很确定，0.95=非常确定）

示例格式：
{"relationship": {"value": "partner", "confidence": 0.9}, "occasion": {"value": "birthday", "confidence": 0.95}}

只返回JSON，不要其他解释文字。
        `;
        
        console.log('AI维度提取提示词:', dimensionPrompt);
        
        // 调用AI API
        const result = await model.generateContent(dimensionPrompt);
        const response = await result.response;
        const aiResponse = response.text().trim();
        
        console.log('AI维度提取原始回复:', aiResponse);
        
        // 解析AI返回的JSON
        let parsedResponse;
        try {
            // 清理可能的markdown格式
            const cleanResponse = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
            parsedResponse = JSON.parse(cleanResponse);
        } catch (parseError) {
            console.warn('AI返回的JSON解析失败:', parseError, '原始回复:', aiResponse);
            return extracted;
        }
        
        // 验证并转换AI提取的维度信息
        Object.entries(parsedResponse).forEach(([dimId, info]) => {
            const dimension = config.dimensions[dimId];
            if (!dimension) {
                console.warn(`未知维度: ${dimId}`);
                return;
            }
            
            const option = dimension.options.find(opt => opt.value === info.value);
            if (!option) {
                console.warn(`维度 ${dimId} 的未知选项: ${info.value}`);
                return;
            }
            
            // 验证置信度
            const confidence = Math.max(0.7, Math.min(0.95, info.confidence || 0.8));
            
            extracted[dimId] = {
                value: option.value,
                label: option.label,
                confidence: confidence,
                source: 'ai_extraction',
                timestamp: new Date().toISOString(),
                // stepNumber: stepNumber || null
            };
        });
        
        console.log('AI成功提取的维度信息:', extracted);
        
    } catch (error) {
        console.error('AI维度提取失败:', error);
        throw error;
    }
    
    return extracted;
}

// 更新维度信息
function updateDimensionInfo(dimensionId, value, confidence = 1.0, source = 'user_input') {
    const config = DIMENSION_CONFIG;
    const dimension = config.dimensions[dimensionId];
    
    if (!dimension) {
        console.warn(`Unknown dimension: ${dimensionId}`);
        return false;
    }
    
    // 查找对应的选项
    const option = dimension.options.find(opt => opt.value === value);
    if (!option) {
        console.warn(`Unknown option ${value} for dimension ${dimensionId}`);
        return false;
    }
    
    // 更新维度信息
    sessionData.dimensions.collected[dimensionId] = {
        value: option.value,
        label: option.label,
        confidence: confidence,
        source: source,
        timestamp: new Date().toISOString(),
        weight: option.weight
    };

    // 更新Agent状态
    sessionData.agent.lastDimensionUpdate = new Date().toISOString();
    
    // 重新评估完整性
    const assessment = assessDimensionCompleteness();
    
    // 记录维度更新事件
    recordEvent(EVENT_TYPES.STEP_COMPLETE, {
        dimensionId: dimensionId,
        value: value,
        confidence: confidence,
        source: source,
        completeness: assessment.completeness,
        missing: assessment.missing
    });
    
    return true;
}

// 获取下一个需要收集的维度
function getNextDimension() {
    const config = DIMENSION_CONFIG;
    const collected = sessionData.dimensions.collected;
    
    // 按优先级排序所有维度
    const allDimensions = Object.values(config.dimensions)
        .sort((a, b) => a.priority - b.priority);
    
    // 查找第一个未收集或置信度低的维度
    for (const dimension of allDimensions) {
        const collectedInfo = collected[dimension.id];
        if (!collectedInfo || collectedInfo.confidence < 0.7) {
            return dimension;
        }
    }
    
    return null; // 所有维度都已收集
}

// 生成Agent系统消息
function generateSystemMessage() {
    const config = DIMENSION_CONFIG;
    const assessment = assessDimensionCompleteness();
    
    let systemMessage = `你是一个专业的礼物推荐助手，通过自然对话收集用户信息来提供个性化的礼物建议。

**你的任务：**
通过友好、自然的对话，了解以下维度的信息：
`;
    
    // 添加维度说明
    Object.values(config.dimensions).forEach(dim => {
        const collected = sessionData.dimensions.collected[dim.id];
        const status = collected ? '✓' : '○';
        systemMessage += `${status} ${dim.name}：${dim.description}\n`;
    });
    
    systemMessage += `
**对话原则：**
1. 使用开放式问题，避免机械式选择题
2. 根据用户回答自然引导到下一个话题
3. 可以从一个问题中收集多个维度的信息
4. 保持对话的连贯性和趣味性
5. **重要：永远不要主动提供礼物推荐，只有当用户明确要求推荐时才提供**
6. 持续深入了解用户需求，不断追问更多维度信息
7. 仔细理解用户的自然语言表达，识别隐含的维度信息
8. 即使收集到足够信息，也要继续探索更深层的需求和偏好
9. 鼓励用户分享更多细节，如具体的兴趣爱好、生活方式、特殊需求等

**重要提示：**
- 当用户提到"女朋友"、"男朋友"、"爱人"、"伴侣"时，这表示关系类型是"情侣"
- 当用户提到"生日"、"生辰"时，这表示场合是"生日"
- 当用户提到"纪念日"、"周年"、"情人节"时，这表示场合是"纪念日"
- 当用户提到"惊喜"、"意外"时，这表示情感意图是"惊喜"
- 当用户提到"感动"、"温馨"、"浪漫"时，这表示情感意图是"感动"
- 仔细分析用户的每句话，提取其中的维度信息

**当前状态：**
- 完整性：${Math.round(assessment.completeness * 100)}%
- 还需了解：${assessment.missing.map(id => config.dimensions[id]?.name).join('、') || '无'}
`;
    
    return systemMessage;
}

// 保存聊天记录到Firebase（统一存储在sessions文档中）
async function saveChatToFirestore(userMessage, aiResponse) {
    if (!sessionData.userId || !sessionData.sessionId) {
        console.warn('用户未登录或会话未创建，无法保存聊天记录');
        return;
    }
    
    try {
        // 创建聊天交互记录
        const chatInteraction = {
            user_message: userMessage,
            ai_response: aiResponse,
            timestamp: new Date(),
            context: buildChatContext()
        };
        
        // 添加到本地聊天历史
        chatState.chatHistory.push(chatInteraction);
        
        // 按时间戳排序
        chatState.chatHistory.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
            const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
            return timeA - timeB;
        });
        
        // 直接更新sessions文档的chatHistory字段
        const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
        await sessionRef.update({
            chatHistory: chatState.chatHistory,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // 同时记录事件用于分析（保持原有的分析功能）
        recordEvent(EVENT_TYPES.CHAT_WITH_AI, {
            current_interaction: chatInteraction,
            total_interactions: chatState.chatHistory.length,
            session_context: {
                answers: sessionData.answers,
                language: currentLang
            }
        });
        
        console.log(`聊天记录已保存，总交互次数: ${chatState.chatHistory.length}`);
        
    } catch (error) {
        console.error('保存聊天记录失败:', error);
        // 记录错误事件
        recordEvent(EVENT_TYPES.ERROR_OCCURRED, {
            error_type: 'chat_save_failed',
            error_message: error.message,
            user_message: userMessage,
            ai_response: aiResponse,
            timestamp: new Date()
        });
    }
}

// HTML转义函数
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// 基于聊天内容生成推荐
async function generateRecommendationFromChat() {
    try {
        // 检查是否有聊天历史
        if (!chatState.chatHistory || chatState.chatHistory.length === 0) {
            alert('请先与AI助手进行一些对话，以便我们了解您的需求。');
            return;
        }

        // 显示加载页面
        showPage(loadingPage);
        
        // 记录事件
        recordEvent('chat_based_recommendation_triggered', {
            chat_interactions: chatState.chatHistory.length,
            dimensions_collected: Object.keys(sessionData.dimensions.collected).length,
            completeness: sessionData.dimensions.completeness
        });

        // 构建基于聊天历史的用户画像
        const chatBasedProfile = buildChatBasedUserProfile();
        
        // 调用AI生成推荐
        const aiRecommendations = await generateAIRecommendationsFromChat(chatBasedProfile);
        
        if (aiRecommendations && aiRecommendations.length > 0) {
            sessionData.recommendations = aiRecommendations;
        } else {
            // 如果AI生成失败，使用备用数据
            console.warn('基于聊天的AI推荐生成失败，使用备用推荐');
            sessionData.recommendations = mockRecommendations;
        }
        
        // 保存推荐结果到Firebase
        saveRecommendations();
        
        // 渲染推荐结果到结果页面
        renderRecommendationsToResultsPage();
        
        // 显示结果页面
        showPage(resultsPage);
        
    } catch (error) {
        console.error('基于聊天生成推荐时出错:', error);
        // 出错时使用备用数据
        sessionData.recommendations = mockRecommendations;
        saveRecommendations();
        renderRecommendationsToResultsPage();
        showPage(resultsPage);
    }
}

// 构建基于聊天历史的用户画像
function buildChatBasedUserProfile() {
    let profile = '基于用户与AI助手的聊天记录：\n\n';
    
    // 添加聊天历史
    chatState.chatHistory.forEach((interaction, index) => {
        profile += `对话${index + 1}：\n`;
        profile += `用户：${interaction.user_message}\n`;
        profile += `AI：${interaction.ai_response}\n\n`;
    });
    
    // 添加已收集的维度信息
    const collected = sessionData.dimensions.collected;
    if (Object.keys(collected).length > 0) {
        profile += '已收集的用户偏好信息：\n';
        Object.entries(collected).forEach(([dimensionId, info]) => {
            const dimension = DIMENSION_CONFIG.dimensions[dimensionId];
            if (dimension) {
                profile += `- ${dimension.name}：${info.value} (置信度：${Math.round(info.confidence * 100)}%)\n`;
            }
        });
    }
    
    return profile;
}

// 基于聊天内容调用AI生成推荐
async function generateAIRecommendationsFromChat(chatProfile) {
    try {
        const prompt = `
你是一个专业的礼物推荐专家。请根据以下用户与AI助手的完整聊天记录，分析用户的需求并推荐3个最适合的礼物。

${chatProfile}

请仔细分析聊天内容，理解用户的真实需求、收礼人的特点、场合背景等信息，然后推荐最合适的礼物。

请严格按照以下JSON格式返回推荐结果，不要包含任何其他文字：

[
  {
    "id": 1,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合聊天内容中的用户需求和偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  },
  {
    "id": 2,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合聊天内容中的用户需求和偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  },
  {
    "id": 3,
    "title": "礼物名称",
    "description": "详细描述，50字以内",
    "price": "价格区间，如¥100-200",
    "reason": "推荐理由，结合聊天内容中的用户需求和偏好说明为什么适合",
    "where": "购买渠道，如淘宝、京东等",
    "image": "https://example.com/image.jpg"
  }
]

注意：
1. 必须返回有效的JSON格式
2. image字段请使用合适的商品图片URL
3. 价格要符合中国市场实际情况
4. 推荐要基于聊天内容，体现个性化和针对性
5. 推荐理由要明确引用聊天中提到的具体信息
        `;
        
        console.log('基于聊天的AI推荐提示词:', prompt);
        
        // 调用AI API
        const aiResponse = await callAIAPI(prompt, 'chat_recommendation');
        
        // 解析AI返回的JSON
        const recommendations = parseAIRecommendations(aiResponse);
        
        return recommendations;
        
    } catch (error) {
        console.error('基于聊天的AI推荐生成失败:', error);
        return null;
    }
}

// 渲染推荐结果到结果页面
function renderRecommendationsToResultsPage() {
    recommendationsContainer.innerHTML = '';
    
    sessionData.recommendations.forEach(gift => {
        const giftElement = document.createElement('div');
        giftElement.className = 'recommendation-card bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300';
        giftElement.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6">
                <div class="md:w-1/3">
                    <img src="${gift.image}" alt="${gift.title}" class="w-full h-48 object-cover rounded-xl" onerror="this.src='https://via.placeholder.com/300x200?text=礼物图片'">
                </div>
                <div class="md:w-2/3">
                    <h3 class="text-xl font-bold text-stone-900 mb-3">${gift.title}</h3>
                    <p class="text-stone-600 mb-4">${gift.description}</p>
                    
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <span class="inline-block w-16 text-sm font-semibold text-stone-500" data-i18n="gift.price">价格范围</span>
                            <span class="text-stone-800 font-semibold">${gift.price}</span>
                        </div>
                        
                        <div class="flex items-start">
                            <span class="inline-block w-16 text-sm font-semibold text-stone-500" data-i18n="gift.why">为什么适合</span>
                            <span class="text-stone-700">${gift.reason}</span>
                        </div>
                        
                        <div class="flex items-start">
                            <span class="inline-block w-16 text-sm font-semibold text-stone-500" data-i18n="gift.where">哪里购买</span>
                            <span class="text-stone-700">${gift.where}</span>
                        </div>
                    </div>
                    
                    <button class="gift-select-btn mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-gift-id="${gift.id}">
                        <span data-i18n="gift.select">加入心愿单</span>
                    </button>
                </div>
            </div>
        `;
        
        recommendationsContainer.appendChild(giftElement);
    });
    
    // 重新绑定礼物选择按钮事件
    bindGiftSelectEvents();
}

// 绑定礼物选择按钮事件
function bindGiftSelectEvents() {
    document.querySelectorAll('.gift-select-btn').forEach(button => {
        button.addEventListener('click', function() {
            const giftId = parseInt(this.dataset.giftId);
            const gift = sessionData.recommendations.find(g => g.id === giftId);
            
            if (gift) {
                // 切换选中状态
                const isSelected = sessionData.selectedGifts.some(g => g.id === giftId);
                
                if (isSelected) {
                    // 取消选中
                    sessionData.selectedGifts = sessionData.selectedGifts.filter(g => g.id !== giftId);
                    this.classList.remove('bg-green-600', 'hover:bg-green-700');
                    this.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    this.querySelector('span').textContent = '加入心愿单';
                } else {
                    // 选中
                    sessionData.selectedGifts.push(gift);
                    this.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    this.classList.add('bg-green-600', 'hover:bg-green-700');
                    this.querySelector('span').textContent = '已加入心愿单';
                }
                
                // 记录事件
                recordEvent(EVENT_TYPES.GIFT_SELECTED, {
                    giftId: giftId,
                    giftTitle: gift.title,
                    isSelected: !isSelected,
                    totalSelected: sessionData.selectedGifts.length
                });
                
                // 保存到Firebase
                if (sessionData.sessionId) {
                    const sessionRef = db.collection('sessions').doc(sessionData.sessionId);
                    sessionRef.update({
                        selectedGifts: sessionData.selectedGifts
                    });
                }
            }
        });
    });
}

// 在页面加载完成后初始化聊天窗口和推荐按钮
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保所有元素都已加载
    setTimeout(() => {
        initializeChatWindows();
        
        // 为所有推荐按钮添加事件监听器
        for (let i = 1; i <= 5; i++) {
            const btn = document.getElementById(`generate-recommendation-btn-step${i}`);
            if (btn) {
                btn.addEventListener('click', generateRecommendationFromChat);
            }
        }
    }, 100);
});