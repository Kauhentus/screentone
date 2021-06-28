let dotSpacing = 20;
let dotRadius = 7;
let offsetStep = 10;
let inverse = false;
let filledDots = true;
let trimRight = 19;
let trimBottom = 0;

/** @type {HTMLCanvasElement} */
const mainDisplayCanvas = document.getElementById('main-display-canvas');
/** @type {CanvasRenderingContext2D} */
const mctx = mainDisplayCanvas.getContext('2d');

/** @type {HTMLCanvasElement} */
const zoomDisplayCanvas = document.getElementById('zoom-display-canvas');
/** @type {CanvasRenderingContext2D} */
const zctx = zoomDisplayCanvas.getContext('2d');

/** @type {HTMLCanvasElement} */
const TBEdgeCanvas = document.getElementById('top-bottom-edges');
/** @type {CanvasRenderingContext2D} */
const tbctx = TBEdgeCanvas.getContext('2d');

/** @type {HTMLCanvasElement} */
const LREdgeCanvas = document.getElementById('left-right-edges');
/** @type {CanvasRenderingContext2D} */
const lrctx = LREdgeCanvas.getContext('2d');

const TAU = Math.PI * 2;
const zoomFactor = 4;

let zwidth, zheight, twidth, theight;

const update = () => {
    zoomDisplayCanvas.width = 150;
    zoomDisplayCanvas.height = 150;
    zwidth = zoomDisplayCanvas.width,
    zheight = zoomDisplayCanvas.height;
    zctx.imageSmoothingEnabled = false;

    mainDisplayCanvas.width = 300 - trimRight;
    mainDisplayCanvas.height = 300 - trimBottom;
    twidth = mainDisplayCanvas.width,
    theight = mainDisplayCanvas.height;

    mctx.clearRect(0, 0, twidth, theight);
    mctx.fillStyle = inverse ? 'black' : 'white'
    mctx.fillRect(0, 0, twidth, theight);

    mctx.fillStyle = inverse ? 'white' : 'black';
    console.log(twidth, theight)
    let currentOffset = 0;
    for(let x = -dotSpacing; x < twidth + dotSpacing;){
        for(let y = -dotSpacing; y < theight + dotSpacing;){
            // mctx.fillStyle = `rgb(${255 * x / twidth}, ${255 * y / theight}, 255)`

            drawCircle(mctx, x, y + currentOffset, dotRadius)

            y += dotSpacing;
        }

        currentOffset += offsetStep;
        if(currentOffset >= dotSpacing) currentOffset = 0;

        x += dotSpacing;
    }

    updateZoomDisplay();
    console.log("hi");

    TBEdgeCanvas.width = 300;
    TBEdgeCanvas.height = 150;
    tbctx.imageSmoothingEnabled = false;
    let tbw = TBEdgeCanvas.width;
    let tbh = TBEdgeCanvas.height;
    
    const subImage1 = mctx.getImageData(
        twidth / 2 - tbw / 2 / zoomFactor, 
        0, 
        tbw / zoomFactor, 
        tbh / 2 / zoomFactor
    );

    const tempCanvas1 = document.createElement('canvas');
    tempCanvas1.width = tbw / zoomFactor; tempCanvas1.height = tbh / 2 / zoomFactor;

    const t1ctx = tempCanvas1.getContext('2d');
    t1ctx.putImageData(subImage1, 0, 0);

    tbctx.fillStyle = 'SkyBlue'
    tbctx.fillRect(0, 0, twidth, theight / 2);
    tbctx.drawImage(
        tempCanvas1, 
        0, tbh / 2,
        tbw, tbh / 2
    );
    ///

    const subImage2 = mctx.getImageData(
        twidth / 2 - tbw / 2 / zoomFactor, 
        theight - tbh / 2 / zoomFactor, 
        tbw / zoomFactor, 
        tbh / 2 / zoomFactor
    );

    const tempCanvas2 = document.createElement('canvas');
    tempCanvas2.width = tbw / zoomFactor; tempCanvas2.height = tbh / 2 / zoomFactor;

    const t2ctx = tempCanvas2.getContext('2d');
    t2ctx.putImageData(subImage2, 0, 0);

    
    tbctx.drawImage(
        tempCanvas2, 
        0, 0,
        tbw, tbh / 2
    );
    //
    tbctx.strokeStyle = 'red'; tbctx.lineWidth = 0.5;
    tbctx.beginPath();
    tbctx.moveTo(0, tbh / 2)
    tbctx.lineTo(tbw, tbh / 2)
    tbctx.closePath();
    tbctx.stroke();

    //

    LREdgeCanvas.width = 150;
    LREdgeCanvas.height = 300;
    lrctx.imageSmoothingEnabled = false;
    let lrw = LREdgeCanvas.width;
    let lrh = LREdgeCanvas.height;

    const subImage3 = mctx.getImageData(
        0, 
        theight / 2 - lrh / 2 / zoomFactor, 
        lrw / 2 / zoomFactor, 
        lrh / zoomFactor
    );

    const tempCanvas3 = document.createElement('canvas');
    tempCanvas3.width = lrw / 2 / zoomFactor; tempCanvas3.height = lrh / zoomFactor;

    const t3ctx = tempCanvas3.getContext('2d');
    t3ctx.putImageData(subImage3, 0, 0);

    lrctx.fillStyle = 'SkyBlue'
    lrctx.fillRect(0, 0, twidth / 2, theight);
    lrctx.drawImage(
        tempCanvas3, 
        lrw / 2, 0,
        lrw / 2, lrh
    );

    // 

    const subImage4 = mctx.getImageData(
        twidth - lrw / 2 / zoomFactor, 
        theight / 2 - lrh / 2 / zoomFactor, 
        lrw / 2 / zoomFactor, 
        lrh / zoomFactor
    );

    const tempCanvas4 = document.createElement('canvas');
    tempCanvas4.width = lrw / 2 / zoomFactor; tempCanvas4.height = lrh / zoomFactor;

    const t4ctx = tempCanvas4.getContext('2d');
    t4ctx.putImageData(subImage4, 0, 0);

    lrctx.drawImage(
        tempCanvas4, 
        0, 0,
        lrw / 2, lrh
    );
    //

    lrctx.strokeStyle = 'red'; lrctx.lineWidth = 0.5;
    lrctx.beginPath();
    lrctx.moveTo(lrw / 2, 0)
    lrctx.lineTo(lrw / 2, lrh)
    lrctx.closePath();
    lrctx.stroke();
}

