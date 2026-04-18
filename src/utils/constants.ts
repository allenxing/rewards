export const TASK_TEMPLATES = {
  '3-6': [
    { name: '整理床铺', icon: '🛏️', point: 2, type: 'daily', category: 'life' },
    { name: '刷牙洗脸', icon: '🦷', point: 2, type: 'daily', category: 'life' },
    { name: '按时吃饭', icon: '🍚', point: 2, type: 'daily', category: 'life' },
    { name: '自己穿衣服', icon: '👕', point: 3, type: 'daily', category: 'life' },
    { name: '收拾玩具', icon: '🧸', point: 3, type: 'daily', category: 'housework' },
    { name: '主动打招呼', icon: '👋', point: 3, type: 'daily', category: 'character' },
    { name: '说谢谢', icon: '🙏', point: 2, type: 'daily', category: 'character' },
    { name: '整理书架', icon: '📚', point: 3, type: 'weekly', category: 'housework' },
  ],
  '7-12': [
    { name: '完成作业', icon: '📝', point: 5, type: 'daily', category: 'study' },
    { name: '帮忙洗碗', icon: '🍽️', point: 10, type: 'weekly', category: 'housework' },
    { name: '整理房间', icon: '🧹', point: 5, type: 'weekly', category: 'housework' },
    { name: '锻炼身体', icon: '🏃', point: 5, type: 'daily', category: 'life' },
    { name: '阅读课外书', icon: '📖', point: 3, type: 'daily', category: 'study' },
    { name: '洗袜子', icon: '🧦', point: 3, type: 'weekly', category: 'housework' },
    { name: '帮忙做饭', icon: '🍳', point: 8, type: 'weekly', category: 'housework' },
    { name: '照顾宠物', icon: '🐕', point: 5, type: 'daily', category: 'character' },
  ],
  'all': [
    { name: '助人为乐', icon: '🤝', point: 5, type: 'one_time', category: 'character' },
    { name: '主动道歉', icon: '😔', point: 3, type: 'one_time', category: 'character' },
    { name: '分享食物', icon: '🍪', point: 3, type: 'one_time', category: 'character' },
    { name: '早睡早起', icon: '🌅', point: 4, type: 'daily', category: 'life' },
  ]
}

export const AGE_GROUP_LABELS = {
  '3-6': '萌芽组 (3-6岁)',
  '7-12': '成长组 (7-12岁)',
  'all': '全年龄'
}

export const CATEGORY_LABELS = {
  'life': '生活自理',
  'study': '学习成长',
  'housework': '家务劳动',
  'character': '品格培养'
}
