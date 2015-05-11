(function(){

    var styles =    '#crafty-debug ul.menu li.entities img{padding: 6px 8px 8px 0px;}\n'+
                    '#crafty-debug #entities-box{position: fixed;left: 110px;bottom: 35px;height: 200px;border: 1px solid #2F2F2F;display: none;background-color: white;border-bottom: 0px;padding-right: 10px;}\n'+
                    '#crafty-debug #entities-box .list{height: 145px;width: 150px; float:left}\n'+
                    '#crafty-debug #entities-box .list ul{height: 130px;width: 145px;overflow-y: scroll;padding-left: 5px;list-style-type: none;padding-right: 10px;font-size: 11px;margin-top: 0px;padding-top: 5px;}\n'+
                    '#crafty-debug #entities-box .list ul li a{padding: 3px 0px 3px 0px;border-bottom: 1px dashed #BBB;color: #2F2F2F; display:block; text-decoration: none}\n'+
                    '#crafty-debug #entities-box .list input.search{padding: 3px;width: 115px;margin: 5px auto 0px auto;font-size: 11px;display: block; border: 1px solid #BBB;}\n'+
                    '#crafty-debug #entities-box .properties{height: 190px;width: 130px;float: left;margin-left: 10px;color: #282828;}\n'+
                    '#crafty-debug #entities-box .properties .content{padding-left: 10px;}\n'+
                    '#crafty-debug #entities-box .components{height: 190px;width: 130px;float: left;margin-left: 10px;color: #282828;}\n'+
                    '#crafty-debug #entities-box .components .content{padding-left: 10px;}\n'+
                    '#crafty-debug #entities-box .options{height: 190px;width: 130px;float: left;margin-left: 10px;color: #282828;}\n'+
                    '#crafty-debug #entities-box .options .content{padding-left: 10px; padding-top: 30px;}\n'+
                    '#crafty-debug #entities-box .properties .single label {display: block;width: 45px;float: left;padding-top: 6px;text-align: right;margin-right: 15px;font-weight:bold;}\n'+
                    '#crafty-debug #entities-box .properties .single input{float:left; width: 50px; font-size: 11px;}\n'+
                    '#crafty-debug #entities-box .components{height: 145px;width: 160px; float:left}\n'+
                    '#crafty-debug #entities-box .components ul{height: 130px;width: 145px;overflow-y: scroll;padding-left: 5px;list-style-type: none;padding-right: 10px;font-size: 11px;margin-top: 0px;padding-top: 5px;}\n'+
                    '#crafty-debug #entities-box .components ul li{border-bottom: 1px dashed #BBB;}\n'+
                    '#crafty-debug #entities-box .components ul li a{float:left; padding: 3px 0px 3px 0px;color: #2F2F2F; display:block; text-decoration: none}\n'+
                    '#crafty-debug #entities-box .components ul li a.remove {float:right; color: #b60d0d}\n'+
                    '#crafty-debug #entities-box .components input.search{float:left;padding: 3px;width: 115px;margin: 5px auto 0px auto;font-size: 11px;display: block; border: 1px solid #BBB;}\n'+
                    '#crafty-debug #entities-box .components .addComponent {padding: 8px 0px 8px 4px;float: left;cursor: pointer; margin-right:5px;}\n'
                   ;
    var entitiesBox =   '<div id="entities-box" class="panel-box">'+
                            '<div class="content">'+
                                '<div class="list">'+
                                    '<div class="header">ENTITIES<div class="separator"></div></div>'+
                                    '<ul id="entities-box-list"></ul>'+
                                    '<input id="entities-search" type="text" placeholder="serach entity" class="search" />'+
                                '</div>'+
                                '<div class="properties">'+
                                    '<div class="header">PROPERTIES<div class="separator"></div></div>'+
                                    '<div class="content"></div>'+
                                '</div>'+
                                '<div class="components">'+
                                    '<div class="header">COMPONENTS<div class="separator"></div></div>'+
                                    '<div class="content" style="display:none">'+
                                        '<ul id="components-box-list"></ul>'+
                                        '<input id="components-search" type="text" placeholder="add component" class="search" /><img data-entity-id="" class="addComponent" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlFRkFEQzc0QTM0MzExRTE5N0NBRjM2REEwOTczRjkzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlFRkFEQzc1QTM0MzExRTE5N0NBRjM2REEwOTczRjkzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUVGQURDNzJBMzQzMTFFMTk3Q0FGMzZEQTA5NzNGOTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUVGQURDNzNBMzQzMTFFMTk3Q0FGMzZEQTA5NzNGOTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz617/6bAAAA3klEQVR42pySMQ6CQBBFh41HUA5gBZWFRg0HUdRwOgqjrYdAEi2sqLDUBPUCFugfM2s2BsLKTx7JZv+fHXbH8TyPDCkwBwswBT1wA3uwBhtQarNjhPtgC4ZUryOYgbM+SQeThiDJfiL+T1hJOy7ZyRW/4mAIRlWuLMvqCrA/5HBE7RSpulMtNODbflm2Sr7vm8tnB5876FYZuNBPwNSD2z60bPvE4bhlOOZ/5gLpnxfH3U6UzCq/dWEZLMRf6vHMQSCzSw2zHYj/O9u6wBgswQ5c+DnAVdYr2c914C3AANvWMQe07pynAAAAAElFTkSuQmCC" />'+
                                    '</div>'+                                            
                                '</div>'+
                                '<div class="options">'+
                                    '<div class="header">OPTIONS<div class="separator"></div></div>'+
                                    '<div class="content"></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';

    /*********** Utils ***********/

    Crafty.debugBar.utils['listEntities'] = function (filter) {
        if(filter == '') {
            filter = '*';
        }

        var entities = [],
            e,
            isNumber = function(filter){return !isNaN(parseFloat(filter)) && isFinite(filter)};

        isID = isNumber(filter);

        // Save ids of single or many components.
        if (isID) {
            e = Crafty(parseInt(filter));
            entities.push({ id: e[0], e: e });
        } else if (filter !== '*') {
            var ids = Crafty(filter), count = 0;
            for (i in ids) {
                if (count++ < 50) {
                    if (!isNumber(i)) {
                        continue;
                    };
                    e = Crafty(ids[i]);
                    entities.push({ id: e[0], e: e });
                }
            }
        } else if (filter == '*') {
            var es = Crafty('*'), count = 0;
            for (en in es) {
                if (es.hasOwnProperty(en) && typeof es[en] == "object") { 
                    e = es[en];
                    if (count++ < 50) {
                        entities.push({ id: e[0], e: e });
                    }
                }
            };
        }

        return entities;
    };

    Crafty.debugBar.utils['addEntityComponent'] = function(el) {
        var component = $('#crafty-debug #entities-box .components input.search').val(),
        entity = $(el).data('entityId');

        Crafty(entity).addComponent(component);
        component = $('#crafty-debug #entities-box .components input.search').val('');
        Crafty.debugBar.renders.renderEntityComponents(Crafty(entity));
    };

    Crafty.debugBar.utils['elementToTypedValue'] = function (element) {
        if (element.data('type') == "number") {
            return parseFloat(element.val());
        } else {
            return element.val();
        }
    };

    /*********** Renders ***********/

    Crafty.debugBar.renders['renderEntityDetails'] = function(entity) {
        Crafty.debugBar.renders.renderEntityAttributes(entity);
        Crafty.debugBar.renders.renderEntityComponents(entity);
        Crafty.debugBar.renders.renderEntityOptions(entity);
    };

    Crafty.debugBar.renders['renderEntitesList'] = function(listEntities) {
        var elements = [];

        if (listEntities.length == 0){
            return '<h4>No results</h4>';
        }

        for (i in listEntities) {
            elements.push('<li><a href="#" data-ent="'+listEntities[i].id+'">'+listEntities[i].e._entityName+'</a></li>');
        }
        return elements.join('');
    };

    Crafty.debugBar.renders['renderEntityAttributes'] = function(entity) {
         var template = '<div class="attributes" data-ent="'+entity[0]+'">'+
                            '<div class="single"><label>x</label><input data-type="'+typeof(entity['x'])+'" type="text" name="x" value="'+entity.attr('x')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>y</label><input data-type="'+typeof(entity['y'])+'" type="text" name="y" value="'+entity.attr('y')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>w</label><input data-type="'+typeof(entity['w'])+'" type="text" name="w" value="'+entity.attr('w')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>h</label><input data-type="'+typeof(entity['h'])+'" type="text" name="h" value="'+entity.attr('h')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>z</label><input data-type="'+typeof(entity['z'])+'" type="text" name="z" value="'+entity.attr('z')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>rotation</label><input data-type="'+typeof(entity['rotation'])+'"  type="text" name="rotation" value="'+entity.attr('rotation')+'" /><div class="clear"></div></div>'+
                            '<div class="single"><label>alpha</label><input data-type="'+typeof(entity['alpha'])+'"  type="text" name="alpha" value="'+entity.attr('alpha')+'" /><div class="clear"></div></div>'+
                        '</div>';

        $('#crafty-debug #entities-box .properties .content').html(template).show();
    };

    Crafty.debugBar.renders['renderEntityComponents'] = function(entity) {
        var components = [];
        //var avaiableComponents = Crafty.components();
        var entityComponents = entity.__c;

        for (i in entityComponents) {
            components.push('<li><a href="#" data-comp="'+i+'">'+i+'</a><a href="#" data-entity-id="'+entity[0]+'" data-comp="'+i+'" class="remove">x</a><div class="clear"></div></li>');
        }

        $('#entities-box .content .components .addComponent').data('entityId', entity[0]);
        $('#entities-box .content .components .content').show();
        $('#entities-box .content .components .content #components-box-list').html(components.join(''));
    };

    Crafty.debugBar.renders['renderEntityOptions'] = function(entity){
        var template = '<div class="attributes" data-ent="'+entity[0]+'">'+
                            '<div class="btn btn-black draggable '+(entity.__c.draggable ? 'off' : '') +'">draggable '+(entity.__c.draggable ? 'off' : 'on')+'</div>'+
                            '<div class="btn btn-black visible '+ (entity.visible ? '' : 'off')+'">'+ (entity.visible ? 'hide' : 'show')+'</div>'+
                            '<div class="btn btn-black console">print to console</div>'+
                            '<div class="btn btn-black hitBox '+(entity.__c.WiredHitBox ? 'off' : '') +'">WiredHitBox '+(entity.__c.WiredHitBox ? 'off' : 'on') +'</div>'+
                            '<div class="btn btn-red remove">remove</div>'+
                        '</div>';

        $('#crafty-debug #entities-box .options .content').html(template).show();
    };

    /*********** Events ***********/

    $('#entities-search').live('keyup',function(){
        $('#entities-box-list').html(Crafty.debugBar.renders.renderEntitesList(Crafty.debugBar.utils.listEntities($(this).val())));
    });

    $('#crafty-debug ul.menu li.entities').live('click',function(){
        if ($('#entities-box').is(':visible')) {
            $('#entities-box').hide();
            $('#entities-box .options .content').hide();
        } else {
            $('.panel-box').hide();
            $('#entities-box').show();
            $('#entities-box-list').html(Crafty.debugBar.renders.renderEntitesList(Crafty.debugBar.utils.listEntities('*')));
            $('#entities-box .options .content').show();
        }
    });

    $('#crafty-debug #entities-box .list ul li a').live('click', function(){
        Crafty.debugBar.renders.renderEntityDetails(Crafty($(this).data('ent')));
    });

    $('#crafty-debug #entities-box .components ul li a.remove').live('click', function(){
        var component = $(this).data('comp'),
            entity = $(this).data('entityId');
        Crafty(entity).removeComponent(component, false);
        Crafty.debugBar.renders.renderEntityComponents(Crafty(entity));
    });

    /* Components mangement */
    $('#crafty-debug #entities-box .components .addComponent').live('click', function(){
        Crafty.debugBar.utils.addEntityComponent(this);
    });

    $('#crafty-debug #entities-box .components input.search').live('keypress', function(event) {
        if ( event.which == 13 ) {
            event.preventDefault();
            Crafty.debugBar.utils.addEntityComponent($('#crafty-debug #entities-box .components .addComponent'));
        }        
    });

    /* Attributes mangement */
    $('#crafty-debug #entities-box .properties .content input').live('keyup', function(){
        var attr = $(this).attr('name'),
            entity = $(this).parent().parent();
        
        Crafty(entity.data('ent')).attr(attr, Crafty.debugBar.utils.elementToTypedValue($(this)));
    });

    /* Options mangement */
    $('#crafty-debug #entities-box .options .visible').live('click', function(){
        var id = $(this).parent().data('ent'),
            entity = Crafty(id),
            btn = $(this);

        if (btn.hasClass('off')){
            entity.visible = true;
            btn.removeClass('off');
            btn.html('hide');
        } else {
            entity.visible = false;
            btn.addClass('off');
            btn.html('show');
        } 
    });

    $('#crafty-debug #entities-box .options .draggable').live('click', function(){
        var id = $(this).parent().data('ent'),
            entity = Crafty(id),
            btn = $(this);

        if (btn.hasClass('off')){
            entity.removeComponent('Draggable', false);
            btn.removeClass('off');
            btn.html('draggable on');
            entity.unbind('Dragging');
        } else {
            entity.addComponent('Draggable');
            btn.addClass('off');
            btn.html('draggable off');

            entity.bind('Dragging', function(e) {
                Crafty.debugBar.renders.renderEntityAttributes(entity);
            })
        }

        Crafty.debugBar.renders.renderEntityComponents(entity);
    });

    $('#crafty-debug #entities-box .options .hitBox').live('click', function(){
        var id = $(this).parent().data('ent'),
            entity = Crafty(id),
            btn = $(this);

        if (btn.hasClass('off')){
            entity.removeComponent('WiredHitBox', false);
            btn.removeClass('off');
            btn.html('WiredHitBox on');
        } else {
            entity.addComponent('WiredHitBox');
            btn.addClass('off');
            btn.html('WiredHitBox off');
        }

        Crafty.debugBar.renders.renderEntityComponents(entity);
    });

    $('#crafty-debug #entities-box .options .console').live('click', function(){
        var entity = $(this).parent().data('ent');
        console.log(Crafty(entity));
    });

    $('#crafty-debug #entities-box .options .remove').live('click', function(){
        var entity = $(this).parent().data('ent');
        Crafty(entity).destroy();

        $('#entities-box-list').html(Crafty.debugBar.renders.renderEntitesList(Crafty.debugBar.utils.listEntities('*')));
        $('#crafty-debug #entities-box .properties .content').hide();
        $('#crafty-debug #entities-box .options .content').hide();
        $('#crafty-debug #entities-box .components .content').hide();
    });

    /*********** Register Panel ***********/

    Crafty.debugBar.registerPanel({
        'name' : 'Entities',
        'image' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExNDg1QjFGQTM0MzExRTFBOThEQ0REMTE2NzczM0ZEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjExNDg1QjIwQTM0MzExRTFBOThEQ0REMTE2NzczM0ZEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTE0ODVCMURBMzQzMTFFMUE5OERDREQxMTY3NzMzRkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTE0ODVCMUVBMzQzMTFFMUE5OERDREQxMTY3NzMzRkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EMWR+AAAAJUlEQVR42mL8DwQM2AEjlMYqzziqEb9GBnIARRpHo4PaGgECDADKe0HZMzUEpQAAAABJRU5ErkJggg==', //or false if don't exist
        'description' : 'Game entities',
        'styles': styles,
        'panelBox' : entitiesBox,
    });

})();