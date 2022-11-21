import pandas as pd

df = pd.read_csv("marine-species_fig-3.csv")
snowcrab = pd.read_csv("CRAB_CPUE_FOR_WEB.csv")
print(df)
print(df.columns)

print(df["LatitudeSnowcrab"])

print(snowcrab)
print(snowcrab.columns)
print(len(snowcrab))