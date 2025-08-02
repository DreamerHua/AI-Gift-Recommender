# 数据记录和事件追踪系统

本文档描述了AI礼物推荐助手中实现的完整数据记录和事件追踪系统。

## 概述

系统实现了全面的用户行为追踪、性能监控和数据分析功能，符合技术规格文档中关于数据记录的要求。

## 关键事件类型 (Events)

### 1. 会话管理事件
- `session_start`: 用户会话开始
- `session_end`: 用户会话结束

### 2. 认证事件
- `login_attempt`: 登录尝试
- `login_success`: 登录成功
- `login_failure`: 登录失败

### 3. 用户交互事件
- `step_start`: 步骤开始
- `step_complete`: 步骤完成
- `answer_selected`: 用户选择答案
- `language_changed`: 语言切换
- `user_interaction`: 通用用户交互（点击、滚动等）

### 4. 推荐系统事件
- `recommendation_generated`: 推荐结果生成
- `recommendation_viewed`: 用户查看推荐
- `feedback_submitted`: 用户提交反馈

### 5. 系统事件
- `page_view`: 页面访问
- `error_occurred`: 错误发生

## 数据字段结构

### sessionData 对象
```javascript
{
  userId: string,           // 用户ID
  sessionId: string,        // 会话ID
  answers: object,          // 用户回答
  recommendations: array,   // 推荐结果
  feedback: {               // 用户反馈
    rating: number,
    comment: string
  },
  events: array,            // 事件记录
  metrics: {                // 性能指标
    sessionStartTime: Date,
    totalTimeSpent: number,
    stepCompletionTimes: object,
    errorCount: number,
    retryCount: number
  },
  userBehavior: {           // 用户行为统计
    clickCount: number,
    scrollCount: number,
    languageSwitches: number,
    backButtonUsage: number
  }
}
```

### 事件记录格式
```javascript
{
  type: string,             // 事件类型
  timestamp: Date,          // 时间戳
  data: object,             // 事件相关数据
  sessionId: string,        // 会话ID
  userId: string            // 用户ID
}
```

## 数据存储结构

### Firestore 集合

#### 1. sessions 集合
存储完整的用户会话数据，包括：
- 基本会话信息
- 用户回答
- 推荐结果
- 反馈信息
- 事件记录
- 性能指标
- 用户行为统计

#### 2. events 集合
存储重要事件的实时记录，用于：
- 实时监控
- 错误追踪
- 用户行为分析

#### 3. analytics 集合
存储聚合分析数据，用于：
- 报表生成
- 趋势分析
- 性能监控

## 事件触发机制

### 自动触发事件
1. **页面加载**: 自动记录 `page_view` 事件
2. **用户登录**: 自动记录 `login_success` 或 `login_failure`
3. **步骤导航**: 自动记录 `step_start` 和 `step_complete`
4. **用户交互**: 自动记录点击、滚动等行为
5. **错误发生**: 自动记录 `error_occurred` 事件
6. **页面离开**: 自动记录 `session_end` 事件

### 手动触发事件
1. **答案选择**: 用户选择答案时记录
2. **反馈提交**: 用户提交反馈时记录
3. **语言切换**: 用户切换语言时记录

## 性能监控

### 追踪指标
1. **会话时长**: 从开始到结束的总时间
2. **步骤完成时间**: 每个步骤的完成耗时
3. **错误统计**: 错误发生次数和类型
4. **重试统计**: 用户重试操作的次数
5. **用户行为**: 点击、滚动、导航等行为统计

### 实时监控
- 重要事件立即保存到Firestore
- 错误事件实时记录和报告
- 性能异常自动检测

## 数据分析功能

### 调试工具
通过 `window.giftAppDebug` 提供以下功能：
- `exportData()`: 导出完整会话数据
- `getStats()`: 获取会话统计信息
- `viewEvents()`: 查看事件记录
- `viewMetrics()`: 查看性能指标
- `viewBehavior()`: 查看用户行为统计
- `clearEvents()`: 清空事件记录
- `simulateError()`: 模拟错误事件

### 数据导出格式
```javascript
{
  sessionInfo: {            // 会话基本信息
    sessionId,
    userId,
    startTime,
    endTime,
    totalDuration
  },
  userAnswers: object,      // 用户回答
  recommendations: array,   // 推荐结果
  feedback: object,         // 用户反馈
  events: array,            // 事件记录
  metrics: object,          // 性能指标
  userBehavior: object,     // 用户行为
  deviceInfo: object        // 设备信息
}
```

## 隐私和安全

### 数据保护
1. **用户同意**: 所有数据收集都基于用户同意
2. **匿名化**: 支持匿名用户数据收集
3. **最小化**: 只收集必要的数据
4. **加密**: 敏感数据传输加密

### 访问控制
1. **认证要求**: 所有数据访问都需要用户认证
2. **权限控制**: 用户只能访问自己的数据
3. **安全规则**: Firestore安全规则严格控制数据访问

## 使用示例

### 记录自定义事件
```javascript
recordEvent(EVENT_TYPES.USER_INTERACTION, {
  action: 'custom_action',
  data: { key: 'value' }
});
```

### 追踪用户行为
```javascript
trackUserBehavior('click', {
  element: 'button',
  context: 'recommendation_page'
});
```

### 记录性能指标
```javascript
trackPerformanceMetric('step_completion_time', {
  stepName: 'custom_step',
  duration: 1500
});
```

### 导出数据进行分析
```javascript
const sessionData = window.giftAppDebug.exportData();
const stats = window.giftAppDebug.getStats();
console.log('会话数据:', sessionData);
console.log('统计信息:', stats);
```

## 部署说明

### Firestore规则部署
```bash
firebase deploy --only firestore:rules
```

### 索引部署
```bash
firebase deploy --only firestore:indexes
```

### 完整部署
```bash
firebase deploy
```

## 监控和维护

### 日常监控
1. 检查错误事件频率
2. 监控性能指标趋势
3. 分析用户行为模式
4. 验证数据完整性

### 定期维护
1. 清理过期数据
2. 优化查询性能
3. 更新安全规则
4. 备份重要数据

---

此系统提供了全面的数据记录和分析能力，支持产品优化、用户体验改进和业务决策制定。