mainDisplayCanvas.onmousemove = event => {
    const mx = event.offsetX, my = event.offsetY;
    
    const boxWidth = zoomDisplayCanvas.width / zoomFactor;
    const boxHeight = zoomDisplayCanvas.height / zoomFactor;

    const subImage = mctx.getImageData(mx - boxWidth / 2, my - boxHeight / 2, boxWidth, boxHeight);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = boxWidth; tempCanvas.height = boxHeight;
    const tctx = tempCanvas.getContext('2d');
    tctx.fillStyle = inverse ? 'black' : 'white'
    tctx.fillRect(0, 0, zwidth, zheight);
    tctx.putImageData(subImage, 0, 0);
    
    zctx.fillStyle = 'SkyBlue'
    zctx.fillRect(0, 0, zwidth, zheight);
    zctx.drawImage(tempCanvas, 0, 0, zwidth, zheight);
}
const updateZoomDisplay = () => {
    /*const mx = zoomDisplayCanvas.width / 2, my = zoomDisplayCanvas.height / 2;
    
    const boxWidth = zoomDisplayCanvas.width / zoomFactor;
    const boxHeight = zoomDisplayCanvas.height / zoomFactor;

    const subImage = mctx.getImageData(mx - boxWidth / 2, my - boxHeight / 2, boxWidth, boxHeight);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = boxWidth; tempCanvas.height = boxHeight;
    const tctx = tempCanvas.getContext('2d');
    tctx.fillStyle = inverse ? 'black' : 'white'
    tctx.fillRect(0, 0, zwidth, zheight);
    tctx.putImageData(subImage, 0, 0);
    
    zctx.fillStyle = 'SkyBlue'
    zctx.fillRect(0, 0, zwidth, zheight);
    zctx.drawImage(tempCanvas, 0, 0, zwidth, zheight);*/
}
update();


