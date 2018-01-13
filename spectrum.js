var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// stepX, stepYを10で初期化
var initData = createData(10, 10);

//////////////////////
// 1. Fixed version //
//////////////////////

var svg_fixed = d3.select("svg.fixed")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// セルを描画
svg_fixed.selectAll("g.row")
    .data(initData)
  .enter().append("g")
    .attr("class", "row")
    .selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) { return d.gridX; })
    .attr("y", function(d) { return d.gridY; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .attr("fill", function(d) {	return "hsl(" + d.h + "," + d.s + "%," + d.l + "%)"; });


////////////////////////////
// 2. Interactive version //
////////////////////////////

var svg_interactive = d3.select("svg.interactive")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// マウスの位置に応じてstepを変化させ再描画
svg_interactive.on("mousemove", function() {
    stepX = d3.mouse(this)[0] + 2;
    stepY = d3.mouse(this)[1] + 2;
    update( createData(stepX, stepY) );
});

// The Initial display
update(initData);

// データに応じて描画し直す関数
function update(data) {
    // update row
    var row = svg_interactive.selectAll("g.row")
	.data(data);
    
    row.exit().remove();
    
    var rect = row.enter().append("g")
	.attr("class", "row")
      .merge(row)
	.selectAll("rect")
	.data(function(d) { return d; });
    
    // update rect
    rect.exit().remove();

    rect.enter().append("rect").merge(rect)
        .attr("x", function(d) { return d.gridX; })
	.attr("y", function(d) { return d.gridY; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.attr("fill", function(d) {	return "hsl(" + d.h + "," + d.s + "%," + d.l + "%)"; });
}


//////////
// 共通 //
//////////

// stepに基づいてデータを作成
function createData(stepX, stepY) {
    var data = new Array( Math.floor(height/stepY) + 1 );
    for (var i=0; i<data.length; i++) {
	data[i] = new Array( Math.floor(width/stepX) + 1 ).fill(0);
	data[i].forEach(function(d, j) {
	    var h = j*stepX / width;
	    var s = (height-i*stepY) / height;
	    var v = 1;
	    var hsl = hsv_to_hsl(h, s, v);
	    data[i][j] = {"gridX": j*stepX, "gridY": i*stepY, "width": stepX, "height": stepY,
			  "h": 360*hsl[0], "s": 100*hsl[1], "l": 100*hsl[2]};
	});
    }
    return data;
}

// hsvは指定できないのでhslに変換(範囲はいずれも0.0-1.0)
function hsv_to_hsl(h, s, v) {
    var l = (2 - s) * v / 2;
    if (l != 0) {
        if (l == 1) {
            s = 0
        } else if (l < 0.5) {
            s = s * v / (l * 2)
        } else {
            s = s * v / (2 - l * 2)
        }
    }
    return [h, s, l]
}
