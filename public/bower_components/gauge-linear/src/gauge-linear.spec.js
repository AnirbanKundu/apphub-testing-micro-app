/* global beforeEach, describe, expect, it */
'use strict';
import d3 from 'd3';

import * as gauge from './gauge-linear';
describe('gauge-linear', () => {

  let thresholds = {
    'll':1,
    'l':3,
    'h':5,
    'hh':7
  };

  let colors = {
    hh: 'hh',
    h: 'h',
    l: 'l',
    ll: 'll',
    default: 'default'
  };

  it('should pick the right color', function(){
    expect(gauge.getColor(0, thresholds, colors)).toEqual('ll');
    expect(gauge.getColor(2, thresholds, colors)).toEqual('l');
    expect(gauge.getColor(4, thresholds, colors)).toEqual('default');
    expect(gauge.getColor(6, thresholds, colors)).toEqual('h');
    expect(gauge.getColor(8, thresholds, colors)).toEqual('hh');
  });

});