/** @type {HTMLInputElement} */
const dotSpacingInput = document.getElementById('dot-spacing')
dotSpacingInput.onchange = () => {
    const newValue = parseInt(dotSpacingInput.value);
    if(1 <= newValue && newValue <= 100){
        dotSpacing = newValue;
    } else {
        alert("Dot spacing must be in 1 to 100 range");
        dotSpacingInput.value = dotSpacing;
    }
    
    update();
}
/** @type {HTMLInputElement} */
const dotSizeInput = document.getElementById('dot-size');
dotSizeInput.onchange = () => {
    const newValue = parseInt(dotSizeInput.value);
    if(0 <= newValue && newValue <= 100){
        dotRadius = newValue;
    } else {
        alert("Dot radius must be in 1 to 100 range");
        dotSizeInput.value = dotRadius;
    }

    update();
}
/** @type {HTMLInputElement} */
const dotOffsetInput = document.getElementById('dot-offset');
dotOffsetInput.onchange = () => {
    const newValue = parseInt(dotOffsetInput.value);
    if(0 <= newValue && newValue <= 100){
        offsetStep = newValue;
    } else {
        alert("Dot radius must be in 0 to 100 range");
        dotOffsetInput.value = offsetStep;
    }
    update();
}
/** @type {HTMLInputElement} */
const trimRightInput = document.getElementById('dot-trim-right');
trimRightInput.onchange = () => {
    const newValue = parseInt(trimRightInput.value);
    if(0 <= newValue && newValue <= 100){
        trimRight = newValue;
    } else {
        alert("Dot radius must be in 0 to 100 range");
        trimRightInput.value = trimRight;
    }
    update();
}
/** @type {HTMLInputElement} */
const trimBottomInput = document.getElementById('dot-trim-bottom');
trimBottomInput.onchange = () => {
    const newValue = parseInt(trimBottomInput.value);
    if(0 <= newValue && newValue <= 100){
        trimBottom = newValue;
    } else {
        alert("Dot radius must be in 0 to 100 range");
        trimBottomInput.value = trimBottom;
    }
    update();
}

const colorSelectNormal = document.getElementById('A');
colorSelectNormal.onchange = () => {
    inverse = false;
    update();
}
const colorSelectInverse = document.getElementById('B');
colorSelectInverse.onchange = () => {
    inverse = true;
    update();
}

const dotSelectOpen = document.getElementById('C');
dotSelectOpen.onchange = () => {
    filledDots = false;
    update();
}
const dotSelectFiled = document.getElementById('D');
dotSelectFiled.onchange = () => {
    filledDots = true;
    update();
}




const downloadCanvas = () => {
    const dataURL = mainDisplayCanvas.toDataURL();
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'myImage.png';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

const downloadButton = document.getElementById('download-button')
console.log(downloadButton)
downloadButton.onclick = () => downloadCanvas();

// https://funloop.org/post/2021-03-15-bresenham-circle-drawing-algorithm.html

function drawMirroredPts(ctx, xc, yc, x, y, r){
    if(!filledDots){
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc + y, yc + x, 1, 1);
        ctx.fillRect(xc + -x, yc + y, 1, 1);
        ctx.fillRect(xc + -y, yc + x, 1, 1);
        ctx.fillRect(xc + x, yc + -y, 1, 1);
        ctx.fillRect(xc + y, yc + -x, 1, 1);
        ctx.fillRect(xc + -x, yc + -y, 1, 1);
        ctx.fillRect(xc + -y, yc + -x, 1, 1);
        
    } else {
        if(r == 1){
            ctx.fillRect(xc + x, yc + y, 1, 1);
            ctx.fillRect(xc + y, yc + x, 1, 1);
            ctx.fillRect(xc + -x, yc + y, 1, 1);
            ctx.fillRect(xc + -y, yc + x, 1, 1);
            ctx.fillRect(xc + x, yc + -y, 1, 1);
            ctx.fillRect(xc + y, yc + -x, 1, 1);
            ctx.fillRect(xc + -x, yc + -y, 1, 1);
            ctx.fillRect(xc + -y, yc + -x, 1, 1);
        }

        let xw = 2 * x; if(xw == 0) xw = 1;
        let yw = 2 * y; if(yw == 0) yw = 1;
        
        ctx.fillRect(xc + -x, yc + y, xw, 1)
        ctx.fillRect(xc + -y, yc + x, yw, 1)
        ctx.fillRect(xc + -x, yc + -y, xw, 1)
        ctx.fillRect(xc + -y, yc + -x, yw, 1)
    }
    ctx.fill();
}

function drawCircle(ctx, cx, cy, r){
    if(r != 0){
        let x = 0,
            y = -r,
            F_M = 1 - r,
            d_e = 3,
            d_ne = -(r << 1) + 5;

        let maxIter = 1000,
            i = 0;
        
            drawMirroredPts(ctx, cx, cy, x, y, r);
        while(maxIter > i && x < -y){
            if(F_M < 0){
                F_M += d_e;
            } else {
                F_M += d_ne;
                d_ne += 2;
                y += 1;
            }

            d_e += 2;
            d_ne += 2;
            x += 1;

            // console.log(cx + x, cy + y)
            drawMirroredPts(ctx, cx, cy, x, y, r);

            i++;
        }
    } else {
        ctx.fillRect(cx, cy, 1, 1);
        ctx.fill();
    }
    
}