var dummy_assign = function() {
    app.dummy_var = 'dummy_value';
}

var dummy_sub_function = require('./sub_index');

module.exports = Object.assign({dummy_assign}, dummy_sub_function);