describe("Login Page works as intended", () => {
    beforeEach("Define Aliases",() => {
        cy.visit("https://cms-lyart.vercel.app/login");

        cy.get("#login_role>:nth-child(1)").as("student")
            .get("#login_role>:nth-child(2)").as("teacher")
            .get("#login_role>:nth-child(3)").as("manager")

        cy.get("input#login_email").as("email")
            .get("input#login_password").as("pwd")
            .get("input#login_remember").as("chkRMe")

        cy.get('.ant-checkbox-wrapper > :nth-child(2)').as("spanRMe")
        cy.get('.ant-btn').as('btn')

        cy.get('a').contains('Sign up').as('signup')

    })
    // Sign in should not be available to click before proper input has been completed?
    it("ID01: Proper default settings: Student and Remember me", () => {
        cy.get('@student').find('[type="radio"]')
            .should('be.checked')
            .and('have.value','student')

        cy.get('@chkRMe').should('be.checked')
    })

    it("ID02: Display error messages without input", () => {
        cy.get('@btn').click();

        cy.contains("email' is required").should('have.length', 1)
            .and('be.visible')
        
        cy.contains("'password' is required").should('have.length', 1)
            .and('be.visible')
    })

    it("ID03: Change Role", () => {
        cy.get('@teacher').click()
        cy.get('@teacher').find('[type="radio"]')
            .should('be.checked')
            .and('have.value', 'teacher')

        cy.get('@manager').click()
        cy.get('@manager').find('[type="radio"]')
            .should('be.checked')
            .and('have.value', 'manager')
    })

    it("ID04: Account input validation without password", function () {
        cy.log("ID04-01: Valid Input")
        cy.get('@email').type('student@admin.com{enter}')
        cy.log("Message 'password' is required appears")
        cy.get("div[role='alert'").contains("'password' is required").should('have.length',1)
        cy.get('@email').then($eml => {
            /*Cypress Way
            cy.wrap($eml.parent()).find('input:valid')
                .should('have.length', 1)
                .and('have.value', 'student@admin.com')
            */
            //JS Way
            const eml=$eml[0]
            expect(eml.validity.valid).to.eql(true)
            expect(eml.value).to.eql('student@admin.com')
        })
        cy.log("Click 'Sign in' Button, 'password' is required appear")
        cy.get('@btn').click()
        cy.get("div[role='alert'").contains("'password' is required")
            .should('have.length', 1)
            .and('be.visible')

        cy.log("ID04-02: Invalid Input, error message appears")
        cy.get('@email').clear().type("AAA@{enter}")
        cy.get('@email').then($eml => {
            const eml = $eml[0]
            expect(eml.validity.valid).to.eql(false)
            expect(eml.value).to.eql('AAA@')
            expect(eml.validationMessage).to.eql("Please enter a part following \'@\'. \'AAA@\' is incomplete.")
            // How to assert this message is visible?
            cy.get("div[role='alert']").contains("'email' is not a valid email")
                .should('have.length', 1)
                .and('be.visible')
            cy.log("Click 'Sign in' Button, error message appears")
            expect(eml.validationMessage).to.eql("Please enter a part following \'@\'. \'AAA@\' is incomplete.")
            cy.get("div[role='alert']").contains("'email' is not a valid email")
                .should('have.length', 1)
                .and('be.visible')
        })

     })

    it("ID05: Password input validation without Account input", () => {
        cy.log("ID05-01: Password length is shorter than 4")
        //cy.get('@pwd').click()
        cy.get('@pwd').type('111{enter}')
        cy.log("Error message appears")
        cy.get("div[role='alert'").contains("'email' is required")
            .should('have.length', 1)
            .and('be.visible')
        cy.get('@pwd').then($pwd => {
            const pwd = $pwd[0]
            /*
            expect(pwd.validity.valid).to.eql(false)
            The pwd.validity.valid is equal to true after typing 111, while it is supposed to be false. Any valid input range?
            */
            expect(pwd.value).to.eql('111')
            cy.get("div[role='alert']").contains("'password' must be between 4 and 16 characters").should('have.length', 1)
        })
        cy.log("Click 'Sign in' Button, error message appears")
        cy.get('@btn').click()
        cy.get("div[role='alert'").contains("'email' is required")
            .should('have.length', 1)
            .and('be.visible')
        cy.get("div[role='alert']").contains("'password' must be between 4 and 16 characters")
            .should('have.length', 1)
            .and('be.be.visible')

        cy.log("ID05-02: Password lenght is larger than 16")
        cy.reload()
        //cy.get('@pwd').clear()
        cy.get('@pwd').type('0123456789abcdef0{enter}')
        cy.log("Message 'email' is required appears")
        cy.get("div[role='alert'").contains("'email' is required")
            .should('have.length', 1)
            .and('be.visible')
        cy.get('@pwd').then($pwd => {
            const pwd = $pwd[0]
            expect(pwd.value).to.eql('0123456789abcdef0')
            //console.log(pwd.validity.valid)
            cy.get("div[role='alert']").contains("'password' must be between 4 and 16 characters")
                .should('have.length', 1)
                .and('be.visible')
        })
        cy.log("Click 'Sign in' Button, error messages appears")
        cy.get('@btn').click()
        cy.get("div[role='alert'").contains("'email' is required").should('have.length', 1)
        
        cy.log("ID05-03: Valid Password input")
        cy.reload()
        cy.get('@pwd').type("123456{enter}")
        cy.get("div[role='alert'").contains("'email' is required")
            .should('have.length', 1)
            .and('be.visible')
        cy.log("Click 'Sign in' Button, the same error message")
        cy.get('@btn').click()
        cy.get("div[role='alert'").contains("'email' is required")
            .should('have.length', 1)
            .and('be.visible')
    })

    it("ID06: Change the 'Remember me' stuatus, Click on the words 'Rememeber me'", () => {
        cy.get('@spanRMe').click()
        cy.get('@chkRMe').should('not.be.checked')
        cy.get('@spanRMe').click()
        cy.get('@chkRMe').should('be.checked')
    })

    it.skip("ID07: Login test with valid input", () => {
        cy.log("ID07-01: Non-existent Account")
        // Login failed: 1) pop-up alert, 2) stay at the same page
        cy.get('@email').type('abc@abc.com')
        cy.get('@pwd').type('123456')
        cy.get('@btn').click()
        cy.get('.ant-message').contains('Please check your password or email')
            .should('be.visible')
            .and('have.length', 1)
        cy.url().should('eq','https://cms-lyart.vercel.app/login')
        // Actually, this is an inserted <span> by script. How to use the selector to find this element?

        cy.log("ID07-02: Correct Account, incorrect password")
        cy.reload()
        cy.get('@email').type('student@admin.com')
        cy.get('@pwd').type('123456')
        cy.get('@btn').click()
        cy.get('.ant-message').contains('Please check your password or email')
            .should('be.visible')
            .and('have.length', 1)
        cy.url().should('eq', 'https://cms-lyart.vercel.app/login')

        cy.log("ID07-03: Correct Account and password, incorrect Role")
        cy.reload()
        cy.get('@manager').click()
        cy.get('@email').type('student@admin.com')
        cy.get('@pwd').type('111111')
        cy.get('@btn').click()
        cy.get('.ant-message').contains('Please check your password or email')
            .should('be.visible')
            .and('have.length', 1)
        cy.url().should('eq', 'https://cms-lyart.vercel.app/login')

        //Login successfully, new contents are loaded and URL is changed.
        cy.log("ID07-04: Correct Account and Password, correct Role")
        cy.reload()
        cy.get('@email').type('student@admin.com')
        cy.get('@pwd').type('111111{enter}')
        cy.url().should('contain', '/dashboard')
        cy.get('span').contains('CMS').should('be.visible')
    })

    // URL is changed, new contents are loaded.
    it("ID08: 'Sign up' link works", () => {
        cy.get('@signup').click()
        cy.url().should('eq', 'https://cms-lyart.vercel.app/signup')
        cy.get('h1').contains('Sign up your account').should('be.visible')
    })

    // How to test this? Cookie or localStorage?
    // Login then use cy.getcookies() to check?
    it("ID09: Check whether 'Remember me' works", () => {
        cy.get('@email').type('student@admin.com')
        cy.get('@pwd').type('111111{enter}')

        cy.getCookies().then($cookies => {
            console.log($cookies)
        })
    })
})