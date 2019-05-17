let $ = window.$;
$(document).ready(function () {
    'use strict';
    let started = false;
    let lost = false;
    let youlost = function () {
        if (!started || lost) { return; }
        lost = true;
        $('.boundary').addClass('youlose');
        $('#status').text('Sorry, you lost. :[');
    };
    $('#start').click(() => {
        started = true;
        lost = false;
        $('.boundary').removeClass('youlose');
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