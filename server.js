const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Middleware to ensure numeric IDs and auto-increment behavior
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
        const db = router.db; // Get the lowdb instance
        const collectionName = req.path.split('/')[1];
        const collection = db.get(collectionName);

        if (collection) {
            // Find the maximum numeric ID in the collection
            const maxId = collection
                .map((item) => parseInt(item.id, 10))
                .filter((id) => !isNaN(id))
                .max()
                .value();

            // Increment the ID for the new record
            req.body.id = maxId ? maxId + 1 : 1;
        }
    }
    next();
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running on http://localhost:3000');
});