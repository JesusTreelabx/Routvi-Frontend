#!/usr/bin/env node

// Quick test script to verify promotions API
const API_BASE = 'https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1';

async function testPromotionsAPI() {
    console.log('🧪 Testing Promotions API...\n');
    
    // Test 1: GET all promotions
    console.log('1️⃣ Testing GET /business/promotions');
    try {
        const getRes = await fetch(`${API_BASE}/business/promotions`);
        console.log(`   Status: ${getRes.status} ${getRes.statusText}`);
        const getData = await getRes.json();
        console.log(`   Response:`, JSON.stringify(getData, null, 2));
        
        if (Array.isArray(getData)) {
            console.log(`   ✅ Found ${getData.length} promotions`);
        } else {
            console.log(`   ⚠️  Response is not an array`);
        }
    } catch (error) {
        console.log(`   ❌ Error:`, error.message);
    }
    
    console.log('\n');
    
    // Test 2: POST create a test promotion
    console.log('2️⃣ Testing POST /business/promotions');
    const testPromo = {
        title: 'API Test Promo',
        description: 'Testing from script',
        code: 'APITEST',
        discount: '15%',
        expiryDate: '2026-12-31',
        productId: null,
        productName: null,
        active: true
    };
    
    try {
        const postRes = await fetch(`${API_BASE}/business/promotions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPromo)
        });
        console.log(`   Status: ${postRes.status} ${postRes.statusText}`);
        const postData = await postRes.json();
        console.log(`   Response:`, JSON.stringify(postData, null, 2));
        
        if (postRes.ok) {
            console.log(`   ✅ Promotion created successfully`);
        }
    } catch (error) {
        console.log(`   ❌ Error:`, error.message);
    }
    
    console.log('\n');
    
    // Test 3: GET again to verify it was saved
    console.log('3️⃣ Testing GET again after POST');
    try {
        const getRes2 = await fetch(`${API_BASE}/business/promotions`);
        console.log(`   Status: ${getRes2.status} ${getRes2.statusText}`);
        const getData2 = await getRes2.json();
        
        if (Array.isArray(getData2)) {
            console.log(`   ✅ Found ${getData2.length} promotions total`);
            const testPromos = getData2.filter(p => p.code === 'APITEST');
            console.log(`   📊 APITEST promotions: ${testPromos.length}`);
        }
    } catch (error) {
        console.log(`   ❌ Error:`, error.message);
    }
}

testPromotionsAPI().catch(console.error);
