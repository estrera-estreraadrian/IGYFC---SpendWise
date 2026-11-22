//IMPORT EVERYTHING
//CRUUUUUUUUUUUUUUUUUUUD
export function createXXX(userId, input) {
    //Idk whatevers reqipred
}
export function listXXX(userId) {
    const xxx = store.getAll("xxxs");
    const result = [];
    for (const item of xxx) {
        if (item.userId === userId) {
            result.push(item);
        }
    }
    return result;
}
function findOwnedXXX(userId, XXXId) {
    const xxx = store.findById("xxxs", XXXId);
    if (!xxx || xxx.userId !== userId) {
        throw new apiError(404, "XXX not found");
    }
    return xxx;
}
export function updateXXX(userId, XXXId, input) {
    const xxx = findOwnedXXX(userId, XXXId);
    if (!xxx) {
        throw new apiError(404, 'XXX Missing');
    }
    const changes = {}
    //Blah blah if inputs are wrong take validation requirements
    return store.update("xxxs", XXXId, changes);
}
export function deleteXXX(userId, XXXId) {
    const xxx = findOwnedXXX(userId, XXXId);
    if (!xxx) {
        throw new apiError(404, 'XXX Missing');
    }

    return store.delete("xxxs", XXXId);
}