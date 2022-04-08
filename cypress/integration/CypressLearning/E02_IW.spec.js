describe("ID 01: Heare is properly displaying with 5 links", () => {
    beforeEach(() => {
        cy.visit('http://cms-lyart.vercel.app/');                         //Open the website
    })
    it("Verify Logo and 5 links in Header - SOLUTION 1", () => {
        //cy.get('#header')
        // To get the requested items within Header
        cy.document().should(doc => {
            const HeaderOffsetTop = doc.getElementById('header').offsetTop
            expect(HeaderOffsetTop).to.be.eql(0)                          // To ensure the Header is on the top
        })
        cy.get('#header #logo')                                           // To get the logo
            .get('#header #menu>ul:nth-child(1)>li:nth-child(1)>a')       // To get the 1st link
            .get('#header #menu>ul:nth-child(1)>li:nth-child(2)>a')       // To get the 2nd link
            .get('#header #menu>ul:nth-child(2)>li:nth-child(1)>a')       // To get the 3rd link
            .get('#header #menu>ul:nth-child(2)>li:nth-child(2)>a')       // To get the 4th link
            .get('#header #menu>ul:nth-child(2)>li:nth-child(3)>a')       // To get the 5th link

    })

    it("ID 01: Verify Logo and 5 links within Header - SOLUTION 2", () => {
        cy.document().should(doc => {
            const HeaderOffsetTop = doc.getElementById('header').offsetTop
            expect(HeaderOffsetTop).to.be.eql(0)                         // To ensure the Header is on the top
        })
        cy.get('#header').within(headerSection => {
            cy.get('#logo')                                              // To get the logo
            cy.get('#menu>ul:nth-child(1)>li:nth-child(1)>a')            // To get the 1st link
              .get('#menu>ul:nth-child(1)>li:nth-child(2)>a')            // To get the 2nd link
              .get('#menu>ul:nth-child(2)>li:nth-child(1)>a')            // To get the 3rd link
              .get('#menu>ul:nth-child(2)>li:nth-child(2)>a')            // To get the 4th link
              .get('#menu>ul:nth-child(2)>li:nth-child(3)>a')            // To get the 5th link   
        })

    })

    it('ID 01: Verify Logo and 5 links within Header - SOLUTION 3', () => {
        cy.document().should(doc => {
            const HeaderOffsetTop = doc.getElementById('header').offsetTop
            expect(HeaderOffsetTop).to.be.eql(0)                         // To ensure the Header is on the top
        })
        cy.get('#header a').should('have.length', '5')
    })
})

describe("ID 02: Ensure the 5 links and Logo button are working", () => {
    beforeEach(() => {
        cy.visit('http://cms-lyart.vercel.app/');                           // Open the website
        })

    it("Ensure the 1st links COURSE and Logo button are working", () => {
        cy.get('#header #menu>ul:nth-child(1)>li:nth-child(1)>a').click()   // Click the link
        cy.url().should('include', '/events').then(() => {                  // New page link should include '/events'
            cy.get('#header #logo').click()                                 // Click the logo
            cy.url().should('eql', 'https://cms-lyart.vercel.app/')         // Go back to the homepage
        })
    })

    it("Ensure the 2nd links EVENTS and Logo button are working", () => {
        cy.get('#header #menu>ul:nth-child(1)>li:nth-child(2)>a').click()    // Click the link
        cy.url().should('include', '/events').then(() => {                   // New page link should include '/events'
            cy.get('#header #logo').click()                                  // Click the logo
            cy.url().should('eql', 'https://cms-lyart.vercel.app/')          // Go back to the homepage
        })
    })

    it("Ensure the 3rd links STUDENTS and Logo button are working", () => {
        cy.get('#header #menu>ul:nth-child(2)>li:nth-child(1)>a').click()    // Click the link
        cy.url().should('include', '/gallery').then(() => {                  // New page link should include '/gallery'
            cy.get('#header #logo').click()                                  // Click the logo
            cy.url().should('eql', 'https://cms-lyart.vercel.app/')          // Go back to the homepage
        })
    })

    it("Ensure the 4th links TEACHERS and Logo button are working", () => {
        cy.get('#header #menu>ul:nth-child(2)>li:nth-child(2)>a').click()    // Click the link
        cy.url().should('include', '/gallery').then(() => {                  // New page link should include '/gallery'
            cy.get('#header #logo').click()                                  // Click the logo
            cy.url().should('eql', 'https://cms-lyart.vercel.app/')          // Go back to the homepage
        })
    })

    it("Ensure the 5th links SIGN IN and Logo button are working", () => {
        cy.get('#header #menu>ul:nth-child(2)>li:nth-child(3)>a').click()    // Click the link
        cy.url().should('include', '/login').then(() => {                    // New page link should include '/login'
            cy.get('#header #logo').click()                                  // Click the logo
            cy.url().should('eql', 'https://cms-lyart.vercel.app/')          // Go back to the homepage
        })
    })
})

