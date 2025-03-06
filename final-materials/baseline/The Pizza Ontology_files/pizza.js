var w = 900,
	h = 900,
	root,
	node,
	link,
	nodes,
	original_nodes,
	node_list,
	closed_nodes = [],
	nodes_visited = [],
	links,
	original_links;
	
var hiddenLinks = [];

var force = d3.layout.force()
	.gravity(.10)
	.distance(90)
	.charge(-500)
	.on("tick", tick)
	.size([w, h]);

var vis = d3.select("#chart").append("svg:svg")
	.attr("width", w)
	.attr("height", h);

d3.json("./pizza.json", function(json) {
	// Check if the JSON file contains valid data
	if (json && Array.isArray(json) && json.length > 0) {
		links = json;
		node_list = {};
		
		links.forEach(function(link) {
			link.source = node_list[link.source] || (node_list[link.source] = {name: link.source});
			link.target = node_list[link.target] || (node_list[link.target] = {name: link.target});
		});
		original_links = deepCopy(links);
		
		original_nodes = d3.values(node_list);
		nodes = d3.values(node_list);
		
		//closing all non-leaf nodes
		i = nodes.length-1
		while(i>0)
		{
			n = nodes[i];
			if(hasChildren(n.name))
			{
				childNodesToBeRemoved = removeChildLinks(n.name);
				removeChildNodes(childNodesToBeRemoved);
				updateClosedNodeList(n.name);
			}
			
			i--;
		}
		//end close all
		
		update();
	} else {
		pass
		console.error("JSON data is invalid or empty.");
		alert("Error: The JSON data is empty or invalid.");
	}
});


function update() {
	// Restart the force layout.
	force
		.nodes(nodes)
		.links(links)
		.start();

	var svg = d3.select("body").append("svg:svg")
	.attr("width", w+200)
	.attr("height", h);


	//define marker
	svg.append("svg:defs").selectAll("marker")
		.data(["arrow"])
		.enter().append("svg:marker")
		.attr("id", "arrow")
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", -6)
		.attr("refY", 0)
		.attr("markerWidth", 10)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("svg:path")
		.attr("d", "M10,-5L0,0L10,5");

	//define highlighted marker
	svg.append("svg:defs").selectAll("marker")
		.data(["highlightedarrow"])
		.enter().append("svg:marker")
		.attr("id", "highlightedarrow")
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", -6)
		.attr("refY", 0)
		.attr("markerWidth", 10)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("svg:path")
		.attr("d", "M10,-5L0,0L10,5");

	// Update the links
	link = vis.selectAll("line.link")
		.data(links, function(d) { return d.target.id; });

	// Enter any new links.
	link.enter().insert("svg:line", ".node")
		.attr("class", "link")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
		.attr("marker-start", "url(#arrow)"); 

	// Selects the SVG element and add the text separately
	let linkLabels = vis.selectAll(".link-label") // Select existing labels for update
    	.data(links, function(d) { return d.target.id; }); // Use the same data join


	// Add labels to the links (edges) 
	linkLabels.enter().append('svg:text')
		.attr("class", "link-label")
		.attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
		.attr("y", function(d) { return (d.source.y + d.target.y) / 2; })
		.attr("text-anchor", "middle") // Center text horizontally
		.text(function(d) {return d.label || ""; }); 

	linkLabels // Select existing labels and update
		.attr("x", function(d) { return (d.source.x + d.target.x) / 2; }) // Calculate midpoint x
		.attr("y", function(d) { return (d.source.y + d.target.y) / 2; }) // Calculate midpoint y
		.text(function(d) { return d.label || ""; }); // Update text if needed

	linkLabels.exit().remove();
	link.exit().remove();

    // Update existing links (and their labels)
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

	// Exit any old links.
	link.exit().remove();

	node = vis.selectAll("g.node")
		.data(nodes, function(d) {return d.id;});

	nodeEnter = node.enter().append("svg:g")
		.attr("class", "node")   
		.call(node_drag);

	nodeEnter.append("svg:circle")
	.attr("class", "circle")
	.attr("r", 8)
	.on("mouseover", mouseover("#EB3E09", "#f5740a", "#F5250A"))
	.on("mouseout", mouseout("#c6dbef", "9ecae1", "#000000")) 
	.style("fill", color)
	.on("click", click);

	nodeEnter.append("svg:text")
	.attr("class", "nodetext")
	.attr("x", 11)
	.attr("y", 1)
	.text(function(d) { return d.name;})
	.on("click", click);

				
	// Exit any old nodes.
	node.exit().remove();    

	nodeEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  

	force.on("tick", tick);
}

