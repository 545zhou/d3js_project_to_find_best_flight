// set up and draw y axis for the histogram
function setup_draw_y_axis_carrier(element, y_scale){
  var y_axis = d3.svg.axis()
                      .scale(y_scale)
                      .orient("left");

  element.append('g')
          .attr('class', 'y axis')
          .attr('transform', "translate(" + margin + "," + 2 * margin + ")")
          .call(y_axis);

  element.append('text')
          .attr("transform", "rotate(-90)")
          .attr("transform", "translate("+ (margin/2) +","+(height/2 + margin)+")rotate(-90)")
          .style("text-anchor", "middle")
          .text("opportunity delay (minutes)")
          .attr("font-size", "20px") ;
};

// set up and draw y axis for the histogram
function setup_draw_y_axis_oppo_carrier(element, y_scale){
  var y_axis = d3.svg.axis()
                      .scale(y_scale)
                      .orient("left");

  element.append('g')
          .attr('class', 'y axis')
          .attr('transform', "translate(" + margin + "," + 2 * margin + ")")
          .call(y_axis);

  element.append('text')
          .attr("transform", "rotate(-90)")
          .attr("transform", "translate("+ (margin/2) +","+(height/2 + margin)+")rotate(-90)")
          .style("text-anchor", "middle")
          .text("opportunity delay (minutes)")
          .attr("font-size", "20px") ;
};

function draw_plot_3(nested_carrier_data){

  var bar_padding = 4;
  // draw the second plot 
  var svg = d3.select(".plot-3")
              .append("svg")
              .attr("width", width + margin)
              .attr("height", height + margin)
              .append('g')
              .attr('class', 'oppo_delay');

  // draw svg border
  setup_svg(svg);

  var oppo_delay_max = d3.max(nested_carrier_data, function(d){
                          return d.values.oppo_delay;
                        });

  var height_scale = d3.scale.linear()
                    .domain([0, oppo_delay_max])
                    .range([height - margin * 2, 0]);

  // draw y axis
  setup_draw_y_axis_oppo_carrier(svg, height_scale);

  svg.append('g')
     .selectAll("rect")
     .data(nested_carrier_data.sort(function(a, b) { 
              return a.values['oppo_delay'] - b.values['oppo_delay'];
           }), function(d){
              return d.key;
     })
     .enter()
     .append("rect")
     .attr("class", "bar_3")
     .attr("x", function(d, i) {
        return i * ((width + margin) * 0.75 / nested_carrier_data.length) + width * 0.125;
      })      
     .attr("y", function(d) {
          return 2 * margin +  height_scale(d.values.oppo_delay);  
      })
     .attr("width", (width + margin) * 0.75 / nested_carrier_data.length - bar_padding)
     .attr("height", function(d) {
        return height - 2 * margin - height_scale(d.values.oppo_delay);
      })
     .attr("fill", "teal")
     .attr("name", function(d){
        return d.values.carrier_name;
     })
     .attr("short_name", function(d){
        return d.key;
     });



  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("x", function(d, i) {
        return i * ((width + margin) * 0.75 / nested_carrier_data.length) + width * 0.125 + 25;
     })
     .attr("y", function(d) {
        return 2 * margin +  height_scale(d.values.oppo_delay) + 20;
     })
     .attr("fill", "white")
     .text(function(d){
        //debugger;
        return d.values.oppo_delay.toFixed();
     });

  svg.append('g')
     .selectAll("text")
     .data(nested_carrier_data)
     .enter()
     .append("text")
     .attr("x", function(d, i) {
        return i * ((width + margin) * 0.75 / nested_carrier_data.length) + width * 0.125 + 23;
     })
     .attr("y", function(d) {
        return height + 20;
     })
     .attr("fill", "black")
     .text(function(d){
        //debugger;
        return d.key;
     });


  // title
  svg.append('g')
     .append("text")
     .attr("font-size", 22)
     .attr("class", "title_3")
     .attr("font-weight", "bold")
     .attr("transform", "translate(" + width * 0.35 + "," + 50 + ")")
     .text("Opportunity Delay of Airline Carrier");

  // draw legend
  var legend_3 = svg.append("g")
                  .append("text")
                  .attr("class", "legend_3 legend")
                  .attr("transform", "translate(" + width * 0.45 + "," + margin * 1.5 + ")")
                  .attr("font-size", 16);

  
  // set up bar events
  var bars = d3.selectAll(".bar_3");
  
  bars.on("mouseover", function(d){
    d3.selectAll(".bar_3").style("fill", "teal");
    var short_name = d3.select(this).attr("short_name");
    //debugger;
    legend_3.text(d3.select(this).attr("short_name") + " : " + d3.select(this).attr("name"));

    d3.selectAll(".bar_3").each(function(d, i){
      //debugger;
      if(short_name == d3.select(this).attr("short_name")){
          d3.select(this).style("fill", "blue");
      }
    });
  });

  bars.on("mouseout", function(d){
    d3.selectAll(".bar_3").style("fill", "teal");
    legend_3.text("");
  });

};