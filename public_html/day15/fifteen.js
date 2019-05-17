let jQuery = window.jQuery;
(function ($) {
    $(document).ready(function () {
        'use strict';
        const n = 4;
        const size = 100;
        let cx = n - 1;
        let cy = n - 1;
        let shuffling = false;
        /**
         * Handle tile click
         */
        let move = function () {
            if (movable(this)) {
                if (!shuffling) { $(this).animate({ top: cy * size, left: cx * size }, size); }
                else { $(this).css({ top: cy * size, left: cx * size }); }
                let x = this.x;
                let y = this.y;
                this.x = cx;
                this.y = cy;
                this.id = 'puzzlepiece' + cx + '_' + cy;
                cx = x;
                cy = y;
            }
            if (!shuffling) {
                check();
            }

        };
        /**
         * Check if a tile is movable
         * @param {*} e tile element
         * @returns {Boolean} movable
         */
        let movable = function (e) {
            let x = e.x;
            let y = e.y;
            if ((x === cx && Math.abs(y - cy) === 1) || (y === cy && Math.abs(x - cx) === 1)) {
                return true;
            }
            return false;
        };
        /**
         * Check if win or not
         */
        let check = function () {
            let win = true;
            $('#puzzlearea div')
                .each(function () {
                    if (this.x !== this.ox || this.y !== this.oy) {
                        win = false;
                        return;
                    }
                });
            if (win) {
                alert('You win!!!');
            }
        };
        /**
         * Init
         */
        $('#puzzlearea div')
            .click(move)
            .each(function (i) {
                let ox = i % n, oy = Math.floor(i / n);
                let l = ox * size;
                let t = oy * size;
                $(this)
                    .addClass('puzzlepiece')
                    .css({ top: t, left: l })
                    .css('background-position', -l + 'px ' + (-t) + 'px');
                // .attr({ x:ox, y:oy, ox, oy });
                this.x = this.ox = ox;
                this.y = this.oy = oy;
                this.id = 'puzzlepiece' + ox + '_' + oy;
            })
            .mouseover(function () {
                if (movable(this)) { $(this).addClass('movablepiece'); }
            })
            .mouseout(function () {
                $(this).removeClass('movablepiece');
            })
            ;
        /**
         * Handle shuffle
         */
        $('#shufflebutton').click(function () {
            shuffling = true;
            const maxMove = 1000;
            let numMove = maxMove;
            while (numMove > 0) {
                let posibles = [
                    { x: cx - 1, y: cy }, { x: cx + 1, y: cy },
                    { x: cx, y: cy - 1 }, { x: cx, y: cy + 1 }];
                posibles = posibles.filter(i => { return i.x >= 0 && i.x < n && i.y >= 0 && i.y < n; });
                let nextPos = posibles[Math.floor(Math.random() * posibles.length)];
                move.apply($('#puzzlepiece' + nextPos.x + '_' + nextPos.y)[0]);
                numMove--;
            }
            shuffling = false;
        });
    });
})(jQuery);
