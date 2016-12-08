self.addEventListener('message',function(e){
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
        
        self.postMessage({"error" : "An error has been encountered while attempting to evaluate the given expression.  We will continue to attempt graphing the function, however the output may not be correct."});
        
            return Math.pow(a, b);
        
        
      } finally {
        
      }
    }
    self.postMessage({'msg' : 'Graphing'});
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

    var yVal = evaluateEquation(equationToEval,xVal);

    var prevY = null;
    widthx = 460 / Math.abs(parseInt(tinyX) - parseInt(largeX));
    resolution = widthx;
    yAxisPosition = 20 + (-1 * widthx * (parseInt(tinyX)));
    widthy = 460 / Math.abs(parseInt(tinyY) - parseInt(largeY));
    xAxisPosition = 20 + (widthy * (parseInt(largeY)));

    if (isFinite(yVal) && !isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {
      var path = "M20 " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
    } else {
      var path = "";
      if (yVal >= parseInt(largeY)) {
        high = true;
      } else if (yVal <= parseInt(tinyY)) {
        low = true;
      } else {
        nully = true;
      }
    }

    for (var i = (20); i < (svgWidth - 20); i += widthx) {
      for (var j = 1; j <= resolution; j++) {
        
        
        yVal = evaluateEquation(equationToEval,xVal + (j / resolution));


        if (!isNaN(yVal) && yVal <= parseInt(largeY) && yVal >= parseInt(tinyY)) {
          if (nully) {
            nully = false;
            if (!isNaN(prevY) && isFinite(prevY)) {
              ////console.log("enter");
              path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(prevY * widthy)) + " ";

            } else {
              // if (!isFinite(prevY)) {
              //   if (prevY > 0) {
              //     path += "M" + (yAxisPosition + parseFloat((xVal + ((j) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat((largeY+2000) * widthy)) + " ";
              //   } else {
              //     path += "M" + (yAxisPosition + parseFloat((xVal + ((j) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat((tinyY-2000) * widthy)) + " ";
              //   }
              // } else {
                path += "M" + (yAxisPosition + parseFloat((xVal + ((j) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
              //}
            }
            //console.log(path);
          }

          if ((yVal <= parseInt(largeY)) && (yVal >= parseInt(tinyY)) && (isFinite(yVal)) && !(isNaN(yVal))) {
            if (infinity) {

              infinity = false;
              if (prevYVal > 0) {
                path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(largeY) * widthy) + " ";
                ////console.log("M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(largeY) * widthy) + " ");
              } else {
                path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(tinyY) * widthy) + " ";
                ////console.log("M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(tinyY) * widthy) + " ");
              }
            }
            if (high) {
              high = false;
              //path += backToBelowUpper((parseInt(largeY)), (xVal + (j / resolution)), ((1 / resolution) / 100));
              if (Math.abs(largeY) >= Math.abs(tinyY)) {
                tempMax = Math.abs(largeY);
              } else {
                tempMax = Math.abs(tinyY);
              }
              if (Math.abs(prevY) <= tempMax + 2000) {
                //use proportion to find appropriate x value for the corresonding max or min y value being crossed
                path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(prevY * widthy)) + " ";
              } else {
                if (prevY > parseInt(largeY)) {
                  path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
                } else {
                  path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
                }
              }
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";

            }
            if (low) {
              low = false;
              //path += backToAboveLower((parseInt(tinyY)), (xVal + (j / resolution)), ((1 / resolution) / 100));
              if (Math.abs(largeY) >= Math.abs(tinyY)) {
                tempMax = Math.abs(largeY);
              } else {
                tempMax = Math.abs(tinyY);
              }
              if (Math.abs(prevY) <= tempMax + 2000) {
                //use proportion to find appropriate x value for the corresonding max or min y value being crossed

                path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(prevY * widthy)) + " ";
              } else {
                if (prevY > parseInt(largeY)) {
                  path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
                } else {
                  path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
                }
              }
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
            }
            if (infinity) {

              infinity = false;
              if (prevYVal > 0) {
                path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(largeY) * widthy) + " ";
                ////console.log("M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(largeY) * widthy) + " ");
              } else {
                path += "M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(tinyY) * widthy) + " ";
                ////console.log("M" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + parseFloat(parseInt(tinyY) * widthy) + " ");
              }
            }
            if (!high && !low && !infinity) {
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
            }
          } else {
            if (isNaN(yVal)) {

            } else if (yVal > parseInt(largeY) && isFinite(yVal) && !high) {
              high = true;
              path += outsideUpperRange((parseInt(largeY)), (xVal + (j / resolution)), ((1 / resolution) / 100));
            } else if (yVal < parseInt(tinyY) && isFinite(yVal) && !low) {
              path += outsideLowerRange((parseInt(tinyY)), (xVal + (j / resolution)), ((1 / resolution) / 100));
              low = true;
            } else if (!isFinite(yVal)) {
              ////console.log("entered inf");

              infinity = true;
            }

          }


          prevY = yVal;
        } else if (prevY != null && prevY <= parseInt(largeY) && prevY >= parseInt(tinyY) && !isNaN(yVal)) {
          //console.log(yVal);
          if (Math.abs(largeY) >= Math.abs(tinyY)) {
            tempMax = Math.abs(largeY);
          } else {
            tempMax = Math.abs(tinyY);
          }
          if (Math.abs(yVal) <= tempMax + 2000) {
            path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
          } else {
            if (yVal > parseInt(largeY)) {
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
            } else {
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
            }
          }
          prevY = yVal;

        } else if (prevY != null && prevY >= parseInt(largeY) && yVal <= parseInt(tinyY)) {
          ////console.log(yVal);
          if (Math.abs(largeY) >= Math.abs(tinyY)) {
            tempMax = Math.abs(largeY);
          } else {
            tempMax = Math.abs(tinyY);
          }
          if (Math.abs(yVal) <= tempMax + 2000 && Math.abs(prevYVal) <= tempMax + 2000) {
            path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(prevY * widthy)) + " ";
            path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
          } else {
            if (yVal > parseInt(largeY)) {
              path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
            } else {
              path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
            }
          }
          prevY = yVal;

        } else if (prevY != null && yVal >= parseInt(largeY) && prevY <= parseInt(tinyY)) {
          ////console.log(yVal);
          if (Math.abs(largeY) >= Math.abs(tinyY)) {
            tempMax = Math.abs(largeY);
          } else {
            tempMax = Math.abs(tinyY);
          }
          if (Math.abs(yVal) <= tempMax + 2000 && Math.abs(prevYVal) <= tempMax + 2000) {
            path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(prevY * widthy)) + " ";
            path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(yVal * widthy)) + " ";
          } else {
            if (yVal > parseInt(largeY)) {
              path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(largeY * widthy)) + " ";
            } else {
              path += "M" + (yAxisPosition + parseFloat((xVal + ((j - 1) / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
              path += "L" + (yAxisPosition + parseFloat((xVal + (j / resolution)) * (widthx))) + " " + (xAxisPosition - parseFloat(tinyY * widthy)) + " ";
            }
          }
          prevY = yVal;

        } else {
          if (isNaN(yVal)) {
            nully = true;
          }
          prevY = yVal;
        }
      }
      xVal++;
      ////console.log(xVal);
    }
    var dataToPass={};
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
var evaluateEquation = function(equationToEval,x){
  
    var a = math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")));
    if (!isNaN(a)) {
      return parseFloat(parseFloat(math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
    } else {
      return NaN
    }
    //return parseFloat(parseFloat(math.eval(((equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
  }
