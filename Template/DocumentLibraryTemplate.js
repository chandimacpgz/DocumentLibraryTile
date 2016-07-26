(function (tileDataContext, $, undefined) {
    (function (templates) {
        (function (template) {

            template.PreContainerProcess = function (options) {

                var deferred = $.Deferred();
                var defaults = {
                    html: undefined,
                    TileTitle: undefined
                };

                var settings = $.extend({}, defaults, options);
                var element = $(settings.html);
                $('.tbc-title', element).html(settings.TileTitle);
                deferred.resolve();

                return deferred;
            };

            template.PostContainerProcess = function (options) {

                var deferred = $.Deferred();
                
                var defaults = {
                    animatedTile: undefined,
                    tileContainer: undefined
                };

                var settings = $.extend({}, defaults, options);

                // $('.prevslide', settings.tileContainer).click(function () {
                //     $(settings.animatedTile).liveTile("goto", "prev");

                // });
                // $('.nextslide', settings.tileContainer).click(function () {
                //     $(settings.animatedTile).liveTile("goto", "next");
                // });
                deferred.resolve();

                return deferred;
            };

            template.GetData = function (options) {
                /// <summary>
                /// Implement custom data access function. To this method to be invoked, customDataAccess property 
                /// must set to true in template
                /// </summary>
                /// <param name="options" type="type">
                /// { fields: undefined, parameter: undefined, data: undefined }
                /// 
                /// fields: Fields expected by engine
                /// parameter: Applies only when requeted by inner field. This container field name.
                /// data: Applies only when final data access. Contains user input for all fields.
                /// </param>
                /// <returns type=""></returns>
                var deferred = $.Deferred();


                var defaults = { fields: undefined, parameter: undefined, data: undefined, cacheInfo: undefined, listName: undefined, cell: undefined };
                var settings = $.extend({}, defaults, options);

//                var cacheDefaults = {
//                    saveInCache: false, faceIndex: undefined, tileId: undefined, loadFromCache: false
//                }
//                var cacheSettings = $.extend({}, cacheDefaults, settings.cacheInfo);
                
                if(settings.cell.sizeX==1 && settings.cell.sizeY==1){ //Small Tile
                    $.ajax({
                        type: "GET",
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('"+settings.listName+"')/ItemCount",
                        contentType: "jsonp"
                    }).done(function (data) {              
                        deferred.resolve([{itemCount:data.childNodes[0].innerHTML}]);
                    }).fail(deferred.reject);
                }

                if(settings.cell.sizeX==2 && settings.cell.sizeY==1){ //Large Tile
                    $.ajax({
                    type: "GET",
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('"+settings.listName+"')/Items",
                    beforeSend: function (request)
                    {
                        request.setRequestHeader("Accept", "application/json;odata=verbose");
                    }
                    }).done(function (data) { 
                        var titleArray = [];
                        $.each(data.d.results,function(i,item){
                            titleArray.push({title:item.Title});
                        });
                        deferred.resolve(titleArray);
                    }).fail(deferred.reject);
                }

                if(settings.cell.sizeX==2 && settings.cell.sizeY==2) {   //ExtraLarge Tile

                    $.ajax({
                    type: "GET",
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('"+settings.listName+"')/Items",
                    beforeSend: function (request)
                    {
                        request.setRequestHeader("Accept", "application/json;odata=verbose");
                    }
                    }).done(function (data) { 
                        deferred.resolve([{listData: data.d.results}]);
                    }).fail(deferred.reject);
                }
                
                return deferred;
            }

            template.PostDataProcess = function (html, options, containerInfo, currentTemplate) {
                var deferred = $.Deferred();

                var defaults = {
                    Direction: undefined,
                    Delay: undefined, Bounce: undefined, AnimationDirection: undefined, Speed: undefined , itemCount:undefined, listData: undefined, title: undefined
                };
                var settings = $.extend({}, defaults, options);

                var element = $(html);

                $(element).css('background-color', '#0072c6');
                switch(containerInfo.Mode) {
                    case "Small":
                        $(".doc-lib-count" , element).html("<div class='doc-lib-sub-count'>"+settings.itemCount+"</div>");
                        $(".doc-lib-files" , element).html("<div class='doc-lib-sub-files'>files</div>");
                        $(".doc-lib-title",element).html("<div class='TileTitle'>Document Library</div>");
                        $(".doc-lib-list",element).css('height', '0%'); 
                        break;

                    case "Large":
                        $(".doc-lib-list-item" , element).html("<div>"+settings.title+"</div>");
                        $(".doc-lib-title",element).html("<div class='TileTitle'>Document Library</div>");
                        $(".doc-lib-list",element).css('height', '50%'); 
                        
                        break;
                    case "ExtraLarge":
                        var listItem = "<b><div class='doc-lib-list-title'>Title</div></b></br>";
                        for(var i=0;i<settings.listData.length;i++){
                            listItem = listItem + "<div>"+settings.listData[i].Title+"</div></br>"
                            
                        }
                        $(".doc-lib-list",element).html(listItem); 
                        $(".doc-lib-title",element).html("<div class='TileTitle'>Document Library</div>"); 
                        $(".doc-lib-list",element).css('height', '85%');  
                        break;
                    // case "Universal":
                    //     code block
                    //     break;
                    default:    
                        $(".pdf-body" , element).html("<img class='TileImage' src='pdfIcon.png'>");
                        $(".pdf-title",element).html("<div class='TileTitle'>PDF Reader </div>")
                }

                deferred.resolve(element);
                return deferred;
            };

            template.PostCssProcess = function (html, options, containerInfo, currentTemplate) {
                var deferred = $.Deferred();
                var defaults = { FeedUrl: undefined };
                var settings = $.extend({}, defaults, options);
                var element = $(html);
                deferred.resolve(element);
                return deferred;
            };

        }(templates.DocumentLibraryTemplate = templates.DocumentLibraryTemplate || {}));
    }(tileDataContext.Templates = tileDataContext.Templates || {}));
}(window.TileDataContext = window.TileDataContext || {}, jQuery));