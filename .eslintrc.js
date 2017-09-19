module.exports = {
    extends: 'airbnb',
    rules: {
        semi: [2, 'never']
    },
    globals: {
        describe: true,
        it: true,
        before: true,
        after: true,
        beforeEach: true,
        afterEach: true,
    },
    parser: 'babel-eslint'
}
