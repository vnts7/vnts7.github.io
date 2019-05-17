let $ = window.$;
$(document).ready(function () {
    'use strict';
    let started = false;
    let lost = false;
    let youlost = function () {
        if (!started || lost) { return; }
        lost = true;
        $('.boundary').css('background-color', 'red');
        $('#status').text('Sorry, you lost. :[');
    };
    $('#start').click(() => {
        started = true;
        lost = false;
        $('.boundary').css('background-color', '#eeeeee');
        $('#status').text('Move you mouse to the END area');
    });
    $('.boundary').mouseover(youlost);
    $('#end').mouseover(function () {
        if (started && !lost) {
            started = false;
            $('#status').text('You win! :]');
        }
    });
    $('#maze').mouseleave(youlost);

});