var colors = ['White', 'LightYellow',
  'LemonChiffon', 'LightGoldenrodYellow', 'PapayaWhip', 'Moccasin', 'PeachPuff', 'PaleGoldenrod', 'Bisque', 'NavajoWhite', 'Wheat', 'BurlyWood', 'Tan',
  'Khaki', 'Yellow', 'Gold', 'Orange', 'DarkOrange', 'OrangeRed', 'Tomato', 'Coral', 'DarkSalmon', 'LightSalmon', 'LightCoral', 'Salmon', 'PaleVioletRed',
  'Pink', 'LightPink', 'HotPink', 'DeepPink', 'MediumVioletRed', 'Crimson', 'Red', 'FireBrick', 'DarkRed', 'Maroon',
  'Brown', 'Sienna', 'SaddleBrown', 'IndianRed', 'RosyBrown',
  'SandyBrown', 'Goldenrod', 'DarkGoldenrod', 'Peru',
  'Chocolate', 'DarkKhaki', 'DarkSeaGreen', 'MediumAquaMarine',
  'MediumSeaGreen', 'SeaGreen', 'ForestGreen', 'Green', 'DarkGreen', 'OliveDrab', 'Olive', 'DarkOliveGreen', 'YellowGreen', 'LawnGreen',
  'Chartreuse', 'GreenYellow', 'Lime', 'SpringGreen', 'LimeGreen',
  'LightGreen', 'PaleGreen', 'PaleTurquoise',
  'AquaMarine', 'Cyan', 'Turquoise', 'MediumTurquoise', 'DarkTurquoise', 'DeepSkyBlue',
  'LightSeaGreen', 'CadetBlue', 'DarkCyan', 'Teal', 'Steelblue', 'LightSteelBlue', 'Honeydew', 'LightCyan',
  'PowderBlue', 'LightBlue', 'SkyBlue', 'LightSkyBlue',
  'DodgerBlue', 'CornflowerBlue', 'RoyalBlue', 'SlateBlue',
  'MediumSlateBlue', 'DarkSlateBlue', 'Indigo', 'Purple', 'DarkMagenta', 'Blue',
  'MediumBlue', 'DarkBlue', 'Navy', 'Thistle',
  'Plum', 'Violet', 'Orchid', 'DarkOrchid', 'Fuchsia', 'Magenta', 'MediumOrchid',
  'BlueViolet', 'DarkViolet', 'DarkOrchid',
  'MediumPurple', 'Lavender', 'Gainsboro', 'LightGray', 'Silver', 'DarkGray', 'Gray',
  'DimGray', 'LightSlateGray', 'DarkSlateGray', 'Black'
];

var editsObjectList = [];
var undoObjectsList = [];
var clickWithoutHover = false;

