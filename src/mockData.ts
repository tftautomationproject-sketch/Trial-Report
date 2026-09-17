import { TrialReport, AppConfig } from './types';

// Helper to create clean illustrative SVGs matching industrial trial photos
export function generateIndustrialSvg(type: 'jig_main' | 'pipe_hand' | 'cad_drawing' | 'jig_pin' | 'support_weld' | 'weld_defect' | 'fixture_clamp' | 'robot_cell' | 'generic', label?: string): string {
  if (type === 'jig_main') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="100%" height="100%">
      <rect width="400" height="280" fill="%23e2e8f0"/>
      <rect x="20" y="160" width="360" height="90" fill="%23059669" rx="4"/>
      <rect x="60" y="190" width="280" height="25" fill="%23047857"/>
      <path d="M50 140 Q 200 40 350 140 L 330 160 Q 200 70 70 160 Z" fill="%23334155"/>
      <path d="M80 100 Q 200 20 320 100 L 300 120 Q 200 45 100 120 Z" fill="%23475569"/>
      <circle cx="160" cy="110" r="28" fill="%231e293b"/>
      <circle cx="160" cy="110" r="14" fill="%2394a3b8"/>
      <rect x="150" y="70" width="20" height="80" fill="%2364748b"/>
      <rect x="230" y="90" width="30" height="60" fill="%23475569"/>
      <rect x="15" y="40" width="110" height="50" rx="8" fill="%23dc2626" opacity="0.85"/>
      <text x="70" y="70" font-family="sans-serif" font-size="12" fill="white" font-weight="bold" text-anchor="middle">Air Tool</text>
      <rect x="20" y="245" width="70" height="25" fill="%233b82f6" rx="3"/>
      <text x="55" y="262" font-family="sans-serif" font-size="11" fill="white" font-weight="bold" text-anchor="middle">BASE JIG</text>
    </svg>`;
  }

  if (type === 'pipe_hand') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 250" width="100%" height="100%">
      <rect width="350" height="250" fill="%23cbd5e1"/>
      <rect x="40" y="40" width="270" height="30" fill="%2364748b"/>
      <path d="M40 70 Q 180 180 300 70" fill="none" stroke="%23334155" stroke-width="18" stroke-linecap="round"/>
      <path d="M70 100 Q 180 190 280 100" fill="none" stroke="%23475569" stroke-width="12" stroke-linecap="round"/>
      <!-- Gloved hand holding vertical pin -->
      <path d="M140 120 C 150 90, 200 90, 210 120 L 220 220 L 130 220 Z" fill="%231e293b"/>
      <rect x="165" y="80" width="20" height="130" fill="%230f172a" rx="4"/>
      <circle cx="175" cy="85" r="14" fill="%23475569"/>
      <text x="175" y="240" font-family="sans-serif" font-size="12" fill="%23334155" text-anchor="middle" font-weight="bold">Sub-Assy Pipe Component</text>
    </svg>`;
  }

  if (type === 'cad_drawing') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="100%" height="100%">
      <rect width="300" height="160" fill="%23ffffff" stroke="%23cbd5e1"/>
      <!-- Grid lines -->
      <line x1="20" y1="20" x2="280" y2="20" stroke="%2394a3b8" stroke-width="1"/>
      <line x1="20" y1="60" x2="280" y2="60" stroke="%2364748b" stroke-width="1.5"/>
      <line x1="20" y1="130" x2="280" y2="130" stroke="%2364748b" stroke-width="1.5"/>
      <line x1="70" y1="20" x2="70" y2="140" stroke="%2364748b" stroke-width="1"/>
      <line x1="140" y1="20" x2="140" y2="140" stroke="%2364748b" stroke-width="1"/>
      <line x1="220" y1="20" x2="220" y2="140" stroke="%2364748b" stroke-width="1"/>
      <text x="90" y="85" font-family="monospace" font-size="11" fill="%23334155">160 ±0.5</text>
      <text x="160" y="85" font-family="monospace" font-size="11" fill="%23334155">118</text>
      <!-- Red Circle highlighting 3mm gap -->
      <circle cx="185" cy="55" r="18" fill="none" stroke="%23dc2626" stroke-width="2.5"/>
      <text x="185" y="58" font-family="monospace" font-size="10" fill="%23dc2626" font-weight="bold" text-anchor="middle">3</text>
      <text x="240" y="45" font-family="monospace" font-size="10" fill="%2364748b">C0.5</text>
    </svg>`;
  }

  if (type === 'jig_pin') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
      <rect width="300" height="200" fill="%23f1f5f9"/>
      <rect x="30" y="140" width="240" height="50" fill="%23059669"/>
      <rect x="20" y="60" width="260" height="25" fill="%23475569" rx="3"/>
      <rect x="30" y="110" width="240" height="20" fill="%23334155" rx="3"/>
      <!-- Hand with pin -->
      <path d="M120 10 C 130 50, 160 80, 150 140" fill="none" stroke="%233b82f6" stroke-width="20" stroke-linecap="round"/>
      <rect x="135" y="50" width="16" height="85" fill="%2394a3b8" stroke="%231e293b" stroke-width="1.5"/>
      <!-- Red circle -->
      <circle cx="143" cy="115" r="32" fill="none" stroke="%23dc2626" stroke-width="3"/>
      <text x="143" y="185" font-family="sans-serif" font-size="11" fill="%23dc2626" font-weight="bold" text-anchor="middle">Position Pin Control</text>
    </svg>`;
  }

  if (type === 'support_weld') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
      <rect width="300" height="200" fill="%23e2e8f0"/>
      <rect x="20" y="130" width="260" height="55" fill="%23059669"/>
      <circle cx="80" cy="110" r="30" fill="%231e293b"/>
      <path d="M40 70 L 260 70 L 250 95 L 50 95 Z" fill="%2364748b"/>
      <!-- Support arm blocking weld -->
      <rect x="180" y="50" width="35" height="70" fill="%23475569"/>
      <circle cx="195" cy="85" r="28" fill="none" stroke="%23dc2626" stroke-width="3"/>
      <!-- Red Arrow -->
      <path d="M245 135 L 205 95" fill="none" stroke="%23dc2626" stroke-width="2.5" marker-end="url(%23arrow)"/>
      <polygon points="205,95 210,105 215,98" fill="%23dc2626"/>
      <text x="195" y="175" font-family="sans-serif" font-size="11" fill="%23dc2626" font-weight="bold" text-anchor="middle">Support บังจุดเชื่อม</text>
    </svg>`;
  }

  if (type === 'weld_defect') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
      <rect width="300" height="200" fill="%23f8fafc"/>
      <rect x="40" y="40" width="120" height="60" fill="%23475569"/>
      <!-- Spot weld -->
      <circle cx="95" cy="70" r="8" fill="%2394a3b8" stroke="%231e293b" stroke-width="2"/>
      <circle cx="105" cy="72" r="7" fill="%23cbd5e1" stroke="%231e293b" stroke-width="2"/>
      <!-- Curved pointer arrow -->
      <path d="M180 120 C 180 80, 150 70, 115 70" fill="none" stroke="%23dc2626" stroke-width="3"/>
      <polygon points="115,70 125,65 125,75" fill="%23dc2626"/>
      <!-- Clamping fixture with red circle -->
      <rect x="70" y="115" width="90" height="70" fill="%2310b981" rx="4"/>
      <circle cx="100" cy="150" r="22" fill="none" stroke="%23dc2626" stroke-width="3"/>
      <!-- Red safety border box -->
      <rect x="190" y="80" width="100" height="90" fill="none" stroke="%23dc2626" stroke-width="3"/>
      <text x="240" y="130" font-family="sans-serif" font-size="10" fill="%23dc2626" font-weight="bold" text-anchor="middle">จุดเสี่ยงหลุด</text>
    </svg>`;
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="%23f1f5f9"/>
    <text x="150" y="105" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">${label || 'Engineering Inspection'}</text>
  </svg>`;
}

export const INITIAL_REPORTS: TrialReport[] = [
  {
    id: 'TR-2026-001',
    reportNo: 'TR-2026-001',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Pipe Assembly Jig 01',
    partName: 'Rear Arm Bracket Pipe',
    partNumber: 'RB-4491-A',
    line: 'Welding Line 3 (KKM)',
    date: '2026-09-03',
    author: 'วิศวกรฝ่ายผลิต (Production Engineer)',
    creator: 'ประสิทธิ์ วงศ์วิศว์ (Production Eng)',
    customer: 'Toyota (TMT)',
    approver: 'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    approvalStatus: 'Approved',
    approvedDate: '2026-09-04 10:30',
    approvedBy: 'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    approvalRemark: 'อนุมัติผลการทดลอง ปรับแก้จุด Control 3 mm ตามแนวทางวิศวกรรม',
    trialRound: 'Trial #1',
    status: 'Under Review',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'ภาพรวม JIG หน้างาน',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'ท่อชิ้นงานและจุดจับยึด',
    keyProblemsSummary: [
      '1. ออกแบบ Jig Setting Control Pipe 3 mm',
      '2. ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่'
    ],
    problems: [
      {
        id: 'p1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- ไม่มี Jig Setting ระยะ Control 3 mm\n- ขาด Pin ควบคุมตำแหน่งระยะประกอบ',
        countermeasure: '- ออกแบบ Jig Setting ใหม่\n- ปรับระยะ Clearance ให้ได้มาตรฐาน CAD 3 mm',
        images: [
          generateIndustrialSvg('cad_drawing'),
          generateIndustrialSvg('jig_pin')
        ],
        imageCaptions: ['แบบ Drawing ควบคุมระยะ 3 mm', 'ตำแหน่ง Pin และจุดตรวจสอบระยะ'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Support บังจุดที่ต้อง เชื่อมแต้ม\n- หัวปืนเชื่อมเข้าไม่ถึงจุดเชื่อมหลัก',
        countermeasure: '- ถอด Support จุดบัง เชื่อมแต้มออก ไม่มีผลต่อการประกอบ\n- ย้ายตำแหน่ง Support ไปยังขอบนอกชิ้นงาน',
        images: [
          generateIndustrialSvg('support_weld')
        ],
        imageCaptions: ['จุด Support บังแนวเชื่อมแต้ม'],
        severity: 'Medium',
        status: 'Solved'
      },
      {
        id: 'p3',
        orderNumber: 3,
        title: '3. ปัญหาที่พบ',
        description: '- จุดเชื่อมแต้มด้านใต้ หากไม่เชื่อมไม่ติด มีโอกาส ชิ้นงานหลุด (KKM ใช้วิธีเชื่อมแต้มเหล็กดาม)\n- เสี่ยงต่อความแข็งแรงของรอยต่อ',
        countermeasure: '- ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่\n- เพิ่ม Clamp เสริมความปลอดภัยระหว่างจุดเชื่อม',
        images: [
          generateIndustrialSvg('weld_defect')
        ],
        imageCaptions: ['จุดเสี่ยงชิ้นงานหลุดและตำแหน่งประคองใหม่'],
        severity: 'High',
        status: 'In Progress'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'สมชาย ผู้จัดการโรงงาน (Plant Manager)',
        role: 'Admin',
        text: 'ปัญหาที่ 1 เร่งดำเนินการตัด Jig Setting 3 mm ด่วน เพื่อนำมาทดสอบใน Trial #2 วันศุกร์นี้',
        timestamp: '2026-09-03 18:20'
      },
      {
        id: 'c2',
        author: 'วิชัย ทีมช่างเชื่อม (Welding Operator)',
        role: 'User',
        text: 'จุด Support ที่ 2 ถ้าถอดออกจะทำงานได้เร็วขึ้นมาก ไม่ติดหัวปืนเชื่อมครับ',
        timestamp: '2026-09-04 09:15'
      }
    ],
    createdAt: '2026-09-03 17:49',
    updatedAt: '2026-09-04 09:15'
  },
  {
    id: 'TR-2026-002',
    reportNo: 'TR-2026-002',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Front Cross Member',
    partName: 'Cross Member Sub Assembly',
    partNumber: 'CM-8820-B',
    line: 'Press & Stamping Line 1',
    date: '2026-09-08',
    author: 'วิศวกรควบคุมคุณภาพ (QA Engineer)',
    creator: 'สมชาย ใจดี (QA Lead)',
    customer: 'Honda (HATC)',
    approver: 'ผจก. แผนกประกันคุณภาพ (QA/QC Manager)',
    approvalStatus: 'Approved',
    trialRound: 'Trial #2',
    status: 'Approved',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'Jig Base Plate Overview',
    headerImage2: generateIndustrialSvg('cad_drawing'),
    headerImage2Caption: 'CAD Datum Verification',
    keyProblemsSummary: [
      '1. รู Datum ขยับเล็กน้อย 0.8 mm ส่งผลต่อการลง Pin',
      '2. รอย Burrs ขอบชิ้นงานทำให้เกิดรอยขีดข่วน'
    ],
    problems: [
      {
        id: 'p2-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- รู Datum ขยับ 0.8 mm เข้าข่าย NG เมื่อวัดด้วย CMM\n- ช่างต้องออกแรงกดชิ้นงานลง Jig',
        countermeasure: '- สั่งปรับแก้ Punch Die รู Datum ชดเชยพิกัด\n- ตรวจสอบซ้ำด้วย Jig Go/No-Go Gauge',
        images: [
          generateIndustrialSvg('cad_drawing')
        ],
        imageCaptions: ['ค่าพิกัด Datum Offset'],
        severity: 'High',
        status: 'Solved'
      },
      {
        id: 'p2-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- ขอบชิ้นงานมีรอย Burrs คมเกินค่ามาตรฐาน 0.1 mm\n- เสี่ยงต่อการบาดมือผู้ปฏิบัติงาน',
        countermeasure: '- เพิ่มขั้นตอน Deburring Tooling อัตโนมัติ\n- อบรมและตรวจสอบด้วยเกจวัดความเรียบ',
        images: [
          generateIndustrialSvg('support_weld')
        ],
        imageCaptions: ['แนวคมขอบชิ้นงาน'],
        severity: 'Medium',
        status: 'Solved'
      }
    ],
    comments: [
      {
        id: 'c2-1',
        author: 'QA Director',
        role: 'Admin',
        text: 'CMM ผ่านเกณฑ์แล้ว อนุมัติเข้าสู่ขั้นตอน Pilot Run ได้',
        timestamp: '2026-09-09 14:00'
      }
    ],
    createdAt: '2026-09-08 10:30',
    updatedAt: '2026-09-09 14:00'
  },
  {
    id: 'TR-2026-003',
    reportNo: 'TR-2026-003',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Battery Housing Tray',
    partName: 'EV Battery Under-Tray Assembly',
    partNumber: 'EV-TRAY-990',
    line: 'Robotic Welding Cell A',
    date: '2026-09-12',
    author: 'วิศวกรระบบอัตโนมัติ (Automation Engineer)',
    creator: 'วิศวกร ทดสอบ (PE - Test Engineer)',
    customer: 'Yamaha (TYM)',
    approver: 'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    approvalStatus: 'Approved',
    trialRound: 'Mass Production Trial',
    status: 'Completed',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'Battery Tray Robotic Fixture',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'Gas Tightness Sealing Joint',
    keyProblemsSummary: [
      '1. อุณหภูมิการเชื่อมสะสมทำให้แผ่น Base Plate บิดงอ 1.2 mm'
    ],
    problems: [
      {
        id: 'p3-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- แผ่น Base Plate บิดงอ 1.2 mm เนื่องจากความร้อนสะสมในกระบวนการเชื่อมต่อเนื่อง\n- ค่าความเรียบ Flatness เกินพิกัดความคลาดเคลื่อน',
        countermeasure: '- ปรับลำดับการเชื่อม (Welding Sequence) แบบสลับซ้าย-ขวา\n- ติดตั้งระบบระบายความร้อน Water Cooling Block ใต้ Jig',
        images: [
          generateIndustrialSvg('weld_defect'),
          generateIndustrialSvg('cad_drawing')
        ],
        imageCaptions: ['กราฟการบิดงอจากความร้อน', 'Sequence การเดินแนวเชื่อมใหม่'],
        severity: 'High',
        status: 'Solved'
      }
    ],
    comments: [
      {
        id: 'c3-1',
        author: 'Automation Lead',
        role: 'Admin',
        text: 'ผลการปรับ sequence ดีมาก ค่า Flatness ลดลงเหลือ 0.25 mm อยู่ในเกณฑ์ OK',
        timestamp: '2026-09-13 11:45'
      }
    ],
    createdAt: '2026-09-12 13:10',
    updatedAt: '2026-09-13 11:45'
  },
  {
    id: 'TR-2026-004',
    reportNo: 'TR-2026-004',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Door Inner Reinforcement',
    partName: 'Door Frame Stiffener Module',
    partNumber: 'DF-3301-X',
    line: 'Assembly Line 4',
    date: '2026-09-14',
    author: 'วิศวกรทดสอบชิ้นส่วน (Test Engineer)',
    creator: 'ช่างเทคนิค Jig & Tool (Tooling Tech)',
    customer: 'Isuzu (IMCT)',
    approver: 'ผจก. ฝ่ายผลิต (Production Manager)',
    approvalStatus: 'Pending',
    trialRound: 'Trial #1',
    status: 'Draft',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'Door Frame Fixture',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'Clamp Cylinder Unit',
    keyProblemsSummary: [
      '1. Clamp ทับชิ้นงานทำให้เกิดรอยบุบ',
      '2. Sensor ตรวจจับชิ้นงานสะท้อนแสงผิดพลาด',
      '3. ตำแหน่งน็อต M6 เข้าถึงยากด้วยบล็อกลม',
      '4. สลักนำร่องหลวมคลอน 0.4 mm'
    ],
    problems: [
      {
        id: 'p4-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- แรงดันกระบอกลม Clamp สูงเกินไป ทำให้เกิดรอยกดบุบ',
        countermeasure: '- เสริมแผ่นยูรีเทนรองหน้าสัมผัส Clamp และลดแรงดันลม',
        images: [generateIndustrialSvg('jig_pin')],
        severity: 'Medium',
        status: 'In Progress'
      },
      {
        id: 'p4-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Photo Sensor ตรวจจับผิดพลาดจากแสงสะท้อนชิ้นงานชุบกัลวาไนซ์',
        countermeasure: '- ปรับมุมยิงของเซ็นเซอร์และเปลี่ยนเป็นเซ็นเซอร์ตรวจจับแบบโฟกัสจุด',
        images: [generateIndustrialSvg('cad_drawing')],
        severity: 'Low',
        status: 'Solved'
      },
      {
        id: 'p4-3',
        orderNumber: 3,
        title: '3. ปัญหาที่พบ',
        description: '- ขันน็อต M6 ไม่สะดวก ติดโครงสร้าง Jig ตัวบน',
        countermeasure: '- ปาดช่องเว้าโครงสร้าง Jig ตัวบน 15 mm เพื่อให้หัวบล็อกลมเข้าได้ตรงแนว',
        images: [generateIndustrialSvg('support_weld')],
        severity: 'Medium',
        status: 'Pending'
      },
      {
        id: 'p4-4',
        orderNumber: 4,
        title: '4. ปัญหาที่พบ',
        description: '- สลักนำร่อง Guide Pin มีระยะคลอน 0.4 mm ทำให้ตำแหน่งเลื่อน',
        countermeasure: '- กัดสลักนำร่องใหม่ด้วยเหล็ก SKD11 ชุบแข็งพร้อมเจียรนัย',
        images: [generateIndustrialSvg('weld_defect')],
        severity: 'High',
        status: 'Pending'
      }
    ],
    comments: [],
    createdAt: '2026-09-14 09:00',
    updatedAt: '2026-09-14 09:00'
  },
  {
    id: 'TR-2026-005',
    reportNo: 'TR-2026-005',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Floor Panel Cross Member (Case 3)',
    partName: 'Floor Structural Cross Beam',
    partNumber: 'FP-9055-C',
    line: 'Body Shop Welding Line 2',
    date: '2026-09-15',
    author: 'วิศวกรประกอบตัวถัง (Body Engineer)',
    creator: 'ประสิทธิ์ วงศ์วิศว์ (Production Eng)',
    customer: 'Toyota (TMT)',
    approver: 'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    approvalStatus: 'Approved',
    trialRound: 'Trial #1',
    status: 'In Progress' as any,
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'JIG 5 ปัญหา (Case 3)',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'Fixture Point Verification',
    keyProblemsSummary: [
      '1. ออกแบบ Jig Setting Control Pipe 3 mm',
      '2. ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่',
      '3. ขยับแนวเชื่อมหลบ Support',
      '4. สลัก Guide Pin สึกหรอ',
      '5. แคลมป์จับชิ้นงานไม่แน่น'
    ],
    problems: [
      {
        id: 'p5-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- ไม่มี Jig Setting ระยะ Control 3 mm\n- ขาด Pin ควบคุมตำแหน่ง',
        countermeasure: '- ออกแบบ Jig Setting ใหม่\n- เพิ่ม Clearance 3 mm',
        images: [generateIndustrialSvg('cad_drawing'), generateIndustrialSvg('jig_pin')],
        imageCaptions: ['CAD Drawing 3 mm', 'Setting Pin Position'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p5-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Support บังจุดที่ต้อง เชื่อมแต้ม\n- ปืนเชื่อมติดขัด',
        countermeasure: '- ถอด Support จุดบัง เชื่อมแต้มออก\n- ย้าย Support ไปขอบนอก',
        images: [generateIndustrialSvg('support_weld'), generateIndustrialSvg('weld_defect')],
        imageCaptions: ['จุด Support บังแนว', 'ปรับระยะปืนเชื่อม'],
        severity: 'Medium',
        status: 'Solved'
      },
      {
        id: 'p5-3',
        orderNumber: 3,
        title: '3. ปัญหาที่พบ',
        description: '- จุดเชื่อมแต้มด้านใต้ ชิ้นงานมีโอกาสหลุด\n- เสี่ยงต่อรอยต่อ',
        countermeasure: '- ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่\n- เสริมตัวช่วยจับ',
        images: [generateIndustrialSvg('pipe_hand'), generateIndustrialSvg('jig_pin')],
        imageCaptions: ['ตัวช่วยประคองใหม่', 'ตำแหน่ง Jig Pin'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p5-4',
        orderNumber: 4,
        title: '4. ปัญหาที่พบ',
        description: '- Pin นำร่องขยับหลวม 0.5 mm\n- ชิ้นงานเยื้องศูนย์',
        countermeasure: '- เปลี่ยน Pin เป็นเหล็ก SKD11\n- เจียรนัยปรับผิวเรียบ',
        images: [generateIndustrialSvg('jig_pin'), generateIndustrialSvg('cad_drawing')],
        imageCaptions: ['Pin SKD11', 'พิกัดรู Datum'],
        severity: 'Medium',
        status: 'Pending'
      },
      {
        id: 'p5-5',
        orderNumber: 5,
        title: '5. ปัญหาที่พบ',
        description: '- Clamp ยึดชิ้นงานแรงกดไม่พอ\n- ชิ้นงานกระดกขณะเชื่อม',
        countermeasure: '- เปลี่ยนกระบอกลม Clamp ไซส์ใหญ่ขึ้น\n- เพิ่มแผ่นยูรีเทนกันรอย',
        images: [generateIndustrialSvg('jig_main'), generateIndustrialSvg('support_weld')],
        imageCaptions: ['Air Cylinder Clamp', 'Urethane Pad'],
        severity: 'High',
        status: 'Pending'
      }
    ],
    comments: [],
    createdAt: '2026-09-15 10:00',
    updatedAt: '2026-09-15 10:00'
  },
  {
    id: 'TR-2026-006',
    reportNo: 'TR-2026-006',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Side Sill Outer (Case 4 คละ 1-2 รูป)',
    partName: 'Side Sill Outer Reinforce',
    partNumber: 'SS-4410-D',
    line: 'Stamping & Assembly 3',
    date: '2026-09-15',
    author: 'วิศวกรฝ่ายผลิต (Production Engineer)',
    creator: 'สมชาย ใจดี (QA Lead)',
    customer: 'Nissan (NMT)',
    approver: 'ผจก. ฝ่ายผลิต (Production Manager)',
    approvalStatus: 'Approved',
    trialRound: 'Trial #2',
    status: 'Draft',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'Jig Side Sill Assembly',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'Position Control Point',
    keyProblemsSummary: [
      '1. ปัญหาข้อ 1-3 มี 2 รูปภาพ',
      '2. ปัญหาข้อ 4-5 มี 1 รูปภาพ (รูปชิดบน ติดเนื้อหาแก้ไข)'
    ],
    problems: [
      {
        id: 'p6-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- ไม่มี Jig Setting ระยะ Control 3 mm\n- ขาด Pin กำหนดระยะ',
        countermeasure: '- ออกแบบ Jig Setting ใหม่\n- เพิ่ม Clearance 3 mm',
        images: [generateIndustrialSvg('cad_drawing'), generateIndustrialSvg('jig_pin')],
        imageCaptions: ['แบบระยะ 3 mm', 'จุด Pin Setting'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p6-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Support บังจุดที่ต้อง เชื่อมแต้ม\n- หัวปืนเชื่อมเข้าไม่ถึง',
        countermeasure: '- ถอด Support จุดบัง เชื่อมแต้มออก\n- ย้าย Support ไปขอบนอก',
        images: [generateIndustrialSvg('support_weld'), generateIndustrialSvg('weld_defect')],
        imageCaptions: ['จุด Support บังแนว', 'แนวเชื่อมหลังถอด Support'],
        severity: 'Medium',
        status: 'Solved'
      },
      {
        id: 'p6-3',
        orderNumber: 3,
        title: '3. ปัญหาที่พบ',
        description: '- ชิ้นงานมีโอกาสหลุดขณะเชื่อม\n- ขาดตัวช่วยยึดประคอง',
        countermeasure: '- ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่\n- เพิ่ม Clamp เสริมความปลอดภัย',
        images: [generateIndustrialSvg('pipe_hand'), generateIndustrialSvg('jig_pin')],
        imageCaptions: ['ตำแหน่งตัวช่วยประคอง', 'Clamp เสริม'],
        severity: 'High',
        status: 'In Progress'
      },
      {
        id: 'p6-4',
        orderNumber: 4,
        title: '4. ปัญหาที่พบ',
        description: '- รอยตัด Burrs คมบริเวณปลายแผ่น\n- วัดได้ 0.25 mm เกินมาตรฐาน',
        countermeasure: '- เพิ่มขั้นตอน Deburring Tooling\n- ตรวจสอบความเรียบ 100%',
        images: [generateIndustrialSvg('weld_defect')],
        imageCaptions: ['รอย Burrs ขอบชิ้นงาน (รูปเดี่ยว ชิดบน)'],
        severity: 'Low',
        status: 'Solved'
      },
      {
        id: 'p6-5',
        orderNumber: 5,
        title: '5. ปัญหาที่พบ',
        description: '- Sensor ตรวจจับแสงสะท้อนพลาด\n- ทำให้ Jig หยุดทำงานบ่อยครั้ง',
        countermeasure: '- ปรับมุมองศาและเปลี่ยนเป็น Laser Sensor\n- ทดสอบจับชิ้นงาน 50 ชิ้นต่อเนื่อง',
        images: [generateIndustrialSvg('jig_pin')],
        imageCaptions: ['Laser Sensor ตำแหน่งใหม่ (รูปเดี่ยว ชิดบน)'],
        severity: 'Medium',
        status: 'Solved'
      }
    ],
    comments: [],
    createdAt: '2026-09-15 14:00',
    updatedAt: '2026-09-15 14:00'
  },
  {
    id: 'TR-2026-007',
    reportNo: 'TR-2026-007',
    title: 'Trial Report',
    jigSubAssy: 'JIG : Roof Rail Module (Case 5 ปัญหาละ 1 รูป)',
    partName: 'Roof Rail Inner & Outer Bracket',
    partNumber: 'RR-1020-E',
    line: 'Welding Line 1',
    date: '2026-09-15',
    author: 'วิศวกรฝ่ายผลิต (Production Engineer)',
    creator: 'ช่างเทคนิค Jig & Tool (Tooling Tech)',
    customer: 'Honda (HATC)',
    approver: 'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    approvalStatus: 'Approved',
    trialRound: 'Trial #3',
    status: 'Approved',
    headerImage1: generateIndustrialSvg('jig_main'),
    headerImage1Caption: 'Roof Rail Main Jig',
    headerImage2: generateIndustrialSvg('pipe_hand'),
    headerImage2Caption: 'Datum Check Tool',
    keyProblemsSummary: [
      '1. ทุกปัญหา (1-5) มีรูปภาพปัญหาละ 1 รูป',
      '2. รูปภาพแสดงผลชิดด้านบน ใกล้เนื้อหาหัวข้อแก้ไขทุกคอลัมน์'
    ],
    problems: [
      {
        id: 'p7-1',
        orderNumber: 1,
        title: '1. ปัญหาที่พบ',
        description: '- ไม่มี Jig Setting ระยะ Control 3 mm\n- ขาด Pin ควบคุมตำแหน่ง',
        countermeasure: '- ออกแบบ Jig Setting ใหม่\n- เพิ่ม Clearance 3 mm',
        images: [generateIndustrialSvg('cad_drawing')],
        imageCaptions: ['CAD Drawing ควบคุมระยะ 3 mm'],
        severity: 'High',
        status: 'Solved'
      },
      {
        id: 'p7-2',
        orderNumber: 2,
        title: '2. ปัญหาที่พบ',
        description: '- Support บังจุดที่ต้อง เชื่อมแต้ม\n- ปืนเชื่อมติดขัด',
        countermeasure: '- ถอด Support จุดบัง เชื่อมแต้มออก\n- ไม่มีผลต่อการประกอบ',
        images: [generateIndustrialSvg('support_weld')],
        imageCaptions: ['จุด Support บังแนวเชื่อม'],
        severity: 'Medium',
        status: 'Solved'
      },
      {
        id: 'p7-3',
        orderNumber: 3,
        title: '3. ปัญหาที่พบ',
        description: '- จุดเชื่อมแต้มด้านใต้ ชิ้นงานมีโอกาสหลุด\n- เสี่ยงต่อรอยต่อ',
        countermeasure: '- ออกแบบ ตัวช่วยประคอง หรือ ตัวยึด ใหม่\n- เพิ่ม Clamp เสริมความปลอดภัย',
        images: [generateIndustrialSvg('weld_defect')],
        imageCaptions: ['จุดเสี่ยงชิ้นงานหลุด'],
        severity: 'High',
        status: 'Solved'
      },
      {
        id: 'p7-4',
        orderNumber: 4,
        title: '4. ปัญหาที่พบ',
        description: '- ขันน็อต M6 ไม่สะดวก ติดโครง Jig\n- หัวบล็อกลมเข้าไม่ตรงแนว',
        countermeasure: '- ปาดช่องเว้าโครงสร้าง Jig ตัวบน 15 mm\n- ให้หัวบล็อกลมเข้าได้ตรงแนว',
        images: [generateIndustrialSvg('pipe_hand')],
        imageCaptions: ['ช่องเว้าโครงสร้าง Jig'],
        severity: 'Medium',
        status: 'Solved'
      },
      {
        id: 'p7-5',
        orderNumber: 5,
        title: '5. ปัญหาที่พบ',
        description: '- สลักนำร่อง Guide Pin มีระยะคลอน 0.4 mm\n- ทำให้ตำแหน่งเลื่อน',
        countermeasure: '- กัดสลักนำร่องใหม่ด้วยเหล็ก SKD11\n- ชุบแข็งพร้อมเจียรนัย',
        images: [generateIndustrialSvg('jig_pin')],
        imageCaptions: ['สลักนำร่อง Guide Pin SKD11'],
        severity: 'High',
        status: 'Solved'
      }
    ],
    comments: [],
    createdAt: '2026-09-15 16:30',
    updatedAt: '2026-09-15 16:30'
  }
];

export const DEFAULT_APP_CONFIG: AppConfig = {
  logoUrl: '', // Default uses clean corporate SVG icon
  companyName: 'Trial Report System',
  customers: [
    'Toyota (TMT)',
    'Honda (HATC)',
    'Yamaha (TYM)',
    'Isuzu (IMCT)',
    'Nissan (NMT)',
    'AutoAlliance (AAT)'
  ],
  creators: [
    'วิศวกร ทดสอบ (PE - Test Engineer)',
    'ช่างเทคนิค Jig & Tool (Tooling Tech)',
    'สมชาย ใจดี (QA Lead)',
    'ประสิทธิ์ วงศ์วิศว์ (Production Eng)'
  ],
  approvers: [
    'ผจก. แผนกวิศวกรรม (Engineering Manager)',
    'ผจก. ฝ่ายผลิต (Production Manager)',
    'ผจก. แผนกประกันคุณภาพ (QA/QC Manager)',
    'ผู้อำนวยการโรงงาน (Plant Director)'
  ]
};
