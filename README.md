The code formatting is consistant. Since the dataset use features like "arr-delay", the format I use in my code agrees with such a format. For example, instead of use function name like "getValue", the name I use is "get_value".

Version improvements are:

version 1 plot total arr_flights
version 2 plot ontime ratio over year
version 3 add interaction to plot 1
version 4 add plot 2 which shows average delay time
version 5 plot 2 now show delay&ratio and can sort by either of them
version 6 split code into different .js files for better management
version 7 used graph to display a story
version 8 was the version submitted before. But there were some defects in it
version 9 corrects some errors and typoes in version 8 and is currently newest version

version 7 tells the story. The versions before version 7 do not include storying telling or their webpage appearance may be bad but they are still important because they are the base of the final version. 

To show the webpage, turn on control console then go to one version directory. Type into control console the follow command: 

    python -m SimpleHTTPServer

Then go to web browser and type in address: localhost:8000. Find the .html file and click it to go to the right webpage. 

Summary
The purpose of this project is to help people decide which airline carrier to take if they are time sensitive. I used line chatter to show evolution and bar chart to compare different choices. In the line chart, a perticular airline could be distinguished from others by mouseover or click. In the bar chart, interaction is used to take different strategies. From the illustration and analysis, we find some pretty good choices of airline carriers to DC if you hate being late. "VX", "UA", "AS" and "DL" are among best good options for most people if available. If those carrier are not availabe for you, the plots with interactions can still give you a hand to help decide which airline suits you best. 

For someone who feels hard to choose if there is tradeoff, I also created a new feature called "Opportunity Delay" to help them decide. This feature combined two factors and is more eaier to be accepted.

More information and analysis is in index_final.html.

Design
I would like to see the performance evolution of each airline carrier over years to find any trend, so a line chart is the best to accomplish this goal. But plot a lot of lines on the same chart is a little messy, so I design some interactions such as mouseover and click to highlight the lines that one is interested at. Such interactions help people focus on perticular lines. 

I also want to compare different choices. First I want to compare the average delay time of each airline. Bar chart is good at this. Second, I want to find how to balance between delay time and delay chance. So I create another bar chart of ontime ratio and put them together side to side. As is shown in the second plot. I also want to make the results of different decisions more clear, so I add the switch button which will sort the data according to dffierent strategies.

Then my girlfriend provided me a good improvement. If there are two factors which both can affect their decision, and these two factors can not be best at the same time, it would be hard for them to choose. So inspired by economics concept "Opportunity Cost", I combined delay time and delay possibility and produced a new feature "Opportunity Delay". So now there is only one factor and it would be much easier to decide. To compare "Opportunity Delay" between different carriers, the most suitable chart is still bar chart. 

All the plots have borders because it makes the plot more clear. For the first plot, I use different colors to represent different carriers. For the two bar charts, I use green to be the color becasue it's more comfortable and clear to me. Plot 1, plot 2 and plot 3 all have interactions. 

Feedback
  
1st person: Plot 2 draws histogram. If the bars are not ordered, it's not easy to see at first glance which is best.
Improvement: Sorted the data according to required value. Make the plot better.

2nd person: When one line in plot 1 is pinned, it's not easy to see if it has realy been pinned. It happens a lot that we thought one line has been pinned, but when the mouse moved away, the line's highlight disappeared. It acturally has not been pinned.
Improvement: Change the interaction so now when one line is pinned, its width will shrink. Such a transmission process works as an indicator to show if one line is pinned.

3rd person: when mouse moves over lines or bars and then moves away, the highlighted element would still be highlighted which makes the display logic not consistant. 
Improvement: Add "mouseout" method into the interaction. So now when mouse moves away, everything will return to default.

4th person: The second plot provides two factors for people to balance to make best choice. It is hard for some people to do this.
Improvement: As mentioned in the above Desigan section, I created a new feature to help people to decide.

Resources
	www.udacity.com
	www.google.com
	www.stackoverflow.com
	www.w3schools.com
	www.transtats.bts.gov
	www.dashingd3js.com
	http://alignedleft.com/tutorials/d3
	I also discussed with my friend to debug my code.
