/**
 * XLily6X UI
 *
 * 涵盖功能：
 * 1. 环境右键菜单
 * 2. 表格隔行变色、高亮
 * 3. 帮助文本提示
 * 4. 表格(重新加载，分页，选中行，获取行，获取选中行数据)
 * 5. 下拉框
 * 6. 代码展示高亮
 * 7. 表格列冻结
 *
 * version  : 1.0.1
 * author   : Lily
 * date     : 2017-09-28
 * email    : xiaowenlong2015@icloud.com
 * QQ 		: 397035490
 * website  : http://www.xlily6x.com
 * Thanks for you used xlily6x UI !
 */
;(function($, undefined){


    /**
     * 功能列表
     * @type {{ContextMenu: string, Tips: string, Chameleon: string, Table: string, TableReload: string, TableGetRows: string, Combox: string}}
     */
    $.widget={
        ContextMenu:"contextMenu",
        Tips:"tips",
        Chameleon:"chameleon",
        Table:"table",
        TableReload:"reloadTable",
        TableGetRows:"tableGetRows",
        TableGetSelectedRows:"tableGetSelectedRows",
        TableGetSelectedDatas:"tableGetSelectedDatas",
        Combox:"combox"

    }

    /**
     *  代码展示高亮
     *  定义在标签中的内容将会执行转义和高亮处理
     *  <pre name="code" class="java"><code>  ...  </code></pre>
     * @param language 自定义语言对象
     * Language:{
            java:[
                {type:"keyword",color:"#CC7832",items:"new|return|if|else|for|public|class|extends|final|long|int|throws|protected|void|static|private|import"},
                {type:"method",color:"#f31c24",items:"doPost|toString|getParameter|setCharacterEncoding"},
                {type:"class",color:"#1324cc",items:"HttpServletRequest|HttpServletResponse|ServletException|IOException|HttpServlet|Exception|Object|Double|Integer|String"},
                {type:"annotation",color:"#c9c40c",items:"@Override|@Service|@Resource|@AutoWrite|@RequestMapping"}
            ]
        },
     * type: 类型名称
     * color：颜色
     * items：关键字
     * @constructor
     */
    $.extend({
        Xlily6X:function (language) {
            console.log("HtmlCodeOrnament init");
            HtmlCodeOrnament.beautifulCode(language);
        }
    });

    /**
     * 冻结列 (水平冻结)
     * @param containerId 表格父容器ID
     * @param index  冻结列序号
     */
    $.freezeCloumn = function (containerId,index) {
        $("#"+containerId).css({
            "overflow":"auto"
        });
        $("#"+containerId).scroll(function() {//给table外面的div滚动事件绑定一个函数
            // var $table = $($(this).children("table").get(0));
            var $table =  $(this).find("table:first");
            var $th = $table.find("thead").find("th").eq(index);
            var wh = 0;
            $.each($th.prevAll(),function(j,k){
                console.log(k);
                wh = wh + $(k).width();
            });
            console.log("lily wh  : "+wh);
            var left = $(this).scrollLeft();//获取滚动的距离
            console.log("lily : "+left);
            var posi = left>wh?"relative":"initial";
            var backC = left>wh?"#f8f8f8":"";
            var thC = left>wh?"#c4c3c0":"";
            $th.css({
                "position":posi,
                "top":"0px",
                "left":left,
                "background-color":thC
            })
            $th.prevAll().css({
                "position":posi,
                "top":"0px",
                "left":left,
                "background-color":thC
            })
            var t = $table.find("thead").find("th").eq(index).text();
            console.log(t);
            var trs = $table.find("tbody").find("tr");
            $.each(trs,function(i,v){
                var $td = $(v).find("td").eq(index);
                var s = $(v).find("td").eq(index).text();
                console.log(s);
                $td.css({
                    "position":posi,
                    "top":"0px",
                    "left":left,
                    "background-color":backC

                })

                $td.prevAll().css({
                    "position":posi,
                    "top":"0px",
                    "left":left,
                    "background-color":backC
                })

            });
        });
    }

    /**
     * 静态模块对象
     * @type {{classs: {lily_menu: string, over: string, lily_menu_item: string, lily_highlighttr_hover: string, lily_highlighttr_odd: string, lily_highlighttr_even: string, lily_tips: string, lily_table: string, lily_pagination: string, left: string, right: string, centers: string, lily_combox: string}, event: {click: string, mouseover: string, mouseleave: string, contextmenu: string}, locations: [*], type: {String: string, Object: string, Function: string}, suffix: {table_id: string, pagination_id: string}, property: {id: string, name: string, title: string, width: string, lilyOps: string}}}
     */

    /* */
    var Modal = {
        classs:{
            lily_menu:"lily_menu",
            over:"over",
            lily_menu_item:"lily_menu_item",
            lily_highlighttr_hover:"lily_hover",
            lily_highlighttr_odd:"lily_odd",
            lily_highlighttr_even:"lily_even",
            lily_row_selected:"lily_row_selected",
            lily_tips:"lily_tips",
            lily_table:"lily_table",
            lily_pagination:"lily_pagination",
            left:"left",
            right:"right",
            centers:"centers",
            lily_combox:"lily_combox",
            lily_table_search:"lily_table_search"
        },
        event:{
            click:"click",
            mouseover:"mouseover",
            mousemove:"mousemove",
            mouseleave:"mouseleave",
            contextmenu:"contextmenu",
            change:"change",
            keyup:"keyup"
        },
        locations:["UpRight","LowerRight","UpLeft","LowerLeft"],
        type:{
            String:"string",
            Object:"object",
            Function:"function"
        },
        suffix:{
            table_id:"_tb_xlily6x",
            pagination_id:"_pn_xlily6x"
        },
        property:{
            id:"id",
            name:"name",
            title:"title",
            width:"width",
            lilyOps:"lilyOps",
            align:"align",
            lilySelected:"lilySelected",
            tipsId:"tipsId"
        },
        version:{
            url:"http://www.xlily6x.com",
            version:"1.0.1",
            name:"lily",
            sign:"xlily6x",
            date:new Date()
        }
    }


    /**
     * 构造原型
     * @type {{Tips: {font_size: string, location: *, text: string}, MenuOptions: {width: number, height: number, auto_height: boolean, background_color: string, custom_background_color: boolean, items: [*]}, Table: {url: string, dataType: string, data: Array, columns: Array, parameters: {}, remote: boolean, method: string, async: boolean, width: string, pagination: {}}, TableColumn: {title: string, name: string, width: string}, Pagination: {currPage: number, pageSize: number, pageSizeList: [*], pageCount: number, totalRow: number, startRow: number, endRow: number}}}
     */

    /* */
    var Prototypes = {
        /** {type:"keyword",color:"#CC7832",items:"try|while|throw|synchronized|short|package|interface|instanceof|implements|float|finally|enum|double|do|default|continue|char|catch|case|byte|boolean|abstract|new|return|if|else|for|public|class|extends|final|long|int|throws|protected|void|static|private|import|switch|break"} **/
        Language:{
            type:"keyword",
            color:"#CC7832",
            items:"try|while|throw|synchronized|short|package|interface|instanceof|implements|float|finally|enum|double|do|default|continue|char|catch|case|byte|boolean|abstract|new|return|if|else|for|public|class|extends|final|long|int|throws|protected|void|static|private|import|switch|break"
        },
        Tips:{
            font_size:"10px",
            location:Modal.locations[0],
            text:"This is lily tips ! Thanks for you used xlily6x UI !"
        },
        Chameleon:{
            oddClass:Modal.classs.lily_highlighttr_odd,
            evenClass:Modal.classs.lily_highlighttr_even,
            hoverClass:Modal.classs.lily_highlighttr_hover
        },

        /** 菜单Options 原型 */
        MenuOptions:{
            // 宽度 单位 px
            width:100,
            // 高度 单位 px
            height: 100,
            // 是否自动设置高度，为true时，设置 height 值无效
            auto_height:true,
            // 背景颜色
            background_color:"#fbf8ff",
            // 是否自定义背景颜色，为true时，backgroud_color 设置 无效
            custom_background_color:false,
            items:[
                {id:"menu_item_edit",text:"edit this",click:function (obj,env) {
                    console.log(obj);
                }},
                {id:"menu_item_delete",text:"delete this",click:function (obj,env) {
                    console.log(obj);
                }}
            ]
        },
        Table:{
            url:"",
            dataType:"json",
            data:[],
            columns:[],
            parameters:{},
            remote:true,
            method:"post",
            async:true,
            doman:false,
            width:"780px",
            paging:false,
            pagination:{},
            search:false,
            freeze:-1,
            totalRow:0,
            selectedColor:"rgb(149, 178, 222)",
            multiple:false,
            onLoad:function ($target,options) {}
        },

        TableColumn:{
            title:"title",
            name:"column",
            width:"100px",
            isFormat:false,
            hide:false,
            search:false,
            align:"center",
            format:function () {}

        },
        Pagination:{
            currPage:1,
            pageSize:10,
            pageSizeList:[10,20,30],
            pageCount:1,
            totalRow:10,
            startRow:0,
            endRow:10,
            reSet:true
        },
        Combox:{
            url:"",
            data:[],
            parameters:{},
            value:"",
            text:"",
            remote:true,
            dataType:"json",
            method:"post",
            async:true,
            width:"150px",
            paging:false,
            onchange:function (obj,args) {
                
            }
        }
    }



    $.lily = $.lily || {};
    $.extend($.lily,{
        table:function (options) {
            var newTableOptions,$target,$table;
            newTableOptions = $.extend(true,{},Prototypes.Table,options);
            $target = $(this);

            $table = XLily6XTable.TableBuild.buildTable($target,newTableOptions);
            XLily6XTable.TableLoad.load($target,newTableOptions);
            // Auxiliary.getAccessor(XLily6XTable.TableLoad,"load").apply(this,[$target,newTableOptions]);
            // $(this).setOptions(newTableOptions);
            Auxiliary.onLoad(this,newTableOptions);
            return $table;
        },
        reloadTable:function (parameters) {
            // XLily6XTable.TableLoad.reload()
            XLily6XTable.TableLoad.reload(this,parameters);
        },
        tableGetRows:function () {
            var $table = $(this).find("table[class='"+Modal.classs.lily_table+"']");
            return $table.find("tr:gt(0)");
        },
        tableGetSelectedRows:function () {
            var trs = XLily6XTable.TableLoad.getSelectedRows($(this));
            var options = $(this).getOptions();
            if(!options.multiple) return trs[0];
            return trs;
        },
        tableGetSelectedDatas:function () {

            var datas = XLily6XTable.TableLoad.getSelectedDatas($(this));
            var options = $(this).getOptions();
            if(!options.multiple) return datas[0];
            return datas;
        },
        tips:function (options) {
            var $target = $(this);
            var tipsOptions = $.extend(true,{},Prototypes.Tips,options);

            var tipsId = $target.attr(Modal.property.tipsId);
            if(tipsId!=undefined&&tipsId!=null){
                $("#"+tipsId).text(tipsOptions.text);
                return $target;
            }

            // console.log(tipsOptions);
            var timestamp =  (new Date()).valueOf();
            var id = Modal.classs.lily_tips+timestamp;
            id =id+Math.floor((Math.random()*100)+1);
            // console.log(timestamp);
            var html = '<div class="'+Modal.classs.lily_tips+'" id="'+id+'" >'+tipsOptions.text+'</div>';
            $("body").append(html);
            // var $tips = $("div[class='"+Modal.classs.lily_tips+timestamp+"']");
            var $tips = $("#"+id);
            // console.log($tips.length);
            $tips.hide();

            $target.bind(Modal.event.mouseover,function () {
                console.log(tipsOptions);
                Auxiliary.autoPositionShows($tips,tipsOptions.location);
            }).bind(Modal.event.mouseleave,function () {
                $tips.hide();
            });
            $target.attr(Modal.property.tipsId,id);

            return $target;
        },

        chameleon:function (options) {
            var newOptions = $.extend(true,{},Prototypes.Chameleon,options);
            var $table = $(this);
            $table.addClass("lily_table");
            $table.find("tr:odd").addClass(newOptions.oddClass);
            $table.find("tr:even").addClass(newOptions.evenClass);

            var trs2 = $(this).find("tr:gt(0)");
            $.each(trs2,function (i,v) {
                $(v).bind(Modal.event.mouseover,function (env) {
                    if($(this).index()%2==0){
                        $(this).removeClass(newOptions.oddClass);
                    }else{
                        $(this).removeClass(newOptions.evenClass);
                    }
                    $(this).addClass(newOptions.hoverClass);
                }).bind(Modal.event.mouseleave,function (env) {
                    if($(this).index()%2==0){
                        $(this).addClass(newOptions.oddClass);
                    }else{
                        $(this).addClass(newOptions.evenClass);
                    }
                    $(this).removeClass(newOptions.hoverClass);
                });
            });
            return $(this);
        },
        contextMenu:function (options) {
            var newOptions = $.extend(true,{},Prototypes.MenuOptions,options);
            var html = '<div class="'+Modal.classs.lily_menu+'" ></div>';
            this.append(html);
            var $target;
            console.log($(this));
            $(this).bind(Modal.event.mouseover,function () {
                document.oncontextmenu = function(e){
                    return false;
                };
            }).bind(Modal.event.mouseleave,function () {
                document.oncontextmenu = function(e){
                    return true;
                };
            }).bind(Modal.event.contextmenu,function (e) {
                $target = Auxiliary.autoPositionShows($(this).find("div[class='"+Modal.classs.lily_menu+"']"));
            });

            var $contextMenu = $(this).find("div[class='"+Modal.classs.lily_menu+"']");
            $contextMenu.css({width:newOptions.width});

            if(!newOptions.auto_height){
                $contextMenu.css({height:newOptions.height});
            }
            $contextMenu.html("");
            if(newOptions.custom_background_color){
                $contextMenu.css({
                    "background-color":newOptions.background_color});
            }
            $.each(newOptions.items,function (i,v) {
                var itemHtml = '<div class="'+Modal.classs.lily_menu_item+'" id="'+v.id+'_span"><label  id="'+v.id+'">'+v.text+'</label></div>';
                $contextMenu.append(itemHtml);
                $item = $contextMenu.find("#"+v.id+"_span");
                $item.bind(Modal.event.click,function (env) {
                    v.click($target,env);
                    $contextMenu.hide();
                }).bind(Modal.event.mouseover,function () {
                    $(this).addClass(Modal.classs.over);
                }).bind(Modal.event.mouseleave,function () {
                    $(this).removeClass(Modal.classs.over);
                });
            });

            $contextMenu.bind(Modal.event.mouseleave,function () {
                $(this).hide();
            });

            return $(this);
        },
        combox:function (options) {
            // console.log("Combox init");
            var $target = $(this);
            // console.log(Prototypes.Combox);
            var comboxOptions = $.extend(true,{},Prototypes.Combox,options);
            var $combox = XLily6XCombox.ComboxBuild.buildCombox($target,comboxOptions);

            // console.log("lily ----------------")
            // console.log($combox);
            // console.log(comboxOptions);
            XLily6XCombox.ComboxLoad.load($target,comboxOptions);
            return $combox;

        }



    });

    var XLily6XCombox ={
        ComboxBuild:{
            buildCombox:function ($target,options) {
                var newOptions = $.extend(true,{},Prototypes.Combox,options);
                $target.css("width",newOptions.width);
                var html = '<select class="'+Modal.classs.lily_combox+'" ></select>';
                // $target = $($target);
                $target.html(html);
                $target.find("select").css("width",newOptions.width);
                var $combox = $target.find("select[class='"+Modal.classs.lily_combox+"']");
                return $combox;
            },
            buildItems:function (options) {
                var itemsStr = '';
                $.each(options.data,function (i,v) {
                    // console.warn(v);
                    if(options.value==""){
                        itemsStr +='<option value="'+v+'">'+v+'</option>';
                    }else{
                        itemsStr +='<option value="'+v[options.value]+'">'+v[options.text]+'</option>';
                    }
                });
                return itemsStr;
            }
        },
        ComboxLoad:{
            load:function ($target,options) {
                var $combox = $target.find("select[class='"+Modal.classs.lily_combox+"']");
                if(!options.remote){
                    XLily6XCombox.ComboxLoad.loadData($target,options);
                    return $combox;
                }
                // console.warn(options);
                $.ajax({
                    url:options.url,
                    method:options.method,
                    dataType:options.dataType,
                    data:options.parameters,
                    async:options.async,
                    success:function (result) {
                        // console.warn(result);
                        options.data = result.data;
                        XLily6XCombox.ComboxLoad.loadData($target,options);
                        return $combox;
                    }
                })
            },
            loadData:function ($target,options) {
                var itemsStr = XLily6XCombox.ComboxBuild.buildItems(options);
                var $combox = $target.find("select[class='"+Modal.classs.lily_combox+"']");
                $combox.html(itemsStr);
                $combox.bind(Modal.event.change,function () {
                    console.log( options.data);
                    options.onchange(this,arguments);
                });
                return $combox;
            }
        }
    }

    /**
     * xlily6x table
     * @type {{TableBuild: {buildTable: buildTable, buildThead: buildThead, buildTbody: buildTbody, buildPagination: buildPagination}, TableLoad: {load: load, reload: reload, loadData: loadData, paging: paging}}}
     */

    /* */
    var XLily6XTable = {

        /**
         * 表格构建
         * @type {{buildThead: buildThead, buildTbody: buildTbody}}
         */

        /* */
        TableBuild:{

            /**
             * 构建 table
             * @param $target
             * @param columnsP
             * @param data
             * @returns {*|HTMLElement}
             */

            /* */
            buildTable:function ($target,options) {
                var tableID,html,$table,theadStr,columns,paginationStr;
                $target.css({width:options.width});
                tableID = Auxiliary.getElementID($target)+Modal.suffix.table_id;
                html = '<table  cellpadding="0" cellspacing="0" border="1"  bordercolor="#f2eaf1" id="'+tableID+'" class="'+Modal.classs.lily_table+'">';
                html+='<thead></thead>';
                html+='<tbody></tbody>';
                html+='</table>';
                $target.html(html);
                $table = $("#"+tableID);
                theadStr = XLily6XTable.TableBuild.buildThead($target,options);
                $table.find("thead").html(theadStr);
                console.log("参数 改变");
                console.log(options);
                XLily6XTable.TableLoad.bindSearch($table,$target);

                if(options.paging){
                    XLily6XTable.TableBuild.buildPagination($target,options,$table);
                }
                if(options.freeze>=0){
                    console.log("freeze ");
                    console.log($target.attr("id"));
                    $.freezeCloumn($target.attr("id"),options.freeze)
                }
                return $table;
            },
            /**
             * 添加 thead
             * @param columns
             * @returns {string}
             */

            /* */
            buildThead:function ($target,options) {
                var columns = $.extend(true,{},Prototypes.Table.columns,options.columns);
                var theadStr = '<tr>';
                $.each(columns,function (i,v) {
                    var col = $.extend(true,{},Prototypes.TableColumn,v);
                    var tdStr = '<th name="'+col.name+'" style="width: '+col[Modal.property.width]+';padding: 5px;">'+col[Modal.property.title];
                    if(col.search){
                        options.search = true;
                        tdStr+='<br/><input type="text" name="'+col.name+'" class="'+Modal.classs.lily_table_search+'">';
                    }
                    tdStr+='</th>';
                    theadStr+=tdStr;
                })
                theadStr += '</tr>';
                return theadStr;
            },

            /**
             * 添加 tbody
             * @param columns
             * @param data
             * @returns {string}
             */

            /* */
            buildTbody:function ($target,options) {
                var tbodyStr='';
                $.each(options.data,function (index,row) {
                    options.data[index] = $.extend(true,{},row,{trIndex:index})
                    // tbodyStr += '<tr '+Modal.property.lilySelected+'="false">';
                    tbodyStr += '<tr>';
                    $.each(options.columns,function (i,v) {
                        var col = $.extend(true,{},Prototypes.TableColumn,v);
                        var tdStr='';
                        if(col.isFormat){
                            var t = col.format(row);
                            tdStr = t;
                        }else{
                            tdStr = '<td style="text-align: '+col[Modal.property.align]+'">'+row[col[Modal.property.name]]+'</td>';
                        }
                        tbodyStr+=tdStr;
                    })
                    tbodyStr += '</tr>';
                });
                $target.setOptions(options);
                return tbodyStr;
            },
            buildPagination:function ($target,options,$table) {
                var pagOptions = $.extend(true,{},Prototypes.Pagination,options.pagination);
                console.log(pagOptions);
                var paginationId =Auxiliary.getElementID($target)+Modal.suffix.pagination_id;
                pagOptions.pageSizeList = pagOptions.pageSizeList.concat(pagOptions.pageSize);
                // var width = ($target.outerWidth(true))+"px";
                var width = pagOptions.width+"px";
                var leftStr,rightStr,centerStr;
                leftStr = 'Current page <span><label name="currPageLab">'+pagOptions.currPage+'</label>-- PageCount <label name="pageCountLab">'+pagOptions.pageCount+'</label><input type="hidden" name="currPage" value="'+pagOptions.currPage+'"/><input type="hidden" name="pageCount" value="'+pagOptions.pageCount+'"/></span>';
                // centerStr = 'Previous page -- Next page';
                centerStr = '<span > <a href="javascript:void(0)" >Previous page</a></sapn> -- ';
                centerStr += '<sapn> <a href="javascript:void(0)" >Next page</a> </span>';
                centerStr += '<sapn id="pageSizeListCombox"></span>';
                rightStr = 'View <label name="startRowLab">'+pagOptions.startRow+'</label> - <label name="endRowLab">'+pagOptions.endRow+'</label> of <label name="totalRowLab">'+pagOptions.totalRow+'</label>';
                console.log(rightStr);
                var paginationStr = '<div id="'+paginationId+'" style="width:'+width+';" class="'+Modal.classs.lily_pagination+'">';
                paginationStr += '<table cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;height:100%;" ><tbody><tr>';
                paginationStr += '<td class="'+Modal.classs.left+'">'+leftStr+'</td>';
                paginationStr += '<td class="'+Modal.classs.centers+'">'+centerStr+'</td>';
                paginationStr += '<td class="'+Modal.classs.right+'">'+rightStr+'</td>';
                paginationStr += '</tr></tbody></table>';
                paginationStr += '</div>';
                $target.append(paginationStr);
                var $pagination = $("#"+paginationId);
                var $combox = $pagination.find("#pageSizeListCombox").xLily6X($.widget.Combox,{data:pagOptions.pageSizeList,remote:false,width:"40px",onchange:function (obj,args) {
                    pagOptions.pageSize = $(obj).val();
                    pagOptions.currPage = 0;
                    pagOptions.pageCount = 1;
                    $target.xLily6X($.widget.TableReload,pagOptions);
                }});
                // console.log("初始化每页大小下拉框");
                // console.log(pagOptions.pageSize);
                // console.log(pagOptions.pageSizeList.concat(pagOptions.pageSize));
                $combox.val(pagOptions.pageSize);
                $pagination.find("a").eq(0).bind(Modal.event.click,function(){XLily6XTable.TableLoad.paging($target,$pagination,"previous")});
                $pagination.find("a").eq(1).bind(Modal.event.click,function(){XLily6XTable.TableLoad.paging($target,$pagination,"next")});
                return $pagination;
            }
        },

        /**
         * 表格数据加载
         */

        /* */
        TableLoad:{

            /**
             * 加载表格数据
             * @param $table
             * @param options
             * @returns {*}
             */

            /* */
            load:function ($target,options) {
                // console.log(options);
                var $table = $($target).find("table[class='"+Modal.classs.lily_table+"']");

                if(options.search){
                    var rps = $table.find("thead").find("input");
                    var parms = {};
                    $.each(rps,function (i,v) {
                        var obje = {};
                        var name = $(v).attr(Modal.property.name);
                        var value = $(v).val();
                        obje[name] = value;
                        parms = $.extend(true,{},parms,obje);
                    })
                    options.parameters = $.extend(true,{},options.parameters,parms);
                }

                if(options.paging){
                    options.parameters = $.extend(true,{},options.pagination,options.parameters);
                    // console.log("Load reset currPage ?");
                    // console.log(options.parameters.reSet);
                    options.pagination.pageSize = options.parameters.pageSize;
                    if(options.parameters.reSet){
                        options.parameters.currPage=1;
                        options.pagination.currPage=1;

                    }
                }
                // console.log("之后");
                // console.log(options);
                if(!options.remote){
                    XLily6XTable.TableLoad.loadData($target,options);
                    return $table;
                }
                if(options.url==null||options.url==""){
                    throw "The remote url must be not null ";
                }
                $.ajax({
                    url:options.url,
                    method:options.method,
                    dataType:options.dataType,
                    data:options.parameters,
                    async:options.async,
                    xhrFields: {
                        withCredentials: options.doman
                    },
                    success:function (result) {
                        options.data = result.data;
                        options.totalRow = result.totalRow;
                        console.log(options);
                        XLily6XTable.TableLoad.loadData($target,options);
                        if(options.paging){
                            XLily6XTable.TableLoad.loadPagingData($target,options);
                        }
                        options.parameters.reSet = true;
                        // console.log("表格数据加载完成");
                        // console.log(options);
                        $target.setOptions(options);
                        options.onLoad($target,options);

                    },
                    error:function (result) {
                        console.error(result);
                    }
                });
            },
            reload:function ($target,parameters) {
                var options = $($target).getOptions();
                options.parameters = $.extend(true,{},options.parameters,parameters);
                XLily6XTable.TableLoad.load($target,options);
            },

            /**
             * 加载表格数据
             * @param $table
             * @param options
             */
            loadData:function ($target,options) {
                var $table = $($target).find("table[class='"+Modal.classs.lily_table+"']");
                var tbodyStr = XLily6XTable.TableBuild.buildTbody($target,options);
                $table.find("tbody").html(tbodyStr);
                this.select($target,options);
                $table.xLily6X($.widget.Chameleon);
                this.hideColumn($target);
            },
            select:function ($target,options) {

                var rows = $($target).xLily6X($.widget.TableGetRows);
                rows.attr(Modal.property.lilySelected,0);
                $.each(rows,function (i,v) {
                   $(v).click(function () {
                       console.log($(this).siblings().length);

                       var selected = $(this).attr(Modal.property.lilySelected);
                       if(selected==0){
                           if(!options.multiple){
                               $(this).siblings().css("background-color","").attr(Modal.property.lilySelected,0);
                           }
                           console.log("is not selected");
                           $(this).css("background-color",options.selectedColor);
                           $(this).attr(Modal.property.lilySelected,1);
                       }else{
                           console.log("is selected");
                           $(this).css("background-color","");
                           $(this).removeClass(Modal.classs.lily_row_selected);
                           $(this).attr(Modal.property.lilySelected,0);
                       }

                   });
                });
            },

            /**
             * 隐藏列
             * @param $target
             * @returns {Array|*}
             */
            hideColumn:function ($target) {
                var options = $target.getOptions();
                var $table = $($target).find("table[class='"+Modal.classs.lily_table+"']");
                $.each(options.columns,function (i,v) {
                    if(v.hide){
                        var col = $.extend(true,{},Prototypes.TableColumn,v);
                        // console.log(col);
                        var th = $table.find("th[name='"+col.name+"']");
                        // console.log(th.index());
                        th.hide();
                        var tds = $table.find("tr td:nth-child("+(th.index()+1)+")");
                        tds.hide();
                    }
                });
                return options.columns;
            },
            getSelectedRows:function ($target) {
                var $table = $($target).find("table[class='"+Modal.classs.lily_table+"']");
                var trs = $table.find("tr[lilyselected='1']");
                return trs;
            },
            getSelectedDatas:function ($target) {
                var $table = $($target).find("table[class='"+Modal.classs.lily_table+"']");
                var options = $target.getOptions();
                var trs = $table.find("tr[lilyselected='1']");
                var datas = [];
                $.each(trs,function (i,v) {
                    datas[i] = options.data[$(v).index()];
                });
                return datas;
            },
            bindSearch:function ($table,$target) {
                var inputs = $table.find("thead").find("input");
                // console.log(inputs);
                $.each(inputs,function (i,v) {
                    $(v).xLily6X($.widget.Tips,{text:$(v).val()})
                    .bind(Modal.event.keyup,function () {
                        $(v).xLily6X($.widget.Tips,{text:$(v).val()});
                    })
                        .bind(Modal.event.change,function () {
                            //table reload
                            XLily6XTable.TableLoad.reload($target,{});
                        })
                    
                })
            },

            paging:function ($target,$pagination,doing) {
                var $currPage = $pagination.find("input[name='currPage']");
                var $pageCount = $pagination.find("input[name='pageCount']");
                var $pageSize = $pagination.find("select");
                $pageCount = parseInt($pageCount.val());
                var currPage = $currPage.val();
                currPage = parseInt(currPage);
                if(doing == "next"){
                    currPage=currPage<$pageCount?currPage+1:currPage;
                }else{
                    currPage = currPage>=2?currPage-1:1;
                }
                $currPage.val(currPage);

                var options = $target.getOptions();
                // console.log("分页 options");
                // console.log(options);
                // console.log($target);
                options.pageSize = $pageSize.val();
                options.pagination.pageCount = $pageCount;

                var pagination = $.extend(true,{},options.pagination,{currPage:currPage,pageSize:options.pageSize});
                // options.pagination = $.extend(true,{},options.pagination,pagination);
                var parameters = $.extend(true,{},pagination,{reSet:false}) ;
                // options.parameters = parameters;
                options.pagination = pagination;
                $target.setOptions(options);
                $target.xLily6X($.widget.TableReload,parameters);
            },
            loadPagingData:function ($target,options) {

                var currPage = options.pagination.currPage;
                var starRow = (currPage-1)*options.pagination.pageSize;
                var endRow = currPage*options.pagination.pageSize;
                endRow = endRow>=options.totalRow?options.totalRow:endRow;
                var pageCount =Math.ceil(options.totalRow/options.pagination.pageSize);
                options.pagination = $.extend(options.pagination,{totalRow:options.totalRow,startRow:starRow,endRow:endRow,pageCount:pageCount});

                var pagination = options.pagination;
                var $pagination = $($target).find("div[class='"+Modal.classs.lily_pagination+"']");
                $pagination.find("input[name='pageCount']").val(pagination.pageCount);
                $pagination.find("input[name='currPage']").val(pagination.currPage);
                $pagination.find("label[name='currPageLab']").text(pagination.currPage);
                $pagination.find("label[name='startRowLab']").text(pagination.startRow);
                $pagination.find("label[name='endRowLab']").text(pagination.endRow);
                $pagination.find("label[name='totalRowLab']").text(pagination.totalRow);
                $pagination.find("label[name='pageCountLab']").text(pagination.pageCount);
            }
        }


    }
    /**
     * 辅助类
     * @type {{onLoad: onLoad, autoPositionShows: autoPositionShows, getAccessor: getAccessor, getElementID: getElementID, setPrototype: setPrototype, getPrototype: getPrototype}}
     */
    var Auxiliary = {


        /**
         *
         * @param target
         * @param options
         */
        onLoad:function (target,options) {
            $(target).setOptions(options);
        },
        /**
         * 自动定位显示层
         * @param obj
         * @param location
         * @returns {*|HTMLElement}
         */
        autoPositionShows : function (obj,location) {
            if(window.event){
                oEvent=window.event;
            }
            var $target = $(oEvent.target);
            var $objDiv = $(obj);
            var left = oEvent.clientX;
            var top = oEvent.clientY;
            var oWidth = $(obj).outerWidth(true);
            var oHeight = $(obj).outerHeight(true);
            console.log("tips");
            console.log(oWidth);
            console.log(oHeight);
            switch (location){
                case (Modal.locations[0]):
                    top = top-oHeight;
                    break;
                case (Modal.locations[1]):
                    break;
                case (Modal.locations[2]):
                    left = left-oWidth;
                    top = top-oHeight;
                    break;
                case (Modal.locations[3]):
                    left = left-oWidth;
                    break;
            }

            $objDiv.css({
                top:top,
                left:left
            }).show("normal");
            return $target;
        },

        /**
         * 格式化执行函数
         * @param obj
         * @param expr
         * @returns {*}
         */
        getAccessor : function(obj, expr) {
            var ret,p,prm = [], i;
            if( typeof expr === Modal.type.Function) { return expr(obj); }
            ret = obj[expr];
            if(ret===undefined) {
                try {
                    if ( typeof expr === Modal.type.String ) {
                        prm = expr.split('.');
                        console.log(prm);
                    }
                    i = prm.length;
                    console.log(i);
                    if( i ) {
                        ret = obj;
                        console.log(ret && i--);
                        while (ret && i--) {
                            p = prm.shift();
                            ret = ret[p];
                        }
                    }
                } catch (e) {}
            }
            return ret;
        },
        getElementID:function ($target) {
            return $target.attr(Modal.property.id);
        },
        setPrototype:function ($target,options) {
            var id = $target.attr(Modal.property.lilyOps);
            if(undefined==id){
                var timestamp =  (new Date()).valueOf();
                id = Modal.classs.lily_tips+timestamp;
                id =id+Math.floor((Math.random()*100)+1);
                id =id+Math.floor((Math.random()*100)+1);
            }
            // console.log("set Prototype");
            // console.log(id);
            LilyObject[id]=options;
            // console.log(LilyObject[id]);
            // var objStr = JSON.stringify(options);
            $target.attr(Modal.property.lilyOps,id);
            return id;
        },
        getPrototype:function ($target) {
            var id = $target.attr(Modal.property.lilyOps);
            var obj = LilyObject[id];
            // console.log("get Prototype");
            // console.log(obj);
            return obj;
        }
    }

    /***
     *
     * @param m
     * @returns {*}
     */
    $.fn.xLily6X = function (m) {
        // console.log(typeof mh);
        if(typeof m == Modal.type.String){
            // console.log("args is string :"+m);
            var fn = Auxiliary.getAccessor($.lily,m);
            if (!fn) {
                throw ("xLily6X - No such method: " + m);
            }
            // console.log(arguments);
            var args = $.makeArray(arguments).slice(1);
            // console.log(args);
            return fn.apply(this,args);
        }
        /**
         console.log(eval("$.xlily6x."+mh));
         console.log($.xlily6x);
         eval("$.xlily6x."+mh).apply(this,args);
         console.log($.xlily6x.getAccessor($.xlily6x,mh));
         console.log("object[method]");
         console.log($.xlily6x["sayHi"]);
         */

        return this.each(function () {

        })
    }

    $.fn.setOptions=function (options) {
        return Auxiliary.setPrototype($(this),options);
    }
    $.fn.getOptions=function () {
        return Auxiliary.getPrototype($(this));
    }
    var LilyObject={};


    var HtmlCodeOrnament = {
        Language:{
            html:[
                {type:"label",color:"#3340ff",items:"xmp|pre|link|&gt;|&lt;|h1|h2|h3|h4|h5|script|select|option|title|meta|div|label|input|table|thead|tr|th|tbody|td"},
                {type:"property",color:"#e312ff",items:"lang|charset|rel|type|href|src|value|id"}
            ],
            js:[
                {type:"keyword",color:"#a22222",items:"var|try|while|throw|function|return|if|new|extends|for|void|else|switch|break|continue|default|typeof|continue"},
                {type:"class",color:"#1324cc",items:"this|XLily6XTable"},
                {type:"method",color:"#f46410",items:"find|getOptions|tableGetSelectedRows|tableGetRows|getSelectedRows|log|xLily6X"},
                {type:"property",color:"#890b9a",items:"TableLoad|multiple|console|widget"}
            ],
            java:[
                {type:"keyword",color:"#a22222",items:"try|while|throw|synchronized|short|package|interface|instanceof|implements|float|finally|enum|double|do|default|continue|char|catch|case|byte|boolean|abstract|new|return|if|else|for|public|class|extends|final|long|int|throws|protected|void|static|private|import|switch|break"},
                {type:"method",color:"#f46410",items:"doPost|toString|getParameter|setCharacterEncoding"},
                {type:"class",color:"#1324cc",items:"HttpServletRequest|HttpServletResponse|ServletException|IOException|HttpServlet|Exception|Double|Integer"},
                {type:"comment",color:"#c9c40c",items:"@Override|@Service|@Resource|@AutoWrite|@RequestMapping"}
            ],
            other:{
                annotation:"#099207",
                string:"#f31c24",
                property:"#890b9a",
                variable:"#838f58",
                method:"#cd6737"
            }
        },

        Regular:{
            // 匹配 文档注释
            annotation:/(\/\/.*$)|(\/\*(.|\s)*?\*\/)/g,
            // 匹配单行注释
            singerAn:/\/{2,}.*?(\r|\n)/g,
            // 匹配 字符串 “”
            string:/\"(.*?)\"/g,
            // 匹配单、双引号字符串 单行、多行注释
            an:/("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
            // 匹配属性和变量名称
            // property:/((\r|\n\s])?\w+\s?(?=(\:|\=|\.)))/g,
            property:/((\r|\n\s])?\w+\s?(?=(\:)))/g,
            // 匹配变量名称
            variable:/((\r|\n\s])?\w+\s?(?=(\=|\.)))/g,
            // 匹配value 值 包含 = 或者 :
            value:/(((\:|\=))\s?\w+)/g,
            // 匹配方法名
            method:/\b\w+\s*\(/g
        },

        /**
         * Code 添加高亮样式
         */
        beautifulCode:function (language) {
            HtmlCodeOrnament.Language = $.extend(true,{},HtmlCodeOrnament.Language,language);
            var $pres = $("pre[name='code']");
            $.each($pres,function (i,pre) {
                // console.log("No."+i);
                var $pre = $(pre);
                var preClass = $pre.attr("class");
                var $code = $pre.children("xmp");
                var html = $code.html();
                var newHtml = html;
                console.log(newHtml);
                var language = HtmlCodeOrnament.Language[preClass];
                if(preClass=="html"){
                    newHtml = HtmlCodeOrnament.beautifulCodeHTML(newHtml);
                }else{
                    //非html  处理所有变量
                    // newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.variable,HtmlCodeOrnament.Language.other.variable);
                    //非html  处理所有属性
                    // newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.property,HtmlCodeOrnament.Language.other.property);

                    if(preClass == "js"){
                        newHtml = HtmlCodeOrnament.beautifulCodeJS(newHtml);
                    }else if(preClass=="java"){

                        newHtml = HtmlCodeOrnament.beautifulCodeJAVA(newHtml);

                    }
                    newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.method,HtmlCodeOrnament.Language.other.method);
                }
                newHtml = HtmlCodeOrnament.commonReplace(preClass,newHtml,language);

                $pre.html(newHtml);
                HtmlCodeOrnament.addTitle($pre,preClass);

            });
        },

        /**
         * 通用 关键字 高亮显示
         * @param preClass 语言 简称
         * @param newHtml 要高亮显示的文本内容
         * @returns {*}
         */
        commonReplace:function (preClass,newHtml,language) {
            // 替换 String
            newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.string,HtmlCodeOrnament.Language.other.string);
            if(preClass!="html"){
                // 根据正则替换 注释
                newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.annotation,HtmlCodeOrnament.Language.other.annotation);
                newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.singerAn,HtmlCodeOrnament.Language.other.annotation);
                // console.log("----------------------0");
                // console.log(newHtml);
                // var s = newHtml.match(HtmlCodeOrnament.Regular.property);
                // console.log(s);
                // console.log("----------------------2");
                // newHtml = HtmlCodeOrnament.regexReplace(newHtml,HtmlCodeOrnament.Regular.property,HtmlCodeOrnament.Language.other.property);
            }



            // var language = HtmlCodeOrnament.Language[preClass];
            $.each(language,function (i,v) {
                v = $.extend(true,{},Prototypes.Language,v);
                var ims = v.items;
                var c = v.color;
                var items = ims.split("|");
                // console.log(items);
                $.each(items,function (j,item) {
                    item = $.trim(item);
                    if(item!="color"&&item!="style"){
                        newHtml = HtmlCodeOrnament.keywordReplace(newHtml,item,c);
                    }
                })
            });
            return newHtml;
        },

        /**
         * 根据关键字 高亮替换
         * @param newHtml 要高亮显示的文本内容
         * @param keyword 关键字
         * @param color 颜色
         * @returns {*} 替换后的文本
         */
        keywordReplace:function(newHtml,keyword,color){
            var span = "<span style='color: "+color+";'>"+keyword+"</span>";
            return HtmlCodeOrnament.replaceAll(newHtml,keyword,span);
        },

        /**
         * 根据正则表达式 高亮替换
         * @param newHtml 要高亮显示的文本内容
         * @param regular 正则表达式
         * @param color 颜色
         * @returns {*}
         */
        regexReplace:function (newHtml,regular,color) {
            var rns = newHtml.match(regular);
            if(rns==undefined||rns==null) return newHtml;
            $.each(rns,function (k,d) {
                var span = "<span style='color: "+color+";'>"+d+"</span>";
                newHtml = newHtml.replace(d,span);
            })
            return newHtml;
        },


        /**
         * 记住匹配项
         * @param newHtml
         * @param regular
         * @returns {string}
         */
        rememberMatch:function (newHtml,regular) {
            var rns = newHtml.match(regular);
            if(rns==null||rns==undefined||rns.length<1){
                return "";
            }
            var res = rns.join("|");
            console.log("remember match "+rns.length);
            return  res;
        },

        /**
         * 全局替换 替换所有
         * @param newHtml 要高亮显示的文本内容
         * @param keyword 关键字
         * @param span 替换文本
         * @returns {string|void|XML}
         */
        replaceAll:function (newHtml,keyword,span) {
            return newHtml.replace(new RegExp("\\b"+keyword+"\\b","gm"),span);
        },

        /**
         * JS 代码 高亮处理
         * @param newHtml 要高亮显示的文本内容
         * @returns {*}
         */
        beautifulCodeJS:function (newHtml) {
            return newHtml;
        },
        beautifulCodeJAVA:function (newHtml) {
            return newHtml;
        },

        /**
         * HTML 代码 高亮处理
         * @param newHtml 要高亮显示的文本内容
         * @returns {string|XML|*}
         */
        beautifulCodeHTML:function (newHtml) {
            // console.log(newHtml);
            // console.log("-------------------------");
            // 替换html 标签
            newHtml = newHtml.replace(/</g,"&lt;").replace(/>/g,"&gt;");
            // console.log(newHtml);
            return newHtml;
        },

        generateId:function (id) {
            id==""?"id":id;
            var timestamp =  (new Date()).valueOf();
            id = id+timestamp;
            id =id+Math.floor((Math.random()*100)+1);
            id =id+Math.floor((Math.random()*100)+1);
            return id;
        },

        /**
         * 添加 Title
         * @param $target
         * @param preClass
         */
        addTitle:function ($target,preClass) {
            var label = "<label name='class' style='color: rgba(141, 138, 138, 0.27);position: absolute;'>"+preClass+"</label>";
            var label2 = "<span name='sign' style='color: rgba(141, 138, 138, 0.27);position: absolute;'><a style='text-decoration: none;color: rgba(141, 138, 138, 0.27);' href='"+Modal.version.url+"'>"+Modal.version.url+"</a></span>";
            $target.append(label);
            $target.append(label2);
            var $label = $target.find("label[name='class']");
            var $label2 = $target.find("span[name='sign']");
            var x = $label.position().top;
            var y = $label.position().left;
            var wid = $target.outerWidth(true);
            var hei = $target.outerHeight(true);
            // console.log(x+":"+y);
            $label.css({
                position: "absolute",
                top:10,
                left:680
            })

            var x2 = $label2.position().top;
            var y2 = $label2.position().left;
            // console.log(x2+":"+y2);
            $label2.css({
                position: "absolute",
                // top:hei-15,
                left:540
            })
        }
    }

})(jQuery);

