import pandas as pd


fish_1 = pd.read_csv("FishCounts (1).csv")
fish_2 = pd.read_csv("FishCounts.csv")
fish = pd.merge(fish_1, fish_2, on = ['year','count_date',
                 'count_location', 'count_location_ID'], how = 'inner')
print(fish_1)
print(fish_2)
print(fish)
fish.to_csv('fish.csv')