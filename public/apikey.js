function getData(){
    fetch("https://soccer.sportmonks.com/api/v2.0/fixtures/date/2022-02-02?api_token=r1JI1KF9JTTSAtVpMWpUH2PDV1T40G1H1FU2cvYvRo4NiarhHUl214fjOnwx", {
        "method" : "GET",
        "headers" : {
            "x-RapidAPI-key":'r1JI1KF9JTTSAtVpMWpUH2PDV1T40G1H1FU2cvYvRo4NiarhHUl214fjOnwx',
            "x-RapidAPI-host":'https://soccer.sportmonks.com/api/v2.0/fixtures/date/2022-02-02'
        }
    })
}