var idxs1 = 0;
var idxs2 = 1;
var options = {};
var datx = new Array();
var daty = new Array();
var data2 = new Array();
var datas = {};
var test = new Array();
var name_tag = new Array();
var shape_size = 30;
var Menu = new Array();
var X_mod = "TCGA-E9-A1NI-01A";
var Y_mod = "TCGA-A1-A0SP-01A";
var W = 700;
var attrs;

var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
    },

    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

function SlideValue(val) {
    var view = document.getElementById("size_slider");
    var box = document.getElementById("size_num");
    box.value = val;
    view.value = val;
    //==========================================//
    for (var i = 0; i < c1.length; i++) {
        if (datx[i] < val)
            c1[i].style.display = "none";

        else
            c1[i].style.display = "block";
    }
    //==========================================//
}

d3.tsv("https://raw.githubusercontent.com/sangyeop910/TCGA_just10/main/TCGA_10.tsv").then(result => {
    attrs = Object.keys(result[0]).filter(a => {
        test = Number(result[0][a]);
        if (isNaN(test) != true) {
            return (typeof test === "number")
        }
    });
    name_tag = Object.keys(result[0]).filter(a => {
        test = Number(result[0][a]);
        if (isNaN(test) == true) {
            return (typeof test === "number")
        }
    });

    console.log(result)
    data1 = result.map(d => name_tag.map((a, i) => d[a]));
    data2 = result.map(d => attrs.map((a, i) => d[a]));

    for (var i = 0; i < attrs.length; i++) {
        for (var j = i; j < attrs.length; j++) {
            if (attrs[i] != attrs[j])
                Menu.push(attrs[i] + " : " + attrs[j])
        }
    }

    for (var i = 0; i < attrs.length; i++) {
        datas[i] = new Array();
    }

    for (var i = 0; i < Menu.length; i++) {
        options[i] = Menu[i];
        var opt = document.createElement('option');
        opt.innerText = Menu[i];
        opt.value = i;
        mod1.appendChild(opt)
    }
    options.length = 0;

    for (var i = 0; i < data2.length; i++) {
        for (var j = 0; j < attrs.length; j++) {
            datas[j].push(data2[i][j]);
        }
    }
    datx = datas[idxs1];
    daty = datas[idxs2];

    var mod = document.getElementById("mod");
    draw(datas[0], datas[1]);

}).catch(e => {
    console.log(e)
});

function draw(q, p) {
    size_slider.min = Math.min.apply(null, q);
    size_slider.max = Math.max.apply(null, q) + 0.1;
    size_slider.value = Math.min.apply(null, q);
    size_num.min = Math.min.apply(null, q);
    size_num.max = Math.max.apply(null, q) + 0.1;
    size_num.value = Math.min.apply(null, q);

    let svg = d3.select(".Graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, W, W])
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([Math.min.apply(null, q) - 0.1, Math.max.apply(null, q) + 0.1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([Math.min.apply(null, p) - 0.1, Math.max.apply(null, p) + 0.1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    let gs = svg.selectAll(".point")
        .data(data2)
        .enter()
        .append("g")
        .append("circle")
        .attr("id", "c1")
        .attr("class", "point")
        .attr("fill", "#78a8f6")
        .attr("stroke", "#78a8f6")
        .style("stroke-width", 2)
        .attr("cx", (d, i) => x(q[i]))
        .attr("cy", (d, i) => y(p[i]))
        .attr("r", 2)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    /*.on("click", click)*/

}
//====================================================================//
function changeMod(val) { //option에 따른 onchange event 처리
    var menu = document.getElementById("mod1");
    menu.value = val;

    var xa = Menu[val].split(':')[0];
    var ya = Menu[val].split(':')[1];

    X_mod = xa.slice(0, -1);
    Y_mod = ya.slice(1);

    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i] === X_mod) {
            idxs1 = i;
            break;
        }
    }
    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i] === Y_mod) {
            idxs2 = i;
            break;
        }
    }

    d3.select("svg").remove();
    draw(datas[idxs1], datas[idxs2]);

}
//====================================================================//
const tooltip = d3.select(".Graph")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("padding", "10px")
    .style("border", "2px solid black")
    .style("width", "300px")
    .style("pointer-events", "none")
    .style("background", "white")
    .style("text-align", "center");

function mouseover(event, d, val) {
    tooltip.style("opacity", 1)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 65) + "px")
        .html(X_mod + " : " + d[0] + "<br/>" + Y_mod + " : " + d[1])
    d3.select(this).style("r", 3).style("stroke", "#e57373");
}

function mouseout(d) {
    d3.select(this).style("r", 2).style("stroke", "#78a8f6")
    tooltip.style("opacity", 0);
}

/*function click(event, d) {
    var colr = d3.select(this).style("fill") == "#78a8f6" ? "#e57373" : "#78a8f6";
    d3.select(this).style("fill", colr)
}*/