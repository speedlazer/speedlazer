Crafty.extend({
    /**@
    * #Crafty.debug
    * @category Utilities
    */
    debugBar : {
        panels : {},
        template : {
            panels : [],
            styles : [],
            panelBoxes : []
        },
        utils : {},
        renders : {},

        init : function(){
            Crafty.debugBar.template.panels.push('<li class="bar-item version" data-item="version"><a title="Crafty documentation" href="http://craftyjs.com/api/Crafty.html" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFEMTlFMzlDQTM0MzExRTFBMjYzQkZERjA2QjRDOTY5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFEMTlFMzlEQTM0MzExRTFBMjYzQkZERjA2QjRDOTY5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUQxOUUzOUFBMzQzMTFFMUEyNjNCRkRGMDZCNEM5NjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUQxOUUzOUJBMzQzMTFFMUEyNjNCRkRGMDZCNEM5NjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5XyGHNAAAEs0lEQVR42oyUXUwcVRTH/zNzZ2Z3YJfdLUvBBflKP6CF1hhCQ6smWltKE5tYjBpjSWx9IBq1L60PSmKiSZsYX0zkIw1J34wN+qBt+mBqoEl50IZYHhQIhihSFsSF/ZqdrzueGQoWRNKb3Mzm7J3fOed//nOFmb4Xse0SXEBk4EYeggBwSHAdvo+FSk8rsnsydOD0VRar/WLza2x7qEAQG04+A3XnnnaXO46YmX0rsvfQKa2sGqy0Big/cnmrV9l2UDu/DKW8sSOosNe14uAroqohoFRACoeoiywsg/+cG/vma1Gk4yJ7NDC3LIhy4Gw0Hr5SFCuFwA2CEUFS4Oo5IhVg2/N1anxvjaSFZwQIm8CivKlQAdw24FjGk/HdjVeKy3cCtuUfdV3S2zIpAcHTf0DZ9dSElGie21IK11jeEPA1lSOI1u/7oaQyQSALrm370qxmpqrNFUAtgRBKjFHE3BqcW9gQsA0TSqhwNVz5PAlpOLDSkiBrlNB5AE1TsjzE5u4Uwo9/+H9Sir4UD7YjBKBo2pc79B/POPfvzSDWmEPFIVhcLcDRAT1J4tsQ9r+ZQUl9K72fXAMtLCygr68Pw8PDD8BwPQHAXU9+fj6m/v1yUHWpfd3OpVZSy99/CiM5PculsIWS3RAOvnMX0T376KWpNWhPTw/a2trQ3d2NfoKvu8JHu0JjVF3+LMh0OGI53NnbNdbEDVdeoaKSI9XS0Y9l7D93lo4OPtzyiRMncPPmTdTV1aF0xw48lkisVQw4nEFj+rdhJQPHlcAFCRLXWTCflOXSCIraL8vJxKsfLKYy61DTMNB+/LgPPdDcjHA4DM75v8PjrggmOu+WqOk6wa9eokwmnMU5qAdPwjzap4+tlJ7/5L1z/aMjt9DS0oJ4PI7JyUmMjo6ioaGB/GxDYmwjmCSQi5XsJVUyYLsKBLsA/tc85CNvQzr2+T0a60tzI99NWnoGuq5jhIaTWlmBqihIUNu5XE4o6LpQVFTEFYqtg2XRfk1j+cBqpQWYyXloHR9BOtwzRP93UmYUFRcjGAyCUVWxWAy19fV+dd7OE7irqwvZbBY3rl+HJEm+21lANjoVySJtyRWpeUjPXkT+cM/99PxiZ0hTEQqF/AqymQxkWcZX166hsrISjudrWoVCgVdVVWFwcBC3R0aYy7lgWZbDyPhP+MZf+h2s6QXguUvjE7/81mFnlxCJRKBpml8FAfwBNdOgtlqej6PRqOMVkslkXJbOCWWCaSEqM0jPXPqJzrQ01JRDDdT6d4N3d1RXVyOby2Fubs7TFKQnTNP0pRFFcdVe9KQhuutfXj5vZ9OUTWnuBGINb3gKBYKaD/QOe0+LIH/OzuLCxYt+B77dKNbb24upqan1y2tNHu830+TCsLjknEJt+12KjW/VZihcgv6BAXR0dKzHAoGA75KhoSG0trb6nXiuWOtSrDkz8L4WV5CfGqWUdJOZ2Y3bSKOsLL4B6t/X5AhvBh7ozp07vluamppg0IfjOUhUdh37teLC+HlW87SnQrE/yM2bW//pgoAiDSnoDdWTzANWkjtkqtrrQvAv79VV5rmKdh6PsKhiZXp6OkJaLzw8QE+GVCqFfwQYAK4TC6lGfHlJAAAAAElFTkSuQmCC" /><div class="text">Crafty '+Crafty.getVersion()+'</div><div class="clear"></div></a></li><div class="separator"></div>'+
                                                                '<li class="bar-item graph" data-item="graph"><a href="#"><img style="padding: 6px 8px 8px 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVERDBEQjZEQTM0MjExRTE5Qzg5RkMzOTVDNzIyOEVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVERDBEQjZFQTM0MjExRTE5Qzg5RkMzOTVDNzIyOEVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUREMERCNkJBMzQyMTFFMTlDODlGQzM5NUM3MjI4RUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUREMERCNkNBMzQyMTFFMTlDODlGQzM5NUM3MjI4RUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ftyAMAAAAM0lEQVR42mL8//8/AxaALsjIQARgYqAiGCGGsZAb2NgianB7kywvYQuO0XQ2ahgOABBgAAU5ByC5p5YEAAAAAElFTkSuQmCC" /><div class="text">Graph</div><div class="clear"></div></a></li><div class="separator"></div>');
                                                                //    '<div class="frames">'+
                                                                //        '<li class="bar-item play" data-item="play"><a href="#"><img style="padding: 6px 8px 8px 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3REEyMDVDQTM0MjExRTFBNTBEODZDQTk1NDJCQkFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3REEyMDVEQTM0MjExRTFBNTBEODZDQTk1NDJCQkFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjdEQTIwNUFBMzQyMTFFMUE1MEQ4NkNBOTU0MkJCQUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjdEQTIwNUJBMzQyMTFFMUE1MEQ4NkNBOTU0MkJCQUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7poMa/AAAAHUlEQVR42mL8DwQMqIARSqOIM44qHFVIe4UAAQYAUI5P0QnNe/0AAAAASUVORK5CYII=" /><div class="text">Play</div><div class="clear"></div></a></li>'+
                                                                //        '<li class="bar-item pause" data-item="pause"><a href="#"><img style="padding: 6px 8px 8px 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3REEyMDVDQTM0MjExRTFBNTBEODZDQTk1NDJCQkFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3REEyMDVEQTM0MjExRTFBNTBEODZDQTk1NDJCQkFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjdEQTIwNUFBMzQyMTFFMUE1MEQ4NkNBOTU0MkJCQUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjdEQTIwNUJBMzQyMTFFMUE1MEQ4NkNBOTU0MkJCQUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7poMa/AAAAHUlEQVR42mL8DwQMqIARSqOIM44qHFVIe4UAAQYAUI5P0QnNe/0AAAAASUVORK5CYII=" /><div class="text">Pause</div><div class="clear"></div></a></li>'+
                                                                //        '<li class="bar-item frame" data-item="frame"><a href="#"><img style="padding: 6px 8px 8px 0px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAwRTFEMDA1QTM0MzExRTE4REU2OTU4OUVCOUVCRUJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAwRTFEMDA2QTM0MzExRTE4REU2OTU4OUVCOUVCRUJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDBFMUQwMDNBMzQzMTFFMThERTY5NTg5RUI5RUJFQkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDBFMUQwMDRBMzQzMTFFMThERTY5NTg5RUI5RUJFQkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75G/w3AAAAV0lEQVR42mL8//8/Aw6AUwIGGHFpVlBQwKv5wYMHDEwMFAB0mwk6FegiuM0s2CTwORUZUORsFmSnoptMyEUU2Uyxs0kCQK8xDryzQYnkPzHqBpdmgAADAKzfJ6rbwMyYAAAAAElFTkSuQmCC" /><div class="text">Frame</div><div class="clear"></div></a></li>'+
                                                                //    '</div>'+

            Crafty.debugBar.template.styles.push('.clear {clear:both}\n'+
                                                    '#crafty-debug {position: fixed;left: 0;right: 0;height: 35px;margin: 0;z-index: 6000000;font: 12px Verdana, Arial, sans-serif;text-align: left;color: #FFF;bottom: 0;border-top: 1px solid #BBB;background: #3e3e3e; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSI2JSIgc3RvcC1jb2xvcj0iIzNlM2UzZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjclIiBzdG9wLWNvbG9yPSIjMjgyODI4IiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDxzdG9wIG9mZnNldD0iOTklIiBzdG9wLWNvbG9yPSIjMWYxZjFmIiBzdG9wLW9wYWNpdHk9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZ3JhZC11Y2dnLWdlbmVyYXRlZCkiIC8+Cjwvc3ZnPg==);background: -moz-linear-gradient(top,  #3e3e3e 6%, #282828 7%, #1f1f1f 99%); background: -webkit-gradient(linear, left top, left bottom, color-stop(6%,#3e3e3e), color-stop(7%,#282828), color-stop(99%,#1f1f1f)); background: -webkit-linear-gradient(top,  #3e3e3e 6%,#282828 7%,#1f1f1f 99%); background: -o-linear-gradient(top,  #3e3e3e 6%,#282828 7%,#1f1f1f 99%); background: -ms-linear-gradient(top,  #3e3e3e 6%,#282828 7%,#1f1f1f 99%); background: linear-gradient(top,  #3e3e3e 6%,#282828 7%,#1f1f1f 99%);}\n'+
                                                    '#crafty-debug ul.menu {list-style-type: none;padding: 0;margin: 0;}\n'+
                                                    '#crafty-debug ul.menu li{display: inline-block;white-space: nowrap;color: #2F2F2F;min-height: 28px;padding: 0px;float: left;cursor: default;}\n'+
                                                    '#crafty-debug ul.menu li:hover {box-shadow: rgba(0, 0, 0, 0.3) 0 0 5px;}\n'+
                                                    '#crafty-debug ul.menu li a{padding: 4px 10px 9px 10px;color: #FFF; display:block; text-decoration: none}\n'+
                                                    '#crafty-debug ul.menu li a img {float:left; padding-top: 4px;}\n'+
                                                    '#crafty-debug ul.menu li a .text {float:left; padding-top: 8px;}\n'+
                                                    '#crafty-debug ul.menu li.version{font-weight: bold; min-width: 110px;}\n'+
                                                    '#crafty-debug ul.menu .separator {float:left;height:35px;width:2px;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAjCAYAAAC+Rtu3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVFNkE1NjA2QTM0QTExRTFBQUIyRDY5NkYxQTk4Q0RBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVFNkE1NjA3QTM0QTExRTFBQUIyRDY5NkYxQTk4Q0RBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUU2QTU2MDRBMzRBMTFFMUFBQjJENjk2RjFBOThDREEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUU2QTU2MDVBMzRBMTFFMUFBQjJENjk2RjFBOThDREEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4M0cCrAAAAG0lEQVR42mLasWOH2v///9WYGKBglEEkAyDAAMfmBbi3ocYXAAAAAElFTkSuQmCC");}\n'+
                                                    '#crafty-debug ul.menu .frames {float:right}\n'+
                                                    '#crafty-debug ul.menu .close {cursor:pointer;float:right;width:10px; height:10px;}\n'+
                                                    '#crafty-debug .panel-box {display:none}\n'+
                                                    '#crafty-debug .panel-box .content .header {width: 100%;padding: 5px 0px 0px 10px;margin-bottom: 5px;float:left;color: #FFF; background: #282828; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIyJSIgc3RvcC1jb2xvcj0iIzI4MjgyOCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjFmMWYiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);background: -moz-linear-gradient(top,  #282828 2%, #1f1f1f 100%); /* FF3.6+ */background: -webkit-gradient(linear, left top, left bottom, color-stop(2%,#282828), color-stop(100%,#1f1f1f)); /* Chrome,Safari4+ */background: -webkit-linear-gradient(top,  #282828 2%,#1f1f1f 100%); /* Chrome10+,Safari5.1+ */background: -o-linear-gradient(top,  #282828 2%,#1f1f1f 100%); /* Opera 11.10+ */background: -ms-linear-gradient(top,  #282828 2%,#1f1f1f 100%); /* IE10+ */background: linear-gradient(top,  #282828 2%,#1f1f1f 100%);/* IE6-8 */margin-bottom: 0px;margin-right: 0px;}\n'+
                                                    '#crafty-debug .panel-box .content .header .separator{display: inline-block;height: 26px;width: 2px;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAaCAYAAACdM43SAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA01pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoMTMuMCAyMDEyMDMwNS5tLjQxNSAyMDEyLzAzLzA1OjIxOjAwOjAwKSAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyODM2RkFDQTM0QTExRTE5MkEyQzE5MjI3QUIyMEVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyODM2RkFEQTM0QTExRTE5MkEyQzE5MjI3QUIyMEVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI4MzZGQUFBMzRBMTFFMTkyQTJDMTkyMjdBQjIwRUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI4MzZGQUJBMzRBMTFFMTkyQTJDMTkyMjdBQjIwRUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6S54I8AAAAJ0lEQVR42mLYsWOH6v///1VZGBgYGIGYgYkBCoYHA+Sv/yAGQIABAP8oBqam0rxQAAAAAElFTkSuQmCC");margin-top: -5px;float: right}\n'+
                                                    '#crafty-debug .panel-box .btn{width:120px; height:15px;}\n'+
                                                    '#crafty-debug .panel-box .btn{text-align: center; color: #FFFFFF;padding:2px; margin:5px 0px; cursor:pointer;}\n'+
                                                    '#crafty-debug .panel-box .btn-red{border:1px solid #b90707; background: #d54848; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSI4JSIgc3RvcC1jb2xvcj0iI2Q1NDg0OCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjglIiBzdG9wLWNvbG9yPSIjY2UyMDIwIiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDxzdG9wIG9mZnNldD0iOTklIiBzdG9wLWNvbG9yPSIjY2EwZjBmIiBzdG9wLW9wYWNpdHk9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZ3JhZC11Y2dnLWdlbmVyYXRlZCkiIC8+Cjwvc3ZnPg==); background: -moz-linear-gradient(top,  #d54848 8%, #ce2020 8%, #ca0f0f 99%); background: -webkit-gradient(linear, left top, left bottom, color-stop(8%,#d54848), color-stop(8%,#ce2020), color-stop(99%,#ca0f0f)); background: -webkit-linear-gradient(top,  #d54848 8%,#ce2020 8%,#ca0f0f 99%); background: -o-linear-gradient(top,  #d54848 8%,#ce2020 8%,#ca0f0f 99%); background: -ms-linear-gradient(top,  #d54848 8%,#ce2020 8%,#ca0f0f 99%); background: linear-gradient(top,  #d54848 8%,#ce2020 8%,#ca0f0f 99%);}\n'+
                                                    '#crafty-debug .panel-box .btn-black{border:1px solid #000000; background: #505050; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSI2JSIgc3RvcC1jb2xvcj0iIzUwNTA1MCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjYlIiBzdG9wLWNvbG9yPSIjMjcyNzI3IiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzIwMjAyMCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2dyYWQtdWNnZy1nZW5lcmF0ZWQpIiAvPgo8L3N2Zz4=); background: -moz-linear-gradient(top,  #505050 6%, #272727 6%, #202020 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(6%,#505050), color-stop(6%,#272727), color-stop(100%,#202020)); background: -webkit-linear-gradient(top,  #505050 6%,#272727 6%,#202020 100%); background: -o-linear-gradient(top,  #505050 6%,#272727 6%,#202020 100%); background: -ms-linear-gradient(top,  #505050 6%,#272727 6%,#202020 100%); background: linear-gradient(top,  #505050 6%,#272727 6%,#202020 100%);}\n'+
                                                    '#crafty-debug .panel-box .btn-black.off{border:1px solid #616161; background: #bebebe; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSI3JSIgc3RvcC1jb2xvcj0iI2JlYmViZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjclIiBzdG9wLWNvbG9yPSIjYWVhZWFlIiBzdG9wLW9wYWNpdHk9IjEiLz4KICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2EzYTNhMyIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2dyYWQtdWNnZy1nZW5lcmF0ZWQpIiAvPgo8L3N2Zz4=); background: -moz-linear-gradient(top,  #bebebe 7%, #aeaeae 7%, #a3a3a3 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(7%,#bebebe), color-stop(7%,#aeaeae), color-stop(100%,#a3a3a3)); background: -webkit-linear-gradient(top,  #bebebe 7%,#aeaeae 7%,#a3a3a3 100%); background: -o-linear-gradient(top,  #bebebe 7%,#aeaeae 7%,#a3a3a3 100%); background: -ms-linear-gradient(top,  #bebebe 7%,#aeaeae 7%,#a3a3a3 100%); background: linear-gradient(top,  #bebebe 7+%,#aeaeae 7%,#a3a3a3 100%);}\n');

        },

        show : function(){
            this._generateTemplate();
        },

        /**
         * Register new DebugBar panel
         * @param  Object object Panel object
         * @return Object        Crafty.debugBar
         * 
         * Carfty.debugBar.registerPanel({
         *     'name' : Entities, //Required
         *     'image' : image/png;base64, //or false if don't exist
         *     'description' : 'Game entities',
         *     'styles' : '.clear {clear:both}', //css styles for panel
         *     'panelBox' : 'html for panel details box'
         * });
         */
        registerPanel: function(object) {
            Crafty.debugBar.panels[object.name] = {
                'name' : object.name,
                'image' : object.image,
                'description' : object.description,
                'styles' : object.styles
            }

            Crafty.debugBar._setPanel(object);
            Crafty.debugBar._setStyles(object);
            Crafty.debugBar._setPanelBox(object);
            

            return this;
        },

        _setPanel: function(panel) {
            var image = '';

            if (typeof panel.image != 'undefined') {
                image = '<img src="'+panel.image+'" />';
            }

            Crafty.debugBar.template.panels.push('<li class="bar-item '+panel.name.toLowerCase()+'" data-item="'+panel.name.toLowerCase()+'">'+
                                                        '<a href="#">'+
                                                            image+
                                                            '<div class="text">'+panel.name+'</div>'+
                                                            '<div class="clear"></div>'+
                                                        '</a>'+
                                                    '</li>'+
                                                    '<div class="separator"></div>');
            return this;
        },

        _setStyles: function(panel) {
            if (typeof panel.styles != 'undefined') {
                Crafty.debugBar.template.styles.push(panel.styles);
            }
            
            return this;
        },

        /**
         * proposed structure of panel.panelBox:
         * 
         * <div id="entities-box" class="panel-box">
         *     <div class="content">
         *        <div class="properties">
         *            <div class="header">
         *                PROPERTIES
         *                <div class="separator"></div>
         *            </div>
         *            <div class="content"></div>
         *        </div>
         *     </div>
         * </div>
         */
        _setPanelBox : function(panel) {
            if (typeof panel.panelBox != 'undefined') {
                Crafty.debugBar.template.panelBoxes.push(panel.panelBox);
            }

            return this;
        },

        _generateTemplate : function(){
            var styles,
                template;

            styles = '<style>'+Crafty.debugBar.template.styles.join('')+'</style>';
            $('head').append(styles);

            template = '<div id="crafty-debug">'+
                                '<ul class="menu">'+
                                    Crafty.debugBar.template.panels.join('')+
                                '</ul>'+
                                Crafty.debugBar.template.panelBoxes.join('')+
                            '</div>';

            $('body').append(template);
        }
    }
});

Crafty.debugBar.init();