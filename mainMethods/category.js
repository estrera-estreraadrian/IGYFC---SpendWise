import { store, createId } from "../data/memory.js"
import { apiError } from "../utility/apiError.js"
import { requireEnum, requireText, requireAmount, optionalDate, requireContext } from "../utility/validation.js"
//Barely working, add like a BUNCH of error handler BS here
export function createCategory(userId, input) {
    const name = requireText(input.name, "Category Name", 60);
    const type = requireEnum(input.type, ["INCOME", "EXPENSE"], "Category Type");

    const newCategory = {
        id: createId(),
        userId: userId,
        name: name,
        type: type,
        createdAt: new Date().toISOString()
    };
    return store.insert("categories", newCategory);
}
export function listCategories(userId) {
    const categories = store.getAll("categories");
    const result = [];
    for (const category of categories) {
        if (category.userId === userId) {
            result.push(category);
        }
    }
    return result;
}
function findOwnedCategory(userId, categoryId, type) {
    const category = store.findById("categories", categoryId);
    if (!category || category.userId !== userId) {
        throw new apiError(404, "Category not found");
    }
    return category;
}
export function updateCategory(userId, categoryId, input) {
    const category = findOwnedCategory(userId, categoryId);
    if (!category) {
        throw new apiError(404, 'Category Missing');
    }
    const changes = {}
    if (input.name !== undefined) {
        changes.name = requireText(input.name, "Category Name", 60);
    }
    if (input.type !== undefined) {
        changes.type = requireEnum(input.type, ["INCOME", "EXPENSE"], "Category Type");
    }
    return store.update("categories", categoryId, changes);
}

export function deleteCategory(userId, categoryId) {
    const category = findOwnedCategory(userId, categoryId);
    if (!category) {
        throw new apiError(404, 'Category Missing');
    }
    const transactions = store.getAll("transactions");
    const inUse = transactions.some(function (transaction) {
        return transaction.userId === userId && transaction.categoryId === categoryId;
    });
    if (inUse) {
        throw new apiError(409, "Category is in use");
    }
    return store.delete("categories", categoryId);
}