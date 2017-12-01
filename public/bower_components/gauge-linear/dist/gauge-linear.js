import d3 from 'd3';
import _ from 'lodash';

const defaults = {
  max: 100,
  min: 0,
  value: 1e-6, // zero causes width problems in d3
  height: 20,
  width: 150,
  referenceSize: 15,
  baselineWidth: 2,
  baselineOverlap: 1, // 1px top & bottom
  fontSize: 12,
  duration: 300,
  colors: {
    hh: '#e53838', //$alert-red
    h: '#e8a736', //$alert-yellow
    l: '#e8a736', //$alert-yellow
    ll: '#e53838', //$alert-red
    default: '#4364dd', //$alert-blue
    background: '#efeff4', // $gray2
    markers:'#525156', // $gray8
    labels:'#242326' // $gray10
  }
};

// Given a value and a thresholds object,
// return the correct color for that value.
export function getColor(v, t, colors){
  let color = colors.default;
  if(t){
    v = parseFloat(v);
    if(v <= t.l){
      color = colors.l;
      if(v<=t.ll){
        color = colors.ll;
      }
    }
    if(v>=t.h){
      color = colors.h;
      if(v>=t.hh){
        color = colors.hh;
      }
    }
  }
  return color;
}

// ====================================================================
// RENDERING & UPDATING

let createBackground = function(svg, config){
  svg.append('rect')
   .attr('shape-rendering', 'crispEdges')
   .attr('x', config.marginLeft)
   .attr('y', config.marginTop)
   .attr('width', config.width - config.marginLeft - config.marginRight)
   .attr('height', config.barHeight)
   .attr('fill', config.colors.background);
};

let createBarFromLeft = function(svg, config){
  svg.append('rect')
    .attr('class', 'bar')
    .attr('shape-rendering', 'crispEdges')
    .attr('x', config.marginLeft)
    .attr('y', config.marginTop)
    .attr('width', 1e-6) // transitions have trouble with zeros here
    .attr('height', config.barHeight)
    .attr('fill', function() {
      return getColor(config.value, config.thresholds, config.colors);
    })
    .transition().duration(config.defaults.duration)
    .attr('width', config.scale(config.value) - config.marginLeft);
};
let updateBarFromLeft = function(svg, config){
  svg.selectAll('.bar')
    .attr('fill', function() {
      return getColor(config.value, config.thresholds, config.colors);
    })
    .transition().duration(config.defaults.duration)
    .attr('width', config.scale(config.value) - config.marginLeft);
};

let createBarFromBaseline = function(svg, config){
  svg.append('rect') // the bar
     .attr('class', 'bar')
     .attr('shape-rendering', 'crispEdges')
     .attr('y', config.marginTop)
     .attr('height', config.barHeight)
     .attr('x', config.scale(config.baseline))
     .attr('width', 1e-6) // transitions have trouble with zeros here
     .attr('fill', function() {
       return getColor(config.value, config.thresholds, config.colors);
     })
     .transition().duration(config.defaults.duration)
     .attr('x', function(){
       return config.value >= config.baseline ? config.scale(config.baseline) : config.scale(config.value); // negative values go to the left of zero
     })
     .attr('width', function() {
       return Math.abs(config.scale(config.value) - config.scale(config.baseline));
     });
  svg.append('line') // the baseline marker
     .attr('class', 'bar')
     .attr('shape-rendering', 'crispEdges')
     .attr('x1', config.scale(config.baseline))
     .attr('x2', config.scale(config.baseline))
     .attr('y1', config.marginTop + config.barHeight/2 - config.baselineHeight/2)
     .attr('y2', config.marginTop + config.barHeight/2 + config.baselineHeight/2)
     .attr('stroke-width', config.defaults.baselineWidth)
     .attr('stroke', config.colors.markers);
};
let updateBarFromBaseline = function(svg, config){
  svg.selectAll('.bar')
    .attr('fill', function() {
      return getColor(config.value, config.thresholds, config.colors);
    })
    .transition().duration(config.defaults.duration)
    .attr('x', function(){
      return config.value >= config.baseline ? config.scale(config.baseline) : config.scale(config.value); // negative values go to the left of zero
    })
    .attr('width', function() {
      return Math.abs(config.scale(config.value) - config.scale(config.baseline));
    });
};

