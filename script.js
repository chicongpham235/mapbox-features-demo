mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNkb2VocmluZ3RvbyIsImEiOiJjaWthYXJzcG0wa2YzdmNtNDdnYXlnODkzIn0.F4Afw7z8T8EHwfgShElbUg';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 5 // starting zoom
});

const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');



function selectLayer() {
    var toggleableLayerIds = ['points', 'airport', 'urban-areas-fill'];
    layers = map.getStyle().layers;
    layerListDropDown = document.getElementById('mapbox-layer');
    for (var key in layers) {
        let layerId = layers[key].id;
        for (let i = 0; i < toggleableLayerIds.length; i++) {
            if (layerId === toggleableLayerIds[i]) {
                const layerItem = document.createElement("a");
                layerItem.href = "#";
                layerItem.className = "dropdown-item active";
                layerItem.textContent = layerId;
                layerItem.onclick = function(e) {
                    const clickedLayer = this.textContent;
                    e.preventDefault();
                    e.stopPropagation();
                    const visibility = map.getLayoutProperty(
                        clickedLayer,
                        'visibility'
                    );
                    if (visibility === 'visible') {
                        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                        this.className = 'dropdown-item';
                    } else {
                        this.className = 'dropdown-item active';
                        map.setLayoutProperty(
                            clickedLayer,
                            'visibility',
                            'visible'
                        );
                    }
                };

                // layerItem.innerHTML = `
                //     <a href="#" class="dropdown-item" onclick="toggleLayer(this)">${layerId}</a>
                //     `
                layerListDropDown.appendChild(layerItem);

            }
        }

    }
    // console.log(layers);
    // console.log(layerListDropDown)

}

function layerListItemShow() {
    moveLayerItem = document.getElementById("layerList");
    for (layer of map.getStyle().layers) {
        const layerItemListGroup = document.createElement("li");
        layerItemListGroup.id = layer.id + "1";
        layerItemListGroup.className = "list-group-item";
        layerItemListGroup.innerHTML = `
        ${layer.id}
        <a style="position:absolute; right:2%" href="#" onclick="moveupLayer(this)">UP</a>
        `
        moveLayerItem.appendChild(layerItemListGroup);

    }
    for (i = 0; i < moveLayerItem.childNodes.length; i++) {
        moveLayerItem.insertBefore(moveLayerItem.childNodes[i], moveLayerItem.firstChild);
    }

}

function updateLayerListItemShow() {
    layerName = document.getElementById('layerName').value;
    layerListItem = document.getElementById('layerList');
    const layerItemListGroup = document.createElement("li");
    layerItemListGroup.id = layerName + "1";
    layerItemListGroup.className = "list-group-item";
    layerItemListGroup.innerHTML = `
    ${layerName}
    <a style="position:absolute; right:2%" href="#" onclick="moveupLayer(this)">UP</a>
    `
    layerListItem.insertBefore(layerItemListGroup, layerListItem.firstChild);
}

function moveupLayer(e) {
    layerMoveUpName = e.parentElement.id.slice(0, -1);
    // console.log(layerMoveUpName);
    layerListItem = e.parentElement.parentElement;
    layers = map.getStyle().layers;
    for (var key in layers) {
        if (key < layers.length - 1) {
            if (layers[key].id === layerMoveUpName) {
                // console.log(e.parentElement);
                // console.log(layerMoveUpName);
                // console.log(document.getElementById(layers[parseInt(key) + 1].id));
                map.moveLayer(layers[parseInt(key) + 1].id, layerMoveUpName);
                // console.log();
                layerListItem.insertBefore(e.parentElement, document.getElementById(layers[parseInt(key) + 1].id + "1"));
            }
        }
    }
    // map.moveLayer('points', 'airport');
}

function updateLayerList() {
    layerName = document.getElementById('layerName').value;
    layerListDropDown = document.getElementById('mapbox-layer');
    const layerItemUpdate = document.createElement("a");
    layerItemUpdate.href = '#';
    layerItemUpdate.className = 'dropdown-item active';
    layerItemUpdate.textContent = layerName;
    layerItemUpdate.onclick = function(e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();
        const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
        );
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = 'dropdown-item';
        } else {
            this.className = 'dropdown-item active';
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
    };
    layerListDropDown.appendChild(layerItemUpdate);

}

function selectSource() {
    sources = map.getStyle().sources;
    sourceListDropDown = document.getElementById('mapbox-source');
    for (var key in sources) {
        let sourceName = key;
        const sourceItem = document.createElement("li");
        sourceItem.innerHTML = `
        <a href="#" class="dropdown-item active" id="${sourceName}">${sourceName}</a>
        `
            // const sourceItem = document.createElement("a");
            // sourceItem.href = "#";
            // sourceItem.className = "dropdown-item active";
            // sourceItem.textContent = sourceName;
        sourceListDropDown.appendChild(sourceItem);
    }
}
var sourceToggleList = ['points', 'airport', 'urban-areas', 'composite'];

function updateSourceList() {
    sourceListDropDown = document.getElementById('mapbox-source');
    sources = map.getStyle().sources;
    var source = [];
    for (var key in sources) {
        source.push(key);
    }
    diff = source.filter(x => !sourceToggleList.includes(x));
    for (let i = 0; i < diff.length; i++) {
        let sourceName2 = diff[i];
        const sourceItem = document.createElement("li");
        sourceItem.innerHTML = `
        <a href="#" data-toggle="modal" data-target="#myModal" class="dropdown-item active" id="${sourceName2}" onclick="addLayerwithJSON(this)">${sourceName2}</a>
        `
        sourceListDropDown.appendChild(sourceItem);
        sourceToggleList.push(sourceName2);
    }
}

