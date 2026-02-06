const menuData = require('../data/menu.json');

const API_BASE = 'https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1';

async function request(path, method = 'GET', body = null) {
    const url = `${API_BASE}${path}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
}

async function main() {
    console.log('🔄 RESEED SCRIPT - Will delete and recreate all products with images');
    console.log('');
    
    // Step 1: Get all current products
    console.log('📥 Fetching current products...');
    const currentProducts = await request('/business/menu/products');
    console.log(`   Found ${currentProducts.length} products`);
    
    // Step 2: Delete all products
    console.log('🗑️  Deleting old products...');
    for (const prod of currentProducts) {
        try {
            await request(`/business/menu/products/${prod.ID}`, 'DELETE');
            console.log(`   ✓ Deleted: ${prod.name}`);
        } catch (err) {
            console.log(`   ⚠️  Could not delete ${prod.name}: ${err.message}`);
        }
    }
    
    // Step 3: Get current categories
    console.log('');
    console.log('📥 Fetching categories...');
    const currentCategories = await request('/business/menu/categories');
    console.log(`   Found ${currentCategories.length} categories`);
    
    // Create a map: category name -> category ID
    const categoryMap = {};
    for (const cat of currentCategories) {
        categoryMap[cat.name] = cat.ID;
    }
    
    // Step 4: Create products from menu.json with FULL data
    console.log('');
    console.log('➕ Creating products with images and descriptions...');
    let created = 0;
    let skipped = 0;
    
    for (const category of menuData.menu) {
        const categoryId = categoryMap[category.category];
        
        if (!categoryId) {
            console.log(`   ⚠️  Category "${category.category}" not found in backend, skipping...`);
            continue;
        }
        
        console.log(`\n   📁 Category: ${category.category} (${categoryId})`);
        
        for (const product of category.products) {
            try {
                // Parse price: "$149" -> 149
                let numericPrice = product.price;
                if (typeof numericPrice === 'string') {
                    numericPrice = parseFloat(numericPrice.replace(/[^0-9.]/g, ''));
                }
                
                const newProduct = await request('/business/menu/products', 'POST', {
                    categoryId: categoryId,
                    name: product.name,
                    description: product.description || '',
                    price: numericPrice,
                    image: product.image || '',
                    is_available: product.available !== undefined ? product.available : true
                });
                
                console.log(`      ✅ Created: ${product.name}`);
                console.log(`         Image: ${product.image ? '✓' : '✗'}`);
                console.log(`         Description: ${product.description ? '✓' : '✗'}`);
                created++;
            } catch (err) {
                console.log(`      ❌ Failed to create ${product.name}: ${err.message}`);
                skipped++;
            }
        }
    }
    
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Created: ${created} products`);
    console.log(`⚠️  Skipped: ${skipped} products`);
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🎉 RESEED COMPLETE! Check your frontend now.');
}

main().catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
});
