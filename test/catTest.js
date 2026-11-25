import test from "node:test";
import assert from "node:assert/strict";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../mainMethods/category.js";

const USER = "user1";
const OTHER_USER = "user2";
const DATE = "2024-01-01T00:00:00.000Z";
const userId = USER;

test("listCategories returns only the requested user categories", function () {
    createCategory(
        USER, {
        name: "Food",
        type: "EXPENSE"
    }
    );
    createCategory(
        OTHER_USER, {
        name: "Salary",
        type: "INCOME"
    }
    );
    assert.equal(listCategories(USER).length, 1);
    assert.equal(listCategories(USER)[0].name, "Food");
});
test("createCategory creates a valid category", function () {
    const result = createCategory(
        USER, {
        name: "Salary",
        type: "INCOME"

    }
    );
    assert.equal(result.name, "Salary");
    assert.equal(result.type, "INCOME");
    assert.ok(result.id);
});
test("createCategory rejects duplicate category names of the same type", function () {
    createCategory(USER, { name: "Food", type: "EXPENSE" });
    assert.throws(function () {
        return createCategory(
            USER, {
            name: "food",
            type: "EXPENSE"
        }
        );
    }, /already exists/);
});
test("updateCategory updates an owned category (like owned by the current user)", function () {
    const item = createCategory(USER, {
        name: "Food",
        type: "EXPENSE"
    }
    );
    assert.equal(updateCategory(
        USER, item.id, {
        name: "Groceries"
    }
    ).name, "Groceries");
});
test("updateCategory rejects another user category (tldr wla sa ila)", function () {
    const item = createCategory(
        OTHER_USER, {
        name: "Food",
        type: "EXPENSE"
    }
    );
    assert.throws(function () {
        return updateCategory(USER, item.id, { name: "Mine" });
    }, /Category not found/);
}
);
test("deleteCategory removes category succesfully (must be unused)", function () {
    const item = createCategory(
        USER, {
        name: "Food",
        type: "EXPENSE"
    }
    );
    deleteCategory(USER, item.id);
    assert.equal(listCategories(USER).some(function (category) {
        return category.id === item.id;
    }), false);
});
test("deleteCategory rejects when category being used", async function () {
    const { createTransaction } = await import("../mainMethods/transaction.js");
    const item = createCategory(USER, { name: "Food", type: "EXPENSE" });
    createTransaction(
        USER, {
        type: "EXPENSE",
        amount: 10,
        description: "Test",
        categoryId: item.id
    }
    );
    assert.throws(function () { return deleteCategory(USER, item.id); }, /in use/);
});
