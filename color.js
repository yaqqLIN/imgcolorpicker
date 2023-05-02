const imageContainer = document.querySelector("#image-container");
const imginput=document.querySelector("#imginput");
const savedlst=document.querySelector("#savedlst");
const colorinfo=document.querySelector("#colorinfo");
const showcolor=document.querySelector("#showcolor");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
let uploadedImage;
function rgbToHex(r, g, b) {
    const hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + hex.padStart(6, "0");
  }
function drawImageOnCanvas() {
    if (!uploadedImage) return;
    //視窗*0.8
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    //計算圖片長寬
    let newWidth = uploadedImage.width;
    let newHeight = uploadedImage.height;
    const ratio = uploadedImage.width / uploadedImage.height;
    if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / ratio;
    }
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * ratio;
    }
    // 調整長寬
    canvas.width = newWidth;
    canvas.height = newHeight;
    // 顯示
    ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);
    canvas.addEventListener('mousemove', handleMouseMove);
}

function handleImageUpload(event) {
const file = event.target.files[0];
const reader = new FileReader();
reader.onload = function(event) {
    uploadedImage = new Image();
    uploadedImage.onload = function() {
    drawImageOnCanvas();
    };
    uploadedImage.src = event.target.result;
};
reader.readAsDataURL(file);
}

function handleMouseMove(event) {
const rect = canvas.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
const pixelData = ctx.getImageData(x, y, 1, 1).data;
const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
const hexcolor=rgbToHex(pixelData[0],pixelData[1], pixelData[2]);
showcolor.value=hexcolor;
colorinfo.textContent = color +"  HEX:" +hexcolor;
}

function handleDragOver(event) {
event.preventDefault();
}
function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage = new Image();
        uploadedImage.onload = function() {
        drawImageOnCanvas();
        };
        uploadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
function handlePaste(e) {
    var items = e.clipboardData && e.clipboardData.items;
    var file = null;
    if (items && items.length) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                file = items[i].getAsFile();
                break;
            }
        }
        const reader = new FileReader();
        reader.onload = function() {
        uploadedImage = new Image();
        uploadedImage.onload = function() {
        drawImageOnCanvas();
        };
        uploadedImage.src = URL.createObjectURL(file);
    };
    reader.readAsDataURL(file);
    }
}
function saveColor(){
    if(colorinfo.textContent){
        savedlst.textContent+=colorinfo.textContent+"\r\n";
        document.querySelector("#savedinfo").textContent=colorinfo.textContent+" 已儲存";
    }
}
window.addEventListener('resize', drawImageOnCanvas);
canvas.addEventListener('dragover', handleDragOver);
canvas.addEventListener('drop', handleDrop);
canvas.addEventListener('click',saveColor);
imginput.addEventListener('change', handleImageUpload);
document.addEventListener('paste', handlePaste);
// Set canvas size to full screen on load
canvas.width = window.innerWidth*0.8;
canvas.height = window.innerHeight*0.8;
ctx.font = (window.innerWidth+window.innerHeight)/70+'px Arial';
ctx.fillText("1.拖曳照片至此處", window.innerWidth*0.3, window.innerHeight*0.2);
ctx.fillText("2.點下方按鈕選擇檔案上傳", window.innerWidth*0.3, window.innerHeight*0.3);
ctx.fillText("3.截圖或複製圖片後按 Ctrl+ V", window.innerWidth*0.3, window.innerHeight*0.4);
ctx.fillText("-點選圖片中的色彩儲存在下方", window.innerWidth*0.3, window.innerHeight*0.5);
ctx.fillText("-(或)輸入色彩輸入框後點儲存按鈕", window.innerWidth*0.3, window.innerHeight*0.6);
imageContainer.appendChild(canvas);