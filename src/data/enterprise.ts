import type { EnterpriseInfo, Department, Employee } from '@/types/enterprise';

// 企业基本信息
export const enterpriseInfo: EnterpriseInfo = {
  id: 1,
  name: '山东纳智达机器人有限公司',
  legalPerson: '张明',
  registrationNumber: '91370100MA3XQ4YX8B',
  registeredCapital: 5000,
  foundingDate: '2020-03-15',
  address: '山东省济南市高新区新泺大街1768号齐鲁软件园大厦B座15层',
  contact: '张明',
  phone: '18888888888',
  email: 'contact@nazhida.com',
  website: 'www.nazhida.com',
  description: '专注于工业机器人研发与制造的高新技术企业',
  businessScope: '工业机器人、智能设备、自动化设备的研发、制造、销售及技术服务；软件开发；系统集成服务；货物进出口。',
  status: 'active'
};

// 部门数据
export const departments: Department[] = [
  {
    id: 1,
    name: '总经办',
    manager: '张明',
    parentId: null,
    description: '负责公司整体战略规划和运营管理',
    employeeCount: 5,
    createTime: '2020-03-15',
    updateTime: '2020-03-15'
  },
  {
    id: 2,
    name: '研发部',
    manager: '李工',
    parentId: null,
    description: '负责产品研发和技术创新',
    employeeCount: 30,
    createTime: '2020-03-15',
    updateTime: '2020-03-15'
  },
  {
    id: 3,
    name: '生产部',
    manager: '王强',
    parentId: null,
    description: '负责产品生产和质量控制',
    employeeCount: 50,
    createTime: '2020-03-15',
    updateTime: '2020-03-15'
  },
  {
    id: 4,
    name: '销售部',
    manager: '赵霞',
    parentId: null,
    description: '负责产品销售和客户维护',
    employeeCount: 20,
    createTime: '2020-03-15',
    updateTime: '2020-03-15'
  },
  {
    id: 5,
    name: '人力资源部',
    manager: '周婷',
    parentId: null,
    description: '负责人员招聘和培训管理',
    employeeCount: 8,
    createTime: '2020-03-15',
    updateTime: '2020-03-15'
  }
];

// 员工数据
export const employees: Employee[] = [
  {
    id: 1,
    employeeNo: 'EMP001',
    name: '张明',
    departmentId: 1,
    position: '总经理',
    phone: '18888888888',
    email: 'zhangming@nazhida.com',
    gender: 'male',
    birthDate: '1980-01-01',
    entryDate: '2020-03-15',
    status: 'active'
  },
  // ... 可以添加更多员工数据
]; 