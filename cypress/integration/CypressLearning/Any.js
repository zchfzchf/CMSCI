describe("Exp", () => {
    it('', () => {
        //cy.tLogin('manager','manager@admin.com','111111',true)

        /*var AES= require("crypto-js/aes");
        const pwd = AES.encrypt('111111', 'cms').toString();
        const Role = 'student';
        const Email = 'student@admin.com';
        const Remember = true;

        cy.request({
            method: 'OPTIONS',
            url: 'https://cms-lyart.vercel.app/login',
            body: {
                role: Role,
                email: Email,
                password: pwd,
                remember: Remember
            }
        })
            .then(BD => {
                console.log(BD)
            })*/
        
        cy.visit('https://www.google.com');
        cy.get('.gLFyf.gsfi').type('selenium');
        cy.get('.CqAVzb > center > .gNO89b').click();

    })


})