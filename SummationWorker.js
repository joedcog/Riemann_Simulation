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
    self.postMessage({'msg' : 'Calculating Right Sum'});
    var rightSumValue = 0;
    var equationToEval = e.data.equationToEval;
		var N = e.data.N;
    var a = e.data.a;
    var b = e.data.b;
    var xVal = b;
    var tempRight = 0;
    for (var i = 0; i < N; i++) {
      tempRight = (evaluateEquation(equationToEval, xVal) * ((b - a) / N));
      rightSumValue += tempRight;
      if (!isFinite(tempRight)) {
        rightSumValue = "diverges";
        break;
      }
      xVal = xVal - ((b - a) / N);
    }
    if (rightSumValue != "diverges") {
      rightSumValue = parseFloat(rightSumValue.toFixed(3));
      if (rightSumValue.toString().length >= 8) {
        rightSumValue = rightSumValue.toExponential(3);
      }
    }
    var dataToPost = {};
    dataToPost.Right = rightSumValue;
    self.postMessage({'msg' : 'Calculating Left Sum'});
    var leftSumValue = 0;
    var xVal = a;
    var tempLeft = 0;
    for (var i = 0; i < N; i++) {
      tempLeft = (evaluateEquation(equationToEval, xVal) * ((b - a) / N));
      leftSumValue += parseFloat(tempLeft.toFixed(6));
      if (!isFinite(tempLeft)) {
        leftSumValue = "diverges";
        break;
      }
      xVal = xVal + ((b - a) / N);
    }
    if (leftSumValue != "diverges") {
      leftSumValue = parseFloat(leftSumValue.toFixed(3));
      if (leftSumValue.toString().length >= 8) {
        leftSumValue = leftSumValue.toExponential(3);
      }
    }
    dataToPost.Left = leftSumValue;
    self.postMessage({'msg' : 'Calculating Integral'});
    integralValue = 0;
    var xVal = b;
    var size = 350;
    var tempY = 0;
    var prevYVal = 0;
    for (var i = 0; i < size * (b - a); i++) {
      if (xVal - (1 / size) < a) {
        tempY = ((evaluateEquation(equationToEval, xVal) + evaluateEquation(equationToEval, a)) * .5 * (1 / size));
      } else {
        tempY = ((evaluateEquation(equationToEval, xVal) + evaluateEquation(equationToEval, xVal - (1 / size))) * .5 * (1 / size));
      }
      ////console.log(tempY + ' ' + (xVal-(1/size)));
      // integralValue +   = parseFloat(tempY.toFixed(6));
      // xVal = xVal - (1 / size);
      if (i > 0) {
        if (!isFinite(tempY)) {
          integralValue = "diverges";
          //console.log("asymptote in sum");
          break;
        } //else if (Math.abs((tempY - prevYVal) / (1 / size)) >= 9999999) {
        else if (isNaN(tempY)) {
          integralValue = "diverges";
          break;
        } else {
          integralValue += parseFloat(tempY.toFixed(6));

        }
      } else {
        if (isFinite(tempY) && !isNaN(tempY)) {
          integralValue += parseFloat(tempY.toFixed(6));

        } else if (isNaN(tempY)) {
          integralValue += parseFloat(evaluateEquation(equationToEval, xVal - (1 / (size * 100))) * (1 / size));
        }
      }
      xVal = xVal - (1 / size);
      prevYVal = tempY;

    }

    tempY = 0;
    var prevYVal = 0;
    var temporary = 0;

    if (integralValue != "diverges" && !isNaN(integralValue)) {
      //integralValue = (integralValue + temporary) / 2;

      integralValue = parseFloat(integralValue.toFixed(3));

      if (integralValue.toString().length >= 8) {
        integralValue = integralValue.toExponential(3);
      }
    }
    dataToPost.Integral = integralValue;
    self.postMessage(dataToPost);
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