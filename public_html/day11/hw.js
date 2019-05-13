(function () {
    "use strict";
    const hiSpeed = 50, loSpeed = 250;
    let speed = loSpeed;
    let timer = null;
    let oldText = null;
    let frms = null;
    let frameIdx = 0;
    /**
     * getElementById
     * @param {*} id element id
     *@returns {HTMLElement} HTML element
     */
    function $(id) {
        return document.getElementById(id);
    }
    /**
     * Handle animation change
     */
    function animationChange() {
        $('text').value = window.ANIMATIONS[this.value];
    }
    /**
     * Handle size change
     */
    function sizeChange() {
        $('text').style.fontSize = this.value;
    }
    /**
     * Handle speedChange
     */
    function speedChange() {
        speed = this.checked ? hiSpeed : loSpeed;
        if (timer) { clearInterval(timer); }
        startAnimation();
    }
    /**
     * Handle startClick
     */
    function startClick() {
        let text = $('text');
        oldText = text.value;
        frms = oldText.split('=====\n');
        frameIdx = 0;
        startAnimation();
        this.disabled = true;
        $('btnStop').disabled = false;
    }
    /**
     * start the Animation
     */
    function startAnimation() {
        timer = setInterval(() => {
            $('text').value = frms[frameIdx];
            frameIdx++;
            if (frameIdx === frms.length) { frameIdx = 0; }
        }, speed);
    }
    /**
     * Handle stopClick
     */
    function stopClick() {
        this.disabled = true;
        $('btnStart').disabled = false;
        if (timer) {
            clearInterval(timer);
            $('text').value = oldText;
            timer = null;
        }
    }
    $('size').onchange = sizeChange;
    $('speed').onchange = speedChange;
    $('animation').onchange = animationChange;
    $('btnStart').onclick = startClick;
    $('btnStop').onclick = stopClick;
})();