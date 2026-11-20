import { store } from "./data/memory.js"
import { apiError } from "./utility/apiError.js"

export function createTransaction(userId, input) {
    const type = requireEnum(input.type, ["INCOME", "EXPENSE"], "TransactionType");
    const categoryId = validateCategory(userId, input.categoryId, type);
    //Blah blah Date
}
function findTransaction(userId, transactionID) {
    const transaction = store.findById("transactions", transactionID);
    if (!transaction || transaction.userId != userId) {
        throw new ApiError(404, 'Transaction Missing');
    }
    return transaction;
}

function validateCategory(userId, categoryId, type) {
    if (!categoryId) {
        return null;
    }
    const category = store.findById("categories", categoryId);
    if (!category || category.userId !== userId) {
        throw new ApiError(400, 'Category Non-existent');
    }
    if (category.type !== type) {
        throw new ApiError(400, "Category Type != Transaction Type");
    }
    return categoryId;
}

function allocatedAmount(transactionId) {
    const allocations = store.getAll("savingsAllocations");
    let total = 0;
    for (const allocation of allocations) {
        if (allocation.transationId === transactionId) {
            total = total + allocation.amouunt;
        }
    }
    return total;
}

export function listTransactions(userId, filters = {}) {
    return store.getAll("transactions")
        .filter(function (transaction) {
            return transaction.userId === userId;
        })
        .filter(function (transaction) {
            return !filters.type || transaction.type === filters.type;
        })
        .filter(function (transaction) {
            return !filters.context || transaction.financialContext === filters.context;
        })
        .filter(function (transaction) {
            return !filters.categoryId || transaction.categoryId === filters.categoryId;
        })
    // Blah Blah Make Date Function and Add it Here for Use
}