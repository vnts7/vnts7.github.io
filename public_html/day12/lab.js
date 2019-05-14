(function () {
    "use strict";
    let accList = [];
    /**
     * getElementById
     * @param {*} id element id
     *@returns {HTMLElement} HTML element
     */
    function $(id) {
        return document.getElementById(id);
    }

    /**
     * Module for creating new account
     * @param {*} name account name
     * @param {*} deposit amount of deposit
     * @returns {*} Bank account
     */
    let createAcc = function (name, deposit) {
        let accName = name;
        let accDeposit = deposit;
        return {
            getName: () => accName,
            getDeposit: () => accDeposit
        };
    };

    /**
     * Handle create account button click
     */
    function createClick() {
        accList.push(createAcc($('name').value, $('deposit').value));
        let text = '';
        //for(let i=0; i<accList.length;i++)

        accList.forEach(acc => {
            text += 'Account Name: ' + acc.getName() + ", Balance: " + acc.getDeposit() + '\n';
        });
        $('text').value = text;
        $('name').value = $('deposit').value = '';
    }
    $('btnCreate').onclick = createClick;
})();