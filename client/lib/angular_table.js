// author:   Samuel Mueller
// version: 1.0.0
// license:  MIT
// homepage: http://github.com/samu/angular-table
(function(){var a,b,c,d,e,f,g,h,i,j,k,l={}.hasOwnProperty,m=function(a,b){function c(){this.constructor=a}for(var d in b)l.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};angular.module("angular-table",[]),j="number_of_pages",a=function(){function a(a,b){this.attribute=a.attribute,this.title=a.title,this.sortable=a.sortable,this.width=a.width,this.initialSorting=a.initialSorting,b&&(this.custom_content=b.custom_content,this.attributes=b.attributes)}return a.prototype.create_element=function(){var a;return a=angular.element(document.createElement("th"))},a.prototype.render_title=function(a){return a.html(this.custom_content||this.title)},a.prototype.render_attributes=function(a){var b,c,d,e,f;if(this.custom_content){for(e=this.attributes,f=[],c=0,d=e.length;d>c;c++)b=e[c],f.push(a.attr(b.name,b.value));return f}},a.prototype.render_sorting=function(a){var b;return this.sortable?(a.attr("ng-click","predicate = '"+this.attribute+"'; descending = !descending;"),b=angular.element("<i style='margin-left: 10px;'></i>"),b.attr("ng-class","getSortIcon('"+this.attribute+"', predicate)"),a.append(b)):void 0},a.prototype.render_width=function(a){return a.attr("width",this.width)},a.prototype.render_html=function(){var a;return a=this.create_element(),this.render_title(a),this.render_attributes(a),this.render_sorting(a),this.render_width(a),a},a}(),b=function(){function a(a){this.config_object_name=a,this.items_per_page=""+this.config_object_name+".itemsPerPage",this.sort_context=""+this.config_object_name+".sortContext",this.fill_last_page=""+this.config_object_name+".fillLastPage",this.max_pages=""+this.config_object_name+".maxPages",this.current_page=""+this.config_object_name+".currentPage"}return a}(),e=function(){function a(a,b,c){this.scope=a,this.configuration_variable_names=b,this.list_name=c}return a.prototype.get_list=function(){return this.scope.$eval(this.list_name)},a.prototype.get_items_per_page=function(){return this.scope.$eval(this.configuration_variable_names.items_per_page)||10},a.prototype.get_current_page=function(){return this.scope.$eval(this.configuration_variable_names.current_page)||0},a.prototype.get_max_pages=function(){return this.scope.$eval(this.configuration_variable_names.max_pages)||void 0},a.prototype.get_sort_context=function(){return this.scope.$eval(this.configuration_variable_names.sort_context)||"global"},a.prototype.set_current_page=function(a){return this.scope.$eval(""+this.configuration_variable_names.current_page+"="+a)},a}(),i=function(){function b(a,b){this.table_element=a,this.attributes=b,this.id=this.attributes.id,this.config=this.attributes.atConfig,this.paginated=null!=this.attributes.atPaginated,this.list=this.attributes.atList,this.create_column_configurations()}return b.prototype.capitaliseFirstLetter=function(a){return a?a.charAt(0).toUpperCase()+a.slice(1):""},b.prototype.extractWidth=function(a){var b;return b=/([0-9]+px)/i.exec(a),b?b[0]:""},b.prototype.isSortable=function(a){var b;return b=/(sortable)/i.exec(a),b?!0:!1},b.prototype.getInitialSorting=function(a){var b;if(b=a.attr("at-initial-sorting")){if("asc"===b||"desc"===b)return b;throw"Invalid value for initial-sorting: "+b+". Allowed values are 'asc' or 'desc'."}return void 0},b.prototype.collect_header_markup=function(a){var b,c,d,e,f,g;for(b={},d=a.find("tr"),g=d.find("th"),e=0,f=g.length;f>e;e++)c=g[e],c=angular.element(c),b[c.attr("at-attribute")]={custom_content:c.html(),attributes:c[0].attributes};return b},b.prototype.collect_body_markup=function(a){var b,c,d,e,f,g,h,i,j,k;for(c=[],k=a.find("td"),i=0,j=k.length;j>i;i++)f=k[i],f=angular.element(f),b=f.attr("at-attribute"),g=f.attr("at-title")||this.capitaliseFirstLetter(f.attr("at-attribute")),e=void 0!==f.attr("at-sortable")||this.isSortable(f.attr("class")),h=this.extractWidth(f.attr("class")),d=this.getInitialSorting(f),c.push({attribute:b,title:g,sortable:e,width:h,initialSorting:d});return c},b.prototype.create_column_configurations=function(){var b,c,d,e,f;for(c=this.collect_header_markup(this.table_element),b=this.collect_body_markup(this.table_element),this.column_configurations=[],e=0,f=b.length;f>e;e++)d=b[e],this.column_configurations.push(new a(d,c[d.attribute]));return this.column_configurations},b}(),f=function(){function a(){}return a.prototype.setupTr=function(a,b){var c,d;return c=a.find("tbody"),d=c.find("tr"),d.attr("ng-repeat",b),c},a}(),g=function(a){function b(a,b){this.list=b,this.repeatString="item in "+this.list+" | orderBy:predicate:descending"}return m(b,a),b.prototype.compile=function(a){return this.setupTr(a,this.repeatString)},b.prototype.link=function(){},b}(f),d=function(a){function b(a){this.configuration_variable_names=a,this.repeatString="item in sorted_and_paginated_list"}return m(b,a),b.prototype.compile=function(a){var b,c,d,e,f,g,h;for(c=this.setupTr(a,this.repeatString),f=a.find("td"),e="",g=0,h=f.length;h>g;g++)d=f[g],e+="<td>&nbsp;</td>";b=angular.element(document.createElement("tr")),b.attr("ng-show",this.configuration_variable_names.fill_last_page),b.html(e),b.attr("ng-repeat","item in filler_array"),c.append(b)},b.prototype.link=function(a,b,c,d){var f,g,h,i,k;return f=this.configuration_variable_names,k=new e(a,f,c.atList),h=function(a,b,c,d,e,f,g){var h,i;return a?(i=a,h=c*b-a.length,"global"===d?(i=g("orderBy")(i,e,f),i=g("limitTo")(i,h),i=g("limitTo")(i,c)):(i=g("limitTo")(i,h),i=g("limitTo")(i,c),i=g("orderBy")(i,e,f)),i):[]},g=function(a,b,c,d){var e,f,g,h,i,j,k,l,m,n;if(d=parseInt(d),a.length<=0){for(m=[],g=h=0,j=d-1;j>=0?j>=h:h>=j;g=j>=0?++h:--h)m.push(g);return m}if(b===c-1){if(f=a.length%d,0!==f){for(e=d-f-1,n=[],g=i=k=a.length,l=a.length+e;l>=k?l>=i:i>=l;g=l>=k?++i:--i)n.push(g);return n}return[]}},i=function(){var b;return a.sorted_and_paginated_list=h(k.get_list(),k.get_current_page(),k.get_items_per_page(),k.get_sort_context(),a.predicate,a.descending,d),b=Math.ceil(k.get_list().length/k.get_items_per_page()),a.filler_array=g(k.get_list(),k.get_current_page(),b,k.get_items_per_page())},a.$watch(f.current_page,function(){return i()}),a.$watch(f.items_per_page,function(){return i()}),a.$watch(f.sort_context,function(){return i()}),a.$watch(""+c.atList+".length",function(){return a[j]=Math.ceil(k.get_list().length/k.get_items_per_page()),i()}),a.$watch("predicate",function(){return i()}),a.$watch("descending",function(){return i()})},b}(f),h=function(){function a(a,b,c){this.element=a,this.table_configuration=b,this.configuration_variable_names=c}return a.prototype.constructHeader=function(){var a,b,c,d,e;for(b=angular.element(document.createElement("tr")),e=this.table_configuration.column_configurations,c=0,d=e.length;d>c;c++)a=e[c],b.append(a.render_html());return b},a.prototype.setup_header=function(){var a,b,c;return b=this.element.find("thead"),b?(a=this.constructHeader(),c=angular.element(b).find("tr"),c.remove(),b.append(a)):void 0},a.prototype.get_setup=function(){return this.table_configuration.paginated?new d(this.configuration_variable_names):new g(this.configuration_variable_names,this.table_configuration.list)},a.prototype.compile=function(){return this.setup_header(),this.setup=this.get_setup(),this.setup.compile(this.element)},a.prototype.setup_initial_sorting=function(a){var b,c,d,e,f;for(e=this.table_configuration.column_configurations,f=[],c=0,d=e.length;d>c;c++)if(b=e[c],b.initialSorting){if(!b.attribute)throw"initial-sorting specified without attribute.";a.predicate=b.attribute,f.push(a.descending="desc"===b.initialSorting)}else f.push(void 0);return f},a.prototype.post=function(a,b,c,d){return this.setup_initial_sorting(a),a.getSortIcon||(a.getSortIcon=function(b){return b!==a.predicate?"glyphicon glyphicon-minus":a.descending?"glyphicon glyphicon-chevron-down":"glyphicon glyphicon-chevron-up"}),this.setup.link(a,b,c,d)},a}(),c=function(){function a(a,b,c,d){if(this.lower_bound=null!=a?a:0,this.upper_bound=null!=b?b:1,null==c&&(c=0),this.length=null!=d?d:1,this.length>this.upper_bound-this.lower_bound)throw"sequence is too long";this.data=this.generate(c)}return a.prototype.generate=function(a){var b,c,d,e;for(a>this.upper_bound-this.length?a=this.upper_bound-this.length:a<this.lower_bound&&(a=this.lower_bound),e=[],b=c=a,d=parseInt(a)+parseInt(this.length)-1;d>=a?d>=c:c>=d;b=d>=a?++c:--c)e.push(b);return e},a.prototype.reset_parameters=function(a,b,c){if(this.lower_bound=a,this.upper_bound=b,this.length=c,this.length>this.upper_bound-this.lower_bound)throw"sequence is too long";return this.data=this.generate(this.data[0])},a.prototype.relocate=function(a){var b;return b=this.data[0]+a,this.data=this.generate(b,b+this.length)},a.prototype.realign_greedy=function(a){var b;return a<this.data[0]?(b=a,this.data=this.generate(b)):a>this.data[this.length-1]?(b=a-(this.length-1),this.data=this.generate(b)):void 0},a.prototype.realign_generous=function(){},a}(),k="<div style='margin: 0px;'> <ul class='pagination'> <li ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='step_page(-"+j+")'>First</a> </li> <li ng-show='show_sectioning()' ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='jump_back()'>&laquo;</a> </li> <li ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='step_page(-1)'>&lsaquo;</a> </li> <li ng-class='{active: get_current_page() == page}' ng-repeat='page in page_sequence.data'> <a href='' ng-click='go_to_page(page)'>{{page + 1}}</a> </li> <li ng-class='{disabled: get_current_page() >= "+j+" - 1}'> <a href='' ng-click='step_page(1)'>&rsaquo;</a> </li> <li ng-show='show_sectioning()' ng-class='{disabled: get_current_page() >= "+j+" - 1}'> <a href='' ng-click='jump_ahead()'>&raquo;</a> </li> <li ng-class='{disabled: get_current_page() >= "+j+" - 1}'> <a href='' ng-click='step_page("+j+")'>Last</a> </li> </ul> </div>",angular.module("angular-table").directive("atTable",["$filter",function(a){return{restrict:"AC",scope:!0,compile:function(c,d){var e,f,g;return g=new i(c,d),e=new b(d.atConfig),f=new h(c,g,e),f.compile(),{post:function(b,c,d){return f.post(b,c,d,a)}}}}}]),angular.module("angular-table").directive("atPagination",[function(){return{restrict:"E",scope:!0,replace:!0,template:k,link:function(a,d,f){var g,h,i,k,l,m;return g=new b(f.atConfig),m=new e(a,g,f.atList),i=function(a,b,c){return a=Math.max(b,a),Math.min(c,a)},h=function(){return a[j]},k=function(b){return a[j]=b},l=function(){var b,c;return m.get_list()?m.get_list().length>0?(b=Math.ceil(m.get_list().length/m.get_items_per_page()),k(b),c=a.show_sectioning()?m.get_max_pages():b,a.page_sequence.reset_parameters(0,b,c),m.set_current_page(i(m.get_current_page(),0,h()-1)),a.page_sequence.realign_greedy(m.get_current_page())):(k(1),a.page_sequence.reset_parameters(0,1,1),m.set_current_page(0),a.page_sequence.realign_greedy(0)):void 0},a.show_sectioning=function(){return m.get_max_pages()&&h()>m.get_max_pages()},a.get_current_page=function(){return m.get_current_page()},a.step_page=function(b){return b=parseInt(b),m.set_current_page(i(m.get_current_page()+b,0,h()-1)),a.page_sequence.realign_greedy(m.get_current_page())},a.go_to_page=function(a){return m.set_current_page(a)},a.jump_back=function(){return a.step_page(-m.get_max_pages())},a.jump_ahead=function(){return a.step_page(m.get_max_pages())},a.page_sequence=new c,a.$watch(g.items_per_page,function(){return l()}),a.$watch(g.max_pages,function(){return l()}),a.$watch(f.atList,function(){return l()}),a.$watch(""+f.atList+".length",function(){return l()}),l()}}}]),angular.module("angular-table").directive("atImplicit",[function(){return{restrict:"AC",compile:function(a){var b;if(b=a.attr("at-attribute"),!b)throw"at-implicit specified without at-attribute: "+a.html();return a.append("{{item."+b+"}}")}}}])}).call(this);
