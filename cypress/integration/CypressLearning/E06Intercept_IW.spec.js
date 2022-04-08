describe("", { baseUrl: "http://cms.chtoma.com/" }, () => {

    var AES = require("crypto-js/aes");
    var Token;
    const pwd = AES.encrypt('111111', 'cms').toString();
    const Email = "manager@admin.com";
    const Role = "manager";

    beforeEach(() => {


        cy.request({
            method: 'POST',
            // url: 'http://cms.chtoma.com/api/login',
            url: 'api/login',
            body: {

                "email": Email,
                "password": pwd,
                "role": Role,
                //"remember": Remember
            }
        })
            .then(res => {

                cy.window().then($win => {
                    Token = res.body.data.token
                    $win.localStorage.setItem("cms", JSON.stringify(res.body.data));
                })


                cy.visit("https://cms-lyart.vercel.app/dashboard/manager");

                cy.get("li").eq(3).as("Course").click();
                cy.get("@Course").within(() => {
                    cy.get("ul>li:nth-child(2)").click();
                });
            });
    });

    it("ID01: Teacher (Query)  || Stub", () => {


        cy.intercept(
            {
                url: "api/teachers?query=*",
                method: "GET",
            },
            { fixture: "teacher.json" }
        ).as("resp");

        const toType = "Fa" + "{downarrow}".repeat(3); //+ '{enter}';
        cy.get("input#teacherId")
            .parents()
            .eq(2)
            .click({ force: true })
            .then(() => {
                cy.get("#teacherId").click({ force: true }).then(() => {
                    cy.get("#teacherId").type(toType, { delay: 1000, force: true });
                });
            });


        cy.wait("@resp").then(resp => {

            console.log(resp);

            // The original is Fanny Haag, it is Fanny AAA in teacher.json.
            cy.contains("Fanny AAA").should("be.visible").click({ force: true });
            expect(resp.response.body.code).equal(200);
            expect(resp.response.body.data.total).equal(8);
        })



    });

    it("ID02: Course Type || Stub", () => {

        cy.intercept(
            {
                url: "api/courses/type",
                method: "GET"
            },
            {
                fixture: "type.json"
            }
        ).as("type");

        cy.get("#type").parents().eq(1).click({ force: true });

        cy.wait("@type").then(resp => {
            // According to the dat to type.json
            cy.contains('INC_C++').should('be.visible');
            cy.get("div[title^='INC_']").should('have.length', 6);
            expect(resp.response.body.data[5].id).to.eql(6);
            expect(resp.response.body.data[5].name).to.eql("INC_PHP");

        })


    });

    it.only("ID03: Create Course - POST || Spy", () => {
        const Detail = 'A'.replace(100)
        // We can use the stub here. Use the data format as requirement in the document. Here, the response can be reference.
        cy.intercept(
            "POST",
            "api/courses",
            {
               fixture:"create_course.json"
            }).as("post");

        cy.get("#name").type('CC88');
        let da = new Date();
        let d = da.valueOf();
        let td = d + 1000 * 60 * 60 * 24;
        let tmo = new Date(td);
        let tyear = tmo.getFullYear();
        let tmonth = (tmo.getMonth() + 1) < 10 ? '0' + (tmo.getMonth() + 1) : tmo.getMonth() + 1;
        let tday = tmo.getDate();
        let dayToSelect = [tyear, tmonth, tday].join('-');
        cy.get("#startTime").type(dayToSelect, { force: true });

        cy.get("#price").type("8", { force: true });

        cy.get('#maxStudents').type('88', { force: true });

        cy.get('input[class="ant-input-number-input"]').then($el => {
            cy.wrap($el[2]).as('Duration');
            cy.get('@Duration').type('36');
        });

        cy.document().then(($doc) => {
            const doc = $doc;
            //console.log(doc)
            const mInput = doc.querySelector(
                "#contentLayout > main > div:nth-child(2) > form > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div.ant-col.ant-col-offset-1.ant-form-item-control > div > div > span > div.ant-select.ant-select-single.ant-select-show-arrow > div"
            );
            console.log(mInput);

            cy.wrap(mInput).as("Mon");
            cy.get('@Mon').type('66', { fource: true });

        });

        let toType = "Fa" + "{downarrow}".repeat(3) + '{enter}';
        cy.get("#teacherId").click({ force: true }).then(() => { cy.get("#teacherId").type(toType, { delay: 1000, force: true }) });

        let desc = '168'.repeat(40);
        cy.get("#detail").type(desc, { force: true });

        let pic = './cypress/fixtures/cmsup02.png';
        //cy.pause();
        cy.get("input[type='file']").selectFile(pic, { encoding: null, force: true, action: 'drag-drop' });
        cy.wait(10000);

        cy.get('button[class="ant-btn ant-btn-primary"]', { withinSubject: null }).then($el => {
            console.log($el, '---,', $el[3]);
            cy.wrap($el[3]).as('OK');
            cy.get('@OK').click({ force: true });
        });

        cy.wait(5000);
        cy.get("#type").parents().eq(1).as('typeLi').click({ force: true });

        //cy.get(".rc-virtual-list-holder-inner", { withinSubject: null})
        cy.get("div[title='C']", { withinSubject: null }).parent().children().then(($list) => {
            let dispItemNum = 0;
            const selectedIndex = [0, 2, 4, 6];
            let item = $list[1];
            console.log($list[0]);
            selectedIndex.forEach(i => {

                cy.wrap($list).children().eq(i).click({ force: true, timeout: 1000 });
            });
        });

        cy.get("button").contains("Create Course").click({ force: true });

        cy.wait("@post").then(resp => {
            console.log(resp);
            expect(resp.response.body.code).to.eql(201);
            expect(resp.response.body.data.name).to.eql("BB88");
        })

        // cy.intercept() used for spy more or stub more?
        // cy.intercept() when using "POST", only spy? If it can be stub, how to assert?

    })

});