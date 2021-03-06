var Graph = {
  equationToEval: "",
  minX: -10,
  maxX: 22, //not used yet, will need for zoom
  widthx: 0,
  widthy: 0,
  resolution: 1,
  xscale: 1,
  yscale: 1,
  yAxisPosition: 0,
  xAxisPosition: 0,
  leftSumValue: 0,
  rightSumValue: 0,
  integralValue: 0,

  togglepop: function(callback) {
    var wide = $(window).width();
    $('#popup').css('left', '30%');
    $('#popup').css('width', wide * .4);
    $('#popup #message').empty();
    $('#popup #stage').empty().append('Setting things up');
    $('#popup').toggleClass("none");
    setTimeout(function() {
      callback();
    }, 200);
  },

  init: function() {

    Graph.drawGraphAxis();
    $('#graphButton').click(function() {
      //need to create a function to validate user input

      Graph.togglepop(function() {
        try {
          math.parse(Graph.equationToEval);

          try {

            Graph.checkInputs();
            Graph.clearGraph();
            Graph.drawGraphAxis();
            $('#leftSum').empty();
            $('#rightSum').empty();
            $('#integral').empty();
            $('#equationList').empty();
            Graph.createEquation();
            Graph.drawGraph();
            $('#errorAlert').empty().addClass('noShow').removeClass('show');
          } catch (e) {
            //change this to be below the equation in red text
            $('#popup').toggleClass("none");
            $('#errorAlert').empty().append(e).addClass('show').removeClass('noShow');
          }
        } catch (e) {
          $('#popup').toggleClass("none");
          $('#errorAlert').empty().append("Error processing math...  ", "We've encountered an error when attempting to process the equation that you input.  Please confirm that the input is correct.  The following error was reported:  " + e).addClass('show').removeClass('noShow');
        }
      });



    });
    $('#clearButton').click(function() {
      Graph.clearGraph();
      Graph.drawGraphAxis();
      $('#leftSum').empty();
      $('#rightSum').empty();
      $('#integral').empty();
      $('#equationList').empty();
    });
    var timeout;
    $('#equationInput').on('input', function(e) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        Graph.equationToEval = $('#equationInput').val();
        MathJax.Hub.Queue(["Text", MathJax.Hub.getAllJax(document.getElementById('equationFormatShown'))[0], 'f(x)=' + Graph.equationToEval]);
      }, 500);
    });

    $(document).keydown(function(e) {
      var plot = document.getElementsByTagName('symbol')[1];
      var box = plot.getAttribute('viewBox');
      if ($('#graphContainer').is(":focus")) {
        if ((e.which == 38) && e.shiftKey) {
          //console.log("afdas");
          var use = document.getElementsByTagName('use')[0];
          Graph.scale++;

          use.setAttribute('transform', 'translate(' + (-250 * (Graph.scale - 1)) + ',' + (-250 * (Graph.scale - 1)) + ') scale(' + Graph.scale + ')');
        } else if ((e.which == 40) && e.shiftKey) {
          //console.log("afdas");
          var use = document.getElementsByTagName('use')[0];
          if (Graph.scale > 1) {
            Graph.scale--;
          }
          use.setAttribute('transform', 'translate(' + (-250 * (Graph.scale - 1)) + ',' + (-250 * (Graph.scale - 1)) + ') scale(' + Graph.scale + ')');
        } else if (e.which == 37) {

          boxVal = box.split(" ");
          boxVal[0] = parseFloat(boxVal[0]) + Graph.width; //10;//Graph.scale;
          plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
          Graph.updateAxisVals(37);
        } else if (e.which == 38) {
          boxVal = box.split(" ");
          boxVal[1] = parseFloat(boxVal[1]) + Graph.width; //10;//Graph.scale;
          plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
          Graph.updateAxisVals(38);
          e.preventDefault();
        } else if (e.which == 39) {
          boxVal = box.split(" ");
          boxVal[0] = parseFloat(boxVal[0]) - Graph.width; //10;//Graph.scale;
          plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
          Graph.updateAxisVals(39);

        } else if (e.which == 40) {
          boxVal = box.split(" ");
          boxVal[1] = parseFloat(boxVal[1]) - Graph.width; //10;//Graph.scale;
          plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
          Graph.updateAxisVals(40);
          e.preventDefault();
        }


      }
    });

  },
  checkInputs: function() {
    var a = $('#a').val();
    var b = $('#b').val();
    var rectangles = $('#rectangles').val();
    var minY = $('#minY').val();
    var maxY = $('#maxY').val();
    var minX = $('#minX').val();
    var maxX = $('#maxX').val();

    if (a == '' || a == null) {
      throw "Please specify a value for the beginning of the interval."
    }
    if (b == '' || b == null) {
      throw "Please specify a value for the end of the interval."
    }
    if (rectangles == '' || rectangles == null) {
      throw "Please specify a value for the number of rectangles used in the left and right sums."
    }
    if (minY == '' || minY == null || maxY == '' || maxY == null || minX == '' || minX == null || maxX == '' || maxX == null) {
      throw "Please ensure the minX, maxX, minY, and maxY values are defined."
    }
    if ((a + '').indexOf('.') > 0 || (b + '').indexOf('.') > 0 || (rectangles + '').indexOf('.') > 0 || (minX + '').indexOf('.') > 0 || (maxX + '').indexOf('.') > 0 || (minY + '').indexOf('.') > 0 || (maxY + '').indexOf('.') > 0) {
      throw "This interactive requires integer inputs. Please ensure all of your values are integers"
    }
    if (b <= a) {
      throw "It appears that a is greater than or equal to b.  Please check your interval values."
    }
    if (rectangles <= 0) {
      throw "In order to calculate the left and right sum it is required to specify the number of rectangles (N).  It appears you have input either zero or a negative value for N.  Please specify a positive number."
    }
    if (minY >= maxY) {
      throw "The minimum y-value for the graphing window must be less than the maximum y-value."
    }
    if (minX >= maxX) {
      throw "The minimum x-value for the graphing window must be less than the maximum x-value."
    }

  },
  clearGraph: function() {
    var clearAxis = document.getElementById("axis");
    while (clearAxis.firstChild) {
      clearAxis.removeChild(clearAxis.firstChild);
    }

    var clearAxis = document.getElementById('graphContents');
    while (clearAxis.firstChild) {
      clearAxis.removeChild(clearAxis.firstChild);
    }

    var clearAxisLeft = document.getElementById("axisLeft");
    while (clearAxisLeft.firstChild) {
      clearAxisLeft.removeChild(clearAxisLeft.firstChild);
    }

    var clearAxisLeft = document.getElementById('leftGraphContents');
    while (clearAxisLeft.firstChild) {
      clearAxisLeft.removeChild(clearAxisLeft.firstChild);
    }

    var clearAxisIntegral = document.getElementById("axisIntegral");
    while (clearAxisIntegral.firstChild) {
      clearAxisIntegral.removeChild(clearAxisIntegral.firstChild);
    }

    var clearAxisIntegral = document.getElementById('integralGraphContents');
    while (clearAxisIntegral.firstChild) {
      clearAxisIntegral.removeChild(clearAxisIntegral.firstChild);
    }

    var clearAxisRight = document.getElementById("axisRight");
    while (clearAxisRight.firstChild) {
      clearAxisRight.removeChild(clearAxisRight.firstChild);
    }

    var clearAxisRight = document.getElementById('rightGraphContents');
    while (clearAxisRight.firstChild) {
      clearAxisRight.removeChild(clearAxisRight.firstChild);
    }
  },
  drawGraphAxis: function() {

    var svgWidth = 500;
    var svgHeight = 500;
    var use = document.getElementById('use');
    var useLeft = document.getElementById('useLeft');
    var useIntegral = document.getElementById('useIntegral');
    var useRight = document.getElementById('useRight');

    use.setAttribute('transform', 'translate(0,0) scale(1)');
    var plot = document.getElementById('graphContents');
    var plotLeft = document.getElementById('leftGraphContents');
    var plotIntegral = document.getElementById('integralGraphContents');
    var plotRight = document.getElementById('rightGraphContents');
    var box = plot.setAttribute('viewBox', '0 0 500 500');
    var boxLeft = plotLeft.setAttribute('viewBox', '0 0 500 500');
    var boxIntegral = plotIntegral.setAttribute('viewBox', '0 0 500 500');
    var boxRight = plotRight.setAttribute('viewBox', '0 0 500 500');
    var axisLines = document.getElementById('axis');
    var axisLinesLeft = document.getElementById('axisLeft');
    var axisLinesIntegral = document.getElementById('axisIntegral');
    var axisLinesRight = document.getElementById('axisRight');
    
    this.widthx = 460 / Math.abs(parseInt($('#minX').val()) - parseInt($('#maxX').val()));
    var vertical;
    var verticalLeft;
    var verticalIntegral;
    var verticalRight;
    var axisVal;
    var textNode;
    var textNodeLeft;
    var textNodeIntegral;
    var textNodeRight;
    var axisValLeft;
    var axisValRight;
    var axisValIntegral;
    x = parseInt($('#minX').val());
    var i = 20;
    for (j = parseInt($('#minX').val()); j <= parseInt($('#maxX').val()); j++) {


      vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      vertical.setAttribute('d', 'M' + i + ' 20 v' + (svgHeight - 40));
      if (x != 0) {
        vertical.setAttribute('stroke-width', '.5');
      } else {
        vertical.setAttribute('stroke-width', '1');
        vertical.setAttribute('id', 'yAxisLine');
        vertical.setAttribute('stroke', 'black');
      }
      verticalLeft = vertical.cloneNode(true);
      verticalIntegral = vertical.cloneNode(true);
      verticalRight = vertical.cloneNode(true);
      axisLines.appendChild(vertical);
      axisLinesLeft.appendChild(verticalLeft);
      axisLinesIntegral.appendChild(verticalIntegral);
      axisLinesRight.appendChild(verticalRight);
      //set values
      if (x == $('#minX').val() || x == $('#maxX').val() || x == 0) {
        axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        textNode = document.createTextNode(x);
        textNodeLeft = textNode.cloneNode(true);
        textNodeIntegral = textNode.cloneNode(true);
        textNodeRight = textNode.cloneNode(true);
        axisVal.setAttribute('x', i);
        axisVal.setAttribute('id', "x" + x)

        if ((Math.abs(x)) % 2 == 0) {
          axisVal.setAttribute('y', 7);
        } else {
          axisVal.setAttribute('y', 17);
        }
        axisVal.setAttribute('font-size', '7pt');
        axisVal.setAttribute('font-weight', 'lighter');
        axisVal.setAttribute('text-anchor', 'middle');
        axisVal.setAttribute('vector-effect', 'non-scaling-stroke');

        axisValLeft = axisVal.cloneNode(true);
        axisValIntegral = axisVal.cloneNode(true);
        axisValRight = axisVal.cloneNode(true);
        axisVal.appendChild(textNode);
        axisLines.appendChild(axisVal);

        axisValLeft.appendChild(textNodeLeft);
        axisLinesLeft.appendChild(axisValLeft);

        axisValIntegral.appendChild(textNodeIntegral);
        axisLinesIntegral.appendChild(axisValIntegral);

        axisValRight.appendChild(textNodeRight);
        axisLinesRight.appendChild(axisValRight);
      }
      x++;
      i += this.widthx;
    }
    ////console.log(i);
    this.widthy = 460 / Math.abs(parseInt($('#minY').val()) - parseInt($('#maxY').val()));
    x = parseInt($('#maxY').val());
    i = 20;
    var horizontal;
    var horizontalLeft;
    var horizontalIntegral;
    var horizontalRight;
    for (j = parseInt($('#maxY').val()); j >= parseInt($('#minY').val()); j--) {


      horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      horizontal.setAttribute('d', 'M20 ' + i + ' h' + (svgHeight - 40));

      if (x != 0) {
        horizontal.setAttribute('stroke-width', '.5');
      } else {
        horizontal.setAttribute('stroke-width', '1');
        horizontal.setAttribute('id', 'xAxisLine');
        horizontal.setAttribute('stroke', 'black');
      }
      horizontalLeft = horizontal.cloneNode(true);
      horizontalIntegral = horizontal.cloneNode(true);
      horizontalRight = horizontal.cloneNode(true);
      axisLines.appendChild(horizontal);
      axisLinesLeft.appendChild(horizontalLeft);
      axisLinesIntegral.appendChild(horizontalIntegral);
      axisLinesRight.appendChild(horizontalRight);
      //set values
      if (x == $('#minY').val() || x == $('#maxY').val() || x == 0) {
        axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textNode = document.createTextNode(x);
        textNodeLeft = textNode.cloneNode(true);
        textNodeIntegral = textNode.cloneNode(true);
        textNodeRight = textNode.cloneNode(true);
        axisVal.setAttribute('y', i + 3.5);
        axisVal.setAttribute('x', 17);
        axisVal.setAttribute('id', "y" + x)
        axisVal.setAttribute('font-size', '7pt');
        axisVal.setAttribute('font-weight', 'lighter');
        axisVal.setAttribute('text-anchor', 'end');
        axisVal.setAttribute('vector-effect', 'non-scaling-stroke');
        axisValLeft = axisVal.cloneNode(true);
        axisValIntegral = axisVal.cloneNode(true);
        axisValRight = axisVal.cloneNode(true);

        axisVal.appendChild(textNode);
        axisLines.appendChild(axisVal);

        axisValLeft.appendChild(textNodeLeft);
        axisLinesLeft.appendChild(axisValLeft);

        axisValIntegral.appendChild(textNodeIntegral);
        axisLinesIntegral.appendChild(axisValIntegral);

        axisValRight.appendChild(textNodeRight);
        axisLinesRight.appendChild(axisValRight);
      }
      x--;
      i += this.widthy;
    }

  },


  drawGraph: function() {


    var graphContent = document.getElementById('graphContents');
    var graphContentLeft = document.getElementById('leftGraphContents');
    var graphContentIntegral = document.getElementById('integralGraphContents');
    var graphContentRight = document.getElementById('rightGraphContents');
    var worker = new Worker('GraphWorker.js');
    worker.addEventListener('message', function(e) {
      if (e.data.error) {
        $('#popup #message').empty().append(e.data.error);
      } else if (e.data.msg) {
        $('#popup #stage').empty().append(e.data.msg);
      } else {


        var image = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image.setAttribute('d', e.data.Main);
        image.setAttribute('stroke-width', '2');
        image.setAttribute('stroke', 'red');
        image.setAttribute('fill-opacity', 0);
        image.setAttribute('vector-effect', 'non-scaling-stroke');
        var imageLeft = image.cloneNode(true);
        var imageRight = image.cloneNode(true);
        var imageIntegral = image.cloneNode(true);
        graphContent.appendChild(image);
        graphContentLeft.appendChild(imageLeft);
        graphContentIntegral.appendChild(imageIntegral);
        graphContentRight.appendChild(imageRight);
        image2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image2.setAttribute('d', e.data.rect1);
        image2.setAttribute('stroke-width', '2');
        image2.setAttribute('stroke', 'blue');
        image2.setAttribute('fill-opacity', 0);
        image2.setAttribute('vector-effect', 'non-scaling-stroke');
        image2Right = image2.cloneNode(true);
        graphContent.appendChild(image2);
        graphContentRight.appendChild(image2Right);
        image3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image3.setAttribute('d', e.data.rect2);
        image3.setAttribute('stroke-width', '2');
        image3.setAttribute('stroke', 'Green');
        image3.setAttribute('fill-opacity', 0);
        image3.setAttribute('vector-effect', 'non-scaling-stroke');

        image3Left = image3.cloneNode(true);

        graphContent.appendChild(image3);
        graphContentLeft.appendChild(image3Left);
        image4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        image4.setAttribute('d', e.data.shade);
        image4.setAttribute('stroke-width', '2');
        image4.setAttribute('stroke', 'black');
        image4.setAttribute('fill-opacity', 0.5);
        image4.setAttribute('fill', '#999');
        image4.setAttribute('vector-effect', 'non-scaling-stroke');

        graphContentIntegral.appendChild(image4);

        worker.terminate();
        Graph.summations();
      }
    });
    worker.postMessage({ 'equationToEval': Graph.equationToEval, 'tinyX': $("#minX").val(), 'largeX': $("#maxX").val(), 'tinyY': $("#minY").val(), 'largeY': $("#maxY").val(), 'N': parseInt($('#rectangles').val()), 'a': parseInt($('#a').val()), 'b': parseInt($('#b').val()) });

  },
  summations: function() {
    var N = parseInt($('#rectangles').val());
    var a = parseInt($('#a').val());
    var b = parseInt($('#b').val());
    var sumWork = new Worker("SummationWorker.js");
    sumWork.addEventListener('message', function(e) {
      if (e.data.msg) {
        $('#popup #stage').empty().append(e.data.msg);
      } else {
        Graph.rightSumValue = e.data.Right;
        MathJax.Hub.Queue(function() {
          if (Graph.rightSumValue != "diverges") {
            var rightSum = "<math><mstyle displaystyle='true'><msub><mi>R</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mi></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
            $('#rightSum').empty().append(rightSum + "<mn>" + Graph.rightSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
          } else {
            $('#rightSum').empty().append("Right Sum diverges");
          }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

        Graph.leftSumValue = e.data.Left;
        MathJax.Hub.Queue(function() {
          if (Graph.leftSumValue != "diverges") {
            var leftSum = "<math><mstyle displaystyle='true'><msub><mi>L</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mn></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mrow><mi>i</mi><mo>&#x2212;</mo><mn>1</mn></mrow></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
            $('#leftSum').empty().append(leftSum + "<mn>" + Graph.leftSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
          } else {
            $('#leftSum').empty().append("Left Sum diverges");
          }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        Graph.integralValue = e.data.Integral;
        MathJax.Hub.Queue(function() {
          if (Graph.integralValue != "diverges" && !isNaN(Graph.integralValue)) {
            $('#integral').empty().append("`int_(" + a + ")^(" + b + ")" + Graph.equationToEval + " dx = " + Graph.integralValue + "`");
          } else {
            $('#integral').empty().append("`int_(" + a + ")^(" + b + ")" + Graph.equationToEval + " dx `" + " " + Graph.integralValue);
          }
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        sumWork.terminate();
        $('#popup').toggleClass("none");
      }
    });
    sumWork.postMessage({ 'equationToEval': Graph.equationToEval, 'tinyX': $("#minX").val(), 'largeX': $("#maxX").val(), 'tinyY': $("#minY").val(), 'largeY': $("#maxY").val(), 'N': parseInt($('#rectangles').val()), 'a': parseInt($('#a').val()), 'b': parseInt($('#b').val()) });
  },


  createEquation: function() {
    MathJax.Hub.Queue(function() { document.getElementById('equationList').innerHTML = "`f(x)=" + Graph.equationToEval + "`" });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

  },


  evaluateEquation: function(x) {
    var a = math.eval(((Graph.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")));
    if (!isNaN(a)) {
      return parseFloat(parseFloat(math.eval(((Graph.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
    } else {
      return NaN
    }
    //return parseFloat(parseFloat(math.eval(((Graph.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
  },

  updateAxisVals: function(direct) {
    switch (direct) {
      case 37:
        var curVal = parseInt($('#minX').val());
        curVal++;
        document.getElementById('minX').value = curVal;
        var curVal = parseInt($('#maxX').val());
        curVal++;
        document.getElementById('maxX').value = curVal;

        break;
      case 38:
        var curVal = parseInt($('#minY').val());
        curVal--;
        document.getElementById('minY').value = curVal;
        var curVal = parseInt($('#maxY').val());
        curVal--;
        document.getElementById('maxY').value = curVal;
        break;
      case 39:
        var curVal = parseInt($('#minX').val());
        curVal--;
        document.getElementById('minX').value = curVal;
        var curVal = parseInt($('#maxX').val());
        curVal--;
        document.getElementById('maxX').value = curVal;
        break;
      case 40:
        var curVal = parseInt($('#minY').val());
        curVal++;
        document.getElementById('minY').value = curVal;
        var curVal = parseInt($('#maxY').val());
        curVal++;
        document.getElementById('maxY').value = curVal;
        break;
      default:
        //console.log("Encountered an error updating Axis Values");


    }
    Graph.clearGraph();
    Graph.drawGraphAxis();
    if (Graph.numGraphDrawn > 0) {
      Graph.drawGraph();
    }

  }

}

$(document).ready(function() {
  Graph.init();
});
