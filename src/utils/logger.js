exports.info = (msg, meta = {}) => {
    console.log('ℹ️', msg, meta);
};

exports.error = (msg, meta = {}) => {
    console.error('❌', msg, meta);
};