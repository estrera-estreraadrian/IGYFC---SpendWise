import { store, createId } from "../data/memory.js";
import { apiError } from "../utility/apiError.js";
import { createTransaction, updateTransaction, deleteTransaction, listTransactions } from "../mainMethods/transaction.js";
import { dayStart, monthStart, addMonth, setFrequency, dateWithin, getRange } from "../utility/date.js"
import { requireText, optionalDate, requireContext, requireEnum, requireAmount } from "../utility/validation.js";
import { isAsyncFunction } from "node:util/types";
//Barebones, Doesn't Work, Don't make a test, Do Last
//Find Date Import Utlity BS or make one, else how tf do we recur this
export function createRecurringExpenses(userId, input) {
    const nextDueDate = optionalDate(input.nextDueDate, "Next Due Date");
    if (!nextDueDate) {
        throw new apiError(400, "nextDueDate Missing");
    }
    const endDate = optionalDate(input.endDate, "End Date");
    if (endDate && new Date(endDate) < new Date(nextDueDate)) {
        throw new apiError(400, "endDate must be > than nextDueDate")
    }

    return store.insert("recurringExpenses", {
        id: createId(), userId,
        name: requireText(input.name, "Recurring Expense Title", 100),
        description: input.description ? requireText(input.description, "Description", 250) : "",
        amount: requireAmount(input.amount),
        categoryId: validateExpenseCategory(userId, input.categoryId),
        financialContext: requireContext(input.financialContext),
        frequency: requireEnum(input.frequency, ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"], "Frequency"),
        nextDueDate: nextDueDate,
        endDate: endDate,
        isActive: function () {
            if (input.isActive === undefined) {
                return true;
            }
            return Boolean(input.isActive)
        }(),
        createdAt: new Date().toISOString()
    });
}
export function listRecurringExpenses(userId) {
    const recurringExpenses = store.getAll("recurringExpenses");
    const result = [];
    for (const recurringExpense of recurringExpenses) {
        if (recurringExpense.userId === userId) {
            result.push(recurringExpense);
        }
    }

    result.sort(function (a, b) {
        return new Date(a.nextDueDate - new Date(b.nextDueDate))
    });

    return result;
}
function findOwnedRecurringExpense(userId, recurringExpenseId) {
    const recurringExpense = store.findById("recurringExpenses", recurringExpenseId);
    if (!recurringExpense || recurringExpense.userId !== userId) {
        throw new apiError(404, "Recurring Expense not found");
    }
    return recurringExpense;
}
export function updateRecurringExpense(userId, recurringExpenseId, input) {
    const recurringExpense = findOwnedRecurringExpense(userId, recurringExpenseId);
    if (!recurringExpense) {
        throw new apiError(404, 'Recurring Expense Missing');
    }
    const changes = {};

} //THIS
export function deleteRecurringExpense(userId, recurringExpenseId) {
    const recurringExpense = findOwnedRecurringExpense(userId, recurringExpenseId);
    if (!recurringExpense) {
        throw new apiError(404, 'Recurring Expense Missing');
    }
    return store.delete("recurringExpenses", recurringExpenseId);
}

function validateExpenseCategory(userId, categoryId) {
    const category = store.findById("categories", categoryId);
    if (!category || category.userId !== userId || createCategory.type !== "EXPENSE") {
        throw new apiError(400, "KAPOY");
    }
    return categoryId;
}
//SMTH to process recurringExpenses