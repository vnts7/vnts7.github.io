let speed = 250;
let timer = null;
let oldText = null;
let frames = [];
let frameIdx = 0;
function animationChange(e) {
    document.getElementById('text').value = ANIMATIONS[e.value];
}
function sizeChange(e) {
    document.getElementById('text').style.fontSize = e.value;
}
function speedChange(e) {
    speed = e.checked ? 50 : 250;
    if(timer)clearInterval(timer);
    startAnimation();
}
function startClick(e) {
    e.disabled = true;
    document.getElementById('btnStop').disabled = false;
    let text = document.getElementById('text');
    oldText = text.value;
    frames = oldText.split('=====\n');
    frameIdx = 0;
    startAnimation();
}
function startAnimation(){
    timer = setInterval(() => {
        document.getElementById('text').value = frames[frameIdx];
        frameIdx++;
        if (frameIdx == frames.length) frameIdx = 0;
    }, speed);
}
function stopClick(e) {
    e.disabled = true;
    document.getElementById('btnStart').disabled = false;
    if (timer) {
        clearInterval(timer);
        document.getElementById('text').value = oldText;
        timer = null;
    }
}