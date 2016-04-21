$(document).ready(function () {
    var routes = getBicycleRoutes();

    $('#chooseRoutes').submit(function (event) {
        var routeFilter = new Object();
        routeFilter.WayType = $('input[name=optWayType]:checked').val();
        routeFilter.SpecialWayType = $('input[name=optSpecWayType]:checked').val();
        routeFilter.RouteLength = $('#routeLength').val();
        routeFilter.NumberLane = $('input[name=optNumberLane]:checked').val();
        routeFilter.Separator = $('input[name=optSeparator]:checked').val();
        routeFilter.AllSeason = $('input[name=optAllSeason]:checked').val();
        console.log(routes.filter(getFilteredRoutes(routeFilter)));
        event.preventDefault();
    });
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 45.5087, lng: -73.554 },
        zoom: 10
    });
}

function getFilteredRoutes(routeFilter) {
    return function (element) {
        return element.properties.TYPE_VOIE === routeFilter.WayType &&
            element.properties.TYPE_VOIE2 === routeFilter.SpecialWayType &&
            element.properties.NBR_VOIE === routeFilter.NumberLane &&
            element.properties.SEPARATEUR === routeFilter.Separator &&
            element.properties.OUI === routeFilter.AllSeason;
    }
}