describe('ID 03: The header is always on the top', () => {
    it('The header is always on the top', () => {
        cy.visit('http://cms-lyart.vercel.app/');                           // Open the website

        cy.scrollTo('bottom')                                               // Scroll to the bottom


        cy.get('#header').should('be.visible').then(hd => {
            //hd.offset({ left: 100, top: 100 })
            expect(hd.offset().top).to.eql(0)                               // Jquery Way to ensure Header is on the top

        })
        cy.document().should(doc => {
            const HeaderOffsetTop = doc.getElementById('header').offsetTop
            console.log(doc.getElementById('header'))
            expect(HeaderOffsetTop).to.be.eql(0)                            // JS way to ensure the Header is on the top
        })
    })

    it.only('The header is always on the top', () => {
        cy.visit('http://cms-lyart.vercel.app/');                           // Open the website

        cy.scrollTo('bottom')                                               // Scroll to the bottom


        cy.get('#header')
            .then(hd => {
                //hd.offset({ left: 100, top: 100 })
                expect(hd.offset().top).to.eql(0)                               // Jquery Way to ensure Header is on the top
            })
            .should('be.visible')
        cy.get('#header').should('be.visible').then($hd => {
            //$hd.offset({ left: 100, top: 100 })
            console.log('$hd[0]---' + $hd[0])                       // $hd[0]   HTMLElement
            console.log('$hd[0]---'+$hd[0].offsetTop)               
            console.log('$hd---' + $hd)                             // $hd      Jquery Element
            
            expect($hd.offset().top).to.eql(0)                               // Jquery Way to ensure Header is on the top

        })

        cy.document().should(doc => {
            const HeaderOffsetTop = doc.getElementById('header').offsetTop
            console.log(doc.getElementById('header'))
            expect(HeaderOffsetTop).to.be.eql(0)                            // JS way to ensure the Header is on the top
        })
    })
})

describe('ID 04: Login', () => {
    it('Type e-mail and password to login', () => {
        cy.visit('http://cms-lyart.vercel.app/');                                   // Open the website
        cy.get('#header #menu>ul:nth-last-child(1)>li:nth-last-child(1)').click()   // Open the SIGN IN link
        cy.contains('span', 'Manager').click()                                      // Choose Manager account
        cy.get('input[type = "email"]').type('manager@admin.com')                   // Enter account
        cy.get('input[type="password"]').type('111111')                             // Enter password
        cy.get('button[type="submit"]').click()       // Error. Why?  Because the password is encrypted when doing manually, 
        //while it is not encrypted with Cypress .click()
        //Add "chromeWebSecurity": false in cypress.json to solve this problem.


    })
})

describe('Retries', () => {
    /*Cypress.config({
        retries: {
            runMode: 2,
            openMode:4,
        }
    })*/
    
    const Retries = {
        runMode: 2,
        openMode: 6,
    }
    it('Retries', { retries:Retries}, () => {
        expect(1).to.eql(2)
    })
 })

        // cy.url() is an alias of cy.location('href') 

        /*
            cy.window().should(win => {
            const loc = win.location
            expect(loc.href).to.be.eql("https://cms-lyart.vercel.app/events") 
            // Can this assertion ensure the link opens the webpage successfully?

        }).then(() => {
            cy.visit("https://cms-lyart.vercel.app/events")
        })
        */
        /*
        //
        //var testDiv = document.getElementById("test");
        //var demoDiv = document.getElementById("demo");
        //demoDiv.innerHTML = "offsetLeft: " + testDiv.offsetLeft + "<br>offsetTop: " + testDiv.offsetTop;
        */