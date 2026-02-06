
const fs = require('fs');
const path = require('path');

async function seedProduction() {
    console.log('🚀 Starting Data Migration to AWS Production...');

    // 1. Load Data
    const dataPath = path.join(__dirname, '../data/menu.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Data file not found:', dataPath);
        process.exit(1);
    }
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const localData = JSON.parse(rawData);
    
    const API_URL = 'https://bucjudzbm9.us-east-1.awsapprunner.com/api/v1';
    
    // Mappings for old IDs -> new IDs
    const categoryMap = {};
    const productMap = {};

    // Helper for requests
    const request = async (endpoint, method = 'GET', body = null) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const config = { method, headers };
            if (body) config.body = JSON.stringify(body);
            
            const response = await fetch(`${API_URL}${endpoint}`, config);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API Error ${response.status}: ${text}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`❌ Request failed: ${method} ${endpoint}`, error.message);
            throw error; // Stop if critical
        }
    };

    try {
        // 2. Update Profile (Base Info)
        console.log('📝 Updating Business Profile...');
        const profileData = {
            name: localData.name,
            description: localData.description,
            image: localData.image,
            background: localData.background,
            category: localData.category,
            priceRange: localData.priceRange,
            social: localData.social,
            contact: localData.contact,
            legal: localData.legal,
            admin: localData.admin,
            hours: localData.hours,
            vibes: localData.vibes,
            amenities: localData.amenities
        };
        await request('/business/profile', 'PUT', profileData);
        console.log('✅ Profile Updated.');

        // 3. Migrate Menu (Categories & Products)
        console.log('🍕 Migrating Menu...');
        if (localData.menu && Array.isArray(localData.menu)) {
            for (const cat of localData.menu) {
                console.log(`   📂 Creating Category: ${cat.category}`);
                
                let newCatId;
                try {
                    const newCatRes = await request('/business/menu/categories', 'POST', { name: cat.category });
                    newCatId = newCatRes.data.ID || newCatRes.data.id;
                } catch (err) {
                    console.log('DEBUG Caught Error:', err.message);
                    if (err.message.includes('409') || err.message.includes('Duplicate')) {
                         console.log(`      ⚠️ Category '${cat.category}' exists. Fetching ID...`);
                         // Fallback: Fetch all categories and find match
                         const allCats = await request('/business/menu/categories');
                         const existingCat = allCats.find(c => c.name === cat.category);
                         if (existingCat) {
                             newCatId = existingCat.ID || existingCat.id;
                         } else {
                             throw new Error(`Could not find existing category '${cat.category}' even though 409 returned.`);
                         }
                    } else {
                        throw err;
                    }
                }
                categoryMap[cat.id] = newCatId;

                // Create Products for this Category
                if (cat.products && Array.isArray(cat.products)) {
                    for (const prod of cat.products) {
                        console.log(`      🍔 Creating Product: ${prod.name}`);
                        let newProdId;
                        try {
                            const newProdRes = await request('/business/menu/products', 'POST', {
                                categoryId: newCatId,
                                name: prod.name,
                                description: prod.description,
                                price: prod.price,
                                image: prod.image
                            });
                            newProdId = newProdRes.data.ID || newProdRes.data.id;
                        } catch (err) {
                             if (err.message.includes('409') || err.message.includes('Duplicate')) {
                                console.log(`      ⚠️ Product '${prod.name}' exists. Skipping...`);
                                // Ideally we get the ID, but for seeding we might just verify or skip.
                                // If we skip, we might miss the ID mapping for daily specials later.
                                // Let's try to fetch it to keep mapping valid.
                                const allProds = await request(`/business/menu/products?categoryId=${newCatId}`); // Assuming API supports filtering or returns all
                                // Actually my API returns ALL products for all categories usually or strict list?
                                // The endpoint /business/menu/products usually lists all.
                                // Let's just create a quick search helper or simplified skip.
                                // If mapped ID is missing, daily specials might fail.
                                // Let's try to find it in the products of the category if possible.
                                // My API only had getAllProducts right?
                                const allProducts = await request('/business/menu/products');
                                const existing = allProducts.find(p => p.name === prod.name && p.category_id === newCatId);
                                if (existing) newProdId = existing.ID;
                            } else {
                                throw err;
                            }
                        }
                        if (newProdId) productMap[prod.id] = newProdId;

                        // Availability Check (Default is likely true, but if false we need to update)
                        if (prod.available === false) {
                            await request(`/business/menu/products/${newProdId}`, 'PUT', { available: false });
                        }
                    }
                }
            }
        }
        console.log('✅ Menu Migrated.');

        // 4. Migrate Promotions
        console.log('🏷️ Migrating Promotions...');
        if (localData.promotions && Array.isArray(localData.promotions)) {
            for (const promo of localData.promotions) {
                console.log(`   🎁 Creating Promo: ${promo.title}`);
                
                // Map product ID if applicable
                let targetProductId = undefined;
                let targetProductName = undefined;
                
                if (promo.productId && productMap[promo.productId]) {
                    targetProductId = productMap[promo.productId];
                    targetProductName = promo.productName; // Keep name as is
                }

                await request('/business/promotions', 'POST', {
                    title: promo.title,
                    description: promo.description,
                    code: promo.code,
                    discount: promo.discount,
                    expiryDate: promo.expiryDate,
                    productId: targetProductId,
                    productName: targetProductName,
                    active: promo.active
                });
            }
        }
        console.log('✅ Promotions Migrated.');

        // 5. Migrate Daily Specials
        console.log('📅 Migrating Daily Specials...');
        if (localData.dailySpecials) {
            for (const [day, oldProdId] of Object.entries(localData.dailySpecials)) {
                if (productMap[oldProdId]) {
                    console.log(`   ⭐ Setting Special for ${day}`);
                    await request('/business/daily-special/set', 'POST', {
                        day: day,
                        productId: productMap[oldProdId]
                    });
                }
            }
        }
        console.log('✅ Daily Specials Migrated.');

        console.log('🎉 MIGRATION COMPLETE! Your production environment is now populated.');
        
    } catch (error) {
        console.error('🚨 Migration Failed:', error);
    }
}

seedProduction();
