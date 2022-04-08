describe("", { baseUrl: "http://cms.chtoma.com/" }, () => {

    var AES = require("crypto-js/aes");
    var Token;
    const pwd = AES.encrypt('111111', 'cms').toString();
    const Email = "manager@admin.com";
    const Role = "manager";

    before(() => {


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


    beforeEach(() => {
        // cy.window().then($win => {
        //     Token = res.body.data.token
        //     $win.localStorage.setItem("cms", JSON.stringify(res.body.data));
        // })
    });

    it.only('Create Course', () => {

        const Detail = 'A'.replace(100)

        let da = new Date();
        let d = da.valueOf();
        let td = d + 1000 * 60 * 60 * 24;
        let tmo = new Date(td);
        let tyear = tmo.getFullYear();
        let tmonth = (tmo.getMonth() + 1) < 10 ? '0' + (tmo.getMonth() + 1) : tmo.getMonth() + 1;
        let tday = tmo.getDate();
        let dayToSelect = [tyear, tmonth, tday].join('-');

        cy.request({
            "method": "POST",
            "url": "api/courses",
            "auth": { "bearer": Token },
            "body": {
                "name": "AAA",
                "uid": "7a32d4d5-745c-4f43-8868-0e3c16f98f44",
                "detail": Detail,
                "startTime": dayToSelect,
                "price": 1,
                "maxStudents": 8,
                "duration": 6,
                "durationUnit": 2,
                "cover": "",
                "teacherId": 77,
                "type": [1, 3]
            }
        }).its('status')
            .should('eql', 201);


    })

    it('Course Query by Name', () => {

        cy.request({
            "method": "GET",
            "url": "api/courses",
            "auth": { "bearer": Token },
            "body": {
                "name": "AAA",
                "userId": 3
            }
        }).then($resp => {
            expect($resp.status).to.deep.eql(200);
            console.log($resp)

        });
    });


});