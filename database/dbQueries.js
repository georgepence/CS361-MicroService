const fetchFromCache = 'select `RandomUrls`.`url` from `RandomUrls` where ' +
    '`RandomUrls`.`id` =  (select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`);'

let deleteFromCache = 'delete from `RandomUrls` where `RandomUrls`.`id` = ' +
    '(select min(`RandomUrls`.`id`) as `oldest` from `RandomUrls`);'

exports.fetchFromCache = fetchFromCache
exports.deleteFromCache = deleteFromCache