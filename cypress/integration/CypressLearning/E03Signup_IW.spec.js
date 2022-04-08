describe("'Sign Up' pages work as intended", () => {
    beforeEach(() => {
        cy.visit('https://cms-lyart.vercel.app/signup')
        cy.get('#signUp_email').as('email')
        cy.get("#signUp_password").as('pwd')
        cy.get('#signUp_confirmPassword').as('pwdConf')
        cy.get('button').as('btn')
    })
    afterEach(() => {
        cy.clearLocalStorage()
        cy.clearCookies()
    })

    it("ID01: No default Role and it works as intened", () => {
        cy.get('#signUp_role').within($el => {
            cy.get('input[value="student"]').should('not.be.checked')
            cy.get('input[value="teacher"]').should('not.be.checked')
            cy.get('input[value="manager"]').should('not.be.checked')

            cy.wrap($el).as('el')
            // console.log($el.selector)    => #signUp_role

            cy.get('@el').children().eq(0).click()
            cy.get('input[value="student"]').should('be.checked')

            cy.get('@el').children().eq(1).click()
            cy.get('input[value="teacher"]').should('be.checked')

            cy.get('@el').children().eq(2).click()
            cy.get('input[value="manager"]').should('be.checked')

        })
    })

    it("ID02: Proper annotation in the input fields", () => {
        cy.get('@email').then($el => {
            const el = $el[0]
            console.log(el.attributes.placeholder.value)
            expect(el.attributes.placeholder.value).equal("Please input email")
        })

        cy.get('@pwd').then($el => {
            const el = $el[0]
            console.log(el.attributes.placeholder.value)
            expect(el.attributes.placeholder.value).equal("please input password")
            // Interface defect, placeholder should be "Please input password"
        })

        cy.get('@pwdConf').then($el => {
            const el = $el[0]
            console.log(el.attributes.placeholder.value)
            expect(el.attributes.placeholder.value).equal("Tap password again")
        })
    })

    it("ID03: No input, click 'Sign up': error messages for all fields", () => {
        cy.get('@btn').click()
        cy.get('div[role="alert"]').within(() => {
            cy.contains("'role' is required").should('be.visible')
            cy.contains("'email' is required").should('be.visible')
            cy.contains("'password' is required").should('be.visible')
            cy.contains("'confirmPassword' is required").should('be.visible')
            // Interface defect, 'confirmPassword' should be 'Confirm Password'
        })
    })

    it("ID04: 'email' input validation", () => {
        cy.get('@email').type('aaa{enter}')
        // After pressing Enter, the cursor should move to next input field. It doesn't happen.

        // Invalid input: aaa Error message appears
        cy.get('@email').then($eml => {
            const eml = $eml[0]
            expect(eml.validity.valid).to.eql(false)
            expect(eml.value).to.eql('aaa')
            expect(eml.validationMessage).to.eql("Please include an '@' in the email address. 'aaa' is missing an '@'.")
            cy.get('div[role="alert"]').contains("'email' is not a valid email").should('be.visible')
        })

        // Invalid input: aaa@
        cy.get('@email').type('@{enter}')
        cy.get('@email').then($eml => {
            const eml = $eml[0]
            expect(eml.validity.valid).to.eql(false)
            expect(eml.value).to.eql('aaa@')
            expect(eml.validationMessage).to.eql("Please enter a part following '@'. 'aaa@' is incomplete.")
            cy.get('div[role="alert"]').contains("'email' is not a valid email").should('be.visible')
        })

        // Invalid input: aaa@a
        cy.get('@email').type('a{enter}')
        cy.get('@email').then($eml => {
            const eml = $eml[0]
            /*
            expect(eml.validity.valid).to.eql(false) // => failed: the validation is incomplete
            */
            expect(eml.value).to.eql('aaa@a')
            cy.get('div[role="alert"]').contains("'email' is not a valid email").should('be.visible')
        })

        // Valid input: aaa@aaa.com
        cy.get('@email').type('aa.com{enter}')
        cy.get('@email').then($eml => {
            const eml = $eml[0]
            expect(eml.validity.valid).to.eql(true)
            expect(eml.value).to.eql('aaa@aaa.com')
            cy.get('div[role="alert"]').within(() => {
                cy.contains("'email' is not a valid email").should('have.length', 0)
                cy.contains("'role' is required").should('be.visible')
                cy.contains("'password' is required").should('be.visible')
                cy.contains("'confirmPassword' is required").should('be.visible')
            })
        })

    })

    it("ID05: Password and Confirm Password validation", () => {

        // Invalid input: 012
        cy.get('@pwd').type('012')
        cy.get('div[role="alert"]').contains("'password' must be between 4 and 16 characters").should('be.visible')
        
        // Invalid input: 0123456789abcdefg
        cy.get('@pwd').type('3456789abcdefg')
        cy.get('div[role="alert"]').contains("'password' must be between 4 and 16 characters").should('be.visible')

        // Valid input: 1111
        cy.get('@pwd').clear()
        cy.get('@pwd').type('1111{enter}')
        cy.get('div[role="alert"]').within(() => {
            cy.contains("'role' is required").should('be.visible')
            cy.contains("'email' is required").should('be.visible')
            cy.contains("'password' must be between 4 and 16 characters").should('have.length', 0)
            cy.contains("'confirmPassword' is required").should('be.visible')
        })

        // Different password in Confirm Password: 1234
        cy.get('@pwdConf').type('1234')
        cy.get('div[role="alert"]').within(() => {
            cy.contains("'role' is required").should('be.visible')
            cy.contains("'email' is required").should('be.visible')
            cy.contains("'password' must be between 4 and 16 characters").should('have.length', 0)
            cy.contains("'confirmPassword' is required").should('have.length',0)
            cy.contains("The two passwords that you entered do not match!").should('be.visible')
        })

        // Same password in Confirm Password: 1111
        cy.get('@pwdConf').clear()
        cy.get('@pwdConf').type('1111')
        cy.get('div[role="alert"]').within(() => {
            cy.contains("'role' is required").should('be.visible')
            cy.contains("'email' is required").should('be.visible')
            cy.contains("'password' must be between 4 and 16 characters").should('have.length', 0)
            cy.contains("'confirmPassword' is required").should('have.length', 0)
            cy.contains("The two passwords that you entered do not match!").should('have.length', 0)
        })

        // Password and Confirm Password are the same
        cy.log("Password and Confirm Password are the same")
        cy.get('@pwd').then($pwd => {
            const pwd = $pwd[0].value
            cy.get('@pwdConf').then($pwdConf => {
                const pwdConf = $pwdConf[0].value

                expect(pwd).to.eql(pwdConf)
            })
        })
    })

    it("ID06: 'Sign Up' successfully ",()=>{
        cy.get('#signUp_role').children().eq(1).click()         // Role: teacher
        cy.get('@email').type('aaa@aaa.com')
        cy.get('@pwd').type('123456')
        cy.get('@pwdConf').type('123456')
        cy.get('@btn').click()

        // Web page goes to https://cms-lyart.vercel.app/login and 'success' pops up
        // Pop-up message should be "Success"
        // Question: 'success' is displayed before the loading of login page is completed or after? How to judge and handle?

        cy.url().should('eq','https://cms-lyart.vercel.app/login')
        cy.get('.ant-message').should('contain', 'success')
            .and('be.visible')
    })

    it("ID07: Use the 'Sign Up' account and password to login", () => {
        cy.visit("https://cms-lyart.vercel.app/login");

        cy.wait(3000)
        cy.get("#login_role>:nth-child(2)").click()
        cy.get("input#login_email").type('aaa@aaa.com')
            .get("input#login_password").type('123456')
            .get('.ant-btn').click()

        cy.wait(3000)

        cy.url().should('contain', '/dashboard')
        cy.get('span').contains('CMS').should('be.visible')

        // Logout
        cy.get('.ant-avatar').trigger('mouseover')
        cy.wait(1000)
        cy.contains('Logout').parent().eq(0).click()

    })

    it("ID08: Existing account should not be used to sign up (even with different password)", () => {
        // Use ID06, while the password is changed into '111111'
        // The test is passed means that account validation of 'Sign up' is incomplete.

        cy.get('#signUp_role').children().eq(1).click()         // Role: teacher
        cy.get('@email').type('aaa@aaa.com')
        cy.get('@pwd').type('111111')
        cy.get('@pwdConf').type('111111')
        cy.get('@btn').click()

        // Web page goes to https://cms-lyart.vercel.app/login and 'success' pops up
        // Pop-up message should be "Success"
        // Question: 'success' is displayed before the loading of login page is completed or after? How to judge and handle?

        cy.url().should('eq', 'https://cms-lyart.vercel.app/login')
        cy.get('.ant-message').should('contain', 'success')
            .and('be.visible')

        cy.log("XXXXXXXX--- Account Validation is incomplete ---XXXXXXXX")

    })
})