# D2_data_visualizations

All visualizations use D3.js. 
The tree map and circle packing was viewed and worked on using observableHq notebook.
The baseline was worked on using local server, it has it's own HTML.

The baseline visualization:
1. A resused visualization provided and made by Dr. Bo Fu
2. Nodes are collapsable
3. Darker nodes means it can collapse and there are subclasses within, lighter nodes means there are no further subclasses

The circle packing visualization:
1. The positioning of the circles are hardcoded in "predestined positions"
2. Users can only enter circle if there is subclasses within
3. Circles can only highlight and enter if hovered above their layer
4. Can not go back one, it will take user back to the beginning

The tree map visualization:
1. The positioning and json is hardcoded in "predestined positions"
2. Overlapping is visually seen
