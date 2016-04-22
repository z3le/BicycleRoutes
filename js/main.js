var routes = getBicycleRoutes();

$(document).ready(function () {
    $('#chooseRoutes').submit(function (event) {
        try {
            var filteredRoutes = routes.filter(getFilteredRoutes(bindRouteFilter()));
            bindDataTable(filteredRoutes);
        } catch (e) {
            console.log(e);
        }
        event.preventDefault();
    });
});

function initMap() {
    var myLatLng = { lat: 45.5087, lng: -73.554 }

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: myLatLng
    });
}

function initMapTest(chosenRouteId) {
    var chosenRoute = routes.filter(getRouteById(chosenRouteId));
    var locations = chosenRoute[0].geometry.coordinates;

     var map = new google.maps.Map(document.getElementById('map'), {
         center: { lat: locations[0][1], lng: locations[0][0] },
         zoom: 14
     });

     for (i = 0; i < locations.length; i++) {
         marker = new google.maps.Marker({
             position: new google.maps.LatLng(locations[i][1], locations[i][0]),
             map: map
         });
     }
}

function bindRouteFilter() {
    var routeFilter = new Object();
    routeFilter.WayType = $('input[name=optWayType]:checked').val();
    routeFilter.SpecialWayType = $('input[name=optSpecWayType]:checked').val();
    if (routeFilter.SpecialWayType == undefined) {
        routeFilter.SpecialWayType = 0;
    }
    routeFilter.RouteLength = $('#routeLength').val();
    if (routeFilter.RouteLength == undefined) {
        routeFilter.RouteLength = 0;
    }
    routeFilter.NumberLane = $('input[name=optNumberLane]:checked').val();
    routeFilter.Separator = $('input[name=optSeparator]:checked').val();
    if (routeFilter.Separator == undefined) {
        routeFilter.Separator = null;
    }
    routeFilter.AllSeason = $('input[name=optAllSeason]:checked').val();
    console.log(routeFilter);
    return routeFilter;
}

function getFilteredRoutes(routeFilter) {
    return function (element) {
        return element.properties.TYPE_VOIE == routeFilter.WayType &&
            element.properties.TYPE_VOIE2 == routeFilter.SpecialWayType &&
            element.properties.NBR_VOIE == routeFilter.NumberLane &&
            element.properties.SEPARATEUR == routeFilter.Separator &&
            element.properties.SAISONS4 == routeFilter.AllSeason;
    }
}

function getRouteById(routeId) {
    return function (element) {
        return element.properties.ID == routeId;
    }
}

function bindDataTable(tempObject) {
    var flattenedRoutes = new Array();
    var selected = false;

    for (var i = 0; i < tempObject.length; i++) {
        var currentObj = new Array();
        currentObj.push(tempObject[i].properties.ID,
            tempObject[i].properties.LONGUEUR,
            tempObject[i].properties.NOM_ARR_VI)
        flattenedRoutes.push(currentObj);
    }

    var value = JSON.stringify(flattenedRoutes);
    $('#resultTable').DataTable({
        "searching": false,
        destroy: true,
        data: flattenedRoutes,
        columns: [
            { title: "Id" },
            { title: "Longueur" },
            { title: "Nome arrive" }
        ],
        columnDefs: [
           {
               "targets": [0],
               "visible": false
           }
        ]
    });

    $('#resultTable tbody').on('click', 'tr', function () {
        var table = $('#resultTable').DataTable();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var data = table.row(this).data();
        initMapTest(data[0]);
    });
}
