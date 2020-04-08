const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sistema_aluguel_festa', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}); 

mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
  });
function setRunValidators() {
    this.setOptions({ runValidators: true });
}

module.exports = mongoose;