//Toggle children on click.
function click(d,index) {

if(hasChildren(d.name))
{
	if($.inArray(d.name, closed_nodes) > -1)
	{
		nodes_visited = [];
		addChildLinks(d.name);
	}
	else
	{
		childNodesToBeRemoved = removeChildLinks(d.name);
		removeChildNodes(childNodesToBeRemoved);
	}

	updateClosedNodeList(d.name);
	
	update();
}
	
}

function updateClosedNodeList(id) {
	nodeIndex = $.inArray(id, closed_nodes);

	if(nodeIndex > -1) {
		closed_nodes.splice(nodeIndex,1);
	}
	else
	{
		closed_nodes.push(id);
	}

}

function hasChildren(id)
{
var i = 0;

while (i < original_links.length)
{
	if ((original_links[i].source.name == id))
	{
		return true;
	}
	
	i++;
}

return false;
}

function addChildLinks(id) {
	var i = 0;
	var childNodes = [];
	var childNodesToBeAdded = [];

	while (i < original_links.length) {
		//Find links where the source is the clicked node
		if ((original_links[i].source.name == id)) {
			//Add the child node if it is currently missing
			if(findNode(original_links[i].target.name) < 0)
			{
				nodes.push({name: original_links[i].target.name});
			}
			
			//Add the link between this child and the parent
			if(findLink(original_links[i].source.name, original_links[i].target.name) == -1)
			{
				links.push({source: nodes[findNodeIndex(id)], target: nodes[findNodeIndex(original_links[i].target.name)]});
			}
			
			nodes_visited.push(id);
			
			//Recursively show the child's children
			if($.inArray(original_links[i].target.name, closed_nodes) == -1)
			{	
				//This if statement stops an infinite loop that occurs through cyclic links
				if($.inArray(original_links[i].target.name, nodes_visited) == -1)
				{
					addChildLinks(original_links[i].target.name);
				}
				//else
				//{
				//	alert('Been to ' + original_links[i].target.name + ' already!')
				//}
			}
		} 
		i++;
	}

	// Add labels to the new links
    for (let i = 0; i < original_links.length; i++) {
        if (original_links[i].source.name === id) {
            if (findLink(original_links[i].source.name, original_links[i].target.name) == -1) {
                let sourceNode = nodes[findNodeIndex(id)];
                let targetNode = nodes[findNodeIndex(original_links[i].target.name)];

                let newLink = {
                    source: sourceNode,
                    target: targetNode,
                    label: original_links[i].label // Get the label from original_links
                };
                links.push(newLink);
            }
        }
    }
}


function removeChildLinks(id) {
var i = 0;
var n = findNode(id);
var childNodes = [];
var childNodesToBeRemoved = [];

//Getting the child nodes
while (i < links.length)
{
	if ((links[i].source == n))
	{
		childNodes.push(links[i].target.name);
	} 
	i++;
}

//Removing links between parent and children
j = links.length-1;
while (j > -1)
{
	if ($.inArray(links[j].target.name, childNodes) > -1 && links[j].source==n)
	{
		links.splice(j,1);
	}
	j--;
}

//Checking what child nodes should be removed
i=childNodes.length-1
while(i>-1)
{
	otherLinks = 0;

	j = 0;
	while (j < links.length)
	{
		if ((links[j].target.name == childNodes[i]))
		{
			otherLinks++;
		} 
		j++;
	}

	if(otherLinks==0)
	{
		childNodesToBeRemoved.push(childNodes[i]);
		childNodesToBeRemoved = childNodesToBeRemoved.concat(removeChildLinks(childNodes[i]).slice());
	}

	i--;
}

return childNodesToBeRemoved;
}

