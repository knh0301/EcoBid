const { User, Attendance, CreditTransaction, sequelize } = require('./src/models');

async function runTests() {
  console.log('--- Starting Attendance API Validation ---');
  
  try {
    // 0. 초기화 (테스트 유저 생성)
    const [user] = await User.findOrCreate({
      where: { email: 'attend@test.com' },
      defaults: { name: 'Attend Tester', provider: 'LOCAL', credits: 0 }
    });
    const userId = user.id;
    console.log(`Test User ID: ${userId}, Initial Credits: ${user.credits}`);

    const BASE_URL = 'http://localhost:3000/api/attendance';

    // 1. POST /api/attendance/check (Success)
    console.log('\n1. Testing POST /api/attendance/check (Success)');
    const res1 = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('Response:', JSON.stringify(data1, null, 2));

    // 2. User Credits 증가 확인
    const userAfter = await User.findByPk(userId);
    console.log('\n2. Verifying User Credits incremented by 10');
    console.log(`Credits after: ${userAfter.credits}`);
    if (userAfter.credits === user.credits + 10) {
      console.log('Result: PASS');
    } else {
      console.log('Result: FAIL');
    }

    // 3. CreditTransaction 기록 확인
    console.log('\n3. Verifying CreditTransaction record');
    const transaction = await CreditTransaction.findOne({
      where: { userId, referenceType: 'ATTENDANCE' },
      order: [['createdAt', 'DESC']]
    });
    if (transaction && transaction.amount === 10) {
      console.log('Result: PASS (Record found with amount 10)');
    } else {
      console.log('Result: FAIL');
    }

    // 4. POST /api/attendance/check (Duplicate)
    console.log('\n4. Testing POST /api/attendance/check (Duplicate)');
    const res4 = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data4 = await res4.json();
    console.log('Status:', res4.status);
    console.log('Message:', data4.message);
    if (res4.status === 409) {
      console.log('Result: PASS');
    } else {
      console.log('Result: FAIL');
    }

    // 5. 중복 출석 시 크레딧 추가 증가 여부 확인
    const userFinal = await User.findByPk(userId);
    console.log('\n5. Verifying no extra credits on duplicate');
    if (userFinal.credits === userAfter.credits) {
      console.log('Result: PASS');
    } else {
      console.log('Result: FAIL');
    }

    // 6. GET /api/attendance/today/:userId
    console.log('\n6. Testing GET /api/attendance/today/:userId');
    const res6 = await fetch(`${BASE_URL}/today/${userId}`);
    const data6 = await res6.json();
    console.log('Status:', res6.status);
    console.log('isAttended:', data6.data.isAttended);

    // 7. GET /api/attendance/history/:userId
    console.log('\n7. Testing GET /api/attendance/history/:userId');
    const res7 = await fetch(`${BASE_URL}/history/${userId}`);
    const data7 = await res7.json();
    console.log('History count:', data7.data.length);

    // 8. 스트릭 테스트를 위한 과거 데이터 삽입
    console.log('\n8. Inserting past attendance for streak test');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    await Attendance.findOrCreate({
      where: { userId, attendanceDate: yesterday.toISOString().split('T')[0] },
      defaults: { pointsEarned: 10 }
    });
    await Attendance.findOrCreate({
      where: { userId, attendanceDate: dayBeforeYesterday.toISOString().split('T')[0] },
      defaults: { pointsEarned: 10 }
    });

    // 9. GET /api/attendance/streak/:userId
    console.log('\n9. Testing GET /api/attendance/streak/:userId (Expected: 3)');
    const res9 = await fetch(`${BASE_URL}/streak/${userId}`);
    const data9 = await res9.json();
    console.log('Streak:', data9.data.streak);

    // 10. 존재하지 않는 유저 (404)
    console.log('\n10. Testing POST /api/attendance/check (Invalid userId)');
    const res10 = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 9999 })
    });
    console.log('Status:', res10.status);

    console.log('\n--- Attendance API Validation Completed ---');
  } catch (err) {
    console.error('Validation failed:', err);
  }
}

runTests();
