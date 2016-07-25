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
                var x = SP.ClientContext.get_current().get_web().get_url();

                
                if(settings.cell.sizeX==1 && settings.cell.sizeY==1){ //Small Tile
                    $.ajax({
                        type: "GET",
                        url: x.slice(0, x.lastIndexOf("/")) + "/_api/lists/getbytitle('"+settings.listName+"')/ItemCount",
                        contentType: "jsonp"
                    }).done(function (data) {              
                        deferred.resolve([{itemCount:data.childNodes[0].innerHTML}]);
                    }).fail(deferred.reject);
                }

                if(settings.cell.sizeX==2 && settings.cell.sizeY==1){ //Large Tile
                    
                }

                else {   //ExtraLarge Tile

                    var context = SP.ClientContext.get_current();

                    var oList = context.get_web().get_lists().getByTitle(settings.listName);
                    var collListItem = oList.getItems();

                    context.load(collListItem);

                    context.executeQueryAsync(getAllItems, fail);

                    function getAllItems() {
                        var tasksEntries = [];

                            var itemsCount = collListItem.get_count();
                            for (var i = 0; i < itemsCount; i++) {
                                var item = collListItem.itemAt(i);
                                var taskEntry = item.get_fieldValues();
                                tasksEntries.push(taskEntry);
                            }
                        deferred.resolve([tasksEntries]);

                    }

                    function fail(sender, args) {
                        deferred.reject(args.get_message() + '\n' + args.get_stackTrace());
                    }
                }
                
                return deferred;
            }

            template.PostDataProcess = function (html, options, containerInfo, currentTemplate) {
                var deferred = $.Deferred();

                var defaults = {
                    Direction: undefined,
                    Delay: undefined, Bounce: undefined, AnimationDirection: undefined, Speed: undefined , DocName:undefined, itemCount:undefined
                };
                var settings = $.extend({}, defaults, options);

                var element = $(html);

                $(element).css('background-color', '#0072c6');
                switch(containerInfo.Mode) {
                    case "Small":
                        $(".doc-lib-count" , element).html("<div class='doc-lib-sub-count'>"+settings.itemCount+"</div>");
                        $(".doc-lib-files" , element).html("<div class='doc-lib-sub-files'>files</div>");
                        $(".doc-lib-title",element).html("<div class='TileTitle'>Document Library</div>");
                        break;

                    case "Large":
                        $(".pdf-preview" , element).html("<img class='preview-icon' src='"+currentTemplate.dataLocation+"/previewIcon.png'>");
                        $(".pdf-docname" , element).html("<a href="+settings.DocUrl+" data-toggle='tooltip' title='"+settings.DocName+"' class='TileLargeContainer'>"+settings.DocName+"</a>");
                        $(".pdf-title",element).html("<div class='TileTitle'>Document Library</div>");
                        $(".pdf-docdesc" , element).html("<div>"+settings.DocDescription+"</div>");
                        $(".pdf-pop-up" , element).html("<iframe height='"+settings.Height+"px' width='"+settings.Width+"px' src="+settings.DocUrl+"></iframe>");
                        $('.pdf-docname').addClass('col-md-10');
                        $('.pdf-preview').addClass('col-md-2');
                        $(".pdf-preview" , element).mouseenter(function(){
                            if (!frameLoaded) {
                                frameLoaded= true;
                                
                                $('.pdf-pop-up').bPopup({
                                    follow: [false, false], //x, y
                                    position: [element.offset().left+element.width()+20, element.offset().top] //x, y
                                });
                            }
                        });

                        $(".pdf-preview" , element).mouseleave(function(){
                            // $('#element_to_pop_up').bPopup().close();
                            frameLoaded= false;
                        });
                        $(".pdf-block",element).css('height', '40%');
                        break;
                    case "ExtraLarge":
                        $(".pdf-docname" , element).html("<a href="+settings.DocUrl+" data-toggle='tooltip' title='"+settings.DocName+"' class='TileLargeContainer'>"+settings.DocName+"</a>");
                        $(".pdf-title",element).html("<div class='TileTitle'>PDF Reader </div>");
                        $(".pdf-docdesc" , element).html("<div>"+settings.DocDescription+"</div>");
                        $(".pdf-document" , element).html("<iframe src="+settings.DocUrl+"></iframe>");
                        $(".pdf-block",element).css('height', '15%');
                        $(".pdf-document",element).css('height', '55%'); 
                        $('.pdf-docname').addClass('col-md-8');
                        $('.pdf-preview').addClass('col-md-4');   
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