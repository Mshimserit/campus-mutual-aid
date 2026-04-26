export const mockMessages = [
  {
    id: 'm001',
    type: 'comment',
    title: '神秘同学1234 评论了你的帖子',
    content: '图书馆期末期间会延长到晚上10点半的',
    time: '5分钟前',
    timestamp: Date.now() - 5 * 60 * 1000,
    read: false,
    targetId: 'p001',
    sender: {
      id: 'user1234',
      username: '神秘同学1234',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p001',
      title: '图书馆什么时候关门？',
      summary: '请问图书馆期末期间会延长开放时间吗？想了解一下具体时间安排，方便复习备考。'
    }
  },
  {
    id: 'm002',
    type: 'like',
    title: '神秘同学9876 点赞了你的帖子',
    content: '',
    time: '15分钟前',
    timestamp: Date.now() - 15 * 60 * 1000,
    read: false,
    targetId: 'p002',
    sender: {
      id: 'user9876',
      username: '神秘同学9876',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p002',
      title: '校园二手市场交易贴',
      summary: '出一台九成新的iPad Air，配原装笔，价格面议...'
    }
  },
  {
    id: 'm003',
    type: 'order',
    title: '订单已被接单',
    content: '您的订单e2026041715421189已被神秘同学628190接单，请留意接单进度',
    time: '1小时前',
    timestamp: Date.now() - 60 * 60 * 1000,
    read: true,
    targetId: 'e2026041715421189',
    sender: {
      id: 'system',
      username: '系统通知',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'order',
      id: 'e2026041715421189',
      title: '帮忙打印50页资料',
      summary: '代取快递到宿舍'
    }
  },
  {
    id: 'm004',
    type: 'comment',
    title: '神秘同学6677 回复了你的评论',
    content: '可以的，周六下午3点操场见！',
    time: '2小时前',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: true,
    targetId: 'p004',
    sender: {
      id: 'user6677',
      username: '神秘同学6677',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p004',
      title: '周末操场羽毛球有人吗？',
      summary: '周六下午想去操场打羽毛球，有没有一起的同学？'
    }
  },
  {
    id: 'm005',
    type: 'order',
    title: '订单已完成',
    content: '您的订单e2026041512345678已完成，佣金已到账',
    time: '3小时前',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: false,
    targetId: 'e2026041512345678',
    sender: {
      id: 'system',
      username: '系统通知',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'order',
      id: 'e2026041512345678',
      title: '教务处交材料',
      summary: '帮忙去教务处交一份材料'
    }
  },
  {
    id: 'm006',
    type: 'system',
    subtype: 'welcome',
    title: '欢迎使用校园互助平台',
    content: '欢迎使用校园互助平台，祝您使用愉快！如有问题请联系客服。',
    time: '1天前',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    sender: {
      id: 'admin',
      username: '平台管理员',
      avatar: '/static/logo.png'
    }
  },
  {
    id: 'm007',
    type: 'system',
    subtype: 'review_result',
    title: '帖子审核通过',
    content: '您发布的帖子《校园二手市场交易》已通过审核，现已成功展示',
    time: '2天前',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: false,
    targetId: 'p007',
    sender: {
      id: 'admin',
      username: '平台管理员',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p007',
      title: '校园二手市场交易',
      summary: '二手物品交易信息发布'
    }
  },
  {
    id: 'm008',
    type: 'system',
    subtype: 'violation_warning',
    title: '违规警告',
    content: '您发布的帖子《兼职信息》因包含违规内容，已被下架处理。请遵守平台规则，勿发布含有敏感信息的帖子。',
    time: '3天前',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    read: true,
    sender: {
      id: 'admin',
      username: '平台管理员',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p008',
      title: '兼职信息',
      summary: '校外兼职招聘信息'
    }
  },
  {
    id: 'm009',
    type: 'like',
    title: '神秘同学1122 点赞了你的评论',
    content: '',
    time: '4天前',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    read: true,
    targetId: 'c001',
    sender: {
      id: 'user1122',
      username: '神秘同学1122',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'comment',
      id: 'c001',
      title: '评论：期末考试复习经验',
      summary: '建议提前一个月开始复习，重点做历年真题...'
    }
  },
  {
    id: 'm010',
    type: 'system',
    subtype: 'platform_update',
    title: '平台更新通知',
    content: '平台已新增互助订单功能，现在您可以发布和接取校园互助任务了！',
    time: '5天前',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    read: true,
    sender: {
      id: 'admin',
      username: '平台管理员',
      avatar: '/static/logo.png'
    }
  },
  {
    id: 'm011',
    type: 'comment',
    title: '神秘同学3344 评论了你的帖子',
    content: '请问这个活动还需要人吗？我想报名',
    time: '6天前',
    timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
    read: true,
    targetId: 'p011',
    sender: {
      id: 'user3344',
      username: '神秘同学3344',
      avatar: '/static/logo.png'
    },
    target: {
      type: 'post',
      id: 'p011',
      title: '校园歌手大赛志愿者招募',
      summary: '校园歌手大赛即将举行，现招募志愿者...'
    }
  },
  {
    id: 'm012',
    type: 'system',
    subtype: 'account_security',
    title: '账号安全提醒',
    content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码。',
    time: '7天前',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    read: true,
    sender: {
      id: 'admin',
      username: '平台安全中心',
      avatar: '/static/logo.png'
    }
  }
]
