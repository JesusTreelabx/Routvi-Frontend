const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(process.cwd(), 'data', 'menu.json');

function readData() {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getMenu() {
    return readData().menu;
}

function saveMenu(menu) {
    writeData({ menu });
}

// 1. Create a dummy product
console.log("Adding dummy product...");
const menu = getMenu();
const catIndex = menu.findIndex(c => c.id === 'cat_pizzas'); // Assuming cat_pizzas exists
if (catIndex === -1) {
    console.error("Category not found");
    process.exit(1);
}

const newId = "debug_" + Date.now();
menu[catIndex].products.push({
    id: newId,
    name: "Debug Pizza",
    price: "100"
});
saveMenu(menu);
console.log(`Added product ${newId}`);

// Verify it's in the file
const menuAfterAdd = getMenu();
const addedProduct = menuAfterAdd.find(c => c.id === 'cat_pizzas').products.find(p => p.id === newId);
if (!addedProduct) {
    console.error("Product failed to persist after add!");
    process.exit(1);
}
console.log("Verified product exists in file.");

// 2. Delete it
console.log(`Deleting product ${newId}...`);
const menuToDelete = getMenu();
let deleted = false;
for (const category of menuToDelete) {
    const index = category.products.findIndex(p => p.id === newId);
    if (index !== -1) {
        category.products.splice(index, 1);
        deleted = true;
        break;
    }
}

if (deleted) {
    saveMenu(menuToDelete);
    console.log("Saved menu after delete.");
} else {
    console.error("Could not find product to delete in memory!");
    process.exit(1);
}

// 3. Verify deletion
const menuAfterDelete = getMenu();
const deletedProduct = menuAfterDelete.find(c => c.id === 'cat_pizzas').products.find(p => p.id === newId);

if (deletedProduct) {
    console.error("Product STILL EXISTS in file after delete!");
    console.log("File content snippet:", JSON.stringify(menuAfterDelete.find(c => c.id === 'cat_pizzas').products, null, 2));
} else {
    console.log("SUCCESS: Product was deleted and change persisted.");
}
