const BASE_URL = 'http://localhost:3000/api/products';

async function runTests() {
  console.log('--- Starting API Validation (using fetch) ---');

  try {
    // 1. GET /api/products (Initial)
    console.log('\n1. Testing GET /api/products (Initial)');
    const res1 = await fetch(BASE_URL);
    const data1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('Data:', JSON.stringify(data1, null, 2));

    // 2. POST /api/products (Success)
    console.log('\n2. Testing POST /api/products (Success)');
    const res2 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Item',
        description: 'Test Description',
        creditPrice: 100,
        sellerId: 1
      })
    });
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Created ID:', data2.data.id);
    const productId = data2.data.id;

    // 3. POST /api/products (Invalid sellerId)
    console.log('\n3. Testing POST /api/products (Invalid sellerId)');
    const res3 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Ghost Item',
        creditPrice: 200,
        sellerId: 999
      })
    });
    const data3 = await res3.json();
    console.log('Status:', res3.status);
    console.log('Message:', data3.message);

    // 4. POST /api/products (Missing title)
    console.log('\n4. Testing POST /api/products (Missing title)');
    const res4 = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creditPrice: 300,
        sellerId: 1
      })
    });
    const data4 = await res4.json();
    console.log('Status:', res4.status);
    console.log('Message:', data4.message);

    // 5. GET /api/products/:id (Detail)
    console.log('\n5. Testing GET /api/products/:id');
    const res5 = await fetch(`${BASE_URL}/${productId}`);
    const data5 = await res5.json();
    console.log('Status:', res5.status);
    console.log('Title:', data5.data.title);

    // 6. PUT /api/products/:id (Update)
    console.log('\n6. Testing PUT /api/products/:id');
    const res6 = await fetch(`${BASE_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated Item',
        status: 'SOLD'
      })
    });
    const data6 = await res6.json();
    console.log('Status:', res6.status);
    console.log('Updated Status:', data6.data.status);

    // 7. GET /api/products (After Update - should be empty if SOLD)
    console.log('\n7. Testing GET /api/products (After Update to SOLD)');
    const res7 = await fetch(BASE_URL);
    const data7 = await res7.json();
    console.log('List count:', data7.data.length);

    // 8. DELETE /api/products/:id
    console.log('\n8. Testing DELETE /api/products/:id');
    const res8 = await fetch(`${BASE_URL}/${productId}`, { method: 'DELETE' });
    const data8 = await res8.json();
    console.log('Status:', res8.status);
    console.log('Message:', data8.message);

    // 9. GET /api/products/:id (After Delete)
    console.log('\n9. Testing GET /api/products/:id (After Delete)');
    const res9 = await fetch(`${BASE_URL}/${productId}`);
    const data9 = await res9.json();
    console.log('Status:', res9.status);
    console.log('Message:', data9.message);

    console.log('\n--- API Validation Completed Successfully ---');
  } catch (error) {
    console.error('\n--- API Validation Failed ---');
    console.error(error.message);
  }
}

runTests();
