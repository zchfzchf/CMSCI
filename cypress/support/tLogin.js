Cypress.Commands.add('tLogin', (Role, Email, Password, Remember) => {
    var AES = require("crypto-js/aes");
    const pwd = AES.encrypt('111111', 'cms').toString();
    /*const Role = 'student';
    const Email = 'student@admin.com';
    const Remember = true;*/

    cy.request({
        method: 'POST',
        url: 'http://cms.chtoma.com/api/login',
        body: {

            "email": Email,
            "password": pwd,
            "role": Role,
            //"remember": Remember
        }
    })
        .then(res => {
            console.log(res)
            console.log(res.body.data)


            cy.window().then($win => {
                console.log($win)
                console.log(JSON.stringify(res.body.data));
                $win.localStorage.setItem("cms", JSON.stringify(res.body.data));
            })

        })

})