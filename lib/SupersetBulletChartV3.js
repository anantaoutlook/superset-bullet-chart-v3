"use strict";

exports.__esModule = true;
exports.default = SupersetBulletChartV3;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var d3 = _interopRequireWildcard(require("d3"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var categorialSchemeRegistry = (0, _core.getCategoricalSchemeRegistry)(); // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

var Styles = _core.styled.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  /*  background-color: ", ";\n   padding: ", "px;\n   border-radius: ", "px; */\n   height: ", "px;\n   width: ", "px;\n "])), _ref => {
  var {
    theme
  } = _ref;
  return theme.colors.secondary.light5;
}, _ref2 => {
  var {
    theme
  } = _ref2;
  return theme.gridUnit * 4;
}, _ref3 => {
  var {
    theme
  } = _ref3;
  return theme.gridUnit * 2;
}, _ref4 => {
  var {
    height
  } = _ref4;
  return height;
}, _ref5 => {
  var {
    width
  } = _ref5;
  return width;
});
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */


function SupersetBulletChartV3(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    colorScheme,
    width,
    orderDesc
  } = props;
  var totals = 0; // custom colors theme

  var customColors;
  var svgRef = /*#__PURE__*/(0, _react.createRef)();
  var colorsValues = categorialSchemeRegistry.values();
  var filterColors = colorsValues.filter(c => c.id === colorScheme);

  if (filterColors[0]) {
    customColors = [...filterColors[0].colors];
  } // let selectedOption = "chart";


  var onSiteChanged = (type, value) => {
    setType({
      selectedOption: value,
      totals: totals
    });
  };

  var [form, setType] = (0, _react.useState)({
    selectedOption: 'chart',
    totals: 0
  }); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  (0, _react.useEffect)(() => {
    render(svgRef); // setType({ selectedOption: 'chart' , totals: totals});
  }, [props, form, setType, orderDesc]);

  var groupData = (data, total) => {
    var cumulative = 0;

    var _data = data.map(d => {
      cumulative += d.metricpossiblevalues;
      return {
        metricpossiblevalues: d.metricpossiblevalues,
        cumulative: cumulative - d.metricpossiblevalues,
        metricvalue: d.metricvalue,
        metricpossible: d.metricpossible,
        percent: (d.metricpossiblevalues / total * 100).toFixed(2)
      };
    }).filter(d => d.metricpossiblevalues > 0);

    return _data;
  };

  var render = svgRef => {
    var config = {
      f: d3.format('.1f'),
      margin: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
      },
      barHeight: 40
    };
    var {
      f,
      margin,
      barHeight
    } = config;
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
    var halfBarHeight = barHeight;
    var lineHeight = 1.1; //

    var getMetricPossible = data => {
      var rectangles = selection.selectAll('rect') || null;
      data.each(function () {
        var filterVal = rectangles[0].filter((d, eleIndex) => data[0].indexOf(this) === eleIndex);

        if (filterVal.length > 0) {
          wrap(this, parseFloat(filterVal[0].attributes[4].value) + 5);
        }
      });
    };

    var wrap = (txt, data) => {
      var width = data;
      var text = d3.select(txt);
      var words = text.text().split(/\s+/).reverse();
      var word;
      var line = [];
      var lineNumber = 0;
      var lineHeight = 1.1; // ems

      var x = text.attr("x");
      var y = text.attr("y");
      var dy = parseFloat(text.attr("dy")) || 0;
      var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        var tspanWidth = tspan.node().getComputedTextLength() + 1;

        if (tspanWidth > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    };

    function creatUniqueArray() {
      var unique = [];
      var distinct = []; // const result = [];

      for (var i = 0; i < data.length; i++) {
        if (data[i].metricpossible) {
          if (!unique[data[i].metricpossible]) {
            distinct.push(data[i]);
            unique[data[i].metricpossible] = 1;
          }
        }
      }

      return distinct;
    }

    var resultset = creatUniqueArray();
    var total = d3.sum(resultset, d => d.metricpossiblevalues);
    totals = total;
    orderDesc ? resultset.sort((a, b) => a.orderby - b.orderby) : resultset.sort((a, b) => b.orderby - a.orderby);
    var middleIndex = resultset.indexOf(resultset[Math.round((resultset.length - 1) / 2)]);

    var _data = groupData(resultset, total); //getPoints to draw ppolylines


    var getPoints = (d, index) => {
      var polyLineHeight = 20;
      var polyLineWidth = 20;
      var pointFirstX = xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12;
      var pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
      var pointSecondX = 0;
      var pointSecondY = 0;
      var pointThirdX = 0;
      var pointThirdY = 0;

      if (index < middleIndex) {
        pointSecondX = pointFirstX;
        pointSecondY = pointFirstY - polyLineHeight * (index + 1);
        pointThirdX = pointFirstX + polyLineWidth * (index + 1);
        pointThirdY = pointFirstY - polyLineHeight * (index + 1);
      } else {
        pointSecondX = pointFirstX;
        pointSecondY = pointFirstY - polyLineHeight * (index + 1);
        pointThirdX = pointFirstX - polyLineWidth * (index + 1);
        pointThirdY = pointFirstY - polyLineHeight * (index + 1);
      }

      return pointFirstX + " " + pointFirstY + " " + pointSecondX + " " + pointSecondY + " " + pointThirdX + " " + pointThirdY;
    };

    var getPolylineEndX = (d, index) => {
      var polylines = selection.selectAll('polyline') || null;
      var filterVal = polylines.filter((d, eleIndex) => index === eleIndex);
      var pointArr = filterVal[0][0].attributes[1].value.split(' ');
      var xCordinate = index < middleIndex ? pointArr[pointArr.length - 2] + 2 : pointArr[pointArr.length - 2] - 2;
      return xCordinate;
    };

    var getPolylineEndY = (d, index) => {
      var polyLineHeight = 20;
      var pointFirstY = h / 2 - halfBarHeight * lineHeight + 5;
      return pointFirstY - polyLineHeight * (index + 1);
    }; // indicator position


    var indicatorPosition;
    var filteredRecords = [];

    if (data.length > 0) {
      if (data[0].metricpossible) {
        filteredRecords = data.filter(d => d.metricpossible === data[0].metricvalue);
      }
    }

    if (filteredRecords.length > 0) {
      indicatorPosition = filteredRecords[0].metricvalue;
    } // set up scales for horizontal placement


    var xScale = d3Scale.scaleLinear().domain([0, total]).range([0, w]); // create svg in passed in div
    // d3.select('svg').remove();

    var selection = d3.select(svgRef.current) // .append('svg')
    .attr('width', w).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // stack rect for each data value

    d3.selectAll('rect').remove();
    selection.selectAll('rect').data(_data).enter().append('rect').attr('class', 'rect-stacked').attr('x', d => xScale(d.cumulative) - 12).attr('y', h / 2 - halfBarHeight).attr('height', barHeight).attr('width', d => xScale(d.metricpossiblevalues)).style('fill', (d, i) => customColors[i + 4]).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : f(d.percent) + '%'); // add image on top of bar(indicator)

    d3.selectAll('.text-value').remove();
    selection.selectAll('.text-value').data(_data).enter().append('text').attr('class', 'text-value').attr('text-anchor', 'start').attr('font-size', '14px').style('fill', (d, i) => customColors[customColors.length - 3]).attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2).attr('y', h / 2 - halfBarHeight * 1.1).text(d => {
      return d.metricpossible == indicatorPosition ? '▼' : '';
    }); // add some labels for percentages

    d3.selectAll('.text-percent').remove();
    selection.selectAll('.text-percent').data(_data).enter().append('text').attr('class', 'text-percent').attr('text-anchor', 'middle').attr('font-size', '11px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2).attr('y', h / 2 - halfBarHeight / 2).text(d => f(d.percent) > 5 ? f(d.percent) + '%' : ''); // add the labels bellow bar

    d3.selectAll('.text-label').remove();
    selection.selectAll('.text-label').data(_data).enter().append('text').attr('class', 'text-label') //  .attr('text-anchor', (d:any)=> f(d.percent) < 5 ? 'end' :'middle')
    .attr('text-anchor', 'middle').attr('font-size', '9px').attr('x', d => xScale(d.cumulative) + xScale(d.metricpossiblevalues) / 2 - 12).attr('y', h / 2 + 15).style('fill', '#000').attr('width', d => xScale(d.metricpossiblevalues) / 3).text(d => f(d.percent) < 5 ? '' : d.metricpossible).call(getMetricPossible); // .style('fill', (d, i) => customColors[i])

    d3.selectAll('polyline').remove();
    selection.selectAll('.polyline').data(_data).enter().append('polyline').style('stroke', 'black').style('fill', 'none').attr('stroke-width', 0.6).attr('points', (d, index) => f(d.percent) < 5 ? getPoints(d, index) : ''); // append text at the end of line

    d3.selectAll('.line-text').remove();
    selection.selectAll('.line-text').data(_data).enter().append('text').attr('class', 'line-text').attr('text-anchor', (d, index) => index < middleIndex ? 'start' : 'end').attr('font-size', '11px').attr('x', (d, index) => getPolylineEndX(d, index)).attr('y', (d, index) => getPolylineEndY(d, index) + 2).text(d => f(d.percent) < 5 ? f(d.percent) + '%, ' + ' ' + d.metricpossible : '');
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", {
    type: "radio",
    id: "chart",
    value: "chart",
    name: "optionGroup",
    checked: form.selectedOption === 'chart',
    onClick: e => onSiteChanged('', "chart")
  }), " ", /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "chart",
    style: {
      verticalAlign: 'middle'
    }
  }, "chart")), form.selectedOption === "chart" ? /*#__PURE__*/_react.default.createElement("svg", {
    ref: svgRef
  }) : /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height + "px",
      fontSize: '10em',
      fontWeight: 'bold'
    }
  }, form.totals));
}