let createErrorBars = function(svg, config){
  // Box to define error bar boundaries
  // Bar ends are 60% of the bar height
  let box = {
    left: config.scale(config.errorLow),
    right: config.scale(config.errorHigh),
    top: config.marginTop + config.barHeight * 0.2,
    middle: config.marginTop + config.barHeight * 0.5,
    bottom: config.marginTop + config.barHeight * 0.8
  };
  svg.append('line')
     .attr('class','error-middle')
     .attr('shape-rendering', 'crispEdges')
     .attr('x1', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('x2', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('y1', box.middle)
     .attr('y2', box.middle)
     .attr('stroke-width', 1)
     .attr('stroke', config.colors.markers)
     .transition().duration(defaults.duration)
     .attr('x1', box.left)
     .attr('x2', box.right);
  svg.append('line')
     .attr('class','error-low')
     .attr('shape-rendering', 'crispEdges')
     .attr('x1', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('x2', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('y1', box.top)
     .attr('y2', box.bottom)
     .attr('stroke-width', 1)
     .attr('stroke', config.colors.markers )
     .transition().duration(config.defaults.duration)
     .attr('x1', box.left)
     .attr('x2', box.left);
  svg.append('line')
     .attr('class','error-high')
     .attr('shape-rendering', 'crispEdges')
     .attr('x1', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('x2', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
     .attr('y1', box.top )
     .attr('y2', box.bottom)
     .attr('stroke-width', 1)
     .attr('stroke', config.colors.markers)
     .transition().duration(config.defaults.duration)
     .attr('x1', box.right )
     .attr('x2', box.right );
};
let updateErrorBars = function(svg, config){
  // Box to define error bar boundaries
  // Bar ends are 60% of the bar height
  let box = {
    left: config.scale(config.errorLow),
    right: config.scale(config.errorHigh),
    top: config.marginTop + config.barHeight * 0.2,
    middle: config.marginTop + config.barHeight * 0.5,
    bottom: config.marginTop + config.barHeight * 0.8
  };
  svg.selectAll('.error-middle')
     .transition().duration(config.defaults.duration)
     .attr('x1', box.left)
     .attr('x2', box.right);
  svg.selectAll('.error-low')
     .transition().duration(config.defaults.duration)
     .attr('x1', box.left)
     .attr('x2', box.left);
  svg.selectAll('.error-high')
     .transition().duration(config.defaults.duration)
     .attr('x1', box.right )
     .attr('x2', box.right );

};

let createLabels = function(svg, config){
  svg.selectAll('text')
    .data(config.labels)
    .enter()
    .append('text')
    .text((d) => { return d; })
    .attr('text-anchor', 'middle')
    .attr('x', config.showBaseline ? config.scale(config.baseline) : config.marginLeft)
    .attr('y', config.height)
    .attr('font-family', 'sans-serif')
    .attr('font-size', ( config.fontSize + 'px'))
    .attr('fill', config.colors.labels)
    .transition().duration(config.defaults.duration)
    .attr('x', (d) => {
      return config.scale(d);
    });
};
let updateLabels = function(svg, config){
  svg.selectAll('text')
    .text((d, i) => {
      return config.labels[i];
    })
    .transition().duration(config.defaults.duration)
    .attr('x', (d,i) => {
      return config.scale(config.labels[i]);
    });
};

let createReference = function(svg, config){
  svg.append('path')
     .attr('class', 'reference-bottom')
     .attr('d', d3.svg.symbol().type('triangle-up').size(config.defaults.referenceSize))
     .attr('stroke', config.colors.markers)
     .attr('fill', config.colors.markers)
     .attr('transform', function() {
       return 'translate(' + config.scale(config.reference) + ',' + (config.marginTop + config.barHeight + config.defaults.referenceSize/4) + ')';
     });
  svg.append('path')
     .attr('class', 'reference-top')
     .attr('d', d3.svg.symbol().type('triangle-down').size(config.defaults.referenceSize))
     .attr('stroke', config.colors.markers)
     .attr('fill', config.colors.markers)
     .attr('transform', function() {
       return 'translate(' + config.scale(config.reference) + ',' + config.marginTop/2 + ')';
     });
};
let updateReference = function(svg, config){
  svg.selectAll('.reference-bottom')
     .transition().duration(config.defaults.duration)
     .attr('transform', function() {
       return 'translate(' + config.scale(config.reference) + ',' + (config.marginTop + config.barHeight + config.defaults.referenceSize/4) + ')';
     });
  svg.selectAll('.reference-top')
     .transition().duration(config.defaults.duration)
     .attr('transform', function() {
       return 'translate(' + config.scale(config.reference) + ',' + config.marginTop/2 + ')';
     });
};

// =================================================================
// LINKING FUNCTION
// This function is responsible for configuring the gauge based
// on any parameters the user has provided, initializing it, and
// calling the functions which render elements using d3.
//
// Don't put any Angular functionality in here!
export function link (params, element){

  // =================================================================
  // USER-PROVIDED VALUES. Use defaults if not provided.
  let config = {
    height: params.height ? parseInt(params.height) : defaults.height,
    width: params.width ? parseInt(params.width) : defaults.width,
    max: params.max ? parseFloat(params.max) : defaults.max,
    min: params.min ? parseFloat(params.min) : defaults.min,
    baseline: params.baseline ? parseFloat(params.baseline) : null,
    thresholds: params.thresholds ? JSON.parse(params.thresholds) : null,
    errorHigh: params.errorHigh ? parseFloat(params.errorHigh) : null,
    errorLow: params.errorLow ? parseFloat(params.errorLow) : null,
    labels: params.labels ? params.labels.split(',') : null,
    value: params.value ? parseFloat(params.value) : defaults.value,
    reference: params.reference ? parseFloat(params.reference) : null,
    colors: params.colors ? JSON.parse(params.colors) : null
  };

  config.colors = _.assign({}, defaults.colors, config.colors);
  config.defaults = defaults;

  // =================================================================
  // CALCULATED VALUES
  config.marginTop = params.reference ? defaults.referenceSize/2 : 2;
  config.marginBottom = params.reference ? defaults.referenceSize/2 : 2; // First pass, is there a reference?
  // Bottom margin depends on whether we've got a reference, lables, or neither.
  config.marginBottom = config.labels ? config.height * 0.4 : config.marginBottom; // Second pass, are there labels? They're bigger!
  config.barHeight = config.height - config.marginTop - config.marginBottom;
  // Font size depends on the size of marginBottom
  config.fontSize = config.marginBottom < defaults.fontSize ? parseInt(config.marginBottom) : defaults.fontSize;
  // A basic calculation of how much room you'll need for the numbers to overlap the ends of the bars.
  config.marginLeft = config.labels ? config.fontSize * config.min.toString().length / 3.5: 0;
  config.marginRight = config.labels ? config.fontSize * config.max.toString().length / 3.5: 0;
  // Reference marker
  config.baselineHeight = config.barHeight + defaults.baselineOverlap * 2;

  // Booleans to show/hide features
  // These are required because if the given value is zero, it will evaluate as false
  config.showBaseline = params.baseline ? true : false;
  config.showErrorBars = params.errorHigh && params.errorLow ? true : false;
  config.showLabels = params.labels ? true : false;
  config.showReference = params.reference ? true : false;

  // Create a d3 scale to scale values for the bar, error bars, baseline and reference values
  config.scale = d3.scale.linear()
                 .domain([config.min,config.max]) // scale this (the value limits)
                 .range([config.marginLeft, config.width - config.marginRight]); // to this (the pixel limits)

  // =================================================================
  // RENDER (available as $scope.render on a controller)
  var svg;
  params.render = function(){
    // console.log('rendering',config);
    d3.select(element[0]).selectAll('*').remove();
    svg = d3.select(element[0]).append('svg').attr('width',config.width).attr('height',config.height);
    // Background
    createBackground(svg, config);
    // Bar
    if(config.showBaseline){
      createBarFromBaseline(svg, config);
    } else {
      createBarFromLeft(svg, config);
    }
    // Error Bars
    if(config.showErrorBars){ createErrorBars(svg, config); }
    // Labels
    if(config.showLabels){ createLabels(svg, config); }
    // Reference
    if(config.showReference){ createReference(svg, config); }
  };

  // =================================================================
  // UPDATE FUNCTIONS
  params.updateValue = function(newVal){
    config.value = newVal;
    if(config.showBaseline){
      updateBarFromBaseline(svg, config);
    } else {
      updateBarFromLeft(svg, config);
    }
  };
  params.updateErrorBars = function(high, low){
    config.errorHigh = high;
    config.errorLow = low;
    updateErrorBars(svg, config);
  };
  params.updateReference = function(newVal){
    config.reference = newVal;
    updateReference(svg, config);
  };
  params.updateLabels = function(newVal){
    config.labels = newVal;
    updateLabels(svg, config);
  };


  // =================================================================
  // INITIALIZE
  params.render();

}
