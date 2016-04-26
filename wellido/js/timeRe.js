//ģ������
var simulateData = {
    'csrfmiddlewaretoken': 'RAFAfBHNzbmebeDooNMSs2jrgVcNaAeU',
    'search':'rr_rate',
    'endpoint': "/zh-cn/stat/task/app2/cap/intf6/",
    'app_name':'app2',
    'metric': "1",
    'search_mode': 'normal',
    'scope':'capture',
    'cap_name':'intf6',
    'earliest': '1457407519.0',
    'latest': '1457407769.0',
    'dim_trans_type': '*',
    'dim_sub_trans_type': '*'
}

//��ѯ��������
var responseData = {};
function reciveData(sendData) {
    responseData.csrfmiddlewaretoken = sendData.csrfmiddlewaretoken;
    responseData.search = sendData.search;
    responseData.endpoint = sendData.endpoint;
    responseData.app_name = sendData.app_name;
    responseData.metric = sendData.metric;
    responseData.app_name = sendData.app_name;
    responseData.search_mode = sendData.search_mode;
    responseData.scope = sendData.scope;
    responseData.cap_name = sendData.cap_name;
    responseData.earliest = sendData.earliest;
    responseData.latest = sendData.latest;
    responseData.dim_trans_type = sendData.dim_trans_type;
    responseData.dim_sub_trans_type = sendData.dim_sub_trans_type;
}
reciveData(simulateData);

//ʱ���ʽ��
function timeFormat(time){
    var xTime1 = new Date(time*1000).toLocaleString();
    return(xTime1);
}


//��ͼ���ݽ���
var timeData = [];
responseSrc = "search=" + responseData.search
    + "&endpoint=" + responseData.endpoint
    + "&app_name=" + responseData.app_name
    + "&search_mode=" + responseData.search_mode
    + "&scope=" + responseData.scope
    + "&cap_name=" + responseData.cap_name
    + "&earliest=" + responseData.earliest
    + "&latest=" + responseData.latest
    + "&dim_trans_type=" + responseData.dim_trans_type
    + "&dim_sub_trans_type=" + responseData.dim_sub_trans_type
    + "&metric=" + responseData.metric;
var temporaryData;
d3.json(responseData.endpoint)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post(responseSrc, function (e, datas) {
        if(datas['ok']) {
            d3.json(responseData.endpoint +  datas.job_id + "/")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .post("csrfmiddlewaretoken=" + responseData.csrfmiddlewaretoken,
                    function(e,result) {
                        if(result.status.isDone) {
                            temporaryData = result.results;
                            for (var i = 0;i < temporaryData.length;i++) {
                                var temporaryTime = timeFormat(temporaryData[i].time);
                                if(temporaryTime.indexOf(" ") >= 0 ){
                                    timeData.push({
                                    'x' : temporaryTime.split(" ")[0],
                                    'y' : temporaryData[i].duration,
                                    'z' : temporaryTime.split(" ")[1],  
                                    });
                                }
                            }
                            paintResponse(timeData);
                        }
                    })
        }
    });
            

function paintResponse(timeData) {    
var axisNum = timeData.length;
var padding =  150;  //�߽�ֵ
var axisW =  1000;      //��������
var width =  1300;      //SVG���
var height =  500;    //SVG�߶�
var circleR = 3;                              //Բ��뾶
//��Ż�ͼ����
var dataset = [];
var dataset2 = [];
for (var i = 1; i <= axisNum ; i++)
{
    dataset.push([i,timeData[i-1].y]);
    dataset2.push({"x" : i, "y" : timeData[i-1].y});
}
var yMax = d3.max(dataset,function(d){return d[1];}); //y�����ֵ
var yaxisData = [yMax*(1/3) , yMax*(2/3) , yMax]; //����y������

//�߶�����
var xScale = d3.scale.linear()
    .domain([1,axisNum])
    .range([0,axisW]);
var yScale = d3.scale.linear()
    .domain([0, yMax])
    .range([height - padding, padding]);
var yPoint = d3.scale.linear()
    .domain([0, d3.max(timeData, function(d) { return d.y; })])
    .range([height - padding, padding]);

//����SVG
var svg = d3.select('body')
            .append('svg')
            .attr({
                width : width,
                height : height
            });

//�������
var axis = d3.svg.axis()
             .scale(xScale)
             .orient('bottom')
             .ticks(axisNum);
             
function printAxis(d) {
  var g = d3.select(this.parentNode);
  var dateInfo = d3.select(this).html(d.x);
  var hourInfo = g.append('text').html(d.z);
  dateInfo.attr({ dy : 15 });
  hourInfo.attr({dx : -45 ,dy : 40 });
}
svg.append('g')
    .attr("class", "axis")
    .attr('transform', 'translate(' + padding + ',' + (height - padding) + ')')
    .call(axis);

d3.selectAll('svg text').data(timeData).each(printAxis);

svg.append('line').attr({
    x1: xScale(1) + padding,
    y1: yScale(0),
    x2: xScale(axisNum) + padding,
    y2: yScale(0)
}).style({
    'stroke' : 'darkgray',
    'stroke-width' : 2  
});

//����·��
var line = d3.svg.line()
    .x(function (d) {
        return xScale(d.x)+ padding;
    })
    .y(function (d) {
        return yPoint(d.y);
    })
    .interpolate('monotone');

var path = svg.append('path')
    .attr('d', line(dataset2))
    .attr({
         'stroke' : 'red',
         'stroke-width' : 1,
         'fill' : 'none'
    });

//�������
for (var lineNum = 0; lineNum < yaxisData.length; lineNum++) {
    svg.append('line').attr({
        x1: xScale(1) + padding,
        y1: yScale(yaxisData[lineNum]),
        x2: xScale(axisNum) + padding,
        y2: yScale(yaxisData[lineNum])
    }).style({
        'stroke' : 'darkgray',
        'stroke-width' : 1
    });
}

//��������
for (var pointNum = 0; pointNum < axisNum; pointNum++) {
    svg.append('line').attr({
        x1 : xScale(dataset[pointNum][0]) + padding,
        y1 : yScale(dataset[pointNum][1]),
        x2 : xScale(dataset[pointNum][0]) + padding,
        y2 : yScale(0)
    }).style({
        'stroke' : 'darkgray',
        'stroke-width' : 1
        
    });
} 
    

//����Բ��
svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return xScale(d[0]) + padding;
    })
    .attr("cy", function (d) {
        return yScale(d[1]);
    })
    .attr("r", circleR)
    .style({
         'fill' : 'white',
         'stroke' : 'red',
         'stroke-width' : 1
    });
}