function addLayerwithJSON(e) {
    modalSourceName = document.getElementById('sourceName');
    modalSourceName.innerHTML = e.id;
}


const types = ['fill', 'line', 'background', 'symbol', 'raster', 'circle', 'fill-extrusion', 'heatmap', 'hillshade', 'sky']
layerType = document.getElementById('layerType');
for (let i = 0; i < types.length; i++) {
    const layerTypeList = document.createElement("option");
    layerTypeList.value = types[i];
    layerTypeList.id = types[i];
    layerTypeList.textContent = types[i];
    layerType.appendChild(layerTypeList);
}

function addCustomLayer() {
    // sourceNameAdd = addLayerwithJSON(e).modalSourceName;
    // console.log(sourceNameAdd);
    modalSourceName = document.getElementById('sourceName').textContent;
    layerName = document.getElementById('layerName').value;
    layerPaintColor = document.getElementById('layerPaintColor').value;
    layerPaintOpacity = document.getElementById('layerPaintOpacity').value;
    layerPaintWidth = document.getElementById('layerPaintWidth').value;
    layerTypeValue = layerType.value;
    if (layerTypeValue === 'fill') {
        var geoJsons = {
            'id': layerName,
            'type': layerTypeValue,
            'source': modalSourceName,
            'layout': {},
            'paint': {
                'fill-color': layerPaintColor,
                'fill-opacity': parseFloat(layerPaintOpacity),
            }
        }
    } else if (layerTypeValue === 'line') {
        var geoJsons = {
            'id': layerName,
            'type': layerTypeValue,
            'source': modalSourceName,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': layerPaintColor,
                'line-width': parseInt(layerPaintWidth),
            }
        }
    }

    map.addLayer(geoJsons);

    updateLayerList();
    updateLayerListItemShow();

    geoJsons = {};

    document.getElementById('layerName').value = '';
    document.getElementById('layerName').value = '';
    document.getElementById('layerPaintColor').value = '';
    document.getElementById('layerPaintOpacity').value = '';
    document.getElementById('layerPaintWidth').value = '';

}

function addMainLayer() {
    const layers = map.getStyle().layers;
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }
    map.addSource('urban-areas', {
        'type': 'geojson',
        'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson'
    });
    map.addLayer({
            'id': 'urban-areas-fill',
            'type': 'fill',
            'source': 'urban-areas',
            'layout': {},
            'paint': {
                'fill-color': '#f08',
                'fill-opacity': 0.4
            }
            // This is the important part of this example: the addLayer
            // method takes 2 arguments: the layer as an object, and a string
            // representing another layer's name. If the other layer
            // exists in the style already, the new layer will be positioned
            // right before that layer in the stack, making it possible to put
            // 'overlays' anywhere in the layer stack.
            // Insert the layer beneath the first symbol layer.
        },
        // firstSymbolId
    );
    map.addLayer({
        "id": "airport",
        "source": {
            "type": "vector",
            "url": "mapbox://mapbox.04w69w5j"
        },
        "source-layer": "ne_10m_airports",
        "type": "symbol",
        "layout": {
            "visibility": "visible",
            "icon-image": "airport-15",
            "icon-padding": 0,
            "icon-allow-overlap": true
        }
    });
    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-2.81361, 36.77271]
                    },
                    "properties": {
                        "title": "Mapbox DC",
                        "icon": "monument"
                    }
                }, {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-2.81361, 36.77271]
                    },
                    "properties": {
                        "title": "Mapbox SF",
                        "icon": "harbor"
                    }
                }]
            }
        },
        "layout": {
            "visibility": "visible",
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
}

function selectMapboxStyle() {
    map.once("styledata", addMainLayer);
    const layer1 = document.getElementById('mapbox-style');
    const layerId = layer1.options[layer1.selectedIndex].id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
    // console.log(layerId)
};

function importData() {
    sourceName1 = document.getElementById('name').value;
    sourceData1 = document.getElementById('content').value;
    if (!sourceName1 || !sourceData1) {
        return
    }
    const sourceDataJSON = JSON.parse(sourceData1);
    let sourceDataInput = {
        type: 'geojson',
        data: sourceDataJSON,
    }
    document.getElementById('name').value = '';
    document.getElementById('content').value = '';
    map.addSource(sourceName1, sourceDataInput);
    console.log(map.getStyle().sources);
    updateSourceList();
}

map.on('load', function() {
    addMainLayer();
    selectSource();
    selectLayer();
    layerListItemShow();

    map.on('idle', () => {

    });

    slider.addEventListener('input', (e) => {
        layersAll = map.getStyle().layers;
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        for (var layer of layersAll) {
            if (layer.type == 'background') {
                map.setPaintProperty(
                    layer.id,
                    'background-opacity',
                    parseInt(e.target.value, 10) / 100
                )
            } else if (layer.type == 'line') {
                map.setPaintProperty(
                    layer.id,
                    'line-opacity',
                    parseInt(e.target.value, 10) / 100
                )
            } else if (layer.type == 'fill') {
                map.setPaintProperty(
                    layer.id,
                    'fill-opacity',
                    parseInt(e.target.value, 10) / 100
                );
                // console.log(layer);
            } else if (layer.type == 'symbol') {
                // console.log(layer)
                map.setPaintProperty(
                    layer.id,
                    'icon-opacity',
                    parseInt(e.target.value, 10) / 100
                );
                map.setPaintProperty(
                    layer.id,
                    'text-opacity',
                    parseInt(e.target.value, 10) / 100
                )
            }
        }
        // Value indicator
        sliderValue.textContent = e.target.value + '%';
    });
    console.log(map.getStyle().layers);

})