import { store, createId } from "../data/memory.js"
import { apiError } from "../utility/apiError.js"
import { requireEnum, requireText, requireAmount, optionalDate, requireContext } from "../utility/validation.js"
//Barely working, add like a BUNCH of error handler BS here
function findOwnedCategory(userId, categoryId, type) {
    const category = store.findById("categories", categoryId);

    return category;
}

export function listCategories(userId) {
    const categories = store.getAll("categories");
    const result = [];
    for (category of categories) {
        if (category.userId === userId) {
            result.push(category);
        }
    }
    return result;
}

export function createCategory(userId, input) {
    const newCategory = {
        id: createId(),
        userId: userId,
        name: input.name,
        type: input.type,
        createdAt: new Date().toISOString()
    };
    return store.insert("categories", newCategory);
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
    return store.update("categories", categoryId, updatedCategory);
}

export function deleteCategory(userId, categoryId) {
    const category = findOwnedCategory(userId, categoryId);
    if (!category) {
        throw new apiError(404, 'Category Missing');
    }
    return store.delete("categories", categoryId);
}