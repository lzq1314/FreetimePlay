(function () {
    angular
    .module('ms2h', [
    ])
    .directive('compile', [
      '$compile',
      function ($compile) {
        return {
          restrict: 'A',
          link    : function (scope, element, attrs) {
            scope.templateScope = scope.$eval(attrs.templateScope);
            
            if(attrs.item != undefined)
                scope.item = scope.$eval(attrs.item);

            // Watch for changes to expression.
            scope.$watch(attrs.compile, function (new_val) {
              /*
               * Compile creates a linking function
               * that can be used with any scope.
               */
              var link = $compile(new_val);

              /*
               * Executing the linking function
               * creates a new element.
               */
              var new_elem = link(scope);

              // Which we can then append to our DOM element.
              element.append(new_elem);
            });
          }
        };
      }])
    .directive('boxHeader', function () {
        return {
			restrict: 'E',
			transclude : true,
			template: 
                ' <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-1 pb-1 mb-2 {{addclass}}" ng-class=\"{\'box-header-sub\':(issub==\'true\'), \'border-bottom\':(issub==\'false\')}\" style=\"{{mystyle}}\">' 
               +'	  <h1 ng-class=\"{\'h6 ml-3\':(issub==\'true\'), \'h5\':(issub==\'false\')}\" class="box-header-h">'
               +'         <span ng-if="image!=undefined"><image src="{{image}}" style="height: 18px; width: 18px; float: left;"/></span>'
               +'         <span ng-if="icon!=undefined && image==undefined" class="{{icon}}"></span>'
               +'     <a ng-if=\"font==\'normal\'\">&nbsp;{{text}}</a>'
               +'     <strong ng-if=\"font==\'strong\'\">&nbsp;{{text}}</strong>'
               +'     </h1>'
               +'     <div class="btn-toolbar mb-2 mb-md-0" ng-show="showtoolbox">'
               +'     </div>'
               +'</div> ',
			scope: {
                text: '@',
                showtoolbox: '=',
                addclass: '@',
                issub: '@',
                icon : '@',
                image : '@',
                mystyle: '@',
                font: '@'
            },
            
            link: function(scope, element, attrs, ctrl, transclude) {
				transclude(scope.$parent, function(clone, scope) {
					 $(".btn-toolbar", element).append(clone);
			      });
			},
            
			controller: function ($scope, $element, $attrs, $transclude) {
				if($scope.showicon == undefined)
                    $scope.showicon = false;
				
				if($scope.issub == undefined)
                    $scope.issub = "false";
				
				
				if($scope.font == undefined)
                    $scope.font = "normal";
			}
        }
    })
    .directive('ms2hProperty', function () {
        return {
			restrict: 'E',
			template: 
                '<table class="table table-hover table table-bordered dg-property">'+
                '    <tbody>'+
                '        <tr ng-repeat="item in properties">'+
                '            <td width="{{width}}%" class="prop-name" style="vertical-align: middle;background:none;">{{item.name}}</td>'+
                '            <td width="{{100-width}}%" style="text-align:left;">'+
                '               <div ng-if="item.celltemplate == undefined || item.celltemplate == \'\'" style="word-wrap: break-word;">{{item.value}}</div>'+
                '               <div ng-if="item.celltemplate != undefined && item.celltemplate != \'\'" compile="item.celltemplate" template-scope=\'cellscope\'></div>'+
                '            </td>'+
                '        </tr>'+
                '    </tbody>'+
                '</table>'
            ,
			scope: {
                properties: '=',
                cellscope: '=',
                align: '@',
                width: '@',
            },
			controller: function ($scope, $element, $attrs) {
                $scope.align = 'left';
                $scope.width = '20';
                $scope.grid = angular.extend(
                    {
                        cellscope: undefined
                    },$scope.grid
                );
                if($scope.grid.cellscope == undefined){
                    $scope.grid.cellscope = $scope;
                }

			}
        }
    })
    .directive('ms2hProperty2', function () {
        return {
			restrict: 'E',
			template: 
                '<table class="table table-hover table-bordered">'
                +'    <tbody>'
                +'        <tr ng-repeat="item in property.source">'
                +'            <td class="active" style="text-align:{{align}};">{{item.attr_nm}}</td>'
                +'            <td style="text-align:left;">'
                +'                  <select class="form-control" ng-model="property.inputs[item.attr_cd].selectedItem"'
                +'                      ng-options="item.title for item in property.inputs[item.attr_cd].source track by item.value"'
                +'                      ng-change="property.inputs[item.attr_cd].selectChanged()" ng-if="item.ctrl_id == \'combobox\'"></select>'
                +'                  <ms2h-dtp picker="property.model[item.attr_cd]" ng-if="item.ctrl_id == \'datepicker\' && item.ctrl_id == \'datetimepicker\'"></ms2h-dtp>'
                +'                  <input class="form-control" type="text" ng-model="property.model[item.attr_cd]" ng-if="item.ctrl_id==\'textfield\'" ng-change="property.change(item.attr_cd)"/>'
                +'                  <input id="cp_{{item.attr_cd}}" class="form-control" type="text" ng-model="property.model[item.attr_cd]" ng-if="item.ctrl_id==\'colorpicker\'" ng-change="property.change(item.attr_cd)"/>'
                +'                  <input class="form-control" type="number" ng-model="property.model[item.attr_cd]" ng-if="item.ctrl_id==\'integerfield\'" ng-change="property.change(item.attr_cd)"/>'
                +'                  <textarea class="form-control" type="text" ng-model="property.model[item.attr_cd]" ng-if="item.ctrl_id==\'textarea\'" ng-change="property.change(item.attr_cd)"></textarea>'
                +'                  <div class="input-group" ng-if="item.ctrl_id==\'textfield_btn\'">'
                +'				        <input class="form-control" type="text" ng-model="property.model[item.attr_cd]" ng-change="property.change(item.attr_cd)"/>'
                +'				        <span class="input-group-btn">'
                +'				            <button class="btn btn-default" type="button" ng-click="property.inputs[item.attr_cd].click(property.model)"><i class="{{property.inputs[item.attr_cd].icon}}"></i></button>'
                +'				        </span>'
                +'			        </div>'
                +'            </td>'
                +'        </tr>'
                +'    </tbody>'
                +'</table>'
            ,
			scope: {
                property: '=',
                align: '@'
            },
			controller: function ($scope, $element, $attrs) {
                $scope.align = 'center';
                $scope.property = angular.extend({
                    inputs : {},
                    icon : 'fa fa-bolt',
                    init: function(clsId){
                        var me = this;
                    	$scope.property.source = $scope.property.adsrc[clsId].concat($scope.property.source);
                        angular.forEach($scope.property.source, function(item){
                            if(item.ctrl_id == 'combobox'){
                                
                                if(me.inputs[item.attr_cd] == undefined){
                                    me.inputs[item.attr_cd] ={};
                                }
                                angular.extend(me.inputs[item.attr_cd], {
                                    source : CodeUtil[item.enum_id],
                                    selectedItem: {},
                                    selectChanged : function(){
                                        $scope.property.model[item.attr_cd] = this.selectedItem.value;
                                        me.change(item.attr_cd);
                                    },
                                    init : function(val){
                                        var src = this.source;
                                        if(src != undefined){
                                            for(i=0;i<src.length;i++){
                                                if(src[i].value == val){
                                                    this.selectedItem = src[i];
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                                if($scope.property.model[item.attr_cd] != undefined && $scope.property.model[item.attr_cd] != ''){
                                    $scope.property.inputs[item.attr_cd].init($scope.property.model[item.attr_cd]);
                                }
                            } else if(item.ctrl_id == 'colorpicker'){
                                if($scope.property.inputs[item.attr_cd] == undefined){
                                    $scope.property.inputs[item.attr_cd] = {};
                                }
                                $(function () {
                                    $('#cp_'+item.attr_cd).colorpicker();
                                });
                                $scope.property.inputs[item.attr_cd].colorpicker = $('#cp_'+item.attr_cd).colorpicker();
                            } else if(item.ctrl_id == 'textfield_btn'){
                                if(me.inputs[item.attr_cd]==undefined){
                                    me.inputs[item.attr_cd] == {};
                                }
                                if(me.inputs[item.attr_cd].icon == undefined){
                                    me.inputs[item.attr_cd].icon = 'fa fa-bolt';
                                }
                            }
                        });
                    },
                    convert : function(){
                        angular.forEach($scope.attributes.model, function(item, i){
                            angular.forEach($scope.attributes.source, function(attr){
                                if(attr.attr_cd == i){
                                    i = attr.attr_sto_col_nm;
                                }
                            });
                        });
                    }
                }, $scope.property);
			}
        }
    })
    .directive('ms2hGrid', function () {
        return {
			restrict: 'E',
			template: 
                     "<div ng-class=\"{'table-responsive dg-white':(true==grid.border), 'table-responsive dg-white':(true!=grid.border)}\" style='{{grid.style}}'>\n"
                    +"  <table class='{{grid.tableClass}}'>\n"
                    +"	    <thead ng-show='{{grid.showHeader}}'>\n"
                    +"          <th ng-if='grid.useCheckbox' style=\"text-align:center; width: 30px;\"><input type='checkbox' ng-model='grid.checkedAll' ng-change='checkAll(grid.checkedAll)'></th>"
                    +"          <th ng-if='grid.showRowNumber' style=\"text-align:center; width: auto;\"><font color=\"#000000\">#</font></th>"
                    +"		    <th ng-if='!grid.useSorting' ng-repeat='item in grid.columns' class='text-truncate' style={{item.style}}><input ng-if='item.useCheckbox' type='checkbox' ng-change='item.checkAll()' ng-model='item.checked' style='margin-right:5px;'><font ng-style=\"{color:(item.style==undefined)?'#000000':''}\">{{item.label}}</font></th>\n"
                    +"          <th ng-if='grid.useSorting' ng-repeat='item in grid.columns' class='text-truncate' style={{item.style}}><input ng-if='item.useCheckbox' type='checkbox' ng-change='item.checkAll()' ng-model='item.checked' style='margin-right:5px;'> <a ng-click=\"sort(item)\"> {{item.label}}&nbsp<span class=\"fa fa-caret-up dg-caret-up\"></span><span class=\"fa fa-caret-down dg-caret-down\"></span></a></th>\n"
                    +"			<th ng-show=\"grid.showEditMode\"></th>\n"
                    +"		</thead>\n"
                    +"		<tbody ng-if=\"grid.rowtemplate != undefined && grid.rowtemplate != ''\">\n"
                    +"			<tr ng-repeat-start='item in grid.data' ng-click='selectItem(item, $index)'\n" 
                    +"              ng-class=\"{'table-info':($index==grid.selectedIndex), '':($index!=grid.selectedIndex)}\">\n"
                    +"              <td ng-if='grid.useCheckbox'><input type='checkbox' ng-model='item.checked' ng-click='checkChange(item.checked, item, $event)' ng-disabled='item.disabled' align='center'></td>\n"
                    +"              <td ng-if='grid.showRowNumber' align='center'><div>{{$index+1}}</div></td>"
                    +"				<td ng-repeat='h_item in grid.columns' ng-class=\"{'py-0' : (h_item.celltemplate != undefined && h_item.celltemplate != ''), '' : (h_item.celltemplate == undefined || h_item.celltemplate == '')}\" style=\"max-width: 300px;\">\n"
                    +"					<div class='text-truncate' ng-if=\"h_item.celltemplate == undefined || h_item.celltemplate == '' \" title='{{item[h_item.field]}}' title=\"{{item[h_item.field]}}\">{{item[h_item.field]}}</div>\n"
                    +"                  <div class='text-truncate' ng-if=\"h_item.celltemplate != undefined && h_item.celltemplate != ''\" compile=\"h_item.celltemplate\" template-scope='grid.cellscope'></div>\n"
                    +"				</td>\n"
                    +"              <td class=\"py-0\" ng-show=\"grid.showEditMode\" align=\"center\">\n"
					+"				    <div class=\"btn-group\">\n"
					+"					    <button type=\'button\' class=\"btn btn-sm btn-outline-secondary\" title=\"\" ng-click=\"grid.fnEdit(item, $event)\">\n"
					+"						    <span class=\"fa fa-edit\" aria-hidden=\"true\"></span>\n"
					+"					    </button>\n"
					+"					    <button type=\'button\' class=\"btn btn-sm btn-outline-secondary\"	title=\"\" ng-click=\"grid.fnRemove(item, $event)\">\n"
					+"						    <span class=\"fa fa-trash-alt\" aria-hidden=\"true\"></span>\n"
					+"					    </button>\n"
					+"                  <div class=\"btn-group\" ng-if=\"grid.editModeTemplate != undefined\" compile=\"grid.editModeTemplate\" template-scope='grid.cellscope'></div>\n"
					+"				    </div>\n"
					+"			    </td>\n"
                    +"			</tr>\n"	
                    +"			<tr ng-repeat-end ng-show=\"($index==grid.selectedIndex)\">\n"
                    +"              <td colspan={{grid.columns.length}}>"
                    +"                  <div compile=\"grid.rowtemplate\" template-scope='grid.rowscope'></div>\n"
                    +"              <td>"
                    +"			</tr>\n"
                    +"		</tbody>\n"
                    +"		<tbody ng-if=\"grid.rowtemplate == undefined || grid.rowtemplate == ''\">\n"
                    +"			<tr ng-repeat='item in grid.data' ng-click='selectItem(item, $index)'\n" 
                    +"              ng-class=\"{'table-success':($index==grid.selectedIndex), '':($index!=grid.selectedIndex)}\">\n"
                    +"              <td ng-if='grid.useCheckbox' align='center'><input type='checkbox' ng-model='item.checked' ng-disabled='item.disabled' ng-click='checkChange(item.checked, item, $event)'></td>"
                    +"              <td ng-if='grid.showRowNumber' align='center'><div>{{$index+1+((grid.pageNum-1)*grid.entries)}}</div></td>"
                    +"				<td ng-repeat='h_item in grid.columns' ng-class=\"{'py-0' : (h_item.celltemplate != undefined && h_item.celltemplate != ''), '' : (h_item.celltemplate == undefined || h_item.celltemplate == '')}\" style=\"max-width: 300px;\">\n"
                    +"					<div class='text-truncate' ng-if=\"h_item.celltemplate == undefined || h_item.celltemplate == '' \" title=\"{{item[h_item.field]}}\">{{item[h_item.field]}}</div>\n"
                    +"                  <div class='text-truncate' ng-if=\"h_item.celltemplate != undefined && h_item.celltemplate != ''\" compile=\"h_item.celltemplate\" template-scope='grid.cellscope'></div>\n"
                    +"				</td>\n"
                    +"              <td  class=\"py-0\" ng-show=\"grid.showEditMode\" align=\"center\">\n"
					+"				    <div class=\"btn-group\">\n"
					+"					    <button type=\'button\' class=\"btn btn-sm btn-outline-secondary\" title=\"\" ng-click=\"grid.fnEdit(item, $event)\">\n"
					+"						    <span class=\"fa fa-edit\" aria-hidden=\"true\"></span>\n"
					+"					    </button>\n"
					+"					    <button type=\'button\' class=\"btn btn-sm btn-outline-secondary\"	title=\"\" ng-click=\"grid.fnRemove(item, $event)\">\n"
					+"						    <span class=\"fa fa-trash-alt\" aria-hidden=\"true\"></span>\n"
					+"					    </button>\n"
					+"                  <div class=\"btn-group\" ng-if=\"grid.editModeTemplate != undefined\" compile=\"grid.editModeTemplate\" template-scope='grid.cellscope'></div>\n"
					+"				    </div>\n"
					+"			    </td>\n"
                    +"			</tr>\n"
                    +"		</tbody>\n"
                    +"	</table>\n"
                    +"</div>\n"
                    +"<div class='table-footer d-flex justify-content-between' ng-if='grid.showPager'>\n"
                    +"	<div class='ml-0'>总行数 : {{grid.totalCount}}</div>\n"
                    +"	<div style='margin-left: 60%;' ng-show='grid.showEntries'>每页显示行数 : <input style='width:50px' type='number' ng-model='grid.limit'>\n"
                    +"		<button type=\'button\' style='width:30px;' ng-click='resetEntries()'>\n"
                    +"			<span>Go</span>\n"
                    +"		</button>\n"
                    +"  </div>\n"
                    +"	<div style='margin-left: 20%;' ng-show='grid.showEntrieCodes'>每页显示行数 : <input style='width:50px' type='number' ng-model='grid.limit'>\n"
                    +"		<button type=\'button\' style='width:30px;' ng-click='resetEntries()'>\n"
                    +"			<span>Go</span>\n"
                    +"		</button>\n"
                    +"  </div>\n"
                    +"	<div style='margin-left: 5%;' ng-show='grid.showEntrieLittleCodes'>每页显示行数 : <input style='width:50px' type='number' ng-model='grid.limit'>\n"
                    +"		<button type=\'button\' style='width:30px;' ng-click='resetEntries()'>\n"
                    +"			<span>Go</span>\n"
                    +"		</button>\n"
                    +"  </div>\n"
                    +"	<div class='mr-0'>\n"
                    +"		<button type=\'button\' style='width:20px' class='btn btn-outline-success btn-sm' ng-click='firstPage()'>\n"
                    +"			<span class='fa fa-angle-double-left' style='margin-left:-2px'></span>\n"
                    +"		</button>\n"
                    +"		<button type=\'button\' class='btn btn-outline-success btn-sm' ng-click='prev()'>\n"
                    +"			<span class='fa fa-angle-left'></span>\n"
                    +"		</button>\n"
                    +"		<input style='width:30px' ng-model='grid.number'>/{{grid.totalPage}}\n"
                    +"		<button type=\'button\' class='btn btn-outline-success btn-sm' ng-click='next()'>\n"
                    +"			<span class='fa fa-angle-right'></span>\n"
                    +"		</button>\n"
                    +"		<button type=\'button\' style='width:20px' class='btn btn-outline-success btn-sm' ng-click='lastPage()'>\n"
                    +"			<span class='fa fa-angle-double-right' style='margin-left:-2px'></span>\n"
                    +"		</button>\n"
                    +"	</div>\n"
                    +"</div>\n"
                    
            ,
			scope: {
                grid: '=',
                fnloadcount: '&',
                fnload: '&',
                fnselectitem : '='
            },
			controller: function ($scope, $element, $attrs) {
                $scope.checkAll = function(checkedAll){
                    angular.forEach($scope.grid.data, function(item, i){
                        item.checked = checkedAll;
                    });
                    
                    if($scope.grid.checkAllChanged != undefined){
                    	$scope.grid.checkAllChanged(checkedAll);
                    }
                    $scope.grid.clickCheckBoxAll(checkedAll);
                }
                
                var selectedItems=[];
                $scope.checkChange = function(checked, item, e){
                    selectedItems=[];
                    if(checked == false && $scope.grid.checkedAll){
                    	$scope.grid.checkedAll = false;
                    }
                    
                    angular.forEach($scope.grid.data, function (it, i) {
                        if (it.checked == true) {
                            selectedItems.push(it);
                        }
                    });
                    
                    if($scope.grid.data.length==selectedItems.length)
                        $scope.grid.checkedAll = true;

                    if($scope.grid.checkChanged != undefined){
                    	$scope.grid.checkChanged(checked, item);
                    }
                    // added by yxl (req ljs)20180705
                    e.stopPropagation();
                    $scope.grid.clickCheckBox(item);
                }
                
                $scope.sort = function(item){
                	var allDataSort = $("a[data-sort]")
                	var datasort = event.currentTarget.getAttribute("data-sort");
                	if(datasort == undefined){
                		if(allDataSort)
                			allDataSort.removeAttr("data-sort");
                		event.currentTarget.setAttribute("data-sort", "asc");
                	}else if(datasort == "asc"){
                		if(allDataSort)
                			allDataSort.removeAttr("data-sort");
                		event.currentTarget.setAttribute("data-sort", "desc");
                	}else{
                		if(allDataSort)
                			allDataSort.removeAttr("data-sort");
                		event.currentTarget.setAttribute("data-sort", "asc");
                	}
                	
                	
                	$scope.grid.sort(item.field);
                }


                $scope.grid = angular.extend(
                    {
                        pageNum: 1,
                        totalPage: 1,
                        totalCount: 0,
                        entries: 15,
                        limit: '',
                        number: 1,
                        tableClass: 'table table-hover table-bordered datatables table-sm',
                        style: undefined,
                        selectedItem: undefined,
                        selectedIndex : -1,
                        showPager : false,
                        showHeader : true,
                        showEditMode : false,
                        showRowNumber : true,
                        showEntries : false,
                        useCheckbox : false,
                        useSorting : false,
                        border : false,
                        columns : [],
                        data : [],
                        cellscope: undefined,
                        rowscope: undefined,
                        dao : undefined,
                        checkedAll : false,
                        checkChanged : undefined,
                        checkAllChanged : undefined,
                        editModeTemplate : undefined,
                        
                        setColumns : function(columns){
                            this.columns = angular.extend(columns);
                        },
                        
                        loadCnt: function(params){
                        	var me = this;
                            if(me.fnLoadCnt != undefined)
                                me.fnLoadCnt(params);                   
                        },
                    
                        load: function(params){
                        	$scope.grid.number = $scope.grid.pageNum;
                        	var me = this;
                        	me.checkedAll = false;
                            if(me.fnLoad != undefined)
                                me.fnLoad();
                        },
                
                        loadPage: function(){
                        	var me = this;
                            if(me.fnLoad != undefined)
                                me.fnLoad();
                        },
                        
                        loadDaoCnt: function(http, params){
                            var me = this;
                            XLFDAO.select(http, me.dao, params, function(data){
                                 me.setItemCount(data.CNT)
                            });
                        },
                        
                        loadDao: function(http, params){
                            var me = this;
                            XLFDAO.select(http, me.dao, params, function(rslt){
                                if(rslt.success)
                                    me.data = rslt.data;
                            });
                        },
                        
                        setItemCount : function(cnt){
                            this.totalCount =  cnt;
                            if(this.totalCount > 0){
                                this.pageNum = 1;
                                this.totalPage = Math.ceil(this.totalCount / this.entries);
                            } else if(this.totalCount <= 0){
                                this.pageNum = 1;
                                this.totalPage = 1;
                            }
                        },
                        
                        getSelections: function () {
                            var items = [];
                            angular.forEach(this.data, function (item, index) {
                                if(item.checked){
                                    items.push(item);
                                }
                            })
                            return items;
                        }, 
                        
                        reset : function(){
                        	var me = this;
                        	me.checkedAll = false;
                        	me.selectedIndex = -1;
                        	me.selectedItem = undefined;
                        },
                        
                        newPage : function() {
							
						},
						
						clickCheckBox :function(){
							
						},
						clickCheckBoxAll : function(){
							
						},
						
						sort : function(header){
							
						}
                        
                    },$scope.grid
                );
                
                if($scope.grid.cellscope == undefined){
                    $scope.grid.cellscope = $scope;
                }
                
                if($scope.grid.rowscope == undefined){
                    $scope.grid.rowscope = $scope;
                }
                
                $scope.prev = function(){
                    if (1 >= $scope.grid.pageNum || 1 >= $scope.grid.number)
                            return;
                    if($scope.grid.number < $scope.grid.pageNum){
                    	$scope.grid.pageNum = $scope.grid.number;
                    }else{
                    	$scope.grid.pageNum--;
                        $scope.grid.number = $scope.grid.pageNum;
                    }
                    $scope.grid.load();
                    $scope.grid.reset();
                    $scope.grid.newPage();
                },
                $scope.next = function(){
                    if ($scope.grid.pageNum == $scope.grid.totalPage || $scope.grid.number > $scope.grid.totalPage)
                            return;
                    if($scope.grid.number > $scope.grid.pageNum){
                    	$scope.grid.pageNum = $scope.grid.number;
                    }else{
                    	$scope.grid.pageNum++;
                        $scope.grid.number = $scope.grid.pageNum;
                    }
                    $scope.grid.load();
                    $scope.grid.reset();
                    $scope.grid.newPage();
                },
                
                $scope.resetEntries = function(){
                    if ($scope.grid.limit>0){
                    	$scope.grid.totalPage = Math.ceil($scope.grid.totalCount / $scope.grid.limit);
                    	$scope.grid.entries = $scope.grid.limit;
                    	if($scope.grid.pageNum>$scope.grid.totalPage){
                    		$scope.grid.pageNum = $scope.grid.totalPage
                    	}
                    	$scope.grid.load();
                    } else {
                    	$scope.grid.limit = $scope.grid.entries;
                    	$scope.grid.load();
                    }
                },
                
                $scope.firstPage = function(){
                    if (1 >= $scope.grid.pageNum){
                    	return;
                    } else {
                    	$scope.grid.pageNum = 1;
                    	$scope.grid.number = 1;
                    }
                            				
                    $scope.grid.load();
                    $scope.grid.reset();
                    $scope.grid.newPage();
                },
                
                $scope.lastPage = function(){
                    if ($scope.grid.pageNum == $scope.grid.totalPage){
                    	return;
                    } else {
                    	$scope.grid.pageNum = $scope.grid.totalPage;
                    	$scope.grid.number = $scope.grid.totalPage;
                    }
                            				
                    $scope.grid.load();
                    $scope.grid.reset();
                    $scope.grid.newPage();
                },
                
                $scope.selectItem = function(item, index){
                    $scope.grid.selectedItem = item;
                    
                    if($scope.grid.selectedIndex == index){
                    	$scope.grid.selectedIndex = -1;
                    }else{
                    	$scope.grid.selectedIndex = index;
                    }
                    	
                    
                    if($scope.fnselectitem != undefined)
                        $scope.fnselectitem(item);   
                },

                $scope.getSelections = function () {
                    return $scope.grid.getSelections();
                }
			}
        }
    })
    .directive('ms2hFilter', function () {
        return {
			restrict: 'E',
			template: 
				"<div ng-show='filter.showFilter'>\n"
			   +"	<div class='pull-left'>"
			   +"		<button class='btn btn-default btn-sm active' title='Search' ng-click='fnSearch()'><span class='glyphicon glyphicon-search' aria-hidden='true'></span>{{filter.searchTitle}}</button>\n"
			   +"	</div>"
			   +"	<form class='form-horizontal'>\n"
			   +"		<div class='form-group form-group-sm'>\n"
			   +"			<label class='control-label col-sm-offset-5 col-sm-2'>Add Filter</label>\n"
			   +"			<div class='col-sm-3'>\n"
			   +"				<select class='form-control' ng-model='filter.selectedItem'\n"
			   +"					ng-options='item.label for item in filter.source track by item.field'\n"
			   +"					ng-change='filter.selectChanged()'></select>\n"
			   +"			</div>\n"
			   +"		</div>\n"
			   +"	</form>\n"
			   +"	<form class='form-horizontal'>\n"
			   +"		<!-- filter usr_id -->\n"
			   +"		<div class='form-group form-group-sm' ng-repeat='item in filter.filters'>\n"
			   +"			<div class='col-sm-2'>\n"
			   +"		      <div class='checkbox'>\n"
			   +"		        <label>\n"
			   +"		          <input type='checkbox' ng-model=\"item.checked\"> {{item.label}}\n" 
			   +"		        </label>\n"
			   +"		      </div>\n"
			   +"		    </div>\n"
			   +"			<div class='col-sm-4'>\n"
			   +"				<input type='text' class='form-control' placeholder='Input' ng-model='item.value'>\n"
			   +"			</div>\n"
			   +"			<div class='col-sm-1'>\n"
			   +"			<button class='btn btn-link' title='Remove' ng-click='fnRemoveFilter(item)'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button>\n"
			   +"			</div>\n"
			   +"		</div>\n"
			   +"	</form>\n"
			   +"</div>"
            ,
			scope: {
                filter: '=',
                fnsearch: '='
            },
			controller: function ($scope, $element, $attrs) {
                
                $scope.filter = angular.extend(
                    {
                    	showFilter : false,
                    	searchTitle : 'Search',
                        filters: [],
                        source : [
                    	],
                    	selectedItem : {},
                      	/* Selection Chanaged event Handler */
                    	selectChanged : function(){
                    	   var item = this.filters.find(function(item){
                    		   return item.field == $scope.filter.selectedItem.field; 
                    	   })
                    	   
                    	   if(item == undefined)
                    		   this.filters.push(this.selectedItem);
                    	}
                        
                    },$scope.filter
                );
                
                $scope.fnRemoveFilter = function(item){
                	var index = $scope.filter.filters.indexOf(item);
            		if(index >= 0){
            			$scope.filter.filters.splice(index, 1);
            		} 
                }
                
                $scope.fnSearch = function(){
                	if($scope.fnsearch != undefined)
                        $scope.fnsearch();
                }
			}
        }
    })
    .directive('ms2hList', function () {
        return {
			restrict: 'E',
			template: 
                     "<div class=\"list-group\">\n"
                    +"	<a ng-repeat='item in list.data' ng-click='selectItem(item, $index)'\n" 
                    +"     ng-class=\"{'active list-group-item':($index==list.selectedIndex), 'list-group-item':($index!=list.selectedIndex)}\">\n"
                    +"      <div compile=\"list.template\" template-scope='list.rowscope'></div>\n"
                    +"	</a>\n"	
                    +"</div>\n"
                    +"<div class='table-footer d-flex justify-content-between' ng-if='list.showPager'>\n"
                    +"	<div class='ml-0'>总行数 : {{list.totalCount}}</div>\n"
                    +"	<div class='mr-0'>\n"
                    +"		<button type=\'button\' class='btn btn-outline-success btn-sm' ng-click='prev()'>\n"
                    +"			<span class='fa fa-chevron-left'></span>\n"
                    +"		</button>\n"
                    +"		{{list.pageNum}}/{{list.totalPage}}\n"
                    +"		<button type=\'button\' class='btn btn-outline-success btn-sm' ng-click='next()'>\n"
                    +"			<span class='fa fa-chevron-right'></span>\n"
                    +"		</button>\n"
                    +"	</div>\n"
                    +"</div>\n"
                    
            ,
			scope: {
                list: '=',
                fnloadcount: '&',
                fnload: '&',
                fnselectitem : '='
            },
			controller: function ($scope, $element, $attrs) {
                
                $scope.list = angular.extend(
                    {
                        pageNum : 1,
                        totalPage : 0,
                        totalCount : 0,
                        entries : 20,
                        style : '',
                        template : '',
                        selectedItem : undefined,
                        selectedIndex : -1,
                        showPager : false,
                        showEditMode : false,   
                        data : [],
  
                        rowscope: undefined,
                        
                        loadCnt: function(params){
                        	var me = this;
                            if(me.fnLoadCnt != undefined)
                                me.fnLoadCnt();                   
                        },
                        
                        load: function(params){
                        	var me = this;
                            if(me.fnLoad != undefined)
                                me.fnLoad();
                        },
                
                        loadPage: function(params){
                        	var me = this;
                            if(me.fnLoad != undefined)
                                me.fnLoad();
                        },
                        
                        setItemCount : function(cnt){
                            this.totalCount =  cnt;
                            if(this.totalCount > 0){
                                this.pageNum = 1;
                                this.totalPage = Math.ceil(this.totalCount / this.entries);
                            }
                        }
                        
                    },$scope.list
                );
                
                
                
                if($scope.list.rowscope == undefined){
                    $scope.list.rowscope = $scope;
                }
                
                $scope.prev = function(){
                    if (1 >= $scope.list.pageNum)
                            return;				
                    $scope.list.pageNum--;
                    $scope.list.load();
                },
                $scope.next = function(){
                    if ($scope.list.pageNum == $scope.list.totalPage)
                            return;				
                    $scope.list.pageNum++;
                    $scope.list.load();
                },
                
                $scope.selectItem = function(item, index){
                    $scope.list.selectedItem = item;
                    
                    if($scope.list.selectedIndex == index){
                    	$scope.list.selectedIndex = -1;
                    }else{
                    	$scope.list.selectedIndex = index;
                    }
                    	
                    
                    if($scope.fnselectitem != undefined)
                        $scope.fnselectitem(item);   
                }
			}
        }
    })
    .directive('ms2hTree', function () {
        return {
            restrict: 'E',
            transclude : true,
			template: 
                     "<div>\n"
                    +"</div>"
            ,
			scope: {
                tree: '=',
                /*source: '=',*/
                fnactivate: '=',
                fninitialized: '=',
                idfield: '@',
                iconpath: '@',
                parentidfield: '@',
                titlefield: '@',
                fnselect: '=',
                fnlazyload: '=',
                fontcolor: '@'
            },

			controller: function ($scope, $element, $attrs) {
				if($scope.source == undefined)
					$scope.source=[];
				$scope.tree = angular.extend({
					checkbox : false,
					minExpandLevel : 1,
					selectMode: 1
				}, $scope.tree);
				
                $element.children('div').fancytree({
					checkbox:$scope.tree.checkbox,
					selectMode: $scope.tree.selectMode,
					source: $scope.source,
					minExpandLevel: $scope.tree.minExpandLevel,
					activate: function(event, data){
					    if($scope.fnactivate != undefined)
					        $scope.fnactivate(event, data.node);
					},
					init:function(){
					    if($scope.fninitialized != undefined)
					        $scope.fninitialized($element.children('div'));        
					},
					select: function(event, data){
						if($scope.fnselect != undefined){
							$scope.fnselect(event, data.node, $scope.tree);
						}
                    },
                    lazyLoad: function(event, data){
                        data.result = [];
                        if($scope.fnlazyload != undefined){
                            data.node.setStatus('loading');
                            $scope.fnlazyload(event, data.node);
                        }
                    }
                });
                
                
                $scope.tree = $element.children('div').fancytree("getTree");
                $scope.tree =  angular.extend( $scope.tree, {
                	deactivate : function(){
						var me = this;
						me.activateKey(false);
					},
                    loadData : function(data){
                        var me = this;
                        me.clear();

                        var treeIds = {};                        
                        // folder setting
                        angular.forEach(data, function(item, i){
                        	if(treeIds[item[$scope.parentidfield]] != undefined){
                        		treeIds[item[$scope.parentidfield]].folder = true;
                        	}
                        	treeIds[item[$scope.idfield]] = item;
                        });
                        
                        var treeIds = {};
                        angular.forEach(data, function(item, i){
                            if(item[$scope.titlefield].match(/>/)){
                                item[$scope.titlefield].replace(/>/g, "&gt;");
                            }
                            if(item[$scope.titlefield].match(/</)){
                                item[$scope.titlefield].replace(/>/g, "&lt;");
                            }
                            if(treeIds[item[$scope.parentidfield]] == undefined){
                                var node = me.getRootNode().addChildren({
                                    title: item[$scope.titlefield],
                                    icon: item[$scope.iconpath],
                                    id: item[$scope.idfield],
                                    selected : item.selected,
                                    folder : item.folder,
                                    item: item
                                });
                               
                                treeIds[item[$scope.idfield]] = node;
                        
                            }else{
                                var node = treeIds[item[$scope.parentidfield]].addChildren({
                                    title: item[$scope.titlefield],
                                    icon: item[$scope.iconpath],
                                    id: item[$scope.idfield],
                                    selected : item.selected,
                                    folder : item.folder,
                                    item: item
                                });
                             
                                treeIds[item[$scope.idfield]] = node;
                                
                                
                            }
                        });
                    }
                });

                
                // if($scope.fontcolor != undefined){
                //     $element.find('.fancytree-title').css({color : $scope.fontcolor});
                // }
			}
        }
    })
    .directive('ms2hTreeTable', function () { /* NOT COMPLETED */
        return {
            restrict: 'E',
            transclude : true,
			template: 
                     '<table id="tableAppend">\n'
                    +'</table>'
            ,
			scope: {
                tree: '=',
                source: '=',
                fnactivate: '=',
                fninitialized: '=',
                idfield: '@',
                parentidfield: '@',
                titlefield: '@',
                fnselect: '=',
            },

            link: function(scope, element, attrs, ctrl, transclude) {
				transclude(scope.$parent, function(clone, scope) {
					 $("#tableAppend", element).append(clone);
                });
            },

			controller: function ($scope, $element, $attrs) {
				if($scope.source == undefined)
					$scope.source=[];
				
				$scope.tree = angular.extend({
					checkbox : false,
					minExpandLevel : 1,
					selectMode: 1
				}, $scope.tree);
				
                $element.children('table').fancytree({
					checkbox:$scope.tree.checkbox,
					selectMode: $scope.tree.selectMode,
					source: $scope.source,
                    minExpandLevel: $scope.tree.minExpandLevel,
                    titlesTabbable: true,        // Add all node titles to TAB chain
                    extensions: ["table"],
                    table: {
                        checkboxColumnIdx: 0,    // render the checkboxes into the this column index (default: nodeColumnIdx)
                        indentation: 16,         // indent every node level by 16px
                        nodeColumnIdx: 2         // render node expander, icon, and title to this column (default: #0)
                    },
                            //	renderStatusColumns: false,	 // false: default renderer
                                         // true: generate renderColumns events, even for status nodes
                                         // function: specific callback for status nodes
                    renderColumns: function(event, data) {
                        var node = data.node,
                            $tdList = $(node.tr).find(">td");

                        // Make the title cell span the remaining columns if it's a folder:
                        if( node.isFolder() ) {
                            $tdList.eq(2)
                                .prop("colspan", 3)
                                .nextAll().remove();
                            return;
                        }
                        // (Column #0 is rendered by fancytree by adding the checkbox)

                        // Column #1 should contain the index as plain text, e.g. '2.7.1'
                        $tdList.eq(1)
                            .text(node.getIndexHier())
                            .addClass("alignRight");

                        // (Column #2 is rendered by fancytree)

                        // ...otherwise render remaining columns

                        $tdList.eq(3).text(node.data.item.md_cd);
                        $tdList.eq(4).text(node.data.item.cls_id);
                    },

					activate: function(event, data){
					    if($scope.fnactivate != undefined)
					        $scope.fnactivate(event, data.node);
					},
					init:function(){
					    if($scope.fninitialized != undefined)
					        $scope.fninitialized($element.children('table'));        
					},
					select: function(event, data){
						if($scope.fnselect != undefined){
							$scope.fnselect(event, data.node, $scope.tree);
						}
                    },
                });
                
                $scope.tree = $element.children('table').fancytree("getTree");
                $scope.tree =  angular.extend( $scope.tree, {
                    loadData : function(data){
                        var me = this;
                        me.clear();
                        var treeIds = {};
                        angular.forEach(data, function(item, i){
                            if(treeIds[item[$scope.parentidfield]] == undefined){
                                var node = me.getRootNode().addChildren({
                                    title: item[$scope.titlefield],
                                    //icon: "customdoc1.gif",
                                    //folder : true,
                                    id: item[$scope.idfield],
                                    selected : item.selected,
                                    item: item
                                });
                                
                                treeIds[item[$scope.idfield]] = node;
                        
                            }else{
                                var node = treeIds[item[$scope.parentidfield]].addChildren({
                                    title: item[$scope.titlefield],
                                    //folder : true,
                                    id: item[$scope.idfield],
                                    selected : item.selected,
                                    item: item
                                });
                             
                                treeIds[item[$scope.idfield]] = node;
                            }
                        });
                    }
                });
			}
        }
    })
    .directive('ms2hSelect', function () {
        return {
            restrict: 'E',
            transclude : true,
			template: 
                    '<div class="dropdown">'
				   +'   <div class="input-group">'	
                   +'       <input type="text" ng-click="fnOnOpen()" class="form-control col-12 dropdown-toggle disabled-module" placeholder="{{placeholder}}" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" ng-model="model" readonly required="required" data-error="{{errormessage}}" ng-disabled = "disable == \'true\'" width="{{width}}">'
                   +'   	<div class="input-group-append" ng-if="model != undefined || model != \'\'" ng-required="required==\'true\'" ng-hide="noclear==\'true\'">'
                   +'			<button type="button" class="btn ms2h-clear-btn" ng-click="fnClear()" ng-disabled = "disable == \'true\'">'
                   +'				<span class="fa fa-times-circle"/>'
                   +'			</button>'
                   +'		</div>'
                   +'       <ul class="dropdown-menu" id="{{selid}}">'
                   +'           <li style="padding-bottom: 5px; border-bottom: 1px solid #E1E6EB;">'
                   +'               <div id="selectBox">'
                   +'               </div>'
                   +'           </li>'
                   +'           <div class="offset-8 col-2 p-1" ng-show="showbtngrp == \'true\'">'
                   +'           	<div class="btn-group">'
		           +'      		    	<button type="button" class="btn btn-success btn-sm" ng-click="checkBtn()">确定</button>'
		           +'      		    	<button type="button" class="btn btn-warning btn-sm" ng-click="clearBtn()">清空</button>'
		           +'           	</div>'
		           +'           </div>'
                   +'		</ul>'
                   +'   </div>'
                   +'</div>'
            ,
			scope: {
                width: '@',
                selid: '@',
                model: '=',
                fnonopen: '&',
                fnclear: '&',
                placeholder:'@',
                required: '@',
                noclear: '@',
                disable: '@',
                checkbtn: '&',     //右下角确定按钮绑定方法
                clearbtn: '&',     //右下角清空按钮绑定方法
                showbtngrp: '@'  //控件下拉菜单右下角是否显示按钮组
            },

            link: function(scope, element, attrs, ctrl, transclude) {
				transclude(scope.$parent, function(clone, scope) {
					 $("#selectBox", element).append(clone);				
			      });
            },
            
			controller: function ($scope, $element, $attrs) {
                $scope.model = undefined;
                $scope.errormessage = 'Required!';
                if($scope.required==undefined){
                    $scope.required = false;
                }
				$('.dropdown', $element).on('show.bs.dropdown', function () {
					if($scope.width != undefined && (parseInt($scope.width.replace("px", "")) > $('.dropdown', $element).width())){
						$('#'+$scope.selid).css("width", $scope.width);
						$('#'+$scope.selid).addClass('dropdown-menu-right')
					}else{
						var width = $('.dropdown', $element).width();
						$('#'+$scope.selid).css("width", width+"px");
					}
					// $scope.fnOnOpen();
				});
				
				
				$("#selectBox", $element).on('click', function(event){
			        event.stopPropagation();
			    });
				
				
				if($scope.placeholder == undefined)
					$scope.placeholder = '请选择';
				
				$scope.fnClear = function(){
					if($scope.fnclear != undefined){
                        $scope.fnclear();
                    }
					$scope.model = undefined;
				}
			
                $scope.fnOnOpen = function(){
                    if($scope.fnonopen != undefined){
                        $scope.fnonopen();
                    }
                    //$scope.fn_toggleSelect();
                }
                
                $scope.checkBtn = function() {
                	if($scope.checkbtn != undefined){
                		$scope.checkbtn();
                		if(typeof($scope.checkbtn()) == 'string'){
                			if($scope.required == 'required' && ($scope.checkbtn() == undefined || $scope.checkbtn() == "")){
        						var $group = $element.closest('.form-group')
        						$group.addClass('has-danger')
        					    $group.find('.form-control').addClass('is-invalid')
        					}
                		}
                    }
				}
                
                $scope.clearBtn = function() {
                	if($scope.clearbtn != undefined){
                		$scope.clearbtn();
                    }
				}
                
                if($scope.required == 'false' || $scope.required == undefined || $scope.required == ''){
                    $($element).find('input').removeAttr('required');
                }
                
                $scope.fn_toggleSelect = function(){
                    if($('#'+$scope.selid).attr("style") == undefined || $('#'+$scope.selid).attr("style") == ""){
                        var parents = $('#'+$scope.selid).parents();
                        var width = parents[1].clientWidth;
                        $('#'+$scope.selid).css("width", width+"px");
                    }
                    if($('#' + $scope.selid).parents('div').hasClass('open')){
                        $('#' + $scope.selid).parents('div').removeClass('open');
                    } else {
                        $('div').removeClass('open');
                        $('#' + $scope.selid).dropdown('toggle');
                    }
                    event.stopPropagation();
                }
			}
        }
    })
    .directive('ms2hDropdown', function () {
        return {
			restrict: 'E',
			template: 
                    '<div class="dropdown">'
                   +'     <button type="button" class="btn btn-outline-secondary dropdown-toggle {{btnsize}}" data-toggle="dropdown" style="width:{{width}}">'
                   +'          {{dropdown.selectedItem.title}} <span class="caret"/>'
                   +'     </button>'
                   +'     <div class="dropdown-menu">'
                   +'  	      <a class="dropdown-item" ng-click="fnSelect(item)" ng-repeat="item in dropdown.source">{{item.title}}</a>'
                   +'     </div>'
                   +'</div>'
  
            ,
			scope: {
                width: '@',
                height: '@',
                btnsize : '@',
                dropdown : '=',
                initvalue: '=',
            },
			controller: function ($scope, $element, $attrs) {
				$scope.dropdown = angular.extend(
	                    {	
	                    	selected : function(item){
	                    		
	                    	},
	                    	selectedItem : { title : ''},
	                    	valueField : ''
	                    },$scope.dropdown
                );
				
                $scope.btnsize = "";
                
                $('.dropdown', $element).on('show.bs.dropdown', function () {
					
					$('.dropdown-menu').css("width", $scope.width);
					// $scope.fnOnOpen();
				});
                
                if($scope.initvalue != undefined){
                    angular.forEach($scope.dropdown.source, function(item, i){
                        if(item[$scope.dropdown.valueField] == $scope.initvalue){
                            $scope.dropdown.selectedItem = item;
                            return;
                        }
                    });
                }
                               
                $scope.fnSelect = function(item){
                    $scope.dropdown.selectedItem = item;
                    if($scope.dropdown.selected != undefined)
                        $scope.dropdown.selected(item);
                }
			}
        }
    })
    .directive('ms2hContainer', function () {
        return {
			restrict: 'E',
			transclude : true,
			template: 
                    '<div class="dropdown">'  
                   +'     <button type="button" class="btn btn-default {{btnsize}}" data-toggle="dropdown" >'
                   +'     	<span class="caret"/>'
                   +'     </button>'
                   +'     <div class="dropdown-menu" style="padding:0px; width:{{width}}; height:{{height}};">'
                   +'     </div>'
                   +'</div>'
                 
            ,
			scope: {
                width: '@',
                height: '@',
                btnsize : '@',
                source: '=',
                select: '=',
                fnselect: '&',
                selectedvalue: '=',
                valuefield: "@"
            },
            
            link: function(scope, element, attrs, ctrl, transclude) {
				transclude(scope.$parent, function(clone, scope) {
					 $(".dropdown-menu", element).append(clone);
			      });
			},
			
			controller: function ($scope, $element, $attrs, $transclude) {
                $scope.height = "33px";
                $scope.width = "150px";
                $scope.btnsize = "";
			}
        }
    })
    .directive('ms2hTextarea', function () {
        return {
			restrict: 'E',
			template: 
                     "<div>\n"
                    +"</div>"
            ,
			scope: {
                syntaxeditor: '=',
                value: '=',
                setting: '=',
                fninit: '=',
                fnchange:'='
            },
			controller: function ($scope, $element, $attrs) {
                $scope.syntaxeditor = angular.extend({},createCodeMirror($element.children('div')[0], $scope.setting));

                if($scope.value != undefined)
                    $scope.syntaxeditor.setValue($scope.value);
                    
                $scope.$watch('value', function(){
                	if($scope.value != undefined)
                		$scope.syntaxeditor.setValue($scope.value);
                });

                $scope.syntaxeditor.on("change", function(){
                    if($scope.fnchange != undefined){
                        $scope.fnchange();
                    }
                });

			}
        }
    })
    .directive('ms2hDtp', function () {
        return {
			restrict: 'E',
			template: 
				"<div class='input-group' data-date='2013-02-21T15:25:00Z'>\n"
			   +"	<input ng-model=\"picker.value\" class='form-control disabled-module' format='{{format}}' minview='{{minview}}' type='text' placeholder='{{placeholder}}' value='' ng-change='fnChange()' ng-required='isrequired == \"true\"' readonly>\n"
			   +"	<div class='input-group-append'>"
			   +"       <button type='button' class='btn btn-outline-secondary zindex' ng-click='fnReset()'><i class='fa fa-calendar-times'></i></button>\n"
			   +"	    <button type='button' class='btn btn-outline-secondary zindex' ng-click='fnShow()'><i class='fa fa-calendar-alt'></i></button>\n"
			   +"   </div>\n"
			   +"</div>"
            ,
            scope: {
                picker: '=',
                btnsize : '@',
                placeholder:'@',
                model : '=',
                fnchange: '&',
                format : '@',
                minview : '@',
                isrequired : '@'
            },
			link : function(scope, element, attrs){
				scope.picker = $("input",element).datetimepicker({
					autoclose: true,
			        todayBtn: true,
			        format : (attrs.format==undefined)?scope.picker.format:attrs.format,
			        minView: (attrs.minview==undefined)?'':attrs.minview,  //选择日期后，不会再跳转去选择时分秒
			        language: 'zh-CN'				
			        /*,daysOfWeekDisabled: [0, 6]*/
				})
				.on('changeDate', function(ev){
                    scope.picker.value = ev.target.value;
                    if(scope.fnchange!=undefined){
                        scope.fnchange();
                    }
				});
            },
			
			controller: function ($scope, $element, $attrs) {
				$scope.fnShow = function(){
					$("input",$element).datetimepicker('show');
				};
				
				$scope.fnReset = function(){
                    $("input",$element).datetimepicker('reset');
                    if($scope.fnchange){
                        $scope.fnchange();
                    }
                };

                if($scope.model!=undefined){
                    $scope.$watch('model', function(){
                        var st = $scope.model;
                        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                        var date = st.replace(pattern, '$1-$2-$3 $4:$5');
                        $scope.picker.value = date;
                    });
                }
                if($scope.isrequired=="true"){
                    $scope.isrequired=true;
                } else {
                    $scope.isrequired=false;
                }
			}
        }
    })
    .directive('ms2hMultiSelect', function () {
        return {
			restrict: 'E',
            template: 
                 '    <div class="dropdown">'
                +'        <input type="text" class="form-control disabled-module" placeholder="{{placeholder}}" ng-model="model[titlefield]" dropdown-toggle ng-click="fnOnOpen()" readonly/>'
                +'        <ul class="dropdown-menu" id="{{selid}}" style="border:1px solid rgba(0,0,0,0.1);" data-flip="false" data-display="static">'
                +'            <li>'
                +'                <div class="col-sm-12" style="border-bottom:1px solid rgba(0,0,0,0.1);">'
                +'                    <div ms2h-scroll="200px">'
                +'                        <div class="ms-item d-flex justify-content" ng-repeat="item in source">'
                +'                           <input type="checkbox" class="bd-highlight" style="margin-left: 15px;" ng-model="item.checked" ng-click="fn_addItem(item)"><a class="flex-grow-1 bd-highlight" ng-click="fn_select(item)">{{item.title}}</a>'
                +'                        </div>'
                +'                    </div>'
                +'                </div>'
                +'                <div class="row">'
                +'                    <div class="col-sm-8">'
                +'                        <div ng-repeat="title in selectedItem.title" ng-hide="hideselects==\'true\'">'
                +'                            <p style="float:left; margin-top:5px;" ng-if="$index != 0">,</p> <span class="label label-info"'
                +'                                style="float:left; margin-top: 5px;">{{title}}</span>'
                +'                        </div>'
                +'                    </div>'
                +'                    <div class="col-sm-4">'
                +'                        <div class="d-flex justify-content-end">'
                +'                            <div class="btn-group" style="padding-right: 20px; padding-top: 5px;"> <button class="btn btn-sm btn-warning"'
                +'                                    ng-click="fn_clear()">Clear</button> <button class="btn btn-sm btn-primary" ng-click="fn_ok()">Ok</button>'
                +'                            </div>'
                +'                        </div>'
                +'                    </div>'
                +'                </div>'
                +'            </li>'
                +'        </ul>'
                +'    </div>'
            ,
            scope: {
                selid: '@',
                model: '=',
                source: '=',
                titlefield: '@',
                valuefield: '@',
                placeholder: '@',
                hideselects: '@'
            },
			
			controller: function ($scope, $element, $attrs, $timeout) {
                $scope.selectedItem = {
                    title: [],
                    value: []
                };
                if($scope.placeholder == undefined)
                    $scope.placeholder = 'Select...';
                
                $('.dropdown', $element).on('shown.bs.dropdown', function (event) {
                    var width = $('.dropdown', $element).width();
                    $('#'+$scope.selid).css("width", width+"px");
                });

                $scope.fnOnOpen = function(){
                    $scope.fn_clear();
                    if($scope.model[$scope.titlefield] != '' && $scope.model[$scope.titlefield] != undefined){
                        var valArr = $scope.model[$scope.valuefield].split(",");
                        angular.forEach($scope.source, function(item){
                            for(var i = 0; i < valArr.length; i++){
                                if(item.value == valArr[i]){
                                    $scope.selectedItem.title.push(item.title);
                                    $scope.selectedItem.value.push(item.value);
                                    item.checked = true;
                                }
                            }
                        });
                    }
                    $scope.fn_toggleSelect();
                };

				$scope.fn_ok = function(){
                    $scope.model[$scope.titlefield] = '';
                    $scope.model[$scope.valuefield] = '';
                    angular.forEach($scope.selectedItem.title, function(s_item, index){
                        if($scope.model[$scope.titlefield] == '' || $scope.model[$scope.titlefield] == undefined){
                            $scope.model[$scope.titlefield] = s_item;
                            $scope.model[$scope.valuefield] = $scope.selectedItem.value[index];
                        } else {
                            $scope.model[$scope.titlefield] += ',' + s_item;
                            $scope.model[$scope.valuefield] += ',' + $scope.selectedItem.value[index];
                        }
                    });
                    $scope.fn_toggleSelect();
                };

                $scope.fn_select = function(item){
                    if(item.checked == undefined || item.checked == false){
                        $scope.selectedItem.title.push(item.title);
                        $scope.selectedItem.value.push(item.value);
                        item.checked=true;
                    } else if(item.checked == true){
                        angular.forEach($scope.selectedItem.title, function(s_item, index){
                            if(item.title == s_item){
                                $scope.selectedItem.title.splice(index, 1);
                                $scope.selectedItem.value.splice(index, 1);
                            }
                        });
                        item.checked=false;
                    }
                };
                
                $scope.fn_addItem = function(item){
                    if(item.checked == true){
                        $scope.selectedItem.title.push(item.title);
                        $scope.selectedItem.value.push(item.value);
                    } else if(item.checked == false){
                        angular.forEach($scope.selectedItem.title, function(s_item, index){
                            if(item.title == s_item){
                                $scope.selectedItem.title.splice(index, 1);
                                $scope.selectedItem.value.splice(index, 1);
                            }
                        });
                    }
                    event.stopPropagation();
                }
				
				$scope.fn_clear = function(){
                    angular.forEach($scope.source, function(item){
                        item.checked=false;
                    });
                    $scope.selectedItem.title = [];
                    $scope.selectedItem.value = [];
                };

                $scope.fn_toggleSelect = function(){
                    if($('#'+$scope.selid).attr("style") == undefined || $('#'+$scope.selid).attr("style") == ""){
                        var parents = $('#'+$scope.selid).parents();
                        var width = parents[1].clientWidth;
                    }
                    if($('#' + $scope.selid).hasClass('show')){
                        $('#' + $scope.selid).removeClass('show');
                    } else {
                        $('ul').removeClass('show');
                        $('#' + $scope.selid).dropdown('toggle');
                    }
                    event.stopPropagation();
                }
			}
        }
    })
    .directive('ms2hDynaInputs', function () {
        return {
			restrict: 'E',
            template: 
                         '<form ng-class="{ \'tabular-form border\' : (rowtype==\'true\') }">'
                        +'  <div ng-repeat="item in attributes.source">'
                        +'      <div ng-class="{ \'form-group has-feedback\' : (rowtype!=\'true\'), \'form-group row has-feedback\' : (rowtype==\'true\') }">'
                        +'          <label class="col-sm-3 control-label text-truncate">{{item.attr_nm}}</label>'
                        +'          <div ng-class="{ \'{{inputsize}}\' : (rowtype!=\'true\'), \'{{inputsize}} tabular-border\' : (rowtype==\'true\') }">'
                        +'              <select id="inp_{{item.attr_cd}}" class="form-control" ng-model="attributes.inputs[item.attr_cd].selectedItem"'
                        +'                  ng-options="item.title for item in attributes.inputs[item.attr_cd].source track by item.value"'
                        +'                  ng-change="attributes.inputs[item.attr_cd].selectChanged()" ng-if="item.ctrl_id == \'combobox\'">'
                        +'                  <option value="" selected disabled></option>'
                        +'              </select>'
                        +'              <ms2h-dtp id="inp_{{item.attr_cd}}" picker="attributes.inputs[item.attr_cd]" model="attributes.model[item.attr_cd]" fnchange="attributes.change(item.attr_cd)" ng-if="item.ctrl_id == \'datefield\'"></ms2h-dtp>'
                        +'              <input id="inp_{{item.attr_cd}}" class="form-control" type="text" ng-model="attributes.model[item.attr_cd]" ng-if="item.ctrl_id==\'textfield\' || item.ctrl_id == \'datetimefield\'" ng-change="attributes.change(item.attr_cd)"/>'
                        +'              <input id="inp_{{item.attr_cd}}" class="form-control" type="text" ng-model="attributes.model[item.attr_cd]" ng-if="item.ctrl_id==\'integerfield\'" ng-change="attributes.change(item.attr_cd)"/>'
                        +'              <input id="inp_{{item.attr_cd}}" class="form-control" type="text" ng-model="attributes.model[item.attr_cd]" ng-if="item.ctrl_id==\'colorpicker\'" ng-change="attributes.change(item.attr_cd)"/>'
                        +'              <textarea id="inp_{{item.attr_cd}}" class="form-control" type="text" ng-model="attributes.model[item.attr_cd]" ng-if="item.ctrl_id==\'textarea\'" ng-change="attributes.change(item.attr_cd)" rows=3></textarea>'
                        +'              <div class="input-group" ng-if="item.ctrl_id==\'textfield_btn\'">'
                        +'				    <input id="inp_{{item.attr_cd}}" class="form-control" type="text" ng-model="attributes.model[item.attr_cd]" ng-change="attributes.change(item.attr_cd)"/>'
                        +'                  <div id="btn_{{item.attr_cd}}" class="input-group-append">'
                        +'				        <button class="btn btn-outline-secondary" type="button" ng-click="attributes.inputs[item.attr_cd].click(attributes.model)"><i class="{{attributes.inputs[item.attr_cd].icon}}"></i></button>'
                        +'                  </div>'
                        +'			    </div>'
                        +'          </div>'
                        +'          <div class="help-block with-errors"></div>'
                        +'      </div>'
                        +'  </div>'
                        +'</form>'
            ,
            scope: {
                attributes : '=',
                rowtype : '@',
                inputsize : '@'
            },
			controller: function ($scope, $element, $attrs) {
                // if($scope.rowtype==undefined){
                //     $scope.rowtype=false;
                // }
                if($scope.inputsize==undefined){
                    $scope.inputsize = 'col-sm-7';
                }
                $scope.attributes = angular.extend({
                    inputs : {},
                    model : {},
                    custom : {},
                    source : [],
                    icon : 'fa fa-cog',
                    onValueChange : function(obj, attr_cd){
                        var me = this;
                        if(me.inputs[attr_cd].value != undefined){
                            obj[attr_cd] = me.inputs[attr_cd].value.replace(/(:|-| )/g, "").concat('00');
                        } else {
                            obj[attr_cd] = me.model[attr_cd];
                        }
                    },
                    init: function(clsId, callback){
                        var me = this;
                        if(clsId != undefined && clsId != ''){
                            $scope.attributes.source = $scope.attributes.adsrc[clsId].concat($scope.attributes.source);
                        }
                        angular.forEach($scope.attributes.source, function(item){
                            if(me.inputs[item.attr_cd] == undefined){
                                me.inputs[item.attr_cd] ={};
                            }
                            var input = me.inputs[item.attr_cd];
                            //custom validation part
                            if(item.min_val != undefined){ /* minimum value validation function */
                                me.custom['minval'] = function($el){
                                    if(item.ctrl_id == 'integerfield'){
                                        if(Number($el.val()) < Number(angular.copy(item.min_val))){
                                            return '请输入更大的值(min.: '+item.min_val+')';
                                        }
                                    } else {
                                        if($el.val() < angular.copy(item.min_val)){
                                            return '请输入更大的值(min.: '+item.min_val+')';
                                        }
                                    }
                                }
                            }
                            if(item.max_val != undefined){ /* maximum value validation function */
                                me.custom['maxval'] = function($el){
                                    if(item.ctrl_id == 'integerfield'){
                                        if(Number($el.val()) > Number(angular.copy(item.max_val))){
                                            return '请输入更小的值(max.: '+item.max_val+')';
                                        }
                                    } else {
                                        if($el.val() > angular.copy(item.max_val)){
                                            return '请输入更小的值(max.: '+item.max_val+')';
                                        }
                                    }
                                }
                            }
                            if(item.ctrl_id == 'combobox'){
                                debugger;
                                angular.extend(me.inputs[item.attr_cd], {
                                    source : CodeUtil[item.enum_id],
                                    selectedItem: {},
                                    selectChanged : function(){
                                        $scope.attributes.model[item.attr_cd] = this.selectedItem.value;
                                        me.change(item.attr_cd);
                                    },
                                    init : function(val){
                                        var src = this.source;
                                        if(src != undefined){
                                            for(i=0;i<src.length;i++){
                                                if(src[i].value == val){
                                                    this.selectedItem = src[i];
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                                if(me.model[item.attr_cd] != '' && me.model[item.attr_cd] != undefined){
                                    me.inputs[item.attr_cd].init(me.model[item.attr_cd]);
                                }
                            } else if(item.ctrl_id == 'colorpicker'){
                                $(function () {
                                    $('#inp_'+item.attr_cd).colorpicker();
                                });
                                me.inputs[item.attr_cd].colorpicker = $('#inp_'+item.attr_cd).colorpicker();
                            } else if(item.ctrl_id == 'textfield_btn'){
                                if(me.inputs[item.attr_cd].icon == undefined || me.inputs[item.attr_cd].icon == ''){
                                    me.inputs[item.attr_cd].icon = me.icon;
                                }
                            } else if(item.ctrl_id == 'datefield'){
                                
                                // var st = me.model[item.attr_cd];
                                // var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                                // var date = st.replace(pattern, '$1-$2-$3 $4:$5');
                                me.inputs[item.attr_cd].value = '';
                            } else if(item.ctrl_id == 'datetimefield') {
                                me.inputs[item.ctrl_id].value = '';
                            }
                            //each input's validation
                            $(function () {
                                $('#inp_'+item.attr_cd).attr({
                                    'maxlength' : (function(){
                                                        if(item.ctrl_id != 'integerfield'){
                                                            return item.dt_len;
                                                        } else {
                                                            if(item.prcsn != undefined && item.prcsn != ''){
                                                                return (item.dt_len+1);
                                                            } else {
                                                                return item.dt_len;
                                                            }
                                                        }
                                        
                                                    })(),
                                    
                                    'required' : (function(){
                                                    if(item.nul_yn == 'N' || item.key_yn == 'Y'){
                                                        return 'required';
                                                    } else {
                                                        return;
                                                    }
                                                })(),
                                    'pattern' : (function(){
                                                    if(item.dt_fom == undefined && item.dt_fom == '' && item.ctrl_id !='integerfield'){
                                                        return '.*'
                                                    } else if(item.dt_fom != undefined && item.dt_fom != '' && item.ctrl_id != 'integerfield'){
                                                        return item.dt_fom;
                                                    } else if(item.ctrl_id == 'integerfield'){
                                                        if(item.dt_fom != undefined){
                                                            return item.dt_fom;
                                                        } else {
                                                            if(item.dt_len){
                                                                var dt_fom = '^([0-9]{0,'+item.dt_len+'})';
                                                                if(item.prcsn != undefined){
                                                                    dt_fom += '([\\.][0-9]{0,'+item.prcsn+'})?$';
                                                                }
                                                            } else {
                                                                var dt_fom = '^([0-9]*)';
                                                                if(item.prcsn != undefined){
                                                                    dt_fom += '([\\.][0-9]{0,'+item.prcsn+'})?$';
                                                                }
                                                            }
                                                            
                                                            return dt_fom;
                                                        }
                                                    } else if(item.ctrl_id == 'datetimefield') {
                                                        if(item.dt_fom != undefined){
                                                            return item.dt_fom;
                                                        } else {
                                                            var dt_fom = '^(\\d{4})-(\\d{2})-(\\d{2})$';
                                                            return dt_fom;
                                                        }
                                                    }
                                                })(),
                                    'data-minval' : (function(){
                                                        if(item.min_val != undefined){
                                                            if(me.custom['minval']!=undefined){
                                                                return '$("#inp_'+item.attr_cd+'").val()';
                                                            } else {
                                                                return;
                                                            }
                                                        }
                                                    })(),
                                    'data-maxval' : (function(){
                                                        if(item.max_val!=undefined){
                                                            if(me.custom['maxval']!=undefined){
                                                                return '$("#inp_'+item.attr_cd+'").val()';
                                                            } else {
                                                                return;
                                                            }
                                                        }
                                                    })(),
                                    'data-minval-error' : '请输入更大的值(min.: '+item.min_val+')',
                                    'data-maxval-error' : '请输入更小的值(max.: '+item.max_val+')'
                                });
                                if(me.inputs[item.attr_cd].custom){
                                    angular.forEach(me.inputs[item.attr_cd].custom, function(func, key){
                                        me.custom[key] = me.inputs[item.attr_cd].custom[key];
                                        $('#inp_'+item.attr_cd).attr( 'data-'+key, '$("#inp_'+item.attr_cd+'").val()' );
                                    });
                                }
                                if(callback){
                                    callback();
                                }
                            });
                        });
                    }
                }, $scope.attributes);
			}
        }
    })
    .directive('ms2hAuth', function () {
        return {
			restrict: 'A',
            link : function(scope, element, attrs){
            	if(scope.userId!='admin'){
            		if(attrs.ms2hAuth != ''){
            			if(scope.funcAuth == undefined){
            				return;
//            				element.remove();  
            			}else{
            				if(scope.funcAuth[attrs.ms2hAuth] == undefined){
                            	  element.remove();  
                              }
            			}
                    }
            	}
            }
        }
    })
    .directive('ms2hScroll', function () {
        return {
			restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
            	element.slimScroll({ height: attrs.ms2hScroll, width: '100%' });
			}
        }
    })
    .directive('ms2hSheet', function () {
        return {
        	scope: {},
            link: function ($scope, $elm, $attrs) {
              $elm.on('change', function (changeEvent) {
                var reader = new FileReader();

                reader.onload = function (e) {
                  /* read workbook */
                  var bstr = e.target.result;
                  var workbook = XLSX.read(bstr, {type:'binary'});
                  	
                  /* DO SOMETHING WITH workbook HERE */
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
              });
            }
        }
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }])
     .directive('ms2hUploader', ['$http', function ($http) {
        return {
           restrict: 'E',
           template: 
               '<input type="file" id="file" ng-show="false"  onchange="angular.element(this).scope().upload(event)"/>'       
              +'<button ng-click="uploadclick()" class="btn btn-sm btn-outline-secondary"><span class="fa fa-upload"></span>&nbsp;{{text}}</button>',
              
           scope: {
        	 uploader : '=',
             text : '@'            	 
           },
          
           controller: function ($scope, $element, $attrs, $transclude, $http) {
               $scope.uploadclick = function(){
            	   $('#file', $element).click();
               },
               
               $scope.upload = function(event){    
            	      var file = event.target.files[0];
            	      var fileName = file.name;
     	 		  var url = "/mdms/fileupload";
     	 		  var data = new FormData();
     	 		  data.append('fileContent', file);
     	 		  data.append('nms', $scope.uploader.nms); 
     	 		  var config = {
 	 			    transformRequest: angular.identity,
 	 		       	transformResponse: angular.identity,
 	 				headers : {
 	 					'Content-Type': undefined
 	 			    }
     	 		  }
     	 		  $http.post(url, data, config).then(function (response) {
     	 			var res = JSON.parse(response.data);
     	 			if($scope.uploader.uploadcompleted != undefined){
     	 				$scope.uploader.uploadcompleted(res.files[0].fileId, fileName);
     	 			}
     	 			
     	 		  });
     	 		  
     	 		  $('#file', $element).val('');
               }
               
           }
            
        };
     }])
    .directive('ms2hDialog', function () {
        return {
			restrict: 'E',
            transclude : true,
			template: 
                     '    <form>'
                    +'        <div class="modal-dialog modal-dialog-centered modal-lg" style="width: {{width}}px">'
                    +'            <div class="modal-content">'
                    +'                <div class="modal-header" ng-if="showheader!=\'false\'">'
                    +'                    <h5 class="modal-title">{{title}}</h5>'
                    +'                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'
                    +'                </div>'
                    +'                <div class="modal-body">'
                    +'                    <div id="content" class="content">'
                    +'                    </div>'
                    +'                </div>'
                    +'                <div class="modal-footer" ng-if="showfooter!=\'false\'">'
                    +'                    <button type="button" class="btn btn-success" ng-click="fnSubmit();">{{strOK}}</button>'
                    +'                    <button type="button" class="btn btn-outline-secondary" ng-click="fnCancel();">{{strCancel}}</button>'
                    +'                </div>'
                    +'            </div>'
                    +'        </div>'
                    +'    </form>'
            ,
			scope: {
                dialogid: '@',
                title: '@',
                width : '@',
                showfooter : '@',
                showheader : '@'
            },
            link: function(scope, element, attrs, ctrl, transclude) {
				transclude(scope.$parent, function(clone, scope) {
					$("#content", element).append(clone);
			    });
			},
			
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.strOK = '确认';
				$scope.strCancel = '取消'
                $scope.fnSubmit = function(){
                    $("#"+$scope.dialogid)[0].onok();
                },
                
                $scope.fnCancel = function(){
                    $("#"+$scope.dialogid).modal('hide');
                }

                $scope.showfooter=true;
                $scope.showheader=true;
			}
        }
    })
    .directive('ms2hMyDetailInfo', function () {
        return {
            restrict: 'E',
            template:
                '<div class="my-detail-info">'
                +'    <a class="nav-link" href="javascript:void(0);" data-toggle="dropdown" style="padding-top: 10px; padding-bottom: 10px">'
                +'        <i class="fa fa-user fa-lg"></i>'
                +'        <span ng-bind="username"></span>'
                +'    </a>'
                +'    <div class="dropdown-menu dropdown-menu-right">'
                // +'        <div ng-repeat="item in properties">'
                // +'            <h5 class="dropdown-header">{{item.name}}</h5>'
                // +'            <a class="dropdown-item" href="#">{{item.value}}</a>'
                // +'        </div>'
                +'        <table class="table table-hover">'
                +'            <tr ng-repeat="item in properties">'
                +'                <td class="my-detail-info_name" nowrap="nowrap">{{item.name}}</td>'
                +'                <td class="my-detail-info_value" nowrap="nowrap">{{item.value}}</td>'
                +'            </tr>'
                +'        </table>'
                +'    </div>'
                +'</div>'

            ,
            scope: {
                username: '=',
                properties: '=',
            },
            controller: function ($scope, $element, $attrs) {
            }
        }
    });
}).call(window);
