 function setup_svg(element){
  element.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('height', height + margin)
          .attr('width', width + margin)
          .style('stroke', 'black')
          .style('fill', 'none')
          .style('stroke-width', 2);
}


function nested_data_year(data){
  var result = d3.nest()
                     .key(function(d) {
                        return d['year'];
                     })
                     .rollup(agg_year)
                     .entries(data);
  return result;
};

// function to sum same year entries
function agg_year(leaves) {
  var total_flights = d3.sum(leaves, function(d) {
    return d['arr_flights'];
  });

  var total_delayed = d3.sum(leaves, function(d){
    return d['arr_del15'];
  });

  var total_cancelled = d3.sum(leaves, function(d){
    return d['arr_cancelled'];
  });

  var total_diverted = d3.sum(leaves, function(d){
    return d['arr_diverted'];
  });

  var ontime_ratio = (total_flights - total_delayed - total_diverted - total_cancelled) / total_flights;

  return {
    'total_flights' : total_flights,
    'ontime_ratio' : ontime_ratio,
  }
}

// functioin to set up axis, x axis is year
function setup_draw_xy_axis_year(element, time_scale, count_scale){

  var time_axis = d3.svg.axis()
                  .scale(time_scale)
                  .tickValues(d3.range(2002, 2017, 1))
                  .tickFormat(d3.format('d'));

  element.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(time_axis);

  element.append('text')
          .attr('x', width / 2 + margin / 2 - 15)
          .attr('y', height + margin/1.5)
          .text('year')
          .attr('font-size', '20px') ;
                      
  var count_axis = d3.svg.axis()
                      .scale(count_scale)
                      .orient('left')

  element.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + margin + ',0)')
          .call(count_axis);

  element.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('transform', 'translate('+ (margin/3) +','+(height/2 + margin * 1.5)+')rotate(-90)')
          .text('total flights ontime ratio')
          .attr('font-size', '20px') ;
          
}



// function to plot circles
function plot_circles(element, data, feature, color, time_scale, count_scale){
  element.append('g')
      .attr('class', 'circle')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d){
        return time_scale(+d.key);
        })
      .attr('cy', function(d) { 
        return count_scale(d.values[feature]); 
        })
      .attr('r', 5)
      .attr('fill', color);
};

// function to plot line
function plot_line(element, data, feature, color, id, time_scale, count_scale){
  var lineFunc = d3.svg.line()
                    .x(function(d){
                      return time_scale(d.key);
                    })
                    .y(function(d){
                      return count_scale(d.values[feature]);
                    });

  element.append('g')
         .append('path')
         .attr('class', 'line')
         .attr('d', lineFunc(data))
         .attr('stroke', color)
         .attr('fill', 'none')
         .attr('id', id)
         .attr('locked', 'false');
};

function draw_plot_1(data){

  // create svg element
  var svg = d3.select('.plot-1')
              .append('svg')
              .attr('width', width + margin)
              .attr('height', height + margin)
              .append('g')
              .attr('class', 'total_ontime_ratio');

  var time_scale = d3.time.scale()
                    .range([margin, width])
                    .domain([2002, 2016]);

  var count_scale = d3.scale.linear()
                    .range([height, margin])
                    .domain([0.4, 1]);

  // draw svg border
  setup_svg(svg);

  // draw x y axis
  setup_draw_xy_axis_year(svg, time_scale, count_scale);


  // extract the requisted yearly data
  var nested_year = nested_data_year(data);

  // draw circles of the average of total over year
  plot_circles(svg, nested_year, 'ontime_ratio', 'black', time_scale, count_scale);
  // draw line of the average of total over year
  plot_line(svg, nested_year, 'ontime_ratio', 'black', 'TOTAL', time_scale, count_scale);

  var airline_group = d3.nest()
                     .key(function(d) {
                        return d['carrier'];
                     })
                     .entries(data);

  //debugger;

  // draw line of the ontime ratio of each carrier
  var color = d3.scale.category20();
  airline_group.forEach(function(d, i){
      var each_airline = nested_data_year(d.values);
      plot_line(svg, each_airline, 'ontime_ratio', color(i), d.key, time_scale, count_scale);
  });

  // title
  svg.append('g')
     .append('text')
     .attr('font-size', 22)
     .attr('class', 'title_1')
     .attr('font-weight', 'bold')
     .attr('transform', 'translate(' + width * 0.43 + ',' + 50 + ')')
     .text('Ontime Ratio over Years');


  // set up events linstener
  var lines = d3.selectAll('.line');
  var legend_1 = svg.append('g')
                  .append('text')
                  .attr('class', 'legend_1 legend')
                  .attr('transform', 'translate(' + width *0.82 + ',' + 80 + ')')
                  .attr('font-size', 16);

  //set the default to be not highlited
  lines.each(function(d, i){
    d3.select(this)
      .style('opacity', 0.2)
      .style('stroke-width', 1);
  });

  // mouseover listener
  lines.on('mouseover', function(d){
    lines.each(function(d, i){
      if(d3.select(this).attr('locked') == 'false'){
        d3.select(this)
          .style('opacity', 0.2)
          .style('stroke-width', 1);
      }
      else{
        d3.select(this)
          .style('stroke-width', 2);
      }
    });
      
    legend_1.text('');

    d3.select(this)
      .style('opacity', 1.0)
      .style('stroke-width', 4);

    if(this.id == 'TOTAL'){
      legend_1.text(this.id);
    }
    else{
      legend_1.text('Carrier code: ' + this.id);
    }

  });

  // mouseout listener
  lines.on("mouseout", function(d){
    lines.each(function(d, i){
      if(d3.select(this).attr("locked") == "false"){
        d3.select(this)
          .style("opacity", 0.3)
          .style("stroke-width", 1);
      }
      else{
        d3.select(this)
          .style("stroke-width", 2);
      }
    });
      
    legend_1.text("");
  });

  // mouse click listener
  lines.on('click', function(d){
    if(d3.select(this).attr('locked') == 'false'){
      d3.select(this).attr('locked', 'true')
        .style('opacity', 1.0)
        .style('stroke-width', 2);
    }
    else{
      d3.select(this).attr('locked', 'false')
        .style('opacity', 0.2)
        .style('stroke-width', 1);
    }
  });
}

