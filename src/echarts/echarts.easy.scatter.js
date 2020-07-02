/**
 * based on echarts4.8.0
 * author: dyn
 **/
(function(window, ec, undefined){
    var _charts = window.scatter;
    var option = {};
    //Object.assign()   ES2015
    //该方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
    if (typeof Object.assign != 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    function clone(target){          //克隆对象
        if(typeof target != 'object' || target == null){
            return target
        }
        if(target instanceof Array){
            var newArr = [];
            for(var i = 0; i < target.length; i++){
                newArr.push(clone(target[i]));
            }
            return newArr;
        }
        var newObj = new Object();
        for(var i in target){
            newObj[i] = clone(target[i]);
        }
        return newObj;
    }

    var Charts = function(type, selector){
        this.type = type;
        this.chart = ec.init(document.querySelector(selector));
        this.option = this.setDefaultOption()
        this.queue = [];
    };

    Charts.prototype = {
        setTitle : function(text){         //设置标题
            this.option.title.text = text;
            return this;
        },
        setLegend : function(data, config){     //设置图例
            var oLegend = this.option.legend || {};
            this.option.legend = config ? Object.assign(oLegend, config) : oLegend;
            this.option.legend.data = data;
            return this;
        },
        setXAxisSplitLine : function(show){
            this.option['xAxis'].splitLine.show = show;
            return this;
        },
        setYAxisSplitLine : function(show){
            this.option['yAxis'].splitLine.show = show;
            return this;
        },
        setXAxisName: function(name){
            this.option['xAxis'].name = name;
            return this;
        },
        setYAxisName: function(name){
            this.option['yAxis'].name = name;
            return this;
        },
        // 设置坐标轴的显示间隔
        setXAxisInterval: function(interval='auto'){
            this.option['xAxis'].axisLabel.interval = interval;
            return this;
        },
        // 设置坐标轴的显示间隔
        setYAxisInterval: function(interval='auto'){
            this.option['yAxis'].axisLabel.interval = interval;
            return this;
        },
        // 设置坐标轴的字体
        setXAxisFontStyle: function(fontStyle='normal'){
            this.option['xAxis'].axisLabel.fontStyle = fontStyle;
            return this;
        },
        // 设置坐标轴的字体
        setYAxisFontStyle: function(fontStyle='normal'){
            this.option['yAxis'].axisLabel.fontStyle = fontStyle;
            return this;
        },
        // 设置坐标轴的字体大小
        setXAxisFontWeight: function(fontWeight='normal'){
            this.option['xAxis'].axisLabel.fontWeight = fontWeight;
            return this;
        },
        // 设置坐标轴的字体大小
        setYAxisFontWeight: function(fontWeight='normal'){
            this.option['yAxis'].axisLabel.fontWeight = fontWeight;
            return this;
        },
        // 设置坐标轴的字体颜色
        setXAxisFontColor: function(color='rgb(0,0,0)'){
            this.option['xAxis'].axisLabel.color = color;
            return this;
        },
        // 设置坐标轴的字体颜色
        setYAxisFontColor: function(color='rgb(0,0,0)'){
            this.option['yAxis'].axisLabel.color = color;
            return this;
        },
        setXAxisType: function(type='category'){
            this.option['xAxis'].type = type;
            return this;
        },
        setYAxisType: function(type='category'){
            this.option['yAxis'].type = type;
            return this;
        },
        setXAxisMinAndMax: function(min = 0 , max){
            this.option['xAxis'].min = min;
            this.option['xAxis'].max = max;
            return this;
        },
        setYAxisMinAndMax: function(min = 0 , max){
            this.option['yAxis'].min = min;
            this.option['yAxis'].max = max;
            return this;
        },
        // 设置坐标类型
        setAxisLabelFormat : function(axis, format){    //设置坐标轴
            this.option[axis].type = 'category';
            if(format == 'HH:mm:ss'){
                this.option[axis].axisLabel.formatter = function(value, index){
                    var year = value.substring(0, 4);
                    var month = value.substring(5, 7);
                    var day = value.substring(8, 10);
                    var hour = value.substring(11, 13);
                    var minute = value.substring(14, 16);
                    var seconds = value.substring(17, 19);
                    // 格式化成月/日，只在第一个刻度显示年份
                    var date = new Date(value);
                    var texts = date.getHours() + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes())+":"+ (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds());
                    return texts;
                }
            }else if(format == 'HH:mm'){
                this.option[axis].axisLabel.formatter = function(value, index){
                    // 格式化成月/日，只在第一个刻度显示年份
                    var date = new Date(value);
                    var texts = date.getHours() + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
                    return texts;
                }
            }else if(format == 'yyyy-MM-dd HH:mm:ss'){
                this.option[axis].axisLabel.formatter = function(value, index) {
                    var year = value.substring(0, 4);
                    var month = value.substring(5, 7);
                    var day = value.substring(8, 10);
                    var hour = value.substring(11, 13);
                    var minute = value.substring(14, 16);
                    var seconds = value.substring(17, 19);
                    // 格式化成月/日，只在第一个刻度显示年份
                    var date = new Date(year, month, day, hour, minute, seconds);
                    var texts = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
                    return texts;
                }
            }else{
                this.option[axis].axisLabel.formatter = function(value, index){
                    // 格式化成月/日，只在第一个刻度显示年份
                    var date = new Date(value);
                    var texts = date.getHours() + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
                    return texts;
                }
            }
            return this;
        },
        setSeries : function(series){          //type:类型， series:同ehcarts的series
            var oSeries = clone(this.option.series || [{}]);
            this.option.series = oSeries;
            for(var i = 0; i < series.length; i++){
                this.option.series[i] = Object.assign({type:this.type}, oSeries[0], series[i]);
            }
            return this;
        },
        setXAxisData : function(data){
            var oData = clone(this.option['xAxis'].data || [{}]);
            this.option['xAxis'].data = data;
            return this;
        },
        setYAxisData : function(data, reverse){
            if(reverse){
                this.option['yAxis'].data = data;
            }else{
                var oSeries = new Array(data.length);
                this.option.series = oSeries;
                for(var i = 0; i < data.length; i++){
                    this.option.series[i] = Object.assign({type:this.type}, [{data:[]}]);
                    this.option.series[i].data = data[i];
                }
            }

            return this;
        },

        setYAxisLine: function(show){
            this.option['yAxis'].axisLine.show = show;
            return this;
        },
        setXAxisLine: function(show){
            this.option['xAxis'].axisLine.show = show;
            return this;
        },
        setAreaColor : function(colors){
            var series = clone(this.option.series || [{}]);
            this.option.series = series;
            for(var i = 0; i < series.length; i++){
                this.option.series[i].areaStyle.color = colors[i];
            }
            return this;
        },
        setItemColor : function(colors){
            var series = clone(this.option.series || [{}]);
            this.option.series = series;
            for(var i = 0; i < series.length; i++){
                this.option.series[i].itemStyle.color = colors[i];
            }
            return this;
        },
        setSmooth: function(smooth){
            var series = clone(this.option.series || [{}]);
            this.option.series = series;
            for(var i = 0; i < series.length; i++){
                this.option.series[i].smooth = smooth;
            }
            return this;
        },
        setDefaultOption : function(public){
            data = {
                title:{
                    x:'center',
                    text: '',
                    textStyle: {
                        color: 'rgb(255,255,255)',
                        fontSize: 18,
                        fontFamily: 'PingFangSC-Semibold',
                        fontWeight: 'normal'
                    }
                },
                legend:{
                    left: '32%',
                    top: 30,
                    textStyle:{
                        color: 'rgb(255,255,255)',
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 16
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    borderWidth: 1,
                    padding: 10,
                    extraCssText: 'width: 100px'
                },
                grid: {
                    left: '8%',
                    right: '8%',
                    bottom: '8%'
                },
                xAxis:{
                    type: 'category',
                    splitLine:{
                        show: false,
                        lineStyle: {
                            color: '#38487F'
                        }
                    },
                    boundaryGap: false,
                    axisLabel:{
                        color: 'rgb(0, 0, 0)',
                        interval: 'auto',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'PingFangSC-Regular',
                        formatter: function (value, index) {
                            return value;
                        }
                    },
                },
                yAxis:{
                    type: 'value',
                    nameTextStyle: {
                        color: 'rgb(255,255,255)'
                    },
                    splitLine:{
                        show: false,
                        lineStyle: {
                            color: '#38487F'
                        }
                    },
                    axisLabel:{
                        color: 'rgb(0, 0, 0)',
                        interval: 'auto',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'PingFangSC-Regular',
                    },
                },
                series: [
                    {
                        areaStyle: {},
                        itemStyle: {},
                    }
                ]
            };
            return Object.assign(public || {}, data || {});
        },
        pushPoint: function(point){
            this.queue.push(point);
            return this;
        },
        create : function(){              //创建图表
            this.chart.setOption(this.option);
        }
    };
    var charts = function(type, selector){
        return new Charts(type, selector);
    };

    charts.changeDefault = function(type, newItem){       //只能添加和更改默认设置项，不能删除
        function change(option, newItem){
            for(var j in newItem){
                if(option.hasOwnProperty(j)){
                    if(typeof newItem[j] != 'object' || newItem[j] == null || newItem[j] instanceof Array){
                        option = Object.assign(option, newItem);
                    }else{
                        change(option[j], newItem[j]);
                    }
                }else{
                    option[j] = newItem[j];
                }
            }
        }
        change(option[type], newItem);
    };
    charts.cloneDefault = function(type, source){
        option[type] = clone(option[source]);
    };
    charts.extend = function(name, fun){
        for(var key in Charts.prototype){
            if(name === key){
                console.log('the key has been defined');
                return false;
            }
        }
        Charts.prototype[name] = fun;
    };
    charts.noConflict = function(){       //解决变量冲突
        if(window.scatter === charts){
            window.scatter = _charts;
        }
        return charts;
    };
    window.scatter = charts;
    //module.exports = charts;
})(window, echarts);
