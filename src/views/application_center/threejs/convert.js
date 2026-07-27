const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mapData.geo.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Hospital department mapping
const deptMap = {
  // 2F - 住院部
  's1':  { name: '内科病房', type: 'inpatient', color: '#f8d7da' },
  's2':  { name: '外科病房', type: 'inpatient', color: '#f8d7da' },
  's3':  { name: '骨科病房', type: 'inpatient', color: '#f8d7da' },
  's4':  { name: '儿科病房', type: 'inpatient', color: '#d4edda' },
  's5':  { name: '妇产科病房', type: 'inpatient', color: '#f8d7da' },
  's6':  { name: 'ICU', type: 'inpatient', color: '#fff3cd' },
  's7':  { name: '康复病房', type: 'inpatient', color: '#d4edda' },
  's8':  { name: '护士站', type: 'nurse', color: '#d1ecf1' },
  's9':  { name: '医生办公室', type: 'office', color: '#e2e3e5' },
  's10': { name: '治疗室', type: 'outpatient', color: '#cce5ff' },
  's11': { name: '值班室', type: 'office', color: '#e2e3e5' },
  's12': { name: '更衣室', type: 'office', color: '#e2e3e5' },
  's13': { name: '库房', type: 'office', color: '#e2e3e5' },
  's14': { name: '示教/会议', type: 'office', color: '#e2e3e5' },
  's15': { name: '阅片室', type: 'imaging', color: '#d1ecf1' },
  's16': { name: '处置室', type: 'outpatient', color: '#cce5ff' },
  's17': { name: '配药室', type: 'pharmacy', color: '#d4edda' },
  's18': { name: '污物处置', type: 'office', color: '#e2e3e5' },
  's19': { name: '会诊室', type: 'office', color: '#e2e3e5' },
  's20': { name: '谈话间', type: 'office', color: '#e2e3e5' },
  's21': { name: '家属等候', type: 'waiting', color: '#fff3cd' },
  's22': { name: '活动区', type: 'waiting', color: '#fff3cd' },
  's23': { name: '营养室', type: 'office', color: '#e2e3e5' },
  's24': { name: '被服间', type: 'office', color: '#e2e3e5' },
  's25': { name: '器械室', type: 'office', color: '#e2e3e5' },
  's26': { name: '抢救室', type: 'emergency', color: '#f8d7da' },
  's27': { name: '隔离病房', type: 'inpatient', color: '#f8d7da' },
  's28': { name: '新生儿室', type: 'inpatient', color: '#d4edda' },
  's29': { name: '产房', type: 'inpatient', color: '#f8d7da' },
  's30': { name: '手术室1', type: 'surgery', color: '#cce5ff' },
  's31': { name: '手术室2', type: 'surgery', color: '#cce5ff' },
  's32': { name: '手术室3', type: 'surgery', color: '#cce5ff' },
  's33': { name: '麻醉室', type: 'surgery', color: '#cce5ff' },
  's34': { name: '苏醒室', type: 'surgery', color: '#cce5ff' },
  's35': { name: '消毒供应', type: 'office', color: '#e2e3e5' },
  's36': { name: '病理室', type: 'laboratory', color: '#d1ecf1' },
  's37': { name: '输血科', type: 'laboratory', color: '#d1ecf1' },
  's38': { name: '检验科', type: 'laboratory', color: '#d1ecf1' },
  's39': { name: '采血室', type: 'laboratory', color: '#d1ecf1' },
  's40': { name: '生化室', type: 'laboratory', color: '#d1ecf1' },
  's41': { name: '免疫室', type: 'laboratory', color: '#d1ecf1' },
  's42': { name: '微生物室', type: 'laboratory', color: '#d1ecf1' },
  's43': { name: 'PCR实验室', type: 'laboratory', color: '#d1ecf1' },
  's44': { name: '标本接收', type: 'laboratory', color: '#d1ecf1' },
  // 1F - 门诊
  'f1s1':  { name: '挂号收费', type: 'outpatient', color: '#cce5ff' },
  'f1s2':  { name: '门诊大厅', type: 'outpatient', color: '#fff3cd' },
  'f1s3':  { name: '内科诊室', type: 'outpatient', color: '#d4edda' },
  'f1s4':  { name: '外科诊室', type: 'outpatient', color: '#d4edda' },
  'f1s5':  { name: '儿科诊室', type: 'outpatient', color: '#d4edda' },
  'f1s6':  { name: '妇产科诊室', type: 'outpatient', color: '#f8d7da' },
  'f1s7':  { name: '眼科诊室', type: 'outpatient', color: '#d1ecf1' },
  'f1s8':  { name: '耳鼻喉科', type: 'outpatient', color: '#d1ecf1' },
  'f1s9':  { name: '口腔科', type: 'outpatient', color: '#d1ecf1' },
  'f1s10': { name: '皮肤科', type: 'outpatient', color: '#d1ecf1' },
  'f1s11': { name: '中医科', type: 'outpatient', color: '#d4edda' },
  'f1s12': { name: '康复科', type: 'outpatient', color: '#d4edda' },
  'f1s13': { name: '心理科', type: 'outpatient', color: '#d1ecf1' },
  'f1s14': { name: '西药房', type: 'pharmacy', color: '#cce5ff' },
  'f1s15': { name: '中药房', type: 'pharmacy', color: '#cce5ff' },
  // B1 - 医技
  'b1s1': { name: 'CT室', type: 'imaging', color: '#d1ecf1' },
  'b1s2': { name: 'MRI室', type: 'imaging', color: '#d1ecf1' },
  'b1s3': { name: 'X光室', type: 'imaging', color: '#d1ecf1' },
  'b1s4': { name: '超声科', type: 'imaging', color: '#d1ecf1' },
  'b1s5': { name: '心电图室', type: 'imaging', color: '#d1ecf1' },
};

