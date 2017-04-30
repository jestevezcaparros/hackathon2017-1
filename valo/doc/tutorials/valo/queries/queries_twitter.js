from historical /streams/demo/twitter/tweets
-- select tweet.created_at, tweet.user.created_at, contributor.app_name, contributor.app_owner_twitter_name, tweet.text
select tweet.user.followers_count as fol, tweet.lang as lang, tweet.source as app
group by app
select app, count() as C, avg(fol) as F
-- select bivar(C,F)
order by F
