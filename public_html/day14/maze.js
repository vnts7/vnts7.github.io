let $ = window.$;
$(document).ready(function () {
    'use strict';
    let started = false;
    let lost = false;
    const delay = 10;
    let youlost = function () {
        if (!started || lost) { return; }
        lost = true;
        $('.boundary').css('background-color', 'red');
        setTimeout(() => alert('Sorry, you lost. :['), delay);
    };
    $('#start').click(() => {
        started = true;
        lost = false;
        $('.boundary').css('background-color', '#eeeeee');
    });
    $('.boundary').mouseover(youlost);
    $('#end').mouseover(function () {
        if (started && !lost) {
            started = false;
            setTimeout(() => alert('You win! :]'), delay);
        }
    });
    $('#maze').mouseleave(youlost);

});