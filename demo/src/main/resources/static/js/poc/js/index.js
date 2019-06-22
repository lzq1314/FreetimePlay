app.registerCtrl('quality.homePage', function ($scope, $routeParams, $http, $timeout, $filter,$location) {
	/*********************************************************************************/
	/*$scope.qualityGrid={
 		   columns : [
	            {
	                label : '业务域',
	                field : 'biz_name'
	            },{
	                label :'业务规则',
	                field : 'br_cnt'
	            },{
	                label : '分析条数',
	                field : 'total_cnt'
	            },{
	                label :'错误条数',
	                field : 'error_cnt'
   	         },{
   	             label : '质量指数',
   	             field : 'dq_score'
   	        },{
	            label :'6西格玛管理',
   	            field : 'six_sigma'
   	           }
	        ],
	     data : [],
	 showRowNumber: false,
     showPager : false,
     cellscope : $scope,
     entries : 15,
     fnLoad: function () {加载数据
			var me = this;
			var params = {
				method : 'service',
				service : 'shpoc',
				func : 'qualityGrid',
				page: me.pageNum,
				limit: me.entries
			};
			ms2http.post($http, params,
				function (result) {
					if (result.data.success) {
						me.data = result.data.data.qualityList;
					}
				}
			);
		},
		fnSearch: function () {
			var me = this;
			me.pageNum = 1;
			me.reset();
			me.fnLoad();
			me.fnLoadCnt();
		}
 }*/
	$scope.gridList = function(){
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'qualityGrid'
			};
			ms2http.post($http, params,
				function (result) {
					if (result.data.success) {
						var retList = result.data.data.qualityList;
						$scope.qualityList = retList.splice(0,retList.length-1);
						$scope.qualiMap = retList.splice(retList.length-1,1)[0];
					}
				}
			);
	}
	
	var std1_option = {
		title: {
			text: '基础标准类型占比',
			x: 'center',
			y: 20,
			textStyle: {
				fontSize: 16
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		series: [{
			name: '标准数量',
			type: 'pie',
			radius: '45%',
			center: ['50%', '60%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	var std2_option = {
		title: {
			text: '指标标准类型占比',
			x: 'center',
			y: 20,
			textStyle: {
				fontSize: 16
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		series: [{
			name: '标准数量',
			type: 'pie',
			radius: '45%',
			center: ['50%', '60%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	var dq1_option = {
		title: {
			text: '质量指数',
			textStyle: {
				fontSize: 16
			}
		},
		color: ['#5ab1ef'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter: '{b} : {c}%'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: [],
			axisTick: {
				alignWithLabel: true
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '质量指数',
			type: 'bar',
			barWidth: '60%',
			data: []
		}]
	};

	var dq2_option = {
	    title: {
	        text: 'CTQ组分析',
	        textStyle: {
	        	fontSize: 16
	        },
			y: 20
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	        data: ['分析条数', '错误条数'],
			y:20
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'value',
	        boundaryGap: [0, 0.01]
	    },
	    yAxis: {
	        type: 'category',
	        data: []
	    },
	    series: [
	        {
	            name: '分析条数',
	            type: 'bar',
	            data: []
	        },
	        {
	            name: '错误条数',
	            type: 'bar',
	            data: []
	        }
	    ]
	};

	var req1_option = {
		title: {
			text: '数据需求走势',
			textStyle: {
				fontSize: 16
			}
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['数据字典类', '数据质量类']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value'
		},
		series: []
	};

	var std3_option = {
		title: {
			text: '对标率排行',
			textStyle: {
				fontSize: 16
			},
			x: 'center',
			y: 20
		},
		color: ['#2ec7c9'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value'
		},
		yAxis: {
			type: 'category',
			data: []
		},
		series: [{
			name: '对标率',
			type: 'bar',
			data: []
		}]
	};

	var std4_option = {
		title: {
			text: '对标率量排行',
			textStyle: {
				fontSize: 16
			},
			x: 'center',
			y: 20,
		},
		color: ['#b6a2de'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value'
		},
		yAxis: {
			type: 'category',
			data: []
		},
		series: [{
			name: '对标量',
			type: 'bar',
			data: []
		}]
	};
	
	/*数据字典*/
	$scope.datadic = function(){
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'datadic'
			};
			ms2http.post($http, params, function(result) {
				if (result.data.success) {
	            	$scope.datadiclist =result.data.data.qualitylist;
				}
			});
	}
	
	/*数据标准*/
	$scope.stditem = function(){
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'stditem'
			};
			ms2http.post($http, params, function(result) {
				if (result.data.success) {
					$scope.biz=true;//基础
					$scope.biznow = result.data.data.bizitem.total_cnt;
					$scope.bizadd = result.data.data.bizitem.add_cnt;
					if(($scope.bizadd+"").indexOf('-')!=-1){
						$scope.biz=false;
					}
					
					$scope.tech=true;//技术
					$scope.technow = result.data.data.techitem.total_cnt;
					$scope.techadd = result.data.data.techitem.add_cnt;
					if(($scope.techadd+"").indexOf('-')!=-1){
						$scope.tech=false;
					}
					
					$scope.code=true;//代码
					$scope.codenow = result.data.data.stdcode.total_cnt;
					$scope.codeadd = result.data.data.stdcode.add_cnt;
					if(($scope.codeadd+"").indexOf('-')!=-1){
						$scope.code=false;
					}
					
					$scope.stdI=true;//指标标准
					$scope.stdINow = result.data.data.stdi.total_cnt;
					$scope.stdIAdd = result.data.data.stdi.add_cnt;
					if(($scope.stdIAdd+"").indexOf('-')!=-1){
						$scope.stdI=false;
					}
					
					$scope.stdM=true;//指标维度
					$scope.stdMNow = result.data.data.stdm.total_cnt;
					$scope.stdMAdd = result.data.data.stdm.add_cnt;
					if(($scope.stdMAdd+"").indexOf('-')!=-1){
						$scope.stdM=false;
					}
				}
			});
	}
	
	/*数据模型*/
	$scope.dataModel = function(){
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'dataModel'
			};
			ms2http.post($http, params, function(result) {
				if (result.data.success) {
					$scope.logic=true;//逻辑
					$scope.logicNow = result.data.data.logicalmodel.total_cnt;
					$scope.logicAdd = result.data.data.logicalmodel.add_cnt;
					if(($scope.logicAdd+"").indexOf('-')!=-1){
						$scope.logic=false;
					}
					
					$scope.phy=true;//物理
					$scope.phyNow = result.data.data.logicalmodel.total_cnt;
					$scope.phyAdd = result.data.data.logicalmodel.add_cnt;
					if(($scope.phyAdd+"").indexOf('-')!=-1){
						$scope.phy=false;
					}
				}
			});
	}
	
	
	//查询被引用排名前十的标准项
	angular.element(function () {
		
		$scope.stditem();
		$scope.dataModel();
		/*$scope.qualityGrid.fnSearch();*/
		$scope.gridList();
		$scope.datadic();

		/*质量指数*/
		var dq1_chart = echarts.init($("#dq1")[0], 'macarons');
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'qualityIndex'
			};
			ms2http.post($http, params, function(result) {
				if (result.data.success) {
	            	dq1_option.series = [
	    		        {
	    		        	name: '质量指数',
	    		    		type: 'bar',
	    		    		barWidth: '60%',
	    		    		data: result.data.data.qualitylist
	    		        }
	    		    ];
					dq1_option.xAxis = [
	    		        {	type: 'category',
	    		    		data: result.data.data.qualitynm,
	    		    		axisTick: {
	    		    			alignWithLabel: true
	    		    		}
	    		        }
	    		    ]
					dq1_chart.setOption(dq1_option);
				}else{
					dq1_chart.setOption(dq1_option);
				}
			});
		
		/*CTQ组分析*/
		var dq2_chart = echarts.init($("#dq2")[0], 'macarons');
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'ctqAnalysis'
			};
			ms2http.post($http, params, function(result) {
				if (result.data.success) {
					dq2_option.yAxis = 
	    		        {
	            			 ype: 'category',
	 				        data: result.data.data.qualitynm
	    		        };
					dq2_option.series = [
				        {
				            name: '分析条数',
				            type: 'bar',
				            data: result.data.data.quality1
				        },
				        {
				            name: '错误条数',
				            type: 'bar',
				            data: result.data.data.quality2
				        }
				    ]
					dq2_chart.setOption(dq2_option);
				}else{
					dq2_chart.setOption(dq2_option);
				}
			});

		/*数据字典类，数据质量类*/
		var req1_chart = echarts.init($("#req1")[0], 'macarons');
		var params = {
				method : 'service',
				service : 'shpoc',
				func : 'dataDemand'
			};
			ms2http.post($http, params, function(result) {
				$scope.dic=true;//数据字典
				$scope.dicNow = result.data.data.datanow1;
				$scope.dicAdd = result.data.data.dataadd1;
				if(($scope.dicAdd+"").indexOf('-')!=-1){
					$scope.dic=false;
				}
				
				$scope.qua=true;//数据质量
				$scope.quaNow = result.data.data.datanow2;
				$scope.quaAdd = result.data.data.dataadd2;
				if(($scope.quaAdd+"").indexOf('-')!=-1){
					$scope.qua=false;
				}
				if (result.data.success) {
						req1_option.xAxis = 
		    		        {
								type: 'category',
								boundaryGap: false,
								data: result.data.data.qualitynm
		    		        };
						req1_option.series = [{
							name: '数据字典类',
							type: 'line',
							data: result.data.data.quality1
						},
						{
							name: '数据质量类',
							type: 'line',
							data: result.data.data.quality2
						}
					]
						req1_chart.setOption(req1_option);
				}else{
					req1_chart.setOption(req1_option);
				}
			});
			var std1_chart = echarts.init($("#std1")[0], 'macarons');
			var std2_chart = echarts.init($("#std2")[0], 'macarons');
			var std3_chart = echarts.init($("#std3")[0], 'macarons');
			var std4_chart = echarts.init($("#std4")[0], 'macarons');
			var params = {
					method : 'service',
					service : 'shpoc',
					func : 'stdEchars'
				};
				ms2http.post($http, params, function(result) {
					if (result.data.success) {
						//基础标准类型占比
						std1_option.series= [{
							name: '标准数量',
							type: 'pie',
							radius: '45%',
							center: ['50%', '60%'],
							data: result.data.data.bizitem,
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}]
						std1_chart.setOption(std1_option);
						//指标标准类型占比
						std2_option.series= [{
							name: '标准数量',
							type: 'pie',
							radius: '45%',
							center: ['50%', '60%'],
							data: result.data.data.targetitem
						}]
						std2_chart.setOption(std2_option);
						//对标率排行
						std3_option.yAxis= {
							type: 'category',
							data: result.data.data.bennm
						};
						std3_option.series= [{
							name: '对标率',
							type: 'bar',
							data: result.data.data.benrate
						}]
						std3_chart.setOption(std3_option);
						//对标量排行
						std4_option.yAxis= {
							type: 'category',
							data: result.data.data.bennm
						},
						std4_option.series= [{
							name: '对标量',
							type: 'bar',
							data: result.data.data.bennum
						}]
						std4_chart.setOption(std4_option);
					}else{
						std1_chart.setOption(std1_option);
						std2_chart.setOption(std2_option);
						std3_chart.setOption(std3_option);
						std4_chart.setOption(std4_option);
					}
				});
	});
})
