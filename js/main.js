$(document).ready(function () {
    var routes = getBicycleRoutes();

    $('#chooseRoutes').submit(function (event) {
        try {

            var filteredRoutes = routes.filter(getFilteredRoutes(bindRouteFilter()));
            initMapTest(filteredRoutes);
        } catch (e) {
            console.log(e);
        }
        event.preventDefault();
    });

    //var table = $('#resultTable').DataTable();

    //$('#resultTable tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        table.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //});

    //$('#button').click(function () {
    //    table.row('.selected').remove().draw(false);
    //});
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.5087, lng: -73.554 },
        zoom: 10
    });
}

function initMapTest(tempObject) {
    var image = "http://maps.google.com/mapfiles/ms/micons/blue.png";
    var routes = getBicycleRoutes();
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.5087, lng: -73.554 },
        zoom: 10
    });
    var value = routes[0];
    map.data.addGeoJson(value);
    bindDataTable(tempObject);
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
    var value = routeFilter;
  
    return function (element) {
        var value2 = element;
        return element.properties.TYPE_VOIE == routeFilter.WayType &&
            element.properties.TYPE_VOIE2 == routeFilter.SpecialWayType &&
            element.properties.NBR_VOIE == routeFilter.NumberLane &&
            element.properties.SEPARATEUR == routeFilter.Separator &&
            element.properties.SAISONS4 == routeFilter.AllSeason ;
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
        data: flattenedRoutes,
        columns: [
            { title: "Id" },
            { title: "Longueur" },
            { title: "Nome arrive" }
        ]
    });
}
