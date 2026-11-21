import { createTransaction, updateTransaction, deleteTransaction, listTransactions } from "../mainMethods/transaction.js";
import { store, createId } from "../data/memory.js";
import test from "node:test";
import assert from "node:assert/strict";
import { createCategory } from "../mainMethods/category.js";

const USER = "user1";
const OTHER_USER = "user2";
const DATE = "2024-01-01T00:00:00.000Z";
const userId = USER;

test("listTransactions filters by user, type, context, and category", function () {
    const category = createCategory(
        USER, {
        name: "Salary",
        type: "INCOME"
    }
    );
    console.log("CATA:" + category);
    console.log("CATB:" + category.id);
    createTransaction(
        USER, {
        type: "INCOME",
        amount: 100,
        description: "Test Income",
        categoryId: category.id,
        date: DATE
    }
    );

    createTransaction(
        OTHER_USER, {
        type: "INCOME",
        amount: 200,
        description: "Test Income",
        date: DATE
    });
    assert.equal(listTransactions(
        USER, {
        type: "INCOME"
    }
    ).length, 1);

    assert.equal(listTransactions(
        USER, {
        categoryId: category.id
    }).length, 1);
});
test("createTransaction creates a valid income transaction", function () {
    const category = createCategory(
        USER, {
        name: "Salary",
        type: "INCOME"
    }
    );
    const item = createTransaction(
        USER, {
        type: "INCOME",
        amount: 2500,
        description: "Test Income",
        categoryId: category.id,
        date: DATE
    }
    );
    assert.equal(item.amount, 2500);
    assert.equal(item.type, "INCOME");
    assert.equal(item.userId, USER);
});
test("createTransaction rejects a category with a mismatched type", function () {
    const category = createCategory(USER, { name: "Food", type: "EXPENSE" });
    console.log("Changes:" + category.type + " " + "INCOME");
    assert.throws(function () {
        return createTransaction(
            USER, {
            type: "INCOME",
            amount: 10,
            description: "Test Income",
            categoryId: category.id
        }
        );
    }, /Category Type != Transaction Type/);
});
test("updateTransaction updates an owned transaction", function () {
    const item = createTransaction(
        USER, {
        type: "EXPENSE",
        description: "Test Income",
        amount: 100
    }
    );
    assert.equal(updateTransaction(USER, item.id, { amount: 125 }).amount, 125);
});
test("updateTransaction rejects a transaction owned by another user", function () {
    const item = createTransaction(
        OTHER_USER, {
        type: "EXPENSE",
        description: "Test Income",
        amount: 100
    }
    );
    assert.throws(function () {
        return updateTransaction(USER, item.id, { amount: 125 });
    }, /Transaction Missing/);
});
test("deleteTransaction removes an unallocated transaction", function () {
    const item = createTransaction(
        USER, {
        type: "EXPENSE",
        description: "Test Income",
        amount: 100
    }
    );
    deleteTransaction(USER, item.id);
    assert.equal(listTransactions(USER).some(function (transaction) {
        return transaction.id === item.id;
    }), false);
});