import type { Product } from '@/types/product';
import industrial1 from '@/assets/robot-images/industrial-1.png';
import industrial2 from '@/assets/robot-images/industrial-2.png';
import industrial3 from '@/assets/robot-images/industrial-3.png';

export const products: Product[] = [
  {
    id: 1,
    name: 'NZ-6R-180',
    category: 'industrial',
    description: '六轴通用工业机器人，适用于各类制造场景，提供精准、高效的自动化解决方案。采用先进的伺服控制系统，具有高精度、高可靠性等特点。',
    image: industrial1,
    tag: '畅销产品',
    features: [
      '高精度伺服控制',
      '智能路径规划',
      '碰撞检测与防护',
      '远程监控与诊断'
    ],
    specifications: [
      { name: '负载能力', value: '20kg' },
      { name: '重复定位精度', value: '±0.02mm' },
      { name: '自由度', value: '6' },
      { name: '工作半径', value: '1.8m' },
      { name: '最大速度', value: '2.5m/s' },
      { name: '防护等级', value: 'IP67' }
    ],
    price: {
      basePrice: 158000,
      currency: 'CNY',
      unit: '台',
      discount: {
        percentage: 5,
        validUntil: '2025-12-31'
      }
    },
    services: [
      {
        name: '基础安装服务',
        description: '包含设备安装、调试和基础培训',
        price: 15000,
        duration: '3-5个工作日'
      },
      {
        name: '高级培训服务',
        description: '包含编程培训、维护培训和故障排除培训',
        price: 25000,
        duration: '5-7个工作日'
      },
      {
        name: '年度维护服务',
        description: '包含定期检查、保养和软件更新',
        price: 20000,
        duration: '1年'
      }
    ],
    technicalDetails: {
      '控制系统': '自主研发的NZD控制系统',
      '编程方式': '示教器编程/离线编程',
      '通信接口': 'EtherCAT/Modbus TCP',
      '安全功能': '安全监控、紧急停止、速度监控',
      '软件平台': 'NZD Studio 3.0'
    },
    applications: [
      '汽车零部件装配',
      '电子产品组装',
      '金属加工',
      '塑料制品生产',
      '食品包装'
    ],
    certifications: [
      'CE认证',
      'ISO 9001:2015',
      'ISO 13485:2016',
      '中国机器人CR认证'
    ],
    warranty: {
      period: '3年',
      terms: [
        '整机保修3年',
        '核心部件保修5年',
        '7*24小时技术支持',
        '免费软件升级'
      ]
    },
    maintenance: {
      schedule: '每6个月进行一次例行维护',
      requirements: [
        '定期检查机械部件',
        '更新控制系统软件',
        '校准传感器',
        '检查安全系统'
      ]
    },
    support: {
      type: '全方位技术支持',
      description: '提供远程技术支持、现场服务、培训等全方位支持',
      contact: '400-888-8888'
    }
  },
  {
    id: 2,
    name: 'NZ-4R-120',
    category: 'industrial',
    description: '四轴高速机器人，专为拾取和包装应用设计，具有业内领先的作业速度',
    image: industrial2,
    features: [
      '高速运动控制',
      '智能路径规划',
      '碰撞检测与防护',
      '远程监控与诊断'
    ],
    specifications: [
      { name: '负载能力', value: '8kg' },
      { name: '重复定位精度', value: '±0.01mm' },
      { name: '自由度', value: '4' },
      { name: '工作半径', value: '1.2m' },
      { name: '最大速度', value: '3.0m/s' },
      { name: '防护等级', value: 'IP67' }
    ],
    price: {
      basePrice: 128000,
      currency: 'CNY',
      unit: '台',
      discount: {
        percentage: 8,
        validUntil: '2025-12-31'
      }
    },
    services: [
      {
        name: '基础安装服务',
        description: '包含设备安装、调试和基础培训',
        price: 12000,
        duration: '3-5个工作日'
      },
      {
        name: '高级培训服务',
        description: '包含编程培训、维护培训和故障排除培训',
        price: 20000,
        duration: '5-7个工作日'
      },
      {
        name: '年度维护服务',
        description: '包含定期检查、保养和软件更新',
        price: 15000,
        duration: '1年'
      }
    ],
    technicalDetails: {
      '控制系统': '自主研发的NZD控制系统',
      '编程方式': '示教器编程/离线编程',
      '通信接口': 'EtherCAT/Modbus TCP',
      '安全功能': '安全监控、紧急停止、速度监控',
      '软件平台': 'NZD Studio 3.0'
    },
    applications: [
      '快速拾取',
      '包装应用',
      '装配作业',
      '搬运任务'
    ],
    certifications: [
      'CE认证',
      'ISO 9001:2015',
      'ISO 13485:2016',
      '中国机器人CR认证'
    ],
    warranty: {
      period: '3年',
      terms: [
        '整机保修3年',
        '核心部件保修5年',
        '7*24小时技术支持',
        '免费软件升级'
      ]
    },
    maintenance: {
      schedule: '每6个月进行一次例行维护',
      requirements: [
        '定期检查机械部件',
        '更新控制系统软件',
        '校准传感器',
        '检查安全系统'
      ]
    },
    support: {
      type: '全方位技术支持',
      description: '提供远程技术支持、现场服务、培训等全方位支持',
      contact: '400-888-8888'
    }
  },
  {
    id: 3,
    name: 'NZ-6R-250',
    category: 'industrial',
    description: '大负载工业机器人，适用于重型工件搬运和大型零部件加工',
    image: industrial3,
    tag: '新品',
    features: [
      '大负载能力',
      '高精度控制',
      '智能路径规划',
      '远程监控与诊断'
    ],
    specifications: [
      { name: '负载能力', value: '250kg' },
      { name: '重复定位精度', value: '±0.05mm' },
      { name: '自由度', value: '6' },
      { name: '工作半径', value: '2.5m' },
      { name: '最大速度', value: '2.0m/s' },
      { name: '防护等级', value: 'IP67' }
    ],
    price: {
      basePrice: 258000,
      currency: 'CNY',
      unit: '台',
      discount: {
        percentage: 3,
        validUntil: '2025-12-31'
      }
    },
    services: [
      {
        name: '基础安装服务',
        description: '包含设备安装、调试和基础培训',
        price: 25000,
        duration: '5-7个工作日'
      },
      {
        name: '高级培训服务',
        description: '包含编程培训、维护培训和故障排除培训',
        price: 35000,
        duration: '7-10个工作日'
      },
      {
        name: '年度维护服务',
        description: '包含定期检查、保养和软件更新',
        price: 30000,
        duration: '1年'
      }
    ],
    technicalDetails: {
      '控制系统': '自主研发的NZD控制系统',
      '编程方式': '示教器编程/离线编程',
      '通信接口': 'EtherCAT/Modbus TCP',
      '安全功能': '安全监控、紧急停止、速度监控',
      '软件平台': 'NZD Studio 3.0'
    },
    applications: [
      '重型工件搬运',
      '大型零部件加工',
      '铸造应用',
      '重型装配'
    ],
    certifications: [
      'CE认证',
      'ISO 9001:2015',
      'ISO 13485:2016',
      '中国机器人CR认证'
    ],
    warranty: {
      period: '3年',
      terms: [
        '整机保修3年',
        '核心部件保修5年',
        '7*24小时技术支持',
        '免费软件升级'
      ]
    },
    maintenance: {
      schedule: '每6个月进行一次例行维护',
      requirements: [
        '定期检查机械部件',
        '更新控制系统软件',
        '校准传感器',
        '检查安全系统'
      ]
    },
    support: {
      type: '全方位技术支持',
      description: '提供远程技术支持、现场服务、培训等全方位支持',
      contact: '400-888-8888'
    }
  }
]; 