const typeLabelMap = {
  outpatient: '门诊',
  emergency: '急诊',
  inpatient: '住院',
  pharmacy: '药房',
  laboratory: '检验科',
  imaging: '影像科',
  surgery: '手术室',
  office: '办公',
  waiting: '候诊区',
  nurse: '护士站',
  cafeteria: '食堂',
  parking: '停车场',
};

// Update metadata
data.metadata.mallName = '市中心医院';
data.metadata.floors = [
  { id: '2f', label: '2F' },
  { id: '1f', label: '1F' },
  { id: 'b1', label: 'B1' },
];
data.metadata.description = 'Indoor map of 市中心医院';

// Remove B2 floor data
data.features = data.features.filter(f => {
  if (f.properties.floor === 'b2') return false;
  return true;
});

// Update building name
data.features.forEach(f => {
  if (f.properties.category === 'building') {
    f.properties.name = '市中心医院';
    f.properties.floors = ['2F', '1F', 'B1'];
  }
});

// Update shops
data.features.forEach(f => {
  if (f.properties.category === 'shop') {
    const id = f.properties.id;
    const dept = deptMap[id];
    if (dept) {
      f.properties.name = dept.name;
      f.properties.shopType = dept.type;
      f.properties.shopTypeLabel = typeLabelMap[dept.type] || dept.type;
      f.properties.color = dept.color;
    }
  }
});

// Update facilities
const facTypeMap = {
  escalator: { color: '#fa8c16', label: '扶梯' },
  stairs: { color: '#52c41a', label: '楼梯' },
  restroom: { color: '#722ed1', label: '卫生间' },
  elevator: { color: '#1890ff', label: '电梯' },
};

data.features.forEach(f => {
  if (f.properties.category === 'facility') {
    const info = facTypeMap[f.properties.facilityType];
    if (info) {
      f.properties.color = info.color;
    }
  }
});

// Add some elevator facilities
const elevatorPositions = [
  { id: 'ev1', floor: '2f', x: 350, y: 260 },
  { id: 'ev2', floor: '1f', x: 350, y: 260 },
  { id: 'ev3', floor: 'b1', x: 350, y: 260 },
];

elevatorPositions.forEach(ev => {
  data.features.push({
    type: 'Feature',
    properties: {
      id: ev.id,
      name: '电梯',
      category: 'facility',
      facilityType: 'elevator',
      floor: ev.floor,
      color: '#1890ff',
    },
    geometry: {
      type: 'Point',
      coordinates: [ev.x, ev.y],
    },
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Done! Converted to hospital map data.');
