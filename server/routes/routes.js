const controller = require('../controllers/controller')

module.exports = app => {
    app.get('/api/v1/find', controller.find);
    app.get('/api/v1/findTop', controller.findTop);
    app.get('/api/v1/findOne/:id', controller.findOne);
    app.post('/api/v1/create', controller.create);
    app.delete('/api/v1/deleteOne/:id', controller.deleteOne);
    app.delete('/api/v1/deleteAll', controller.deleteAll);
    app.put('/api/v1/updateOne/:id', controller.updateOne);

}