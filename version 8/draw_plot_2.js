//function to extract different carrier entries
function nested_data_carrier(data, year){
  var result = d3.nest()
                     .key(function(d) {
                        return d['carrier'];
                     })
                     .rollup(agg_carrier)
                     .entries(data.filter(function(d){
                         // debugger;
                          return d.year > year;
                        }));
  return result;
};

//function to sum same carrier entries
function agg_carrier(leaves){
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

  var total_delay_time = d3.sum(leaves, function(d){
    return d[' arr_delay']
  });

  var average_delay = total_delay_time / total_delayed;

  var oppo_delay = average_delay * (1 - ontime_ratio);
  //debugger;

  return {
    'average_delay' : average_delay,
    'ontime_ratio' : ontime_ratio,
    'oppo_delay' : oppo_delay,
    'carrier_name' : leaves[0].carrier_name,
  }
}

// set up and draw xy axis for the histogram
function setup_draw_xy_axis_carrier(element, x_scale_time, x_scale_ratio){

  var padding = 5; 

  var x_axis_time = d3.svg.axis()
                      .scale(x_scale_time);

  var x_axis_ratio = d3.svg.axis()
                      .scale(x_scale_ratio);

  // append x axis of time
  element.append('g')
          .attr('class', 'x axis')
          .attr('transform', "translate(" + margin + "," + height + ")")
          .call(x_axis_time);

  element.append('g')
          .attr('class', 'x axis')
          .attr('transform', "translate(" + (width / 2 + margin / 2+ padding) + "," + height + ")")
          .call(x_axis_ratio);

  element.append('text')
          .attr("transform", "rotate(-90)")
          .attr("transform", "translate("+ (width/4) +","+(height + margin / 1.5)+")")
          .style("text-anchor", "middle")
          .text("average delay (minutes)")
          .attr("font-size", "18px") ;

  element.append('text')
          .attr("transform", "rotate(-90)")
          .attr("transform", "translate("+ (width * 0.8) +","+(height + margin / 1.5)+")")
          .style("text-anchor", "middle")
          .text("average ontime ratio")
          .attr("font-size", "18px") ;
}


function draw_plot_2_update_bars(nested_carrier_data){
  var bar_padding = 2;
  var padding = 5;
  // get svg element
  var svg = d3.select("#svg_2");

  // set scale and projection
  var average_delay_max = d3.max(nested_carrier_data, function(d){
                          return d.values.average_delay;
                        });
  var average_ratio_max = d3.max(nested_carrier_data, function(d){
                          return d.values.ontime_ratio;
                        });

  var x_scale_time = d3.scale.linear()
                    .domain([0, average_delay_max])
                    .range([0, width / 2 - margin / 2 - padding]);

  var x_scale_ratio = d3.scale.linear()
                    .domain([0, average_ratio_max])
                    .range([width / 2 - margin / 2 - padding, 0]);

  // draw delay time bars
  svg.append('g')
     .selectAll(".bar")
     .data(nested_carrier_data)
     .enter()
     .append("rect")
     .attr("class", "bar bar_related")
     .attr("x", margin)
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin;
      })    
     .attr("width", function(d, i) {
        return x_scale_time(d.values.average_delay);
      })
     .attr("height", (height - 1.5 * margin) / nested_carrier_data.length - bar_padding)  
     .attr("fill", "teal")
     .attr("name", function(d){
        return d.values.carrier_name;
     })
     .attr("short_name", function(d){
        return d.key;
     });

  //debugger;
  // draw delay ratio bars
  svg.append('g')
     .selectAll(".bar")
     .data(nested_carrier_data)
     .enter()
     .append("rect")
     .attr("class", "bar bar_related")
     .attr("x", function(d){
        return width - (width / 2 - margin / 2 - padding - x_scale_ratio(d.values.ontime_ratio));
      })
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin;
      })    
     .attr("width", function(d, i) {
        return width / 2 - margin / 2 - padding - x_scale_ratio(d.values.ontime_ratio);
      })
     .attr("height", (height - 1.5 * margin) / nested_carrier_data.length - bar_padding)  
     .attr("fill", "teal")
     .attr("name", function(d){
        return d.values.carrier_name;
     })
     .attr("short_name", function(d){
        return d.key;
     });

  // draw carrier code for the time histogram
  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("class", "bar_related")
     .attr("x", margin * 0.6)
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin + 25;
     })
     .attr("fill", "balck")
     .text(function(d){
        //debugger;
        return d.key;
     });

  // draw carrier code for the ratio histogram
  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("class", "bar_related")
     .attr("x", width + 5)
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin + 25;
     })
     .attr("fill", "balck")
     .text(function(d){
        //debugger;
        return d.key;
     });

  // draw delay time for time histogram
  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("class", "bar_related")
     .attr("x", function(d, i) {
        return x_scale_time(d.values.average_delay) + margin - 20;
      })
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin + 25;
     })
     .attr("fill", "white")
     .text(function(d){
        //debugger;
        return d.values.average_delay.toFixed();
     });

  // draw ratio for ratio histogram
  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("class", "bar_related")
     .attr("x", function(d){
        return width - (width / 2 - margin / 2 - padding - x_scale_ratio(d.values.ontime_ratio)) + 3;
      })
     .attr("y", function(d, i) {
        return i * ((height - 1.5 * margin) / nested_carrier_data.length) + 1.5 * margin + 25;
     })
     .attr("fill", "white")
     .text(function(d){
        //debugger;
        return d.values.ontime_ratio.toFixed(2);
     });

  // draw legend
  var legend_2 = svg.append("g")
                  .append("text")
                  .attr("class", "legend_2 legend bar_related")
                  .attr("transform", "translate(" + width * 0.45 + "," + margin * 1.2 + ")")
                  .attr("font-size", 16)
                  



  // set up bar events
  var bars = d3.selectAll(".bar");
  
  bars.on("mouseover", function(d){
    d3.selectAll(".bar").style("fill", "teal");
    var short_name = d3.select(this).attr("short_name");
    //debugger;
    legend_2.text(d3.select(this).attr("short_name") + " : " + d3.select(this).attr("name"));

    d3.selectAll(".bar").each(function(d, i){
      //debugger;
      if(short_name == d3.select(this).attr("short_name")){
          d3.select(this).style("fill", "blue");
      }
    });
  });

  bars.on("mouseout", function(d){
    d3.selectAll(".bar").style("fill", "teal");
    legend_2.text("");
  });
}

