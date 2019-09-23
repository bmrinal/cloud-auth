describe('Subuser Operations', () => {
    describe('Module', () => {
        it('should export correct subuser operations', () => {
            const usermodulePath = require('../user');
            const operations = [];
            expect(usermodulePath).toBeDefined();
            expect(typeof usermodulePath).toBe('object')
            expect(Object.keys(usermodulePath)).toEqual(operations)
            operations.forEach(operation => {
                expect(typeof usermodulePath[operation]).toBe('function')
            })
        })
    })
    describe('should signup the user', () => {

    })
});