import { randomUUID } from "node:crypto";

const collectionNames = [
    "users",
    "categories",
    "transactions",
    "budgetts",
    "savingsGoals",
    "savingsAllocations",
    "recurringExpenses"
];
export function createId() {
    return randomUUID();
}
function createCollection(collectionName) {
    return [collectionName, new Map()];
}
const collections = Object.fromEntries(
    collectionNames.map(createCollection)
)
// Use Above by collection.map(createCollection);
// Create collection by const collection = [ "smth", "transactions" ] whatever
export const store = {
    getAll(collection) {
        const records = [];
        for (const record of collections[collection].values()) {
            records.push(record);
        }
        return records;
    },
    findById(collection, id) {
        return collections[collection].get(id) ?? null;
    },
    insert(collection, record) {
        collections[collection].set(record.id, record);
        return record;
    },
    delete(collection, id) {
        return collections[collection].delete(id);
    },
    reset() {
        for (const collection of collectionNames) {
            collections[collection].clear();
        }
    },
    update(collection, id, newCollection) {
        const current = collections[collection].get(id);
        if (!current) return null;

        const updated = {};

        for (const key in current) {
            updated[key] = current[key]
        }
        for (const key in newCollection) {
            updated[key] = newCollection[key]
        }

        updated.id = current.id;

        collections[collection].set(id, updated);
        return updated;
    }
}