$(document).ready(function() {
  var $currentColor = $('#currentColor');
  var $colorPicker = $('#colorPicker');
  var mouseDown = false;

  generatePalette();
  createGrid();

  $('.paletteColor').click(function() {
    currentColor.style.backgroundColor = $(this).css('background-color');
  });

  $colorPicker.change(function() {
    $currentColor.css('background-color', $(this).val());
  });

  $('#superheroPaintings img').each(function() {
    $(this).click(loadSuperhero);
  });

  $(document).mousedown(event => mouseDown = true).mouseup(event => mouseDown = false);

  $('#pixelGrid div').click(function() {
    var currEdit = {
      pixelID: $(this).attr('id'),
      prevColor: $(this).css('background-color')
    };
    $(this).css('background-color', currentColor.style.backgroundColor);
    currEdit.postColor = $(this).css('background-color');
    addEdit(currEdit);
  });

  $('#pixelGrid div').mouseover(function(event) {
    if (mouseDown) {
      var currEdit = {
        pixelID: $(this).attr('id'),
        prevColor: $(this).css('background-color')
      };
      $(this).css('background-color', currentColor.style.backgroundColor);
      currEdit.postColor = $(this).css('background-color');
      addEdit(currEdit);
    }
  });

  $('#resetGrid').click(function() {
    $('#pixelGrid div').each(function() {
      // $(this).css('background-color', 'white');
      $(this).animate({
        backgroundColor: 'white'
      }, 2000);
    });
  });

  $('#saveImage').click(savePixelArt);

  $('#showPixelBorders').click(function() {
    $('#pixelGrid').toggleClass('noGridGap');
  });

  var interval;

  $('#undo').mousedown(function() {
    interval = setInterval(undo, 100);
  }).mouseup(function() {
    clearInterval(interval);
  });

  $('#redo').mousedown(function() {
    interval = setInterval(redo, 100);
  }).mouseup(function() {
    clearInterval(interval);
  });

  $(document).keypress(key => {
    if (key.key == 'z') undo();
    if (key.key == 'r') redo();
  });

  function undo() {
    if (editsObjectList.length == 0) return;
    var lastEditedPixel = editsObjectList.pop();
    addUndo(lastEditedPixel);
    var editedPixelID = lastEditedPixel.pixelID;
    $('#' + editedPixelID).css('background-color', lastEditedPixel.prevColor);
  }

  function redo() {
    if (undoObjectsList.length == 0) return;
    var lastUndoneEdit = undoObjectsList.pop();
    addEdit(lastUndoneEdit);
    var editedPixelID = lastUndoneEdit.pixelID;
    $('#' + editedPixelID).css('background-color', lastUndoneEdit.postColor);
  }


  // document.addEventListener('DOMContentLoaded', function () {
  //   document.getElementById('palette').childNodes.forEach(node => addEventListener('click', activateColor));
  // });

  function generatePalette() {
    var $palette = $('#palette');
    // console.log(palette);
    colors.forEach(color => {
      var $newColor = $('<div></div>');
      $newColor.css('background-color', color);
      $newColor.addClass('paletteColor');
      $palette.append($newColor);
    });
  }

  function createGrid() {
    var grid = document.getElementById('pixelGrid');
    for (var i = 0; i < 1749; i++) {
      var gridSlot = document.createElement('div');
      gridSlot.setAttribute('id', i);
      gridSlot.style.display = 'run-in';
      grid.appendChild(gridSlot);
    }
  }

  function savePixelArt() {
    html2canvas($('#pixelGrid'), {
      onrendered: function(canvas) {
        theCanvas = canvas;
        canvas.toBlob(function(blob) {
          saveAs(blob, 'pixel-art.png');
        });
      }
    });
  }

  function loadSuperhero(superheroName) {
    var superhero = window[superheroName.target.id];
    var $pixels = $('#pixelGrid div');
    for (var i = 0; i < superhero.length; i++) {
      var currEdit = {
        pixelID: i,
        prevColor: $pixels[i].style.backgroundColor
      };
      $pixels[i].style.backgroundColor = superhero[i];
      currEdit.postColor = $pixels[i].style.backgroundColor;
      addEdit(currEdit);
    }
  }

  function addEdit(element) {
    if (editsObjectList.size >= 2000) {
      editsObjectList.shift();
      editsObjectList.push(element);
    } else editsObjectList.push(element);
  }

  function addUndo(element) {
    if (undoObjectsList.size >= 2000) {
      undoObjectsList.shift();
      undoObjectsList.push(element);
    } else undoObjectsList.push(element);
  }
});

/*
I tried using a library to draw an image from a file into a canvas, then dividing it into the amount of cols and rows in the grid, to then get the predominant color in each pixel and draw the grid. The problem seems to be always dividing an image specifically in those many fractions. I'm sure there's a method to it, but right now this excedes me.
*/

// function loadImage() {
//   var lineXArray = [60, 250];
//   var lineYArray = [100, 200];
//   var source = 'img/z.png';
//
//   var imageToSlices = window.imageToSlices;
//   imageToSlices(source, lineXArray, lineYArray, {
//       saveToDataUrl: true
//   }, function(dataUrlList) {
//       console.log('sliced', dataUrlList);
//   });
// }
