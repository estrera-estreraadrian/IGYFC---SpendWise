import { store, createId } from "../data/memory.js"
import { apiError } from "../utility/apiError.js"
import { requireEnum, requireText, requireAmount, optionalDate, requireContext } from "../utility/validation.js";

export function createTransaction(userId, input) {
    console.log("TESITA(JAWFA");
    console.log("CATtt:" + input.categoryId);
    const type = requireEnum(input.type, ["INCOME", "EXPENSE"], "TransactionType");
    const categoryId = validateCategory(userId, input.categoryId, type);
    const date = optionalDate(input.date, "Transaction Date") || new Date().toISOString();

    return store.insert("transactions", {
        id: createId(),
        userId,
        type,
        amount: requireAmount(input.amount),
        description: requireText(input.description ?? "", "Description", 250),
        categoryId,
        financialContext: requireContext(input.financialContext),
        date,
        recurringExpenseId: null,
        createdAt: new Date().toISOString()
    });
}
export function listTransactions(userId, filters = {}) {
    const transactions = store.getAll("transactions");
    const result = [];

    for (const transaction of transactions) {
        if (transaction.userId !== userId) {
            continue;
        }
        if (filters.type && transaction.type !== filters.type) {
            continue;
        }
        if (filters.context && transaction.financialContext !== filters.context) {
            continue;
        }
        if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
            continue;
        }
        if (filters.startDate) {
            if (new Date(transaction.date) < new Date(filters.startDate)) {
                continue;
            }
        }
        if (filters.endDate) {
            if (new Date(transaction.date) > new Date(filters.endDate)) {
                continue;
            }
        }
        result.push(transaction);
    }
    result.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    return result;
}
function findOwnedTransaction(userId, transactionID) {
    const transaction = store.findById("transactions", transactionID);
    if (!transaction || transaction.userId != userId) {
        throw new apiError(404, "Transaction Missing");
    }
    return transaction;
}
export function updateTransaction(userId, transactionId, input) {
    const transaction = findOwnedTransaction(userId, transactionId);
    if (!transaction) {
        throw new apiError(404, 'Transaction Missing');
    }
    const changes = {};

    if (input.type !== undefined) {
        changes.type = requireEnum(input.type, ["INCOME", "EXPENSE"], "TransactionType");
    }
    if (input.amount !== undefined) {
        changes.amount = requireAmount(input.amount);
    }
    if (input.description !== undefined) {
        changes.description = requireText(input.description ?? "", "Description", 250);
    }
    if (input.categoryId !== undefined) {
        changes.categoryId = validateCategory(userId, input.categoryId, changes.type || transaction.type);
    } else if (changes.type && transaction.categoryId) {
        changes.categoryId = transaction.categoryId;
    }
    if (input.financialContext !== undefined) {
        changes.financialContext = requireContext(input.financialContext);
    }
    if (input.date !== undefined) {
        changes.date = optionalDate(input.date, "Transaction Date") || new Date().toISOString();
    }
    // Allocated Amount needs to be fixed after this like REALLY needs to be fixed I think
    return store.update("transactions", transactionId, changes);
}
export function deleteTransaction(userId, transactionId) {
    //Probably check if it exists first
    findOwnedTransaction(userId, transactionId);
    if (allocatedAmount(transactionId) > 0) {
        throw new apiError(409, "Remove allocation first");
    }
    store.delete("transactions", transactionId);
}

function validateCategory(userId, categoryId, type) {
    console.log("VALDIAIFJAWIFJAFAO");
    if (!categoryId) {
        console.log("Mr Error Sir?");
        return null;
    }
    const category = store.findById("categories", categoryId);
    console.log("A:" + category);
    console.log("B:" + type);
    console.log("C:" + category.type);
    if (!category || category.userId !== userId) {
        throw new apiError(400, "Category Non-existent");
    }
    if (category.type !== type) {
        throw new apiError(400, "Category Type != Transaction Type");
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