function draw_plot_2(nested_carrier_data){

  var padding = 5;
  // draw the second plot 
  var svg = d3.select(".plot-2")
              .append("svg")
              .attr("id", "svg_2")
              .attr("width", width + margin)
              .attr("height", height + margin)
              .append('g')
              .attr('class', 'average_delay');

  // draw svg border
  setup_svg(svg);

  var average_delay_max = d3.max(nested_carrier_data, function(d){
                          return d.values.average_delay;
                        });
  var average_ratio_max = d3.max(nested_carrier_data, function(d){
                          return d.values.ontime_ratio;
                        });

  var x_scale_time = d3.scale.linear()
                    .domain([0, average_delay_max])
                    .range([0, width / 2 - margin / 2 - padding]);

  var x_scale_ratio = d3.scale.linear()
                    .domain([0, average_ratio_max])
                    .range([width / 2 - margin / 2 - padding, 0]);

        
  // draw  xy axis
  setup_draw_xy_axis_carrier(svg, x_scale_time, x_scale_ratio);
  
  // add bars 
  draw_plot_2_update_bars(nested_carrier_data);

  // title
  svg.append('g')
     .append("text")
     .attr("font-size", 22)
     .attr("class", "title_2")
     .attr("font-weight", "bold")
     .attr("transform", "translate(" + width * 0.37 + "," + 50 + ")")
     .text("Average Delay Time of Airline Carrier");

  // draw button _bottom
  var sort_button_bottom = svg.append("g")
                             .append("rect")
                             .attr("class", "button_bottom")
                             .attr("x", width * 0.44)
                             .attr("y", height + 30)
                             .attr("width", 172)
                             .attr("height",25)  
                             .attr("fill", "#a6a6a6");
  // draw sort text
  var sort_text= svg.append("g")
            .append("text")
            .attr("id", "sort_text")
            .attr("x", width * 0.445)
            .attr("y", height + 47 )
            .attr("font-size", 16)
            .text("sort by delay sort by ratio")
            .attr("fill", "black");

  // draw button
  var sort_button = svg.append("g")
                             .append("rect")
                             .attr("class", "button")
                             .attr("id", "sort_button")
                             .attr("x", width * 0.44 + 1)
                             .attr("y", height + 30 + 1)
                             .attr("width", 88)
                             .attr("height",23)  
                             .attr("fill", "#f2f2f2")
                             .attr("opacity", 1.0)
                             .attr("position", "left");

}