function removeChildNodes(childNodesToBeRemoved)
{
//Removing nodes
j = nodes.length-1;
while (j > -1)
{
	if ($.inArray(nodes[j].name, childNodesToBeRemoved) > -1)
	{
		nodes.splice(j,1);
	}
	j--;
}
update();
};

function findNode(id)
{
for (var i in nodes)
{
	if (nodes[i].name === id) return nodes[i];
};

return -1;
};

function findNodeIndex(id) {
for (var i=0;i<nodes.length;i++)
{
	if (nodes[i].name==id)
	{
		return i;
	}
};
};

function findLink(source, target)
{
for (var i in links)
{
	if (links[i].source == source && links[i].target == target)
	{
		return links[i];
	}
};

return -1;
};

function tick() {	
	// Update link label positions
	vis.selectAll(".link-label")
		.attr("x", function(d) { return (d.source.x + d.target.x) / 2; }) // Calculate midpoint x
		.attr("y", function(d) { return (d.source.y + d.target.y) / 2; }) // Calculate midpoint y
    
	// Update the link positions
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	// Update the node positions
	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });     
}

//color nodes that can be expanded dark blue and those that cannot light blue.
function color(d) {
if($.inArray(d.name, closed_nodes) > -1)
{
return "#3182bd";
}
else
{
return "#c6dbef";
}
}

function mouseover(circleFill, lineFill, textFill){
return function(d, i){
	
	xPos=d.x;
	yPos=d.y;		 
		
	var node = d3.select(this)
		.style("fill", circleFill)
		.style("fill-opacity", 1)
		.style("stroke-opacity", 1);
	
	//highlights the node that is being moused over
	var text = d3.selectAll("text")
		.filter(function(g, i){return g.x==d.x})
		.style("fill", circleFill)

	var adjacentLinks = d3.selectAll("line.link")
		.filter(function(d, i) { return d.source.x==xPos && d.source.y==yPos;})
		.style("stroke-opacity", 1)
		.style("stroke", "#f5740a")
		.attr("marker-start", "url(#highlightedarrow)")
		.each(function(d){
			d3.selectAll("circle")
			.filter(function(g, i){return d.target.x==g.x && d.target.y==g.y;})
			.style("fill-opacity", 1)
			.style("stroke-opacity", 1)
			.style("fill", "#F5250A")
			.each(function(d){
				d3.selectAll("text")
					.filter(function(g, i){return g.x==d.x})
					.style("fill", "#F5250A")
					
			});
	
	});
				
		

};

}

function mouseout(circleFill, lineFill, textFill){
return function(d, i){
	d3.selectAll("circle")
		.style("fill", color)
		.style("fill-opacity", .75)
		.style("stroke-opacity", 1);
	
	d3.selectAll("line")
		.style("stroke", lineFill)
		.style("stroke-opacity", .75)
		.attr("marker-start", "url(#arrow)"); 
	
	//d3.selectAll("marker")
		//.style("fill", lineFill);
	
	d3.selectAll("text").style("fill", "000");
};
}

//leave a node at the same spot once it's been dragged to it
var node_drag = d3.behavior.drag()
.on("dragstart", dragstart)
.on("drag", dragmove)
.on("dragend", dragend);

function dragstart(d, i) {
force.stop() // stops the force auto positioning before you start dragging
}

function dragmove(d, i) {
d.px += d3.event.dx;
d.py += d3.event.dy;
d.x += d3.event.dx;
d.y += d3.event.dy; 
tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) {
d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
tick();
force.resume();
}

function deepCopy(obj) {
if (Object.prototype.toString.call(obj) === '[object Array]') {
	var out = [], i = 0, len = obj.length;
	for ( ; i < len; i++ ) {
		out[i] = arguments.callee(obj[i]);
	}
	return out;
}
if (typeof obj === 'object') {
	var out = {}, i;
	for ( i in obj ) {
		out[i] = arguments.callee(obj[i]);
	}
	return out;
}
return obj;
}