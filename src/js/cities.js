// Test data
exports.data = [
    {
        "city":"Shanghai",
        "population":24150000,
        "definition":"Direct-controlled municipality",
        "area_km2":6340.5,
        "density_km2":3809,
        "country":"China"
    },
    {
        "city":"Karachi",
        "population":23500000,
        "definition":"City District Government",
        "area_km2":3527,
        "density_km2":6663,
        "country":"Pakistan"
    },
    {
        "city":"Beijing",
        "population":21150000,
        "definition":"Direct-controlled municipality",
        "area_km2":16410.54,
        "density_km2":1289,
        "country":"China"
    },
    {
        "city":"Delhi",
        "population":17838842,
        "definition":"National Capital Region",
        "area_km2":1484.0,
        "density_km2":7845.9,
        "country":"India"
    },
    {
        "city":"Lagos",
        "population":17060307,
        "definition":"Metropolitan City",
        "area_km2":999.58,
        "density_km2":17068,
        "country":"Nigeria"
    },
    {
        "city":"Istanbul",
        "population":14160467,
        "definition":"Metropolitan Municipality-Province",
        "area_km2":2189.79,
        "density_km2":6467,
        "country":"Turkey"
    },
    {
        "city":"Guangzhou",
        "population":12700800,
        "definition":"Sub-Provincial City",
        "area_km2":3843.43,
        "density_km2":3305,
        "country":"China"
    },
    {
        "city":"Mumbai",
        "population":12655220,
        "definition":"Municipal Corporation",
        "area_km2":603.4,
        "density_km2":20680,
        "country":"India"
    },
    {
        "city":"Moscow",
        "population":12111194,
        "definition":"Federal City",
        "area_km2":2510.12,
        "density_km2":4825,
        "country":"Russia"
    },
    {
        "city":"Dhaka",
        "population":12043977,
        "definition":"City Corporation",
        "area_km2":302.92,
        "density_km2":39760,
        "country":"Bangladesh"
    },
    {
        "city":"Cairo",
        "population":11922949,
        "definition":"Governorate",
        "area_km2":3085.1,
        "density_km2":3864,
        "country":"Egypt"
    },
    {
        "city":"São Paulo",
        "population":11895893,
        "definition":"Municipality City",
        "area_km2":1521.11,
        "density_km2":7762.3,
        "country":"Brazil"
    },
    {
        "city":"Lahore",
        "population":11318745,
        "definition":"City District",
        "area_km2":1772,
        "density_km2":3566,
        "country":"Pakistan"
    },
    {
        "city":"Shenzhen",
        "population":10467400,
        "definition":"Sub-Provincial City",
        "area_km2":1991.64,
        "density_km2":5255,
        "country":"China"
    },
    {
        "city":"Seoul",
        "population":10388055,
        "definition":"Special City",
        "area_km2":605.21,
        "density_km2":17164,
        "country":"South Korea"
    },
    {
        "city":"Bangalore",
        "population":10178146,
        "area_km2":709.5,
        "density_km2":11876,
        "country":"India"
    },
    {
        "city":"Jakarta",
        "population":9988329,
        "definition":"Capital Region - Five Kota",
        "area_km2":664.12,
        "density_km2":15040,
        "country":"Indonesia"
    },
    {
        "city":"Kinshasa",
        "population":9735000,
        "definition":"Metropolitan Municipality-Province",
        "area_km2":1117.62,
        "density_km2":8710,
        "country":"Democratic Republic of the Congo"
    },
    {
        "city":"Tianjin",
        "population":9341844,
        "definition":"Direct-controlled municipality",
        "area_km2":4037,
        "density_km2":2314,
        "country":"China"
    },
    {
        "city":"Tokyo",
        "population":9071577,
        "definition":"23 Special Wards (tokubetsu-ku)",
        "area_km2":622.99,
        "density_km2":14562,
        "country":"Japan"
    }
];

exports.schema = [
    {
        'id': 'city',
        'name': 'City',
        'type': 'string'
    },
    {
        'id': 'population',
        'name': 'Population',
        'type': 'number'
    },
    {
        'id': 'definition',
        'name': 'Definition',
        'type': 'string'
    },
    {
        'id': 'area_km2',
        'name': 'Area (km&sup2;)',
        'type': 'number'
    },
    {
        'id': 'density_km2',
        'name': 'Population density (km&sup2;)',
        'type': 'number'
    },
    {
        'id': 'country',
        'name': 'Country',
        'type': 'enum'
    }
]
