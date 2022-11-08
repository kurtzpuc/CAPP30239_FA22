import pandas as pd


fish_1 = pd.read_csv("FishCounts (1).csv")
fish_2 = pd.read_csv("FishCounts.csv")
fish = fish_1.merge(fish_2)