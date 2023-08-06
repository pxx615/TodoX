export default (db) => {
    const { TODO_COLLECTION } = process.env;
    const collection = db.collection(TODO_COLLECTION);

    async function insertOne(todo) {
        return await collection.insertOne(todo);
    }

    async function find(userID) {
        return await collection.find({ userID }).sort({ created: 1 }).toArray();
    }

    async function deleteOne(todoID) {
        return await collection.deleteOne({ todoID });
    }

    async function updateOne(todoID, value) {
        return await collection.updateOne({ todoID }, {
            $set: {
                name: value.name,
                status: value.status
            }
        });
    }

    return { 
        insertOne, 
        find, 
        deleteOne, 
        updateOne 
    };
};