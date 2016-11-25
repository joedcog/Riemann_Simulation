var Graph = function(id, equationToEval, a, b, N, type) {
    this.equationToEval = equationToEval;
    this.minX = -10;
    this.maxX = 10;
    this.minY = -10;
    this.maxY = 10;
    this.widthx = 0;
    this.widthy = 0;
    this.resolution = 1;
    this.scale = 1;
    this.yAxisPosition = 0;
    this.xAxisPosition = 0;
    this.leftSumValue = 0;
    this.rightSumValue = 0;
    this.integralValue = 0;
    this.id = id;
    this.a = a;
    this.b = b;
    this.N = N;
    this.type = type;

    this.init = function() {
        var figure = document.createElement('figure');
        figure.setAttribute('id',this.id+"figure");
        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox',"0 0 500 500");
        var axisSym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        axisSym.setAttribute('id',this.id+"AxisSymbol");

        var axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        axisG.setAttribute('id',"axis"+this.id);
        axisG.setAttribute('stroke',"#999999");
        var graphG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('id','use'+this.id);
        use.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#'+this.id+'GraphContents');
        var graphsym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        graphsym.setAttribute('id',this.id+'GraphContents');
        graphsym.setAttribute('viewBox',"0 0 500 500");
        graphsym.setAttribute('width','100%');
        graphsym.setAttribute('height','100%');

        
       
        graphG.appendChild(use);
        svg.appendChild(axisSym);
        svg.appendChild(axisG);
        svg.appendChild(graphG);
        svg.appendChild(graphsym);
        figure.appendChild(svg);
        if(this.type == 'integral' || this.type == 'leftsum' || this.type == 'rightsum'){
            var figcap = document.createElement('figcaption');
            figcap.setAttribute('id',this.id+'Sum');
            figure.appendChild(figcap);
        }
        document.getElementById(this.id).appendChild(figure);
        


        
        
        //this.drawGraphAxis();


        // $(document).keydown(function(e) {
        //     var plot = document.getElementsByTagName('symbol')[1];
        //     var box = plot.getAttribute('viewBox');
        //     if ($('#graphContainer').is(":focus")) {
        //         if ((e.which == 38) && e.shiftKey) {
        //             console.log("afdas");
        //             var use = document.getElementsByTagName('use')[0];
        //             this.scale++;

        //             use.setAttribute('transform', 'translate(' + (-250 * (this.scale - 1)) + ',' + (-250 * (this.scale - 1)) + ') scale(' + this.scale + ')');
        //         } else if ((e.which == 40) && e.shiftKey) {
        //             console.log("afdas");
        //             var use = document.getElementsByTagName('use')[0];
        //             if (this.scale > 1) {
        //                 this.scale--;
        //             }
        //             use.setAttribute('transform', 'translate(' + (-250 * (this.scale - 1)) + ',' + (-250 * (this.scale - 1)) + ') scale(' + this.scale + ')');
        //         } else if (e.which == 37) {

        //             boxVal = box.split(" ");
        //             boxVal[0] = parseFloat(boxVal[0]) + this.width; //10;//this.scale;
        //             plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
        //             this.updateAxisVals(37);
        //         } else if (e.which == 38) {
        //             boxVal = box.split(" ");
        //             boxVal[1] = parseFloat(boxVal[1]) + this.width; //10;//this.scale;
        //             plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
        //             this.updateAxisVals(38);
        //             e.preventDefault();
        //         } else if (e.which == 39) {
        //             boxVal = box.split(" ");
        //             boxVal[0] = parseFloat(boxVal[0]) - this.width; //10;//this.scale;
        //             plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
        //             this.updateAxisVals(39);

        //         } else if (e.which == 40) {
        //             boxVal = box.split(" ");
        //             boxVal[1] = parseFloat(boxVal[1]) - this.width; //10;//this.scale;
        //             plot.setAttribute('viewBox', boxVal[0] + " " + boxVal[1] + " 500 500");
        //             this.updateAxisVals(40);
        //             e.preventDefault();
        //         }


        //     }
        // });

    };
    this.clearGraph = function() {
        var clearAxis = document.getElementById(this.id+'GraphContents');
        while (clearAxis.firstChild) {
            clearAxis.removeChild(clearAxis.firstChild);
        }

    };
    this.drawGraphAxis = function() {
        
        var svgWidth = 500;
        var svgHeight = 500;
        var use = document.getElementById('use'+this.id);
        // var useLeft = document.getElementById('useLeft');
        // var useIntegral = document.getElementById('useIntegral');
        // var useRight = document.getElementById('useRight');

        use.setAttribute('transform', 'translate(0,0) scale(1)');
        var plot = document.getElementById(this.id+'GraphContents');
        // var plotLeft = document.getElementById('leftGraphContents');
        // var plotIntegral = document.getElementById('integralGraphContents');
        // var plotRight = document.getElementById('rightGraphContents');
        var box = plot.setAttribute('viewBox', '0 0 500 500');
        // var boxLeft = plotLeft.setAttribute('viewBox', '0 0 500 500');
        // var boxIntegral = plotIntegral.setAttribute('viewBox', '0 0 500 500');
        // var boxRight = plotRight.setAttribute('viewBox', '0 0 500 500');
        var axisLines = document.getElementById('axis'+this.id);
        // var axisLinesLeft = document.getElementById('axisLeft');
        // var axisLinesIntegral = document.getElementById('axisIntegral');
        // var axisLinesRight = document.getElementById('axisRight');

        this.width = 460 / Math.abs(this.minX - this.maxX);

        x = this.minX;
        var i = 20;
        for (j = this.minX; j <= this.maxX; j++) {


            var vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            vertical.setAttribute('d', 'M' + i + ' 20 v' + (svgHeight - 40));
            if (x != 0) {
                vertical.setAttribute('stroke-width', '.5');
            } else {
                vertical.setAttribute('stroke-width', '1');
                vertical.setAttribute('id', 'yAxisLine');
                vertical.setAttribute('stroke', 'black');
            }
            // var verticalLeft = vertical.cloneNode(true);
            // var verticalIntegral = vertical.cloneNode(true);
            // var verticalRight = vertical.cloneNode(true);
            axisLines.appendChild(vertical);
            // axisLinesLeft.appendChild(verticalLeft);
            // axisLinesIntegral.appendChild(verticalIntegral);
            // axisLinesRight.appendChild(verticalRight);
            //set values
            var axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');

            var textNode = document.createTextNode(x);
            // var textNodeLeft = textNode.cloneNode(true);
            // var textNodeIntegral = textNode.cloneNode(true);
            // var textNodeRight = textNode.cloneNode(true);
            axisVal.setAttribute('x', i);
            axisVal.setAttribute('id', "x" + x)

            if ((Math.abs(x)) % 2 == 1) {
                axisVal.setAttribute('y', 7);
            } else {
                axisVal.setAttribute('y', 17);
            }
            axisVal.setAttribute('font-size', '7pt');
            axisVal.setAttribute('font-weight', 'lighter');
            axisVal.setAttribute('text-anchor', 'middle');
            axisVal.setAttribute('vector-effect', 'non-scaling-stroke');

            // var axisValLeft = axisVal.cloneNode(true);
            // var axisValIntegral = axisVal.cloneNode(true);
            // var axisValRight = axisVal.cloneNode(true);
            axisVal.appendChild(textNode);
            axisLines.appendChild(axisVal);

            // axisValLeft.appendChild(textNodeLeft);
            // axisLinesLeft.appendChild(axisValLeft);

            // axisValIntegral.appendChild(textNodeIntegral);
            // axisLinesIntegral.appendChild(axisValIntegral);

            // axisValRight.appendChild(textNodeRight);
            // axisLinesRight.appendChild(axisValRight);
            x++;
            i += this.width;
        }
        //console.log(i);
        this.width = 460 / Math.abs(this.minY - this.maxY);
        x = this.maxY;
        i = 20;
        for (j = this.maxY; j >= this.minY; j--) {


            var horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            horizontal.setAttribute('d', 'M20 ' + i + ' h' + (svgHeight - 40));

            if (x != 0) {
                horizontal.setAttribute('stroke-width', '.5');
            } else {
                horizontal.setAttribute('stroke-width', '1');
                horizontal.setAttribute('id', 'xAxisLine');
                horizontal.setAttribute('stroke', 'black');
            }
            // var horizontalLeft = horizontal.cloneNode(true);
            // var horizontalIntegral = horizontal.cloneNode(true);
            // var horizontalRight = horizontal.cloneNode(true);
            axisLines.appendChild(horizontal);
            // axisLinesLeft.appendChild(horizontalLeft);
            // axisLinesIntegral.appendChild(horizontalIntegral);
            // axisLinesRight.appendChild(horizontalRight);
            //set values
            var axisVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var textNode = document.createTextNode(x);
            // var textNodeLeft = textNode.cloneNode(true);
            // var textNodeIntegral = textNode.cloneNode(true);
            // var textNodeRight = textNode.cloneNode(true);
            axisVal.setAttribute('y', i + 3.5);
            axisVal.setAttribute('x', 17);
            axisVal.setAttribute('id', "y" + x)
            axisVal.setAttribute('font-size', '7pt');
            axisVal.setAttribute('font-weight', 'lighter');
            axisVal.setAttribute('text-anchor', 'end');
            axisVal.setAttribute('vector-effect', 'non-scaling-stroke');
            // var axisValLeft = axisVal.cloneNode(true);
            // var axisValIntegral = axisVal.cloneNode(true);
            // var axisValRight = axisVal.cloneNode(true);

            axisVal.appendChild(textNode);
            axisLines.appendChild(axisVal);

            // axisValLeft.appendChild(textNodeLeft);
            // axisLinesLeft.appendChild(axisValLeft);

            // axisValIntegral.appendChild(textNodeIntegral);
            // axisLinesIntegral.appendChild(axisValIntegral);

            // axisValRight.appendChild(textNodeRight);
            // axisLinesRight.appendChild(axisValRight);
            x--;
            i += this.width;
        }

    };



    this.drawGraph = function() {
        
        this.clearGraph();
        var svgWidth = 500;
        var svgHeight = 500;
        var stopDraw = false;
        var high = false;
        var infinity = false;
        var low = false;
        var prevXVal = "";
        var prevYVal = "";
        var nully = false;
        
        //this.resolution = parseInt($('#resolution').val());
        this.resolution = 100;
        var graphContent = document.getElementById(this.id+'GraphContents');
        //console.log(graphContent);
        // var graphContentLeft = document.getElementById('leftGraphContents');
        // var graphContentIntegral = document.getElementById('integralGraphContents');
        // var graphContentRight = document.getElementById('rightGraphContents');

        var xVal = this.minX; //need object variable to keep up with xVal showing in graph

        var yVal = this.evaluateEquation(xVal);
        //console.log(yVal);
        var prevY = 0;
        this.widthx = 460 / Math.abs(this.minX - this.maxX);
        this.yAxisPosition = 20 + (-1 * this.widthx * (this.minX));
        this.widthy = 460 / Math.abs(this.minY - this.maxY);
        this.xAxisPosition = 20 + (this.widthy * (this.maxY));

        if (!isNaN(yVal) && yVal <= this.maxY && yVal >= this.minY) {
            var path = "M20 " + (this.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
        } else {
            var path = "";
            nully = true;
        }

        for (var i = (20); i <= (svgWidth - 20); i += this.widthx) {
            for (var j = 1; j <= this.resolution; j++) {
                var image = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                var yVal = this.evaluateEquation(xVal + (j / this.resolution));

                if (!isNaN(yVal)) {
                    if (nully) {
                        nully = false;
                        //console.log("enter");
                        path += "M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
                        //console.log(path);
                    }

                    if ((yVal <= this.maxY) && (yVal >= this.minY) && (isFinite(yVal)) && !(isNaN(yVal))) {
                        if (infinity) {

                            infinity = false;
                            if (prevYVal > 0) {
                                path += "M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.maxY * this.widthy) + " ";
                                //console.log("M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.maxY * this.widthy) + " ");
                            } else {
                                path += "M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.minY * this.widthy) + " ";
                                //console.log("M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.minY * this.widthy) + " ");
                            }
                        }
                        if (high) {
                            high = false;
                            path += this.backToBelowUpper((this.maxY), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                        }
                        if (low) {
                            low = false;
                            path += this.backToAboveLower((this.minY), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                        }
                        if (infinity) {

                            infinity = false;
                            if (prevYVal > 0) {
                                path += "M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.maxY * this.widthy) + " ";
                                //console.log("M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.maxY * this.widthy) + " ");
                            } else {
                                path += "M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.minY * this.widthy) + " ";
                                //console.log("M" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + parseFloat(this.minY * this.widthy) + " ");
                            }
                        }
                        if (!high && !low && !infinity) {
                            path += "L" + (this.yAxisPosition + parseFloat((xVal + (j / this.resolution)) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
                        }
                    } else {
                        if (isNaN(yVal)) {

                        } else if (yVal > this.maxY && isFinite(yVal) && !high) {
                            high = true;
                            path += this.outsideUpperRange((this.maxY), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                        } else if (yVal < this.minY && isFinite(yVal) && !low) {
                            path += this.outsideLowerRange((this.minY), (xVal + (j / this.resolution)), ((1 / this.resolution) / 100));
                            low = true;
                        } else if (!isFinite(yVal)) {
                            //console.log("entered inf");
                            infinity = true;
                        }

                    }


                    prevY = yVal;
                } else {
                    nully = true;
                }
            }
            xVal++;
            //console.log(xVal);
        }
        //console.log(path);
        image.setAttribute('d', path);
        image.setAttribute('stroke-width', '2');
        image.setAttribute('stroke', 'red');
        image.setAttribute('fill-opacity', 0);
        image.setAttribute('vector-effect', 'non-scaling-stroke');
        // var imageLeft = image.cloneNode(true);
        // var imageRight = image.cloneNode(true);
        // var imageIntegral = image.cloneNode(true);

        graphContent.appendChild(image);
        // graphContentLeft.appendChild(imageLeft);
        // graphContentIntegral.appendChild(imageIntegral);
        // graphContentRight.appendChild(imageRight);
        //draw rectangles

        var N = this.N;
        var a = this.a;
        var b = this.b;
        //console.log(N + " " + a + " " + b);
        if (this.type == 'rightsum') {
            xVal = b;
            path = "M" + (20 + this.widthx * (b - this.minX)) + " " + this.xAxisPosition;
            for (var K = 1; K <= N; K++) {
                yVal = this.evaluateEquation(xVal);
                if (!isNaN(yVal)) {
                    if (isFinite(yVal) && yVal <= this.maxY && yVal >= this.minY) {
                        path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (-1 * (((this.widthx * ((b - a) / N))))) + " v" + ((parseFloat(yVal * this.widthy)));

                    } else if (isNaN(yVal)) {
                        yVal = this.evaluateEquation(K + (1 / (this.resolution * 100)));
                        path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (-1 * (((this.widthx * ((b - a) / N))))) + " v" + ((parseFloat(yVal * this.widthy)));
                    } else {
                        if (this.evaluateEquation(xVal - .001) > 0) {
                            path = path + " v" + -1 * (parseFloat(this.maxY * this.widthy)) + " m" + (-1 * (((this.widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(this.maxY * this.widthy)));
                        } else {
                            path = path + " v" + -1 * (parseFloat(this.minY * this.widthy)) + " m" + (-1 * (((this.widthx * ((b - a) / N))))) + " 0 v" + ((parseFloat(this.minY * this.widthy)));
                        }
                        //console.log("asymptote in sum");
                    }
                } else {
                    path = "";
                    break;
                }
                xVal = xVal - ((b - a) / N);

            }
            //console.log(path);
            image2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            image2.setAttribute('d', path);
            image2.setAttribute('stroke-width', '2');
            image2.setAttribute('stroke', 'blue');
            image2.setAttribute('fill-opacity', 0);
            image2.setAttribute('vector-effect', 'non-scaling-stroke');

            //image2Right = image2.cloneNode(true);

            graphContent.appendChild(image2);
            //graphContentRight.appendChild(image2Right);
            this.rightSum();
        }
        if (this.type == 'leftsum') {
            xVal = a;
            path = "M" + (20 + this.widthx * (a - this.minX)) + " " + this.xAxisPosition;
            for (var K = 1; K <= N; K++) {
                yVal = this.evaluateEquation(xVal);
                if (!isNaN(yVal)) {
                    if (isFinite(yVal) && yVal <= this.maxY && yVal >= this.minY) {
                        path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (this.widthx * ((b - a) / N)) + " v" + ((parseFloat(yVal * this.widthy)));

                    } else if (isNaN(yVal)) {
                        yVal = this.evaluateEquation(K + (1 / (this.resolution * 100)));
                        path = path + " v" + -1 * (parseFloat(yVal * this.widthy)) + " h" + (this.widthx * ((b - a) / N)) + " v" + ((parseFloat(yVal * this.widthy)));
                    } else {
                        if (this.evaluateEquation(xVal + .001) > 0) {
                            path = path + " v" + -1 * (parseFloat(this.maxY * this.widthy)) + " m" + (this.widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(this.maxY * this.widthy)));
                        } else {
                            path = path + " v" + -1 * (parseFloat(this.minY * this.widthy)) + " m" + (this.widthx * ((b - a) / N)) + " 0 v" + ((parseFloat(this.minY * this.widthy)));
                        }
                        console.log("asymptote in sum");
                    }

                } else {
                    path = "";
                    break;
                }
                xVal = xVal + ((b - a) / N);

            }
            //console.log(path);
            image3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            image3.setAttribute('d', path);
            image3.setAttribute('stroke-width', '2');
            image3.setAttribute('stroke', 'Green');
            image3.setAttribute('fill-opacity', 0);
            image3.setAttribute('vector-effect', 'non-scaling-stroke');

            //image3Left = image3.cloneNode(true);

            graphContent.appendChild(image3);
            //graphContentLeft.appendChild(image3Left);
            this.leftSum();
        }
        //shade
        if (this.type == 'integral') {
            xVal = a;
            var highup = 0;
            path = "M" + (20 + this.widthx * (a - this.minX)) + " " + this.xAxisPosition;
            for (var K = xVal; K <= b; K += (1 / this.resolution)) {
                K = parseFloat(K.toFixed(6));

                yVal = this.evaluateEquation(K);
                if (!isNaN(yVal)) {

                    if (isFinite(yVal)) {
                        path += "L" + (this.yAxisPosition + parseFloat((K) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
                    } else if (isNaN(yVal)) {
                        yVal = this.evaluateEquation(K + (1 / (this.resolution * 100)));
                        path += "L" + (this.yAxisPosition + parseFloat((K) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(yVal * this.widthy)) + " ";
                    } else {
                        path += " V" + (this.xAxisPosition);
                        console.log("asymptote in shaded region");
                    }
                } else {
                    path = "";
                    console.log(yVal + ' ' + K);
                    break;
                }


            }
            if (path.length > 0) {
                if (isFinite(yVal)) {
                    // console.log(parseFloat(yVal * this.widthy))
                    path += " v" + (parseFloat(yVal * this.widthy));
                }


                path += "z";
            }
            image4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            image4.setAttribute('d', path);
            image4.setAttribute('stroke-width', '2');
            image4.setAttribute('stroke', 'black');
            image4.setAttribute('fill-opacity', 0.5);
            image4.setAttribute('fill', '#999');
            image4.setAttribute('vector-effect', 'non-scaling-stroke');

            graphContent.appendChild(image4);
            this.integral();
        }
        this.leftSumValue = 0;
        this.rightSumValue = 0;
        this.integralValue = 0;
        
        



    };
    this.rightSum = function() {
        var N = this.N;
        var a = this.a;
        var b = this.b;
        var xVal = b;
        var tempRight = 0;
        for (var i = 0; i < N; i++) {
            tempRight = (this.evaluateEquation(xVal) * ((b - a) / N));
            this.rightSumValue += tempRight;
            if (!isFinite(tempRight)) {
                this.rightSumValue = "diverges";
                break;
            }
            xVal = xVal - ((b - a) / N);
        }
        if (this.rightSumValue != "diverges") {
            this.rightSumValue = parseFloat(this.rightSumValue.toFixed(3));
        }
        //MathJax.Hub.Queue(function() {
        if (this.rightSumValue != "diverges") {
            var rightSum = "<math><mstyle displaystyle='true'><msub><mi>R</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mi></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
            $('#'+this.id+'Sum').empty().append(rightSum + "<mn>" + this.rightSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
        } else {
            $('#'+this.id+'Sum').empty().append("Right Sum diverges");
        }
        //});
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        //$('#rightSum').text("Right Sum:  " + this.rightSumValue);
    };

    this.leftSum = function() {
        var N = this.N;
        var a = this.a;
        var b = this.b;
        var xVal = a;
        var tempLeft = 0;
        for (var i = 0; i < N; i++) {
            tempLeft = (this.evaluateEquation(xVal) * ((b - a) / N));
            this.leftSumValue += parseFloat(tempLeft.toFixed(6));
            if (!isFinite(tempLeft)) {
                this.leftSumValue = "diverges";
                break;
            }
            xVal = xVal + ((b - a) / N);
        }
        if (this.leftSumValue != "diverges") {
            this.leftSumValue = parseFloat(this.leftSumValue.toFixed(3));
        }
        //MathJax.Hub.Queue(function() {
        if (this.leftSumValue != "diverges") {
            var leftSum = "<math><mstyle displaystyle='true'><msub><mi>L</mi><mi>n</mi></msub><mo>=</mo><munderover><mo>&#x2211;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>" + N + "</mn></munderover><mrow><mi>f</mi><mo></mo><mrow><mo>(</mo><msub><mi>x</mi><mrow><mi>i</mi><mo>&#x2212;</mo><mn>1</mn></mrow></msub><mo>)</mo></mrow><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></mstyle><mo>=</mo>";
            $('#'+this.id+'Sum').empty().append(leftSum + "<mn>" + this.leftSumValue + "</mn></mrow></math>" + "<br><span>where </span><math><msub><mi>x</mi><mi>i</mi></msub><mo>=</mo><mn>" + a + "</mn><mo>+</mo><mi>i</mi><mrow><mo>(</mo><mn>" + (b - a) / N + "</mn><mo>)</mo></mrow></math>");
        } else {
            $('#'+this.id+'Sum').empty().append("Left Sum diverges");
        }
        //});
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    };

    this.integral = function() {
        var N = this.N;
        var a = this.a;
        var b = this.b;
        var xVal = b;
        var size = 350;
        var tempY = 0;
        var prevYVal = 0;
        for (var i = 0; i < size * (b - a); i++) {

            tempY = ((this.evaluateEquation(xVal) + this.evaluateEquation(xVal - (1 / size))) * .5 * (1 / size));
            //console.log(tempY)
                // this.integralValue +   = parseFloat(tempY.toFixed(6));
                // xVal = xVal - (1 / size);
            if (i > 0) {
                if (!isFinite(tempY)) {
                    this.integralValue = "diverges";
                    console.log("asymptote in sum");
                    break;
                } //else if (Math.abs((tempY - prevYVal) / (1 / size)) >= 9999999) {
                else if (isNaN(tempY)) {
                    this.integralValue = "diverges";
                    break;
                } else {
                    this.integralValue += parseFloat(tempY.toFixed(6));

                }
            } else {
                if (isFinite(tempY) && !isNaN(tempY)) {
                    this.integralValue += parseFloat(tempY.toFixed(6));

                } else if (isNaN(tempY)) {
                    this.integralValue += parseFloat(this.evaluateEquation(xVal - (1 / (size * 100))) * (1 / size));
                }
            }
            xVal = xVal - (1 / size);
            prevYVal = tempY;
            // if(isNaN(tempY)){
            //     break;
            // }
        }

        tempY = 0;
        var prevYVal = 0;
        var temporary = 0;
        // xVal = a;
        // if (this.integralValue != "diverges") {
        //     for (var i = 0; i < size * (b - a); i++) {
        //         tempY = (this.evaluateEquation(xVal) * (1 / size));

        //         // temporary += parseFloat(tempY.toFixed(6));
        //         // xVal = xVal + (1 / size);
        //         if (i > 0) {
        //             if (!isFinite(tempY)) {
        //                 //this.integralValue = "diverges";
        //                 break;
        //             } //else if (Math.abs((tempY - prevYVal) / (1 / size)) >= 9999999) {
        //                 else if (isNaN(tempY)) {
        //                 this.integralValue = "diverges";
        //                 break;
        //             } else {
        //                 temporary += parseFloat(tempY.toFixed(6));

        //             }
        //         } else {
        //             if (isFinite(tempY) && !isNaN(tempY)) {

        //                 temporary += parseFloat(tempY.toFixed(6));

        //             } else if (isNaN(tempY)) {
        //                 temporary += parseFloat(this.evaluateEquation(xVal - (1 / (size * 100))) * (1 / size));
        //             }
        //         }
        //         xVal = xVal + (1 / size);
        //         prevYVal = tempY;
        //     }
        // }
        // console.log(this.integralValue + "    " + temporary);
        if (this.integralValue != "diverges" && !isNaN(this.integralValue)) {
            //this.integralValue = (this.integralValue + temporary) / 2;

            this.integralValue = parseFloat(this.integralValue.toFixed(3));
        }
        //MathJax.Hub.Queue(function() {
        if (this.integralValue != "diverges") {
            $('#'+this.id+'Sum').empty().append("`int_(" + a + ")^(" + b + ")" + this.equationToEval + " dx = " + this.integralValue + "`");
        } else {
            $('#'+this.id+'Sum').empty().append("`int_(" + a + ")^(" + b + ")" + this.equationToEval + " dx `" + " " + this.integralValue);
        }
        //});
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    };

    this.createEquation = function() {
        MathJax.Hub.Queue(function() { document.getElementById('equationList').innerHTML = "`f(x)=" + this.equationToEval + "`" });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    };

    this.outsideUpperRange = function(upper, xVal, step) {

        for (var i = xVal - step; i > xVal - (1 / this.resolution); i -= step) {
            tempY = this.evaluateEquation(i);
            if (tempY <= upper) {

                return "L" + (this.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";


    };

    this.outsideLowerRange = function(lower, xVal, step) {
        for (var i = xVal - step; i > xVal - (1 / this.resolution); i -= step) {
            tempY = this.evaluateEquation(i);
            if (tempY >= lower) {

                return "L" + (this.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    };

    this.backToBelowUpper = function(upper, xVal, step) {
        for (var i = xVal - ((1 / this.resolution) + (1 / this.resolution) / 10); i < xVal; i += step) {
            tempY = this.evaluateEquation(i);
            //console.log(xVal);
            //console.log(i);
            if (tempY <= upper) {
                //console.log(i + " " + tempY);
                return "M" + (this.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    };

    this.backToAboveLower = function(lower, xVal, step) {
        for (var i = xVal - (1 / this.resolution); i < xVal; i += step) {

            tempY = this.evaluateEquation(i);

            if (tempY >= lower) {

                return "M" + (this.yAxisPosition + parseFloat((i) * (this.widthx))) + " " + (this.xAxisPosition - parseFloat(tempY * this.widthy)) + " ";

            }
        }
        return " ";
    };

    this.evaluateEquation = function(x) {
        var a = math.eval(((this.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")));
        if (!isNaN(a)) {
            return parseFloat(parseFloat(math.eval(((this.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
        } else {
            return NaN
        }
        //return parseFloat(parseFloat(math.eval(((this.equationToEval).replace(new RegExp("x", 'g'), "(" + x + ")")))).toFixed(3));
    };

    this.updateAxisVals = function(direct) {
        switch (direct) {
            case 37:
                var curVal = this.minX;
                curVal++;
                document.getElementById('minX').value = curVal;
                var curVal = this.maxX;
                curVal++;
                document.getElementById('maxX').value = curVal;

                break;
            case 38:
                var curVal = this.minY;
                curVal--;
                document.getElementById('minY').value = curVal;
                var curVal = this.maxY;
                curVal--;
                document.getElementById('maxY').value = curVal;
                break;
            case 39:
                var curVal = this.minX;
                curVal--;
                document.getElementById('minX').value = curVal;
                var curVal = this.maxX;
                curVal--;
                document.getElementById('maxX').value = curVal;
                break;
            case 40:
                var curVal = this.minY;
                curVal++;
                document.getElementById('minY').value = curVal;
                var curVal = this.maxY;
                curVal++;
                document.getElementById('maxY').value = curVal;
                break;
            default:
                console.log("Encountered an error updating Axis Values");


        }
        this.clearGraph();
        this.drawGraphAxis();
        if (this.numGraphDrawn > 0) {
            this.drawGraph();
        }

    }
    this.init();

}

// $(document).ready(function() {
//     this.init();
// });
