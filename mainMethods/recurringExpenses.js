import { store, createId } from "../data/memory.js";
import { apiError } from "../utility/apiError.js";
import { createTransaction, updateTransaction, deleteTransaction, listTransactions } from "../mainMethods/transaction.js";
//Barebones, Doesn't Work, Don't make a test, Do Last
//Find Date Import Utlity BS or make one, else how tf do we recur this
export function createRecurringExpenses(userId, input) {

}
export function listRecurringExpenses(userId) {
    const recurringExpenses = store.getAll("recurringExpenses");
    const result = [];
    for (const recurringExpense of recurringExpenses) {
        if (recurringExpense.userId === userId) {
            result.push(recurringExpense);
        }
    }
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

}
export function deleteRecurringExpense(userId, recurringExpenseId) {
    const recurringExpense = findOwnedRecurringExpense(userId, recurringExpenseId);
    if (!recurringExpense) {
        throw new apiError(404, 'Recurring Expense Missing');
    }
    return store.delete("recurringExpenses", recurringExpenseId);
}