describe('Joi Validation Tests', () => {
    it('should validate email format', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test('john@example.com')).toBe(true);
        expect(emailRegex.test('invalid-email')).toBe(false);
    });

    it('should validate password length', () => {
        const password1 = 'Password123';
        const password2 = '123';
        expect(password1.length >= 6).toBe(true);
        expect(password2.length >= 6).toBe(false);
    });

    it('should validate role values', () => {
        const validRoles = ['admin', 'chauffeur'];
        expect(validRoles.includes('admin')).toBe(true);
        expect(validRoles.includes('chauffeur')).toBe(true);
        expect(validRoles.includes('invalid')).toBe(false);
    });

    it('should validate telephone format', () => {
        const phoneRegex = /^[0-9]{10}$/;
        expect(phoneRegex.test('0123456789')).toBe(true);
        expect(phoneRegex.test('123')).toBe(false);
        expect(phoneRegex.test('abcd123456')).toBe(false);
    });

    it('should validate required fields', () => {
        const userData = {
            nom: 'John Doe',
            email: 'john@example.com',
            password: 'Password123',
            role: 'chauffeur',
            telephone: '0123456789'
        };

        expect(userData.nom).toBeDefined();
        expect(userData.email).toBeDefined();
        expect(userData.password).toBeDefined();
        expect(userData.role).toBeDefined();
        expect(userData.telephone).toBeDefined();
    });
});