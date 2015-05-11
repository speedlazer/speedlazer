(function(){

    var styles =    '#crafty-debug #assets-box{position: fixed;left: 110px;bottom: 35px;height: 200px;border: 1px solid #2F2F2F;display: none;background-color: white;border-bottom: 0px;padding-right: 10px;}\n'+
                    '#crafty-debug #assets-box .list{height: 165px;width: 200px; float:left}\n'+
                    '#crafty-debug #assets-box .list ul{color: #2F2F2F; height: 150px;width: 195px;overflow-y: scroll;padding-left: 5px;list-style-type: none;padding-right: 10px;font-size: 11px;margin-top: 0px;padding-top: 5px;}\n'+
                    '#crafty-debug #assets-box .list ul li a{padding: 3px 0px 3px 0px;border-bottom: 1px dashed #BBB;color: #2F2F2F; display:block; text-decoration: none}\n'
                    ;
    var assetsBox =   '<div id="assets-box" class="panel-box">'+
                            '<div class="content">'+
                                '<div class="list">'+
                                    '<div class="header">ASSETS<div class="separator"></div></div>'+
                                    '<ul id="assets-box-list"></ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>';

    /*********** Renders ***********/

    Crafty.debugBar.renders['renderAssetsList'] = function(e) {
        $('#crafty-debug #assets-box .list ul#assets-box-list').append('<li>'+e.key+'</li>');
    };

    /*********** Events ***********/

    $('#crafty-debug ul.menu li.assets').live('click',function(){
        if ($('#assets-box').is(':visible')) {
            $('#assets-box').hide();
        } else {
            $('.panel-box').hide();
            $('#assets-box').show();
        }
    });

    Crafty.bind('NewAsset', function(e){
        Crafty.debugBar.renders['renderAssetsList'](e);
    });
    
    /*********** Register Panel ***********/

    Crafty.debugBar.registerPanel({
        'name' : 'Assets',
        'description' : 'Game assets',
        'styles': styles,
        'panelBox' : assetsBox,
    });

})();