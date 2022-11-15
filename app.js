const canvas = document.getElementById('board');
let sudoku = new Sudoku(canvas);

let undo_svg = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M18.885 3.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.073.1 4.341 4.341 1.737 12.291-5.491 12.291v4.8c3.708 0 6.614-1.244 8.885-3.515 4.686-4.686 4.686-12.284 0-16.97z'/></svg>"
let edit_svg = ```<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
    viewBox='0 0 500 500' style='enable-background:new 0 0 500 500;' xml:space='preserve'>
    <style type='text/css'>
    .st0{fill:none;stroke:#231F20;stroke-width:15;stroke-miterlimit:10;}
    .st1{fill:#FFFFFF;stroke:#231F20;stroke-width:15;stroke-miterlimit:10;}
    </style>
    <polyline class='st0' points='444.6,250 444.6,444.6 55.4,444.6 55.4,55.4 259.4,55.4 '/>
    <path class='st1' d='M250,55.4'/>
    <path class='st1' d='M250,55.4'/>
    <path class='st1' d='M444.6,55.4'/>
    <path class='st1' d='M250,55.4'/>
    <path class='st1' d='M444.6,55.4'/>
    <path class='st1' d='M244.2,55.4'/>
    <path class='st1' d='M250,55.4'/>
    <g>

    <rect x='309.4' y='73' transform='matrix(0.9802 0.1978 -0.1978 0.9802 46.041 -63.5664)' class='st1' width='63.6' height='251.3'/>
    <path class='st1' d='M401.8,33.7L349.2,23c-2.7-0.5-5.3,1.2-5.9,3.9l-4.8,23.6l62.3,12.6l4.8-23.6
    C406.3,36.8,404.5,34.2,401.8,33.7z'/>
    <path class='st1' d='M295.7,396.3l-10.9-61.4l54.9,11.1l-33.4,52.5C303.4,402.7,296.9,401.3,295.7,396.3z'/>
    </g>
    <path class='st1' d='M261.4,55.4'/>
    <line class='st1' x1='86.2' y1='247.2' x2='265.4' y2='247.2'/>
    <line class='st1' x1='86.2' y1='396.2' x2='268.4' y2='396.2'/>
    <line class='st1' x1='86.2' y1='346' x2='254.2' y2='346'/>
    <line class='st1' x1='86.2' y1='296.6' x2='254.2' y2='296.6'/>
    <line class='st1' x1='86.2' y1='199.6' x2='275.2' y2='199.6'/>
    <line class='st1' x1='88.4' y1='151.9' x2='284.6' y2='151.9'/>
    <line class='st1' x1='88.4' y1='105.6' x2='294' y2='105.6'/>
    </svg>```

document.getElementById('button_undo').innerHTML = undo_svg;
document.getElementById('button_note').innerHTML = edit_svg;