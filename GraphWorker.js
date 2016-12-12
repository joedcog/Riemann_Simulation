self.addEventListener('message', function(e) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.7.0/math.js');
  math.pow = function(a, b) {
    try {
      var bb = math.fraction(b);
      //console.log(bb.d);
      if (a < 0 && bb.d % 2 == 1 && bb.d != 1) {
        return -1 * Math.pow(-1 * a, b);
      } else {
        return Math.pow(a, b);
      }
    } catch (e) {

      self.postMessage({ "error": "An error has been encountered while attempting to evaluate the given expression.  We will continue to attempt graphing the function, however the output may not be correct." });

      return Math.pow(a, b);


    } finally {

    }
  }
  self.postMessage({ 'msg': 'Graphing' });
  var svgWidth = 500;
  var svgHeight = 500;
  var stopDraw = false;
  var high = false;
  var infinity = false;
  var low = false;
  var prevXVal = "";
  var prevYVal = "";
  var nully = false;
  var equationToEval = e.data.equationToEval;
  var tinyX = e.data.tinyX;
  var largeX = e.data.largeX;
  var tinyY = e.data.tinyY;
  var largeY = e.data.largeY;

  //resolution = parseInt($('#resolution').val());
  // resolution = 50;


  var xVal = parseInt(tinyX); //need object variable to keep up with xVal showing in graph

  var yVal = evaluateEquation(equationToEval, xVal);

  var prevY = null;
  widthx = 460 / Math.abs(parseInt(tinyX) - parseInt(largeX));
  resolution = widthx;
  yAxisPosition = 20 + (-1 * widthx * (parseInt(tinyX)));
  widthy = 460 / Math.abs(parseInt(tinyY) - parseInt(largeY));
  xAxisPosition = 20 + (widthy * (parseInt(largeY)));

  // if (isFinite(yVal) && !isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {
  //   var path = "M20 " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
  // } else {
  //   var path = "";
  // }
  var path = "";

  for (var i = (20); i < (svgWidth - 20); i += widthx) {
    for (var j = 1; j <= resolution; j++) {


      yVal = evaluateEquation(equationToEval, xVal + (j / resolution));


      if (!isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY) && (isFinite(yVal))) {
        if ((isNaN(prevY) || path == "" || !isFinite(prevY)) && prevY >= parseInt(tinyY) && prevY <= parseInt(largeY)) {
          path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
          path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
        } else if (prevY < parseInt(tinyY)) {//from below window back onto window
          if(isFinite(prevY)){
            tempM = (yVal - prevY) * resolution;
            tempB = tempM * (xVal + (j / resolution)) + (yVal);
            tempXValue = -1 * (parseInt(tinyY) - tempB) / tempM;
            console.log(tempM + ' ' + ' ' + tempB + ' ' + tempXValue + '  ' + (xVal + (j / resolution)) + ' ' + yVal + ' ' + (xVal + ((j - 1) / resolution)) + ' ' + prevY);
            path += "M" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(tinyY) * widthy)) + " ";
            path += "L" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(tinyY) * widthy)) + " ";
          
          }
        } else if (prevY > parseInt(largeY)) {//from above window back onto window
          if(isFinite(prevY)){
            tempM = (yVal - prevY) * resolution;
            tempB = tempM * (xVal + (j / resolution)) + (yVal);
            tempXValue = -1 * (parseInt(largeY) - tempB) / tempM;
            console.log(tempM + ' ' + ' ' + tempB + ' ' + tempXValue + '  ' + (xVal + (j / resolution)) + ' ' + yVal + ' ' + (xVal + ((j - 1) / resolution)) + ' ' + prevY);
            path += "M" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(largeY) * widthy)) + " ";
            path += "L" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(largeY) * widthy)) + " ";
          
          }
        } else if (isNaN(prevY) || path == "" || !isFinite(prevY)){//basically catch if graph is undefined from minX to some other xValue
          path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
          path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
        
        }else {
          path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
        }
      } else if (isNaN(yVal) && path != "") {
        //I don't think I need to handle this as it should be handled by the check for prevY isNaN in first if
        //might show warning however and is useful for summation and integration.
      } else if (!isFinite(yVal) && path != "") {
        if (yVal > parseInt(largeY)) {
          //positive inf

        } else {
          //neg inf
        }
      } else if (yVal > parseInt(largeY) && prevY < parseInt(tinyY)) { //handle extremely fast changes that would not be graphed
      } else if (yVal < parseInt(tinyY) && prevY > parseInt(largeY)) { //handle extremely fast changes that would not be graphed
      } else if (yVal > parseInt(largeY) && path != "") {
        if (prevY < parseInt(largeY)) { //only draw if previous value was on graph and current value goes off graph

          if (isFinite(prevY)) {
            tempM = (yVal - prevY) * resolution;
            tempB = tempM * (xVal + (j / resolution)) + (yVal);
            tempXValue = -1 * (parseInt(largeY) - tempB) / tempM;
            console.log(tempM + ' ' + ' ' + tempB + ' ' + tempXValue + '  ' + (xVal + (j / resolution)) + ' ' + yVal + ' ' + (xVal + ((j - 1) / resolution)) + ' ' + prevY);

            path += "L" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(largeY) * widthy)) + " ";
          } else {//prevY is neg inf
            
          }

        }
      } else if (yVal < parseInt(tinyY) && path != "") {
        if (prevY > parseInt(tinyY)) { //only draw if previous value was on graph and current value goes off graph

          if (isFinite(prevY)) {
            tempM = (yVal - prevY) * resolution;
            tempB = tempM * (xVal + (j / resolution)) + (yVal);
            tempXValue = -1 * (parseInt(tinyY) - tempB) / tempM;
            console.log(tempM + ' ' + ' ' + tempB + ' ' + tempXValue + '  ' + (xVal + (j / resolution)) + ' ' + yVal + ' ' + (xVal + ((j - 1) / resolution)) + ' ' + prevY);

            path += "L" + (yAxisPosition + parseFloat(tempXValue * (widthx))) + " " + (xAxisPosition - parseFloat(parseInt(tinyY) * widthy)) + " ";
          } else {//prevY is pos inf
            
          }
        }
      }
      prevY = yVal;
    }

    xVal++;
    ////console.log(xVal);
  }
  var dataToPass = {};
  dataToPass.Main = path;
  ////console.log(path);
  ////console.log(path);
  //path = convertSciPath(path);
  ////console.log(path);
  var N = e.data.N;
  var a = e.data.a;
  var b = e.data.b;
  ////console.log(N + " " + a + " " + b);
  xVal = b;
  path = "M" + (20 + widthx * (b - parseInt(tinyX))) + " " + xAxisPosition;
  for (var K = 1; K <= N; K++) {

    yVal = evaluateEquation(equationToEval, xVal);
    if (isFinite(yVal) && !isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {
      path = path + " v" + -1 * (parseFloat(yVal * widthy)) + " h" + (-1 * (((widthx * ((b - a) / N))))) + " v" + ((parseFloat(yVal * widthy)));
    } else {
      if (isNaN(yVal)) {
        path = "";
        break;
      }
      if (yVal > parseInt(largeY)) {
        path = path + " v" + -1 * (parseFloat(largeY * widthy)) + " m" + (-1 * (((widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(largeY * widthy)));
      } else {
        path = path + " v" + -1 * (parseFloat(tinyY * widthy)) + " m" + (-1 * (((widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(tinyY * widthy)));
      }
    }
    xVal = xVal - ((b - a) / N);

  }
  dataToPass.rect1 = path;
  xVal = a;
  path = "M" + (20 + widthx * (a - parseInt(tinyX))) + " " + xAxisPosition;
  for (var K = 1; K <= N; K++) {

    yVal = evaluateEquation(equationToEval, xVal);
    if (isFinite(yVal) && !isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {
      path = path + " v" + -1 * (parseFloat(yVal * widthy)) + " h" + (widthx * ((b - a) / N)) + " v" + ((parseFloat(yVal * widthy)));
    } else {
      if (isNaN(yVal)) {
        path = "";
        break;
      }
      if (yVal > parseInt(largeY)) {
        path = path + " v" + -1 * (parseFloat(largeY * widthy)) + " m" + (widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(largeY * widthy)));
      } else {
        path = path + " v" + -1 * (parseFloat(tinyY * widthy)) + " m" + (widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(tinyY * widthy)));
      }

    }
    xVal = xVal + ((b - a) / N);

  }
  dataToPass.rect2 = path;
  xVal = a;
  var highup = 0;
  path = "M" + (20 + widthx * (a - parseInt(tinyX))) + " " + xAxisPosition;
  for (var K = xVal; K <= b; K += (1 / resolution)) {
    K = parseFloat(K.toFixed(6));

    yVal = evaluateEquation(equationToEval, K);
    if (!isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {

      if (isFinite(yVal)) {
        path += "L" + (yAxisPosition + parseFloat((K) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
      } else {
        path += " V" + (xAxisPosition);
        //console.log("asymptote in shaded region");
      }
    } else {
      if (isNaN(yVal)) {
        path = "";
        //console.log(yVal + ' ' + K);
        break;
      }
      if (yVal > parseInt(largeY)) {
        path += "L" + (yAxisPosition + parseFloat((K) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy + 30)) + " ";
      } else {
        path += "L" + (yAxisPosition + parseFloat((K) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy - 30)) + " ";
      }
    }


  }
  if (path.length > 0) {
    //if (isFinite(yVal)) {
    // //console.log(parseFloat(yVal * widthy))
    path += "L" + (yAxisPosition + parseFloat(b * (widthx))) + " " + (xAxisPosition) + " ";
    //}


    path += "z";
  }
  dataToPass.shade = path;
  self.postMessage(dataToPass);
});
var evaluateEquation = function(equationToEval, x) {

  var a = math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")));
  if (!isNaN(a)) {
    return parseFloat(parseFloat(math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
  } else {
    return NaN
  }
  //return parseFloat(parseFloat(math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
}
