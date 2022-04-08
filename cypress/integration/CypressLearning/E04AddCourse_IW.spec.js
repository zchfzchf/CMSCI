describe("Add Course - Manager", () => {
    before(() => {

        cy.tLogin("manager", "manager@admin.com", "111111", true);
        cy.visit("https://cms-lyart.vercel.app/dashboard/manager");

        cy.get("li").eq(3).as("Course").click();
        cy.get("@Course").within(() => {
            cy.get("ul>li:nth-child(2)").click();
        });
    });

    beforeEach(() => { cy.tLogin("manager", "manager@admin.com", "111111", true); });

    it("ID01: Incorrect Course Name, error message appears", () => {
        /*cy.get('li').eq(3).as('Course').click()
            cy.get('@Course').within(() => {
                cy.get('ul>li:nth-child(2)').click()
            })*/

        /*cy.get('#name').type('{enter}')
            cy.contains("'name' is required").should('be.visible')*/

        cy.get("#name").type("AA");
        cy.contains("'name' must be between 3 and 100 characters").should(
            "be.visible"
        );

        cy.get("#name").then(($name) => {
            const name = $name[0];
            const nVal = name.value;
            name.value = nVal + "A".repeat(99);
            cy.contains("'name' must be between 3 and 100 characters").should(
                "be.visible"
            );

            name.value = "AAA";

            /*let i = 0;
              while (i < 11) {
                  cy.get('#name').type('123456789')
                  i++
              }
              
              cy.contains("'name' must be between 3 and 100 characters").should('be.visible')
              */
        });
    });

    it("ID02: Start Date can be today or future day", () => {
        cy.wait(10000);
        cy.get("#startTime")
            .click()
            .then(() => {
                cy.get("div.ant-picker-body").should("be.visible");
                const mon = Date().toString().slice(4, 7);
                const yr = Date().toString().slice(11, 15);
                cy.get("button.ant-picker-month-btn").should("have.text", mon);
                cy.get("button.ant-picker-year-btn").should("have.text", yr);
                // If goting to test the arrows: please consider
                // the click on the arrows will change the month and year.The month change may also cause the year change!!!
            });

        /*cy.get('td[class*="disabled"]').each(($cell, index, $list) => {
                cy.wrap($cell).click({ force: true })
                cy.get('#startTime').should('have.value','')
            })*/
        let yday, tday, tmrow;

        cy.document().then(($doc) => {
            let doc = $doc;
            let sT = doc.getElementById("startTime");
            let da = new Date();

            let d = da.valueOf();
            let yd = d - 1000 * 60 * 60 * 24;
            let tmo = d + 1000 * 60 * 60 * 24;
            let date = [yd, d, tmo];

            for (let i = 0; i < date.length; i++) {
                let i_t, ida, iyear, imonth, idate, iM, iexpDate, itObj;

                ida = new Date(date[i]);
                iyear = ida.getFullYear();
                imonth = ida.getMonth() + 1;
                idate = ida.getDate();

                if (imonth < 10) iM = "0" + imonth;

                iexpDate = [iyear, iM, idate].join("-");
                i_t = '[title="' + iexpDate + '"]';

                if (date[i] != d) {
                    cy.get("#startTime").click();
                    itObj = doc.querySelector(i_t);
                    cy.wrap(itObj).click({ force: true });

                    if (date[i] < d) {
                        cy.get("#startTime").should("have.value", "");

                        yday = iexpDate;

                        cy.get("#startTime").click(10, 100, { force: true });
                        cy.get("#startTime").should("have.value", "");
                    } else {
                        cy.get("#startTime").should("have.value", iexpDate);
                        cy.get("div.ant-picker-body").should("not.be.visible");

                        tmrow = iexpDate;
                    }
                } else {
                    cy.get("#startTime").click();
                    cy.contains("Today").click();
                    cy.get("#startTime").should("have.value", iexpDate);

                    tday = iexpDate;
                }
            }

            console.log([yday, tday, tmrow]);

            //Enter date manually
            let yt = [yday, tday];
            yt.forEach((ea) => {
                cy.get("#startTime").clear({ force: true });
                console.log(ea);
                cy.get("#startTime").type(ea + "{enter}", { force: true });
                //cy.get('div.ant-picker-body').should('be.visible');
                //cy.get('#startTime').click(0, 100, { force: true });
                // If reload the page and do manual enter straight, here the value should be ''. Now because the previous action,
                // the website use the latest available value as the default value
                // So the manual enter test should be in seperated test case with initiate env as well.
                cy.get("#startTime").should("have.value", tmrow);

                cy.get("div.ant-picker-body").should("not.be.visible");
            });

            cy.get("#startTime").clear({ force: true });
            cy.get("#startTime").type(tmrow + "{enter}", { force: true });
            cy.get("div.ant-picker-body").should("not.be.visible");
            cy.get("#startTime").should("have.value", tmrow);
        });

        /*
            console.log([yday, tday, tmrow])
            cy.pause();
            //Enter date manually
            let yt = [yday, tday];
            yt.forEach(ea => {
                cy.get('#startTime').clear();
                console.log(ea)
                cy.get('#startTime').type(ea + '{enter}', { force: true });
                cy.get('div.ant-picker-body').should('be.visible');
                cy.get('#startTime').click(0, 100, { force: true });
                cy.get("#startTime").should('have.value', '');
                cy.get('div.ant-picker-body').should('not.be.visible');
    
            })
     
    
            cy.get('#startTime').clear();
            cy.get('#startTime').type(tmrow + '{enter}', { force: true });
            cy.get('div.ant-picker-body').should('not.be.visible');
            cy.get("#startTime").should('have.value', tmrow)*/
    });

    it("ID03: Price: Up button and Down button", () => {
        cy.get("#price")
            .parents()
            .eq(1)
            .within(($prArea) => {
                const prArea = $prArea[0];
                const pr = prArea.querySelector("#price");
                let iniPr = pr.value.slice(2);
                cy.get('[aria-label="Increase Value"]').as("prUp");
                cy.get('[aria-label="Decrease Value"]').as("prDn");

                cy.wrap($prArea).trigger("mouseover").should("be.visible");

                if (iniPr == "") {
                    cy.get("@prDn")
                        .click({ force: true })
                        .then(() => {
                            expect(pr.value.slice(2)).to.eql("0");
                            expect(
                                prArea.querySelector('[aria-label="Decrease Value"]')
                                    .ariaDisabled
                            ).to.eql("true");
                        });
                }

                cy.get("@prUp").click({ force: true });
                let expPr = iniPr + 1;
                cy.get("#price").should("have.value", "$ " + expPr);

                cy.get("@prDn").click({ force: true });
                expPr -= 1;
                cy.get("#price").should("have.value", "$ " + expPr);
            });
    });

    it("ID05: Unit of Duration", () => {
        /*cy.get('input#rc_select_2').parents().eq(2).as('Mon').within($M => {
                cy.contains('month').should('be.visible');
                cy.wrap($M).click();
                cy.contains('year').should('be.visible');
                })
                
                It looks that it is a bug of cypress. It can not regonize some types of IDs.
                */

        cy.contains("month").should("be.visible");

        cy.document().then(($doc) => {
            const doc = $doc;
            //console.log(doc)

            const mInput = doc.querySelector(
                "#contentLayout > main > div:nth-child(2) > form > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div.ant-col.ant-col-offset-1.ant-form-item-control > div > div > span > div.ant-select.ant-select-single.ant-select-show-arrow > div"
            );

            //const mDpl = doc.querySelector('#contentLayout > main > div:nth-child(2) > form > div:nth-child(2) > div:nth-child(1) > div.ant-row.ant-form-item.ant-form-item-with-help.ant-form-item-has-error > div.ant-col.ant-col-offset-1.ant-form-item-control > div.ant-form-item-control-input > div > span > div.ant-select.ant-select-single.ant-select-show-arrow > div > span.ant-select-selection-item')
            // selector doesn't work as well
            console.log(mInput);


            cy.wrap(mInput).as("Mon");
            cy.get('@Mon', { withinSubject: null }).children().eq(1).as("MonDpl");
            // cy.pause() will affect the testing results because of mouse clicks on the button to go forward one step.
            let listCont = ["year", "month", "day", "week", "hour"];
            cy.wrap(listCont).each((ea, index, $l) => {
                cy.get("@Mon").click({ force: true }).then(() => {
                    cy.contains(ea).should("be.visible").click({ force: true });
                    cy.get("@MonDpl").should("have.text", ea);
                    cy.get("@Mon").click();
                });
            });
        });

    });

    it("ID06: Teacher - Dropdown", () => {
        cy.get(
            "#contentLayout > main > div:nth-child(2) > form > div:nth-child(1) > div.ant-col.ant-col-16 > div > div:nth-child(1) > div > div.ant-col.ant-col-offset-1.ant-form-item-control > div > div > div"
        ).as("Tch");

        const toType = "Fa" + "{downarrow}".repeat(3); //+ '{enter}';
        cy.get("input#teacherId")
            .parents()
            .eq(2)
            .click({ force: true })
            .then(() => {
                cy.get("#teacherId").click({ force: true }).then(() => { cy.get("#teacherId").type(toType, { delay: 1000, force: true }) });
                // Dropdown list
                cy.get(".rc-virtual-list-holder", { withinSubject: null }).should(
                    "be.visible"
                );
                cy.contains("Fanny Haag").should("be.visible").click({ force: true });

                /*cy.get('body>div:nth-child(50) [class*="selected"]>div').should('be.selected')
                        .and('have.text', 'Fanny Haag');*/ // why does the selector not work??????, {withinSubject:null}

                //cy.get('div[title="Fanny Haag"]', { withinSubject: null }).should('be.focused'); // how to tell it is hightligted??????
                cy.get("#teacherId").parent().next().should("have.text", "Fanny Haag");
                cy.get(".rc-virtual-list-holder", { withinSubject: null }).should(
                    "not.be.visible"
                );
            });
    });

    it("ID07: Type - Dropdown", () => {
        cy.get("#type").parents().eq(1).click({ force: true });
        let selectedVal = [];
        cy.get(".rc-virtual-list-holder-inner", { withinSubject: null })
            .should("be.visible")
            .then(($list) => {
                let dispItemNum = 0;

                const selectedIndex = [0, 2, 4, 6];

                let item = $list[0];
                selectedIndex.forEach((i) => {
                    selectedVal[dispItemNum] = $list.children().eq(i).text();
                    dispItemNum++;

                    console.log(
                        "{0}---{1}",
                        $list.children().eq(i).text(),
                        $list.children().eq(i).text().length
                    );
                    console.log(selectedVal[dispItemNum]);

                    //let typeKeys = '{downArrow}'.repeat(i) + '{enter}';
                    cy.wrap($list).children().eq(i).click({ force: true });

                    //cy.wrap($list).children().eq(i).click();
                });
            });

        /*cy.get(
            "#contentLayout > main > div:nth-child(2) > form > div:nth-child(1) > div.ant-col.ant-col-16 > div > div:nth-child(2) > div > div.ant-col.ant-col-offset-1.ant-form-item-control > div > div > div > div",
            { withinSubject: null }
        )*/
        cy.get('input#type').parent().prevAll()
            .then(($D) => {
                console.log($D);
                // expect($D.text()).to.deep.equal(selectedVal);
                expect($D.length).to.eq(4);
                let i = 0;
                let ii = 3
                for (i; i < 4; i++, ii--) {
                    expect($D.eq(i).text()).to.deep.eql(selectedVal[ii]);
                }


            });
    });

    it("ID08: Description: 100-1000 characters", () => {
        cy.get("#detail").should("not.be.disabled").as("D");
        cy.get("button").contains("Create Course").click();
        cy.contains("'detail' is required").should("be.visible");

        const chaA =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

        let i;
        let toTy = "";
        let iniInd = 0;
        let stg = [99, 101, 1000, 1001];    // Bug: 99 is acceptable,
        let stgI = 0;
        for (stgI; stgI < stg.length; stgI++) {
            cy.wrap(stg[stgI]).then($stg => {

                for (iniInd; iniInd < $stg; iniInd++) {
                    i = ~~(Math.random() * 100);
                    console.log('1. i---', i);
                    i = (i >= chaA.length) ? (i - chaA.length) : i;
                    // i cannot be 62 ( chaA[62]=undefined ). It takes long time to find this error.
                    // Another chanllenge is the synchronous and asynchronous!!!
                    console.log('2. i---', i);
                    toTy += chaA[i];
                    console.log('i--', i, 'iniInd---', iniInd, 'chaA---', chaA[i], 'toTy---', toTy.length);
                };

            }).then(() => {
                console.log(iniInd);
                console.log(toTy.length);
                if (iniInd == stg[0] || iniInd == stg[3]) {

                    cy.get("@D").type(toTy).then($contTy => {
                        console.log('$contTy.length', $contTy.text().length);
                        cy.contains(
                            "Description length must between 100 - 1000 characters."
                        ).should("be.visible").then(() => { toTy = ''; console.log(iniInd); });

                    });
                };
            }).then(() => {

                if (iniInd == stg[1] || iniInd == stg[2]) {
                    console.log(iniInd);
                    console.log(toTy.length);

                    cy.get("@D").type(toTy).then($contTy => {
                        console.log('$contTy.length', $contTy.text().length);
                        cy.contains(
                            "Description length must between 100 - 1000 characters."
                        ).should("not.exist").then(() => { toTy = ''; console.log(iniInd); });

                    });
                };
            })


        };

    });

    it("ID09: Click or drag file", () => {
        //cy.fixture('cmsup02.png').as('pic');
        let pic = './cypress/fixtures/cmsup02.png';
        cy.get("input[type='file']").selectFile(pic, { encoding: null, force: true, action: 'drag-drop' }).then($el => {
            cy.get('div[data-testid="container"]', { withinSubject: null }).as('toGetOK').should('be.visible');
            //cy.get('@toGetOK').parent().next().children().last().click({force:true}).then(()=>{
            /*cy.get('@toGetOK').parent().next().children().last().then($el => {
                const el = $el[0];
                el.dispatchEvent(new MouseEvent("mouseover"));
                el.dispatchEvent(new MouseEvent("click"));
                //el.dispatchEvent(new MouseEvent("mousedown"));
                //el.dispatchEvent(new MouseEvent("mouseup"));
    
            });*/

            cy.get('button[class="ant-btn ant-btn-primary"]').then($el => {
                console.log($el);
                const OK = $el[3]
                cy.wrap(OK).as('OK');
                cy.get('@OK').click({ force: true });
            })

            // Assert uploading is successful.
            cy.contains('Click or drag file to this area to upload', { withinSubject: null }).should('not.exist');

            // How to assert uploading is successful.

            //cy.get('@OK').click({force:true});

            /*cy.get("button[title='Remove file']", { withinSubject: null }).as('btnR').then($btn => {
                
                
                const btn = $btn[0];
                const picA = btn.parentElement.parentElement;
                //picA.dispatchEvent(new MouseEvent("mouseover"));
                cy.wrap(picA).as('picA');
    
                cy.get('@picA').trigger('focus').then(() => {
                    //cy.get('@picA').trigger('mouseover');
                    cy.get('@btnR').should('be.visible');
                });
            });*/
            /*cy.get('span.ant-upload-span', { withinSubject: null }).trigger('focus',{force:true}).as('picA').then($picA => {
                cy.get('@picA').trigger('mouseover',{force:true});
                cy.get('@picA').trigger('focus',{force:true});
                cy.document().focused().then($el=>{
                    console.log($el);
                })
                cy.get("button[title='Remove file']", { withinSubject: null }).within(()=>{
                    cy.get('svg').should('be.visible');
                });
            });*/
        });
    });

    it.only("ID10: Create Course", () => {

        cy.get("#name").type('AA88');

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

        cy.get('input[class="ant-input-number-input"]').then($el=>{
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
        cy.get("input[type='file']").selectFile(pic, { encoding: null, force: true, action: 'drag-drop'});
        cy.wait(10000);

        cy.get('button[class="ant-btn ant-btn-primary"]', { withinSubject: null }).then($el => {
            console.log($el, '---,', $el[3]);
            cy.wrap($el[3]).as('OK');
            cy.get('@OK').click({ force: true });
        });
        
        cy.wait(5000);
        cy.get("#type").parents().eq(1).as('typeLi').click({ force: true });

        //cy.get(".rc-virtual-list-holder-inner", { withinSubject: null})
        cy.get("div[title='C']",{withinSubject:null}).parent().children().then(($list) => {
                let dispItemNum = 0;
                const selectedIndex = [0, 2, 4, 6];
                let item = $list[1];
                console.log($list[0]);
                selectedIndex.forEach(i => {

                    cy.wrap($list).children().eq(i).click({force:true,timeout:1000});
                });
            });



        cy.get("button").contains("Create Course").click({force:true});
        cy.wait(3000);

        cy.contains("Add Chapter").should('be.visible');
        cy.contains("Add Class Time").should('be.visible');

    });
});
