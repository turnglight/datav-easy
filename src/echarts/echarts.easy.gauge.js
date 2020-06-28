/**
 * based on echarts4.8.0
 * author: dyn
 **/
(function(window, ec, undefined){
    var _charts = window.gauge;
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
        this.option = this.setGaugeDefaultOption()
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
        setSplitNumber: function(splitNumber){
            this.option.series = Object.assign(this.option.series, [])
            for(var i = 0; i < splitNumber.length; i++){
                this.option.series[i].splitNumber = splitNumber[i];
            }
            return this;
        },
        setMin : function(min){
            this.option.series = Object.assign(this.option.series, [])
            for(var i = 0; i < min.length; i++){
                this.option.series[i].min = min[i];
            }
            return this;
        },
        setMax : function(max){
            this.option.series = Object.assign(this.option.series, [])
            for(var i = 0; i < max.length; i++){
                this.option.series[i].max = max[i];
            }
            return this;
        },
        // 设置数据标签
        setAxisLable : function(show){
            for(var i = 0; i < this.option.series.length; i++){
                if(show){
                    this.option.series[i].axisLabel.show = show;
                }else{
                    this.option.series[i].axisLabel = {};
                }
            }
            return this;
        },
        /**
         * 设置仪表盘
         * @param data  数组
         * @param center    数组，多个仪表盘的位置定位
         */
        setSeries: function(data, number){
            var center = [['55%', '55%']];
            // 仪表盘半径
            var radius = ['75%'];
            if(number===2){
                center = [['25%', '55%'],['75%', '55%']];
                radius = ['60%', '60%']
            }else if(number === 3){
                center = [['15%', '50%'],['50%', '70%'],['85%', '50%']];
                radius = ['50%', '50%', '50%']
            }else if(number === 4){
                center = [['50%', '28%'],['50%', '75%'],['15%', '55%'],['85%', '55%']];
                radius = ['40%', '40%', '40%', '40%']
            }
            var series = clone(this.option.series || [{}]);
            this.option.series = series;
            var defualt = clone(this.option.series[0] || [{}]);
            this.option.series = clone(data || [{}]);
            for(var i = 0; i < data.length; i++){
                this.option.series[i] = clone(defualt || [{}]);;
                this.option.series[i].data = data[i];
                if(center){
                    this.option.series[i].center = center[i];
                    this.option.series[i].radius = radius[i];
                }
            }
            return this;
        },
        setGaugeDefaultOption: function(public){
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
                tooltip: {
                    textStyle:{
                        color: '#fff'
                    },
                    formatter: '{b} : {c}%'
                },
                grid: {
                    left: '8%',
                    right: '8%',
                    bottom: '8%'
                },
                series: [
                    {
                        radius: '75%',
                        type: 'gauge',
                        detail: {
                            show: false,
                            formatter: '{value}'
                        },
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {
                            show: true,
                            backgroundColor: 'auto',
                            borderRadius: 2,
                            color: '#fff',
                            padding: 3,
                            textShadowBlur: 2,
                            textShadowOffsetX: 1,
                            textShadowOffsetY: 1,
                            textShadowColor: '#222'
                        },
                        title: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 16,
                            fontStyle: 'italic',
                            offsetCenter: [0, '70%'],
                            color: 'rgb(255,255,255)'
                        },
                    }
                ]
            };
            return Object.assign(public || {}, data || {});
        },
        create : function(){              //创建图表
            console.log(this.option);
            this.chart.setOption(this.option);
        }
    };
    var charts = function(type, selector){
        return new Charts(type, selector);
    };
    charts.noConflict = function(){       //解决变量冲突
        if(window.gauge === charts){
            window.gauge = _charts;
        }
        return charts;
    };
    window.gauge = charts;
    //module.exports = charts;
})(window, echarts);
