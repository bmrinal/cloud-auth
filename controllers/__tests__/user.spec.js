describe('User Operations', () => {
    describe('Module', () => {
        it('should export correct user operations', () => {
            const usermodulePath = require('../user');
            const operations = [
                'signup',
                'signin',
                'signout',
                'changePassword',
                'deleteUser'
            ];
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